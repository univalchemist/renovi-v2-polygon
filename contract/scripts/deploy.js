const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const contractFactory = await ethers.getContractFactory("RENOVI");
  const deployedContract = await contractFactory.deploy(); // Instance of the contract
  await deployedContract.deployed();
  await deployedContract.setOwnerCut(800);
  console.log("Contract deployed to address:", deployedContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });