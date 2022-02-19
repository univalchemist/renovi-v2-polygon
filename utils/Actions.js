import { getUser } from './Api';

const initialProfile = {
	username: "",
	email: "",
	avatar: "",
	description: ""
}

export const myProfileUpatedAction = async(dispatch, account) => {
	if (account) {
		try {
			const result = await getUser(account);
			if (result.username) {
				dispatch({
					type: 'MY_PROFILE_UPDATED',
					data: {
						username: result.username,
						email: result.email,
						avatar: result.avatar,
						description: result.description
					}
				});
			} else {
				dispatch({
					type: 'MY_PROFILE_UPDATED',
					data: initialProfile
				});
			}
		} catch (error) {
			dispatch({
				type: 'MY_PROFILE_UPDATED',
				data: initialProfile
			});
		}
	} else {
		dispatch({
			type: 'MY_PROFILE_UPDATED',
			data: initialProfile
		});
	}
}

export const setWalletAddressAction = async(dispatch, wallet) => {
	if (wallet) {
		dispatch({
			type: 'SET_WALLET_ADDRESS',
			data: {
				wallet: wallet
			}
		});
	}
}

export const clearWalletAddressAction = async(dispatch) => {
	dispatch({
		type: 'CLEAR_WALLET_ADDRESS'
	});
}