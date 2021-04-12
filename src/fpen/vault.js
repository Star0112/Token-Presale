import BigNumber from 'bignumber.js';
import { vaultContract } from './contracts';
import { callMethod, bnDivdedByDecimals, secondToDate, bnToDec } from './utils';
import { getLPBalance, getLPTotalSupply, getLPTVL } from './univ2pair';
import { getTitanPrice } from '../subgraphs/api';

import { web3 } from './web3';

// Getters
export const getRewardPeriod = async () => {
    const result = await callMethod(vaultContract.contract.methods['_rewardPeriod'], []);
    return new BigNumber(result);
}

export const getContractStartTime = async () => {
    const result = await callMethod(vaultContract.contract.methods['_contractStartTime'], []);
    return new BigNumber(result);
}

export const getSwapReward = async (address) => {
    const result = await callMethod(vaultContract.contract.methods['getSwapReward'], [address]);
    return { pending: new BigNumber(result.pending), available: new BigNumber(result.available) };
}

export const getTitanReward = async (address) => {
    const result = await callMethod(vaultContract.contract.methods['getTitanReward'], [address]);
    return { pending: new BigNumber(result.pending), available: new BigNumber(result.available) };
}

export const getTotalStakedAmount = async () => {
    try {
        const result = await callMethod(vaultContract.contract.methods['getTotalStakedAmount'], []);
        return new BigNumber(result);
    } catch {
        return new BigNumber(0);
    }
}

export const getMinimumDepositAmount = async () => {
    const result = await callMethod(vaultContract.contract.methods['_minDepositETHAmount'], []);
    return new BigNumber(result);
}

export const getUserTotalStakedAmount = async (address) => {
    const result = await callMethod(vaultContract.contract.methods['_stakers'], [address]);
    return bnDivdedByDecimals(new BigNumber(result.stakedAmount));
}

export const getStakedUserInfo = async (address) => {
    const result = await callMethod(vaultContract.contract.methods['_stakers'], [address]);
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
    const result = await callMethod(vaultContract.contract.methods['_stakers'], [address]);
    const blockCountFor2weeks = new BigNumber(await callMethod(vaultContract.contract.methods['_claimPeriodForTitanReward'], []));
    const currentBlockNumber = new BigNumber(await web3.eth.getBlockNumber());
    const restTime = new BigNumber(13.3).times(blockCountFor2weeks.minus(currentBlockNumber.minus(result.lastClimedBlockForTitanReward)));
    return secondToDate(restTime.toNumber());
}

export const getRestTimeForSwapRewards = async (address) => {
    const result = await callMethod(vaultContract.contract.methods['_stakers'], [address]);
    const blockCountFor3months = new BigNumber(await callMethod(vaultContract.contract.methods['_claimPeriodForSwapReward'], []));
    const currentBlockNumber = new BigNumber(await web3.eth.getBlockNumber());
    const restTime = new BigNumber(13.3).times(blockCountFor3months.minus(currentBlockNumber.minus(result.lastClimedBlockForSwapReward)));
    return secondToDate(restTime.toNumber());
}

export const getIsEnalbledLock = async () => {
    const result = await callMethod(vaultContract.contract.methods['_enabledLock'], []);
    return result;
}

export const getBurnFee = async () => {
    const result = await callMethod(vaultContract.contract.methods['_burnFee'], []);
    return new BigNumber(result).times(new BigNumber(100)).div(new BigNumber(10000)).toString(10);
}

export const getEarlyUnstakeFee = async () => {
    const result = await callMethod(vaultContract.contract.methods['_earlyUnstakeFee'], []);
    return new BigNumber(result).times(new BigNumber(100)).div(new BigNumber(10000)).toString(10);
}

export const getLockPeriod = async () => {
    const result = await callMethod(vaultContract.contract.methods['_lockPeriod'], []);
    return new BigNumber(result);
}

export const getVaultGovernance = async () => {
    const result = await callMethod(vaultContract.contract.methods['governance'], []);
    return result;
}

