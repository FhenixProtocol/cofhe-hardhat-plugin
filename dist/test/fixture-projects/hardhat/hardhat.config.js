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
    defaultNetwork: "hardhat",
    paths: {
    // newPath: "asd",
    },
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map