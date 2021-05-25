/* eslint-disable quote-props */
/* eslint-disable max-len */
import { web3 } from './web3';
import config from '../config';

import tokenContractAbi from './abis/tokenContract.json';
import presaleContractAbi from './abis/presaleContract.json';

const networkId = config.networkId;
const tokenConrtractAddress = config.contractAddress.token[networkId];
const ITokenContract = new web3.eth.Contract(tokenContractAbi, tokenConrtractAddress);

const presaleContractAddress = config.contractAddress.presale[networkId];
const IPresaleContract = new web3.eth.Contract(presaleContractAbi, presaleContractAddress);

const tokenContract = {
  address: tokenConrtractAddress,
  abi: tokenContractAbi,
  contract: ITokenContract,
  decimals: 9
};

const presaleContract = {
  address: presaleContractAddress,
  abi: presaleContractAbi,
  contract: IPresaleContract
};

export {
  networkId,
  tokenContract,
  presaleContract,
};
