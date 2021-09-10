var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('chat service');
});

router.post('/', function (req, res, next) {
  res.send('post method');
});

router.put('/', function (req, res, next) {
  res.send('put method');
});

router.delete('/', function(req, res, next) {
  res.send('delete method');
});

module.exports = router;
