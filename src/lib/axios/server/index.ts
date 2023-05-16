import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const config: { baseURL: any; withCredentials: boolean } = {
  withCredentials: true,
  baseURL: process.env.SERVICE_URL,
};

export const axiosInstance = axios.create(config);

export const nextHandler = (
  url: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id, ...rest } = req.query;
  axiosInstance({
    url,
    headers: {
      cookie: req.headers.cookie,
    },
    method: req.method,
    params: rest,
    data: req.body,
  })
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((reason) => {
      res.status(reason?.response?.status).json(reason?.response?.data);
    });
};
