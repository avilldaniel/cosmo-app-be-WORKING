const express = require("express"); // import express app
const cors = require('cors'); // import cors
const { pool } = require("./config"); // import database access

const app = express(); // create instance of an express app

// middleware
app.use(express.json()); // parses request data into req.body object
app.use(cors());  // makes it so two different domains (backend & frontend) can talk to each other

// get all todos
app.get("/api/v1/todos", async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM todos');
    res.send(rows);
    console.log('Get all todos.');
  } catch (err) {
    console.error(err.message);
  }
});

// get individual todo
app.get("/api/v1/todos/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM todos WHERE id=$1', [req.params.id]
    );
    console.log('Get a todo.');
    res.send(rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// create todo
app.post("/api/v1/todos", async (req, res) => {
  try {
    const { todo } = req.body;
    const results = await pool.query(
      'INSERT INTO todos(todo, created_on, complete) VALUES($1, current_timestamp, false) RETURNING *',
      [todo]
    );
    res.send(results.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// delete todo
app.delete("/api/v1/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id=$1', [id]);
    res.send('A todo was deleted.');
  } catch (err) {
    console.error(err.message);
  }
});

// update todo
app.put("/api/v1/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { todo } = req.body;
    const results = await pool.query('UPDATE todos SET todo=$1 WHERE id=$2 RETURNING *', [todo, id]);
    res.send(results.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Start server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})