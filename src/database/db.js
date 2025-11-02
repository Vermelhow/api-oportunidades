import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// usa o arquivo na raiz do projeto
const dbPath = path.resolve(__dirname, "../../oportunidades.db");

// abre/cria o banco
export const db = new Database(dbPath, { verbose: null });
