const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const validator = require("validator");


const signUp = async (req, res) => {
  try {
    const { name, mobile, address, email, password, payment_method } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const validationOptions = {
      minLength: 8,
      minLowerCase: 1,
      minUpperCase: 1,
      minNumber: 1,
      returnScore: false,
    };

    if (!validator.isStrongPassword(password, validationOptions)) {
      return res.status(400).send({ error: "Weak password. Must be at least 8 characters long including lowercase, uppercase and numeric values."})
    }

    const newUser = await User.create({
      name,
      mobile,
      address,
      email,
      password: hashedPassword,
      payment_method,
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
        created_at: new Date(),
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

    const isPasswordValid = bcrypt.compare(password, user.password); //always false with await. both params correct.
    console.log(isPasswordValid)
    // without await user can sign in with incorrect password as long as they know the email address need to fix.

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, 'hkdlspairjtmchswgqusdfpgkwpdfu', { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error in sign in', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { signUp, signIn };
