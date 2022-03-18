import React from "react";
import { useWallet } from "../context/WalletContext";
import { getTruncatedAddress } from "../helpers";
import { getSignerAddress } from "../provider";

export default function Navbar() {
  const { setWalletAddress, walletAddress } = useWallet();
  const handleConnect = async () => {
    const ethereum = window.ethereum;
    if (ethereum) {
      await ethereum.request({ method: "eth_requestAccounts" });
      const address = await getSignerAddress();
      if (address) {
        setWalletAddress(address);
      }
    }
  };

  return (
    <nav>
      <div className="flex mb-8">
        <div className="w-2/3 px-2">
          <div className="font-mono text-4xl font-medium">Steak Swap</div>
        </div>
        <div className="w-1/3 px-2 flex items-center justify-end">
          {walletAddress ? (
            <div className="font-sans text-base ">
              {getTruncatedAddress(walletAddress)}
            </div>
          ) : (
            <button
              className="bg-transparent hover:bg-black-500 text-black-700 font-semibold hover:text-blue-500 py-1 px-4 border border-black hover:border-transparent rounded"
              onClick={handleConnect}
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
