# Cofhe Hardhat Plugin

Hardhat plugin that manages:

- [ ] Localcofhe containers startup before tests and teardown after tests
- [ ] Tasks that can up / down localcofhe
- [x] Injects Hardhat Cofhe Mocks (@fhenixprotocol/cofhe-mock-contracts)
- [ ] Faucet task (localcofhe host chain)
- [ ] Provides utilities for testing with CoFHE

Ordered Tasks

- [x] Mocks (ROGUE)
  - [x] Import `fhenixprotocol/cofhe-mock-contracts`
  - [x] Fix `cofhe-mock-contracts` build (add vite build)
  - [x] Get mock injection working in tasks
  - [x] Write tests for the mock injections
  - [x] Create utilities necessary to interact with CoFHE
  - [x] Import `fhenixprotocol/cofhejs`
  - [x] Create `initializeWithHardhatSigner` utility function for `cofhejs`
  - [x] Test `cofhejs.encrypt` against `cofhe-mock-contracts`
  - [x] Test `cofhejs.unseal` against `cofhe-mock-contracts`
  - [x] Test full `cofhejs` pipeline
- [x] Create `fhenixprotocol/cofhe-hardhat-starter` repo
  - [x] Import this (`cofhe-hardhat-plugin`)
  - [x] Create example contract
  - [ ] Test onramp
  - [x] Create example contract tests
  - [ ] Deploy (indicate mocks only)
- [ ] Localcofhe (TOVI)
  - [ ] Import `fhenixprotocol/localcofhe`
  - [ ] Automation: starting up localcofhe
  - [ ] Automation: tearing down localcofhe
  - [ ] Automation: Update localfhenix start/stop tasks with localcofhe
  - [ ] Update faucet to work with localcofhe
  - [ ] Test `cofhejs.encrypt` against localcofhe
  - [ ] Test `cofhejs.unseal` against localcofhe
  - [ ] Test full `cofhejs` pipeline
  - [ ] Document what is different about testing with localcofhe and mocks
- [ ] Integrate `cofhe-hardhat-starter` with localcofhe
  - [ ] Test onramp from mocks -> localcofhe
  - [ ] Create tests against localcofhe
- [ ] Arbitrum Sepolia
  - [ ] Research

Test Matrix

```
+------------------+-------+------------+-------------+
|        _         | Mocks | Localcofhe | Arb-Sepolia |
+------------------+-------+------------+-------------+
| zkPoK            | [x]   | [ ]        | [ ]         |
| Ops              | [x]   | [ ]        | [ ]         |
| On-chain decrypt | [x]   | [ ]        | [ ]         |
| Query sealoutput | [x]   | [ ]        | [ ]         |
+------------------+-------+------------+-------------+
```
