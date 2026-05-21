import express, { Application } from 'express';
import appRouter from './app-route';
import { dbConnection } from './shared/infraestructure/db/mongodb.config';
import { errorHandler } from './shared/helpers/error-handler';
import { setupSwagger } from './swagger';
import cors from 'cors';

import env from './config';

const app: Application = express();

// SWAGGER
setupSwagger(app);

// LOGS
app.use((req, res, next) => {
  const ip =
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress;

  console.log(
    `↔️ ${req.method} ${req.url} | IP: ${ip} | Host: ${req.headers.host}`,
  );
  next();
});

app.use(
  cors({
    origin: [env.frontUrl],
    credentials: false,
  }),
);

app.use(express.json());
app.use('/', appRouter);
app.use(errorHandler);

// DB
dbConnection();

// START SERVER
app.listen(env.port, () => {
  console.log(`SERVER RUNNING - PORT ${env.port}`);
  console.log(`ENVIRONMENT - ${env.env}`);
});
