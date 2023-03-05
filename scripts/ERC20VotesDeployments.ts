//This script deploys the ERC20Votes contract to the Goerli testnet
import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0) {
    throw new Error("Private key missing");
  }

  const wallet = new ethers.Wallet(privateKey);
  console.log("Connected to the wallet address", wallet.address);
  const signer = wallet.connect(provider);

  //Deploy the contract
  console.log("Deploying ERC20Votes contract:");
  const contractFactory = new MyToken__factory(signer);
  console.log("Deploying contract ...");
  const contract = await contractFactory.deploy();
  await contract.deployed();
  const deployTransactionReceipt = await contract.deployTransaction.wait();
  console.log(
    "Contract deployed to:",
    contract.address,
    "by",
    signer.address,
    "at block number",
    deployTransactionReceipt.blockNumber,
    "\n"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
