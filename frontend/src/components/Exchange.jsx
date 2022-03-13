import { ethers } from "ethers";
import React, { useState } from "react";
import { useExchange } from "../context/ExchangeContext";
import Button from "./Button";
import InputField from "./InputField";

export default function Exchange() {
  const { tokenLiquidity, ethLiquidity, tokenEthRate, ethTokenRate, contract } =
    useExchange();
  const [amount, setAmount] = React.useState(0);

  async function executeTrade(amount) {
    if (contract) {
      try {
        const minEth = await contract.amountETHGivenToken(amount);
        console.log("minEth: ", ethers.utils.formatEther(minEth));
        await contract.swapETHForTokens(tokenEthRate * 1.1, { value: minEth });
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="mt-2">
      <InputField
        placeholder="Trade ETH for STEAK"
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />
      <Button onClick={() => executeTrade(amount)}>Trade</Button>
    </div>
  );
}
