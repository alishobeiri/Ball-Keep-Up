const express = require('express')
var app = express();

app.use('/images', express.static(__dirname + "/images"))
app.use('/', express.static(__dirname))


app.get('/', (req, res) => {
  res.sendFile('index.html', {root: "./"})
});

app.get('/style.css', (req, res) => {
  res.sendFile('style.css', {root: "./"})
});

app.get('/app.js', (req, res) => {
  res.sendFile('app.js', {root: "./"})
});

app.get('/pixi.min.js', (req, res) => {
  res.sendFile('pixi.min.js', {root: "./"})
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});