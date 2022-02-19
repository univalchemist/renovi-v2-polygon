/* eslint-disable react/jsx-no-comment-textnodes */
import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  connectWallet,
  getCurrentWalletConnected,
  getContract,
} from "./interact";
import "react-toastify/dist/ReactToastify.css";
import { whiteList } from "../lib/whitelist";
import { BigNumber } from "ethers";
import { AlchemyProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";

import { Link, ImmutableXClient } from "@imtbl/imx-sdk";

import Select from "react-select";

const path = require("path");
require("dotenv").config({
  path: path.resolve("config.env"),
});

const Mint = () => {
  const [loading, setMintLoading] = useState(false);

  const options = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
  ];

  const Web3 = require("web3");
  const ethereum = window.ethereum || null;
  const customStyle = {
    option: (provided, state) => ({
      ...provided,

      background: state.isFocused
        ? "grey"
        : state.isSelected
        ? "#FFF"
        : undefined,
      color: state.isSelected ? "rgb(51, 204, 255)" : "#FFF",
      backgroundColor: state.isSelected ? "#fff" : "#151027",
    }),
    control: (provided) => ({
      ...provided,
      fontSize: "22px",
      justify: "center",
      color: "#FFF",
      backgroundColor: "transparent",
      width: "300px",
    }),
  };

  const [mintCount, setMintCount] = useState(1);

  const [tokenPrice, setTokenPrice] = useState(null);
  const offset = (new Date().getTimezoneOffset() - 300) * 60 * 1000;
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [addrWhiteList, setAddrWhiteList] = useState(null);
  const [maxTokens, setMaxTokens] = useState(0);

  const [status, setStatus] = useState(null);

  const pubsaleTime = new Date("January 26, 2022 12:00:00").getTime() - offset;
  const presaleTime = new Date(process.env.PRESALE_DATE).getTime();

  // IMX Client
  const linkAddress = process.env.LINKADDRESS;
  const [client, setClient] = useState(null);
  const link = new Link(linkAddress);
  const receiverAddress = process.env.RECEIVERADDRESS;
  const devRoyaltyAddress = process.env.DEVROYALTYADDRESS;
  const chainId = process.env.CHAINID;
  const contractAddress = process.env.CONTRACTADDRESS;
  const apiAddress = process.env.APIADDRESS;
  const starkContractAddress = process.env.STARKCONTRACTADDRESS;
  const registrationContractAddress = process.env.REGCONTRACTADDRESS;
  const alchemyApiKey = process.env.ALCHEMYAPIKEY;
  const ipfsUrl = process.env.IPFSURL;
  const tokenpricePayment = process.env.TOKENPRICEPAYMENT;
  const tokenpricePaymentdev = process.env.TOKENPRICEPAYMENTDEV;
  //  an Immutable X Client to interact with apis more easily

  useEffect(async () => {
    setClient(await ImmutableXClient.build({ publicApiUrl: apiAddress }));
    const { address, status } = await getCurrentWalletConnected();
    setWalletAddress(address);
    setStatus(status);
  }, []);

  useEffect(() => {
    (async () => {
      let contract = getContract(walletAddress);
      try {
        let tp = await contract.tokenPrice();
        let mt = await contract.MAX_TOKENS();
        setMaxTokens(BigNumber.from(mt).toNumber());
        setTokenPrice(
          BigNumber.from(tp)
            .div(BigNumber.from(1e9).mul(BigNumber.from(1e4)))
            .toString()
        ); // original value * 1e5
      } catch (err) {
      }
    })();
  }, [loading, walletAddress]);

  const notify = () =>
    toast.info(status, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

  useEffect(() => {
    if (status) {
      notify();
      setStatus(null);
    }
  }, [status]);

  useEffect(() => {
    let whitelist = whiteList.map((addr) => addr.toString().toLowerCase());
    setAddrWhiteList(whitelist);
  }, []);

  const onClickConnectWallet = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWalletAddress(walletResponse.address);
  };

  const onClickDisconnectWallet = async () => {
    setWalletAddress(null);
  };

  useEffect(() => {
    let timerID = setInterval(() => {
      let curTime = new Date().getTime();
      if (
        curTime < pubsaleTime &&
        Array.isArray(addrWhiteList) &&
        walletAddress != null
      ) {
        addrWhiteList.includes(walletAddress.toString().toLowerCase())
          ? setIsWhiteListed(true)
          : setIsWhiteListed(false);
      }
    }, 1000 * 60);
    return () => clearInterval(timerID);
  });

  function _handleChange(e) {
    setMintCount(e.value);
  }

  async function onMint() {
    let curTime = new Date().getTime();
    let total_list,
      available_list,
      mint_list,
      occupied_list = [];
    let linked_wallet;
    // Check mint is available
    if (curTime < presaleTime) {
      setStatus("Please wait for the private sale time.");
      return;
    }

    // Connect to Immutable-X to register user
    try {
      linked_wallet = await link.setup({});
    } catch (err) {
      setMintLoading(false);
      setStatus("Wallet connection failed");
      return;
    }
    if (!walletAddress) {
      setStatus("Please connect your Wallet");
      return;
    }
    
    setMintLoading(true);

    // Check minted token number
    let assets = [];

    let assetsRequest;

    try {
      assetsRequest = await client.getAssets({
        user: linked_wallet.address,
        collection: contractAddress,
      });
    } catch (err) {
      setMintLoading(false);
      setStatus("Get Assets for User Failed");
      return;
    }

    assets = assets.concat(assetsRequest.result);
    if (
      assets.length + mintCount >
      process.env.MAX_TOKENS_PER_ADDRESS
    ) {
      setMintLoading(false);
      setStatus("Exceeded max token purchase per wallet");
      return;
    }

    assetsRequest = await client.getAssets({ collection: contractAddress });
    assets = assets.concat(assetsRequest.result);
    if (assets.length + mintCount > process.env.MAX_TOKENS_TOTAL) {
      setMintLoading(false);
      setStatus("Purchase would exceed max supply of tokens");
      return;
    }

    //debugger;
    // ETH Amount
    const web3 = new Web3(ethereum);
    let ethAmount = web3.utils.toWei(
      String(tokenpricePaymentdev * mintCount),
      "ether"
    );
    if (process.env.ENV === "mainnet") {
      ethAmount = web3.utils.toWei(
        String(tokenpricePayment * mintCount),
        "ether"
      );
    }

    const tx = {
      from: linked_wallet.address,
      to: receiverAddress,
      value: ethAmount,
    };

    let address = linked_wallet.address.toString();

    // Send ETH

    await web3.eth
      .sendTransaction(tx)
      .on("receipt", async (receipt) => {
        const signed = await web3.eth.personal.sign(
          JSON.stringify(receipt),
          address
        );
        const params = {
          address,
          signed,
          reservedId: receipt.id,
          ...receipt,
        };

        // payment receipt received so start minting on imx
        setMintLoading(true);

        try {
          if (receipt.transactionHash) {
            // Get Minter to mint NFT on Immutable-X
            let alchemy_provider;
            if (chainId === "0x3") {
              alchemy_provider = new AlchemyProvider("ropsten", alchemyApiKey);
            } else if (chainId === "0x1") {
              alchemy_provider = new AlchemyProvider("mainnet", alchemyApiKey);
            }

            // debugger;
            const minter = await ImmutableXClient.build({
              publicApiUrl: apiAddress,
              starkContractAddress: starkContractAddress,
              registrationContractAddress: registrationContractAddress,
              signer: new Wallet(process.env.MINTER_KEY).connect(
                alchemy_provider
              ),
            });

            try {
              let assetCursor;
              let assetsRequest;
              do {
                let assets = [];

                try {
                  assetsRequest = await client.getAssets({
                    collection: contractAddress,
                    cursor: assetCursor,
                  });
                } catch (err) {
                  setMintLoading(false);
                  setStatus("Get Assets for User Failed");
                  return;
                }

                assets = assets.concat(assetsRequest.result);
                assets.map((asset) =>
                  occupied_list.push(parseInt(asset.token_id))
                );

                assetCursor = assetsRequest.cursor;
              } while (assetCursor);
            } catch (err) {
              setStatus("Immutable-X interaction failed.");
              setMintLoading(false);
              return;
            }

            // Get available mint id
            total_list = Array.from(Array(3500).keys());
            total_list.shift();
            available_list = total_list.filter(
              (id) => !occupied_list.includes(id)
            );
            let shuffled = available_list.sort(function () {
              return 0.5 - Math.random();
            });
            mint_list = shuffled.slice(0, mintCount);

            // Mint NFT token on Immutable-X
            const tokens = mint_list.map((i) => ({
              id: i.toString(),
              blueprint: ipfsUrl,
            }));

            const payload = [
              {
                contractAddress: contractAddress,

                royalties: [
                  // multiple recipients
                  {
                    //  developer
                    recipient: receiverAddress.toLowerCase(),
                    percentage: 5,
                  },
                ],

                users: [
                  {
                    etherKey: linked_wallet.address.toLowerCase(),
                    tokens: tokens,
                  },
                ],
                // globally set royalties
              },
            ];

            // mint token on Immutable X Platform

            try {
              // debugger;
              const result = await minter.mintV2(payload);
              setStatus(`You minted ${mintCount} Arctic Bearz Successfully`);
              setMintLoading(false);
            } catch (err) {
              setStatus("Mint on Immutable X failed");
              setMintLoading(false);
            }
          }
          setMintLoading(false);
        } catch (err) {
          let errorContainer =
            err.error && err.error.message ? err.error.message : "";
          let errorBody = errorContainer.substr(
            errorContainer.indexOf(":") + 1
          );
          let status =
            "Transaction failed because you have insufficient funds or sales not started";
          errorContainer.indexOf("execution reverted") === -1
            ? setStatus(status)
            : setStatus(errorBody);
          setMintLoading(false);
        }
      })
      .on("error", (err) => { });
  }
  return (
    <div>
      <div style={{ width: "15%", margin: "30px auto" }}>
        <Select
          options={options}
          menuPlacement="auto"
          menuPosition="fixed"
          placeholder="Select number of tokens"
          onChange={(e) => _handleChange(e)}
          styles={customStyle}
        />
      </div>

      <button className="primary-button" onClick={() => onMint()} width="400">
        WHITELIST-SALE MINT
      </button>
      <ToastContainer />
    </div>
  );
};

export default Mint;
