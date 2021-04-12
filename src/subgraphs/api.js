import BigNumber from 'bignumber.js';
// import { gql } from '@apollo/client';
// import client from './apollo';
import { titanETHPairContract, usdcETHPairContract } from '../fpen/contracts';
import { getCirculatingSupply } from '../fpen/token';
import { bnToDec, callMethod } from '../fpen/utils';

// const GET_PAIR_PRICE = gql`
//   query GetExchangeRates {
//     pair(id: "${titanETHPairContract.address}"){
//         token0Price
//         token1Price
//     }
//    }
// `;

const getTitanPrice = async () => {
    const result1 = await callMethod(usdcETHPairContract.contract.methods['getReserves'], []);
    const result2 = await callMethod(titanETHPairContract.contract.methods['getReserves'], []);
    const titanBalance = bnToDec(new BigNumber(result2._reserve0));
    const ethBalanceForTitan = bnToDec(new BigNumber(result2._reserve1));
    const usdcBalance = bnToDec(new BigNumber(result1._reserve0), 6);
    const ethBalanceForUsdc = bnToDec(new BigNumber(result1._reserve1));

    const price = usdcBalance / ethBalanceForUsdc * ethBalanceForTitan / titanBalance;
    return price;
};

const getETHPrice = async () => {
    const result1 = await callMethod(usdcETHPairContract.contract.methods['getReserves'], []);
    const usdcBalance = bnToDec(new BigNumber(result1._reserve0), 6);
    const ethBalance = bnToDec(new BigNumber(result1._reserve1));
    const price = usdcBalance / ethBalance;

    return price;
};

const getMarketcap = async () => {
    const titanPrice = await getTitanPrice();
    const curculatingSupply = bnToDec(await getCirculatingSupply());
    return (titanPrice * curculatingSupply);
};

export {
    getTitanPrice,
    getETHPrice,
    getMarketcap
}