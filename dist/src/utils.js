"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardhatSetCode = void 0;
const hardhatSetCode = async (hre, address, bytecode) => {
    await hre.network.provider.send('hardhat_setCode', [address, bytecode]);
};
exports.hardhatSetCode = hardhatSetCode;
//# sourceMappingURL=utils.js.map