# RENOVI Smart Contract

## Pre-installation

Register in Alchemy, Etherscan and update `.env` file


## Deploy and Verify Smart Contract

1. Compile Contract

```
npx hardhat compile
```

2. Deploy Contract

```
npx hardhat run scripts/deploy.js --network <NETWORK>
```

3. Upgrade the deployed contract

```
npx hardhat run scripts/upgrade.js --network <NETWORK>
```

4. Verify and Publish Contract

```
npx hardhat verify --network <NETWORK> <DEPLOYED_CONTRACT_ADDRESS>
```

