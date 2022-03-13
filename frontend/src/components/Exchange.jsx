import { ethers } from "ethers";
import React, { useState } from "react";
import { useExchange } from "../context/ExchangeContext";
import Button from "./Button";
import InputField from "./InputField";

export default function Exchange() {
  const { tokenLiquidity, ethLiquidity, tokenEthRate, ethTokenRate, contract } =
    useExchange();
  const [amount, setAmount] = React.useState(0);
  const [estimatedPrice, setEstimatedPrice] = React.useState("0");

  async function getEstimatedPrice() {
    if (contract) {
      try {
        const minTokenPriceInEth = ethTokenRate * amount * 10;
        setEstimatedPrice(minTokenPriceInEth);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function executeTrade() {
    if (contract) {
      try {
        await contract.swapETHForTokens(amount, {
          value: ethers.utils.parseUnits(estimatedPrice.toString(), "ether"),
        });
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

      <strong>
        Estimated price in ETH:
        <span>{estimatedPrice.toString()}</span>
      </strong>
      <br />
      <br />
      <InputField
        placeholder="Trade ETH for STEAK"
        onChange={(e) => {
          setAmount(e.target.value.toString());
          console.log(e.target.value);
          if (
            e.target.value == undefined ||
            e.target.value == null ||
            e.target.value == ""
          ) {
            setEstimatedPrice("0");
          } else {
            getEstimatedPrice(e.target.value);
          }
        }}
      />
      <br />
      <Button onClick={() => executeTrade()}>Trade</Button>
    </div>
  );
}
