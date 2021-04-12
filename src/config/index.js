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
    titan: {
      1: '0x983C059D1be984F8f06C2559351C5ab1CB1dcDb7',
      3: '0x2198Ba5F278Fd48c8D73eC7Dfd4a880E6e2AcC11',
      42: ''
    },
    vault: {
      1: '0xf4487c5ff9E911eBB32f429B00264a4B27f39f9D',
      3: '0x17a320F48eF0Cc6F2227744f283FB56874D1bC65',
      42: ''
    },
    weth: {
      1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      3: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
      42: ''
    },
    wbtc: {
      1: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      3: '0x801F6d4A72dEf2E45f4c7023975875Cc3aC0f0C2',
      42: ''
    },
    yfi: {
      1: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      3: '0xD8264314efe9cACCbd6c741825b9fc1e9555aE4e',
      42: ''
    },
    usdc: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      3: '0x6323F2766191921372f6e647777436E6cE1a807a',
      42: ''
    },
    titanETHPair: {
      1: '0x06aC948b796042d8ff52792899da16d9C690E41b',
      3: '0x8ffde3ddec5eb0f567f4d92e5cd38a2cc74fb2c6',
      42: ''
    },
    wbtcETHPair: {
      1: '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940',
      3: '0x7c397E3Ca6C0c8ee386038D0D1593611ce2761F2',
      42: ''
    },
    yfiETHPair: {
      1: '0x2fDbAdf3C4D5A8666Bc06645B8358ab803996E28',
      3: '0xcc3Fb60F2220B452413ff9B9e6df12eF1db24753',
      42: ''
    },
    usdcETHPair: {
      1: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
      3: '0xC8eA7D6f5b97970CCeeBbe7B46a3AEb77BD21434',
      42: ''
    },
    univ2router: {
      1: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      3: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      42: ''
    }
  }
}

module.exports = config;
