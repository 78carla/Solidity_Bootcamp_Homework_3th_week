// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address account, uint256 blockNumber) external view returns (uint256);
}

contract Ballot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    uint256 public targetBlockNumber;
    IMyToken public tokenContract;
    Proposal[] public proposals;
    uint256[] public votingPowerSpent; // TODO implement this in the rest of the code

    // writing a test is good idea

    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _targetBlockNumber) {
        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint proposal, uint256 amount) external {
        require(votingPower(msg.sender) >= amount);
        proposals[proposal].voteCount += amount;
        

        //TODO 
        // require condition msg.sender to have at least amount voting power
        // account the voteCount for prososal of index proposal
    }

    function votingPower(address account) public view returns (uint256) {
        return tokenContract.getPastVotes(account, targetBlockNumber);
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
