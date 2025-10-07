const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./oportunidades.db', (err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err.message);
  } else {
    console.log('Conectado ao banco SQLite!');
  }
});

db.run('PRAGMA foreign_keys = ON');

module.exports = db;