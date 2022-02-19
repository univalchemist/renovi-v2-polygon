# RENOVI Marketplace (NEXT.js)

## Deploy Smart Contract
1. Go to `/contract` directory.

2. Rename `.env.example` to `.env` and update the environment variables. (You need to register in [Alchemy](https://auth.alchemyapi.io/signup?redirectUrl=https%3A%2F%2Fdashboard.alchemyapi.io%2Fsignup%2F%3Freferrer_origin%3Dhttps%3A%2F%2Fwww.google.co.kr%2F))

3. Compile Contract

```
npx hardhat compile
```

4. Deploy Contract. It prints the deployed contract address on Command line.

```
npx hardhat run scripts/deploy.js
```

It returns the deployed smart contract address on the console, and that address will be used when re-deploy in the following. 


### Re-deploy the changed Smart contract.

1. Update `DEPLOYED_CONTRACT_ADDRESS` in `scripts/upgrade.js:2`

2. Run the following command

```
npx hardhat run scripts/upgrade.js
```

## Deploy the website

1. In `Constants.js` of the project root diretory, change `NFT_ADDRESS` (Token contract address deployed) and `NETWORK_CHAIN_ID, NETWORK_CHAIN_NAME` (Network chain ID and name that the token is deployed on). You can get the relevant `NETWORK_CHAIN_ID` and `NETWORK_CHAIN_NAME` [here](https://docs.metamask.io/guide/ethereum-provider.html#chain-ids) - https://docs.metamask.io/guide/ethereum-provider.html#chain-ids

2. Deploy it using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/mojodigital/renovi-nft/tree/master&project-name=renovi-marketplace&repository-name=renovi-nft)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

##My Changes

1. inside renovi contract: setting of ownerCut to determinr the percent of profit for owner
2. Adding the logic in buy(uint256 tokenId) method in renovi contract
3. in contract/scripts/deploy.js adding a script to set ownerCut

##link for vercel App
https://renovi-test.vercel.app/

##My Comments on App
1. The images were not being stored. They were being uploaded on IPFS but frontend was not able to retrive them
2. After pulling the new commits, eth_sendTransaction method was not working because of use of infura as web3 provider. We can send raw txns instead to have it working
