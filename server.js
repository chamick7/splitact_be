const http = require('http');
const app = require('./app');


const port = process.env.PORT || 5000


const server = http.createServer(app);


console.log('Backend is running at port : '+port);

server.listen(port);