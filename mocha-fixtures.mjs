import util from "util";
import { JsonRpcProvider } from "ethers";
import { exec } from "child_process";

// TODO: Need to update this to use the localcofhe containers.
// - architect 2025-03-27
const TEST_ENDPOINT_URL = process.env.TEST_ENDPOINT || "http://localhost:8545";

const execPromise = util.promisify(exec);
const CONTAINER_NAME = "fhenixjs-test-env";

async function runDockerContainerAsync() {
  const imageName = "ghcr.io/fhenixprotocol/localfhenix:v0.3.2";

  const ports = "-p 8545:8547 -p 5000:3000";

  const removePrevious = `docker kill ${CONTAINER_NAME}`;

  const command = `docker run --rm --env FHEOS_SECURITY_ZONES=2 --name ${CONTAINER_NAME} ${ports} -d ${imageName}`;

  try {
    try {
      await execPromise(removePrevious);
    } catch (_) {}
    const result = await execPromise(command);
    // console.log(result.stdout);
    // console.error(result.stderr);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to start docker container");
  }
}

async function killDockerContainerAsync() {
  const removePrevious = `docker kill ${CONTAINER_NAME}`;

  try {
    await execPromise(removePrevious);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to remove docker container");
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForChainToStart(url) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const client = new JsonRpcProvider(url);
      console.log(`connecting to ${url}...`);
      const networkId = await client.getNetwork();
      return Number(networkId.chainId);
    } catch (e) {
      console.log(`client not ready`);
    }
    await sleep(250);
  }
}

export async function mochaGlobalSetup() {
  // TODO: This is currently disabled because we don't have a localcofhe container
  // Once the localcofhe container is ready, we can replace this with the localcofhe startup
  // Hopefully: `localCofheStart(wait: true)`
  // - architect 2025-03-31
  //
  // if (process.env.SKIP_LOCAL_ENV === "true") {
  //   return;
  // }
  // runDockerContainerAsync();
  // console.log("\nWaiting for Fhenix to start...");
  // await waitForChainToStart(TEST_ENDPOINT_URL);
  // console.log("Fhenix is running!");
}

// this is a cjs because jest sucks at typescript

export async function mochaGlobalTeardown() {
  // TODO: Add localcofhe teardown
  // - architect 2025-03-31
  //
  // if (process.env.SKIP_LOCAL_ENV === "true") {
  //   return;
  // }
  // console.log("\nWaiting for Fhenix to stop...");
  // await killDockerContainerAsync();
  // console.log("Stopped test container. Goodbye!");
}
