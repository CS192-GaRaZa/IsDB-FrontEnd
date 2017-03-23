const express = require('express');
const logger = require('morgan');

const app = express();

app.set('port', process.env.PORT || 12121);
app.use(express.static(__dirname + '/webapp'));
app.use(logger('dev'));

app.get('/', (_, res) => {
  res.sendFile('webapp/index.html');
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
})