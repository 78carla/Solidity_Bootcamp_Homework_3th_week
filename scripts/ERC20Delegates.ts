//This script self-delegate or delegates ERC20Voting tokens to an account and checks the balance
import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const args = process.argv;
  const tokenAddress = args[2];
  const delegateAddress = args[3];
  const delegateValue = ethers.utils.parseEther(args[4]);

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

  //Check the voting power
  const votePower = await contract.getVotes(signer.address);
  console.log("Voting power is", ethers.utils.formatEther(votePower));

  const tokenBalanceAccount1 = await contract.balanceOf(signer.address);
  console.log(
    "The signer has a balance of",
    ethers.utils.formatEther(tokenBalanceAccount1),
    "vote tokens!"
  );

  //Set the self-delegate
  const delegateTx = await contract.delegate(signer.address);
  const delegateTxReceipt = await delegateTx.wait();
  console.log(
    "Token delegate to",
    signer.address,
    "at block number",
    delegateTxReceipt.blockNumber
  );

  if (delegateTxReceipt.status == 0) {
    //Delegate to delegateAddress
    const transferTx = await contract
      .connect(signer)
      .transfer(delegateAddress, delegateValue);
    const transferTxReceipt = await transferTx.wait();
    console.log(
      "Token transfered from",
      signer.address,
      "to",
      delegateAddress,
      "at block number",
      transferTxReceipt.blockNumber
    );
  }

  //Check the voting power
  const votePowerAccountAfterDelegate = await contract.getVotes(signer.address);
  console.log(
    "Account voting power is",
    ethers.utils.formatEther(votePowerAccountAfterDelegate),
    "\n"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
