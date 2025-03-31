"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnvironment = useEnvironment;
const plugins_testing_1 = require("hardhat/plugins-testing");
const path_1 = __importDefault(require("path"));
function useEnvironment(fixtureProjectName) {
    beforeEach("Loading hardhat environment", function () {
        process.chdir(path_1.default.join(__dirname, "fixture-projects", fixtureProjectName));
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        this.hre = require("hardhat");
    });
    afterEach("Resetting hardhat", function () {
        (0, plugins_testing_1.resetHardhatContext)();
    });
}
//# sourceMappingURL=helpers.js.map