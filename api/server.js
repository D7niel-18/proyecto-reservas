// api/server.js
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// Credenciales desde variables de entorno (nunca en el código)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Log de cada petición (evidencia de logs)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Nginx quita el prefijo /api/, por eso las rutas no lo llevan
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/reservas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reservas ORDER BY id');
    res.json(rows);
  } catch (e) {
    console.error('Error en GET /reservas:', e.message);
    res.status(500).json({ error: 'Error de base de datos' });
  }
});

app.post('/reservas', async (req, res) => {
  const { nombre, actividad } = req.body;
  if (!nombre || !actividad) {
    return res.status(400).json({ error: 'Faltan nombre o actividad' });
  }
  try {
    const [r] = await pool.query(
      'INSERT INTO reservas (nombre, actividad) VALUES (?, ?)', [nombre, actividad]);
    res.status(201).json({ id: r.insertId, nombre, actividad });
  } catch (e) {
    console.error('Error en POST /reservas:', e.message);
    res.status(500).json({ error: 'Error de base de datos' });
  }
});

app.listen(3000, () => console.log('API escuchando en el puerto 3000'));