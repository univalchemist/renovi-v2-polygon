import React, { Component } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper';
SwiperCore.use([Pagination]);

import 'swiper/swiper-bundle.min.css';

import TokenItem from '../TokenItem/TokenItem';

const data = [
    {
        id: "1",
        image: "/images/token/a1.png",
        name: "Virtual Worlds",
        owner_avatar: "/images/avatar/avatar_1.png",
        owner_name: "@Richard",
        price: "1.5 ETH",
        count: "1 of 1"
    },
    {
        id: "2",
        image: "/images/token/a2.png",
        date: "2021-10-05",
        name: "Collectibles",
        owner_avatar: "/images/avatar/avatar_2.png",
        owner_name: "@JohnDeo",
        price: "2.7 ETH",
        count: "1 of 1"
    },
    {
        id: "3",
        image: "/images/token/a3.png",
        date: "2021-09-15",
        name: "Arts",
        owner_avatar: "/images/avatar/avatar_3.png",
        owner_name: "@MKHblots",
        price: "2.3 ETH",
        count: "1 of 1"
    },
    {
        id: "4",
        image: "/images/token/a4.png",
        date: "2021-12-29",
        name: "Robotic Arts",
        owner_avatar: "/images/avatar/avatar_4.png",
        owner_name: "@RioArham",
        price: "1.8 ETH",
        count: "1 of 1"
    },
    {
        id: "5",
        image: "/images/token/a3.png",
        date: "2022-01-24",
        name: "Design Illusions",
        owner_avatar: "/images/avatar/avatar_5.png",
        owner_name: "@ArtNox",
        price: "1.7 ETH",
        count: "1 of 1"
    },
    {
        id: "6",
        image: "/images/token/a2.png",
        date: "2022-03-30",
        name: "Photography",
        owner_avatar: "/images/avatar/avatar_6.png",
        owner_name: "@Junaid",
        price: "3.5 ETH",
        count: "1 of 1"
    }
]

const Auctions = () => {
    return (
        <section className="live-auctions-area">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Intro */}
                        <div className="intro d-flex justify-content-between align-items-end m-0">
                            <div className="intro-content">
                                <h3 className="mt-3 mb-0">Live auctions</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 custom-swiper-wrapper">
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={10}
                            breakpoints={{
                                "640": {
                                    "slidesPerView": 2,
                                    "spaceBetween": 20
                                },
                                "768": {
                                    "slidesPerView": 3,
                                    "spaceBetween": 30
                                },
                                "1024": {
                                    "slidesPerView": 4,
                                    "spaceBetween": 20
                                }
                            }}
                            pagination={{ clickable: true }}
                        >
                            {data.map((item, idx) => {
                                return (
                                    <SwiperSlide key={`auc_${idx}`} className="item">
                                        <TokenItem {...item} />
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Auctions;