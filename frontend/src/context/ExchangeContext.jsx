import { ethers } from "ethers";
import React from "react";
import { getProvider } from "../provider";
import { useWallet } from "./WalletContext";
import exchangeArtifact from "../artifacts/contracts/Exchange.sol/SteakExchange.json";
import addresses from "../artifacts/contracts/addresses.json";

const initialState = {
  tokenLiquidity: 0,
  ethLiquidity: 0,
  tokenEthRate: 0,
  ethTokenRate: 0,
  walletLiquidity: 0,
};

const ExchangeContext = React.createContext(initialState);

export const ExchangeProvider = ({ children }) => {
  const { walletAddress } = useWallet();

  const [contract, setContract] = React.useState();
  const [tokenLiquidity, setTokenLiquidity] = React.useState(0);
  const [ethLiquidity, setEthLiquidity] = React.useState(0);
  const [tokenEthRate, setTokenEthRate] = React.useState(0);
  const [ethTokenRate, setEthTokenRate] = React.useState(0);
  const [walletLiquidity, setWalletLiquidity] = React.useState(0);

  React.useEffect(() => {
    async function init() {
      const _provider = await getProvider();
      const signer = _provider.getSigner();
      const _contract = new ethers.Contract(
        addresses.SteakExchangeAddress,
        exchangeArtifact.abi,
        signer
      );
      setContract(_contract);
      setTokenLiquidity(await getTokenLiquidity());
      setEthLiquidity(await getEthLiquidity());
      setTokenEthRate(await getTokenEthRate());
      setEthTokenRate(await getEthTokenRate());
      setWalletLiquidity(await getWalletLiquidity());
      console.log("Finish init steakExchange");
    }

    if (walletAddress) {
      init();
    }
  }, [walletAddress, tokenLiquidity, ethLiquidity]);

  async function getTokenLiquidity() {
    if (contract) {
      try {
        const liquidity = (await contract.token_reserves()) * 10 ** -18;
        return liquidity;
      } catch (err) {
        console.log(err);
      }
    }
  }
  async function getEthLiquidity() {
    if (contract) {
      try {
        return (await contract.eth_reserves()) * 10 ** -18;
      } catch (err) {
        console.log(err);
      }
    }
  }
  async function getTokenEthRate() {
    if (contract) {
      try {
        return tokenLiquidity / ethLiquidity;
      } catch (err) {
        console.log(err);
      }
    }
  }
  async function getEthTokenRate() {
    if (contract) {
      try {
        return ethLiquidity / tokenLiquidity;
      } catch (err) {
        console.log(err);
      }
    }
  }
  async function getWalletLiquidity() {
    if (contract && walletAddress) {
      try {
        return ethers.utils.formatEther(
          (await contract.poolLP(walletAddress)).toString()
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <ExchangeContext.Provider
      value={{
        tokenLiquidity: tokenLiquidity,
        ethLiquidity: ethLiquidity,
        tokenEthRate: tokenEthRate,
        ethTokenRate: ethTokenRate,
        steakExchangeContract: contract,
        walletLiquidity: walletLiquidity,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = () => React.useContext(ExchangeContext);
