import { InjectedConnector } from '@web3-react/injected-connector';
import { NETWORK_CHAIN_ID } from '../Constants';
export const injected = new InjectedConnector({ supportedChainIds: [NETWORK_CHAIN_ID] });