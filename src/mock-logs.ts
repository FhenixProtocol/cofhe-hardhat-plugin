import { HardhatRuntimeEnvironment } from "hardhat/types";
import { TASK_MANAGER_ADDRESS } from "./addresses";
import chalk from "chalk";

const getDeployedMockTaskManager = async (hre: HardhatRuntimeEnvironment) => {
  // Fetch the deployed MockTaskManager
  const taskManager = await hre.ethers.getContractAt(
    "TaskManager",
    TASK_MANAGER_ADDRESS,
  );

  return taskManager;
};

const getLoggingEnabled = async (hre: HardhatRuntimeEnvironment) => {
  const taskManager = await getDeployedMockTaskManager(hre);
  return await taskManager.logOps();
};

const setLoggingEnabled = async (
  hre: HardhatRuntimeEnvironment,
  enabled: boolean,
) => {
  const taskManager = await getDeployedMockTaskManager(hre);
  await taskManager.setLogOps(enabled);
};

// prettier-ignore
const printLogsEnabledMessage = (closureMessage: string) => {
  console.log("┌──────────────────┬──────────────────────────────────────────────────");
  console.log(`│ [COFHE-MOCKS]    │ ${closureMessage}`);
  console.log("├──────────────────┴──────────────────────────────────────────────────");
};

// prettier-ignore
const printLogsBlockEnd = () => {
  console.log("└─────────────────────────────────────────────────────────────────────");
};

export const mock_setLoggingEnabled = async (
  hre: HardhatRuntimeEnvironment,
  enabled: boolean,
  closureName?: string,
) => {
  try {
    await setLoggingEnabled(hre, enabled);

    if (enabled) {
      printLogsEnabledMessage(
        `${closureName ? `"${chalk.bold(closureName)}" logs:` : "Logs:"}`,
      );
    } else {
      printLogsBlockEnd();
    }
  } catch (error) {
    console.log(chalk.red("mock_setLoggingEnabled error"), error);
  }
};

export const mock_withLogs = async (
  hre: HardhatRuntimeEnvironment,
  closureName: string,
  closure: () => Promise<void>,
) => {
  const initialState = await getLoggingEnabled(hre);

  await setLoggingEnabled(hre, true);
  printLogsEnabledMessage(`"${chalk.bold(closureName)}" logs:`);
  await closure();
  printLogsBlockEnd();

  // If logs were disabled, disable them again
  if (!initialState) {
    await setLoggingEnabled(hre, false);
  }
};
