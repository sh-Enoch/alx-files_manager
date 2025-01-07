const User = require('../models/User');
const crypto = require('crypto');

const createUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if email is missing
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  // Check if password is missing
  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  try {
    // Check if email already exists in DB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword
    });

    // Save the new user in the database
    await newUser.save();

    // Return the new user with only the email and id
    return res.status(201).json({ email: newUser.email, id: newUser._id });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createUser
};
