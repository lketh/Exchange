const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("SteakExchange", function () {
  let steakToken, steakExchange, signer, random_account;
  // ETH supply amount (100ETH)
  const initialSteakSupply = ethers.utils.parseEther("21000");
  const initialETHSupply = ethers.utils.parseEther("1000");

  before(async function () {
    // deploy SteakToken with initialSteakSupply of 1000
    const SteakToken = await ethers.getContractFactory("SteakToken");
    steakToken = await SteakToken.deploy(initialSteakSupply);
    await steakToken.deployed();

    // deploy Exchange
    const SteakExchange = await ethers.getContractFactory("SteakExchange");
    steakExchange = await SteakExchange.deploy(steakToken.address);
    await steakExchange.deployed();

    // Signer / Owner
    [signer, , random_account] = await ethers.getSigners();
  });

  it("Create and initialize the pool", async function () {
    // Balance of STEAK in SteakToken Contract
    const steakTokenBalance = await steakToken.balanceOf(signer.address);

    console.log(
      "steakTokenBalance: ",
      ethers.utils.formatEther(steakTokenBalance)
    );

    // approve SteakExchange to spend STEAK on SteakToken contract's behalf
    const approveSteakTokenTxn = await steakToken.approve(
      steakExchange.address,
      steakTokenBalance
    );
    approveSteakTokenTxn.wait();

    // Creat Pool (2000 STEAK, 1000 ETH)
    const lp = await steakExchange.createPool(steakTokenBalance, {
      value: initialETHSupply
    });
    lp.wait();

    //
    const ethBalance = await waffle.provider.getBalance(steakExchange.address);
    console.log("ethBalance: ", ethers.utils.formatEther(ethBalance));
  });

  it("Should have 2000 STEAKs reserved", async () => {
    // should have 2000 STEAKs reserved
    const steakReserves = await steakExchange.token_reserves();
    expect(steakReserves).to.equal(initialSteakSupply);
    console.log("steakReserves: ", ethers.utils.formatEther(steakReserves));
  });

  it("Should have 100 ETH reserved", async () => {
    // should have 100 ETH reserved
    const ethReserves = await steakExchange.eth_reserves();
    expect(ethReserves).to.equal(initialETHSupply);
    console.log("ethReserves: ", ethers.utils.formatEther(ethReserves));
  });

  it("Should be able to get ETH price", async function () {
    console.log(
      "eth reserves: ",
      ethers.utils.formatEther(await steakExchange.eth_reserves())
    );
    // TODO: fix the issue (ETH price being 0)
    console.log(
      "ETH price: ",
      ethers.utils.formatEther(await steakExchange.priceETH())
    );
  });

  it("Should be able to get Steak price", async function () {
    console.log(
      "STEAK price: ",
      ethers.utils.formatEther(await steakExchange.priceToken())
    );
  });

  // it("Should be able to create the LP pool for ETH-STEAK", async function () {

  // });

  it("Should be able to swap ETH for Steak tokens", async function () {
    // STEAK reserve before swap
    const originalSteakReserves = await steakExchange.token_reserves();
    // ETH reserve before swap
    const originalETHReserves = await steakExchange.eth_reserves();

    // swap - pay 100ETH and get STEAK token
    const ethAmount = ethers.utils.parseEther("100");
    await steakExchange.swapETHForTokens({ value: ethAmount });

    // steak/eth reserve after swap
    const steakReserves = await steakExchange.token_reserves();
    const ethReserves = await steakExchange.eth_reserves();

    // checks the difference of reserve before and after swap
    const steakReservesDiff = originalSteakReserves.sub(steakReserves);
    const ethReservesDiff = ethReserves.sub(originalETHReserves);

    // EOA's final STEAk balance
    const steakBalanceAfterSwap = await steakToken.balanceOf(signer.address);

    // checks if the EOA received STEAK he bought
    expect(steakBalanceAfterSwap).to.equal(steakReservesDiff);
    // checks if the pool gained ETH paid
    expect(ethReservesDiff).to.equal(ethAmount);
  });

  it("Should be able to swap Steak tokens for ETH", async function () {
    // STEAK reserve before swap
    const originalSteakReserves = await steakExchange.token_reserves();
    // ETH reserve before swap
    const originalETHReserves = await steakExchange.eth_reserves();

    // 1000 STEAK
    const steakAmount = ethers.utils.parseEther("1000");

    // approval
    const approveTxn = await steakToken.approve(
      steakExchange.address,
      steakAmount
    );
    await approveTxn.wait();

    // swap - pay 1000 STEAK and get ETH
    await steakExchange.swapTokensForETH(steakAmount);

    // steak/eth reserve after swap
    const steakReserves = await steakExchange.token_reserves();
    const ethReserves = await steakExchange.eth_reserves();

    // chceks the difference of reserve before and after swap
    const steakReservesDiff = steakReserves.sub(originalSteakReserves);
    const ethReservesDiff = originalETHReserves.sub(ethReserves);

    // EOA's final ETH balance
    const ethBalanceAfterSwap = await waffle.provider.getBalance(
      signer.address
    );

    // // checks if the pool gained STEAK paid
    // expect(steakReservesDiff).to.equal(steakAmount);
    // // checks if the EOA recieved ETH
    // expect(ethBalanceAfterSwap).to.equal(ethReservesDiff);
  });

  it("Should be able to add liquidity to the pool", async function () {
    const steakBalance = await steakToken.balanceOf(signer.address);

    console.log("steakBalance: ", ethers.utils.formatEther(steakBalance));

    const etherPool = ethers.utils.parseEther("10");

    // const lp = await steakExchange.createPool(steakBalance, {
    //   value: etherPool
    // });
    // lp.wait();

    const approve = await steakToken.approve(
      steakExchange.address,
      steakBalance
    );
    approve.wait();

    await steakExchange.addLiquidity({
      value: etherPool
    });

    // const currentLiquidity = await steakExchange.token_reserves();
    // const currentLiquidity2 = await steakExchange.eth_reserves();
    // const currentLiquidity3 = await steakExchange.totalLP();

    // console.log(currentLiquidity);
    // console.log(currentLiquidity2);
    // console.log(currentLiquidity3);
    expect(true);
  });

  it("Should be able to add remove some owned liquidity from the pool", async function () {
    // // STEAK/ETH reserve in Exchange before removing
    // const originalSteakReserves = await steakExchange.token_reserves();
    // const originalETHReserves = await waffle.provider.getBalance(
    //   signer.address
    // );
    // // STEAK/ETH balance in EOA before removing
    // const originalSteakBalance = await steakToken.balanceOf(signer.address);
    // const originalETHBalance = await waffle.provider.getBalance(signer.address);

    // console.log(
    //   "originalSteakReserves: ",
    //   ethers.utils.formatEther(originalSteakReserves)
    // );
    // console.log(
    //   "originalETHReserves: ",
    //   ethers.utils.formatEther(originalETHReserves)
    // );
    // console.log(
    //   "originalSteakBalance: ",
    //   ethers.utils.formatEther(originalSteakBalance)
    // );
    // console.log(
    //   "originalETHBalance: ",
    //   ethers.utils.formatEther(originalETHBalance)
    // );

    //* remove liquidity
    const removeAmount = ethers.utils.parseEther("5");
    const removeLiquidityTxn = await steakExchange.removeLiquidity(
      removeAmount
    );
    removeLiquidityTxn.wait();

    // // STEAK/ETH reserve in Exchange before removing
    // const finalSteakReserves = await steakExchange.token_reserves();
    // const finalETHReserves = await waffle.provider.getBalance(signer.address);

    // // STEAK/ETH balance in EOA before removing
    // const finalSteakBalance = await steakToken.balanceOf(signer.address);
    // const finalETHReBalance = await waffle.provider.getBalance(signer.address);

    // console.log(
    //   "finalSteakReserves: ",
    //   ethers.utils.formatEther(finalSteakReserves)
    // );
    // console.log(
    //   "finalETHReserves: ",
    //   ethers.utils.formatEther(finalETHReserves)
    // );
    // console.log(
    //   "finalSteakBalance: ",
    //   ethers.utils.formatEther(finalSteakBalance)
    // );
    // console.log(
    //   "finalETHReBalance: ",
    //   ethers.utils.formatEther(finalETHReBalance)
    // );
  });

  it("Should be able to remove all owned liquidity from the pool", async function () {
    // // STEAK/ETH reserve in Exchange before removing
    // const originalSteakReserves = await steakExchange.token_reserves();
    // const originalETHReserves = await waffle.provider.getBalance(
    //   signer.address
    // );
    // // STEAK/ETH balance in EOA before removing
    // const originalSteakBalance = await steakToken.balanceOf(signer.address);
    // const originalETHBalance = await waffle.provider.getBalance(signer.address);

    // console.log(
    //   "originalSteakReserves: ",
    //   ethers.utils.formatEther(originalSteakReserves)
    // );
    // console.log(
    //   "originalETHReserves: ",
    //   ethers.utils.formatEther(originalETHReserves)
    // );
    // console.log(
    //   "originalSteakBalance: ",
    //   ethers.utils.formatEther(originalSteakBalance)
    // );
    // console.log(
    //   "originalETHBalance: ",
    //   ethers.utils.formatEther(originalETHBalance)
    // );

    const removeAllTxn = await steakExchange.removeAllLiquidity();
    removeAllTxn.wait();

    // // STEAK/ETH reserve in Exchange before removing
    // const finalSteakReserves = await steakExchange.token_reserves();
    // const finalETHReserves = await waffle.provider.getBalance(signer.address);

    // // STEAK/ETH balance in EOA before removing
    // const finalSteakBalance = await steakToken.balanceOf(signer.address);
    // const finalETHReBalance = await waffle.provider.getBalance(signer.address);

    // console.log(
    //   "finalSteakReserves: ",
    //   ethers.utils.formatEther(finalSteakReserves)
    // );
    // console.log(
    //   "finalETHReserves: ",
    //   ethers.utils.formatEther(finalETHReserves)
    // );
    // console.log(
    //   "finalSteakBalance: ",
    //   ethers.utils.formatEther(finalSteakBalance)
    // );
    // console.log(
    //   "finalETHReBalance: ",
    //   ethers.utils.formatEther(finalETHReBalance)
    // );
  });

  it("Should be able to reinvest fees", async function () {
    //   expect(true);
  });
});
