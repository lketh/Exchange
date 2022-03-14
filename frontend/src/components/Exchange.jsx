import { ethers } from "ethers";
import React from "react";
import { useExchange } from "../context/ExchangeContext";
import Button from "./Button";
import InputField from "./InputField";

export default function Exchange() {
  const { ethTokenRate, steakExchangeContract } = useExchange();
  const [amount, setAmount] = React.useState(0);

  async function executeBuySteak() {
    if (steakExchangeContract) {
      try {
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
      <span>
        <strong>Eth Given Tokens:</strong>
        {amount * ethTokenRate}
      </span>
      <br />
      <InputField
        placeholder="Trade ETH for STEAK"
        onChange={(e) => {
          setAmount(e.target.value);
          if (
            e.target.value == undefined ||
            e.target.value == null ||
            e.target.value == ""
          ) {
            setAmount("0");
          } else {
            setAmount(e.target.value);
          }
        }}
      />
      <br />
      <Button onClick={() => executeBuySteak()}>Trade ETH to STEAK</Button>
      <br />
      <br />
      <Button onClick={() => executeBuyETH()}>Trade STEAK to ETH</Button>
    </div>
  );
}
