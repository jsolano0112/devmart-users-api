import mongoose from "mongoose";
import "dotenv/config";
const DB_NAME: string = "users";
const MONGOATLAS_URL: string = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.97mongr.mongodb.net/${DB_NAME}?appName=Cluster0`;

export const dbConnection = async () => {
  try {
    await mongoose.connect(`${MONGOATLAS_URL}/${DB_NAME}`);
    console.log("[DB-STATUS] MongoDB is online");
  } catch (error) {
    console.error(error);
    throw new Error("[DB-ERROR] it is not possible to connect");
  }
};
