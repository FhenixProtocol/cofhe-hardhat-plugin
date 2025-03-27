# Cofhe Hardhat Plugin

Hardhat plugin that manages:

- [ ] Localcofhe containers startup before tests and teardown after tests
- [ ] Tasks that can up / down localcofhe
- [ ] Injects Hardhat Cofhe Mocks (@fhenixprotocol/cofhe-mock-contracts)
- [ ] Faucet task (localcofhe host chain)
- [ ] Provides utilities for testing with CoFHE

Ordered Tasks

- [ ] Mocks
  - [x] Import `fhenixprotocol/cofhe-mock-contracts`
  - [ ] Get mock injection working in tasks
  - [ ] Write tests for the mock injections
  - [ ] Create utilities necessary to interact with CoFHE
  - [ ] Import `fhenixprotocol/cofhejs`
  - [ ] Create `initializeWithHardhatSigner` utility function for `cofhejs`
  - [ ] Test `cofhejs.encrypt` against `cofhe-mock-contracts`
  - [ ] Test `cofhejs.unseal` against `cofhe-mock-contracts`
  - [ ] Test full `cofhejs` pipeline
- [ ] Create `fhenixprotocol/cofhe-hardhat-starter` repo
  - [ ] Import this (`cofhe-hardhat-plugin`)
  - [ ] Create example contract
  - [ ] Test onramp
  - [ ] Create example contract tests
  - [ ] Deploy (indicate mocks only)
- [ ] Localcofhe
  - [ ] Import `fhenixprotocol/localcofhe`
  - [ ] Create wrapper around starting up localcofhe
  - [ ] Create wrapper around tearing down localcofhe
  - [ ] Update localfhenix start/stop tasks with localcofhe
  - [ ] Test `cofhejs.encrypt` against localcofhe
  - [ ] Test `cofhejs.unseal` against localcofhe
  - [ ] Test full `cofhejs` pipeline
  - [ ] Document what is different about testing with localcofhe and mocks
- [ ] Integrate `cofhe-hardhat-starter` with localcofhe
  - [ ] Test onramp from mocks -> localcofhe
  - [ ] Create tests against localcofhe
- [ ] Arbitrum Sepolia
  - [ ] Research
