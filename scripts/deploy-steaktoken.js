const { ethers } = require('hardhat');

async function main() {
  const initialSupply = ethers.utils.parseEther('100000'); // 18 decimals
  const SteakToken = await ethers.getContractFactory('SteakToken');
  const steaktoken = await SteakToken.deploy();
  await steaktoken.deployed();

  console.log('SteakToken deployed to:', steaktoken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
