import axios, { AxiosResponse } from "axios";

const config: { withCredentials: boolean } = {
  withCredentials: true,
};

export const axiosInstance = axios.create(config);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
);
