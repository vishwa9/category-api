var express = require('express');
var wagner = require('wagner-core');
var bodyParser = require('body-parser');

require('./models')(wagner);
//require('./config')(wagner);

var app = express();
wagner.invoke(require('./auth'),{ app:app});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1',require('./api')(wagner));

app.listen(3000);

console.log('listening on port 3000');
