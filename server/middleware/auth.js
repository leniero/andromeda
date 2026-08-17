// middleware/auth.js
const { expressjwt: expressJwt } = require('express-jwt');
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: expressJwt({
    secret,
    algorithms: ['HS256'],
    getToken: getTokenFromHeaders,
    requestProperty: 'user',
  }),
  optional: expressJwt({
    secret,
    algorithms: ['HS256'],
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    requestProperty: 'user',
  }),
};

module.exports = auth;