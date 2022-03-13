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
        console.log(ethers.utils.formatEther(minEth));
        await contract.swapETHForTokens(tokenEthRate * 1.1, { value: minEth });
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="mt-2">
      <div>
        <h2 className="ext-3xl font-bold underline">Pool information</h2>
        <br />

        <span>
          <strong>Token Liquidity:</strong> {tokenLiquidity}
        </span>
        <br />

        <span>
          <strong>Eth Liquidity:</strong> {ethLiquidity}
        </span>
        <br />

        <span>
          <strong>Token/eth rate:</strong> {tokenEthRate}
        </span>
        <br />

        <span>
          <strong>ethTokenRate:</strong> {ethTokenRate}
        </span>
        <br />
      </div>

      <InputField
        placeholder="Trade ETH for STEAK"
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />
      <Button onClick={() => executeTrade(amount)}>Trade</Button>
    </div>
  );
}
