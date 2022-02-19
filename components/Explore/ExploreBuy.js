import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Spinner } from 'react-bootstrap';

import * as API from '../../utils/Api';
import { ITEMS_PER_PAGE } from '../../Constants';
import { AVAILABLE_METAVERSES_MAPPING } from '../../Constants';

const ExploreBuy = () => {
    const dispatch = useDispatch();
    const stateData = useSelector(state => state.saleItems);
    const [data, setData] = useState([]);

    const [page, setPage] = useState(0);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [fetchingData, setFetchingData] = useState(false);

    useEffect(() => {
        setData(stateData);
    }, [stateData])

    useEffect(() => {
        const _getToken = async() => {
            setFetchingData(true);
            const result = await API.getSaleForTokens();
            dispatch({
                type: "SET_SALE_ITEMS",
                data: result
            });
            setFetchingData(false);
        }
        _getToken();
    }, []);
    useEffect(() => {
        const new_items = [
            ...data.slice(0, (page + 1) * ITEMS_PER_PAGE)
        ];
        setItems(new_items);
    }, [data, page]);


    return (
        <>
            <section className="explore-area load-more">
                {
                    fetchingData && (
                        <div className="section-loading-container">
                            <Spinner animation="border" variant="light" />
                        </div>
                    )
                }
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {/* Intro */}
                            <div className="intro d-flex justify-content-between align-items-end m-0">
                                <div className="intro-content">
                                    <h3 className="mt-3 mb-0">Explore</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        data.length > 0 ?
                        (
                            <>
                                <div className="d-flex flex-wrap justify-content-center mt-3">
                                    {items.map((item, idx) => {
                                        return (
                                            <div key={`exo_${idx}`} className="explore-card-wrapper">
                                                <div key={`exo_${idx}`} className="card">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h5 className="m-0">{item.category_name}</h5>
                                                        <div className="circle-badge bg-white text-dark">
                                                            <h3 className="text-dark">{item.id}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="image-over">
                                                        <img className="card-img-top" src={item.image} alt="" />
                                                    </div>
                                                    {/* Card Caption */}
                                                    <div className="card-caption col-12 p-0">
                                                        {/* Card Body */}
                                                        <div className="card-body text-light">
                                                            <Link href={`/item-details?id=${item.id}`}>
                                                                <a>
                                                                    <h5 className="mb-0 text-truncate">{item.name}</h5>
                                                                </a>
                                                            </Link>
                                                            <p>Price: <span className="price-text">{item.price_in_eth} MATIC</span> </p>
                                                            <p className="item-description">
                                                                {item.description?.length > 60 ? `${item.description.substring(0,60)}...`: item.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <Link href={`/item-details?id=${item.id}`}>
                                                        <a className="btn btn-primary-alt px-4 py-3 d-block">View</a>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {
                                    data.length > items.length && (
                                        <div className="row">
                                            <div className="col-12 text-center">
                                                <button className="btn btn-primary-alt mt-5 px-4 py-3" onClick={() => setPage(page + 1)}>Load More</button>
                                            </div>
                                        </div>
                                    )
                                }
                            </>
                        ): (
                            <div className="row mt-5">
                                <h4 className="col-12 text-center text-secondary">No any items.</h4>
                            </div>
                        )
                    }
                </div>
            </section>
        </>
    );
}

export default ExploreBuy;