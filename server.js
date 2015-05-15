// require the path module
var path = require("path");
// require express and create the express app
var express = require("express");
var app = express();
// require bodyParser since we need to handle post data for adding a user
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongooses');

app.use(bodyParser.urlencoded());
// static content
app.use(express.static(path.join(__dirname, "./static")));
// set the views folder and set up ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var MongooseSchema = new mongoose.Schema({
    name: String,
    length: Number,
    gender: String,
    age: Number,
})
var Mongoose = mongoose.model('Mongoose', MongooseSchema);

app.get('/', function(req, res) {
    Mongoose.find({}, function(err, mongooses){
        if(err){
            console.log(err);
        } else{
            res.render('index', {mongooses: mongooses});
        };
    });
});
app.get('/mongooses/new', function(req, res){
    res.render('new');
});
app.get("/mongooses/:id", function(req, res) {
    console.log(req.params.id);
    Mongoose.findOne({_id: req.params.id}, function(err, mongoose){
        if(err){
            console.log(err);
        } else{
            res.render('id', {mongoose: mongoose});
        };
    });
});
app.get("/mongooses/:id/edit", function(req, res){
    Mongoose.findOne({_id: req.params.id}, function(err, mongoose){
        if(err){
            console.log(err);
        } else{
            res.render('edit', {mongoose: mongoose});
        }
    });
});

app.post('/mongooses', function(req, res){
    console.log("POST DATA", req.body);
    // create a new mongoose with corresponding post data from mongooses/new
    var mongoose = new Mongoose({name: req.body.name, length: req.body.length, gender: req.body.gender, age: req.body.age});
    mongoose.save(function(err){
        if(err){
            console.log(mongoose.errors);
        } else{
            console.log('successfully added a mongoose!');
            res.redirect('/');
        }
    });
});
app.post("/mongooses/:id", function(req, res){
    console.log("POST DATA", req.body);
    res.redirect('/');
});

// listen on 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});