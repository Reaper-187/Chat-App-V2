if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { app } from "./app";
import { connectToDB } from "./config/db";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function startServer() {
  try {
    await connectToDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
    process.exit(1);
  }
}

startServer();
