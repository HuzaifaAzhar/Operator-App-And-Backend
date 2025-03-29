// server.js
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
  database: 'foodexpress' // The database name
});

db.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database.');
  });

  app.use(express.json());

  //1.
  app.get('/fetch-data', (req, res) => {
    const { vending } = req.query;
    const query = `SELECT * FROM ${vending} WHERE ID BETWEEN 2 AND 13`;
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  app.post('/update-data', (req, res) => {
    const { id, value, vending } = req.body;
  
    if (parseInt(value) > 8) {
      return res.status(400).send('Value cannot be greater than 8.');
    }
  
    const query = `UPDATE ${vending} SET TypeValue = ? WHERE ID = ?`;
    db.query(query, [value, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.send('Data updated successfully');
    });
  });
  

//2.Backend API to fetch and update machine operation variable
// Fetch operation variable for vending-02
app.get('/fetch-operation-variable', (req, res) => {
  const { vending } = req.query;
  const query = `SELECT * FROM ${vending} WHERE ID = 69`; // Properly escaping the table name
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
// Update operation variable for vending-02
app.post('/update-operation-variable', (req, res) => {
  const { value, vending } = req.body;

  const query = `UPDATE ${vending} SET TypeValue = ? WHERE ID = 69`; // Properly escaping the table name
  db.query(query, [value], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.send('Operation variable updated successfully');
  });
});


    

  //3.Backend API to fetch OPS value
  app.get('/fetch-ops-value', (req, res) => {
    const { vending } = req.query;
    const query = `SELECT TypeValue FROM ${vending} WHERE ID = 66`; // Properly escaping the table name
    db.query(query, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
  //4.
  //5.
  
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });