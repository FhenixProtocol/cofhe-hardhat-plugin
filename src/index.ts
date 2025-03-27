import chalk from "chalk";
import { HDNodeWallet, Wallet } from "ethers";
import { extendConfig, task, types } from "hardhat/config";
import { HttpNetworkConfig, HttpNetworkHDAccountsConfig } from "hardhat/types";

import { getFunds } from "./common";
import { TASK_COFHE_USE_FAUCET } from "./const";
import { deployMocks } from "./deploy-mocks";
import { TASK_TEST } from "hardhat/builtin-tasks/task-names";

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
    accounts: {
      // TODO: Update this to use the default 4 anvil private keys
      // - architect 2025-03-27
      mnemonic:
        "demand hotel mass rally sphere tiger measure sick spoon evoke fashion comfort",
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 20,
      accountsBalance: "10000000000000000000",
      passphrase: "",
    },
  };
});

type UseFaucetArgs = {
  address?: string;
  account?: number;
  url?: string;
};

// Task to fund an account from the faucet
task(TASK_COFHE_USE_FAUCET, "Fund an account from the faucet")
  .addOptionalParam("address", "Address to fund", undefined, types.string)
  .addOptionalParam("account", "account number to fund", 0, types.int)
  .addOptionalParam(
    "url",
    "Optional Faucet URL",
    // TODO: Check with team to see what the updated faucet url for localcofhe host chain is
    // - architect 2025-03-27
    "http://localhost:3000",
    types.string,
  )
  .setAction(async ({ address, account, url }: UseFaucetArgs, { network }) => {
    const { name: networkName, config: networkConfig } = network;

    if (networkName !== "localfhenix" && !url) {
      console.info(
        chalk.yellow(
          `Programmatic faucet only supported for localfhenix. Please provide a faucet url, or use the public testnet faucet at https://faucet.fhenix.zone`,
        ),
      );
      return;
    }

    let foundAddress = "";
    if (Object(networkConfig).hasOwnProperty("url")) {
      const httpNetworkConfig = networkConfig as HttpNetworkConfig;
      if (httpNetworkConfig.accounts === "remote") {
        console.log(chalk.yellow(`Remote network detected, cannot use faucet`));
        return;
      } else if (
        // TODO: Update this to use private keys instead of mnemonic (dep: localcofhe network config mnemonic -> pkey)
        // - architect 2025-03-27
        Object(httpNetworkConfig.accounts).hasOwnProperty("mnemonic")
      ) {
        const networkObject = httpNetworkConfig.accounts as HttpNetworkHDAccountsConfig;

        const mnemonic = networkObject.mnemonic;

        const path = `${networkObject.path || "m/44'/60'/0'/0"}/${
          account || networkObject.initialIndex || 0
        }`;

        const wallet = HDNodeWallet.fromPhrase(mnemonic, "", path);

        foundAddress = wallet.address;
      } else {
        // NOTE: This handles the privatekey case, maybe don't need mnemonic case
        // - architect 2025-03-27
        const accounts = httpNetworkConfig.accounts as string[];
        const privateKey = accounts[account || 0];
        const wallet = new Wallet(privateKey);
        foundAddress = wallet.address;
      }
    }

    const myAddress = address || foundAddress;

    if (!myAddress) {
      console.info(chalk.red(`Failed to get address from hardhat`));
      return;
    }

    console.info(chalk.green(`Getting funds from faucet for ${myAddress}`));

    try {
      await getFunds(myAddress, url);
      console.info(chalk.green(`Success!`));
    } catch (e) {
      console.info(
        chalk.red(
          `failed to get funds from faucet @ ${url} for ${address}: ${e}`,
        ),
      );
    }
  });

task(
  "deploy-mocks",
  "Deploys the mock contracts on the Hardhat network",
).setAction(async (taskArgs, hre) => {
  await deployMocks(hre);
});

task(TASK_TEST, "Deploy mock contracts on hardhat").setAction(
  async ({}, hre, runSuper) => {
    await deployMocks(hre);
    return runSuper();
  },
);
