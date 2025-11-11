const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '1h' }
  );
}

module.exports = { generateToken };
