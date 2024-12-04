import { Server } from "http";
import app from "./app";
import { config } from "./app/config";
import { seedSuperAdmin } from "./app/db";

const port = config.port;

async function main() {
  await seedSuperAdmin()
  const server: Server = app.listen(port, () => {
    console.log("Sever is running on port ", port);
    
  });
}

main();
