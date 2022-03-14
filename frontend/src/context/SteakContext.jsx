import { ethers } from "ethers";
import React from "react";
import { getProvider } from "../provider";
import { useWallet } from "./WalletContext";
import steakArtifact from "../artifacts/contracts/SteakToken.sol/SteakToken.json";
import addresses from "../artifacts/contracts/addresses.json";

const initialState = {};

const SteakContext = React.createContext(initialState);
export const SteakProvider = ({ children }) => {
  const { walletAddress } = useWallet();

  const [contract, setContract] = React.useState();

  React.useEffect(() => {
    async function init() {
      const _provider = await getProvider();
      const signer = _provider.getSigner();
      const _contract = new ethers.Contract(
        addresses.SteakTokenAddress,
        steakArtifact.abi,
        signer
      );
      setContract(_contract);
      console.log("Finish init steak");
    }

    if (walletAddress) {
      init();
    }
  }, [walletAddress]);

  return (
    <SteakContext.Provider
      value={{
        steakContract: contract,
      }}
    >
      {children}
    </SteakContext.Provider>
  );
};

export const useSteak = () => React.useContext(SteakContext);
