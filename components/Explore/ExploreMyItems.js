import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import Link from 'next/link';
import * as API from '../../utils/Api';
import { ITEMS_PER_PAGE } from '../../Constants';

const ExploreMyItems = () => {
  const dispatch = useDispatch();
  const stateData = useSelector(state => state.myItems);
  const stateWallet = useSelector(state => state.wallet);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    setData(stateData);
  }, [stateData])

  useEffect(() => {
    const _getToken = async(acc) => {
      setFetchingData(true);
      const result = await API.getTokensByAddress(acc);
      dispatch({
        type: "SET_MY_ITEMS",
        data: result
      });
      setFetchingData(false);
    }
    if (stateWallet.address) {
      _getToken(stateWallet.address);
    }
  }, [stateWallet.address]);

  useEffect(() => {
    const new_items = [
      ...data.slice(0, (page + 1) * ITEMS_PER_PAGE)
    ];
    setItems(new_items);
  }, [data, page]);

  const handlePriceChanged = (e, idx) => {
    // e.target.value
    const updated_items = [...items];
    updated_items[idx].price_in_eth = e.target.value;
    setItems(updated_items);
  }

  const handlePutForSaleSubmit = (idx) => {
    const token_id = items[idx].id;
    const status = "sale";
    const price_in_eth = items[idx].price_in_eth;
    handleChangeSubmit(idx, token_id, status, price_in_eth);
  }

  const handleNotForSaleSubmit = (idx) => {
    const token_id = items[idx].id;
    const status = "notsale";
    const price_in_eth = items[idx].price_in_eth;
    handleChangeSubmit(idx, token_id, status, price_in_eth);
  }

  const handlePricheChangeSubmit = (idx) => {
    const token_id = items[idx].id;
    const status = items[idx].status;
    const price_in_eth = items[idx].price_in_eth;
    handleChangeSubmit(idx, token_id, status, price_in_eth);
  }

  const handleChangeSubmit = async(idx, token_id, status, price_in_eth) => {
    dispatch({
      type: 'SET_PROCESSING',
      data: true
    });
    try {
      const _token = await API.updateTokenStatus(stateWallet, token_id, status, price_in_eth);
      const _data = [...data];
      _data[idx] = _token;
      setData(_data);
      handleSuccessNotification("Updated successfully!");
    } catch (e) {
      handleErrorNotification(e.message);
    }
    dispatch({
      type: 'SET_PROCESSING',
      data: false
    });
  }

  const handleSuccessNotification = (msg) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        type: "success",
        msg: msg
      }
    });
  }

  const handleErrorNotification = (msg) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        type: "error",
        msg: msg
      }
    });
  }

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
                  <h3 className="mt-3 mb-0">My Items</h3>
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
                        <div className="input-group mt-3">
                          <input type="text"
                            className="form-control rounded-0 h-auto border-0"
                            placeholder="Current price"
                            aria-label="Current price"
                            value={item.price_in_eth}
                            onChange={(e) => handlePriceChanged(e, idx)} />
                          <div className="input-group-append">
                          {
                            item.status !== "sale"? (
                              <button className={`btn btn-primary-alt`} type="button"
                                onClick={() => handlePutForSaleSubmit(idx)}
                              >
                                Put For Sale
                              </button>
                            ): (
                              <>
                                <button className={`btn btn-primary-alt`} type="button"
                                  onClick={() => handlePricheChangeSubmit(idx)}
                                >Change Price</button>
                                <button className={`btn btn-danger`} type="button"
                                  onClick={() => handleNotForSaleSubmit(idx)}
                                >Not For Sale</button>
                              </>
                            )
                          }
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {
                  data.length > 0 && data.length > items.length && (
                    <div className="row">
                      <div className="col-12 text-center">
                        <button className="btn btn-primary-alt mt-5 px-4 py-3" onClick={() => setPage(page + 1)}>Load More</button>
                      </div>
                    </div>
                  )
                }
              </>
            ):(
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

export default ExploreMyItems;