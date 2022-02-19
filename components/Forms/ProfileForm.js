import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as API from '../../utils/Api';
import { myProfileUpatedAction } from '../../utils/Actions';

import { useWeb3React } from '@web3-react/core';
import { pinFileToIPFS } from '../../utils/Pinata';

const ProfileForm = (props) => {
    const [processing, setProcessing] = useState(false);
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        username: "",
        email: "",
        avatar: "",
        description: ""
    });

    const [preview, setPreview] = useState("");

    const dispatch = useDispatch();
    const stateMyProfile = useSelector(state => state.myProfile);
    const stateWallet = useSelector(state => state.wallet);

    useEffect(() => {
        setData({
            username: stateMyProfile.username,
            email: stateMyProfile.email,
            avatar: stateMyProfile.avatar,
            description: stateMyProfile.description
        })
        setPreview(stateMyProfile.avatar);
    }, [stateMyProfile]);

    const handleImageChange = (e) => {
        if (!event.target.files?.length) {
            return;
        }
        setImage(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleSave = async() => {
        dispatch({
            type: 'SET_PROCESSING',
            data: true
        });
        setProcessing(true);
        try {
            const user_data = { ...data, account: stateWallet?.address };
            if (image) {
                const { pinataUrl: img_path } = await pinFileToIPFS(image);
                user_data.avatar = img_path;
            }
            const result = await API.addUser(user_data);
            if (result) {
                myProfileUpatedAction(dispatch, stateWallet?.address);
                props.onNotify('success', 'Saved your profile successfully!');
                props.onClose();
            }
        } catch (e) {
            props.onNotify('error', e.message);
        }
        setProcessing(false);
        dispatch({
            type: 'SET_PROCESSING',
            data: false
        });
    }
    
    const handleCancel = () => {
        props.onClose();
    }


    return (
        <>
            <form className="rnvi-form card no-hover pt-3 pb-5">
                <div className="row">
                    <h5 className="col-12 border-bottom pb-3">User Profile</h5>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="profile_username">Username</label>
                            <input type="text" className="form-control" id="profile_username" name="username" placeholder="Enter Username" required="required"
                                onChange={(e)=>handleChange(e)}
                                value={data.username} />
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="profile_email">Email Address</label>
                            <input type="email" className="form-control" id="profile_email" name="email" placeholder="Enter Email Address" required="required"
                                onChange={(e)=>handleChange(e)}
                                value={data.email} />
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="profile_description">Description</label>
                            <textarea className="form-control" name="description" id="profile_description" placeholder="Enter description" cols={30} rows={3} required="required"
                                onChange={(e)=>handleChange(e)}
                                value={data.description} />
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="d-flex">
                            <div className="form-group">
                                <label htmlFor="item_file">Select Avatar</label>
                                <input type="file" accept="video/*,image/*" className="form-control-file" id="profile_avatar" name="avatar" required="required"
                                    onChange={(e)=>handleImageChange(e)} />
                            </div>
                            {
                                preview && (<img src={preview} className="image-preview" />)
                            }
                        </div>
                    </div>
                    <div className="col-12 border-top pt-4 pb-5 text-end">
                        {/*<a href="#" className="btn btn-secondary me-3 px-4 py-2">Log out</a>*/}
                        <a href="#" className="btn btn-secondary me-3 px-4 py-2"
                            onClick={()=>handleCancel()}
                        >Cancel</a>
                        <button className={`btn btn-primary-alt px-4 py-2 ${processing?"processing": ""}`} type="button"
                            onClick={()=>handleSave()}
                            disabled={processing? "disabled": ""}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ProfileForm;