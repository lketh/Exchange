import { ethers } from "ethers";
import React from "react";
import { useExchange } from "../context/ExchangeContext";
import { useWallet } from "../context/WalletContext";
import { useSteak } from "../context/SteakContext";

export default function AddRemoveLiquidity() {
  const { steakExchangeContract, walletLiquidity, ethTokenRate, tokenEthRate } =
    useExchange();
  const { steakContract } = useSteak();
  const [addETHAmount, setAddETHAmount] = React.useState("");
  const [addTokenAmount, setAddTokenAmount] = React.useState("");
  const [removeETHAmount, setRemoveETHAmount] = React.useState("");
  const [removeTokenAmount, setRemoveTokenAmount] = React.useState("");
  const { walletAddress } = useWallet();

  async function removeLiquidity() {
    if (steakExchangeContract) {
      try {
        await steakExchangeContract.removeLiquidity(removeETHAmount);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function removeAllLiquidity() {
    if (steakExchangeContract) {
      try {
        await steakExchangeContract.removeAllLiquidity();
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function addLiquidity() {
    if (steakExchangeContract && steakContract) {
      try {
        const allowance = await steakContract.allowance(
          walletAddress,
          steakExchangeContract.address
        );

        if (!(allowance > 0)) {
          // TODO: approve only the amount of STEAK needed
          const approve = await steakContract.approve(
            steakExchangeContract.address,
            ethers.utils.parseEther("9999999999999999999999999").toString()
          );
          approve.wait();
        }

        await steakExchangeContract.addLiquidity({
          value: ethers.utils.parseEther(addETHAmount).toString(),
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  function formatWalletLiquidity() {
    if (typeof walletLiquidity === "string" && +walletLiquidity > 0) {
      return (+walletLiquidity).toFixed(3);
    } else {
      return walletLiquidity;
    }
  }

  return (
    <div className="grid grid-cols-1">
      <div className="mb-6 font-mono text-sm mt-2">
        <h3>Your current LP position</h3>
        <div className="my-4 text-3xl text-center font-mono">
          {formatWalletLiquidity()}
        </div>
      </div>
      <div className="mb-6 font-mono text-sm">
        Add liquidity
        <div className="flex">
          <input
            className="bg-gray-200 appearance-none mb-4 border-2 border-gray-200 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-2xl"
            placeholder="$ETH"
            value={addETHAmount}
            onChange={(e) => {
              setAddETHAmount(e.target.value.toString());
              setAddTokenAmount(e.target.value.toString() * tokenEthRate);
            }}
          />
          <div className="text-2xl flex justify-center items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            className="bg-gray-200 appearance-none mb-4 border-2 border-gray-200 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-2xl"
            placeholder="$Steak"
            value={addTokenAmount}
            onChange={(e) => {
              setAddTokenAmount(e.target.value.toString());
              setAddETHAmount(e.target.value.toString() * ethTokenRate);
            }}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={() => addLiquidity()}
        >
          Add Liquidity
        </button>
      </div>

      <div className="font-mono text-sm mt-8">
        Remove liquidity
        <div className="flex">
          <input
            className="bg-gray-200 appearance-none mb-4 border-2 border-gray-200 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-2xl"
            placeholder="$ETH"
            value={removeETHAmount}
            onChange={(e) => {
              setRemoveETHAmount(e.target.value.toString());
              setRemoveTokenAmount(e.target.value.toString() * tokenEthRate);
            }}
          />
          <div className="text-2xl flex justify-center items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            className="bg-gray-200 appearance-none mb-4 border-2 border-gray-200 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-2xl"
            placeholder="$Steak"
            value={removeTokenAmount}
            onChange={(e) => {
              setRemoveTokenAmount(e.target.value.toString());
              setRemoveETHAmount(e.target.value.toString() * ethTokenRate);
            }}
          />
        </div>
        {/* <input
          className="bg-gray-200 appearance-none mb-4 border-2 border-gray-200 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-2xl"
          placeholder="$ETH"
          onChange={(e) => {
            if (
              e.target.value === undefined ||
              e.target.value === null ||
              e.target.value === ""
            ) {
              setRemoveAmount("0");
            } else {
              setRemoveAmount(
                ethers.utils.parseEther(e.target.value.toString())
              );
            }
          }}
        /> */}
        <div className="flex space-x-2 mb-4 justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => removeLiquidity()}
          >
            Remove Liquidity
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => removeAllLiquidity()}
          >
            Remove all liquidity
          </button>
        </div>
      </div>
    </div>
  );
}
