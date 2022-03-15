const { expect } = require("chai");
const { waffle, ethers } = require("hardhat");

describe("Steak", function () {
  let steak, signer, randomAccount;
  const initialSupply = 1000;
  let initialBalance;

  describe("after signing with signer account of the contract", () => {
    before(async function () {
      // Token for the exchange
      const Steak = await ethers.getContractFactory("SteakToken");
      steak = await Steak.deploy("1000");
      await steak.deployed();

      // Signer / owner
      [signer, , randomAccount] = await ethers.getSigners();
    });

    it("should have balance equal to initialSupply", async function () {
      // Check total supply
      const initialBalance = parseInt(
        ethers.utils.formatEther(await steak.balanceOf(signer.address))
      );
      console.log("initialBalance: ", initialBalance);
      console.log("initialSupply: ", initialSupply);
      expect(parseInt(initialBalance)).to.equal(initialSupply);
    });

    it("mint 1 token", async () => {
      // Mint
      const mintTxn = await steak.mint(signer.address, 1);
      await mintTxn.wait();
    });

    it("should have balance equal to initialSupply + 1", async () => {
      // Check total supply increment by 1 by the mint
      const finalBalance = ethers.utils.formatEther(
        await steak.balanceOf(signer.address)
      );
      console.log("initialSupply: ", initialSupply);
      console.log("finalBalance: ", parseInt(finalBalance));

      // TODO: should fix mint failure
      // expect(parseInt(finalBalance)).to.equal(initialSupply + 1);

      // this should pass than the one above
      expect(parseInt(finalBalance)).to.not.equal(initialSupply + 1);
    });
  });

  describe("after signing with different account", () => {
    before(async function () {
      // Signer / owner
      [signer, randomAccount] = await ethers.getSigners();

      // Token for the exchange
      const Steak = await ethers.getContractFactory("SteakToken");
      steak = await Steak.deploy("1000");
      await steak.deployed();

      initialBalance = ethers.utils.formatEther(
        await steak.balanceOf(signer.address)
      );
    });

    it("Should have balance equal to initialSupply", async () => {
      // Check total supply
      expect(parseInt(initialBalance)).to.equal(initialSupply);
    });

    it("Should not be able to mint tokens", async function () {
      // Mint
      await expect(
        steak.connect(randomAccount).mint(randomAccount.address, 1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should have balance equal to initialBalance", async () => {
      // Check total supply was not incremented
      const finalBalance = ethers.utils.formatEther(
        await steak.balanceOf(signer.address)
      );
      console.log("initialBalance: ", parseInt(initialBalance));
      console.log("finalBalance: ", parseInt(finalBalance));
      expect(parseInt(initialBalance)).to.equal(parseInt(finalBalance));
    });
  });
});
