import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const getBalanceOf = async ( address: string, contract: any ) => {
  try {
    const balance = await contract.methods.balanceOf(address).call();
    return balance;
  } catch (error) {
    return error;
  }
};

export const getTokenOfOwnerByIndex = async ( address: string, contract: any ) => {
  try {
    const tokenId = await contract.methods.tokenOfOwnerByIndex(address, 0).call();
    return tokenId;
  } catch (error) {
    return error;
  }
};

// API CALL
const spaceMetadata = axios.create({
  baseURL: 'https://meta.space.id/',
  headers: {
    'accept': 'application/json',
  },
});

export const apiMetadataCall = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await spaceMetadata(config);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

// Resolve name
const spaceConvert = axios.create({
  baseURL: 'https://api.prd.space.id/v1/',
  headers: {
    'accept': 'application/json',
  },
});

export const apiSpaceConvertCall = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await spaceConvert(config);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};
