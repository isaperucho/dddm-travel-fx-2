import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import healthHandler from "./api/health";
import exchangeRatesHandler from "./api/mas/exchange-rates";
import soraHandler from "./api/mas/sora";
import rawRatesHandler from "./api/mas/raw-rates";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get("/api/health", healthHandler);
app.get("/api/mas/exchange-rates", exchangeRatesHandler);
app.get("/api/mas/sora", soraHandler);
app.get("/api/mas/raw-rates", rawRatesHandler);

// Start server with Vite middleware support
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MerlionFX MAS Gateway Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
