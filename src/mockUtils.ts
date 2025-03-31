import { HardhatRuntimeEnvironment } from "hardhat/types";
import { TASK_MANAGER_ADDRESS } from "./addresses";
import { expect } from "chai";

export const mock_getPlaintext = async (
  hre: HardhatRuntimeEnvironment,
  ctHash: bigint,
) => {
  // Connect to MockTaskManager
  const taskManager = await hre.ethers.getContractAt(
    "MockTaskManager",
    TASK_MANAGER_ADDRESS,
  );

  // Fetch the plaintext
  const plaintext = await taskManager.mockStorage(ctHash);

  return plaintext;
};

export const mock_getPlaintextExists = async (
  hre: HardhatRuntimeEnvironment,
  ctHash: bigint,
) => {
  // Connect to MockTaskManager
  const taskManager = await hre.ethers.getContractAt(
    "MockTaskManager",
    TASK_MANAGER_ADDRESS,
  );

  // Fetch the plaintext exists
  const plaintextExists = await taskManager.inMockStorage(ctHash);

  return plaintextExists;
};

export const mock_expectPlaintext = async (
  hre: HardhatRuntimeEnvironment,
  ctHash: bigint,
  expectedValue: bigint,
) => {
  // Expect the plaintext to exist
  const plaintextExists = await mock_getPlaintextExists(hre, ctHash);
  expect(plaintextExists).equal(true, "Plaintext does not exist");

  // Expect the plaintext to have the expected value
  const plaintext = await mock_getPlaintext(hre, ctHash);
  expect(plaintext).equal(expectedValue, "Plaintext value is incorrect");
};
