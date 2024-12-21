//redis node 1) cache aside pattern
// run => npm run dev
import express from "express";
import { getProductDetails, getProducts } from "./api/product.js";
import Redis from "ioredis";
import dotenv from "dotenv";
import { getCashedData, ratelimiter } from './middleware/redis.js';

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

app.get("/", ratelimiter({limit:5,timer:50, key:"Home"}), async (req, res) => {
  res.send(`home route`);
});

app.get("/products", getCashedData("products"), async (req, res) => {
  const productsData = await getProducts();
  console.log(productsData)
  // await redis.setex("products", 60, JSON.stringify(products.products));
  await redis.set("products", JSON.stringify(productsData));

  res.json({ productsData });
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
