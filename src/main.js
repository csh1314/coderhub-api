const app = require('./app');
require('./app/database');

const config = require('./app/config');

app.listen(config.APP_PORT, () => {
    console.log(`server start on ${config.APP_PORT}~`)
});