import BigNumber from 'bignumber.js';
import { fpenContract } from './contracts';
import { callMethod } from './utils';

// Getters
export const getBalance = async (address) => {
  const result = await callMethod(fpenContract.contract.methods['balanceOf'], [address]);
  return new BigNumber(result);
}