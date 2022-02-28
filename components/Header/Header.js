import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { myProfileUpatedAction, setWalletAddressAction } from '../../utils/Actions';

import ModalCreateItem from '../Modal/ModalCreateItem';
import ModalProfile from '../Modal/ModalProfile';
import ModalMenu from '../Modal/ModalMenu';
import ModalSearch from '../Modal/ModalSearch';
import SearchForm from '../Forms/SearchForm';

const Header = () => {
    const dispatch = useDispatch();
    const [showCreateItemModal, setShowCreateItemModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const stateWallet = useSelector(state => state.wallet);
    console.log(stateWallet)

    useEffect(() => {
        if (localStorage && !stateWallet?.address) {
            const address = localStorage.getItem('WALLET_ADDRESS');
            const starkPublicKey = localStorage.getItem('STARK_PUBLIC_KEY');
            const walletName = localStorage.getItem('WALLET_NAME');
            if (address && address != 'undefined') {
                setWalletAddressAction(dispatch, {address, starkPublicKey, walletName});
            }
        }
    });

    useEffect(() => {
        myProfileUpatedAction(dispatch, stateWallet.address);
    }, [stateWallet.address]);

    const showNotification = (n_type, n_msg) => {
        dispatch({
            type: 'SET_NOTIFICATION',
            data: {
                type: n_type,
                msg: n_msg
            }
        });
    }

    return (
        <>
            <header id="header">
                {/* Navbar */}
                <nav className="navbar navbar-expand">
                    <div className="container header">
                        {/* Navbar Brand*/}
                        <Link href="/">
                            <a className="navbar-brand">RENOVI <small>BETA</small></a>
                        </Link>
                        <div className="flex-grow-1 flex-shrink-1 mx-2 mx-sm-3 mx-md-5">
                            <SearchForm />
                        </div>

                        {/* Navbar */}
                        <ul className="navbar-nav items ms-auto">
                            <li className="nav-item dropdown">
                                <Link href="/explore"><a className="nav-link text-white">Explore</a></Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link href="https://my.renovi.io"><a target="_blank" className="nav-link text-white">Info</a></Link>
                            </li>
                            {
                                stateWallet.address && (
                                    <li className="nav-item">
                                        <Link href="/my-items"><a className="nav-link text-white">My Items</a></Link>
                                    </li>
                                )
                            }
                            {
                                stateWallet.address && (
                                    <li className="nav-item">
                                        <a href="#" className="nav-link" onClick={() => setShowCreateItemModal(true)}>Create</a>
                                    </li>
                                )
                            }
                            {
                                stateWallet.address && (
                                    <li className="nav-item">
                                        <a href="#" className="nav-link" onClick={() => setShowProfileModal(true)}>Profile</a>
                                    </li>
                                )
                            }
                        </ul>
                        {/* Navbar Icons */}
                        <ul className="navbar-nav toggle d-block d-sm-none">
                            <li className="nav-item">
                                <a href="#" className="nav-link" onClick={() => setShowSearchModal(true)}>
                                    <i className="icon-magnifier" />
                                </a>
                            </li>
                        </ul>
                        {/* Navbar Toggler */}
                        <ul className="navbar-nav toggle">
                            <li className="nav-item">
                                <a href="#" className="nav-link" onClick={() => setShowMenuModal(true)}>
                                    <i className="icon-menu m-0" />
                                </a>
                            </li>
                        </ul>
                        <ul className="navbar-nav action">
                            <li className="nav-item ms-3">
                            {
                                !stateWallet.address? (
                                    <Link href="/wallet-connect">
                                        <a className="btn ms-lg-auto btn-primary-alt btn-lg">
                                            <i className="icon-wallet me-md-2" />
                                            Wallet Connect
                                        </a>
                                    </Link>
                                ): (
                                    <span className="text-primary fw-bold">{`${stateWallet.address.substring(0, 6)}...${stateWallet.address.substring(stateWallet.address.length - 4)}`}</span>
                                )
                            }
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <ModalCreateItem show={showCreateItemModal} onNotify={(n_type, n_msg)=>showNotification(n_type, n_msg)} onHide={()=>setShowCreateItemModal(false)} />
            <ModalProfile show={showProfileModal} onNotify={(n_type, n_msg)=>showNotification(n_type, n_msg)} onHide={()=>setShowProfileModal(false)} />
            <ModalMenu show={showMenuModal}
                onHide={()=>setShowMenuModal(false)}
                onshowCreateItemModal={()=>setShowCreateItemModal(true)}
                onShowProfileModal={()=>setShowProfileModal(true)}
            />

            <ModalSearch show={showSearchModal}
                onHide={()=>setShowSearchModal(false)}
            />
        </>
    );
};

export default Header;