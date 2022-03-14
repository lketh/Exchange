import { ethers } from "ethers";
import React from "react";
import { useExchange } from "../context/ExchangeContext";
import Button from "./Button";
import InputField from "./InputField";

export default function Exchange() {
  const { ethTokenRate, steakExchangeContract } = useExchange();
  const [amount, setAmount] = React.useState(0);
  const [estimatedPrice, setEstimatedPrice] = React.useState("0");

  async function getEstimatedPrice() {
    if (steakExchangeContract) {
      try {
        const minTokenPriceInEth = ethTokenRate * amount * 10;
        setEstimatedPrice(minTokenPriceInEth);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function executeTrade() {
    if (steakExchangeContract) {
      try {
        await steakExchangeContract.swapETHForTokens(amount, {
          value: ethers.utils.parseUnits(estimatedPrice.toString(), "ether"),
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="mt-2">
      <InputField
        placeholder="Trade ETH for STEAK"
        onChange={(e) => {
          setAmount(e.target.value.toString());
          console.log(e.target.value);
          if (
            e.target.value === undefined ||
            e.target.value === null ||
            e.target.value === ""
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
