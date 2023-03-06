//This script casts votes for a proposal
import { ethers } from "hardhat";
import { MyToken__factory, Ballot__factory } from "../typechain-types";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const args = process.argv;
  const ballotAddress = args[2];
  const proposal = args[3];
  const amount = ethers.utils.parseEther(args[4]);

  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) {
    throw new Error("Private key missing");
  }

  const wallet = new ethers.Wallet(privateKey);
  console.log("Connected to the wallet address", wallet.address);
  const signer = wallet.connect(provider);

  //Deploy the contract
  const contractFactory = new Ballot__factory(signer);

  //Attach an address to the contract
  console.log("Attaching to TokenizedBallot contract at address", ballotAddress);
  const contract = await contractFactory.attach(ballotAddress);
  console.log("Successfully attached");

  //Cast the vote for the proposal
  const voteTx = await contract.connect(signer).vote(proposal, amount);
  const voteTxReceipt = await voteTx.wait();
  console.log(
    "Address ",
    signer.address,
    " cast ",
    amount,
    " votes for proposal ",
    proposal,
    " at block number ",
    voteTxReceipt.blockNumber
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
