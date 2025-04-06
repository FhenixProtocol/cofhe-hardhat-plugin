import chalk from "chalk";
import { extendConfig, task, types } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";

import { localcofheFundAccount } from "./common";
import { TASK_COFHE_USE_FAUCET } from "./const";
import { deployMocks } from "./deploy-mocks";
import { TASK_NODE, TASK_TEST } from "hardhat/builtin-tasks/task-names";

declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    cofhe?: {
      logMocks?: boolean;
    };
  }

  interface HardhatConfig {
    cofhe: {
      logMocks: boolean;
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
      url: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia.publicnode.com",
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
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
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
    logMocks: userConfig.cofhe?.logMocks ?? false,
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

type DeployMocksArgs = {
  deployTestBed?: boolean;
  logMocks?: boolean;
};

task("deploy-mocks", "Deploys the mock contracts on the Hardhat network")
  .addOptionalParam(
    "deployTestBed",
    "Whether to deploy the test bed",
    true,
    types.boolean,
  )
  .addOptionalParam(
    "logMocks",
    "Whether to log mock operations",
    undefined,
    types.boolean,
  )
  .setAction(async ({ deployTestBed, logMocks }: DeployMocksArgs, hre) => {
    await deployMocks(hre, {
      deployTestBed: deployTestBed ?? true,
      logOps: logMocks ?? hre.config.cofhe.logMocks ?? true,
    });
  });

task(TASK_TEST, "Deploy mock contracts on hardhat").setAction(
  async ({}, hre, runSuper) => {
    await deployMocks(hre, {
      deployTestBed: true,
      logOps: hre.config.cofhe.logMocks,
    });
    return runSuper();
  },
);

task(TASK_NODE, "Deploy mock contracts on hardhat").setAction(
  async ({}, hre, runSuper) => {
    await deployMocks(hre, {
      deployTestBed: true,
      logOps: hre.config.cofhe.logMocks,
    });
    return runSuper();
  },
);

// MOCK UTILS

export * from "./mockUtils";
export * from "./networkUtils";
export * from "./result";
export * from "./common";
