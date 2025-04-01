"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployMocks = void 0;
const utils_1 = require("./utils");
const addresses_1 = require("./addresses");
const compile_mock_contracts_1 = require("./compile-mock-contracts");
const chalk_1 = __importDefault(require("chalk"));
const deployMockTaskManager = async (hre) => {
    const [signer] = await hre.ethers.getSigners();
    // Deploy MockTaskManager
    const TaskManagerArtifact = await hre.artifacts.readArtifact("TaskManager");
    await (0, utils_1.hardhatSetCode)(hre, addresses_1.TASK_MANAGER_ADDRESS, TaskManagerArtifact.deployedBytecode);
    const taskManager = await hre.ethers.getContractAt("TaskManager", addresses_1.TASK_MANAGER_ADDRESS);
    // Initialize MockTaskManager
    const initTx = await taskManager.initialize(signer.address);
    await initTx.wait();
    // Check if MockTaskManager exists
    const tmExists = await taskManager.exists();
    if (!tmExists) {
        throw new Error("MockTaskManager does not exist");
    }
    return taskManager;
};
const deployMockACL = async (hre) => {
    // Get Signer
    const [signer] = await hre.ethers.getSigners();
    // Deploy ACL implementation
    const aclFactory = await hre.ethers.getContractFactory("ACL");
    const acl = await aclFactory.deploy(signer.address);
    await acl.waitForDeployment();
    // Check if ACL exists
    const exists = await acl.exists();
    if (!exists) {
        throw new Error("ACL does not exist");
    }
    return acl;
};
const deployMockZkVerifier = async (hre) => {
    const zkVerifierArtifact = await hre.artifacts.readArtifact("MockZkVerifier");
    await (0, utils_1.hardhatSetCode)(hre, addresses_1.ZK_VERIFIER_ADDRESS, zkVerifierArtifact.deployedBytecode);
    const zkVerifier = await hre.ethers.getContractAt("MockZkVerifier", addresses_1.ZK_VERIFIER_ADDRESS);
    const zkVerifierExists = await zkVerifier.exists();
    if (!zkVerifierExists) {
        throw new Error("MockZkVerifier does not exist");
    }
    return zkVerifier;
};
const deployMockQueryDecrypter = async (hre, acl) => {
    const queryDecrypterArtifact = await hre.artifacts.readArtifact("MockQueryDecrypter");
    await (0, utils_1.hardhatSetCode)(hre, addresses_1.QUERY_DECRYPTER_ADDRESS, queryDecrypterArtifact.deployedBytecode);
    const queryDecrypter = await hre.ethers.getContractAt("MockQueryDecrypter", addresses_1.QUERY_DECRYPTER_ADDRESS);
    // Initialize MockQueryDecrypter
    const initTx = await queryDecrypter.initialize(addresses_1.TASK_MANAGER_ADDRESS, await acl.getAddress());
    await initTx.wait();
    // Check if MockQueryDecrypter exists
    const queryDecrypterExists = await queryDecrypter.exists();
    if (!queryDecrypterExists) {
        throw new Error("MockQueryDecrypter does not exist");
    }
    return queryDecrypter;
};
const setTaskManagerACL = async (taskManager, acl) => {
    const setAclTx = await taskManager.setACLContract(await acl.getAddress());
    await setAclTx.wait();
};
const deployTestBedContract = async (hre) => {
    const testBedFactory = await hre.artifacts.readArtifact("TestBed");
    await (0, utils_1.hardhatSetCode)(hre, addresses_1.TEST_BED_ADDRESS, testBedFactory.deployedBytecode);
    const testBed = await hre.ethers.getContractAt("TestBed", addresses_1.TEST_BED_ADDRESS);
    await testBed.waitForDeployment();
    return testBed;
};
const deployMocks = async (hre, deployTestBed = false) => {
    // Log start message
    console.log(chalk_1.default.green(chalk_1.default.bold("\ncofhe-hardhat-plugin - deploy mocks \n")));
    // Compile mock contracts
    await (0, compile_mock_contracts_1.compileMockContractPaths)(hre);
    console.log(chalk_1.default.green("    ✓ Mock contracts compiled"));
    // Check if network is Hardhat
    const network = hre.network.name;
    if (network !== "hardhat") {
        console.log(chalk_1.default.red(`cofhe-hardhat-plugin - deploy mocks\nThis task is intended to run on the Hardhat network.\nCurrent network: ${network}`));
        return;
    }
    // Compile contracts
    await hre.run("compile");
    // Deploy mock contracts
    const taskManager = await deployMockTaskManager(hre);
    console.log(chalk_1.default.green("  ✓ MockTaskManager deployed:"), "\t\t", chalk_1.default.bold(await taskManager.getAddress()));
    const acl = await deployMockACL(hre);
    console.log(chalk_1.default.green("  ✓ MockACL deployed:"), "\t\t\t", chalk_1.default.bold(await acl.getAddress()));
    await setTaskManagerACL(taskManager, acl);
    console.log(chalk_1.default.green("    ✓ ACL address set in TaskManager"));
    const zkVerifier = await deployMockZkVerifier(hre);
    console.log(chalk_1.default.green("  ✓ MockZkVerifier deployed:"), "\t\t", chalk_1.default.bold(await zkVerifier.getAddress()));
    const queryDecrypter = await deployMockQueryDecrypter(hre, acl);
    console.log(chalk_1.default.green("  ✓ MockQueryDecrypter deployed:"), "\t", chalk_1.default.bold(await queryDecrypter.getAddress()));
    if (deployTestBed) {
        console.log(chalk_1.default.green("  ✓ TestBed deployment enabled"));
        const testBed = await deployTestBedContract(hre);
        console.log(chalk_1.default.green("    ✓ TestBed deployed:"), "\t\t", chalk_1.default.bold(await testBed.getAddress()));
    }
    // Log success message
    console.log(chalk_1.default.green(chalk_1.default.bold("cofhe-hardhat-plugin :: mocks deployed!\n\n")));
};
exports.deployMocks = deployMocks;
//# sourceMappingURL=deploy-mocks.js.map