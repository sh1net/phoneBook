const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const routes = require('./routes');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ArtemIvan',
  password: '12345',
  database: 'phonebook'
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
});

app.use(express.json());
app.use(cors());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = connection; 