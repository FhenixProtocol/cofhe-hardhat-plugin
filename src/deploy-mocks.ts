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
  // Log start message
  console.log(
    chalk.green(chalk.bold("\ncofhe-hardhat-plugin - deploy mocks \n")),
  );

  // Compile mock contracts
  await compileMockContractPaths(hre);
  console.log(chalk.green("    ✓ Mock contracts compiled"));

  // Check if network is Hardhat
  const network = hre.network.name;
  if (network !== "hardhat") {
    console.log(
      chalk.red(
        `cofhe-hardhat-plugin - deploy mocks\nThis task is intended to run on the Hardhat network.\nCurrent network: ${network}`,
      ),
    );
    return;
  }

  // Compile contracts
  await hre.run("compile");

  // Deploy mock contracts
  const taskManager = await deployMockTaskManager(hre);
  console.log(
    chalk.green("  ✓ MockTaskManager deployed:"),
    "\t\t",
    chalk.bold(await taskManager.getAddress()),
  );

  const logOps = true;
  if (logOps) {
    await setTaskManagerLogOps(taskManager, true);
    console.log(chalk.green("    ✓ TaskManager logOps set"));
  }

  const acl = await deployMockACL(hre);
  console.log(
    chalk.green("  ✓ MockACL deployed:"),
    "\t\t\t",
    chalk.bold(await acl.getAddress()),
  );

  await setTaskManagerACL(taskManager, acl);
  console.log(chalk.green("    ✓ ACL address set in TaskManager"));

  const zkVerifier = await deployMockZkVerifier(hre);
  console.log(
    chalk.green("  ✓ MockZkVerifier deployed:"),
    "\t\t",
    chalk.bold(await zkVerifier.getAddress()),
  );

  const queryDecrypter = await deployMockQueryDecrypter(hre, acl);
  console.log(
    chalk.green("  ✓ MockQueryDecrypter deployed:"),
    "\t",
    chalk.bold(await queryDecrypter.getAddress()),
  );

  if (deployTestBed) {
    console.log(chalk.green("  ✓ TestBed deployment enabled"));
    const testBed = await deployTestBedContract(hre);
    console.log(
      chalk.green("    ✓ TestBed deployed:"),
      "\t\t",
      chalk.bold(await testBed.getAddress()),
    );
  }

  // Log success message
  console.log(
    chalk.green(chalk.bold("cofhe-hardhat-plugin :: mocks deployed!\n\n")),
  );
};
