import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("100");
const MINT_VALUE_2 = ethers.utils.parseEther("200");

async function main() {
  //Deploy the contract
  const [deployer, account1, account2] = await ethers.getSigners();
  const contractFactory = new MyToken__factory(deployer);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  const deployTransactionReceipt = await contract.deployTransaction.wait();
  console.log(
    "Contract deployed to:",
    contract.address,
    "by",
    deployer.address,
    "at block number",
    deployTransactionReceipt.blockNumber,
    "\n"
  );

  //The deployer mint MINT_VALUE token for the account 1
  const mintTx = await contract.mint(account1.address, MINT_VALUE);
  const mintTransactionReceipt = await mintTx.wait();
  console.log(
    "Minted 100 tokens to",
    account1.address,
    "at block number",
    mintTransactionReceipt.blockNumber
  );

  const tokenBalanceAccount1 = await contract.balanceOf(account1.address);
  console.log(
    "Account 1 has a balance of",
    ethers.utils.formatEther(tokenBalanceAccount1),
    "vote tokens!"
  );

  //Check the voting power Account 1
  const votePowerAccount1 = await contract.getVotes(account1.address);
  console.log(
    "Voting power of account 1 is",
    ethers.utils.formatEther(votePowerAccount1)
  );

  //Set the self-delegate of account 1
  const delegateTx = await contract
    .connect(account1)
    .delegate(account1.address);
  const delegateTxReceipt = await delegateTx.wait();
  console.log(
    "Token delegate to",
    account1.address,
    "at block number",
    delegateTxReceipt.blockNumber
  );

  //Check the voting power Account 1 again
  const votePowerAccount1AfterDelegate = await contract.getVotes(
    account1.address
  );
  console.log(
    "Account 1 voting power is",
    ethers.utils.formatEther(votePowerAccount1AfterDelegate),
    "\n"
  );

  //Delegate account 1 to account 2
  const transferTx = await contract
    .connect(account1)
    .transfer(account2.address, MINT_VALUE.div(2));
  const transferTxReceipt = await transferTx.wait();
  console.log(
    "Token Ttransfered from",
    account1.address,
    "to",
    account2.address,
    "at block number",
    transferTxReceipt.blockNumber
  );

  //The deployer mint MINT_VALUE_2 token for the account 2
  const mintTx2 = await contract.mint(account2.address, MINT_VALUE_2);
  const mintTransactionReceipt2 = await mintTx2.wait();
  console.log(
    "Minted 200 tokens to",
    account2.address,
    "at block number",
    mintTransactionReceipt2.blockNumber
  );

  //What block am I on?
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log("Block number:", blockNumber);

  //Check the hystoric voting power of account 1
  const votePowerAccount1Historic = await contract.getPastVotes(
    account1.address,
    blockNumber - 1
  );

  console.log(
    "Account 1 voting power at block",
    blockNumber - 1,
    "is",
    ethers.utils.formatEther(votePowerAccount1Historic)
  );

  ///////////////////
  // const tokenBalanceAccount2 = await contract.balanceOf(account2.address);
  // console.log(
  //   "Account 2 has a balance of",
  //   ethers.utils.formatEther(tokenBalanceAccount2),
  //   "vote tokens!"
  // );

  //Check the voting power Account 2
  //   const votePowerAccount2 = await contract.getVotes(account2.address);
  //   console.log(
  //     "Voting power of account 2 is",
  //     ethers.utils.formatEther(votePowerAccount2)
  //   );

  //   //Set the self-delegate of account 2
  //   const delegateTx2 = await contract
  //     .connect(account2)
  //     .delegate(account2.address);
  //   const delegateTxReceipt2 = await delegateTx.wait();
  //   console.log(
  //     "Token delegate to",
  //     account2.address,
  //     "at block number",
  //     delegateTxReceipt.blockNumber
  //   );

  //   //Check the voting power Account 2
  //   const votePowerAccount2AfterDelegate = await contract.getVotes(
  //     account2.address
  //   );
  //   console.log(
  //     "Account 2 voting power is",
  //     ethers.utils.formatEther(votePowerAccount2AfterDelegate),
  //     "\n"
  //   );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
