import React, { useState } from "react";

const MyAccount = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  // const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect metamask");

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Metamask connected");
        });
    } else {
      setErrorMessage("Please install metamask first");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount);
  };

  const getUserBalance = (address) => {};

  return (
    <div class="panel panel_right">
      <h2>My Account</h2>
      <button className="" onClick={connectWalletHandler}>
        {connButtonText}
      </button>
      <div>
        <h4 className="">{defaultAccount}</h4>
      </div>
      {errorMessage}
    </div>
  );
};

export default MyAccount;
