import dotenv from "dotenv";
import Server from "./server.js";
import { mongoConnector } from "./db/connection.js"; 

dotenv.config();

async function main() {
  await mongoConnector.connect();

  const server = new Server();
  server.listen();
}

main();

export default mongoConnector;