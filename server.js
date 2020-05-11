var express = require('express');
var bodyParser = require('body-parser');
var mysql=require('mysql');
var url=require('url');
var session= require('express-session');

var app = express();

var {latest, topRated, search, watchList, details, signIn, signUp} = require('./routes/index');

app.set("view engine","ejs");
app.use(express.static(__dirname+"/assets"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


app.get('/', latest);
app.get('/topRated', topRated);
app.get('/search', search);
app.get('/watchList', watchList);
app.get('/details', details);
app.get('/signin', signIn);
app.get('/signup', signUp);

//database connection

var db = mysql.createConnection({
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'ba611a6395635b',
  password: '51adca2f',
  database: 'heroku_367dd1c3885c462'
});



// db.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   sql="CREATE DATABASE IF NOT EXISTS heroku_367dd1c3885c462";
//   db.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });


// global.db=db;

// var db = mysql.createConnection({
//   host: "@us-cdbr-east-06.cleardb.net",
//   user: "ba611a6395635b:51adca2f",
//   password: "51adca2f",
//   database: "heroku_367dd1c3885c462"
//  });
 
 global.db=db;
  
  db.connect(function(err) {
    if (err) throw err;
    var sql = "CREATE TABLE IF NOT EXISTS persons1 (username varchar(11) NOT NULL, password varchar(11), PRIMARY KEY (username)) ENGINE=InnoDB  DEFAULT CHARSET=latin1";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Users Table created");
    });

    
  });
  handleDisconnect(db);
  
  function handleDisconnect(connection){
    connection.on('error', function(err){
      if(!err.fatal)
      {
        return;
      }
      if(err.code !== 'PROTOCOL_CONNECTION_LOST')
      {
        throw err;
      }
      console.log('\nRe-connecting lost connection: ' +err.stack);
      connection = mysql.createConnection(connection.config);
      handleDisconnect(connection);
      connection.connect();
    });
  }
  
  handleDisconnect(db);
  //connection.connect();
  
  
  
  
  
  
  
  
  
  
  global.db=db;


  global.UN="";

  global.err=""
app.get('/', latest);
app.get('/topRated', topRated);
app.get('/search', search);
app.get('/watchList', watchList);
app.get('/details', details);
app.get('/signin', signIn);
app.get('/signup', signUp);
    
  app.post("/signup", function(req,res) {
    let userName=req.body.username;
    let passWord=req.body.password;
    global.UN=userName
    console.log(UN)
    var sql = "CREATE TABLE IF NOT EXISTS "+ userName +" (movie_id int(11) NOT NULL, PRIMARY KEY (movie_id)) ENGINE=InnoDB  DEFAULT CHARSET=latin1";
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });

    let addQuery="INSERT INTO IF NOT EXISTS `persons1` (username, password) VALUES('" + userName + "','" + passWord + "')";
    db.query(addQuery,function(err,result){
        if(err){
            console.log("could not insert!")
            res.redirect('/');
        }
        console.log("sign up data inserted")
    });
    res.redirect('/signin');
    });

    handleDisconnect(db);
 
    app.post("/signin", function(req,res) {
      let userName2=req.body.username2;
      let passWord2=req.body.password2;
      //console.log(userName2)
      console.log("signin:"+UN)
      if (userName2 && passWord2){
      var sql ="SELECT * FROM `"+"persons1"+"` WHERE username = '" + userName2 + "' AND password = '" + passWord2 + "' ";
       db.query(sql, function (err, result) {
        if (err){
          res.redirect('/');
        };
        if (result.length>0){
            
            req.session.username= userName2;
            req.session.loggedin= true;
            global.UN=userName2;
            console.log("Logged In!"+req.session.loggedin);
            res.redirect('/watchList');
            global.err=""

        }
        else{
          console.log("Wrong password!");
          global.err="Wrong Credentials!"
          res.redirect('/signin')
        }        
      });
    }
      });

      handleDisconnect(db);

  app.post("/", function(req,res) {
    console.log("/:"+UN)
    if(UN.length<1){
      console.log("s");
      res.redirect('/signin')
   }
   else{
    let movieId=req.body.q
    //console.log(movieId)
    let addQuery="INSERT INTO `"+UN+"` (`movie_id`) VALUES ('" + movieId + "')";
    db.query(addQuery,function(err,result){
        if(err){
            console.log("1 could not insert!")
            res.redirect('/');
        }
        
    });
  }
    });
  
    handleDisconnect(db);
    app.post("/top-rated", function(req, res) {
    let movieId=req.body.q
    //console.log(movieId)
    let addQuery="INSERT INTO `"+UN+"` (`movie_id`) VALUES ('" + movieId + "')";
    db.query(addQuery,function(err,result){
        if(err){
            console.log("2 could not insert!")
            res.redirect('/');
        }
        
    });
    });

    handleDisconnect(db);

    app.post("/search", function(req, res) {
    let movieId=req.body.q
    //console.log(movieId)
    let addQuery="INSERT INTO `"+UN+"` (`movie_id`) VALUES ('" + movieId + "')";
    db.query(addQuery,function(err,result){
        if(err){
            console.log("3 could not insert!")
            res.redirect('/');
        }
        
    });
    });
    handleDisconnect(db);


    app.post("/details", function(req, res) {
    let movieId=req.body.q
    //console.log(movieId)
    let addQuery="INSERT INTO `"+UN+"` (`movie_id`) VALUES ('" + movieId + "')";
    db.query(addQuery,function(err,result){
        if(err){
            console.log("4 could not insert!")
            res.redirect('/');
        }
        
    });
    });
    handleDisconnect(db); 






const PORT = process.env.PORT || 5050;
app.listen(PORT)
