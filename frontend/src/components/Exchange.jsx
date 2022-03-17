import { ethers } from "ethers";
import React from "react";
import { useExchange } from "../context/ExchangeContext";
import { useWallet } from "../context/WalletContext";
import { useSteak } from "../context/SteakContext";
import Button from "./Button";
import InputField from "./InputField";

export default function Exchange() {
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
          )
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
    <div className="mt-2">
      <label className="block">
        {/* Buying Token */}
        <span className="block text-sm font-medium text-slate-700">
          Estimated amount in ETH:
        </span>
        {SteakAmount * ethTokenRate}
        <span className="block text-sm font-medium text-slate-700">
          Amount in STEAK
        </span>

        <InputField
          placeholder="$ STEAK"
          onChange={(e) => {
            setSteakAmount(e.target.value);
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
        <br />
        <Button onClick={() => executeBuySteak()}>Trade ETH to STEAK</Button>
        <br />
        <br />

        {/* Buying ETH */}
        <span className="block text-sm font-medium text-slate-700">
          Estimated amount in STEAK:
        </span>
        {ETHAmount * tokenEthRate}
        <span className="block text-sm font-medium text-slate-700">
          Amount in ETH
        </span>
        <InputField
          placeholder="$ ETH"
          onChange={(e) => {
            setETHAmount(e.target.value);
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
        <br />
        <Button onClick={() => executeBuyETH()}>Trade STEAK to ETH</Button>
      </label>
    </div>
  );
}
