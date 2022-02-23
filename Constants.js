export const NFT_ADDRESS = process.env.NEXT_PUBLIC_NFT_ADDRESS;

export const NETWORK_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME;
export const NETWORK_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID);
// export const NETWORK_CHAIN_ID = 80001;

export const API_URL = process.env.NEXT_PUBLIC_API_URL

export const HOMEPAGE_EXPLORER_NUMBER = 32;
export const ITEMS_PER_PAGE = 3;

export const STATUS_OPTION = {
    nosale: 0,
    sale: 1
}

export const FILTER_CATEGORIES = [
    {name: "Indoor", value: "indoor"},
    {name: "Outdoor", value: "outdoor"},
    {name: "Mansion", value: "mansion"},
    {name: "Studios", value: "studios"},
    {name: "Houses", value: "houses"},
    {name: "Apartments", value: "apartments"},
    {name: "Playground", value: "playground"},
    {name: "Office", value: "office"}
];

export const AVAILABLE_METAVERSES = [
    // {name: "N/A", value: "N/A", logo:""},
    {name: "Decentraland", value: "Decentraland", logo:"/images/icons/decentraland.png"},
    {name: "Sandbox", value: "Sandbox", logo:"/images/icons/sandbox.png"},
    {name: "Netvrk", value: "Netvrk", logo:"/images/icons/netvrk.png"},
    {name: "Aftermath Island", value: "Aftermath Island", logo:"/images/icons/aftermath-island.png"},

];

export const AVAILABLE_METAVERSES_MAPPING = {
    "Decentraland": "/images/icons/decentraland.png",
    "Sandbox": "/images/icons/sandbox.png",
    "Netvrk": "/images/icons/netvrk.png",
    "Aftermath Island": "/images/icons/aftermath-island.png"
}

export const FOOTER_LINKS = {
    "widget_1": {
        "title": "Renovi",
        "data": [
            {
                "id": 1,
                "text": "Home",
                "link": "https://my.renovi.io"
            },
            {
                "id": 2,
                "text": "Wallet Connect",
                "link": "/wallet-connect"
            },
            {
                "id": 3,
                "text": "",
                "link": ""
            },
            {
                "id": 4,
                "text": "",
                "link": ""
            }
        ]
    },
    "widget_2": {
        "title": "Legal",
        "data": [
            {
                "id": 1,
                "text": "Privacy Policy",
                "link": "https://my.renovi.io/assets/cookies.pdf"
            },
            {
                "id": 2,
                "text": "",
                "link": ""
            }
        ]
    },
    "widget_3": {
        "title": "Contact us",
        "data": [
            {
                "id": 1,
                "text": "Media enquiries: piers.zangana@susacomms.com",
                "link": "mailto:piers.zangana@susacomms.com"
            },
            {
                "id": 2,
                "text": "General enquiries: info@renovi.io",
                "link": "mailto:info@renovi.io"
            },
            {
                "id": 3,
                "text": "",
                "link": ""
            },
            {
                "id": 4,
                "text": "",
                "link": ""
            }
        ]
    },
};