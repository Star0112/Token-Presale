import BigNumber from 'bignumber.js';
import { titanContract, vaultContract } from './contracts';
import { callMethod, bnDivdedByDecimals } from './utils';
import { getPairBalances, getLPTotalSupply } from './univ2pair.js';
import { getTotalStakedAmount } from './vault';

// Getters
export const checkAllowance = async (owner, spender) => {
  const result = await callMethod(titanContract.contract.methods['allowance'], [owner, spender]);
  return bnDivdedByDecimals(new BigNumber(result));
}

export const getBalance = async (address) => {
  const result = await callMethod(titanContract.contract.methods['balanceOf'], [address]);
  return new BigNumber(result);
}

export const getTransferFee = async () => {
  const result = await callMethod(titanContract.contract.methods['transferFee'], []);
  return result;
}

export const getVaultAddress = async () => {
  const result = await callMethod(titanContract.contract.methods['titanVault'], []);
  return result;
}

export const getPaused = async () => {
  const result = await callMethod(titanContract.contract.methods['Paused'], []);
  return result;
}

export const getTokenGovernance = async () => {
  const result = await callMethod(titanContract.contract.methods['governance'], []);
  return result;
}

export const getTotalSupply  = async () => {
  return  new BigNumber(await callMethod(titanContract.contract.methods['totalSupply'], []));
}

export const getCirculatingSupply  = async () => {
  const result = new BigNumber(await callMethod(titanContract.contract.methods['totalSupply'], []));
  const pairTokenBalances = await getPairBalances();
  const LPTotalSupply = await getLPTotalSupply();
  const totalStakedAmount =  await getTotalStakedAmount();
  const titanAmountInVault = new BigNumber(await callMethod(titanContract.contract.methods['balanceOf'], [vaultContract.address]));
  
  if (LPTotalSupply.eq(new BigNumber(0))) {
    return result;
  }

  const lockedTITAN = pairTokenBalances['titan'].times(totalStakedAmount.div(LPTotalSupply));
  return result.minus(lockedTITAN).minus(titanAmountInVault);
}

export const Approve  = async (spender, amount) => {
  const result = await callMethod(titanContract.contract.methods['approve'], [spender, amount]);
  return result;
}


