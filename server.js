var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');

var app = express();

var {latest, topRated, search, watchList, details} = require('./routes/index');

app.set("view engine","ejs");
app.use(express.static(__dirname+"/assets"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.get('/', latest);
app.get('/topRated', topRated);
app.get('/search', search);
app.get('/watchList', watchList);
app.get('/details', details);

const PORT = process.env.PORT || 5050;
app.listen(PORT , ()=> console.log(`Server started on port ${PORT}`));