//This script self-delegate or delegates ERC20Voting tokens to an account and checks the balance
import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const args = process.argv;
  const tokenAddress = args[2];

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
  const contractFactory = new MyToken__factory(signer);

  //Attach an address to the contract
  console.log("Attaching to ERC20TokenVotes contract at address", tokenAddress);
  const contract = await contractFactory.attach(tokenAddress);
  console.log("Successfully attached");

  if (args.length === 3) {
    //Set the self-delegate

    //Check the voting power
    const votePowerAccount = await contract.getVotes(signer.address);
    console.log("Voting power is", ethers.utils.formatEther(votePowerAccount));

    const tokenBalanceAccount = await contract.balanceOf(signer.address);
    console.log(
      "The signer has a balance of",
      ethers.utils.formatEther(tokenBalanceAccount),
      "vote tokens!"
    );

    const delegateTxAccount = await contract.delegate(signer.address);
    const delegateTxReceiptAccount = await delegateTxAccount.wait();
    console.log(
      "Token delegate to",
      signer.address,
      "at block number",
      delegateTxReceiptAccount.blockNumber
    );

    //Check the voting power of the account
    const votePowerAccountAfterDelegate = await contract.getVotes(
      signer.address
    );
    console.log(
      "Account voting power is",
      ethers.utils.formatEther(votePowerAccountAfterDelegate),
      "\n"
    );
  } else {
    //Delegate to delegateAddress
    const delegateAddress = args[3];

    const tokenBalanceDelegateBefore = await contract.balanceOf(
      delegateAddress
    );
    console.log(
      "Delegate",
      delegateAddress,
      "has a balance of",
      ethers.utils.formatEther(tokenBalanceDelegateBefore),
      "vote tokens!"
    );

    const votePowerDelegateBefore = await contract.getVotes(delegateAddress);
    console.log(
      "Delegate voting power is",
      ethers.utils.formatEther(votePowerDelegateBefore),
      "\n"
    );

    const delegateTxDelegate = await contract.delegate(delegateAddress);
    const delegateTxReceiptDelegate = await delegateTxDelegate.wait();

    console.log(
      "Token delegate to",
      delegateAddress,
      "at block number",
      delegateTxReceiptDelegate.blockNumber
    );

    const tokenBalanceDelegateAfter = await contract.balanceOf(delegateAddress);
    console.log(
      "Delegate",
      delegateAddress,
      "has a balance of",
      ethers.utils.formatEther(tokenBalanceDelegateAfter),
      "vote tokens!"
    );

    //Check the voting power of the delegate
    const votePowerDelegateAfter = await contract.getVotes(delegateAddress);
    console.log(
      "Delegate voting power is",
      ethers.utils.formatEther(votePowerDelegateAfter),
      "\n"
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
