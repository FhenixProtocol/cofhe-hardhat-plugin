import { hardhatSetCode } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  TASK_MANAGER_ADDRESS,
  ZK_VERIFIER_ADDRESS,
  QUERY_DECRYPTER_ADDRESS,
  TEST_BED_ADDRESS,
} from "./addresses";
import { Contract } from "ethers";
import { compileMockContractPaths } from "./compile-mock-contracts";
import chalk from "chalk";

// Logging

const logEmpty = () => {
  console.log("");
};

const logSuccess = (message: string, indent = 1) => {
  console.log(chalk.green(`${"  ".repeat(indent)}✓ ${message}`));
};

const logError = (message: string, indent = 1) => {
  console.log(chalk.red(`${"  ".repeat(indent)}✗ ${message}`));
};

const logDeployment = (contractName: string, address: string) => {
  logSuccess(`${contractName} deployed: ${chalk.bold(address)}`);
};

// Network Check

const checkNetworkAndSkip = async (hre: HardhatRuntimeEnvironment) => {
  const network = hre.network.name;
  const isHardhat = network === "hardhat";
  if (!isHardhat)
    logSuccess(
      `cofhe-hardhat-plugin - deploy mocks - skipped on non-hardhat network ${network}`,
      0,
    );
  return isHardhat;
};

// Deployments

const deployMockTaskManager = async (hre: HardhatRuntimeEnvironment) => {
  const [signer] = await hre.ethers.getSigners();

  // Deploy MockTaskManager
  const TaskManagerArtifact = await hre.artifacts.readArtifact("TaskManager");
  await hardhatSetCode(
    hre,
    TASK_MANAGER_ADDRESS,
    TaskManagerArtifact.deployedBytecode,
  );
  const taskManager = await hre.ethers.getContractAt(
    "TaskManager",
    TASK_MANAGER_ADDRESS,
  );

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

const deployMockACL = async (hre: HardhatRuntimeEnvironment) => {
  // Get Signer
  const [signer] = await hre.ethers.getSigners();

  // Deploy ACL implementation
  const aclFactory = await hre.ethers.getContractFactory("ACL");
  const acl = await aclFactory.deploy(signer.address);
  await acl.waitForDeployment();

  // Check if ACL exists
  const exists = await acl.exists();
  if (!exists) {
    logError("ACL does not exist", 2);
    throw new Error("ACL does not exist");
  }

  return acl;
};

const deployMockZkVerifier = async (hre: HardhatRuntimeEnvironment) => {
  const zkVerifierArtifact = await hre.artifacts.readArtifact("MockZkVerifier");
  await hardhatSetCode(
    hre,
    ZK_VERIFIER_ADDRESS,
    zkVerifierArtifact.deployedBytecode,
  );
  const zkVerifier = await hre.ethers.getContractAt(
    "MockZkVerifier",
    ZK_VERIFIER_ADDRESS,
  );

  const zkVerifierExists = await zkVerifier.exists();
  if (!zkVerifierExists) {
    logError("MockZkVerifier does not exist", 2);
    throw new Error("MockZkVerifier does not exist");
  }

  return zkVerifier;
};

const deployMockQueryDecrypter = async (
  hre: HardhatRuntimeEnvironment,
  acl: Contract,
) => {
  const queryDecrypterArtifact = await hre.artifacts.readArtifact(
    "MockQueryDecrypter",
  );
  await hardhatSetCode(
    hre,
    QUERY_DECRYPTER_ADDRESS,
    queryDecrypterArtifact.deployedBytecode,
  );
  const queryDecrypter = await hre.ethers.getContractAt(
    "MockQueryDecrypter",
    QUERY_DECRYPTER_ADDRESS,
  );

  // Initialize MockQueryDecrypter
  const initTx = await queryDecrypter.initialize(
    TASK_MANAGER_ADDRESS,
    await acl.getAddress(),
  );
  await initTx.wait();

  // Check if MockQueryDecrypter exists
  const queryDecrypterExists = await queryDecrypter.exists();
  if (!queryDecrypterExists) {
    logError("MockQueryDecrypter does not exist", 2);
    throw new Error("MockQueryDecrypter does not exist");
  }

  return queryDecrypter;
};

const deployTestBedContract = async (hre: HardhatRuntimeEnvironment) => {
  const testBedFactory = await hre.artifacts.readArtifact("TestBed");
  await hardhatSetCode(hre, TEST_BED_ADDRESS, testBedFactory.deployedBytecode);
  const testBed = await hre.ethers.getContractAt("TestBed", TEST_BED_ADDRESS);
  await testBed.waitForDeployment();
  return testBed;
};

// Initializations

const setTaskManagerACL = async (taskManager: Contract, acl: Contract) => {
  const setAclTx = await taskManager.setACLContract(await acl.getAddress());
  await setAclTx.wait();
};

const setTaskManagerLogOps = async (taskManager: Contract, logOps: boolean) => {
  const setLogOpsTx = await taskManager.setLogOps(logOps);
  await setLogOpsTx.wait();
};

export const deployMocks = async (
  hre: HardhatRuntimeEnvironment,
  deployTestBed = false,
) => {
  // Check if network is Hardhat, if not log skip message and return
  const isHardhat = await checkNetworkAndSkip(hre);
  if (!isHardhat) return;

  // Log start message
  logEmpty();
  logSuccess(chalk.bold("cofhe-hardhat-plugin - deploy mocks"), 0);
  logEmpty();

  // Compile mock contracts
  await compileMockContractPaths(hre);
  logSuccess("Mock contracts compiled", 2);

  // Compile contracts
  await hre.run("compile");

  // Deploy mock contracts
  const taskManager = await deployMockTaskManager(hre);
  logDeployment("MockTaskManager", await taskManager.getAddress());

  const logOps = true;
  if (logOps) {
    await setTaskManagerLogOps(taskManager, true);
    logSuccess("TaskManager logOps set", 2);
  }

  const acl = await deployMockACL(hre);
  logDeployment("MockACL", await acl.getAddress());

  await setTaskManagerACL(taskManager, acl);
  logSuccess("ACL address set in TaskManager", 2);

  const zkVerifier = await deployMockZkVerifier(hre);
  logDeployment("MockZkVerifier", await zkVerifier.getAddress());

  const queryDecrypter = await deployMockQueryDecrypter(hre, acl);
  logDeployment("MockQueryDecrypter", await queryDecrypter.getAddress());

  if (deployTestBed) {
    logSuccess("TestBed deployment enabled", 2);
    const testBed = await deployTestBedContract(hre);
    logDeployment("TestBed", await testBed.getAddress());
  }

  // Log success message
  logEmpty();
  logSuccess(
    chalk.bold("cofhe-hardhat-plugin :: mocks deployed successfully"),
    0,
  );
  logEmpty();
};
