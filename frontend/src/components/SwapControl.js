/* eslint-disable jsx-a11y/heading-has-content */
export default function Footer() {
  const testFunc = () => {
    console.log('test');
  };

  return (
    <div id="swap-control">
      <h4 className="swap-control-title"> Swap Currencies: </h4>
      <label htmlFor="amt-to-swap">Amount:</label>
      <input id="amt-to-swap" type="text" />
      <label htmlFor="max-slippage-swap">Maximum Slippage Percentage:</label>
      <input id="max-slippage-swap" type="text" />
      <div id="swap-control-buttons">
        <button id="swap-eth" onClick={testFunc}>
          aaaa
        </button>
        <button id="swap-token"></button>
      </div>
    </div>
  );
}
