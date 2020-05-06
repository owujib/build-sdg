// const app = async () => '#BuildforSDG';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';


const app = express();
app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to FarmHub Api' });
});


app.all('*', (err, req, res, next) => {
  if (!err) return next();
  return res.status(400).json({
    status: 400,
    error: `Failed to decode param: ${req.url}`
  });
});

export default app;
