const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// MySQL connection
const db = mysql.createConnection({
  host: 'rm-t4n55s7c50nax1164uo.mysql.singapore.rds.aliyuncs.com',
  user: 'foodexpress',
  password: 'FoodExpress2024',    
  database: 'cake_vending_machine_database' // Updated database name
});

db.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database.');
});

app.use(express.json());

/**
 * Fetch all data from the cake_vending_machine table.
 */
app.get('/fetch-data', (req, res) => {
    const query = `SELECT * FROM cake_vending_machine`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

/**
 * Update a specific TypeValue by ID.
 */
app.post('/update-data', (req, res) => {
    const { id, value } = req.body;

    if (!id || !value) {
        return res.status(400).send('ID and value are required.');
    }

    const query = `UPDATE cake_vending_machine SET TypeValue = ? WHERE ID = ?`;
    db.query(query, [value, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Data updated successfully');
    });
});

/**
 * Fetch machine operation variable (Z mm - ID 69).
 */
app.get('/fetch-operation-variable', (req, res) => {
    const query = `SELECT TypeValue FROM cake_vending_machine WHERE ID = 69`;
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
});

/**
 * Update machine operation variable (Z mm - ID 69).
 */
app.post('/update-operation-variable', (req, res) => {
    const { value } = req.body;

    if (!value) {
        return res.status(400).send('Value is required.');
    }

    const query = `UPDATE cake_vending_machine SET TypeValue = ? WHERE ID = 69`;
    db.query(query, [value], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Operation variable updated successfully');
    });
});

/**
 * Fetch OPS value (ID 73).
 */
app.get('/fetch-ops-value', (req, res) => {
    const query = `SELECT TypeValue FROM cake_vending_machine WHERE ID = 73`;
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
});

/**
 * Fetch expiry dates (IDs 13-16).
 */
app.get('/fetch-expiry-dates', (req, res) => {
    const query = `SELECT * FROM cake_vending_machine WHERE ID BETWEEN 13 AND 16`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

/**
 * Fetch product names (IDs 77-80).
 */
app.get('/fetch-products', (req, res) => {
    const query = `SELECT * FROM cake_vending_machine WHERE ID BETWEEN 77 AND 80`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
