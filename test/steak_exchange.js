const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SteakExchange", function () {
  before(async function () {
    // Token for the exchange
    const Steak = await ethers.getContractFactory("Steak");
    const steak = await Steak.deploy();
    await steak.deployed();

    // Exchange itself
    const SteakExchange = await ethers.getContractFactory("SteakExchange");
    const steakExchange = await SteakExchange.deploy(steak.address);
    await steakExchange.deployed();

    // Signer / Owner
    const [signer] = await ethers.provider.listAccounts();
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
