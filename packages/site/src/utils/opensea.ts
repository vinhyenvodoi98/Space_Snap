import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: 'https://api.opensea.io/v2',
  headers: {
    'X-API-KEY': process.env.GATSBY_OPENSEA_API_KEY,
    accept: 'application/json',
  },
});

const apiOpenseaCall = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await instance(config);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export default apiOpenseaCall;
