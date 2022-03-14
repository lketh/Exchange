const { expect } = require("chai");
const { waffle, ethers } = require("hardhat");

describe("Steak", function () {
  let steak, signer, random_account;
  const initialSupply = 1000;
  before(async function () {
    // Token for the exchange
    const Steak = await ethers.getContractFactory("SteakToken");
    steak = await Steak.deploy("1000");
    await steak.deployed();

    // Signer / owner
    [signer, , random_account] = await ethers.getSigners();
  });

  it("Should mint tokens", async function () {
    // Check total supply
    const initialBalance = ethers.utils.formatEther(
      await steak.balanceOf(signer.address)
    );
    expect(parseInt(initialBalance)).to.equal(initialSupply);

    // Mint
    const mint = await steak.mint(signer.address, 1);
    await mint.wait();

    // Check total supply increment by 1 by the mint
    const finalBalance = ethers.utils.formatEther(
      await steak.balanceOf(signer.address)
    );
    expect(parseInt(finalBalance)).to.equal(initialSupply + 1);
  });

  it("Should not be able to mint tokens", async function () {
    // Check total supply
    const initialBalance = ethers.utils.formatEther(
      await steak.balanceOf(signer.address)
    );
    expect(parseInt(initialBalance)).to.equal(initialSupply);

    // Mint
    // await expect(
    await steak.connect(random_account).mint(random_account.address, 1);
    // ).to.be.revertedWith("Ownable: caller is not the owner");

    // Check total supply was not incremented
    const finalBalance = ethers.utils.formatEther(
      await steak.balanceOf(signer.address)
    );
    expect(parseInt(initialBalance)).to.not.equal(parseInt(finalBalance));
  });
});
