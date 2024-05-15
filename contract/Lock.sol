pragma solidity >=0.7.0 <0.9.0;

// 0xf5d54295ebca124c377209aea8738539ab72fced
//contract address

// blocknumber
//5889574
contract Upload {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Election {
        Candidate[] candidates;
        uint256 durationOfElection;
        address owner;
        mapping(address => bool) voterList;
        uint256 votingStart;
        uint256 votingEnd;
    }

    Election[] public allElections; // to store list of all elections

    mapping(address => bool) public voters; // to keep record of who has already voted and who has not voted

    address public contract_owner = msg.sender;

    // to start a new election
    function startElection(uint256 _durationOfElection)
        public
        returns (uint256)
    {
        allElections.push();
        uint256 index = allElections.length - 1;
        allElections[index].durationOfElection = _durationOfElection;
        allElections[index].owner = msg.sender;
        allElections[index].votingStart = block.timestamp; // Set the start time as current timestamp
        allElections[index].votingEnd =
            block.timestamp +
            _durationOfElection *
            1 minutes; // Calculate end time

        return index;
    }

    // too add a candidate to a election
    function addCandidateElection(uint256 electionNumber, string memory _name)
        public
    {
        require(allElections.length > 0, "No elections created yet");
        require(
            block.timestamp < allElections[electionNumber].votingEnd,
            "the electionNumber has ended see winner"
        );

        require(
            allElections[electionNumber].owner == msg.sender,
            "you cant add candidates only the starter of the electionNumber can"
        );
        Candidate memory newCandidate;
        newCandidate.name = _name;

        allElections[electionNumber].candidates.push(newCandidate);
    }

    //to get NAMES OF ALL THE CANDIDATES IN AN ELECTION
    function getCandidatesOfElection(uint256 electionNumber)
    public
    view
    returns (string[] memory)
{
    require(allElections.length > 0, "No elections created yet");

    // Create a dynamic array to store candidate names
    string[] memory candidateNames = new string[](allElections[electionNumber].candidates.length);

    // Loop through all candidates and push their names into the array
    for (uint256 c = 0; c < allElections[electionNumber].candidates.length; c++) {
        candidateNames[c] = allElections[electionNumber].candidates[c].name;
    }

    // Return the array of candidate names
    return candidateNames;
}


    // to vote for a candidate in a particular election
    function vote(uint256 electionNumber, uint256 candidateIndex) public {
        require(
            !allElections[electionNumber].voterList[msg.sender],
            "you have already voted here"
        );
        require(
            candidateIndex < allElections[electionNumber].candidates.length,
            "check candidate index"
        );
        require(
            block.timestamp < allElections[electionNumber].votingEnd,
            "the electionNumber has ended see winner"
        );

        allElections[electionNumber].candidates[candidateIndex].voteCount++;
        allElections[electionNumber].voterList[msg.sender] = true;
    }

    // to find the winner of an election
    function findWinner(uint256 electionNumber)
        public
        view
        returns (string memory)
    {
        require(
            electionNumber < allElections.length,
            "Invalid electionNumber index"
        );
        require(
            0 < allElections[electionNumber].candidates.length,
            "no candidate present"
        );
        uint256 max = 0;
        string memory winner;
        for (
            uint256 c = 0;
            c < allElections[electionNumber].candidates.length;
            c++
        ) {
            if (allElections[electionNumber].candidates[c].voteCount > max) {
                winner = allElections[electionNumber].candidates[c].name;
                max = allElections[electionNumber].candidates[c].voteCount;
            }
        }
        return winner;
    }
}
