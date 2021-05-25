require('dotenv').config();

const web3Provider = process.env.REACT_APP_NETWORK_ID === '56'
  ? process.env.REACT_APP_MAIN_WEB3_PROVIDER
  : process.env.REACT_APP_TEST_WEB3_PROVIDER

const config = {
  web3Provider: web3Provider,
  networkId: process.env.REACT_APP_NETWORK_ID,
  contractAddress: {
    token: {
      56: '0x7B632ac6B3401C4989aE1b4978Bde62400e31eD3',
      97: '0x09d8f2a374d32ad4470f3f2f2ed401a3b160065c',
    },
    presale: {
      56: '0xAd72807Dc755FA4D17Bc95162dccee84954616d5',
      97: '0x6FF39060964f9c8Fe291C8E14C2212eF9C75385e',
    }
  }
}

module.exports = config;
