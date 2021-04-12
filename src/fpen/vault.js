import BigNumber from 'bignumber.js';
import { presaleContract } from './contracts';
import { callMethod } from './utils';

import { web3 } from './web3';

// Getters
export const getStartTime = async () => {
    const result = await callMethod(presaleContract.contract.methods['startTime'], []);
    return new BigNumber(result);
}

export const getEndTime = async () => {
    const result = await callMethod(presaleContract.contract.methods['endTime'], []);
    return new BigNumber(result);
}

export const getPresaleStatus = async () => {
    const result = await callMethod(presaleContract.contract.methods['presaleIsOn'], []);
    return new BigNumber(result);
}

export const getUnclimedPurchasedToken = async () => {
    const result = await callMethod(presaleContract.contract.methods['unclimedPurchasedToken'], []);
    return new BigNumber(result);
}

export const getPurchasedToken = async (address) => {
    const result = await callMethod(presaleContract.contract.methods['purchasedToken'], [address]);
    return { pending: new BigNumber(result.pending), available: new BigNumber(result.available) };
}
