"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-ethers");
require("../../../src");
const config = {
    solidity: {
        version: "0.8.25",
        settings: {
            evmVersion: "cancun",
        },
    },
    defaultNetwork: "localcofhe",
    networks: {
        localfhenix: {
            url: "http://localhost:8545",
            accounts: {
                mnemonic: "demand hotel mass rally sphere tiger measure sick spoon evoke fashion comfort",
                path: "m/44'/60'/0'/0",
                initialIndex: 0,
                count: 20,
                accountsBalance: "10000000000000000000",
                passphrase: "",
            },
        },
    },
    paths: {
    // newPath: "asd",
    },
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map