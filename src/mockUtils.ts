import { TASK_MANAGER_ADDRESS } from "./addresses";
import { expect } from "chai";
import { ethers } from "ethers";

export const mock_getPlaintext = async (ctHash: bigint) => {
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");

  // Connect to MockTaskManager
  const taskManager = new ethers.Contract(
    TASK_MANAGER_ADDRESS,
    ["function mockStorage(uint256) view returns (uint256)"],
    provider,
  );

  // Fetch the plaintext
  const plaintext = await taskManager.mockStorage(ctHash);

  return plaintext;
};

export const mock_getPlaintextExists = async (ctHash: bigint) => {
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");

  // Connect to MockTaskManager
  const taskManager = new ethers.Contract(
    TASK_MANAGER_ADDRESS,
    ["function inMockStorage(uint256) view returns (bool)"],
    provider,
  );

  // Fetch the plaintext exists
  const plaintextExists = await taskManager.inMockStorage(ctHash);

  return plaintextExists;
};

export const mock_expectPlaintext = async (
  ctHash: bigint,
  expectedValue: bigint,
) => {
  // Expect the plaintext to exist
  const plaintextExists = await mock_getPlaintextExists(ctHash);
  expect(plaintextExists).equal(true, "Plaintext does not exist");

  // Expect the plaintext to have the expected value
  const plaintext = await mock_getPlaintext(ctHash);
  expect(plaintext).equal(expectedValue, "Plaintext value is incorrect");
};
