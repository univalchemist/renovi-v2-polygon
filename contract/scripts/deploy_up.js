const { ethers, upgrades } = require("hardhat");

async function main() {
  const contract_factory = await ethers.getContractFactory("RENOVI");
  const deployed_contract = await upgrades.deployProxy(contract_factory);
  await deployed_contract.deployed();
  console.log("Contract deployed to address:", deployed_contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });