import { useState, useEffect } from 'react';
import UserItemByAddress from '../UserItem/UserItemByAddress';
import * as API from '../../utils/Api';
import * as Helpers from '../../utils/Helpers';

const TopSeller = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const _getTransactions = async() => {
            const result = await API.getTransactions();
            if (result && result.length > 0) {
                const _sellers = {};
                const current_ts = Math.floor(Date.now() / 1000);
                for (const _tx of result) {
                    // if ((parseFloat(current_ts) - parseFloat(_tx.time)) <= 86400) { // less than 1 day
                        const value_in_eth = parseFloat(Helpers.convertWeiToEth(_tx.value));
                        if (!_sellers[_tx.seller]) _sellers[_tx.seller] = value_in_eth;
                        else _sellers[_tx.seller] += value_in_eth;
                    // }
                }
                const sorted = Object.entries(_sellers).sort((a,b)=>(b[1]-a[1]));
                setData(sorted.splice(0,8));
            }
        }
        _getTransactions();
    }, []);

    return (
        <section className="top-seller-area">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Intro */}
                        <div className="intro m-0">
                            <div className="intro-content">
                                <h3 className="mt-3 mb-0">Top Sellers</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row items">
                    {data.map((item, idx) => {
                        return (
                            <div key={`ts_${idx}`} className="col-12 col-sm-6 col-md-4 col-lg-3 item">
                                {/* Single Seller */}
                                <UserItemByAddress address={item[0]} price={item[1]} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default TopSeller;