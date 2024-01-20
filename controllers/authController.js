const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const signUp = async (req, res) => {
  try {
    const { name, mobile, address, email, password, payment_method } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

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
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, 'hkdlspairjtmchswgqusdfpgkwpdfu', { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { signUp, signIn };
