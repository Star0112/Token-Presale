import BigNumber from 'bignumber.js';
import { presaleContract } from './contracts';
import { callMethod } from './utils';

import { web3 } from './web3';

// Getters
export const getStartTime = async () => {
    const result = await callMethod(presaleContract.contract.methods['startTime'], []);
    return result;
}

export const getEndTime = async () => {
    const result = await callMethod(presaleContract.contract.methods['endTime'], []);
    return result;
}

export const getPresaleStatus = async () => {
    const result = await callMethod(presaleContract.contract.methods['presaleIsOn'], []);
    return result;
}

export const getPresaleCap = async () => {
    const result = await callMethod(presaleContract.contract.methods['presaleCapInBNB'], []);
    return new BigNumber(result);
}

export const getPrice = async () => {
    const result = await callMethod(presaleContract.contract.methods['salePrice'], []);
    return new BigNumber(result);
}

export const getUnclimedPurchasedToken = async () => {
    const result = await callMethod(presaleContract.contract.methods['unclaimedPurchasedToken'], []);
    return new BigNumber(result);
}

export const getPurchasedToken = async (address) => {
    const result = await callMethod(presaleContract.contract.methods['purchasedToken'], [address]);
    return new BigNumber(result);
}
