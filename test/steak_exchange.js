const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SteakExchange", function () {
  let steak, signer, random_account;
  const initialSupply = 1000;
  before(async function () {
    // Token for the exchange
    const SteakToken = await ethers.getContractFactory("SteakToken");
    steakToken = await SteakToken.deploy(initialSupply);
    await steakToken.deployed();

    // Exchange itself
    const SteakExchange = await ethers.getContractFactory("SteakExchange");
    steakExchange = await SteakExchange.deploy(steakToken.address);
    await steakExchange.deployed();

    // Signer / Owner
    [signer, , random_account] = await ethers.getSigners();
  });

  it("Should be able to get ETH price", async function () {
    expect(true);
  });

  it("Should be able to get Steak price", async function () {
    expect(true);
  });

  it("Should be able to create the LP pool for ETH-STEAK", async function () {
    expect(true);
  });

  it("Should be able to swap ETH for Steak tokens", async function () {
    expect(true);
  });

  it("Should be able to swap Steak tokens for ETH", async function () {
    expect(true);
  });

  it("Should be able to add liquidity to the pool", async function () {
    const steakBalance = await steakToken.balanceOf(signer.address);
    const etherPool = ethers.utils.parseUnits("100", "ether");
    const lp = await steakExchange.createPool(steakBalance, {
      value: etherPool,
    });
    lp.wait();

    const approve = await steakToken.approve(
      steakExchange.address,
      ethers.utils.parseEther("9999999999999999999999999").toString()
    );
    approve.wait();

    await steakExchange.addLiquidity({
      value: etherPool,
    });

    const currentLiquidity = await steakExchange.token_reserves();
    const currentLiquidity2 = await steakExchange.eth_reserves();
    const currentLiquidity3 = await steakExchange.totalLP();

    console.log(currentLiquidity);
    console.log(currentLiquidity2);
    console.log(currentLiquidity3);
    expect(true);
  });

  it("Should be able to add remove some owned liquidity from the pool", async function () {
    expect(true);
  });

  it("Should be able to remove all owned liquidity from the pool", async function () {
    expect(true);
  });

  it("Should be able to reinvest fees", async function () {
    expect(true);
  });
});
