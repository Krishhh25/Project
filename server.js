const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    // Use the Transaction Pooler string here
    connectionString: "postgresql://postgres.xognnrbfruoqsoodkwmf:[YOUR-PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres",
    ssl: {
        rejectUnauthorized: false // This allows Render to connect securely
    }
});

// ROUTE 1: Save new feedback
app.post('/feedback', async (req, res) => {
    const { name, age, route, feedback } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO bus_feedback (name, age, route, feedback) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, parseInt(age), String(route), feedback]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("DB ERROR LOG:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ROUTE 2: Get all feedback
app.get('/feedback', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM bus_feedback ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("GET ERROR:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
