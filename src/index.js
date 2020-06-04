import app from './app';
import winston from 'winston';
import 'dotenv/config';

/* connecting db manually
const db = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

db.authenticate()
  .then(() => console.log('Database is connected...'))
  .catch((err) => console.log('Error:', err));
*/

const port = process.env.PORT || 3000;
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

app.listen(port, () => logger.info(`Application running on port ${port}`));
// app.listen(3300, () => console.log('server is running on port 3300...'));
