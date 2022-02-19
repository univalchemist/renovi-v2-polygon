import Web3 from 'web3';
import { UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
// import { FILTER_CATEGORIES, NETWORK_CHAIN_NAME, NETWORK_CHAIN_ID } from '../Constants';

import { FILTER_CATEGORIES, NETWORK_CHAIN_NAME, API_URL, NETWORK_CHAIN_ID, AVAILABLE_METAVERSES } from '../Constants';

let provider = API_URL;


if (Web3.givenProvider && parseInt(Web3.givenProvider.chainId, 16) == NETWORK_CHAIN_ID) {
	provider = Web3.givenProvider;
}

export const web3 = new Web3(provider);

export const getWalletErrorMessage = (err) => {

	if (err instanceof NoEthereumProviderError) {
        return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
    } else if (err instanceof UnsupportedChainIdError) {
        return `Change MetaMask Network to ${NETWORK_CHAIN_NAME} with ID ${NETWORK_CHAIN_ID}.`
    } else if (err instanceof UserRejectedRequestErrorInjected) {
        return 'Please authorize this website to access your Ethereum account.'
    } else if (err) {
        return 'An unknown error occurred. Check the console for more details.'
    } else {
        return false;
    }
}

export const getCategoryName = (val='') => {
	let name = '';
	if (val) {
		for (let cat of FILTER_CATEGORIES) {
			if (val === cat.value) {
				name = cat.name;
				break;
			}
		}
	}
	return name;
}

export const formatTokenDetails = async (token) => {
	try {
		const price_in_eth = convertWeiToEth(token.price);
		const res = await fetch(`/api/token?tokenId=${token.tokenId}`);
		const { data, error } = await res.json();
		let token_data = {
			id: token.tokenId,
			status: token.status,
			price: token.price,
			price_in_eth,
			creator: {
				...token.creatorInfo,
				address: token.creator
			},
			owner: {
				...token.ownerInfo,
				address: token.owner
			}
		}
		if (!error && data) {
			const { name, description, image, categories, otherfiles, availableOn, numberOfParcels} = data;
			console.log(availableOn)
			token_data = {
				...token_data,
				name,
				description,
				image,
				categories,
				// availableOn: availableOn,
				availableOn: JSON.parse(availableOn),

				numberOfParcels,
				otherfiles: JSON.parse(otherfiles),
			};
		}
		return token_data;
	} catch (e) {
		throw e
	}
}

export const convertWeiToEth = (value) => {
	return web3.utils.fromWei(value, 'ether');
}

export const shortenWalletAddress = (address) => {
	return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}