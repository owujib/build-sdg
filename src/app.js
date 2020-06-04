// const app = async () => '#BuildforSDG';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

//imported files
import userRoutes from './routes/user.routes';

const app = express();
app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.static('./docs'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./docs/index.html'));
});

app.use('/api/user', userRoutes);

app.all('*', (err, req, res, next) => {
  if (!err) return next();
  return res.status(400).json({
    status: 400,
    error: `Failed to decode param: ${req.url}`
  });
});

export default app;
