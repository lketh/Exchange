const { expect } = require("chai");
const { waffle, ethers } = require("hardhat");

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

      initialBalance = await steak.balanceOf(signer.address);
    });

    it("should have balance equal to initialSupply", async function () {
      // Check total supply

      console.log("initialBalance: ", ethers.utils.formatEther(initialBalance));
      console.log("initialSupply: ", ethers.utils.formatEther(initialSupply));
      expect(initialBalance).to.equal(initialSupply);
    });

    it("should have balance equal to (initialSupply + 1) after minting 1 token", async () => {
      // Mint
      const mintTxn = await steak.mint(
        signer.address,
        ethers.utils.parseEther("1")
      );
      await mintTxn.wait();

      // Check total supply increment by 1 by the mint
      const finalBalance = await steak.balanceOf(signer.address);

      console.log("initialBalance: ", ethers.utils.formatEther(initialBalance));
      console.log("finalBalance: ", ethers.utils.formatEther(finalBalance));

      // TODO: should fix mint failure
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
      console.log("initialBalance: ", ethers.utils.formatEther(initialBalance));
      console.log("initialSupply: ", ethers.utils.formatEther(initialSupply));

      // Check total supply
      expect(initialBalance).to.equal(initialSupply);
    });

    it("Should not be able to mint tokens", async function () {
      // Mint
      await expect(
        steak.connect(randomAccount).mint(randomAccount.address, 1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should have balance equal to initialBalance", async () => {
      // Check total supply was not incremented
      const finalBalance = await steak.balanceOf(signer.address);

      console.log("initialBalance: ", ethers.utils.formatEther(initialBalance));
      console.log("finalBalance: ", ethers.utils.formatEther(finalBalance));
      expect(initialBalance).to.equal(finalBalance);
    });
  });
});
