import {
  SET_ADDRESS,
  SET_NETWORKID,
  SET_ERROR,
} from '../actions';

export const setAddress = (address) => ({
  type: SET_ADDRESS,
  payload: { address }
});

export const setNetworkId = (networkId) => ({
  type: SET_NETWORKID,
  payload: { networkId }
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: { error }
});
