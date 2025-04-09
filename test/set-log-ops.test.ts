import { expect } from "chai";
import { useEnvironment } from "./helpers";
import { TASK_MANAGER_ADDRESS } from "../src/addresses";
import {
  TASK_COFHE_MOCKS_DEPLOY,
  TASK_COFHE_MOCKS_SET_LOG_OPS,
} from "../src/const";
import { mock_setLoggingEnabled, mock_withLogs } from "../src/mock-logs";

describe("Set Log Ops Task", function () {
  describe("With logging enabled", function () {
    useEnvironment("hardhat-logging-enabled");

    it("(task) should disable logging", async function () {
      // First deploy mocks to ensure TaskManager exists
      await this.hre.run(TASK_COFHE_MOCKS_DEPLOY, {
        deployTestBed: true,
        logMocks: true,
      });

      // Verify initial state
      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );
      expect(await taskManager.logOps()).to.equal(true);

      // Disable logging
      await this.hre.run(TASK_COFHE_MOCKS_SET_LOG_OPS, {
        enable: false,
      });

      expect(await taskManager.logOps()).to.equal(false);
    });

    it("(task) should disable logging with closure name", async function () {
      // First deploy mocks to ensure TaskManager exists
      await this.hre.run(TASK_COFHE_MOCKS_DEPLOY, {
        deployTestBed: true,
        logMocks: true,
      });

      // Verify initial state
      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );
      expect(await taskManager.logOps()).to.equal(true);

      // Disable logging with closure name
      await this.hre.run(TASK_COFHE_MOCKS_SET_LOG_OPS, {
        enable: false,
        closureName: "testFunction",
      });

      // Verify logging is disabled
      expect(await taskManager.logOps()).to.equal(false);
    });

    it("(function) should disable logging", async function () {
      // First deploy mocks to ensure TaskManager exists
      await this.hre.run(TASK_COFHE_MOCKS_DEPLOY, {
        deployTestBed: true,
        logMocks: true,
      });

      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );
      expect(await taskManager.logOps()).to.equal(true);

      await mock_setLoggingEnabled(this.hre, false);

      expect(await taskManager.logOps()).to.equal(false);
    });
  });

  describe("With logging disabled", function () {
    useEnvironment("hardhat-logging-disabled");

    it("(function) mock_withLogs should enable logging", async function () {
      await this.hre.run(TASK_COFHE_MOCKS_DEPLOY, {
        deployTestBed: true,
        logMocks: false,
      });

      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );

      await mock_withLogs(this.hre, "testFunction", async () => {
        const logOps = await taskManager.logOps();
        expect(logOps).to.equal(true);
      });
    });

    it("(task) should enable logging", async function () {
      // First deploy mocks to ensure TaskManager exists
      await this.hre.run(TASK_COFHE_MOCKS_DEPLOY, {
        deployTestBed: true,
        logMocks: false,
      });

      // Verify initial state
      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );
      expect(await taskManager.logOps()).to.equal(false);

      // Enable logging
      await this.hre.run(TASK_COFHE_MOCKS_SET_LOG_OPS, {
        enable: true,
      });

      // Verify logging is enabled
      expect(await taskManager.logOps()).to.equal(true);
    });

    it("(task) should enable logging with closure name", async function () {
      // First deploy mocks to ensure TaskManager exists
      await this.hre.run(TASK_COFHE_MOCKS_DEPLOY, {
        deployTestBed: true,
        logMocks: false,
      });

      // Verify initial state
      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );
      expect(await taskManager.logOps()).to.equal(false);

      // Enable logging with closure name
      await this.hre.run(TASK_COFHE_MOCKS_SET_LOG_OPS, {
        enable: true,
        closureName: "testFunction",
      });

      // Verify logging is enabled
      expect(await taskManager.logOps()).to.equal(true);
    });

    it("(function) should enable logging", async function () {
      // First deploy mocks to ensure TaskManager exists
      await this.hre.run(TASK_COFHE_MOCKS_DEPLOY, {
        deployTestBed: true,
        logMocks: false,
      });

      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );
      expect(await taskManager.logOps()).to.equal(false);

      await mock_setLoggingEnabled(this.hre, true);

      expect(await taskManager.logOps()).to.equal(true);
    });
  });
});
