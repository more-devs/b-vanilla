import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const getConnection = async () => {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
};

// GET personas
app.get('/personas', async (req, res) => {
    try {
        const db = await getConnection();
        const [rows] = await db.execute('SELECT * FROM personas');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST persona
app.post('/personas', async (req, res) => {
    const { nombre, edad } = req.body;
    try {
        const db = await getConnection();
        const [result] = await db.execute('INSERT INTO personas (nombre, edad) VALUES (?, ?)', [nombre, edad]);
        res.status(201).json({ id: result.insertId, nombre, edad });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT persona
app.put('/personas/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, edad } = req.body;
    try {
        const db = await getConnection();
        await db.execute('UPDATE personas SET nombre = ?, edad = ? WHERE id = ?', [nombre, edad, id]);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE persona
app.delete('/personas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await getConnection();
        await db.execute('DELETE FROM personas WHERE id = ?', [id]);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
