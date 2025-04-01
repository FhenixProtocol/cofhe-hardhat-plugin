import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {
  AbstractProvider,
  AbstractSigner,
  cofhejs,
  Environment,
  InitializationParams,
} from "cofhejs/node";
import { TypedDataField } from "ethers";

type HHSignerInitializationParams = Omit<
  InitializationParams,
  "tfhePublicKeySerializer" | "compactPkeCrsSerializer" | "signer" | "provider"
> & {
  ignoreErrors?: boolean;
  generatePermit?: boolean;
  environment?: Environment;
};

export const initializeWithHardhatSigner = async (
  signer: HardhatEthersSigner,
  params: HHSignerInitializationParams,
) => {
  const abstractProvider: AbstractProvider = {
    call: async (...args) => {
      try {
        return signer.provider.call(...args);
      } catch (e) {
        throw new Error(`fhenixsdk initializeWithHHSigner :: call :: ${e}`);
      }
    },
    getChainId: async () =>
      (await signer.provider.getNetwork()).chainId.toString(),
  };
  const abstractSigner: AbstractSigner = {
    signTypedData: async (domain, types, value) =>
      signer.signTypedData(
        domain,
        types as Record<string, TypedDataField[]>,
        value,
      ),
    getAddress: async () => signer.getAddress(),
    provider: abstractProvider,
  };

  return cofhejs.initialize({
    ...params,
    provider: abstractProvider,
    signer: abstractSigner,
  });
};
