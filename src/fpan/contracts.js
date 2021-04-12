/* eslint-disable quote-props */
/* eslint-disable max-len */
import { web3 } from './web3';
import config from '../config';

import fpanContractAbi from './abis/fpanContract.json';
import presaleContractAbi from './abis/presaleContract.json';

const networkId = config.networkId;
const fpanConrtractAddress = config.contractAddress.fpan[networkId];
const IFpanContract = new web3.eth.Contract(fpanContractAbi, fpanConrtractAddress);

const presaleContractAddress = config.contractAddress.presale[networkId];
const IPresaleContract = new web3.eth.Contract(presaleContractAbi, presaleContractAddress);

const fpanContract = {
  address: fpanConrtractAddress,
  abi: fpanContractAbi,
  contract: IFpanContract,
  decimals: 9
};

const presaleContract = {
  address: presaleContractAddress,
  abi: presaleContractAbi,
  contract: IPresaleContract
};

export {
  networkId,
  fpanContract,
  presaleContract,
};
