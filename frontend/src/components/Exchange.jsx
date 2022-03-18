import { ethers } from "ethers";
import React from "react";
import { useExchange } from "../context/ExchangeContext";
import { useWallet } from "../context/WalletContext";
import { useSteak } from "../context/SteakContext";
import Button from "./Button";
import InputField from "./InputField";

export default function Exchange() {
  const { ethTokenRate, steakExchangeContract } = useExchange();
  const [amount, setAmount] = React.useState(0);
  const { steakContract } = useSteak();
  const { walletAddress } = useWallet();

  async function executeBuySteak() {
    if (steakExchangeContract) {
      try {
        console.log("amount_: ", amount);
        console.log("estimatedPriceForSteak: ", ethTokenRate * amount);
        await steakExchangeContract.swapETHForTokens({
          value: ethers.utils.parseUnits(
            (ethTokenRate * amount).toString(),
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
          // TODO: approve only the amount of STEAK needed
          const approve = await steakContract.approve(
            steakExchangeContract.address,
            ethers.utils.parseEther("9999999999999999999999999").toString()
          );
          approve.wait();
        }
        await steakExchangeContract.swapTokensForETH(
          ethers.utils.parseEther(amount.toString()).toString()
        );
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <div className="mt-2">
      <label className="block">
        <span className="block text-sm font-medium text-slate-700">
          Estimated amount in ether:
        </span>
        {amount * ethTokenRate}
        <span className="block text-sm font-medium text-slate-700">
          Amount in steak
        </span>
        <InputField
          placeholder="$STEAK"
          onChange={(e) => {
            if (
              e.target.value === undefined ||
              e.target.value === null ||
              e.target.value === ""
            ) {
              setAmount("0");
            } else {
              setAmount(e.target.value);
              console.log("amountinonChange: ", amount);
            }
          }}
        />
        <br />
        <Button onClick={() => executeBuySteak()}>Trade ETH to STEAK</Button>
        <br />
        <Button onClick={() => executeBuyETH()}>Trade STEAK to ETH</Button>
      </label>
    </div>
  );
}
