import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
/** IMX integration **/
import { Link as IMX_LINK } from '@imtbl/imx-sdk';
import { setWalletAddressAction, clearWalletAddressAction } from '../../utils/Actions';

/** Metamask integration **/
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../utils/Connectors';
import { useEagerConnect, useInactiveListener } from '../../utils/Hooks';
import { shortenWalletAddress, getWalletErrorMessage } from '../../utils/Helpers';


const Wallet = (props) => {
    const dispatch = useDispatch();
    const { account, activate, deactivate, connector, error } = useWeb3React();
    const [activatingConnector, setActivatingConnector] = useState();
    const stateWallet = useSelector(state => state.wallet);
    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager || !!activatingConnector);

    // set state wallet address when changed the metamask wallet.
    useEffect(() => {
        if (account) {
            setWalletAddressAction(dispatch, {address: account, starkPublicKey: null, walletName: 'metamask'});
        } else {
            clearWalletAddressAction(dispatch)
        }
    }, [account])

    const handleImxConnect = async() => {
        if (!stateWallet?.address || stateWallet?.address == 'undefined') {
            const {address, starkPublicKey } = await imx_link.setup({});
            setWalletAddressAction(dispatch, {address, starkPublicKey, walletName: 'imx'});
        }
    }

    const handleMetamaskConnect = (_connetor) => {
        if (!stateWallet?.address || stateWallet?.address == 'undefined') {
            activate(_connetor);
        }
    }

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector]);

    useEffect(() => {
        if (error) {
            dispatch({
                type: 'SET_NOTIFICATION',
                data: {
                    type: "error",
                    msg: getWalletErrorMessage(error)
                }
            });
        }
    }, [error, connector])


    return (
        <>
            <section className="wallet-connect-area container">
                <div className="row">
                    <div className="col-12 col-md-8 col-lg-7">
                        {/* Intro */}
                        <div className="intro">
                            <h3 className="mt-3 mb-0">Connect your wallet</h3>
                            <p>Connect with one of available wallet providers</p>
                        </div>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    {/* Immutable X wallet */}
                    {/* <div className="col item">
                        <div className="card single-wallet bg-transparent border border-secondary">
                            {
                                stateWallet?.address && stateWallet?.address != 'undefined' && stateWallet?.walletName === "imx" ? (
                                    <div className="d-block">
                                        <img className="avatar-lg" src="/images/icons/imx.svg" alt="" />
                                        <h4 className="mb-0">Immutable X</h4>
                                        <p className="text-primary fw-bold">
                                            Connected: {shortenWalletAddress(stateWallet?.address)}
                                        </p>
                                    </div>
                                ) : (
                                    <a className="d-block cursor-pointer"
                                        onClick={() => {handleImxConnect()}}
                                    >
                                        <img className="avatar-lg" src="/images/icons/imx.svg" alt="" />
                                        <h4 className="mb-0">Immutable X</h4>
                                        <p>One of the most secure wallets with great flexibility.</p>
                                    </a>
                                )
                            }
                        </div>
                    </div> */}
                    <div className="col item">
                        <div className="card single-wallet bg-transparent border border-secondary">
                            {
                                stateWallet?.address && stateWallet?.address != 'undefined' && stateWallet?.walletName === "metamask" ? (
                                    <div className="d-block">
                                        <img className="avatar-lg" src="/images/icons/metamask-fox.svg" alt="" />
                                        <h4 className="mb-0">Metamask</h4>
                                        <p className="text-primary fw-bold">
                                            Connected: {shortenWalletAddress(stateWallet?.address)}
                                        </p>
                                    </div>
                                ) : (
                                    <a className="d-block cursor-pointer"
                                        onClick={() => {handleMetamaskConnect(injected)}}
                                    >
                                        <img className="avatar-lg" src="/images/icons/metamask-fox.svg" alt="" />
                                        <h4 className="mb-0">Metamask</h4>
                                        <p>One of the most secure wallets with great flexibility.</p>
                                    </a>
                                )
                            }
                        </div>
                    </div>

                </div>
                <div className="row">
                    <p className="col-12 pt-5 mt-5">
                        We do not own your private keys and cannot acces your funds without your confirmation.
                    </p>
                </div>
            </section>
        </>
    );
}

export default Wallet;