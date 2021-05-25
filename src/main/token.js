import BigNumber from 'bignumber.js';
import { tokenContract } from './contracts';
import { callMethod } from './utils';

// Getters
export const getBalance = async (address) => {
  const result = await callMethod(tokenContract.contract.methods['balanceOf'], [address]);
  return new BigNumber(result);
}