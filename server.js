import "dotenv/config";
import app from "./src/app.js";
import { runMigrations } from "./src/database/migrations.js";

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";

// Inicia o servidor
app.listen(PORT, async () => {
  // Executa as migrations pendentes
  await runMigrations();
  
  // Log de inicialização
  console.log(`
🚀 Servidor iniciado!
📍 URL: http://localhost:${PORT}
🌍 Ambiente: ${ENV}
⏰ ${new Date().toLocaleString()}
  `);
});
