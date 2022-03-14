import React from 'react';
import { useExchange } from '../context/ExchangeContext';

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
          <strong>Token/ETH Rate:</strong> {tokenEthRate}
        </span>
        <br />

        <span>
          <strong>ETH/Token Rate:</strong> {ethTokenRate}
        </span>
        <br />
        <span>
          <strong>Your liquidity:</strong> {walletLiquidity}
        </span>
        <br />
      </div>
    </div>
  );
}
