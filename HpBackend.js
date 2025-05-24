var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', (req, res, next) => {
  console.log('Root path / accessed');
  // public/index.html があれば express.static が処理するので、ここには到達しないはず
  // もし到達する場合は、express.staticの設定に問題があるか、index.htmlが存在しない可能性がある
  next();
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});

app.get('/test1', function(req, res) {
  res.send('TEST1\n');
});

app.post('/test2', function(req, res) {
  res.send('TEST2\n');
});