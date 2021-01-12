var express = require('express')
var app = express()
console.log("Starting Server")
app.use(express.static('trials/', {index:'testRun.html'}))
app.get('/testRun', function (req, res) {
  res.send();
})

app.listen(3500)