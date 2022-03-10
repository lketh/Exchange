import {ethers} from "ethers";
import React from "react";
import {getProvider} from "../provider";
import {useWallet} from "./WalletContext";
import exchangeArtifact from "../artifacts/contracts/Exchange.sol/SteakExchange.json";
import deployedAddress from "../helpers/deployedAddress.json";

const initialState = {
  greeting: "",
  updateGreeting: () => {},
};

const ExchangeContext = React.createContext(initialState);

export const ExchangeProvider = ({children}) => {
  const {walletAddress} = useWallet();

  const [message, setMessage] = React.useState();
  const [contract, setContract] = React.useState();

  React.useEffect(() => {
    async function init() {
      const _provider = await getProvider();
      const signer = _provider.getSigner();
      const _contract = new ethers.Contract(
        deployedAddress.Exchange,
        exchangeArtifact.abi,
        signer
      );
      setContract(_contract);
      const _greeting = await _contract.greet();
      setMessage(_greeting);
    }
    if (walletAddress) {
      init();
    }
  }, [walletAddress]);

  async function updateGreeting(_greeting) {
    if (contract) {
      try {
        const tx = await contract.setGreeting(_greeting);
        await tx.wait();
        const _newGreeting = await contract.greet();
        setMessage(_newGreeting);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <ExchangeContext.Provider
      value={{
        greeting: message || "",
        updateGreeting,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = () => React.useContext(ExchangeContext);
