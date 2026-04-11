const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: "postgresql://postgres:deadaf2504200@db.xognnrbfruoqsoodkwmf.supabase.co:5432/postgres",
});

// ROUTE 1: Save new feedback
app.post('/feedback', async (req, res) => {
    const { name, age, route, feedback } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO bus_feedback (name, age, route, feedback) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, age, route, feedback]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// ROUTE 2: Get all feedback to show in table
app.get('/feedback', async (req, res) => {
    try {
        // We use 'id' to be safe
        const result = await pool.query("SELECT * FROM bus_feedback ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
