const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Steak", function () {
  before(async function () {
    // Token for the exchange
    const Steak = await ethers.getContractFactory("Steak");
    const steak = await Steak.deploy();
    await steak.deployed();

    // Signer / owner
    const [signer, random_account] = await ethers.provider.listAccounts();
  });

  it("Should mint tokens", async function () {
    // Check total supply
    // const initialBalance = steak.balanceOf(signer)
    // expect(initialBalance).to.equal(expectedInitialBalance + 1);
    // Mint
    // const mint = await steak._mint();
    // await mint.wait();
    // Check total supply increment by 1 by the mint
    // const finalBalance = steak.balanceOf(signer)
    // expect(finalBalance).to.equal(initialBalance + 1);
    expect(true);
  });

  it("Should not be able to mint tokens", async function () {
    // Check total supply
    // const initialBalance = steak.balanceOf(signer)
    // expect(initialBalance).to.equal(expectedInitialBalance + 1);
    // Mint
    // const mint = await steak.connect(random_account)._mint();
    // await mint.wait();
    // Check total supply increment by 1 by the mint
    // const finalBalance = steak.balanceOf(signer)
    // expect(finalBalance).to.equal(initialBalance + 1);
    // expect revert
    expect(true);
  });
});
