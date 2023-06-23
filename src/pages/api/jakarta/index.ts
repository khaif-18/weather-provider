import { NextApiRequest, NextApiResponse } from "next";

import { nextHandler } from "@/lib/axios/server";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  nextHandler(`?q=jakarta&appid=${process.env.API_KEY}&units=metric`, req, res);
}
