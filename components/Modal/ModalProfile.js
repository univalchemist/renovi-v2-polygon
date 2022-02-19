import { Modal, Button } from 'react-bootstrap';
import ProfileForm from '../Forms/ProfileForm';

const ModalProfile = (props) => {
    return (
        <Modal {...props}
            size="lg"
            backdrop="static"
            keyboard={false}
            centered>
            <Modal.Header className="pb-0 justify-content-end">
                <Button variant="link" className="fs-1 text-primary text-decoration-none" onClick={() => props.onHide()}>
                    <i className="icon-close"></i>
                </Button>
            </Modal.Header>
            <Modal.Body className="pt-0">
                <ProfileForm onClose={props.onHide} onNotify={props.onNotify} />
            </Modal.Body>
        </Modal>
    );
}

export default ModalProfile;
