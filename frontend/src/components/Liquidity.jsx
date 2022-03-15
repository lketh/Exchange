import { ethers } from "ethers";
import React from "react";
import { useExchange } from "../context/ExchangeContext";
import { useWallet } from "../context/WalletContext";
import { useSteak } from "../context/SteakContext";
import Button from "./Button";
import InputField from "./InputField";

export default function Liquidity() {
  const { steakExchangeContract } = useExchange();
  const { steakContract } = useSteak();
  const [addAmount, setAddAmount] = React.useState(0);
  const [removeAmount, setRemoveAmount] = React.useState(0);
  const { walletAddress } = useWallet();

  async function removeLiquidity() {
    if (steakExchangeContract) {
      try {
        const lpBalance = await steakExchangeContract.poolLP(walletAddress);
        console.log(
          `Wallet LP balance: ${ethers.utils.formatEther(lpBalance)}`
        );
        await steakExchangeContract.removeLiquidity(removeAmount);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function removeAllLiquidity() {
    if (steakExchangeContract) {
      try {
        const lpBalance = await steakExchangeContract.poolLP(walletAddress);
        console.log(
          `Wallet LP balance: ${ethers.utils.formatEther(lpBalance)}`
        );

        const totallpBalance = await steakExchangeContract.totalLP();
        console.log(`total LP: ${ethers.utils.formatEther(totallpBalance)}`);
        await steakExchangeContract.removeAllLiquidity();
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function addLiquidity() {
    if (steakExchangeContract && steakContract) {
      try {
        const allowance = await steakContract.allowance(
          walletAddress,
          steakExchangeContract.address
        );

        if (!(allowance > 0)) {
          // TODO: approve only the amount of STEAK needed
          const approve = await steakContract.approve(
            steakExchangeContract.address,
            ethers.utils.parseEther("9999999999999999999999999").toString()
          );
          approve.wait();
        }

        await steakExchangeContract.addLiquidity({
          value: ethers.utils.parseEther(addAmount).toString(),
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div>
      <label className="block">
        <span className="block text-sm font-medium text-slate-700">
          Add Liquidity
        </span>
        <InputField
          placeholder="Add liquidity in eth (match it with steak)"
          onChange={(e) => {
            if (
              e.target.value === undefined ||
              e.target.value === null ||
              e.target.value === ""
            ) {
              setAddAmount("0");
            } else {
              setAddAmount(e.target.value.toString());
            }
          }}
        />
        <br />
        <Button onClick={() => addLiquidity()}>Add Liquidity</Button>
        <br />
        <br />
        <span className="block text-sm font-medium text-slate-700">
          Remove Liquidity
        </span>
        <InputField
          placeholder="Remove liquidity"
          onChange={(e) => {
            if (
              e.target.value === undefined ||
              e.target.value === null ||
              e.target.value === ""
            ) {
              setRemoveAmount("0");
            } else {
              setRemoveAmount(
                ethers.utils.parseEther(e.target.value.toString())
              );
            }
          }}
        />
        <br />
        <Button onClick={() => removeLiquidity()}>Remove Liquidity</Button>
        <Button onClick={() => removeAllLiquidity()}>
          Remove all liquidity
        </Button>
      </label>
    </div>
  );
}
