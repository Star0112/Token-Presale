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
      1: '0x983C059D1be984F8f06C2559351C5ab1CB1dcDb7',
      3: '0x2198Ba5F278Fd48c8D73eC7Dfd4a880E6e2AcC11',
      42: ''
    },
    presale: {
      1: '0xf4487c5ff9E911eBB32f429B00264a4B27f39f9D',
      3: '0x17a320F48eF0Cc6F2227744f283FB56874D1bC65',
      42: ''
    }
  }
}

module.exports = config;
