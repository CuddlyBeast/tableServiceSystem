const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const validator = require('validator');

const signUp = async (req, res) => {
  try {
    const { name, mobile, address, email, password, payment_method } = req.body;

    const validationOptions = {
      minLength: 8,
      minLowerCase: 1,
      minUpperCase: 1,
      minNumber: 1,
      minSymbols:0,
      returnScore: false,
    };

    if (!validator.isStrongPassword(password, validationOptions)) {
      return res.status(400).json({ error: 'Weak password. Must be at least 8 characters long including lowercase, uppercase, and numeric values.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      mobile,
      address,
      email,
      password: hashedPassword,
      payment_method,
      updated_at: new Date(),
    });

    res.json({
      message: 'User successfully registered',
      user: {
        id: newUser.id,
        name: newUser.name,
        mobile: newUser.mobile,
        address: newUser.address,
        email: newUser.email,
        payment_method: newUser.payment_method,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, 'hkdlspairjtmchswgqusdfpgkwpdfu', { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const logout = async (req, res) => {
  try {
    // Clear the session data
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send({ error: 'Internal Server Error' });
      } else {
        res.status(200).send({ message: "Logout Successful" })
      }
    });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};



module.exports = { signUp, signIn, logout };









