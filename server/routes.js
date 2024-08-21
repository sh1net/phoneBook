const express = require('express');
const router = express.Router();
const connection = require('./db');
const ldap = require('ldapjs');
require('dotenv').config();

router.get('/phoneData', (req, res) => {
  connection.query('SELECT * FROM phoneNumbers', (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    console.log(results)
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

  const { smma, password } = req.body;

  if (!smma || !password) {
    return res.status(400).send('Необходимо указать имя пользователя и пароль');
  }

  const adminDN = `${process.env.LDAP_ADMIN},${process.env.BASE_DN}`;

  ldapClient.bind(adminDN, process.env.LDAP_ADMIN_PASSWORD, (err) => {
    console.log('ldap started');
    if (err) {
      console.log('ldap closed on bind admin');
      return res.status(500).json({ error: 'LDAP bind failed', details: err });
    }

    const opts = {
      filter: `(sAMAccountName=${smma})`,
      scope: 'sub',
      attributes: ['dn', 'sAMAccountName', 'cn']
    };

    ldapClient.search(process.env.BASE_DN, opts, function (err, searchResult) {
      if (err) {
        console.log('ldap closed on search');
        ldapClient.unbind();
        return res.status(500).send('Ошибка выполнения поиска');
      }

      let userFound = false;

      searchResult.on('searchEntry', function (entry) {
        userFound = true;
        const dn = entry.objectName ? String(entry.objectName) : '';
        const ouMatch = dn.match(/OU=([^,]+)/);
        const ouValue = ouMatch ? ouMatch[1] : 'N/A';
        const samAccountNameAttribute = entry.attributes.find(attr => attr.type === 'sAMAccountName');
        const samAccountNameValue = samAccountNameAttribute ? samAccountNameAttribute.values[0] : 'N/A';
        const cnAttribute = entry.attributes.find(attr => attr.type === 'cn');
        const cnValue = cnAttribute ? cnAttribute.values[0] : 'N/A';
        const userDN = `CN=${cnValue},OU=${ouValue},${process.env.BASE_DN}`;

        const userLdapClient = ldap.createClient({
          url: process.env.LDAP_URL
        });

        userLdapClient.bind(userDN, password, (err) => {
          if (err) {
            console.log('ldap closed on bind user');
            userLdapClient.unbind();
            return res.status(401).json({ error: 'Некорректные данные' });
          }

          connection.query('SELECT * FROM auth_users WHERE name = ?', [samAccountNameValue], (err, results) => {
            if (err) {
              console.log('ldap closed on on sql request');
              userLdapClient.unbind();
              return res.status(500).send('Ошибка выполнения запроса');
            }

            if (results.length > 0) {
              const user = results[0];
              console.log('ldap closed on no results(user exist)');
              userLdapClient.unbind();
              return res.json(user);
            } else {
              connection.query('INSERT INTO auth_users(name, role, department) VALUES (?, "пользователь", ?)',
                [samAccountNameValue, ouValue],
                (err, insertResults) => {
                  if (err) {
                    console.log('ldap closed on insert sql');
                    userLdapClient.unbind();
                    return res.status(500).send('Ошибка выполнения запроса');
                  }

                  const newUser = {
                    id: insertResults.insertId,
                    name: samAccountNameValue,
                    role: 'пользователь',
                    department: ouValue
                  };
                  console.log('ldap closed on end of request');
                  userLdapClient.unbind();
                  return res.json(newUser);
                }
              );
            }
          });
        });
      });

      searchResult.on('error', function (err) {
        ldapClient.unbind();
        return res.status(500).send('Ошибка выполнения поиска');
      });

      searchResult.on('end', function (result) {
        ldapClient.unbind();
        console.log('ldap closed on end of script')
        if (!userFound) {
          return res.status(401).json({ error: 'Пользователь не найден или неверный пароль' });
        }
      });
    });
  });
});


module.exports = router;