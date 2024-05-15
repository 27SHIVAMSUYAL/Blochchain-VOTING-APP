import React from "react";


const Login = (props) => {

    return (
        <div className="login-container">
            <h1 className="welcome-message text-center text-orange-700">Welcome to decentralized voting application</h1>
            <div className="  text-center ">
                <button className="login-button text-sm text-center rounded bg-blue-200 p-2 hover:bg-green-100 hover:font-bold" onClick={props.connectWallet}>Login Metamask</button>
              
            </div></div>
    )
}

export default Login;