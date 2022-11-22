const env = require('dotenv').config();
const port = process.env.PORT;
const app = require('./app');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log('uncaughtException');
    console.log('ERROR: ', err.name, err.message);
    process.exit(1);
});

const DB = process.env.DATABASE_CONNECTION_STRING.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

//console.log(`DB connection string: ${DB}`);
mongoose.connect(DB).then((con) => {
    console.log('DB connection stablished!');
    //console.log(con.connections);
});

const server = app.listen(port, () => {
    console.log(`Hello from port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection');
    console.log('ERROR: ', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
