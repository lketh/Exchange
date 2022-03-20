import React from "react";
import {useExchange} from "../context/ExchangeContext";

export default function PoolInfo() {
  const {tokenLiquidity, ethLiquidity} = useExchange();

  return (
    <div className="mx-4 mt-4 flex">
      <div className="w-1/2 justify-start flex ">
        {" "}
        ETH Liquidity: {ethLiquidity}
      </div>
      <div className="w-1/2 justify-end flex ">
        Steak Liquidity: {tokenLiquidity}
      </div>
    </div>
  );
}
