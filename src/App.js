import Login from './components/login';
import './App.css';
import Connected from './components/connected';

import { useState, useEffect } from 'react';
const { ethers } = require("ethers");
function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(null);
  const [winner, setWinner] = useState("null");
  const daiAbi = process.env.daiAbi;// abi imported
  const daiAddress = process.env.daiAddress;// contract address
  // const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
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
        const signer = provider.getSigner();

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
    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
    await daiContract.startElection(duration);
    console.log("you started a election");
  }




  async function getresult(electionNumber) {


    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
    if (await daiContract.findWinner(electionNumber)) {
      setWinner(await daiContract.findWinner(electionNumber));
    }
    const array = await daiContract.getCandidatesOfElection()
    console.log(array);
    for (let c = 0; c < array.length; c++) {
      console.log(array[c][0] + "-" + ethers.utils.formatEther(array[c][1]))

    }
  }

  async function add(electionNumber, name) {
    try {
      const signer = provider.getSigner();
      const daiContract = new ethers.Contract(daiAddress, daiAbi, signer);
      await daiContract.addCandidateElection(electionNumber, name);
      console.log("new candidate added")
    }
    catch (error) {
      console.log(error)
      console.log("YOU CANT ADD CANDIDATE YOU ARE NOT THE CONTRACT DEPLOYER")
    }
  }

  async function vote(electionNumber, candidateIndex) {
    try {
      const signer = provider.getSigner();
      const daiContract = new ethers.Contract(daiAddress, daiAbi, signer);
      await daiContract.vote(electionNumber, candidateIndex);
      console.log("voted for" + { candidateIndex })
    }
    catch (error) {
      console.log(error);
      console.log("you have already voted");
    }

  }

  async function displayCandidates(electionNumber) {
let array;
    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

    try { array = await daiContract.getCandidatesOfElection(electionNumber);
      console.log(array);
     }
    catch (err) { console.log(err); }

    let name = [];
    for (let c = 0; c < array.length; c++) {
      name.push(array[c][0]);

    }
    console.log("level up");
    console.log(array);
    return array;
  }



  return (
    <div>
      <a href='./'><h1 className='text-2xl text-red-400 text-center font-bold'> Voting app </h1></a>
      {isConnected ? (<Connected isConnected={isConnected} account={account} balance={balance} StartElection={StartElection} getresult={getresult} vote={vote} winner={winner} add={add} displayCandidates={displayCandidates} />) : (<Login connectWallet={connectToMetamask} />)}


    </div>
  );
}

export default App;
