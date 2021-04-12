import BigNumber from 'bignumber.js';
import { fpanContract } from './contracts';
import { callMethod } from './utils';

// Getters
export const getBalance = async (address) => {
  const result = await callMethod(fpanContract.contract.methods['balanceOf'], [address]);
  return new BigNumber(result);
}