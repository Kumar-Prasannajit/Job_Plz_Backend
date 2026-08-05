import { redis } from "../config/redis.js";

async function main() {
  const pong = await redis.ping();

  console.log("Redis Response:", pong);

  await redis.quit();
}

main().catch(console.error);