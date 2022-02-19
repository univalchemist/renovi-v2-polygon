const { ethers, upgrades } = require("hardhat");
const DEPLOYED_CONTRACT_ADDRESS = '0x66d5b6C361411f00a3B2dD254f8a5b9e447240Ad';

async function main() {
  const contractFactoryV2 = await ethers.getContractFactory("RENOVI");
  const box = await upgrades.upgradeProxy(DEPLOYED_CONTRACT_ADDRESS, contractFactoryV2);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });