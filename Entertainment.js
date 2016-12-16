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
// requests
app.post('/saveComments',urlEncodedParser,function(req,res){
  console.log('/saveComments')
  console.dir(req.body);
  var response = {};
  // db
    var bucket = cluster.openBucket('Entertainment', function(err) {
    if (err) {
      throw err;
    }
    bucket.insert(req.body.name, req.body, function(errp, resp) {
      if (err) {
        console.log('Error in inserting the document', errp);
        console.log(errp.code+""+typeof(errp.code));
        if(errp.code === 12){
          response.couchbaseMessage = "Movie"+" : "+req.body.name+","+" "+"Already Exist in Data Base!!!";
        }
        res.end(JSON.stringify(response));
        return;
      }
      response.couchbaseMessage = "Saved Your Commenst.Thank you!!!";
      res.end(JSON.stringify(response));
//      console.log('success!', res);
    });
  });
  // end db
//  res.send(JSON.stringify(req.body));
});
var server = app.listen('8026',function(){
//  var host = server.address().address;
//  var port = server.address().port;
  var host = "127.0.0.1";
  var port = "8026";
  console.log("myWebApp is listenting at http://%s:%s",host,port);
});
