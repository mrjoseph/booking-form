var
express     = require('express'),
routes      = require('./routes'),
http		= require('http'),
app         = express(),
fs          = require('fs');

// -- Configuration --
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');


  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.favicon());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

});
app.get('/', function(req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/page2', function(req, res) {
    fs.readFile(__dirname + '/public/page2.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.post('/save',routes.index);

app.get('/display',routes.send);

app.post('/edit',routes.edit);

app.listen(2000);

console.log('Listening on server 2000');