export const getAllocPointForWETH = async () => {
    const result = await callMethod(vaultContract.contract.methods['_allocPointForWETH'], []);
    return new BigNumber(result).div(new BigNumber(10000));
}

export const getAllocPointForWBTC = async () => {
    const result = await callMethod(vaultContract.contract.methods['_allocPointForWBTC'], []);
    return new BigNumber(result).div(new BigNumber(10000));
}

export const getAllocPointForYFI = async () => {
    const result = await callMethod(vaultContract.contract.methods['_allocPointForYFI'], []);
    return new BigNumber(result).div(new BigNumber(10000));
}

export const getTVL = async () => {
    try {
        const stakedLpAmount = await getLPBalance(vaultContract.address);
        const LPTotalSupply = await getLPTotalSupply();

        if (LPTotalSupply.eq(new BigNumber(0))) {
            return new BigNumber(0);
        }
        const LPTVL = await getLPTVL();
        return new BigNumber(LPTVL * bnToDec(stakedLpAmount) / bnToDec(LPTotalSupply));
    } catch {
        return new BigNumber(0);
    }
}

export const getWinners = async () => {
    return await callMethod(vaultContract.contract.methods['getWinners'], []);
    // return 1;
}

export const getCollectedLotteryAmount = async () => {
    const result = await callMethod(vaultContract.contract.methods['_collectedAmountForLottery'], []);
    return new BigNumber(result / 100);
}

export const getWinnersInfo = async () => {
    const winners = await callMethod(vaultContract.contract.methods['getWinners'], []);
    let winnersInfo = [];
    for (let i = 0; i < winners; i++) {
        const winner = await callMethod(vaultContract.contract.methods['winnerInfo'], [i]);
        if (winner !== '' && winner != null) {
            const dateObject = new Date(winner.timestamp * 1000);
            winnersInfo.push({
                address: winner.winner,
                amount: new BigNumber(winner.amount),
                timestamp: dateObject.toLocaleString()
            });
        }
    }
    // const winner = { winner: "0x4317e306EcdA3ff580F6B077c4864c5245D67037", amount : '540000000000000000', timestamp: '1613180040'};
    // const dateObject = new Date(winner.timestamp * 1000);
    // winnersInfo.push({
    //     address: winner.winner,
    //     amount: new BigNumber(winner.amount),
    //     timestamp: dateObject.toLocaleString()
    // });
    return winnersInfo;
}

export const getLotteryFee = async () => {
    const fee = new BigNumber(await callMethod(vaultContract.contract.methods['_lotteryFee'], []));
    return new BigNumber(fee).times(new BigNumber(100)).div(new BigNumber(10000)).toString(10);
}

export const getLotteryLimit = async () => {
    const limit = new BigNumber(await callMethod(vaultContract.contract.methods['_lotteryLimit'], []));
    return new BigNumber(limit).div(new BigNumber(10).pow(6)).toString(10);
}

export const getLotteryTotalPaidOut = async () => {
    // return new BigNumber(await callMethod(vaultContract.contract.methods['_lotteryPaidOut'], []));
    return new BigNumber(540000000000000000);
}

export const getAPY = async () => {
    const stakedLpAmount = await getLPBalance(vaultContract.address);
    const LPTotalSupply = await getLPTotalSupply();
    const LPTVL = await getLPTVL();
    const titanPrice = await getTitanPrice();

    if (LPTotalSupply.eq(new BigNumber(0))) {
        return 0;
    }
    const poolTvl = new BigNumber(LPTVL * (stakedLpAmount.div(LPTotalSupply).toNumber()));

    if (poolTvl.eq(new BigNumber(0))) {
        return 0;
    }

    const titanPerBlock = new BigNumber(await callMethod(vaultContract.contract.methods['getTitanPerBlockForTitanReward'],[]));
    const blockCountForYear = new BigNumber(2372500);
    
    return (1 + bnToDec(titanPerBlock.times(blockCountForYear).div(poolTvl)) * titanPrice) * 100;
}
