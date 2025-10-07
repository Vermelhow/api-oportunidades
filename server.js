const express = require('express');
const app = express();
const db = require('./src/database/db');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Oportunidades rodando!');
});

app.get('/teste-db', (req, res) => {
  db.all('SELECT datetime("now") as agora', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows[0]);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
