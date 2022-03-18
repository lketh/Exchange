import { ethers } from "ethers";
import React from "react";
import { useExchange } from "../context/ExchangeContext";
import { useWallet } from "../context/WalletContext";
import { useSteak } from "../context/SteakContext";

export default function Swap() {
  //   const [openTab, setOpenTab] = useState(1);
  // const color = "green";

  const { ethTokenRate, tokenEthRate, steakExchangeContract } = useExchange();
  const [ETHAmount, setETHAmount] = React.useState(0);
  const [SteakAmount, setSteakAmount] = React.useState(0);
  const { steakContract } = useSteak();
  const { walletAddress } = useWallet();

  async function executeBuySteak() {
    if (steakExchangeContract) {
      try {
        console.log("estimatedPriceForSteak: ", ethTokenRate * SteakAmount);
        await steakExchangeContract.swapETHForTokens({
          value: ethers.utils.parseUnits(
            (ethTokenRate * SteakAmount).toString(),
            "ether"
          ),
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function executeBuyETH() {
    if (steakExchangeContract) {
      try {
        const allowance = await steakContract.allowance(
          walletAddress,
          steakExchangeContract.address
        );

        if (!(allowance > 0)) {
          const approve = await steakContract.approve(
            steakExchangeContract.address,
            ethers.utils.parseEther("9999999999999999999999999").toString()
          );
          approve.wait();
        }

        await steakExchangeContract.swapTokensForETH(
          ethers.utils.parseEther(SteakAmount.toString()).toString()
        );
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <div className="grid grid-cols-1">
      <div id="buyToken" className="mb-5 font-mono text-sm mt-2">
        From ETH to Steak
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-2xl"
          placeholder="$STEAK"
          onChange={(e) => {
            if (
              e.target.value === undefined ||
              e.target.value === null ||
              e.target.value === ""
            ) {
              setSteakAmount("0");
            } else {
              setSteakAmount(e.target.value);
            }
          }}
        />
        <div className="flex justify-end text-sm text-gray-500 mb-4">
          {SteakAmount * ethTokenRate} ETH
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 w-full rounded"
          onClick={() => executeBuySteak()}
        >
          Swap
        </button>
      </div>

      <div id="buyETH" className="mb-3 mt-8 font-mono text-sm">
        From Steak to ETH
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-2xl"
          placeholder="$ETH"
          onChange={(e) => {
            if (
              e.target.value === undefined ||
              e.target.value === null ||
              e.target.value === ""
            ) {
              setETHAmount("0");
            } else {
              setETHAmount(e.target.value);
            }
          }}
        />
        <div className="flex justify-end text-sm text-gray-500 mb-4">
          {ETHAmount * tokenEthRate} Steak
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 w-full rounded"
          onClick={() => executeBuyETH()}
        >
          Swap
        </button>
      </div>
    </div>
  );
}
