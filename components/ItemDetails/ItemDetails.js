import { useState, useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Modal, Button } from 'react-bootstrap';
import { AVAILABLE_METAVERSES_MAPPING } from '../../Constants';

import ItemForm from '../Forms/ItemForm';
import UserItem from '../UserItem/UserItem';
import ThreeViewer from '../ThreeViewer';

import * as API from '../../utils/Api';
import { handleDownload } from '../../utils/FileDownloader';
import Accordion from 'react-bootstrap/Accordion'


const ItemDetails = (props) => {
    const dispatch = useDispatch();
	const taskProcessing = useSelector(state => state.processing);
    const stateWallet = useSelector(state => state.wallet);
    const [item, setItem] = useState({});
    const [processing, setProcessing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showFileViewerModal, setShowFileViewerModal] = useState(false);
    const [viewFile, setViewfile] = useState();

    useEffect(() => {
        const _getTokenDetails = async(token_id) => {
            const token = await API.getTokenDetailById(token_id);
            setItem(token);
        }
        if (props.id) {
            _getTokenDetails(props.id);
        }
    }, [props.id]);

    const handleBuy = async() => {
        dispatch({
            type: 'SET_PROCESSING',
            data: true
        });
        // setProcessing(true);
        try {
            const _token = await API.buy(stateWallet.address, props.id, item.price_in_eth);
            setItem(_token);
            handleNotify("success", "Transfer Successfully!");
        } catch (e) {
            handleNotify("error", e.message);
        }
        // setProcessing(false);
        dispatch({
            type: 'SET_PROCESSING',
            data: false
        });
    }

    const handleEdit = () => {
        setShowModal(true);
    }

    const handleNotify = (n_type, n_msg) => {
        dispatch({
            type: 'SET_NOTIFICATION',
            data: {
                type: n_type,
                msg: n_msg
            }
        });
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    const handleItemUpdated = (_item) => {
        setItem(_item);
    }

    const handleDownloadFile = useCallback(async (url, fName) => {
        try {
            dispatch({
                type: 'SET_PROCESSING',
                data: true
            });
            const res = await handleDownload(url, fName);
            if (res === false) handleNotify("error", "Failed to download. Please try again later.");
        } catch (error) {
            handleNotify("error", "Failed to download. Please try again later.");
        }
        dispatch({
            type: 'SET_PROCESSING',
            data: false
        });
    }, []);

    const renderOtherFilesView = () => {
        const _items = [];
        if (item.otherfiles?.length > 0) {
            const items = item.otherfiles.map((_file, idx) => {
                const download_button = <button disabled={taskProcessing} key={`${idx}-download`} className="btn btn-primary-alt m-2" onClick={() => handleDownloadFile(_file.path, _file.name)}>DOWNLOAD .{_file.ext}</button>
                if (_file.ext === "pdf") {
                    return (
                        <>
                            <a href={_file.path} key={`${idx}-view`} className="btn btn-primary-alt m-2" target="_blank">{_file.ext.toUpperCase()}</a>
                            {(item.owner?.address === stateWallet.address) &&
                                download_button
                            }
                        </>
                    );
                } else if (["mp4"].includes(_file.ext?.toLowerCase())) {
                    return (
                        <>
                            <a href={_file.path} key={idx} className="btn btn-primary-alt m-2" target="_blank">{_file.ext.toUpperCase()}</a>
                            {(item.owner?.address === stateWallet.address) &&
                                download_button
                            }
                        </>
                    );
                } else if (["stl", "obj", "fbx", "gltf", "dae", "wrl"].includes(_file.ext?.toLowerCase())) {
                    return (
                        <>
                            <button key={idx} className="btn btn-primary-alt m-2" onClick={() => handleFileViewerModalShow(_file)}>{_file.ext.toUpperCase()}</button>
                            {(item.owner?.address === stateWallet.address) &&
                                download_button
                            }
                        </>
                )
                } else {
                    return (
                        <>
                            <a download href={_file.path} key={idx} className="btn btn-primary-alt m-2" target="_blank">Download {_file.ext.toUpperCase()}</a>
                            {(item.owner?.address === stateWallet.address) &&
                                download_button
                            }
                        </>
                    );
                }
            });
            return items;
        } else {
            return;
        }
    }

    const handleFileViewerModalShow = (_file) => {
        setViewfile(_file);
        setShowFileViewerModal(true);

    }

    const handleFileViewerModalClose = () => {
        setViewfile(null);
        setShowFileViewerModal(false);
    }


    return (
        <>
            <section className="item-details-area">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-12 col-sm-4">
                            <img src={item.image} className="w-100" alt="" />
                            <div className="w-100">
                            {
                                item.otherfiles?.length > 0 && renderOtherFilesView()
                            }
                            </div>
                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Metaverse Eligible</Accordion.Header>
                                    <Accordion.Body>
                                    {JSON.stringify(item.availableOn) != '[]' || item.availableOn &&
                                    <>
                                        <div className="d-flex align-items-center">
                                            <p className="mb-0">Available for:</p>
                                            {/* {item.availableOn.map(metaverse =>(
                                                <img className="ml-icon" width="32" src={AVAILABLE_METAVERSES_MAPPING[metaverse]} />

                                            ))} */}
                                        </div>

                                        {item.numberOfParcels &&
                                            <div className="d-flex align-items-center">
                                                <p className="mt-3">Number of parcels: {item.numberOfParcels}</p>
                                            </div>
                                        }
                                    </>
                                    }

                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Ownership Details</Accordion.Header>
                                    <Accordion.Body>
                                        <p className="mb-0">Creator</p>
                                        <UserItem avatar={item.creator?.avatar} name={item.creator?.username || item.creator?.address} />
                                        <p className="mb-0">Owner</p>
                                        <UserItem avatar={item.owner?.avatar} name={item.owner?.username || item.owner?.address} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                        <div className="col-12 col-sm-8">
                            {/* Content */}
                            <div className="content mt-5 mt-lg-0">
                                <h4 className="m-0 mb-3">{item.name}</h4>
                                {
                                    item.status =="sale"? (
                                        <p>On sale for <span className="text-white">{`${item.price_in_eth} ETH`}</span></p>
                                    ):(
                                        <p>Price: <span className="text-white">{`${item.price_in_eth} MATIC`}</span></p>
                                    )
                                }

                                <p className="text-white mt-3">{item.description}</p>

                                <div className="item-actions-wrapper">
                                {
                                    (item.status =="1" && item.owner?.address !== stateWallet.address) && (
                                        stateWallet.address? (
                                            <a className={`btn btn-primary-alt px-5 py-3 mt-4 btn-lg ${processing?"processing":""}`} onClick={()=>handleBuy()}>Buy Now</a>
                                        ):(
                                            <Link href="/wallet-connect"><a className="btn btn-primary-alt px-5 py-3 mt-4 btn-lg">Connect Wallet</a></Link>
                                        )
                                    )
                                }
                                {
                                    (item.owner?.address === stateWallet.address && item.creator?.address === stateWallet.address) && (
                                        <a className={`btn btn-primary-alt px-5 py-3 mt-4 btn-lg`} onClick={()=>handleEdit()}>Edit</a>
                                    )
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal show={showModal}
                onHide = {()=>setShowModal(false)}
                size="lg"
                backdrop="static"
                keyboard={false}
                centered>
                <Modal.Header className="pb-0 justify-content-end">
                    <Button variant="link" className="fs-1 text-primary text-decoration-none" onClick={() => handleModalClose()}>
                        <i className="icon-close"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    <ItemForm itemData={item} onUpdated={handleItemUpdated} onClose={handleModalClose} onNotify={handleNotify} />
                </Modal.Body>
            </Modal>
            <Modal show={showFileViewerModal}
                onHide = {()=>handleFileViewerModalClose()}
                size="lg"
                backdrop="static"
                keyboard={false}
                centered>
                <Modal.Header className="pb-0 justify-content-end">
                    <Button variant="link" className="fs-1 text-primary text-decoration-none" onClick={() => handleFileViewerModalClose()}>
                        <i className="icon-close"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    <div className="vh-75 w-100">
                    {
                        viewFile?.path && <ThreeViewer modelFile={viewFile} />
                    }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ItemDetails;