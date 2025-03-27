// tslint:disable-next-line no-implicit-dependencies
import { TASK_COFHE_USE_FAUCET } from "../src/const";
import { useEnvironment } from "./helpers";

describe("Test Fhenix Plugin", function () {
  describe("Test Faucet command", async function () {
    useEnvironment("localfhenix");
    it("checks that the faucet works", async function () {
      await this.hre.run(TASK_COFHE_USE_FAUCET);
    });
  });
});
