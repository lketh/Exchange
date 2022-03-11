const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SteakExchange", function () {
  before(async function () {
    // Token for the exchange
    const Steak = await ethers.getContractFactory("Steak");
    const steak = await Steak.deploy();
    await steak.deployed();
    this.steak = steak;

    // Exchange itself
    const SteakExchange = await ethers.getContractFactory("SteakExchange");
    const steakExchange = await SteakExchange.deploy(steak.address);
    await steakExchange.deployed();
    this.steakExchange = steakExchange;

    // Signer / Owner
    const [signer] = await ethers.provider.listAccounts();
    this.signer = signer;
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
    const createPool = await this.steakExchange.createPool(
      "2000000000000000000",
      {
        value: "2000000000000000000",
      }
    );
    createPool.wait();

    const addLiquidity = await this.steakExchange.addLiquidity(
      "2000000000000000000",
      "1000000000000000000"
    );
    addLiquidity.wait();

    const currentLiquidity = await this.steakExchange.token_reserves();
    const currentLiquidity2 = await this.steakExchange.eth_reserves();
    const currentLiquidity3 = await this.steakExchange.totalLP();

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
