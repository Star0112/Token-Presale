import BigNumber from 'bignumber.js';
import { titanETHPairContract, wethContract } from './contracts';
import { callMethod, bnToDec } from './utils';
import { getTitanPrice, getETHPrice } from '../subgraphs/api';

// Getters
export const getLPBalance = async (address) => {
  try {
    const result = await callMethod(titanETHPairContract.contract.methods['balanceOf'], [address]);
    return new BigNumber(result);
  } catch {
    return new BigNumber(0);
  }
}

export const getLPTotalSupply = async () => {
  try {
    const result = await callMethod(titanETHPairContract.contract.methods['totalSupply'], []);
    return new BigNumber(result);
  } catch (e) {
    // console.log('error :>> ', e.message);
    return new BigNumber(0);
  }
}

export const getPairBalances = async () => {
  try {
    const result = await callMethod(titanETHPairContract.contract.methods['getReserves'], []);
    const titanBalance = new BigNumber(result._reserve0);
    const ethBalance = new BigNumber(result._reserve1);
    return {'titan': titanBalance, 'eth': ethBalance};

  } catch (e) {
    // console.log('error :>> ', e.message);
    return {'titan': new BigNumber(0), 'eth': new BigNumber(0)};
  }
}

export const getAmountOut = async (pairContractObj, amountIn, isEthOut, decimals = 18) => {
  const result = await callMethod(pairContractObj.contract.methods['getReserves'], []);
  const token0 = await callMethod(pairContractObj.contract.methods['token0'], []);
  
  let tokenBalance = 0;
  let ethBalance = 0;

  if (token0.toLowerCase() === wethContract.address.toLowerCase()) {
    tokenBalance = bnToDec(new BigNumber(result._reserve1), decimals);
    ethBalance = bnToDec(new BigNumber(result._reserve0));
  } else {
    tokenBalance = bnToDec(new BigNumber(result._reserve0), decimals);
    ethBalance = bnToDec(new BigNumber(result._reserve1));
  }
  if (isEthOut) {
    return ethBalance * amountIn / tokenBalance;
  } else {
    return tokenBalance * amountIn / ethBalance;
  }
}

export const getLPTVL = async () => {
  try {
    const result = await callMethod(titanETHPairContract.contract.methods['getReserves'], []);
    const titanBalance = bnToDec(new BigNumber(result._reserve0));
    const ethBalance = bnToDec(new BigNumber(result._reserve1));
    const titanPrice = await getTitanPrice();
    const ethPrice = await getETHPrice();
    return titanBalance * titanPrice + ethBalance * ethPrice;
  } catch {
    return 0;
  }
}
