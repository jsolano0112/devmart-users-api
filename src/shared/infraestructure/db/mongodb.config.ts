import mongoose from 'mongoose';
import env from './../../../../src/config';

const DB_NAME: string = "users";

const MONGOATLAS_URL: string =
  `mongodb+srv://${env.dbUsername}:${env.dbPassword}` +
  `@cluster0.97mongr.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

export const dbConnection = async () => {
  try {

    await mongoose.connect(MONGOATLAS_URL);

    console.log('[DB-STATUS] MongoDB is online');

  } catch (error) {

    console.error(error);

    throw new Error('[DB-ERROR] it is not possible to connect');
  }
};