// import app from './app';

// const startApp = async () => {
//   const header = document.querySelector('[data-app-name]');
//   if (!header) return;

//   const programName = await app();
//   header.textContent = programName;
// };

// document.addEventListener('DOMContentLoaded', startApp);
import winston from 'winston';

import app from './app';

const port = 3000;
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});


app.listen(port, () => logger.info(`Application running on port ${port}`));
