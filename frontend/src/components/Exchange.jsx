// import React, { useState } from "react";
import {useExchange} from "../context/ExchangeContext";
// import Button from "./Button";
// import InputField from "./InputField";
export default function Exchange() {
  // const [newGreeting, setNewGreeting] = useState("");
  const {tokenLiquidity, ethLiquidity, tokenEthRate, ethTokenRate} =
    useExchange();

  return (
    <div className="mt-2">
      <div>
        <h2>Pool information</h2>
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

      {/* <InputField */}
      {/*   value={newGreeting} */}
      {/*   placeholder="new greeting" */}
      {/*   onChange={(e) => setNewGreeting(e.target.value)} */}
      {/* /> */}
      <br />
      {/* <Button onClick={() => updateGreeting(newGreeting)}> */}
      {/*   Update Greeting */}
      {/* </Button> */}
    </div>
  );
}
