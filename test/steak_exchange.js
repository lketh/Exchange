const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SteakExchange", function () {
  let steakToken, steakExchange, signer, random_account;
  const initialSteakSupply = ethers.utils.parseEther("2000");

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

  it("create and initialize the pool", async function () {
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

    // ETH supply amount (100ETH)
    const initialETHSupply = ethers.utils.parseEther("100");

    // Creat Pool (2000 STEAK, 1000 ETH)
    const lp = await steakExchange.createPool(steakTokenBalance, {
      value: initialETHSupply
    });
    lp.wait();

    // should have 2000 STEAKs in the pool
    const steakBalance = await steakExchange.balanceOf(signer.address);
    expect(steakBalance).to.equal(steakTokenBalance);
    console.log("steakBalance: ", ethers.utils.formatEther(steakBalance));

    // should have 2000 ETH in the pool
    const ethBalance = await steakExchange.balanceOf(signer.address);
    expect(ethBalance).to.equal();

    // should have 100 ETH in the pool
    expect();
  });
});

it("should have 2000 STEAKs in the pool", async () => {
  it("Should be able to get ETH price", async function () {
    console.log("ETH price: ", (await steakExchange.priceETH()).toString());
  });

  it("Should be able to get Steak price", async function () {
    console.log("STEAK price: ", (await steakExchange.priceToken()).toString());
  });

  // it("Should be able to create the LP pool for ETH-STEAK", async function () {
  //   expect(true);
  // });

  // it("Should be able to swap ETH for Steak tokens", async function () {
  //   expect(true);
  // });

  // it("Should be able to swap Steak tokens for ETH", async function () {
  //   expect(true);
  // });

  // it("Should be able to add liquidity to the pool", async function () {
  //   const steakBalance = await steakToken.balanceOf(signer.address);
  //   const etherPool = ethers.utils.parseUnits("100", "ether");
  //   const lp = await steakExchange.createPool(steakBalance, {
  //     value: etherPool
  //   });
  //   lp.wait();

  //   const approve = await steakToken.approve(
  //     steakExchange.address,
  //     ethers.utils.parseEther("9999999999999999999999999").toString()
  //   );
  //   approve.wait();

  //   await steakExchange.addLiquidity({
  //     value: etherPool
  //   });

  //   const currentLiquidity = await steakExchange.token_reserves();
  //   const currentLiquidity2 = await steakExchange.eth_reserves();
  //   const currentLiquidity3 = await steakExchange.totalLP();

  //   console.log(currentLiquidity);
  //   console.log(currentLiquidity2);
  //   console.log(currentLiquidity3);
  //   expect(true);
  // });

  // it("Should be able to add remove some owned liquidity from the pool", async function () {
  //   expect(true);
  // });

  // it("Should be able to remove all owned liquidity from the pool", async function () {
  //   expect(true);
  // });

  // it("Should be able to reinvest fees", async function () {
  //   expect(true);
  // });
});
