import axios, { type AxiosRequestConfig } from "axios";
import cron from "node-cron";
import express from "express";
import type { Request, Response } from "express";

const server = express()
  .use(express.json());

if (!process.env["CRON_SECRET"] || !process.env["PORTFOLIO_URL"]) {
  throw new Error("Environment variable for CRON_SECRET must be set! ");
}

const axios_config:AxiosRequestConfig = {
  headers: {
    'Authorization': 'Bearer ' + process.env["CRON_SECRET"]!
  }
}

cron.schedule('0 0 * * 1-6', async () => {
  console.log("Triggering /api/cron/refresh_some...");
  const response = await axios.get(
    `${process.env["PORTFOLIO_URL"]}/api/cron/refresh_some`,
    axios_config
  );
  console.log(`\tResponse received with status ${response.status}`)
  if (response.status === 200) {
    console.log(response.data)
  }
});

cron.schedule('0 0 * * 0', async () => {
  console.log("Triggering /api/cron/refresh_all...");
  const response = await axios.get(
    `${process.env["PORTFOLIO_URL"]}/api/cron/refresh_all`,
    axios_config
  );
  console.log(`\tResponse received with status ${response.status}`)
  if (response.status === 200) {
    console.log(response.data)
  }
});

server.get('/healthcheck', (_req:Request, res:Response) => {res.status(200);});
server.use('{*splat}', (_req:Request, res:Response) => {
  res.sendStatus(404);
});

await axios.get(
  `${process.env["PORTFOLIO_URL"]}/api/cron/refresh_some`,
  axios_config
);

const port: number = 4000;
const hostname: string = '0.0.0.0';

server.listen(port, hostname, async () => {
  console.log("Backend Server active!");
  console.log(`Routes running on http://${hostname}:${port}`);
});