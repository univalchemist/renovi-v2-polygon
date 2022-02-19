import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as API from '../../utils/Api';

import { useWeb3React } from '@web3-react/core';

import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ProfileView = (props) => {

    const data = useSelector(state => state.myProfile);

    return (
        <>
            <section className="profile-view">
                <div className="container">
                    <Row className="text-center">
                        <Col xs="12" className="fs-3 text-primary mb-3">
                            <img className="avatar-lg rounded-circle" src={data.avatar?data.avatar:'/images/avatar_placeholder.png' } alt="Avatar" />
                        </Col>
                        <Col xs="12" className="fs-3 text-primary mb-3">{data.username?data.username:"Anonymous"}</Col>
                        {
                            data.email && (<Col xs="12" className="fs-5 text-white mb-3">{data.email}</Col>)
                        }
                        {
                            data.description && (<Col xs="12" className="">{data.description}</Col>)
                        }
                    </Row>
                </div>
            </section>
        </>
    );
}

export default ProfileView;