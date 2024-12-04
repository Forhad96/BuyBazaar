import { Server } from "http";
import app from "./app";
import { config } from "./app/config";
import { seedSuperAdmin } from "./app/db";

const { port } = config;

const main = async () => {
  try {
    await seedSuperAdmin();
    const server: Server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

main();

