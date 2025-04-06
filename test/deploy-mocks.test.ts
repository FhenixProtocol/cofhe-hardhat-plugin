import { expect } from "chai";
import { useEnvironment } from "./helpers";
import { TASK_MANAGER_ADDRESS, TEST_BED_ADDRESS } from "../src/addresses";
import { HardhatRuntimeEnvironment } from "hardhat/types";
describe("Deploy Mocks Task", function () {
  const getTestBedBytecode = async (hre: HardhatRuntimeEnvironment) => {
    return await hre.ethers.provider.getCode(TEST_BED_ADDRESS);
  };

  describe("With logging enabled", function () {
    useEnvironment("hardhat-logging-enabled");

    it("should deploy mocks with logging and test bed", async function () {
      await this.hre.run("deploy-mocks", {
        deployTestBed: true,
        logMocks: true,
      });

      // Verify contracts are deployed
      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );
      expect(await taskManager.exists()).to.equal(true);
      expect(await taskManager.logOps()).to.equal(true);

      // Verify test bed is deployed
      const testBedBytecode = await getTestBedBytecode(this.hre);
      expect(testBedBytecode.length).to.be.greaterThan(2);

      const testBed = await this.hre.ethers.getContractAt(
        "TestBed",
        TEST_BED_ADDRESS,
      );
      expect(await testBed.exists()).to.equal(true);
    });

    it("should deploy mocks with logging but without test bed", async function () {
      await this.hre.run("deploy-mocks", {
        deployTestBed: false,
        logMocks: true,
      });

      // Verify mock contracts are deployed
      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );
      expect(await taskManager.exists()).to.equal(true);
      expect(await taskManager.logOps()).to.equal(true);

      // Verify test bed is not deployed
      const testBedBytecode = await getTestBedBytecode(this.hre);
      expect(testBedBytecode).to.equal("0x");
    });
  });

  describe("With logging disabled", function () {
    useEnvironment("hardhat-logging-disabled");

    it("should deploy mocks without logging and with test bed", async function () {
      await this.hre.run("deploy-mocks", {
        deployTestBed: true,
        logMocks: false,
      });

      // Verify contracts are deployed
      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );
      expect(await taskManager.exists()).to.equal(true);
      expect(await taskManager.logOps()).to.equal(false);

      // Verify test bed is deployed
      const testBedBytecode = await getTestBedBytecode(this.hre);
      expect(testBedBytecode.length).to.be.greaterThan(2);

      const testBed = await this.hre.ethers.getContractAt(
        "TestBed",
        TEST_BED_ADDRESS,
      );
      expect(await testBed.exists()).to.equal(true);
    });

    it("should deploy mocks without logging and without test bed", async function () {
      await this.hre.run("deploy-mocks", {
        deployTestBed: false,
        logMocks: false,
      });

      // Verify mock contracts are deployed
      const taskManager = await this.hre.ethers.getContractAt(
        "TaskManager",
        TASK_MANAGER_ADDRESS,
      );
      expect(await taskManager.exists()).to.equal(true);
      expect(await taskManager.logOps()).to.equal(false);

      // Verify test bed is not deployed
      const testBedBytecode = await getTestBedBytecode(this.hre);
      expect(testBedBytecode).to.equal("0x");
    });
  });
});
