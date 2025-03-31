"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mock_expectPlaintext = exports.mock_getPlaintextExists = exports.mock_getPlaintext = void 0;
const addresses_1 = require("./addresses");
const chai_1 = require("chai");
const ethers_1 = require("ethers");
const mock_getPlaintext = async (ctHash) => {
    const provider = new ethers_1.ethers.JsonRpcProvider("http://localhost:8545");
    // Connect to MockTaskManager
    const taskManager = new ethers_1.ethers.Contract(addresses_1.TASK_MANAGER_ADDRESS, ["function mockStorage(uint256) view returns (uint256)"], provider);
    // Fetch the plaintext
    const plaintext = await taskManager.mockStorage(ctHash);
    return plaintext;
};
exports.mock_getPlaintext = mock_getPlaintext;
const mock_getPlaintextExists = async (ctHash) => {
    const provider = new ethers_1.ethers.JsonRpcProvider("http://localhost:8545");
    // Connect to MockTaskManager
    const taskManager = new ethers_1.ethers.Contract(addresses_1.TASK_MANAGER_ADDRESS, ["function inMockStorage(uint256) view returns (bool)"], provider);
    // Fetch the plaintext exists
    const plaintextExists = await taskManager.inMockStorage(ctHash);
    return plaintextExists;
};
exports.mock_getPlaintextExists = mock_getPlaintextExists;
const mock_expectPlaintext = async (ctHash, expectedValue) => {
    // Expect the plaintext to exist
    const plaintextExists = await (0, exports.mock_getPlaintextExists)(ctHash);
    (0, chai_1.expect)(plaintextExists).equal(true, "Plaintext does not exist");
    // Expect the plaintext to have the expected value
    const plaintext = await (0, exports.mock_getPlaintext)(ctHash);
    (0, chai_1.expect)(plaintext).equal(expectedValue, "Plaintext value is incorrect");
};
exports.mock_expectPlaintext = mock_expectPlaintext;
//# sourceMappingURL=mockUtils.js.map