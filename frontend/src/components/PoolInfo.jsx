import React from "react";
import { useExchange } from "../context/ExchangeContext";

export default function PoolInfo() {
  const { tokenLiquidity, ethLiquidity, tokenEthRate, ethTokenRate } =
    useExchange();

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
    </div>
  );
}
