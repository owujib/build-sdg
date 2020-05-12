"use strict";

var _winston = _interopRequireDefault(require("winston"));

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import app from './app';
// const startApp = async () => {
//   const header = document.querySelector('[data-app-name]');
//   if (!header) return;
//   const programName = await app();
//   header.textContent = programName;
// };
// document.addEventListener('DOMContentLoaded', startApp);
const port = 3000;

const logger = _winston.default.createLogger({
  transports: [new _winston.default.transports.Console()]
});

_app.default.listen(port, () => logger.info(`Application running on port ${port}`));
//# sourceMappingURL=index.js.map