import { createClient, RedisClientType } from "redis";
import { redis } from "../../config/redis";

// initlizing a empty variable
let client: null | RedisClientType<any, any, any, any, any>;
// THIS FUNCTION IS ONLY USED ONCE TO INITIALIZE
const initRedis = async () => {
  // Check if the Redis URL is set in the ENVs
  if (!redis.url) {
    throw new Error("There isn't a Redis URL");
  }
  // starts the connection process to redis
  const redisClient = createClient({
    url: redis.url,
  });
  // subscribes to events within redis
  redisClient.on("error", (err) => console.log("Redis Error: ", err));
  redisClient.on("connect", () => console.log("Redis Connected"));
  // make the connection to the client
  await redisClient.connect();
  // set the global variable client to the new connection
  client = redisClient;
  // returns the client
  return client;
};

// always returns a existing redis client (DOES NOT MAKE A CONNECTION)
const getRedisClient = async (): Promise<
  RedisClientType<any, any, any, any, any>
> => {
  // check if there isn't a client first, if there isn't a client it throws an error
  if (!client) {
    throw new Error("Redis not initialized.");
  }
  // returns the client
  return client;
};

export { initRedis, getRedisClient };
