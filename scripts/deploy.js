const fs = require("fs");
const hre = require("hardhat");

async function main() {
  const [signer] = await ethers.provider.listAccounts();
  console.log(`Signing with address: ${signer}`);

  // Deploy Steak token contract
  const SteakToken = await hre.ethers.getContractFactory("SteakToken");
  const steakToken = await SteakToken.deploy(1000);
  await steakToken.deployed();
  console.log(`SteakToken deployed to: ${steakToken.address}`);

  // Deploy the exchange contract
  const SteakExchange = await hre.ethers.getContractFactory("SteakExchange");
  const steakExchange = await SteakExchange.deploy(steakToken.address);
  await steakExchange.deployed();
  console.log(`SteakExchange deployed to: ${steakExchange.address}`);

  // Create the initial LP pool
  const steakBalance = await steakToken.balanceOf(signer);
  console.log(`steakBalance: ${hre.ethers.utils.formatEther(steakBalance)}`);

  const approve = await steakToken.approve(steakToken.address, steakBalance);
  approve.wait();
  const approveExchange = await steakToken.approve(
    steakExchange.address,
    steakBalance
  );
  approveExchange.wait();
  console.log("Approved");

  const etherPool = hre.ethers.utils.parseUnits("100", "ether");
  const lp = await steakExchange.createPool(steakBalance, {
    value: etherPool,
  });
  lp.wait();
  console.log(`All done!`);

  // We write the contracts addresses to a file to read from the frontend
  let data = {
    SteakTokenAddress: steakToken.address,
    SteakExchangeAddress: steakExchange.address,
  };
  fs.writeFile(
    "./frontend/src/artifacts/contracts//addresses.json",
    JSON.stringify(data),
    function (err) {
      if (err) throw err;
      console.log("Contract addresses saved successfully");
    }
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
