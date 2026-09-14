import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

class MongoDBConnector {
    private client: MongoClient | null = null;
    private db: Db | null = null;

    constructor() {
        this.client = null;
        this.db = null;
    }

    async connect(): Promise<Db> {
        if (!this.client || !this.db) {
            const { DB_URI, DBNAME } = process.env;

            if (!DB_URI || !DBNAME) {
                throw new Error(
                    "No se encontraron DB_URI o DBNAME en el archivo .env"
                );
            }

            this.client = new MongoClient(DB_URI);
            await this.client.connect();
            this.db = this.client.db(DBNAME);

            this.client.on("close", () => {
                console.log("⚠️  Conexión a MongoDB perdida.");
                this.db = null;
            });

            console.log("✅ Conectado a MongoDB");
        }

        return this.db;
    }

    getDb(): Db {
        if (!this.db) {
            throw new Error(
                "No hay conexión activa a MongoDB. Llama a connect() primero."
            );
        }
        return this.db;
    }

    async close() {
        if (this.client) {
            await this.client.close();
            console.log("Conexión a MongoDB cerrada.");
            this.client = null;
            this.db = null;
        }
    }
}

export const mongoConnector = new MongoDBConnector();
export default MongoDBConnector;