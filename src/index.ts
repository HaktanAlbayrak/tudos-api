import process from "node:process";
import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();
const server = app.listen(env.port, () => {
  console.info(`🚀 http://localhost:${env.port}`);
});
// Graceful shutdown — prevents the port from staying bound across tsx restarts
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    console.info(`\n${signal} received, shutting down...`);
    server.close(() => process.exit(0));
  });
}
