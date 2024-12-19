//redis node 1) cache aside pattern
// run => npm run dev
import express from "express";
import { getProductDetails, getProducts } from "./api/product.js";
import Redis from "ioredis";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Initialize Redis with environment variables
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redis.on("connect", () => {
  console.log("Redis is connected");
});

app.get("/", async (req, res) => {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const key = `${clientIp}:request_count`;

  const requestCount = await redis.incr(key);

  if (requestCount === 1) {
    await redis.expire(key, 60);
  }

  if (requestCount > 10) {
    return res.status(429).send("Too many requests, please try again after 1 min");
  }

  res.send(`Requested ${requestCount} times`);
});

app.get("/products", async (req, res) => {
  let products = await redis.get("products");
  if (products) {
    console.log("Fetched from Redis cache");
    return res.json({ products: JSON.parse(products) });
  }

  products = await getProducts();
  await redis.setex("products", 10, JSON.stringify(products.products));

  res.json({ products });
});

app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const key = `product:${id}`;

  let product = await redis.get(key);

  if (product) {
    return res.json({ product: JSON.parse(product) });
  }

  product = await getProductDetails(id);
  await redis.set(key, JSON.stringify(product.product));

  return res.json({ product });
});

app.listen(3100, () => {
  console.log("Server is running on port 3100");
});
