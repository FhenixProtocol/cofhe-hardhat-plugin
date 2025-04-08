import chalk from "chalk";
import { extendConfig, task, types } from "hardhat/config";

import { localcofheFundAccount } from "./common";
import {
  TASK_COFHE_MOCKS_DEPLOY,
  TASK_COFHE_MOCKS_SET_LOG_OPS,
  TASK_COFHE_USE_FAUCET,
} from "./const";
import { TASK_TEST, TASK_NODE } from "hardhat/builtin-tasks/task-names";
import { deployMocks } from "./deploy-mocks";
import { mock_setLogging } from "./mock-logs";

declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    cofhe?: {
      logMocks?: boolean;
      gasWarning?: boolean;
    };
  }

  interface HardhatConfig {
    cofhe: {
      logMocks: boolean;
      gasWarning: boolean;
    };
  }
}

extendConfig((config, userConfig) => {
  // Allow users to override the localcofhe network config
  if (userConfig.networks && userConfig.networks.localcofhe) {
    return;
  }

  // Default config
  config.networks.localcofhe = {
    gas: "auto",
    gasMultiplier: 1.2,
    gasPrice: "auto",
    timeout: 10_000,
    httpHeaders: {},
    url: "http://127.0.0.1:42069",
    accounts: [
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
      "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
      "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    ],
  };

  // Only add Sepolia config if user hasn't defined it
  if (!userConfig.networks?.["eth-sepolia"]) {
    config.networks["eth-sepolia"] = {
      url:
        process.env.SEPOLIA_RPC_URL ||
        "https://ethereum-sepolia.publicnode.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gas: "auto",
      gasMultiplier: 1.2,
      gasPrice: "auto",
      timeout: 60_000,
      httpHeaders: {},
    };
  }

  // Only add Arbitrum Sepolia config if user hasn't defined it
  if (!userConfig.networks?.["arb-sepolia"]) {
    config.networks["arb-sepolia"] = {
      url:
        process.env.ARBITRUM_SEPOLIA_RPC_URL ||
        "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 421614,
      gas: "auto",
      gasMultiplier: 1.2,
      gasPrice: "auto",
      timeout: 60_000,
      httpHeaders: {},
    };
  }

  // Add cofhe config
  config.cofhe = {
    logMocks: userConfig.cofhe?.logMocks ?? true,
    gasWarning: userConfig.cofhe?.gasWarning ?? true,
  };
});

type UseFaucetArgs = {
  address?: string;
};

task(TASK_COFHE_USE_FAUCET, "Fund an account from the funder")
  .addOptionalParam("address", "Address to fund", undefined, types.string)
  .setAction(async ({ address }: UseFaucetArgs, hre) => {
    const { network } = hre;
    const { name: networkName } = network;

    if (networkName !== "localcofhe") {
      console.info(
        chalk.yellow(`Programmatic faucet only supported for localcofhe`),
      );
      return;
    }

    if (!address) {
      console.info(chalk.red(`Failed to get address to fund`));
      return;
    }

    console.info(chalk.green(`Getting funds from faucet for ${address}`));

    try {
      await localcofheFundAccount(hre, address);
    } catch (e) {
      console.info(
        chalk.red(`failed to get funds from localcofhe for ${address}: ${e}`),
      );
    }
  });

// DEPLOY TASKS

type DeployMocksArgs = {
  deployTestBed?: boolean;
  logMocks?: boolean;
};

task(
  TASK_COFHE_MOCKS_DEPLOY,
  "Deploys the mock contracts on the Hardhat network",
)
  .addOptionalParam(
    "deployTestBed",
    "Whether to deploy the test bed",
    true,
    types.boolean,
  )
  .addOptionalParam(
    "logMocks",
    "Whether to log mock operations",
    true,
    types.boolean,
  )
  .setAction(async ({ deployTestBed, logMocks }: DeployMocksArgs, hre) => {
    await deployMocks(hre, {
      deployTestBed: deployTestBed ?? true,
      logOps: logMocks ?? hre.config.cofhe.logMocks ?? true,
      gasWarning: hre.config.cofhe.gasWarning ?? true,
    });
  });

task(TASK_TEST, "Deploy mock contracts on hardhat").setAction(
  async ({}, hre, runSuper) => {
    await deployMocks(hre, {
      deployTestBed: true,
      logOps: hre.config.cofhe.logMocks,
      gasWarning: hre.config.cofhe.gasWarning ?? true,
    });
    return runSuper();
  },
);

task(TASK_NODE, "Deploy mock contracts on hardhat").setAction(
  async ({}, hre, runSuper) => {
    await deployMocks(hre, {
      deployTestBed: true,
      logOps: hre.config.cofhe.logMocks,
      gasWarning: hre.config.cofhe.gasWarning ?? true,
    });
    return runSuper();
  },
);

// SET LOG OPS

task(TASK_COFHE_MOCKS_SET_LOG_OPS, "Set logging for the Mock CoFHE contracts")
  .addParam("enable", "Whether to enable logging", false, types.boolean)
  .addOptionalParam(
    "closureName",
    "The name of the function to log within (optional)",
    undefined,
    types.string,
  )
  .setAction(async ({ enable, closureName }, hre) => {
    await mock_setLogging(hre, enable, closureName);
  });

// MOCK UTILS

export * from "./mockUtils";
export * from "./networkUtils";
export * from "./result";
export * from "./common";
export * from "./mock-logs";
export * from "./deploy-mocks";
