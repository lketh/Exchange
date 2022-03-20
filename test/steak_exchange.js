const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("SteakExchange", function () {
  let steakToken, steakExchange, signer;
  const smallNumber = ethers.utils.parseEther("0.001");

  // ETH supply amount (100ETH)
  const initialSteakSupply = ethers.utils.parseEther("1000");
  const initialETHSupply = ethers.utils.parseEther("100");

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
    const steakInEOA = await steakToken.balanceOf(signer.address);

    // approve SteakExchange to spend STEAK on SteakToken contract's behalf
    const approveSteakTokenTxn = await steakToken.approve(
      steakExchange.address,
      steakInEOA
    );
    approveSteakTokenTxn.wait();

    //* Creat Pool (2000 STEAK, 1000 ETH)
    const lp = await steakExchange.createPool(steakInEOA, {
      value: initialETHSupply,
    });
    lp.wait();

    // check reserves in the pool
    const steakInPool = await steakExchange.tokenReserves();
    const ethInPool = await steakExchange.ethReserves();

    //! Checks if the pool has initial supply amount
    expect(steakInPool).to.equal(initialSteakSupply);
    expect(ethInPool).to.equal(initialETHSupply);
  });

  it("Should be able to get STEAK price", async function () {
    const steakInPool = await steakExchange.tokenReserves();
    const ethInPool = await steakExchange.ethReserves();
    const steakPrice = await steakExchange.tokenPrice();

    // checks if : steakPrice == (steakInPool / ethInPool)
    expect(steakPrice).to.equal(steakInPool.div(ethInPool));
  });

  it("Should be able to swap ETH for Steak tokens", async function () {
    // Pool (Before txn)
    const steakInPoolBefore = await steakExchange.tokenReserves();
    const ethInPoolBefore = await steakExchange.ethReserves();

    // EOA (After txn)
    const steakInEOABefore = await steakToken.balanceOf(signer.address);
    const ethInEOABefore = await waffle.provider.getBalance(signer.address);

    //* swap - pay 100ETH and get STEAK token
    const ethAmount = ethers.utils.parseEther("100");
    await steakExchange.swapETHForTokens({ value: ethAmount });

    // Pool (After txn)
    const steakInPoolAfter = await steakExchange.tokenReserves();
    const ethInPoolAfter = await steakExchange.ethReserves();

    // EOA (Before txn)
    const steakInEOAAfter = await steakToken.balanceOf(signer.address);
    const ethInEOAAfter = await waffle.provider.getBalance(signer.address);

    // Pool Diff
    const steakInPoolDiff = steakInPoolAfter.sub(steakInPoolBefore).abs();
    const ethInPoolDiff = ethInPoolAfter.sub(ethInPoolBefore).abs();

    // EOA Diff
    const steakInEOADiff = steakInEOAAfter.sub(steakInEOABefore).abs();
    const ethInEOADiff = ethInEOAAfter.sub(ethInEOABefore).abs();

    // checks if the EOA received STEAK he bought
    expect(steakInEOADiff).to.equal(steakInPoolDiff);
    // checks if the pool gained ETH paid
    expect(steakInPoolDiff).to.be.closeTo(steakInEOADiff, smallNumber);
  });

  it("Should be able to swap Steak tokens for ETH", async function () {
    // Pool (Before txn)
    const steakInPoolBefore = await steakExchange.tokenReserves();
    const ethInPoolBefore = await steakExchange.ethReserves();

    // EOA (After txn)
    const steakInEOABefore = await steakToken.balanceOf(signer.address);
    const ethInEOABefore = await waffle.provider.getBalance(signer.address);

    //* Approval
    const steakAmount = ethers.utils.parseEther("100");
    const approveTxn = await steakToken.approve(
      steakExchange.address,
      steakAmount
    );
    await approveTxn.wait();

    //* Swap - pay 1000 STEAK and get ETH
    await steakExchange.swapTokensForETH(steakAmount);

    // Pool (After txn)
    const steakInPoolAfter = await steakExchange.tokenReserves();
    const ethInPoolAfter = await steakExchange.ethReserves();

    // EOA (Before txn)
    const steakInEOAAfter = await steakToken.balanceOf(signer.address);
    const ethInEOAAfter = await waffle.provider.getBalance(signer.address);

    // Pool Diff
    const steakInPoolDiff = steakInPoolAfter.sub(steakInPoolBefore).abs();
    const ethInPoolDiff = ethInPoolAfter.sub(ethInPoolBefore).abs();

    // EOA Diff
    const steakInEOADiff = steakInEOAAfter.sub(steakInEOABefore).abs();
    const ethInEOADiff = ethInEOAAfter.sub(ethInEOABefore).abs();

    // checks if EOA received ETH he bought
    expect(ethInEOADiff).to.be.closeTo(ethInPoolDiff, smallNumber);
    // check if Pool received STEAK EOA paid
    expect(steakInPoolDiff).to.equal(steakInEOADiff);
  });

  it("Should be able to add liquidity to the pool", async function () {
    // Pool (Before txn)
    const steakInPoolBefore = await steakExchange.tokenReserves();
    const ethInPoolBefore = await steakExchange.ethReserves();

    // EOA (After txn)
    const steakInEOABefore = await steakToken.balanceOf(signer.address);
    const ethInEOABefore = await waffle.provider.getBalance(signer.address);

    //* Approve
    const ethAmount = ethers.utils.parseEther("10");
    const approve = await steakToken.approve(
      steakExchange.address,
      steakInPoolBefore
    );
    approve.wait();

    //* Add Liquidity
    const addLiquidityTxn = await steakExchange.addLiquidity({
      value: ethAmount,
    });
    addLiquidityTxn.wait();

    // Pool (After txn)
    const steakInPoolAfter = await steakExchange.tokenReserves();
    const ethInPoolAfter = await steakExchange.ethReserves();

    // EOA (Before txn)
    const steakInEOAAfter = await steakToken.balanceOf(signer.address);
    const ethInEOAAfter = await waffle.provider.getBalance(signer.address);

    // Pool Diff
    const steakInPoolDiff = steakInPoolAfter.sub(steakInPoolBefore).abs();
    const ethInPoolDiff = ethInPoolAfter.sub(ethInPoolBefore).abs();

    // EOA Diff
    const steakInEOADiff = steakInEOAAfter.sub(steakInEOABefore).abs();
    const ethInEOADiff = ethInEOAAfter.sub(ethInEOABefore).abs();

    expect(steakInPoolDiff).to.equal(steakInEOADiff);
    expect(ethInPoolDiff).to.closeTo(ethInEOADiff, smallNumber);
  });

  it("Should be able to add remove some owned liquidity from the pool", async function () {
    // Pool (Before txn)
    const steakInPoolBefore = await steakExchange.tokenReserves();
    const ethInPoolBefore = await steakExchange.ethReserves();
    const LPBefore = await steakExchange.shares(signer.address);
    // EOA (After txn)
    const steakInEOABefore = await steakToken.balanceOf(signer.address);
    const ethInEOABefore = await waffle.provider.getBalance(signer.address);

    //* Txn : remove liquidity
    const removeETHAmount = ethers.utils.parseEther("5");
    const removeLiquidityTxn = await steakExchange.removeLiquidity(
      removeETHAmount
    );
    removeLiquidityTxn.wait();

    // Pool (After txn)
    const steakInPoolAfter = await steakExchange.tokenReserves();
    const ethInPoolAfter = await steakExchange.ethReserves();
    const LPAfter = await steakExchange.shares(signer.address);
    // EOA (Before txn)
    const steakInEOAAfter = await steakToken.balanceOf(signer.address);
    const ethInEOAAfter = await waffle.provider.getBalance(signer.address);
    // Pool Diff
    const steakInPoolDiff = steakInPoolAfter.sub(steakInPoolBefore).abs();
    const ethInPoolDiff = ethInPoolAfter.sub(ethInPoolBefore).abs();
    // EOA Diff
    const steakInEOADiff = steakInEOAAfter.sub(steakInEOABefore).abs();
    const ethInEOADiff = ethInEOAAfter.sub(ethInEOABefore).abs();

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Checks if steakInPool decrease == steakInEOA increase
    expect(steakInPoolAfter).to.equal(steakInPoolBefore.sub(steakInEOADiff));

    // Checks if ethInPool decrease == ethInEOA increase
    expect(ethInPoolAfter).to.be.closeTo(
      ethInPoolBefore.sub(ethInEOADiff),
      smallNumber
    );
  });

  it("Should be able to remove all owned liquidity from the pool", async function () {
    // Pool (Before txn)
    const steakInPoolBefore = await steakExchange.tokenReserves();
    const ethInPoolBefore = await steakExchange.ethReserves();
    const LPBefore = await steakExchange.shares(signer.address);

    // EOA (After txn)
    const steakInEOABefore = await steakToken.balanceOf(signer.address);
    const ethInEOABefore = await waffle.provider.getBalance(signer.address);

    //* Tnx
    const removeAllTxn = await steakExchange.removeAllLiquidity();
    removeAllTxn.wait();

    // Pool (After txn)
    const steakInPoolAfter = await steakExchange.tokenReserves();
    const ethInPoolAfter = await steakExchange.ethReserves();
    const LPAfter = await steakExchange.shares(signer.address);

    // EOA (Before txn)
    const steakInEOAAfter = await steakToken.balanceOf(signer.address);
    const ethInEOAAfter = await waffle.provider.getBalance(signer.address);

    // Pool Diff
    const steakInPoolDiff = steakInPoolAfter.sub(steakInPoolBefore).abs();
    const ethInPoolDiff = ethInPoolAfter.sub(ethInPoolBefore).abs();

    // EOA Diff
    const steakInEOADiff = steakInEOAAfter.sub(steakInEOABefore).abs();
    const ethInEOADiff = ethInEOAAfter.sub(ethInEOABefore).abs();

    // Checks if LP has became 0
    expect(LPAfter).to.be.closeTo(ethers.utils.parseEther("0"), smallNumber);
    // Checks if steakInPool decrease == steakInEOA increase
    expect(steakInPoolAfter).to.equal(steakInPoolBefore.sub(steakInEOADiff));
    // Checks if ethInPool decrease == ethInEOA increase
    expect(ethInPoolAfter).to.be.closeTo(
      ethInPoolBefore.sub(ethInEOADiff),
      smallNumber
    );
  });
});
