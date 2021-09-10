const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models').User;
const { route } = require('.');
const jsonwebtoken = require('jsonwebtoken');
const config = require('../config/configJwt');
const path = require('path');
const fs = require('fs');
const jwtMiddleware = require('../app/middleware/jwt');
const validate = require('../app/middleware/validate')

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
});

const upload = multer({ storage: storage })

/* GET users listing. */
router.get('/', jwtMiddleware, async function(req, res, next) {
  let user = await UserModel.findOne({
    where : { id: req.userId }
  });

  res.status(200).send({
    msg: `Selamat datang ${user.username}`
  });
});

router.post('/register', upload.single('image'), async (req, res, next) => {
    const file = req.file
    const check = validate(['username', 'password'], req.body);

    if (check.length > 0) {
      return res.status(400).json(check);
    }

    if (!file) {
      return res.status(400).json(['file required']);
    }

    let user = {
      username : req.body.username,
      password : bcrypt.hashSync(req.body.password, 8),
      image: file.filename,
    };

    let validation = await UserModel.findOne({
      where : { username: user.username }
    });

    if (validation) {
      fs.unlinkSync(path.join(file.destination, file.filename));
      return res.status(400).json(['Username already exists']);
    }

    let userCreate = await UserModel.create(user);
    return res.status(200).json(['User successfully created']);
}); 

router.post('/authentication', async (req, res, next) => {
    let user = {
      username : req.body.username,
      password : req.body.password
    };

    let userData = await UserModel.findOne({
      where : { username : user.username }
    });

    if (userData) {
      let isValidPassword = bcrypt.compareSync(user.password, userData.password);
      if (!isValidPassword) {
        res.status(401).send({
          auth: false,
          msg: 'ERR',
          error: 'Invalid Password'   
        });
        return false;
      } 

      let token = 'Bearer ' + jsonwebtoken.sign({
        id : userData.id
      }, config.secret, {
        expiresIn: 1000
      });

      res.status(200).send({
        auth: true,
        msg: 'Success',
        id: userData.id,
        token: token
      });
      
      return false;
    }


    res.status(401).send({
      auth: false,
      msg: 'ERR',
      error: 'Invalid Username / Password'   
    });
});


module.exports = router;
