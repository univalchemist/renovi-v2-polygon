import { NFT_ADDRESS, STATUS_OPTION } from '../Constants';
import NFT_ABI from '../contract/artifacts/contracts/RENOVI.sol/RENOVI.json';
import { web3, formatTokenDetails } from './Helpers';

const nftContract = new web3.eth.Contract(NFT_ABI.abi, NFT_ADDRESS);

async function getIncreasedGasPrice() {
	var gasPrice = await web3.eth.getGasPrice();
	gasPrice = parseInt(gasPrice * 1.12);
	return gasPrice;
}

export const mintNFT = async(data) => {
	if (!data || !data.account) {
		createError(new Error('Please connect your wallet.'));
	}
	try {
		const { status, account, price, token_uri } = data;
		const price_in_wei = web3.utils.toWei(`${price}`, "ether");

		const gasPrice = await getIncreasedGasPrice();
		const gas = await nftContract.methods.mint(price_in_wei, status, token_uri).estimateGas({from: account});

		const result = await nftContract.methods.mint(price_in_wei, status, token_uri).send({from: account, gas, gasPrice});
		console.log()
		if (result.transactionHash && result.events.Transfer.returnValues.tokenId) {
			return result.events.Transfer.returnValues.tokenId;
		} else {
			createError(new Error('Something is went wrong! Please try again later.'));
		}
	} catch (e) {
		console.log("error", e);
		createError(e);
	}
}

export const updateNFT = async(data) => {
	if (!data || !data.account) {
		createError(new Error('Please connect your wallet.'));
	}
	try {
		const { id, status, account, price } = data;
		const price_in_wei = web3.utils.toWei(`${price}`, "ether");
		const gasPrice = await getIncreasedGasPrice();
		const gas = await nftContract.methods.updateStatusAndPrice(id, status, price_in_wei ).estimateGas({from: account});
		const result = await nftContract.methods.updateStatusAndPrice(id, status, price_in_wei ).send({from: account, gas, gasPrice});

		if (result.transactionHash) {
			const _token = await getTokenDetailById(data.id);
			return _token;
		} else {
			createError(new Error('Something is went wrong! Please try again later.'));
		}
	} catch (e) {
		createError(e);
	}
}

export const getToken = async(tokenId) => {
	try {
		const result = await nftContract.methods.getToken(tokenId).call();
		return result;
	} catch (e) {
		createError(e);
	}
}

export const addUser = async(data) => {
	if (!data || !data.account) {
		createError(new Error('Please connect your wallet.'));
	}
	try {
		const gasPrice = await getIncreasedGasPrice();
		const gas = await nftContract.methods.setUser(data.avatar, data.username, data.email, data.description).estimateGas({from: data.account});
		const result = await nftContract.methods.setUser(data.avatar, data.username, data.email, data.description).send({from: data.account, gas, gasPrice}, 
			function(error, result) {
			if (error) {
			  console.log('error: ' + error);
			} else {
				console.log('success: ' + result);
			}
		  });
		if (result.transactionHash) {
			return true;
		} else {
			createError(new Error('Something is went wrong! Please try again later.'));
		}
	} catch (e) {
		createError(e);
	}
}

export const getUser = async(addr) => {
	try {
		const result = await nftContract.methods.getUser(addr).call();
		return result;
	} catch (e) {
		createError(e);
	}
}

export const getTokensByAddress = async(addr) => {
	try {
		const _tokens = await nftContract.methods.getAllOfOwner(addr).call();
		const tokens = [];
		for (const _token of _tokens) {
			if (_token.tokenId > 0) tokens.push(await formatTokenDetails(_token));
		}
		return tokens;
	} catch (e) {
		createError(e);
	}
}

export const getSaleForTokens = async() => {
	try {
		const _tokens = await nftContract.methods.getAllOnSale().call();
		const tokens = [];
		const tokenMetadata = await getAllTokenMetadata()
		for (const _token of _tokens) {
			if (_token.tokenId > 0) tokens.push(await formatTokenDetails(_token));
		}
		return tokens;
	} catch (e) {
		createError(e);
	}
}

export const getTokenDetailById = async(token_id) => {
	try {
		const token_info = await nftContract.methods.getToken(token_id).call();
		return await formatTokenDetails(token_info);
	} catch (e) {
		createError(e);
	}
}

export const updateTokenStatus = async(account, token_id, status, price_in_eth) => {
	if (!account || !account.address) {
		createError(new Error('Please connect your wallet.'));
	}
	try {
		const price_in_wei = web3.utils.toWei(`${price_in_eth}`, "ether");
		const gasPrice = await getIncreasedGasPrice();
		const gas = await nftContract.methods.updateStatusAndPrice(token_id, STATUS_OPTION[status], price_in_wei).estimateGas({from: account.address});
		const result = await nftContract.methods.updateStatusAndPrice(token_id, STATUS_OPTION[status], price_in_wei).send({ from: account.address, gas, gasPrice });
		if (result.transactionHash) {
			const _token = await getTokenDetailById(token_id);
			return _token;
		} else {
			createError(new Error('Something is went wrong! Please try again later.'));
		}
	} catch (e) {
		createError(e);
	}
}

export const buy = async(account, token_id, value_in_eth) => {
	if (!account) {
		createError(new Error('Connect your wallet.'));
	}
	try {
		const value = web3.utils.toWei(value_in_eth.toString(), 'ether');
		const gas = await nftContract.methods.buy(token_id).estimateGas({from: account, value});
		const gasPrice = await getIncreasedGasPrice();
		const result = await nftContract.methods.buy(token_id).send({from: account, value, gasPrice});
		if (result.transactionHash) {
			const _token = await getTokenDetailById(token_id);
			return _token;
		} else {
			createError(new Error('Something is went wrong! Please try again later.'));
		}
	} catch (e) {
		createError(e);
	}
}

export const getTransactions = async() => {
	try {
		const _transactions = await nftContract.methods.getTransactions().call();
		return _transactions;
	} catch (e) {
		createError(e);
	}
}

export const getAllTokenMetadata = async() => {
	const res = await fetch('/api/token', {
		headers: { 'Content-Type': 'application/json' },
		method: 'GET'
	});

	const { data, error } = await res.json();

	if (error) {
		createError(new Error(error));
	} else {
		return data;
	}
}


export const saveTokenMetadata = async(metadata) => {
	console.log(metadata);
	const res = await fetch('/api/token', {
		body: JSON.stringify(metadata),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST'
	});

	const { data, error } = await res.json();

	if (error) {
		createError(new Error(error));
	} else {
		return data;
	}
}

export const updateTokenMetadata = async(metadata) => {
	const res = await fetch('/api/token', {
		body: JSON.stringify(metadata),
		headers: { 'Content-Type': 'application/json' },
		method: 'PUT'
	});
	const { data, error } = await res.json();
	if (error) {
		createError(new Error(error));

	} else {
		return data;
	}
}

const createError = (e) => {
	throw e;
}