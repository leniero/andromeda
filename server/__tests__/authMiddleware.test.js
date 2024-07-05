const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

jest.mock('jsonwebtoken');

const mockRequest = (headers) => {
  return {
    header: jest.fn().mockImplementation((name) => headers[name]),
  };
};

describe('Auth Middleware', () => {
  test('should authenticate and attach user to request', () => {
    const req = mockRequest({ Authorization: 'Bearer token' });
    const res = {};
    const next = jest.fn();

    jwt.verify.mockReturnValue({ _id: '1', username: 'testuser' });

    auth(req, res, next);

    expect(req.user).toEqual({ _id: '1', username: 'testuser' });
    expect(next).toHaveBeenCalled();
  });

  test('should return 401 if no token is provided', () => {
    const req = mockRequest({});
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
  });

  test('should return 401 if token is invalid', () => {
    const req = mockRequest({ Authorization: 'Bearer invalidtoken' });
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
  });
});