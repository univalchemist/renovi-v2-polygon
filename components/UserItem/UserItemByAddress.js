import { useEffect, useState } from 'react';
import { getUser } from '../../utils/Api';

const UserItemByAddress = (props) => {
    const [user, setUser] = useState({
        avatar: "",
        name: ""
    });

    useEffect(() => {
        const _getUser = async(addr) => {
            const result = await getUser(addr);
            const _user = { ...user };
            if (result.avatar) _user.avatar = result.avatar;
            if (result.username) _user.name = result.username;
            setUser(_user);
        }
        if (props.address) {
            _getUser(props.address);
        }
    }, [props.address]);
    return (
        <div className="card no-hover bg-transparent">
            <div className="single-seller d-flex align-items-center">
                {
                    user.avatar? (
                        <img className="avatar-md rounded-circle" src={user.avatar} alt="" />
                    ): (
                        <img className="avatar-md rounded-circle" src='/images/avatar_placeholder.png' alt="" />
                    )
                }
                <div className="seller-info ms-3">
                    {
                        user.name? (
                            <span className="text-white">{user.name}</span>
                        ):(
                            <span className="text-white">{`${props.address?.substring(0, 6)}...${props.address?.substring(props.address.length - 4)}`}</span>
                        )
                    }
                    {
                        props.price && (
                            <span className="mt-2">{props.price.toFixed(3)} MATIC</span>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default UserItemByAddress;