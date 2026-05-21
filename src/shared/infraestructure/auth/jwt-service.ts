import jwt from 'jsonwebtoken';
import env from '../../../../src/config';
import { Exception } from '../../helpers/exception-message';
import { ITokens, JWTPayload } from '../../interfaces/jwt';

// ================= ENV =================

const JWT_SECRET = env.jwtSecret;
const JWT_EXPIRE_IN = env.jwtExpireIn;
const JWT_REFRESH_SECRET = env.jwtRefreshSecret;
const JWT_REFRESH_EXPIRE_IN = env.jwtRefreshExpireIn;

// ================= VALIDATIONS =================

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET is not defined');
}

// ================= GENERATE TOKENS =================

export const generateToken = (payload: JWTPayload): ITokens => {
  try {
    const { exp, iat, ...cleanPayload } = payload;

    const accessToken = jwt.sign(cleanPayload, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: JWT_EXPIRE_IN as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(cleanPayload, JWT_REFRESH_SECRET, {
      algorithm: 'HS256',
      expiresIn: JWT_REFRESH_EXPIRE_IN as jwt.SignOptions['expiresIn'],
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new Exception(
      'By generate token has ocurred error: ' + error,
      401,
    );
  }
};

// ================= VERIFY ACCESS TOKEN =================

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Exception('Token expired.', 401);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new Exception('Invalid Token.', 401);
    }

    throw new Exception(
      'By verify token has ocurred error: ' + error,
      401,
    );
  }
};

// ================= VERIFY REFRESH TOKEN =================

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Exception('Token expired.', 401);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new Exception('Invalid Token.', 401);
    }

    throw new Exception(
      'By verify token has ocurred error: ' + error,
      401,
    );
  }
};