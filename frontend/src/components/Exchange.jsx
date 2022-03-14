import React from "react";
import { ethers } from "ethers";
import { useExchange } from "../context/ExchangeContext";
import Button from "./Button";
import InputField from "./InputField";

export default function Exchange() {
  const { ethTokenRate, tokenEthRate, contract } = useExchange();
  const [amountToken, setAmountToken] = React.useState(0);
  const [amountEth, setAmountEth] = React.useState(0);
  const [estimatedPriceInEth, setEstimatedPriceInEth] = React.useState("0");
  const [estimatedPriceInToken, setEstimatedPriceInToken] = React.useState("0");

  // Buy token with eth
  async function getEstimatedPriceInEth(amount) {
    if (contract) {
      try {
        const minTokenPriceInEth = ethTokenRate * amount;
        setEstimatedPriceInEth(minTokenPriceInEth);
      } catch (err) {
        console.log(err);
      }
    }
  }

  // // Buy eth with token
  // async function getEstimatedPriceInToken(amount) {
  //   if (contract) {
  //     try {
  //       const minEthPriceInToken = tokenEthRate * amount;
  //       setEstimatedPriceInToken(minEthPriceInToken);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // }

  // Buy token with eth
  async function executeBuyToken() {
    if (contract) {
      try {
        await contract.swapETHForTokens(amountToken, {
          value: ethers.utils.parseUnits(
            estimatedPriceInEth.toString(),
            "ether"
          ),
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  // // Buy ETH with token
  // async function executeBuyEth() {
  //   if (contract) {
  //     try {
  //       await contract.swapTokensForETH(amountEth, {
  //         value: ethers.utils.parseUnits(
  //           estimatedPriceInToken.toString(),
  //           "Steak"
  //         ),
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // }

  function updatePriceInEth(amount) {
    if (amount == undefined || amount == null || amount == "") {
      setEstimatedPriceInEth("0");
    } else {
      getEstimatedPriceInEth(amount);
    }
  }

  React.useEffect(() => {
    updatePriceInEth(amountToken);
  }, [amountToken]);

  return (
    <div className="mt-2">
      {/* Buy token with eth */}
      <InputField
        placeholder="Buy Steak"
        onChange={(e) => {
          setAmountToken(e.target.value.toString());
        }}
      />
      <Button onClick={() => executeBuyToken()}>Trade</Button>
      <br />

      {/* Buy eth with token
      <InputField
        placeholder="Buy ETH"
        onChange={(e) => {
          setAmountEth(e.target.value.toString());
          if (
            e.target.value == undefined ||
            e.target.value == null ||
            e.target.value == ""
          ) {
            setEstimatedPriceInToken("0");
          } else {
            getEstimatedPriceInToken(e.target.value);
          }
        }}
      />
      <Button onClick={() => executeBuyEth()}>Trade</Button> */}
    </div>
  );
}
