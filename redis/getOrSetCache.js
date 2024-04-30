import { REDIS_EXPIRATION_TIME } from "../config/index.js";
import client from "./client.js";

const DEFAULT_EXPIRATION = REDIS_EXPIRATION_TIME;

async function getOrSetCache(key, cb) {
  const data = await client.get(key);
  if (data) {
    console.log("Cache hit");
    return data;
  }
  console.log("Cache miss");
  const freshData = await cb();
  client.set(key, freshData);
  return freshData;
}

export { getOrSetCache };
