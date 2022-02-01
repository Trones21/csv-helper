var express = require('express');
var app = express();

console.log("Starting Server");

app.use(express.static('deployed/'));

// app.get('/', function (req, res) {
//   res.send();
// });

app.listen(3500); 