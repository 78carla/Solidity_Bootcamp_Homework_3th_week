import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";

import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const args = process.argv;
  const tokenAddress = args[2];
  const accountVotingPower = args[3];
  const blockNumber = args[4];

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

  const currentBlock = await provider.getBlockNumber();
  console.log("Current block number: ", currentBlock);

  //Check the balance of the user
  const tokenBalanceAccount = await contract.balanceOf(accountVotingPower);
  console.log(
    "The user has a balance of",
    ethers.utils.formatEther(tokenBalanceAccount),
    "vote tokens at current block number",
    currentBlock
  );

  //Check the voting power
  const votePowerAccount = await contract.getVotes(accountVotingPower);
  console.log(
    "Voting power is",
    ethers.utils.formatEther(votePowerAccount),
    "at the current block number",
    currentBlock
  );

  //Check the hystoric voting power
  const votePowerAccountHistoric = await contract.getPastVotes(
    accountVotingPower,
    blockNumber
  );

  console.log(
    "Voting power is",
    ethers.utils.formatEther(votePowerAccountHistoric),
    "at the block numerber",
    blockNumber
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
