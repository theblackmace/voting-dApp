pragma solidity ^0.4.26;

contract Election {

    address private _owner;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // map candidatesCount to the Candidate
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint public candidatesCount;

    constructor() public {
        _owner = msg.sender;
        _addCandidate("Bob");
        _addCandidate("Alice");
        _addCandidate("@web3pastel");
    }

    function isOwner() public view returns(bool) {
        return msg.sender == _owner;
    }

    function ownerAddCandidate(string _name) public {
        require(msg.sender == _owner);
        _addCandidate(_name);
    }

    function _addCandidate(string _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function msgSenderVote(uint _candidateId) public {
        _vote(_candidateId);
    }

    function _vote(uint _candidateId) private {
        if(msg.sender == _owner) {
            candidates[_candidateId].voteCount++;
            hasVoted[msg.sender] = true;
        } else {
            require(!hasVoted[msg.sender]);
            require(_candidateId>0 && _candidateId<= candidatesCount);
            candidates[_candidateId].voteCount++;
            hasVoted[msg.sender] = true;
        }
    }
}