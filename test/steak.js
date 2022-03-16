const { expect } = require("chai");
const { waffle, ethers } = require("hardhat");

describe("Steak", function () {
  let steak, signer, randomAccount;
  const initialSupply = ethers.BigNumber.from("1000000000000000000");
  let initialBalance;

  describe("after signing with signer account of the contract", async () => {
    before(async function () {
      // Token for the exchange
      const Steak = await ethers.getContractFactory("SteakToken");
      steak = await Steak.deploy(initialSupply);
      await steak.deployed();

      // Signer / owner
      [signer, , randomAccount] = await ethers.getSigners();
    });

    it("should have balance equal to initialSupply", async function () {
      // Check total supply
      const initialBalance = await steak.balanceOf(signer.address);

      console.log("initialBalance: ", initialBalance.toString());
      console.log("initialSupply: ", initialSupply.toString());
      expect(initialBalance).to.equal(initialSupply);
    });

    it("mint 1 token", async () => {});

    it("should have balance equal to initialSupply + 1", async () => {
      // Mint
      const mintTxn = await steak.mint(signer.address, 1);
      await mintTxn.wait();

      // Check total supply increment by 1 by the mint
      const finalBalance = await steak.balanceOf(signer.address);

      console.log("initialSupply: ", initialSupply.toString());
      console.log("finalBalance: ", finalBalance.toString());

      // TODO: should fix mint failure
      expect(finalBalance).to.equal(
        initialSupply.add(ethers.BigNumber.from("1"))
      );

      // this should pass than the one above
      // expect(parseInt(finalBalance)).to.not.equal(initialSupply + 1);
    });

    const finalBalance = ethers.utils.formatEther(
      await steak.balanceOf(signer.address)
    );
    console.log("finalBalance: ", finalBalance);
  });

  describe("after signing with different account", () => {
    before(async function () {
      // Signer / owner
      [signer, randomAccount] = await ethers.getSigners();

      // Token for the exchange
      const Steak = await ethers.getContractFactory("SteakToken");
      steak = await Steak.deploy(ethers.BigNumber.from("1000000000000000000"));
      await steak.deployed();

      initialBalance = await steak.balanceOf(signer.address);
    });

    it("Should have balance equal to initialSupply", async () => {
      console.log("initialBalance: ", initialBalance.toString());
      console.log("initialSupply: ", initialSupply.toString());
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

      console.log("initialBalance: ", initialBalance.toString());
      console.log("finalBalance: ", finalBalance.toString());
      expect(initialBalance).to.equal(finalBalance);
    });
  });
});
