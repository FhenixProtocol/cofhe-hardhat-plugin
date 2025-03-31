"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line no-implicit-dependencies
const chai_1 = require("chai");
const const_1 = require("../src/const");
const helpers_1 = require("./helpers");
const addresses_1 = require("../src/addresses");
describe("Cofhe Hardhat Plugin", function () {
    describe("Localcofhe Faucet command", async function () {
        (0, helpers_1.useEnvironment)("localcofhe");
        it("checks that the faucet works", async function () {
            await this.hre.run(const_1.TASK_COFHE_USE_FAUCET);
        });
    });
    describe("Hardhat Mocks", async () => {
        (0, helpers_1.useEnvironment)("hardhat");
        it("checks that the mocks are deployed", async function () {
            await this.hre.run("deploy-mocks");
            const taskManager = await this.hre.ethers.getContractAt("TaskManager", addresses_1.TASK_MANAGER_ADDRESS);
            const tmExists = await taskManager.exists();
            (0, chai_1.expect)(tmExists).to.equal(true);
            const aclAddress = await taskManager.acl();
            const acl = await this.hre.ethers.getContractAt("ACL", aclAddress);
            const aclExists = await acl.exists();
            (0, chai_1.expect)(aclExists).to.equal(true);
            const queryDecrypter = await this.hre.ethers.getContractAt("MockQueryDecrypter", addresses_1.QUERY_DECRYPTER_ADDRESS);
            const qdExists = await queryDecrypter.exists();
            (0, chai_1.expect)(qdExists).to.equal(true);
            const zkVerifier = await this.hre.ethers.getContractAt("MockZkVerifier", addresses_1.ZK_VERIFIER_ADDRESS);
            const zkVerifierExists = await zkVerifier.exists();
            (0, chai_1.expect)(zkVerifierExists).to.equal(true);
        });
    });
});
//# sourceMappingURL=project.test.js.map