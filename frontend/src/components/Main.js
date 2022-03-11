import React from 'react';
// import styles from './styles/Header.module.css';
import RateDisplay from './RateDisplay';
import LiquidityDisplay from './LiquidityDisplay';
import SwapControl from './SwapControl';
import LiquidityControlTitle from './LiquidityControlTitle';

export default function Main() {
  return (
    <div id="main">
      <div id="main-display">
        <article>
          <RateDisplay></RateDisplay>
          <LiquidityDisplay></LiquidityDisplay>
          <SwapControl></SwapControl>
          <LiquidityControlTitle></LiquidityControlTitle>
        </article>
        <pre id="log"></pre>
      </div>
    </div>
  );
}
