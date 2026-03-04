var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../data2');
let { genID } = require('../utils/idHandler');

router.get('/', function (req, res) {
  res.send(dataRole);
});

router.get('/:id', function (req, res) {
  let id = req.params.id;
  let result = dataRole.find(e => e.id == id);
  
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

router.get('/:id/users', function (req, res) {
  let id = req.params.id;
  let role = dataRole.find(e => e.id == id);
  
  if (role) {
    let users = dataUser.filter(e => e.role.id == id);
    res.send(users);
  } else {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

router.post('/', function (req, res) {
  let newRole = {
    id: genID(dataRole),
    name: req.body.name,
    description: req.body.description,
    creationAt: new Date(Date.now()).toISOString(),
    updatedAt: new Date(Date.now()).toISOString()
  }
  dataRole.push(newRole);
  res.send(newRole);
});

router.put('/:id', function (req, res) {
  let id = req.params.id;
  let result = dataRole.find(e => e.id == id);
  
  if (result) {
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (key !== 'id' && key !== 'creationAt') {
        result[key] = req.body[key];
      }
    }
    result.updatedAt = new Date(Date.now()).toISOString();
    res.send(result);
  } else {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

router.delete('/:id', function (req, res) {
  let id = req.params.id;
  let index = dataRole.findIndex(e => e.id == id);
  
  if (index !== -1) {
    let deleted = dataRole.splice(index, 1)[0];
    res.send(deleted);
  } else {
    res.status(404).send({ message: "ID NOT FOUND" });
  }
});

module.exports = router;
