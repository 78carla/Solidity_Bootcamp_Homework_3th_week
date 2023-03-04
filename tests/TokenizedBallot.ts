import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Ballot", function () {
  let ballotContract: Ballot;

  beforeEach(async function () {
    // const ballotFactory = await ethers.getContractFactory("Ballot");
    // ballotContract = await ballotFactory.deploy(
    //   convertStringArrayToBytes32(PROPOSALS)
    // );
    // await ballotContract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      // TODO
      throw Error("Not implemented");
    });
    it("sets the deployer address as chairperson", async function () {
      // TODO
      throw Error("Not implemented");
    });
    it("sets the voting weight for the chairperson as 1", async function () {
      // TODO
      throw Error("Not implemented");
    });
  });

  describe("when an account mints tokens", function () {
    it("receive the correct amount of tokens", async function () {
      // TODO
      throw Error("Not implemented");
    });
    it("is charged the correct amount of ether", async function () {
      // TODO
      throw Error("Not implemented");
    });
    it("has the correct voting power", async function () {
      // TODO
      throw Error("Not implemented");
    });
  });

  describe("when an account self delegates ", function () {
    // TODO
    it("has the correct voting power", async () => {
      throw Error("Not implemented");
    });
    // TODO
    it("compare the historical voting power before and after self delegating", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account transfer the tokens", function () {
    // TODO
    it("has the correct voting power", async () => {
      throw Error("Not implemented");
    });
  });
  // TODO
  it("compare the historical voting power before and after the transfer", async () => {
    throw Error("Not implemented");
  });

  describe("when an account casts their votes", function () {
    // TODO
    it("winning proposal is X", async () => {
      throw Error("Not implemented");
    });
    it("voting power is decreased by number of votes", async () => {
      throw Error("Not implemented");
    });
    });
    it("transferring tokens does not effect the votes that have been cast", async () => {
    throw Error("Not implemented");
    });
  });
