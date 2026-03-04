var express = require('express');
var router = express.Router();
let { dataUser, dataRole } = require('../data2');

router.get('/', function (req, res) {
  res.send(dataUser);
});

router.get('/:username', function (req, res) {
  let username = req.params.username;
  let result = dataUser.find(e => e.username === username);
  
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({ message: "USERNAME NOT FOUND" });
  }
});

router.post('/', function (req, res) {
  let existUser = dataUser.find(e => e.username === req.body.username);
  
  if (existUser) {
    res.status(400).send({ message: "USERNAME ALREADY EXISTS" });
    return;
  }

  let role = dataRole.find(e => e.id == req.body.roleId);
  
  if (!role) {
    res.status(400).send({ message: "ROLE NOT FOUND" });
    return;
  }

  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    status: req.body.status !== undefined ? req.body.status : true,
    loginCount: 0,
    role: {
      id: role.id,
      name: role.name,
      description: role.description
    },
    creationAt: new Date(Date.now()).toISOString(),
    updatedAt: new Date(Date.now()).toISOString()
  }
  
  dataUser.push(newUser);
  res.send(newUser);
});

router.put('/:username', function (req, res) {
  let username = req.params.username;
  let result = dataUser.find(e => e.username === username);
  
  if (result) {
    if (req.body.roleId) {
      let role = dataRole.find(e => e.id == req.body.roleId);
      if (!role) {
        res.status(400).send({ message: "ROLE NOT FOUND" });
        return;
      }
      result.role = {
        id: role.id,
        name: role.name,
        description: role.description
      };
    }

    let updateKeys = Object.keys(req.body);
    for (const key of updateKeys) {
      if (key !== 'username' && key !== 'creationAt' && key !== 'roleId' && key !== 'role') {
        result[key] = req.body[key];
      }
    }
    
    result.updatedAt = new Date(Date.now()).toISOString();
    res.send(result);
  } else {
    res.status(404).send({ message: "USERNAME NOT FOUND" });
  }
});

router.delete('/:username', function (req, res) {
  let username = req.params.username;
  let index = dataUser.findIndex(e => e.username === username);
  
  if (index !== -1) {
    let deleted = dataUser.splice(index, 1)[0];
    res.send(deleted);
  } else {
    res.status(404).send({ message: "USERNAME NOT FOUND" });
  }
});

module.exports = router;
