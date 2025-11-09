// src/server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { env } from "./config/env.js";

const PORT = process.env.PORT || 5000;

app.listen(env.port, () => {
  console.log(`✅ Server running on port ${env.port}`);
});
