/* eslint-disable quote-props */
/* eslint-disable max-len */
import { web3 } from './web3';
import config from '../config';

import titanContractAbi from './abis/titanContract.json';
import vaultContractAbi from './abis/vaultContract.json';
import uniV2PairContractAbi from './abis/titanETHPairContract.json';
import wethContractAbi from './abis/wethContract.json';
import wbtcContractAbi from './abis/wbtcContract.json';
import yfiContractAbi from './abis/yfiContract.json';

const networkId = config.networkId;
const titanContractAddress = config.contractAddress.titan[networkId];
const ItitanContract = new web3.eth.Contract(titanContractAbi, titanContractAddress);

const vaultContractAddress = config.contractAddress.vault[networkId];
const IVaultContract = new web3.eth.Contract(vaultContractAbi, vaultContractAddress);

const titanETHPairContractAddress = config.contractAddress.titanETHPair[networkId];
const ItitanETHPairContract = new web3.eth.Contract(uniV2PairContractAbi, titanETHPairContractAddress);

const yfiETHPairContractAddress = config.contractAddress.yfiETHPair[networkId];
const IyfiETHPairContract = new web3.eth.Contract(uniV2PairContractAbi, yfiETHPairContractAddress);

const wbtcETHPairContractAddress = config.contractAddress.wbtcETHPair[networkId];
const IwbtcETHPairContract = new web3.eth.Contract(uniV2PairContractAbi, wbtcETHPairContractAddress);

const wethContractAddress = config.contractAddress.weth[networkId];
const IWethContract = new web3.eth.Contract(wethContractAbi, wethContractAddress);

const wbtcContractAddress = config.contractAddress.wbtc[networkId];
const IwbtcContract = new web3.eth.Contract(wbtcContractAbi, wbtcContractAddress);

const yfiContractAddress = config.contractAddress.yfi[networkId];
const IyfiContract = new web3.eth.Contract(yfiContractAbi, yfiContractAddress);

const usdcETHPairContractAddress = config.contractAddress.usdcETHPair[networkId];
const IusdcETHPairContract = new web3.eth.Contract(uniV2PairContractAbi, usdcETHPairContractAddress);

const titanContract = {
  address: titanContractAddress,
  abi: titanContractAbi,
  contract: ItitanContract,
  decimals: 18
};

const vaultContract = {
  address: vaultContractAddress,
  abi: vaultContractAbi,
  contract: IVaultContract
};

const titanETHPairContract = {
  address: titanETHPairContractAddress,
  abi: uniV2PairContractAbi,
  contract: ItitanETHPairContract,
  decimals: 18
};

const yfiETHPairContract = {
  address: yfiETHPairContractAddress,
  abi: uniV2PairContractAbi,
  contract: IyfiETHPairContract,
  decimals: 18
};


const wbtcETHPairContract = {
  address: wbtcETHPairContractAddress,
  abi: uniV2PairContractAbi,
  contract: IwbtcETHPairContract,
  decimals: 18
};


const wethContract = {
  address: wethContractAddress,
  abi: wethContractAbi,
  contract: IWethContract,
  decimals: 18
};

const wbtcContract = {
  address: wbtcContractAddress,
  abi: yfiContractAbi,
  contract: IwbtcContract,
  decimals: 8
};

const yfiContract = {
  address: yfiContractAddress,
  abi: wbtcContractAbi,
  contract: IyfiContract,
  decimals: 18
};

const usdcETHPairContract = {
  address: usdcETHPairContractAddress,
  abi: uniV2PairContractAbi,
  contract: IusdcETHPairContract,
  decimals: 18
};

export {
  networkId,
  titanContract,
  vaultContract,
  titanETHPairContract,
  yfiETHPairContract,
  wbtcETHPairContract,
  wethContract,
  wbtcContract,
  yfiContract,
  usdcETHPairContract
};
