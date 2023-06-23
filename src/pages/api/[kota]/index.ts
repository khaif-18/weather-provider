import { NextApiRequest, NextApiResponse } from "next";

import { nextHandler } from "@/lib/axios/server";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  nextHandler(`?q=${req.query.kota}&appid=ea3831dea9eb463fb3a799de2b0166a5&units=metric`, req, res);
  // nextHandler(`?q=${req.query.kota}&appid=${process.env.API_KEY}&units=metric`, req, res);
}
