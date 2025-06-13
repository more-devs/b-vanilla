import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// GET personas
app.get('/personas', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM personas');
    res.json(rows);
});

// POST nueva persona
app.post('/personas', async (req, res) => {
    const { nombre, edad } = req.body;
    const [result] = await db.execute('INSERT INTO personas (nombre, edad) VALUES (?, ?)', [nombre, edad]);
    res.json({ id: result.insertId, nombre, edad });
});

// PUT actualizar persona
app.put('/personas/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, edad } = req.body;
    await db.execute('UPDATE personas SET nombre = ?, edad = ? WHERE id = ?', [nombre, edad, id]);
    res.sendStatus(204);
});

// DELETE persona
app.delete('/personas/:id', async (req, res) => {
    const { id } = req.params;
    await db.execute('DELETE FROM personas WHERE id = ?', [id]);
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
