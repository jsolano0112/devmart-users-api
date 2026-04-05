import express, { Application } from 'express';
import appRouter from './app-route';
import { dbConnection } from './shared/infraestructure/db/mongodb.config';
import { errorHandler } from './shared/helpers/error-handler';
import cors from "cors";
import { setupSwagger } from './swagger';

const PORT: number = 3001;
const app: Application = express();

// SWAGGER
setupSwagger(app);
// END - SWAGGER


app.use(cors({
  origin: "http://localhost:5173 ", //Front
   credentials: false
}));

app.use(express.json());
app.use('/', appRouter);
app.use(errorHandler);

//DB CONNECTION
dbConnection();
//END - DB CONNECTION




app.listen(PORT, () => {
  console.log('SERVER RUNNING - http://localhost:3001/api/v1/');
  console.log('SWAGGER USERS API - http://localhost:3001/swagger');
});
