const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'rm-t4n55s7c50nax1164uo.mysql.singapore.rds.aliyuncs.com',
  user: 'foodexpress',
  password: 'FoodExpress2024',
  database: 'cake_vending_machine_database'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.use(cors());
app.use(express.json());

/** Fetch all data */
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

/** Update a specific TypeValue by ID */
app.post('/update-data', (req, res) => {
    const { id, value } = req.body;
    if (!id || !value) return res.status(400).send('ID and value are required.');

    const query = `UPDATE cake_vending_machine SET TypeValue = ? WHERE ID = ?`;
    db.query(query, [value, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Data updated successfully');
    });
});

/** Fetch machine operation variable (Z mm - ID 69) */
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

/** Update machine operation variable (Z mm - ID 69) */
app.post('/update-operation-variable', (req, res) => {
    const { value } = req.body;
    if (!value) return res.status(400).send('Value is required.');
    console.log(value);

    const query = `UPDATE cake_vending_machine SET TypeValue = ? WHERE ID = 69`;
    db.query(query, [value], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Operation variable updated successfully');
    });
});

/** Fetch OPS value (ID 73) */
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
/** Fetch OPS value (ID 73) */
app.get('/fetch-test-value', (req, res) => {
  const query = `SELECT TypeValue FROM cake_vending_machine WHERE ID = 85`;
  db.query(query, (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
      }
      res.json(result);
  });
});
// update test value to 0
app.post('/reset-test-value', (req, res) => {
  db.query(`UPDATE cake_vending_machine SET TypeValue = 1 WHERE ID = 85`, (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
      }
      res.send('OPS value reset to 0 successfully');
  });
});
// update ops value to 0
app.post('/reset-ops-value', (req, res) => {
    db.query(`UPDATE cake_vending_machine SET TypeValue = 0 WHERE ID = 73`, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('OPS value reset to 0 successfully');
    });
});
// update ops value to any value
app.post('/update-ops-value', (req, res) => {
    const { value } = req.body;
    if (!value) return res.status(400).send('Value is required.');
    db.query(`UPDATE cake_vending_machine SET TypeValue = ? WHERE ID = 73`, [value], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('OPS value updated successfully');
    });
});

/** Fetch expiry dates (IDs 13-16) */
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

// Fetch NEXT stock data (IDs 5-8)
app.get('/fetch-next-stock', (req, res) => {
    const query = `SELECT * FROM cake_vending_machine WHERE ID BETWEEN 5 AND 8`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

/** Fetch product names (IDs 77-80) */
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

/** Fetch all stock values (PQ1 to PQ4) */
app.get('/fetch-stock', (req, res) => {
    const query = `SELECT * FROM cake_vending_machine WHERE ID BETWEEN 1 AND 4`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

/** Fetch all product prices (PRICE1 to PRICE4) */
app.get('/fetch-prices', (req, res) => {
    const query = `SELECT * FROM cake_vending_machine WHERE ID BETWEEN 9 AND 12`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

/** Fetch machine IPs */
app.get('/fetch-machine-ips', (req, res) => {
    const query = `SELECT * FROM cake_vending_machine WHERE ID BETWEEN 55 AND 57`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

/** Fetch homing settings */
app.get('/fetch-homing-settings', (req, res) => {
    const query = `SELECT * FROM cake_vending_machine WHERE ID BETWEEN 64 AND 66`;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

/** Update a stock quantity */
app.post('/update-stock', (req, res) => {
    const { id, value } = req.body;
    if (!id || !value) return res.status(400).send('ID and value are required.');

    const query = `UPDATE cake_vending_machine SET TypeValue = ? WHERE ID = ?`;
    db.query(query, [value, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Stock updated successfully');
    });
});

/** Update a product price */
app.post('/update-price', (req, res) => {
    const { id, value } = req.body;
    if (!id || !value) return res.status(400).send('ID and value are required.');

    const query = `UPDATE cake_vending_machine SET TypeValue = ? WHERE ID = ?`;
    db.query(query, [value, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Price updated successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
