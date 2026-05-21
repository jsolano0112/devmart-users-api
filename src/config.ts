import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'qa';

dotenv.config({
  path: `environments/.env.${env}`
});

export default {
  env,
  prod: process.env.PROD === 'true',

  port: process.env.PORT || 3001,

  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpireIn: process.env.JWT_EXPIRE_IN || '15m',

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  jwtRefreshExpireIn: process.env.JWT_REFRESH_EXPIRE_IN || '20m',

  dbUsername: process.env.DB_USERNAME || '',
  dbPassword: process.env.DB_PASSWORD || '',

  frontUrl: process.env.FRONT_URL || '5173'
};