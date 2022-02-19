import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import { Spinner } from 'react-bootstrap';

import * as API from '../../utils/Api';
import { ITEMS_PER_PAGE } from '../../Constants';

const ExploreSearch = (props) => {
    const dispatch = useDispatch();
    const stateSearchItems = useSelector(state => state.searchItems);

    const [data, setData] = useState([]);

    const [page, setPage] = useState(0);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [fetchingData, setFetchingData] = useState(false);

    useEffect(() => {
        setData(stateSearchItems);
    }, [stateSearchItems])

    useEffect(() => {
        setPage(0); // reset page number whenever keyword is changed
        const _getToken = async() => {
            setFetchingData(true);
            const result = await API.getSaleForTokens();
            const _searchkey = props.searchkey? props.searchkey.toLowerCase(): "";
            let filtered = [];
            if (_searchkey && result && result.length > 0) {
                filtered = result.filter(_item => {
                            return (_item.name?.toLowerCase().search(_searchkey) > -1) ||
                                (_item.categories?.toLowerCase().search(_searchkey) > -1) ||
                                (_item.description?.toLowerCase().search(_searchkey) > -1) ||
                                (_item.creator?.name?.toLowerCase().search(_searchkey) > -1) ||
                                (_item.creator?.address?.toLowerCase().search(_searchkey) > -1) ||
                                (_item.creator?.email?.toLowerCase().search(_searchkey) > -1);
                            });
            } else {
                filtered = result;
            }

            dispatch({
                type: "SET_SEARCH_ITEMS",
                data: filtered
            });
            setFetchingData(false);
        }
        _getToken();
    }, [props.searchkey]);
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
                            <div className="d-flex justify-content-between align-items-end m-0">
                                <h3 className="mt-3 mb-0">
                                    Search Results For
                                    <span className="text-primary ms-4">{`"${props.searchkey}"`}</span>
                                </h3>
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
                                                <div className="card">
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
                                                            <p className="item-description">
                                                                {item.description?.length > 60 ? `${item.description.substring(0,60)}...`: item.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <Link href={`/item-details?id=${item.id}`}>
                                                        <a className="btn btn-primary-alt px-4 py-3">Buy for {item.price_in_eth} ETH</a>
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
                                <h4 className="col-12 text-center text-secondary">No result</h4>
                            </div>
                        )
                    }
                </div>
            </section>
        </>
    );
}

export default ExploreSearch;