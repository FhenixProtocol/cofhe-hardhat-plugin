// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-ethers";

import "../../../src";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.25",
    settings: {
      evmVersion: "cancun",
    },
  },
  defaultNetwork: "localfhenix",
  networks: {
    localfhenix: {
      url: "http://localhost:8545",
      accounts: {
        mnemonic:
          "demand hotel mass rally sphere tiger measure sick spoon evoke fashion comfort",
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

export default config;
