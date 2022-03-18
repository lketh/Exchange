import React from "react";
import { useExchange } from "../context/ExchangeContext";

export default function PoolInfo() {
  const {
    tokenLiquidity,
    ethLiquidity,
    tokenEthRate,
    ethTokenRate,
    walletLiquidity,
  } = useExchange();

  return (
    <div className="mt-2">
      Eth Liquidity: {ethLiquidity}
      <br />
      Token Liquidity: {tokenLiquidity}
      <br />
      WalletLiquidity: {walletLiquidity}
    </div>
  );
}
