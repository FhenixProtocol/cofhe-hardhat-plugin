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

export const mock_setLogging = async (
  hre: HardhatRuntimeEnvironment,
  enable: boolean,
  closureName?: string,
) => {
  const taskManager = await getDeployedMockTaskManager(hre);
  await taskManager.setLogOps(enable);

  const logsParts = [
    "[MOCK]",
    "|",
    "Logs",
    enable ? chalk.bold("Enabled") : chalk.bold("Disabled"),
    closureName ? `within ${chalk.bold(closureName)}` : undefined,
  ];

  const logsMessage = logsParts.filter(Boolean).join(" ");
  console.log(chalk.green(logsMessage));
};
