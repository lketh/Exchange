import { ethers } from 'ethers';
import React from 'react';
import { useExchange } from '../context/ExchangeContext';
import Button from './Button';
import InputField from './InputField';

export default function Exchange() {
  const { ethTokenRate, tokenEthRate, steakExchangeContract } = useExchange();
  const [amount, setAmount] = React.useState(0);
  // const [estimatedPriceForSteak, setEstimatedPriceForSteak] = React.useState('0');
  // const [estimatedPriceForETH, setEstimatedPriceForETH] = React.useState('0');

  // async function getEstimatedPriceForSteak() {
  //   if (steakExchangeContract) {
  //     try {
  //       console.log('ethTokenRate: ', ethTokenRate);
  //       console.log('ethTokenRate: ', ethTokenRate);
  //       console.log('amount: ', amount);
  //       const minTokenPriceInEth = ethTokenRate * amount;
  //       setEstimatedPriceForSteak(minTokenPriceInEth);
  //       console.log('minTokenPriceInEth: ', minTokenPriceInEth);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }

  // async function getEstimatedPriceForETH() {
  //   if (steakExchangeContract) {
  //     try {
  //       console.log('tokenEthRate: ', tokenEthRate);
  //       console.log('amount: ', amount);
  //       const minETHPriceInToken = tokenEthRate * amount;
  //       setEstimatedPriceForETH(minETHPriceInToken);
  //       console.log(
  //         '🚀 ~ file: Exchange.jsx ~ line 30 ~ getEstimatedPriceForETH ~ minETHPriceInToken',
  //         minETHPriceInToken
  //       );
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }

  async function executeBuySteak() {
    // await getEstimatedPriceForSteak(amount);

    if (steakExchangeContract) {
      try {
        console.log('estimatedPriceForSteak: ', ethTokenRate * amount);
        await steakExchangeContract.swapETHForTokens({
          value: ethers.utils.parseUnits(
            (ethTokenRate * amount).toString(),
            'ether'
          )
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function executeBuyETH() {
    // await getEstimatedPriceForETH(amount);

    if (steakExchangeContract) {
      try {
        console.log('estimatedPriceForETH: ', tokenEthRate * amount);
        await steakExchangeContract.swapTokensForETH(tokenEthRate * amount);
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <div className="mt-2">
      <InputField
        placeholder="Trade ETH for STEAK"
        onChange={(e) => {
          setAmount(e.target.value);
          if (
            e.target.value == undefined ||
            e.target.value == null ||
            e.target.value == ''
          ) {
            setAmount('0');
            // setEstimatedPriceForSteak('0');
            // setEstimatedPriceForETH('0');
          } else {
            setAmount(e.target.value);
            // getEstimatedPriceForETH(e.target.value);
            // getEstimatedPriceForSteak(e.target.value);
          }
        }}
      />
      <br />
      <Button onClick={() => executeBuySteak()}>Trade ETH to STEAK</Button>
      <br />
      <br />
      <Button onClick={() => executeBuyETH()}>Trade STEAK to ETH</Button>
    </div>
  );
}
