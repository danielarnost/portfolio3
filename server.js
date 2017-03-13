var PORT       = process.env.PORT || 3000;
var express    =  require("express");
var nodemailer =  require("nodemailer");
var path       =  require("path")
var bodyParser = require("body-parser");
var logger     = require("morgan");
var mongoose   = require("mongoose");
var Example = require("./mongooseModel.js")
var Promise    = require("bluebird");
	mongoose.Promise = Promise;

var app        =  express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));
app.use(express.static('assets'));
app.use(express.static('routing'));
app.use(express.static('js'));


mongoose.connect("mongodb://localhost/portfolio");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});




app.get('/',function(req,res){
res.sendfile('./public/index.html');
});

app.post("/submit", function(req, res) {

  // Inserting an array and a boolean into the req.body object for example purposes
  req.body.array = ["item1", "item2", "item3"];
  // Remember, we have to specify booleans on the server--the front-end can only send strings
  req.body.boolean = false;

  // We use the "Example" class we defined above
  // to check our req.body against our Example model
  var content = new Example(req.body);

  // With the new Example object created, we can save our data to mongoose
  // Notice the different syntax. The magic happens in exampleModel.js
  content.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise, send the new doc to the browser
    else {
      res.send(doc);
    }
  });
});

// require('/routing/html-routes.js')(app);

app.listen(3000, function(){
console.log("Express Started on Port 3000");
});