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
  
  const { smma, password } = req.body;
  
  if (!smma || !password) {
    return res.status(400).send('Необходимо указать имя пользователя и пароль');
  }
  
  const adminDN = `${process.env.LDAP_ADMIN},${process.env.BASE_DN}`;
  
  ldapClient.bind(adminDN, process.env.LDAP_ADMIN_PASSWORD, (err) => {
    if (err) {
      return res.status(500).json({ error: 'LDAP bind failed', details: err });
    }
    
    console.log('LDAP connected');
    
    const opts = {
      filter: `(sAMAccountName=${smma})`,
      scope: 'sub',
      attributes: ['dn', 'sAMAccountName', 'cn']
    };
    
    ldapClient.search(process.env.BASE_DN, opts, function (err, searchResult) {
      if (err) {
        console.log("Error in search: " + err);
        ldapClient.unbind();
        return res.status(500).send('Ошибка выполнения поиска');
      }
      
      searchResult.on('searchEntry', function (entry) {
        const dn = entry.objectName ? String(entry.objectName) : '';
        
        const ouMatch = dn.match(/OU=([^,]+)/);
        const ouValue = ouMatch ? ouMatch[1] : 'N/A';
        
        const samAccountNameAttribute = entry.attributes.find(attr => attr.type === 'sAMAccountName');
        const samAccountNameValue = samAccountNameAttribute ? samAccountNameAttribute.values[0] : 'N/A';
        
        const cnAttribute = entry.attributes.find(attr => attr.type === 'cn');
        const cnValue = cnAttribute ? cnAttribute.values[0] : 'N/A';
        
        const userDN = `CN=${cnValue},OU=${ouValue},${process.env.BASE_DN}`;
        
        // Создаем новый LDAP-клиент для повторного bind
        const userLdapClient = ldap.createClient({
          url: process.env.LDAP_URL
        });
        
        userLdapClient.bind(userDN, password, (err) => {
          if (err) {
            console.log("Ошибка при повторном bind: " + err);
            userLdapClient.unbind();
            return res.status(401).json({ error: 'Некорректные данные' });
          }
          
          connection.query('SELECT * FROM auth_users WHERE name = ?', [samAccountNameValue], (err, results) => {
            if (err) {
              userLdapClient.unbind();
              return res.status(500).send('Ошибка выполнения запроса');
            }
            
            let user;
            
            if (results.length > 0) {
              user = results[0];
              console.log('Пользователь уже существует:', user);
            } else {
              connection.query('INSERT INTO auth_users(name, role, department) VALUES (?, "пользователь", ?)', 
                [samAccountNameValue, ouValue], 
                (err, insertResults) => {
                  if (err) {
                    userLdapClient.unbind();
                    return res.status(500).send('Ошибка выполнения запроса');
                  }
                  
                  user = {
                    id: insertResults.insertId,
                    name: samAccountNameValue,
                    role: 'пользователь',
                    department: ouValue
                  };
                  
                  console.log('Создан новый пользователь:', user);
                }
              );
            }
            
            userLdapClient.unbind(); // Закрытие нового LDAP-соединения после выполнения всех операций
            return res.json(user);
          });
        });
      });

      searchResult.on('error', function (err) {
        ldapClient.unbind();
        return res.status(500).send('Ошибка выполнения поиска');
      });

      searchResult.on('end', function (result) {
        ldapClient.unbind();
        console.log('LDAP disconnected');
      });
    });
  });
  
  ldapClient.on('close', function() {
    console.log('LDAP connection closed');
  });
});

module.exports = router;