import { Wallet } from '@ethersproject/wallet';
import { ImmutableXClient, ImmutableMethodParams } from '@imtbl/imx-sdk';
import { NFT_ADDRESS } from '../Constants';

const waitForTransaction = async (promise, provider) => {
  const txId = await promise;
  const receipt = await provider.waitForTransaction(txId);
  if (receipt.status === 0) {
    throw new Error('Transaction rejected');
  }
  return receipt;
};

export const mintImx = async(wallet, tokenId, provider) => {
  try {
    const minter = await ImmutableXClient.build({
      publicApiUrl: getEnv('PUBLIC_API_URL'),
      starkContractAddress: getEnv('STARK_CONTRACT_ADDRESS'),
      registrationContractAddress: getEnv('REGISTRATION_ADDRESS'),
      gasLimit: getEnv('GAS_LIMIT'),
      gasPrice: getEnv('GAS_PRICE'),
      signer: new Wallet(env.privateKey1).connect(provider),
    });
    const registerImxResult = await minter.registerImx({
      etherKey: minter.address.toLowerCase(),
      starkPublicKey: minter.starkPublicKey,
    });

    if (registerImxResult.tx_hash !== '') {
      await waitForTransaction(Promise.resolve(registerImxResult.tx_hash), provider);
      const payload = [
        {
          contractAddress: NFT_ADDRESS, // NOTE: a mintable token contract is not the same as regular erc token contract
          users: [
            {
              etherKey: wallet.toLowerCase(),
              [tokenId]: ""
            },
          ],
        },
      ];

      const result = await minter.mintV2(payload);
    } else {
    }
  } catch (e) {
  }
}
