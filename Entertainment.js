var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var database = require(__dirname+"/"+"dataBase.js");
var couchbase = require("couchbase");
var cluster = new couchbase.Cluster('192.168.1.88');
var path = require('path');
var N1qlQuery = require('couchbase').N1qlQuery;
var ViewQuery = couchbase.ViewQuery;
console.log(__dirname);
app.use(express.static(path.normalize(__dirname+'/')));
app.use(express.static(path.normalize(__dirname+'/app')));
app.use(bodyParser.json());
var urlEncodedParser = bodyParser.urlencoded({ extended : false});
var aryExistingCom = [];
var response = {};
var objDocument = {};
var aryComments = [];
var aryTemComments = [];
var objNew = {};
var _ = require('lodash');
var cbase = require('./db');
// html pages
app.get('/',function(req,res){
  res.sendFile(__dirname+"/"+"app/index.html");
});
// bucket
 var bucket = cluster.openBucket('Entertainment', function(err) {
    if (err) {
      throw err;
    }});
// requests
app.post('/previousComments',urlEncodedParser,function(req,res){
  console.log(req.body.name);
var bolcheckey = cbase.bolKeyExists(req.body.name,bucket);
  bolcheckey.then(function(result){
    if(result){
       var fetch = cbase.fetchOneRecord(bucket,req.body.name);
        fetch.then(function(data){
          res.send(data);
        },function(fetError){
          console.log(fetError,"fetch Error");
        });
    }
  },function(bolerror){
    console.log(bolerror,"Key Not Exists");
  })

});
app.post('/saveComments',urlEncodedParser,function(req,res){
  //  console.dir(req.body);
  aryComments.push(req.body);
  var objDocument = {
    comments : aryComments
  }
  var bolcheckey = cbase.bolKeyExists(req.body.name,bucket);
  bolcheckey.then(function(result){
    console.log(result);
    if(result){
      var fetch = cbase.fetchOneRecord(bucket,req.body.name);
        fetch.then(function(data){
          console.log(data.value.comments,"Previous Comments");
          aryExistingCom = [];
          aryTemComments = [];
          aryExistingCom = data.value.comments;
          if(aryExistingCom.length>0){
            for(var i=0;i<aryExistingCom.length;i++){
              aryTemComments.push(aryExistingCom[i]);
            }
          }
          aryTemComments.push(req.body);
          objNew.comments = [];
          objNew.comments = _.uniq(aryTemComments);
          var upsert = cbase.upsertOneRecord(req.body.name,objNew,bucket);
            upsert.then(function(upsData){
              console.log(upsData,"Upsnew");
              var fetchNew = cbase.fetchOneRecord(bucket,req.body.name);
              fetchNew.then(function(Newdata){
                res.send(Newdata);
              },function(Newerror){
                console.log(Newerror,"updated Fetch error");
              });

            },function(upsErr){
              console.log(upsErr,"UpsertError")
            });
        },function(errdata){
          console.log(errData,"fetchError");
        })
    }
  },function(err){
    var insert = cbase.insertOneRecord(req.body.name,objDocument,bucket);
    insert.then(function(insData){
      console.log(insData,"new");
      var fetchIns = cbase.fetchOneRecord(bucket,req.body.name);
      fetchIns.then(function(NewInsdata){
        res.send(NewInsdata);
      },function(NewInserror){
        console.log(NewInserror,"updated Fetch error");
      });

    },function(insErr){
      console.log(insErr,"insertError")
    });
  });

});

var server = app.listen('8026',function(){
//  var host = server.address().address;
//  var port = server.address().port;
  var host = "127.0.0.1";
  var port = "8026";
  console.log("myWebApp is listenting at http://%s:%s",host,port);
});
