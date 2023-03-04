//This script mints ERC20Voting tokens to an account and checks the balance
import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const args = process.argv;
  const tokenAddress = args[2]; // replace with actual token address
  const account1 = args[3];
  const mint_value = ethers.utils.parseEther(args[4]);

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

  //The deployer mint token for the account 1
  const mintTx = await contract.mint(account1, mint_value);
  const mintTransactionReceipt = await mintTx.wait();
  console.log(
    "Minted",
    ethers.utils.formatEther(mint_value),
    "tokens to",
    account1,
    "at block number",
    mintTransactionReceipt.blockNumber
  );

  const tokenBalanceAccount1 = await contract.balanceOf(account1);
  console.log(
    "Account 1 has a balance of",
    ethers.utils.formatEther(tokenBalanceAccount1),
    "vote tokens!"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
