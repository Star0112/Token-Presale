import { web3 } from './web3';
import BigNumber from 'bignumber.js';

const customizedDate = (timestamp) => {
  return (`${new Date(timestamp).getFullYear()}/${new Date(timestamp).getMonth() + 1}/${new Date(timestamp).getDate()}
  ${new Date(timestamp).getHours() > 9 ? new Date(timestamp).getHours() : `0${new Date(timestamp).getHours()}`}:${new Date(timestamp).getMinutes() > 9 ? new Date(timestamp).getMinutes() : `0${new Date(timestamp).getMinutes()}`}:${new Date(timestamp).getSeconds() > 9 ? new Date(timestamp).getSeconds() : `0${new Date(timestamp).getSeconds()}`}`)
}

const getBNBBalance = async (address) => {
  const bnbBalance = await web3.eth.getBalance(address);
  return bnDivdedByDecimals(new BigNumber(bnbBalance), 18);
}

const callMethod = async (method, args = []) => {
  const result = await method(...args).call();
  return result;
}

const sendTransaction = async (fromAddress, toAddress, encodedABI, successCallBack, errorCallBack, wei = `0x0`) => {
  const web3 = window.web3;
  if (window.ethereum && web3) {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const tx = {
        from: fromAddress,
        to: toAddress,
        gasPrice: web3.utils.toHex(gasPrice), //`0xAB5D04C00`,
        data: encodedABI,
        value: wei
      };

      web3.eth.sendTransaction(tx)
        .on('transactionHash', (hash) => { console.log('hash: ', hash) })
        .on('receipt', (receipt) => {
          successCallBack();
        })
        .on('error', (err) => {
          errorCallBack(err)
        });

    } catch (err) {
      return null;
    }
  } else {
    return null;
  }
}

const mobileSendTransaction = async (fromAddress, toAddress, encodedABI, successCallBack, errorCallBack, wei = `0x0`) => {
  if (web3.connected) {
    try {
      const tx = {
        from: fromAddress,
        to: toAddress,
        data: encodedABI,
        value: wei
      };

      web3.sendTransaction(tx)
        .then((result) => {
          successCallBack();
        })
        .catch((error) => {
          errorCallBack();
        });

    } catch (err) {
      console.log('err :>> ', err);
      return null;
    }
  } else {
    return null;
  }
}

const getNetworkNonce = async (address) => {
  try {
    let nonce = await web3.eth.getTransactionCount(address);
    const pendingTxCount = await new Promise((resolve, reject) => {
      web3.currentProvider.send({
        method: 'txpool_content',
        params: [],
        jsonrpc: '2.0',
        id: new Date().getTime()
      }, (error, response) => {
        if (response && response.error && response.error.code) {
          console.error('signTxData err:', response);
        }
        if (error) {
          reject(error);
        } else
          // Even though the API call didn't error the response can still contain an error message.
          if (response && response.result.pending && response.result.pending[address]) {
            const txnsCount = Object.keys(response.result.pending[address]).length;
            resolve(txnsCount);
          }
        resolve(0);
      });
    });
    // eslint-disable-next-line no-unused-vars
    nonce = new BigNumber(nonce).plus(pendingTxCount).toNumber();
    return nonce;
  } catch (err) {
    return 0;
  }
}

const bnToDec = (bn, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

const bnDivdedByDecimals = (bn, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals))
}

const bnMultipledByDecimals = (bn, decimals = 18) => {
  return bn.multipliedBy(new BigNumber(10).pow(decimals))
}

const decToBn = (dec, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals))
}

const secondToDate = (seconds) => {
  const days = parseInt(new BigNumber(seconds / (3600 * 24)).dp(0, 6).toNumber());

  if (days !== 0) {
    return days === 1 ? "1 day" : days + " days";
  } else {
    const hours = parseInt(new BigNumber(seconds / 3600).dp(0, 0).toNumber());

    if (hours !== 0) {
      return hours === 1 ? "1 hour" : hours + " hours";
    } else {
      const minutes = parseInt(new BigNumber(seconds / 60).dp(0, 0).toNumber());
      if (minutes !== 0) {
        return minutes === 1 ? "1 minute" : minutes + " minutes";
      } else {
        return seconds + " seconds";
      }
    }
  }
}

export {
  customizedDate,
  getBNBBalance,
  callMethod,
  sendTransaction,
  mobileSendTransaction,
  getNetworkNonce,
  bnToDec,
  bnDivdedByDecimals,
  bnMultipledByDecimals,
  decToBn,
  secondToDate
};
