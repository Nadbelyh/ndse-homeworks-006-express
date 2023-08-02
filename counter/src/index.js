const express = require("express");

const app = express();
const redis = require("redis");

const REDIS_URL = process.env.REDIS_URL || "redis://localhost";

const client = redis.createClient({ url: REDIS_URL });

(async () => {
  await client.connect();
})();

app.get("/counter/:id", async (req, res) => {
  const { id } = req.params;
  const cnt = await client.get(id);
  res.json({ count: cnt });
});

app.post("/counter/:id/incr", async (req, res) => {
  const { id } = req.params;
  const cnt = await client.incr(id);
  res.json({ message: `Для: ${id}, это ${cnt}-й запрос` });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening port ${PORT}`);
});
