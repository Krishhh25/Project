const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: "postgresql://postgres.xognnrbfruoqsoodkwmf:deadaf2504200@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
});

// SAVE FEEDBACK: Logic to handle 3 tables
app.post('/feedback', async (req, res) => {
    const { name, age, route, feedback } = req.body;
    try {
        // 1. Get or Create User
        let userRes = await pool.query(
            "INSERT INTO users (name, age) VALUES ($1, $2) ON CONFLICT (name, age) DO UPDATE SET name=EXCLUDED.name RETURNING user_id",
            [name, parseInt(age)]
        );
        const userId = userRes.rows[0].user_id;

        // 2. Get or Create Route
        let routeRes = await pool.query(
            "INSERT INTO routes (route_name) VALUES ($1) ON CONFLICT (route_name) DO UPDATE SET route_name=EXCLUDED.route_name RETURNING route_id",
            [String(route)]
        );
        const routeId = routeRes.rows[0].route_id;

        // 3. Insert Feedback
        await pool.query(
            "INSERT INTO feedback (user_id, route_id, comment) VALUES ($1, $2, $3)",
            [userId, routeId, feedback]
        );

        // Send back a flat object so script.js stays happy
        res.status(200).json({ name, age, route, feedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// GET FEEDBACK: Uses JOIN to combine the tables for the UI
app.get('/feedback', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.name, u.age, r.route_name as route, f.comment as feedback 
            FROM feedback f
            JOIN users u ON f.user_id = u.user_id
            JOIN routes r ON f.route_id = r.route_id
            ORDER BY f.feedback_id DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
