export default function LiquidityControlTitle() {
  return (
    <div id="liquidity-control">
      <h4 className="liquidity-control-title"> Adjust Liquidity: </h4>
      <label htmlFor="amt-eth">Amount in Eth:</label>
      <input id="amt-eth" type="text" />
      <label htmlFor="max-slippage-liquid">Maximum Slippage Percentage:</label>
      <input id="max-slippage-liquid" type="text" />
      <div id="liquidity-control-buttons">
        <button id="add-liquidity">Add Liquidity</button>
        <button id="remove-liquidity">Remove Liquidity</button>
        <button id="remove-all-liquidity">Remove All Liquidity</button>
      </div>
    </div>
  );
}
