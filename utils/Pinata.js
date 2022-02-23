const axios = require('axios');
const FormData = require('form-data');

const pinata_base_uri = "https://api.pinata.cloud"
const pinata_gateway_uri = "https://renovi.mypinata.cloud/ipfs/"
const key = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const secret = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

export const pinJSONToIPFS = async (JSONBody) => {
  const url = `${pinata_base_uri}/pinning/pinJSONToIPFS`;
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      }
  })
    .then(function (response) {
      return {
        success: true,
        pinataUrl: pinata_gateway_uri + response.data.IpfsHash
      };
    })
    .catch(function (error) {
      return {
        success: false,
        message: error.message,
      }
    });
};

export const pinFileToIPFS = async (file) => {
  let data = new FormData();
  data.append("file", file);
  const url = `${pinata_base_uri}/pinning/pinFileToIPFS`;
  return axios
    .post(url, data, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      }
  })
    .then(function (response) {
      return {
        success: true,
        pinataUrl: pinata_gateway_uri + response.data.IpfsHash
      };
    })
    .catch(function (error) {
      return {
        success: false,
        message: error.message,
      }

    });
};