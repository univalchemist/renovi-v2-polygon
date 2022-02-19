// TokenItem
import Link from 'next/link';
const TokenItem = (item) => {
	return (
		<div className="card bg-transparent border border-secondary">
            <Link href={`/item-details?id=${item.id}`}><a className="seller d-flex align-items-center mb-3">
                <img className="avatar-sm rounded-circle" src={item.owner_avatar} alt="" />
            </a></Link>
            <div className="image-over">
                <Link href={`/item-details?id=${item.id}`}><a>
                    <img className="card-img-top" src={item.image} alt="" />
                </a></Link>
            </div>
            {/* Card Caption */}
            <div className="card-caption col-12 p-0">
                {/* Card Body */}
                <div className="card-body">
                    <Link href={`/item-details?id=${item.id}`}><a>
                        <h5 className="mb-0">{item.name}</h5>
                    </a></Link>
                    <p className="my-1 text-secondary">Highest bid {item.count}</p>
                    <p className="my-0 text-primary">{item.price}</p>
                </div>
            </div>
        </div>
		)
}
export default TokenItem