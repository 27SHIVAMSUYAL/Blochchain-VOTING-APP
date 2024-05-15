import React from "react";
import { useEffect, useState } from "react";

const Connected = (props) => {

    const [names, setNames] = useState([]);
    const [showWinner, setShow] = useState(false);
    const [newCandidate, setcandidate] = useState("");


    // Define an effect to fetch and update names when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {

                const fetchedNames = await props.displayCandidates();
                console.log(fetchedNames);
                setNames(fetchedNames);
            } catch (error) {
                console.error("Error fetching names:", error);
            }
        };
        fetchData();
    }, [props.displayCandidates]);
    return (
        <div className="connected-container  " >
            <h1 className="connected-header font-medium text-center text-slate-950" >You are Connected to Metamask</h1>

            <div className=" grid grid-cols-2 gap-2 ">
                <div className="bg-green-400">
                    <p className="connected-account ">Metamask Account: {props.account}</p>
                    <p className=""> with balance {props.balance}</p>
                </div>
                <div className=" grid grid-cols-1">
                    <div className=" text-center ">
                        <h1 className="font-bold text-2xl"> CANDIDATE LIST </h1></div>
                    <button onClick={() => {
                        let can = document.getElementById("can");
                        setNames(props.displayCandidates(can));
                    }}> enter number of election</button>
                    <input id="can" className="bg-red-400 mx-2 placeholder-black" placeholder="Enter the election number"></input>

                    <div className="mx-auto" >



                        {/* names of candidates fetched and displayed here start } */}
                        {names.length > 0 ? (
                            names.map((data, index) => {
                                return <div className="grid grid-cols-2">
                                    <div><h1>{index + 1} {"--"} {data}  </h1></div>
                                    <div> <button onClick={() => { props.vote(index) }} className=" w-32 my-1 rounded-md bg-red-400 font-medium hover:bg-green-400 hover:font-bold"> vote candidate</button> </div>
                                </div>
                            }
                            )) : (<li>names empty</li>)
                        }
                        {/* {names of candidates fetched and displayed here end */}





                    </div>

                </div>
            </div>
            {/* start elections */}
            <div><h1>start elections</h1>
                <button onClick={async () => {
                    let startid = document.getElementById("startid").value;
                    await props.StartElection(startid);
                    document.getElementById("startid").value = "";
                }} className="m-2 bg-red-500 rounded-lg size-12"> start</button>
                <input placeholder="enter duration of election" id="startid"></input>
            </div>


            {/* result box */}
            <div className="m-2">

                <button onClick={() => {
                    let resultid = document.getElementById("resultid");
                    props.getresult(resultid); setShow(!showWinner)
                }} className=" px-6 rounded bg-yellow-500  hover:bg-green-500 hover:font-bold">
                    GET RESULTS
                </button>
                <input id="resultid" placeholder="enter duration of election"></input>
                {showWinner && <h1 className=" font-extrabold text-4xl"> the winner is {props.winner}</h1>}

            </div>


            <div className=" grid grid-cols-3">
                <h1 className="col-span-3 text-center text-4xl">Add Candidate </h1>

                <input id="input" onChange={(event) => { setcandidate(event.target.value) }} className="bg-red-400 mx-2 placeholder-black" placeholder="Enter the name of new candidate "></input>


                <button onClick={() => { let enumber = document.getElementById("enumber"); props.add(enumber, newCandidate); document.getElementById("input").value = ""; }} className=" rounded bg-amber-200 mx-2 hover:bg-green-500 hover:font-bold"> Add New Candidate</button>
                <input id="enumber" className="bg-red-400 mx-2 placeholder-black" placeholder="Enter the number of election "></input>

            </div>



        </div>
    )
}

export default Connected;