const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  //중간 auth 미들웨어를 주목! 거기에서 token을 확인하고 decode해서 req에 user를 넣고있다. 그리고 config/default.json의 jwtSecret 의 값과 토큰을 가지고 decode를 하는것으로 보임.
  try {
    const user = await User.findById(req.user.id); //password 컬럼은 제외 하겠다는 뜻
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  //body 의 값에서 밸리데이션 체크
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or charactors').exists(),
  ],
  //callback
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //return을 붙여주지 않아도 아래에 더이상 진행되진 않지만 warning이 뜸
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });

      // See if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id, //_id
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
