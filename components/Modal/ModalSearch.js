import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Router from 'next/router';

const ModalSearch = (props) => {
    const [data, setData] = useState({
        searchkey: ""
    });
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        Router.push(`/search-results?s=${data.searchkey}`);
        props.onHide();
    }
    return (
        <Modal {...props} centered>
            <Modal.Header className="pb-0">
                <Modal.Title className="text-primary">
                    SEARCH
                </Modal.Title>
                <Button variant="link" className="fs-1 text-primary text-decoration-none" onClick={() => props.onHide()}>
                    <i className="icon-close"></i>
                </Button>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Control
                        name="searchkey"
                        type="search"
                        value={data.searchkey}
                        placeholder="Search by item"
                        className="bg-white border-0 text-white bg-opacity-10 rounded-0"
                        aria-label="Search"
                        onChange={handleChange}
                    />
                    <button className="btn btn-primary-alt px-4 mt-4">Search</button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ModalSearch;