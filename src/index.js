// import app from './app';

// const startApp = async () => {
//   const header = document.querySelector('[data-app-name]');
//   if (!header) return;

//   const programName = await app();
//   header.textContent = programName;
// };

// document.addEventListener('DOMContentLoaded', startApp);

import app from './app';

const port = 1000;


app.listen(port, () => console.log(`Application running on port ${port}`));
