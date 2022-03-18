import { ethers } from "ethers";
import React from "react";
import { useExchange } from "../context/ExchangeContext";
import { useWallet } from "../context/WalletContext";
import { useSteak } from "../context/SteakContext";
import Button from "./Button";

export default function AddRemoveLiquidity() {
  const { steakExchangeContract } = useExchange();
  const { steakContract } = useSteak();
  const [addAmount, setAddAmount] = React.useState(0);
  const [removeAmount, setRemoveAmount] = React.useState(0);

  const [totalLP, setTotalLP] = React.useState(0);
  const { walletAddress } = useWallet();

  async function removeLiquidity() {
    if (steakExchangeContract) {
      try {
        const lpBalance = await steakExchangeContract.poolLP(walletAddress);
        // console.log(
        //   `Wallet LP balance: ${ethers.utils.formatEther(lpBalance)}`
        // );
        await steakExchangeContract.removeLiquidity(removeAmount);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function removeAllLiquidity() {
    if (steakExchangeContract) {
      try {
        const lpBalance = await steakExchangeContract.poolLP(walletAddress);
        console.log(
          `Wallet LP balance: ${ethers.utils.formatEther(lpBalance)}`
        );
        const totallpBalance = await steakExchangeContract.totalLP();
        console.log(`total LP: ${ethers.utils.formatEther(totallpBalance)}`);
        await steakExchangeContract.removeAllLiquidity();
      } catch (err) {
        console.log(err);
      }
    }
  }

  // not picking up the first value
  async function getTotalLP() {
    if (steakExchangeContract) {
      try {
        const totallpBalance = await steakExchangeContract.totalLP();
        setTotalLP(totallpBalance);
        console.log("totalLP: ", ethers.utils.formatEther(totalLP));
        // setTotalLP(totallpBalance);
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
          value: ethers.utils.parseEther(addAmount).toString(),
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="grid grid-cols-1">
      <div className="mb-6">
        <h3>Your current LP positio (hardcoded rn)</h3>
        <div className="my-4 text-3xl text-center"> 24 ETH + 1000 STEAK </div>
        {/* <div>WalletLiquidity: {walletLiquidity} </div> */}
      </div>
      <div className="mb-6">
        Add liquidity
        <input
          className="bg-gray-200 appearance-none mb-4 border-2 border-gray-200 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          placeholder="$ETH (matching steak)"
          onChange={(e) => {
            if (
              e.target.value === undefined ||
              e.target.value === null ||
              e.target.value === ""
            ) {
              setAddAmount("0");
            } else {
              setAddAmount(e.target.value.toString());
            }
          }}
        />
        <br />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => addLiquidity()}
        >
          Add Liquidity
        </button>
      </div>

      <div>
        Remove liquidity
        <input
          className="bg-gray-200 appearance-none mb-4 border-2 border-gray-200 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
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
        />
        <div className="flex space-x-2 mb-4">
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
          {/* <button className="underline" onClick={() => getTotalLP()}>
          Max
        </button> */}
        </div>
      </div>
    </div>
  );
}