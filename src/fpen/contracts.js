/* eslint-disable quote-props */
/* eslint-disable max-len */
import { web3 } from './web3';
import config from '../config';

import fpenContractAbi from './abis/fpenContract.json';
import presaleContractAbi from './abis/presaleContract.json';

const networkId = config.networkId;
const fpenConrtractAddress = config.contractAddress.fpen[networkId];
const IFpenContract = new web3.eth.Contract(fpenContractAbi, fpenConrtractAddress);

const presaleContractAddress = config.contractAddress.presale[networkId];
const IPresaleContract = new web3.eth.Contract(presaleContractAbi, presaleContractAddress);

const fpenContract = {
  address: fpenConrtractAddress,
  abi: fpenContractAbi,
  contract: IFpenContract,
  decimals: 9
};

const presaleContract = {
  address: presaleContractAddress,
  abi: presaleContractAbi,
  contract: IPresaleContract
};

export {
  networkId,
  fpenContract,
  presaleContract,
};
