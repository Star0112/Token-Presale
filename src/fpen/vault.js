import BigNumber from 'bignumber.js';
import { presaleContract } from './contracts';
import { callMethod, bnDivdedByDecimals, secondToDate, bnToDec } from './utils';

import { web3 } from './web3';

// Getters
export const getRewardPeriod = async () => {
    const result = await callMethod(presaleContract.contract.methods['_rewardPeriod'], []);
    return new BigNumber(result);
}

export const getContractStartTime = async () => {
    const result = await callMethod(presaleContract.contract.methods['_contractStartTime'], []);
    return new BigNumber(result);
}

export const getSwapReward = async (address) => {
    const result = await callMethod(presaleContract.contract.methods['getSwapReward'], [address]);
    return { pending: new BigNumber(result.pending), available: new BigNumber(result.available) };
}

export const getTitanReward = async (address) => {
    const result = await callMethod(presaleContract.contract.methods['getTitanReward'], [address]);
    return { pending: new BigNumber(result.pending), available: new BigNumber(result.available) };
}

export const getTotalStakedAmount = async () => {
    try {
        const result = await callMethod(presaleContract.contract.methods['getTotalStakedAmount'], []);
        return new BigNumber(result);
    } catch {
        return new BigNumber(0);
    }
}

export const getMinimumDepositAmount = async () => {
    const result = await callMethod(presaleContract.contract.methods['_minDepositETHAmount'], []);
    return new BigNumber(result);
}

export const getUserTotalStakedAmount = async (address) => {
    const result = await callMethod(presaleContract.contract.methods['_stakers'], [address]);
    return bnDivdedByDecimals(new BigNumber(result.stakedAmount));
}

export const getStakedUserInfo = async (address) => {
    const result = await callMethod(presaleContract.contract.methods['_stakers'], [address]);
    const lockedTo = result.lockedTo;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const isLocked = currentTimestamp < lockedTo;
    let endOfLock = 0;

    if (isLocked) {
        const dateObject = new Date(lockedTo * 1000);
        endOfLock = dateObject.toLocaleString();
    }

    return { ...result, isLocked: isLocked, endOfLock: endOfLock, stakedAmount: new BigNumber(result.stakedAmount) };
}

export const getRestTimeForTitanRewards = async (address) => {
    const result = await callMethod(presaleContract.contract.methods['_stakers'], [address]);
    const blockCountFor2weeks = new BigNumber(await callMethod(presaleContract.contract.methods['_claimPeriodForTitanReward'], []));
    const currentBlockNumber = new BigNumber(await web3.eth.getBlockNumber());
    const restTime = new BigNumber(13.3).times(blockCountFor2weeks.minus(currentBlockNumber.minus(result.lastClimedBlockForTitanReward)));
    return secondToDate(restTime.toNumber());
}

export const getRestTimeForSwapRewards = async (address) => {
    const result = await callMethod(presaleContract.contract.methods['_stakers'], [address]);
    const blockCountFor3months = new BigNumber(await callMethod(presaleContract.contract.methods['_claimPeriodForSwapReward'], []));
    const currentBlockNumber = new BigNumber(await web3.eth.getBlockNumber());
    const restTime = new BigNumber(13.3).times(blockCountFor3months.minus(currentBlockNumber.minus(result.lastClimedBlockForSwapReward)));
    return secondToDate(restTime.toNumber());
}

export const getIsEnalbledLock = async () => {
    const result = await callMethod(presaleContract.contract.methods['_enabledLock'], []);
    return result;
}

export const getBurnFee = async () => {
    const result = await callMethod(presaleContract.contract.methods['_burnFee'], []);
    return new BigNumber(result).times(new BigNumber(100)).div(new BigNumber(10000)).toString(10);
}

export const getEarlyUnstakeFee = async () => {
    const result = await callMethod(presaleContract.contract.methods['_earlyUnstakeFee'], []);
    return new BigNumber(result).times(new BigNumber(100)).div(new BigNumber(10000)).toString(10);
}
