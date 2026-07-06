// server.js
// Entry point of the backend. Boots the Express app defined in app.js.

const app = require('./app');
const config = require('./config/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Student Learning Dashboard API running in ${config.nodeEnv} mode on port ${PORT}`);
});
