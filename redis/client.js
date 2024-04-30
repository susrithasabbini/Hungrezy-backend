import { Redis } from "@upstash/redis";
import { REDIS_TOKEN, REDIS_URL } from "../config/index.js";

const client = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
});

export default client;
