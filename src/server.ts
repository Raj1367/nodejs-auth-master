import { configDotenv } from "dotenv";
import { connectToDb } from "./config/connectTotDb.js";
import http from "http";
import app from "./app.js";

configDotenv();

const PORT = process.env.PORT || 8001;

const startServer = async () => {
  await connectToDb();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`its alive on port ${PORT}`);
  });
};

startServer().catch((error: any) => {
  console.log(error.message || error);
});
