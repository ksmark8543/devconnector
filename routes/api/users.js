const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
// @route   GET api/users
// @desc    Test route
// @access  Public
router.post(
  '/',
  //body 의 값에서 밸리데이션 체크
  [
    check('name', 'Name is required').not().isEmpty(), //name 이 비어있지 않을 경우 에러 발생
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or charactors').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //return을 붙여주지 않아도 아래에 더이상 진행되진 않지만 warning이 뜸
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });

      // See if user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id, //_id
          address: user.email,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'), // config/default.json의 jwtSecret
        {
          expiresIn: 360000,
        },
        //callback
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
