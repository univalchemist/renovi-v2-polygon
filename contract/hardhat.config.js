/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');

const { ALCHEMY_MAINNET_API_KEY, ALCHEMY_RINKEBY_API_KEY, ALCHEMY_ROPSTEN_API_KEY, PRIVATE_KEY, API_URL } = process.env;
module.exports = {
	solidity: {
		version: "0.8.4",
		settings: {
			optimizer: {
				enabled: true,
				runs: 1000
			}
		}
	},
	defaultNetwork: "default",
	networks: {
		hardhat: {},
		default: {
			url: API_URL,
			accounts: [`0x${PRIVATE_KEY}`],
			timeout: 2000000
		},
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_RINKEBY_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
			timeout: 2000000
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_ROPSTEN_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
			timeout: 2000000
    }
	},
	etherscan: {
		// Your API key for Etherscan
		// Obtain one at https://etherscan.io/
		apiKey: "P46EGEUBB8FUDTCZXRV8QAMT9HABP4TQ4E"
	}
}