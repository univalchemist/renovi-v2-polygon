import { useEffect, useState, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';

import * as API from '../../utils/Api';

import { HOMEPAGE_EXPLORER_NUMBER, FILTER_CATEGORIES } from '../../Constants';

const Explore = () => {
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const stateData = useSelector(state => state.saleItems);

    const [shuffle, setShuffle] = useState(null);
    const [filterParam, setFilterParam] = useState('all');

    const filter_grid_wrapper = createRef();
    const filter_sizer = createRef();
    useEffect(() => {
        const _getToken = async() => {
            const result = await API.getSaleForTokens();
            dispatch({
                type: "SET_SALE_ITEMS",
                data: result
            });
        }
        _getToken();

        const _shuffle = new window.Shuffle(filter_grid_wrapper.current, {
            itemSelector: '.explore-item',
            sizer: filter_sizer.current
        });
        setShuffle(_shuffle);
    }, []);

    useEffect(() => {
        // setData(stateData);
        var filteredTokens = stateData.filter(function(el){
            // console.log(el.creator.address)
            return el.creator.address !== "0xB481b2cecf769Dd1F05403F984321bF09Ac9A572" && el.creator.address !== "0xbdFA9774Cd5FfaeFA2757E7613a71FAd8a84056f";
        });
        // console.log(filteredTokens);
        setData(filteredTokens.slice(0, HOMEPAGE_EXPLORER_NUMBER));
    }, [stateData])

    useEffect(() => {
        if (shuffle) {
            shuffle.resetItems();
        }
    }, [data])

    const handleFilterChanged = (e) => {
        setFilterParam(e.target.value);
        shuffle.filter(e.target.value);
    }

    return (
        <section className="explore-area explore-area-filter">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Intro */}
                        <div className="d-flex justify-content-between flex-wrap align-items-center m-0">
                            <h3 className="mx-0 my-4">Explore</h3>
                            <div className="explore-menu btn-group flex-wrap justify-content-center text-center m-0" role="group">
                                <div key="filter_explorer_all" className="my-2">
                                    <input type="radio" defaultValue="all" id="filter_explorer_all" name="filter-explorer" className="explore-btn btn-check" defaultChecked
                                    onChange={(e) => handleFilterChanged(e)} />
                                    <label className="btn d-table text-uppercase px-3 py-2" htmlFor="filter_explorer_all">ALL</label>
                                </div>
                                {
                                    FILTER_CATEGORIES.map(cat => {
                                        return (
                                            <div key={`filter_explorer_${cat.value}`} className="my-2">
                                                <input type="radio" defaultValue={cat.value} id={`filter_explorer_${cat.value}`} name="filter-explorer"
                                                    className="explore-btn btn-check"
                                                    onChange={(e) => handleFilterChanged(e)} />
                                                <label className="btn d-table text-uppercase px-3 py-2" htmlFor={`filter_explorer_${cat.value}`}>{cat.name}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row items explore-items" ref={filter_grid_wrapper}>
                    {data.map((item, idx) => {
                        return (
                            <div key={`edth_${idx}`} className="col-12 col-sm-6 col-md-4 col-lg-3 item explore-item" data-groups={JSON.stringify([item.categories])}>
                                <div className="card border border-secondary bg-transparent">
                                    <a className="seller d-flex align-items-center mb-3">
                                    {
                                        item.owner?.avatar? (
                                            <img className="avatar-sm rounded-circle" src={item.owner?.avatar} alt="" />
                                        ):(
                                            <img className="avatar-sm rounded-circle" src='/images/avatar_placeholder.png' alt="" />
                                        )
                                    }
                                    </a>
                                    <div className="image-over image-over-small text-center bg-transparent m-auto">
                                        <a>
                                            <img className="card-img-top" src={item.image} alt="" />
                                        </a>
                                    </div>
                                    {/* Card Caption */}
                                    <div className="card-caption col-12 p-0">
                                        {/* Card Body */}
                                        <div className="card-body">
                                            <Link href={`/item-details?id=${item.id}`}>
                                                <a>
                                                    <h5 className="mb-0 text-truncate">{item.name}</h5>
                                                </a>
                                            </Link>
                                            {/*<p className="my-1 text-secondary">Highest bid {item.count}</p>*/}
                                            <p>Price: <span className="price-text">{item.price_in_eth} MATIC</span> </p>

                                            <Link href={`/item-details?id=${item.id}`}>
                                                <a className="mt-3">VIEW</a>
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={filter_sizer} className="col-1"></div>
                </div>
            </div>
        </section>
    );
}

export default Explore; 
