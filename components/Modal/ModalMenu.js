import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

const ModalMenu = (props) => {
    const stateWallet = useSelector(state => state.wallet);
    const onMenuClicked = (cb=null) => {
        props.onHide();
        if (cb) cb();
    }
    return (
        <Modal {...props} className="modal-sidebar">
            <Modal.Header>
                <Modal.Title className="text-primary">
                    RENOVI
                </Modal.Title>
                <Button variant="link" className="fs-1 text-primary text-decoration-none" onClick={() => props.onHide()}>
                    <i className="icon-close"></i>
                </Button>
            </Modal.Header>
            <Modal.Body className="menu">
                <div className="row w-100">
                    <div className="items p-0 col-12 text-center">
                        <ul className="navbar-nav items ms-auto me-2">
                            <li className="nav-item dropdown">
                                <Link href="/"><a className="nav-link" onClick={()=>onMenuClicked()}>Home</a></Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link href="/explore"><a className="nav-link" onClick={()=>onMenuClicked()}>Explore</a></Link>
                            </li>
                            {
                                stateWallet?.address && (
                                    <li className="nav-item">
                                        <Link href="/my-items"><a className="nav-link" onClick={()=>onMenuClicked()}>My Items</a></Link>
                                    </li>
                                )
                            }
                            {
                                stateWallet?.address && (
                                    <li className="nav-item">
                                        <a href="#" className="nav-link"
                                            onClick={() => onMenuClicked(props.onshowCreateItemModal)}
                                        >Create</a>
                                    </li>
                                )
                            }
                            {
                                stateWallet?.address && (
                                    <li className="nav-item">
                                        <a href="#" className="nav-link"
                                            onClick={() => onMenuClicked(props.onShowProfileModal)}
                                        >Profile</a>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalMenu;