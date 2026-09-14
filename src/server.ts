import express from "express";
import type { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuario.routes.js";
import servicioRoutes from "./routes/servicio.schemas.js";
import ResenaRoutes from "./routes/resena.routes.js";

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";
    this.middlewares();
    this.routes();
  }

  listen() {
    this.app.listen(Number(this.port), "0.0.0.0", () => {
      console.log("Aplicacion corriendo por el puerto", this.port);
    });
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors({
      origin: true,
      credentials: true,
    }));

    this.app.use(cookieParser());
  }

  routes() {
    this.app.use("/api/usuarios", usuarioRoutes);
    this.app.use("/api/servicios", servicioRoutes);
    this.app.use("/api/resenas", ResenaRoutes);
  }
}

export default Server;