const express = require("express");
const { Pool } = require("pg");
const expressV = require("express/package.json").version;

const app = express();

const pool = new Pool({
  host: process.env.PGHOST,
  port: 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.DATABASE,
});

app.get("/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Hello from node behind nginx (nana!!!)",
    greeting: process.env.GREETING || "Not set",
    clientIp: req.socket.remoteAddress,
    hostHeader: req.headers["host"],
    xRealIp: req.headers["x-real-ip"] ?? "Not set",
    expressV: expressV
  });
});

app.listen(3000, () => console.log("listening on :3000"));
