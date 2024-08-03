import { useState, useEffect } from 'react';

import Login from './components/login';
import './App.css';
import Connected from './components/connected';

const { ethers } = require("ethers");



function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(null);
  const [winner, setWinner] = useState("");

  // const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
  //env content
  //const daiAbi= 
  const daiAbi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "electionNumber",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addCandidateElection",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_durationOfElection",
          "type": "uint256"
        }
      ],
      "name": "startElection",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "electionNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allElections",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "durationOfElection",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "votingStart",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "votingEnd",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "contract_owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "electionNumber",
          "type": "uint256"
        }
      ],
      "name": "findWinner",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "electionNumber",
          "type": "uint256"
        }
      ],
      "name": "getCandidatesOfElection",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const daiAddress = "0x429574c96738b62a3b1de9c0aaedf8474ab01a0e";
  //env content

  console.log('Loaded ABI:', daiAbi);
  console.log('Loaded Address:', daiAddress);
  useEffect(
    () => {

      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleChange);
      }

    },);


  function handleChange(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);// called to change the address
      connectToMetamask(); // called again to change the balance ie update of new account


    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }


  async function connectToMetamask() {
    if (window.ethereum) {
      try {


        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);

        setSigner(provider.getSigner());

        //address of account connected
        const address = await signer.getAddress();
        setAccount(address);

        //balance of account connected 
        const ammount = ethers.utils.formatEther(await signer.getBalance())
        setBalance(ammount);


        console.log("Metamask Connected : " + address);
        setIsConnected(true);


      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser")
    }
  }


  async function StartElection(duration) {
    const daiContract = new ethers.Contract(daiAddress, daiAbi, signer);

    try {
        // Simulate the call to get the returned index
        const index = await daiContract.callStatic.startElection(duration);
        console.log("Simulated startElection call returned index:", index.toString());

        // Send the transaction to start the election
        const tx = await daiContract.startElection(duration);
        console.log("Transaction sent:", tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction mined:", receipt.transactionHash);

        console.log("Election successfully started with index:", index.toString());
    } catch (error) {
        console.error("Error starting election:", error);
    }
}






  async function getresult(electionNumber) {
    // Check the type of electionNumber
    try {
      const bigNumberElectionNumber = ethers.BigNumber.from(electionNumber);
      const daiContract = new ethers.Contract(daiAddress, daiAbi, signer);
      if (await daiContract.findWinner(bigNumberElectionNumber)) {
        setWinner(await daiContract.findWinner(bigNumberElectionNumber));
      }
      const array = await daiContract.getCandidatesOfElection(bigNumberElectionNumber)
      console.log(array);
      for (let c = 0; c < array.length; c++) {
        console.log(array[c][0] + "-" + ethers.utils.formatEther(array[c][1]))

      }
    }
    catch (err) {
      console.log(err);
    }
  }

  async function add(electionNumber, name) {
    try {


      // Convert to BigNumber
      const bigNumberElectionNumber = ethers.BigNumber.from(electionNumber);

      const daiContract = new ethers.Contract(daiAddress, daiAbi, signer);
      await daiContract.addCandidateElection(bigNumberElectionNumber, name);
      console.log("New candidate added");
    } catch (error) {
      console.error(error);
      console.log("YOU CANT ADD CANDIDATE YOU ARE NOT THE CONTRACT DEPLOYER");
    }
  }



  async function vote(electionNumber, candidateIndex) {
    try {
      const bigNumberElectionNumber = ethers.BigNumber.from(electionNumber);
      const bigNumberCandidateIndex = ethers.BigNumber.from(candidateIndex);
      const daiContract = new ethers.Contract(daiAddress, daiAbi, signer);
      await daiContract.vote(bigNumberElectionNumber, bigNumberCandidateIndex);
      console.log("voted for" + { candidateIndex })
    }
    catch (error) {
      console.log(error);
      console.log("you have already voted");
    }

  }

  async function displayCandidates(electionNumber) {
    let array = [];
    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

    try {
      array = await daiContract.getCandidatesOfElection(electionNumber);
      console.log(array);
    }
    catch (err) { console.log(err); }


    // let name = [];
    // for (let c = 0; c < array.length; c++) {
    //   name.push(array[c]);
    //   console.log(array[c]);

    // }
    // console.log("level up");
    // console.log(array);
    // console.log(name);

    //     const contractOwner = await daiContract.methods.contract_owner().call();
    // console.log(contractOwner)
    return array;

  }



  return (
    <div>
      <a href='./'><h1 className='text-2xl text-red-400 text-center font-bold'> Voting app </h1></a>
      <h2 className='text-2xl text-red-200 text-center font-bold'> YOU NEED META MASK ACCOUNT AND EXTENTION IN YOUR BROWSER  </h2>
      {isConnected ? (<Connected isConnected={isConnected} account={account} balance={balance} StartElection={StartElection} getresult={getresult} vote={vote} winner={winner} add={add} displayCandidates={displayCandidates} />) : (<Login connectWallet={connectToMetamask} />)}


    </div>
  );
}

export default App;
