//This script deploys the ERC20Votes contract to the Goerli testnet
import { ethers } from "hardhat";
import { MyToken__factory, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const args = process.argv;
  const proposals = args.slice(2);
  if (proposals.length <= 0) throw new Error("Missing proposals");

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

  //Deploy the token contract
  console.log("Deploying ERC20Votes contract:");
  const tokenContractFactory = new MyToken__factory(signer);
  console.log("Deploying contract ...");
  const tokenContract = await tokenContractFactory.deploy();
  const tokenContractDeployTransactionReceipt = await tokenContract.deployTransaction.wait();
  console.log(
    "ERC20Votes contract deployed to:",
    tokenContract.address,
    "by",
    signer.address,
    "at block number",
    tokenContractDeployTransactionReceipt.blockNumber,
    "\n"
  );

  //Deploy the ballot contract
  console.log("Deploying TokenizedBallot contract:");
  const ballotContractFactory = new Ballot__factory(signer)
  console.log("Deploying contract ...");
  const ballotContract = await ballotContractFactory.deploy(convertStringArrayToBytes32(proposals), tokenContract.address, tokenContractDeployTransactionReceipt.blockNumber);
  const ballotContractDeployTransactionReceipt = await ballotContract.deployTransaction.wait();
  console.log(
    "TokenizedBallot contract deployed to:",
    ballotContract.address,
    "by",
    signer.address,
    "at block number",
    ballotContractDeployTransactionReceipt.blockNumber,
    "\n"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
