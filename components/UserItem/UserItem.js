const UserItem = (props) => {
    return (
        <div className="card no-hover bg-transparent">
            <div className="single-seller d-flex align-items-center">
                {
                    props.avatar && (
                        <img className="avatar-md rounded-circle" src={props.avatar} alt="" />
                    )
                }
                <div className="seller-info ms-3">
                    <span className="text-white">{props.name}</span>
                    {
                        props.price && (
                            <span className="mt-2">{props.price} MATIC</span>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default UserItem;