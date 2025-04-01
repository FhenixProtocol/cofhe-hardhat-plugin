import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Environment, InitializationParams } from "cofhejs/node";
type HHSignerInitializationParams = Omit<InitializationParams, "tfhePublicKeySerializer" | "compactPkeCrsSerializer" | "signer" | "provider"> & {
    ignoreErrors?: boolean;
    generatePermit?: boolean;
    environment?: Environment;
};
export declare const initializeWithHardhatSigner: (signer: HardhatEthersSigner, params: HHSignerInitializationParams) => Promise<import("cofhejs/node").Result<import("cofhejs/node").Permit | undefined>>;
export {};
//# sourceMappingURL=cofhejs.d.ts.map