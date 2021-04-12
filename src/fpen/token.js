import BigNumber from 'bignumber.js';
import { fpenContract, presaleContract } from './contracts';
import { callMethod, bnDivdedByDecimals } from './utils';
import { getTotalStakedAmount } from './vault';

// Getters
export const checkAllowance = async (owner, spender) => {
  const result = await callMethod(fpenContract.contract.methods['allowance'], [owner, spender]);
  return bnDivdedByDecimals(new BigNumber(result));
}

export const getBalance = async (address) => {
  const result = await callMethod(fpenContract.contract.methods['balanceOf'], [address]);
  return new BigNumber(result);
}

export const getTransferFee = async () => {
  const result = await callMethod(fpenContract.contract.methods['transferFee'], []);
  return result;
}

export const getVaultAddress = async () => {
  const result = await callMethod(fpenContract.contract.methods['titanVault'], []);
  return result;
}

export const getPaused = async () => {
  const result = await callMethod(fpenContract.contract.methods['Paused'], []);
  return result;
}

export const getTokenGovernance = async () => {
  const result = await callMethod(fpenContract.contract.methods['governance'], []);
  return result;
}

export const getTotalSupply  = async () => {
  return  new BigNumber(await callMethod(fpenContract.contract.methods['totalSupply'], []));
}

export const getCirculatingSupply  = async () => {
  const result = new BigNumber(await callMethod(fpenContract.contract.methods['totalSupply'], []));
  const totalStakedAmount =  await getTotalStakedAmount();
  const titanAmountInVault = new BigNumber(await callMethod(fpenContract.contract.methods['balanceOf'], [presaleContract.address]));


  return result.minus(titanAmountInVault).minus(titanAmountInVault);
}

export const Approve  = async (spender, amount) => {
  const result = await callMethod(fpenContract.contract.methods['approve'], [spender, amount]);
  return result;
}


