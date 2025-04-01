"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWithHardhatSigner = void 0;
const node_1 = require("cofhejs/node");
const initializeWithHardhatSigner = async (signer, params) => {
    const abstractProvider = {
        call: async (...args) => {
            try {
                return signer.provider.call(...args);
            }
            catch (e) {
                throw new Error(`fhenixsdk initializeWithHHSigner :: call :: ${e}`);
            }
        },
        getChainId: async () => (await signer.provider.getNetwork()).chainId.toString(),
    };
    const abstractSigner = {
        signTypedData: async (domain, types, value) => signer.signTypedData(domain, types, value),
        getAddress: async () => signer.getAddress(),
        provider: abstractProvider,
    };
    return node_1.cofhejs.initialize({
        ...params,
        provider: abstractProvider,
        signer: abstractSigner,
    });
};
exports.initializeWithHardhatSigner = initializeWithHardhatSigner;
//# sourceMappingURL=cofhejs.js.map