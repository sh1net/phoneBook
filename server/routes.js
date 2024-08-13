const express = require('express');
const router = express.Router();
const connection = require('./db');
const ldap = require('ldapjs');
require('dotenv').config();

router.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.json(results);
  });
});

router.get('/search', (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).send('Search query is required');
  }

  const query = `
    SELECT * FROM users 
    WHERE otdel LIKE ? 
    OR podrazdelenie LIKE ? 
    OR vnutr LIKE ? 
    OR gor LIKE ?
  `;

  const queryParams = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.json(results);
  });
});

router.post('/login', (req, res) => {
  const ldapClient = ldap.createClient({
    url: process.env.LDAP_URL
  });

  const { username, password, department } = req.body;

  if (!username || !password || !department) {
      return res.status(400).send('Необходимо указать имя пользователя, пароль и отдел');
  }

  const userDN = `CN=${username},OU=${department},${process.env.BASE_DN}`;

  ldapClient.bind(userDN, password, (err) => {
      if (err) {
          return res.status(401).send('Неверное имя пользователя или пароль');
      }else{
        connection.query('SELECT * FROM users', (err, results) => {
          if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(500).send('Ошибка выполнения запроса');
            return;
          }
          res.json(results);
          ldapClient.unbind();
        });
      }      
  });
});

module.exports = router;