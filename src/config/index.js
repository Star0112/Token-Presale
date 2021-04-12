require('dotenv').config();

const web3Provider = process.env.REACT_APP_NETWORK_ID === '1'
  ? process.env.REACT_APP_MAIN_WEB3_PROVIDER
  : (process.env.REACT_APP_NETWORK_ID === '3' 
  ? process.env.REACT_APP_TEST_WEB3_PROVIDER
  : process.env.REACT_APP_KOVAN_WEB3_PROVIDER)

const config = {
  web3Provider: web3Provider,
  networkId: process.env.REACT_APP_NETWORK_ID,
  contractAddress: {
    fpen: {
      56: '',
      97: '0x341DB60C0BeAE36Ba6Bc72cE6e0c5bFe200791fc',
    },
    presale: {
      56: '',
      97: '0xc7e3ea78717eACF10507c63E3708Aed213678B75',
    }
  }
}

module.exports = config;
