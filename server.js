const env = require('dotenv').config();
const port = process.env.PORT;
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE_CONNECTION_STRING.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

console.log(`DB connection string: ${DB}`);
mongoose.connect(DB).then((con) => {
    console.log('DB connection stablished!');
    //console.log(con.connections);
});

app.listen(port, () => {
    console.log(`Hello from port ${port}`);
});
