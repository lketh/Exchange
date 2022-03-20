const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Steak", function () {
  let steak, signer, randomAccount;
  const initialSupply = ethers.utils.parseEther("1000");
  let initialBalance;

  describe("After signing with signer account of the contract", async () => {
    before(async function () {
      // Token for the exchange
      const Steak = await ethers.getContractFactory("SteakToken");
      steak = await Steak.deploy(initialSupply);
      await steak.deployed();

      // Signer / owner
      [signer, , randomAccount] = await ethers.getSigners();

      // Initial balance
      initialBalance = await steak.balanceOf(signer.address);
    });

    it("should have balance equal to initialSupply", async function () {
      // Check total supply
      expect(initialBalance).to.equal(initialSupply);
    });

    it("should have balance equal to (initialSupply + 1) after minting 1 token", async () => {
      // Mint
      const mintTxn = await steak.mint(
        signer.address,
        ethers.utils.parseEther("1")
      );
      await mintTxn.wait();

      // Check the balance after minting 1 token
      const finalBalance = await steak.balanceOf(signer.address);

      // checks if finalBalance == initialSupply + 1
      expect(finalBalance).to.equal(
        initialSupply.add(ethers.utils.parseEther("1"))
      );
    });
  });

  describe("After signing with different account", () => {
    before(async function () {
      // Token for the exchange
      const Steak = await ethers.getContractFactory("SteakToken");
      steak = await Steak.deploy(initialSupply);
      await steak.deployed();

      // Signer / owner
      [signer, , randomAccount] = await ethers.getSigners();

      // initialBalance
      initialBalance = await steak.balanceOf(signer.address);
    });

    it("Should have balance equal to initialSupply", async () => {
      // Check total supply
      expect(initialBalance).to.equal(initialSupply);
    });

    it("Should not be able to mint tokens", async function () {
      // Checks if it reverts minting token with another account
      await expect(
        steak
          .connect(randomAccount)
          .mint(randomAccount.address, ethers.utils.parseEther("1"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should have balance equal to initialBalance", async () => {
      // balance after trying to mint token
      const finalBalance = await steak.balanceOf(signer.address);

      // checks if initial balance equals to final balance
      expect(initialBalance).to.equal(finalBalance);
    });
  });
});
