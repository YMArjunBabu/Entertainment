var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var database = require(__dirname+"/"+"dataBase.js");
var couchbase = require("couchbase");
var cluster = new couchbase.Cluster('192.168.1.88');
var path = require('path');
var N1qlQuery = require('couchbase').N1qlQuery;
console.log(__dirname);
app.use(express.static(path.normalize(__dirname+'/')));
app.use(express.static(path.normalize(__dirname+'/app')));
app.use(bodyParser.json());
var urlEncodedParser = bodyParser.urlencoded({ extended : false});

// html pages
app.get('/',function(req,res){
  res.sendFile(__dirname+"/"+"app/index.html");
});
var server = app.listen('8026',function(){
//  var host = server.address().address;
//  var port = server.address().port;
  var host = "192.168.1.88";
  var port = "8026";
  console.log("myWebApp is listenting at http://%s:%s",host,port);
});
