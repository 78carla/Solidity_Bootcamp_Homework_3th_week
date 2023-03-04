import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { MyToken, MyToken__factory, Ballot, Ballot__factory } from "../typechain-types";

const PROPOSALS = ["P1", "P2", "P3"]; //Spaces not allowed?
const MINT_VALUE = ethers.utils.parseEther("5");

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Ballot", function () {
    let tokenContract: MyToken;
    let ballotContract: Ballot;
    
    let deployer: SignerWithAddress;
    let account1: SignerWithAddress;
    let account2: SignerWithAddress;
    beforeEach(async function () {
        [deployer, account1, account2] = await ethers.getSigners();
        // deploy the token contract
        const tokenContractFactory = new MyToken__factory(deployer);
        tokenContract = await tokenContractFactory.deploy();
        const deployTokenContractTxReceipt = await tokenContract.deployTransaction.wait();
        // console.log(`The token contract is deployed at block ${deployTokenContractTxReceipt.blockNumber}`);

        // Deploy the ballot contract
        const ballotContractFactory = new Ballot__factory(deployer);
        // TODO: why do we pass block number? look up the vid
        ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(PROPOSALS), tokenContract.address, deployTokenContractTxReceipt.blockNumber);
        const deployTxReceipt = await ballotContract.deployTransaction.wait();
        // console.log(`The ballot contract is deployed at block ${deployTxReceipt.blockNumber}`);
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
        for (let index = 0; index < PROPOSALS.length; index++) {
            const proposal = await ballotContract.proposals(index);
            expect(proposal.voteCount).to.eq(0);
          }
    });
  });

  describe("when an account mints tokens", function () {
    let tokenBalanceAccount1BeforeMint: BigNumber;
    let ethBalanceAccount1BeforeMint: BigNumber;
    let tokenBalanceAccount1AfterMint: BigNumber;
    let ethBalanceAccount1AfterMint: BigNumber;
    beforeEach(async function () {
        tokenBalanceAccount1BeforeMint = await tokenContract.balanceOf(account1.address);
        ethBalanceAccount1BeforeMint = await account1.getBalance();
        const mintTx = await tokenContract.mint(account1.address, MINT_VALUE);
        const mintTxReceipt = await mintTx.wait();
        tokenBalanceAccount1AfterMint = await tokenContract.balanceOf(account1.address);
        ethBalanceAccount1AfterMint = await account1.getBalance();
      });
    it("receive the correct amount of tokens", async function () {
        const diff = tokenBalanceAccount1AfterMint.sub(tokenBalanceAccount1BeforeMint);        
        expect(diff).to.eq(MINT_VALUE);
    });
    it("is charged the correct amount of ether", async function () {
        // TODO: we dont pay eth for minting? so it should be 0?
        const diff = ethBalanceAccount1BeforeMint.sub(ethBalanceAccount1AfterMint);
        expect(diff).to.eq(0);
    });
    it("has the correct voting power", async function () {
        const votePowerAccount1 = await tokenContract.getVotes(account1.address);
        expect(votePowerAccount1).to.eq(0);
    });

  describe("when an account self delegates ", function () {
    let votePowerAccount1: BigNumber;
    beforeEach(async function () {
        const delegateTx = await tokenContract.connect(account1).delegate(account1.address);
        const delegateTxReceipt = await delegateTx.wait();
        votePowerAccount1 = await tokenContract.getVotes(account1.address);
      });
    it("has the correct voting power", async () => {
        expect(votePowerAccount1).to.eq(MINT_VALUE);
    });
    it("compare the historical voting power before and after self delegating", async () => {
        const currentBlock = await ethers.provider.getBlock("latest");
        const votePowerAccount1Historically = await tokenContract.getPastVotes(account1.address, currentBlock.number-1);
        const diff = votePowerAccount1.sub(votePowerAccount1Historically);
        expect(diff).to.eq(MINT_VALUE);
        expect(votePowerAccount1Historically).to.eq(0);
    });
  });
});

//   describe("when an account transfer the tokens", function () {
//     // TODO
//     it("has the correct voting power", async () => {
//       throw Error("Not implemented");
//     });
//   });
//   // TODO
//   it("compare the historical voting power before and after the transfer", async () => {
//     throw Error("Not implemented");
//   });

//   describe("when an account casts their votes", function () {
//     // TODO
//     it("winning proposal is X", async () => {
//       throw Error("Not implemented");
//     });
//     it("voting power is decreased by number of votes", async () => {
//       throw Error("Not implemented");
//     });
//     });
//     it("transferring tokens does not effect the votes that have been cast", async () => {
//     throw Error("Not implemented");
//     });
  });
