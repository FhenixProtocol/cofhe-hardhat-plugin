"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const ethers_1 = require("ethers");
const config_1 = require("hardhat/config");
const common_1 = require("./common");
const const_1 = require("./const");
const deploy_mocks_1 = require("./deploy-mocks");
const task_names_1 = require("hardhat/builtin-tasks/task-names");
(0, config_1.extendConfig)((config, userConfig) => {
    // Allow users to override the localcofhe network config
    if (userConfig.networks && userConfig.networks.localcofhe) {
        return;
    }
    // Default config
    config.networks.localcofhe = {
        gas: "auto",
        gasMultiplier: 1.2,
        gasPrice: "auto",
        timeout: 10000,
        httpHeaders: {},
        url: "http://127.0.0.1:42069",
        accounts: [
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
            "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
            "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
        ],
    };
});
// Task to fund an account from the faucet
(0, config_1.task)(const_1.TASK_COFHE_USE_FAUCET, "Fund an account from the faucet")
    .addOptionalParam("address", "Address to fund", undefined, config_1.types.string)
    .addOptionalParam("account", "account number to fund", 0, config_1.types.int)
    .addOptionalParam("url", "Optional Faucet URL", 
// TODO: Check with team to see what the updated faucet url for localcofhe host chain is
// - architect 2025-03-27
"http://localhost:3000", config_1.types.string)
    .setAction(async ({ address, account, url }, { network }) => {
    const { name: networkName, config: networkConfig } = network;
    if (networkName !== "localcofhe" && !url) {
        console.info(chalk_1.default.yellow(`Programmatic faucet only supported for localcofhe. Please provide a faucet url, or use the public testnet faucet at https://faucet.fhenix.zone`));
        return;
    }
    let foundAddress = "";
    if (Object(networkConfig).hasOwnProperty("url")) {
        const httpNetworkConfig = networkConfig;
        if (httpNetworkConfig.accounts === "remote") {
            console.log(chalk_1.default.yellow(`Remote network detected, cannot use faucet`));
            return;
        }
        else if (Object(httpNetworkConfig.accounts).hasOwnProperty("mnemonic")) {
            const networkObject = httpNetworkConfig.accounts;
            const mnemonic = networkObject.mnemonic;
            const path = `${networkObject.path || "m/44'/60'/0'/0"}/${account || networkObject.initialIndex || 0}`;
            const wallet = ethers_1.HDNodeWallet.fromPhrase(mnemonic, "", path);
            foundAddress = wallet.address;
        }
        else {
            const accounts = httpNetworkConfig.accounts;
            const privateKey = accounts[account || 0];
            const wallet = new ethers_1.Wallet(privateKey);
            foundAddress = wallet.address;
        }
    }
    const myAddress = address || foundAddress;
    if (!myAddress) {
        console.info(chalk_1.default.red(`Failed to get address from hardhat`));
        return;
    }
    console.info(chalk_1.default.green(`Getting funds from faucet for ${myAddress}`));
    try {
        await (0, common_1.getFunds)(myAddress, url);
        console.info(chalk_1.default.green(`Success!`));
    }
    catch (e) {
        console.info(chalk_1.default.red(`failed to get funds from faucet @ ${url} for ${address}: ${e}`));
    }
});
(0, config_1.task)("deploy-mocks", "Deploys the mock contracts on the Hardhat network").setAction(async (taskArgs, hre) => {
    await (0, deploy_mocks_1.deployMocks)(hre);
});
(0, config_1.task)(task_names_1.TASK_TEST, "Deploy mock contracts on hardhat").setAction(async ({}, hre, runSuper) => {
    await (0, deploy_mocks_1.deployMocks)(hre);
    return runSuper();
});
// MOCK UTILS
__exportStar(require("./mockUtils"), exports);
// TODO: These need to be added after the cofhe-hardhat-example created
// - architect 2025-03-28
//# sourceMappingURL=index.js.map