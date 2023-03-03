import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main(){
    const [deployer, account1, account2] = await ethers.getSigners();

    // deploy the contract
    const contractFactory = new MyToken__factory(deployer);
    const contract = await contractFactory.deploy();
    const deployTxReceipt = await contract.deployTransaction.wait();
    console.log(`Contract deployed at block ${deployTxReceipt.blockNumber}`);
    // mint some tokens
    const mintTx = await contract.mint(account1.address, MINT_VALUE);
    const mintTxReceipt = await mintTx.wait();
    console.log(`Tokens minted at block ${mintTxReceipt.blockNumber}`);
    const tokenBalanceAccount1 = await contract.balanceOf(account1.address);
    console.log(`Account balance is ${ethers.utils.formatEther(tokenBalanceAccount1)}`);

    // check the voting power
    let votePowerAccount1 = await contract.getVotes(account1.address);
    console.log(`Account vote power is ${ethers.utils.formatEther(votePowerAccount1)}`)

    // Self delegate
    const delegateTx = await contract.connect(account1).delegate(account1.address);
    const delegateTxReceipt = await delegateTx.wait();
    console.log(`Tokens delegated at block ${delegateTxReceipt.blockNumber}`)

    // check the voting power
    votePowerAccount1 = await contract.getVotes(account1.address);
    console.log(`Account vote power is ${ethers.utils.formatEther(votePowerAccount1)}`)

    // mint some moretokens
    const mintTx2 = await contract.mint(account2.address, MINT_VALUE);
    const mintTx2Receipt = await mintTx.wait();
    console.log(`Tokens minted at block ${mintTxReceipt.blockNumber}`);
    const tokenBalanceAccount2 = await contract.balanceOf(account2.address);
    console.log(`Account balance is ${ethers.utils.formatEther(tokenBalanceAccount1)}`);


    // whats the blocknr
    const currentBlock = await ethers.provider.getBlock("latest");
    console.log(`current blocknumber is ${currentBlock.number}`);

    // check the historical voting power
    votePowerAccount1 = await contract.getPastVotes(account1.address, currentBlock.number-1);
    console.log(`Account vote power was at block 3: ${ethers.utils.formatEther(votePowerAccount1)}`)
    // check the historical voting power
    votePowerAccount1 = await contract.getPastVotes(account1.address, currentBlock.number-2);
    console.log(`Account vote power was at block 2: ${ethers.utils.formatEther(votePowerAccount1)}`)

    // transfer tokens

    // Self delegate
    const delegateTx2 = await contract.connect(account1).delegate(account1.address);
    const delegateTx2Receipt = await delegateTx.wait();
    console.log(`Tokens delegated at block ${delegateTxReceipt.blockNumber}`)

    // check voting power again


}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})
