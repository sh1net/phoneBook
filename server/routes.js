const express = require('express');
const router = express.Router();
const connection = require('./db');
const ldap = require('ldapjs');
require('dotenv').config();

router.get('/validateUser/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('SELECT * FROM auth_users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Пользователь не найден');
    } else {
      res.json(results[0]);
    }
  });
});

router.get('/managerDepartment/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('SELECT * FROM auth_users WHERE id = ?', [userId], (err, userResults) => {
    if (err) {
      console.error('Ошибка выполнения запроса к auth_users:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    if (userResults.length === 0) {
      res.status(404).send('Пользователь не найден');
      return;
    }

    const user = userResults[0];

    if (user.role !== 'manager') {
      res.status(403).send('Доступ запрещен');
      return;
    }

    const structPodrazdel = user.department;
    connection.query('SELECT * FROM phoneNumbers WHERE struct_podrazdel = ?', [structPodrazdel], (err, phoneResults) => {
      if (err) {
        console.error('Ошибка выполнения запроса к phoneNumbers:', err);
        res.status(500).send('Ошибка выполнения запроса');
        return;
      }

      res.json({
        user: user,
        phoneNumbers: phoneResults
      });
    });
  });
});

router.get('/phoneData', (req, res) => {
  connection.query('SELECT * FROM phoneNumbers', (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.json(results);
  });
});

router.get('/users', (req, res) => {
  connection.query('SELECT * FROM auth_users', (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.json(results);
  });
});

router.post('/addUser', (req, res) => {
  const { name, role, department } = req.body;

  const query = 'INSERT INTO auth_users (name, role, department) VALUES (?, ?, ?)';
  connection.query(query, [name, role, department], (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.status(201).send('Пользователь добавлен');
  });
});

router.post('/addDepartment', (req, res) => {
  const {
    podrazdel1, 
    podrazdel2, 
    podrazdel3, 
    podrazdel4, 
    doljnost, 
    fio, 
    home_phone, 
    phone, 
    mobile_phone
  } = req.body;

  const query = 'INSERT INTO phoneNumbers (podrazdel, struct_podrazdel, vnutr_podrazdel, vnutr_podrazdel_podrazdel, doljnost, fio, home_phone, phone, mobile_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  connection.query(query, [
    podrazdel1, 
    podrazdel2, 
    podrazdel3, 
    podrazdel4, 
    doljnost, 
    fio, 
    home_phone, 
    phone, 
    mobile_phone
  ], (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.status(201).send('Запись успешно добавлена');
  });
});

router.put('/editUser/:id', (req, res) => {
  const userId = req.params.id;
  const { name, role, department } = req.body;

  const query = 'UPDATE auth_users SET name = ?, role = ?, department = ? WHERE id = ?';
  connection.query(query, [name, role, department, userId], (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.send('Пользователь обновлен');
  });
});

router.put('/editDepartment/:id', (req, res) => {
  const dataId = req.params.id;
  const { podrazdel, struct_podrazdel, vnutr_podrazdel, vnutr_podrazdel_podrazdel, phone, home_phone, mobile_phone, fio, doljnost } = req.body;

  const query = 'UPDATE phonenumbers SET podrazdel = ?, struct_podrazdel = ?, vnutr_podrazdel = ?, vnutr_podrazdel_podrazdel = ?, phone = ?, home_phone = ?, mobile_phone = ?, fio = ?, doljnost = ? WHERE id = ?';
  connection.query(query, [podrazdel, struct_podrazdel, vnutr_podrazdel, vnutr_podrazdel_podrazdel, phone, home_phone, mobile_phone, fio, doljnost, dataId], (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.send('Данные обновлены');
  });
})

router.put('/editDepartmentName', (req, res) => {
  const { columnName, newValue, oldValue } = req.body;

  if (!columnName || newValue === undefined) {
    res.status(400).send('Необходимо указать имя столбца и новое значение');
    return;
  }

  const allowedColumns = ['podrazdel', 'struct_podrazdel', 'vnutr_podrazdel', 'vnutr_podrazdel_podrazdel', 'phone', 'home_phone', 'mobile_phone', 'fio', 'doljnost'];
  
  if (!allowedColumns.includes(columnName)) {
    res.status(400).send('Недопустимое имя столбца');
    return;
  }

  const query = `UPDATE phonenumbers SET ${columnName} = ? WHERE ${columnName} = ?`;

  connection.query(query, [newValue, oldValue], (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.send('Данные успешно обновлены');
  });
});


router.delete('/deleteUser/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM auth_users WHERE id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.send('Пользователь удален');
  });
});

router.delete('/deleteDepartment/:id', (req, res) => {
  const departmentId = req.params.id;

  const query = 'DELETE FROM phonenumbers WHERE id = ?';
  connection.query(query, [departmentId], (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err);
      res.status(500).send('Ошибка выполнения запроса');
      return;
    }
    res.send('Запись удалена');
  });
});

router.get('/search', (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).send('Search query is required');
  }

  const query = `
    SELECT * FROM phonenumbers 
    WHERE podrazdel LIKE ? 
    OR struct_podrazdel LIKE ? 
    OR phone LIKE ?
    OR home_phone LIKE ?
    OR mobile_phone LIKE ?
    OR fio LIKE ?
  `;

  const queryParams = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];

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
            userLdapClient.unbind();
            return res.status(401).json({ error: 'Некорректные данные' });
          }
          connection.query('SELECT * FROM auth_users WHERE name = ?', [samAccountNameValue], (err, results) => {
            if (err) {
              userLdapClient.unbind();
              return res.status(500).send('Ошибка выполнения запроса');
            }
            if (results.length > 0) {
              const user = results[0];
              userLdapClient.unbind();
              return res.json(user);
            } else {
              connection.query('INSERT INTO auth_users(name, role, department) VALUES (?, "user", ?)',
                [samAccountNameValue, null],
                (err, insertResults) => {
                  if (err) {
                    userLdapClient.unbind();
                    return res.status(500).send('Ошибка выполнения запроса');
                  }
                  const newUser = {
                    id: insertResults.insertId,
                    name: samAccountNameValue,
                    role: 'user',
                    department: null
                  };
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
        if (!userFound) {
          return res.status(401).json({ error: 'Пользователь не найден или неверный пароль' });
        }
      });
    });
  });
});


module.exports = router;