const jwt = require('jsonwebtoken');
const secret = 'AXE-BXE-CXE';

const generateJwtToken = (email, userId = 0, validity = 1) => {
  const expiresAt = new Date();

  expiresAt.setHours(expiresAt.getHours() + validity);

  const payload = { email, userId, expiresAt };
  const options = { expiresIn: `${validity}h` };
  const token = jwt.sign(payload, secret, options);

  return token;
};

const verifyJwtToken = (token) => {
  return jwt.verify(token, secret);
};

const protectedRouteHandler = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const user = verifyJwtToken(token);

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or Expired token' });
  }
};

const authmiddleware = {
  generateJwtToken,
  verifyJwtToken,
  protectedRouteHandler,
};

module.exports = authmiddleware;
