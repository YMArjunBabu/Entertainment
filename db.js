/**
 * Created by vijay on 8/10/15.
 */
var Q = require('q');
var couchbase = require('couchbase');
var ViewQuery = couchbase.ViewQuery;
function getViewQuery(){
	return ViewQuery;
}

function updateSingleKeyInRecord(bucket, recordKey, keyToUpdate, ValueToUpdate){
	var deferred = Q.defer();

	var getInitialStateOfRecord = fetchOneRecord(bucket, recordKey);
	getInitialStateOfRecord.then(updateRecord, errorInInitialState);

	function updateRecord(initialRecord){
		initialRecord = initialRecord.value;
		initialRecord[keyToUpdate] = ValueToUpdate;
		var updateRecord = upsertOneRecord(recordKey, initialRecord, bucket);
		updateRecord.then(deferred.resolve, deferred.reject);
	}

	function errorInInitialState(err){
		deferred.reject(err);
	}

	return deferred.promise;
}


function executeQueryAndRetunResults(bucket, query, res){
	var deferred = Q.defer();
  var emptyArray = [];
  console.log("In executeQueryAndGetResults ------------------------------------");
  console.log(query);
  console.log("Next step is actual query to database...");
	bucket.query(query, function (err, results) {
	  console.log("Executed query in DB");
		if (err) {
			console.error(err);
			deferred.reject(err);
		} else {
			console.log("Returning results from DB");
			deferred.resolve(results);
		}
	});

	return deferred.promise;
}

function upsertOneRecord(curKey, data, bucket){
	var deferred = Q.defer();
	//console.log("---------------------------------------------------------------------------")
	//console.log("KEY : ", curKey);
	//console.log(data.SRNO, data.stage, data.revision);
	//console.log("---------------------------------------------------------------------------")
	bucket.upsert(String(curKey),data, function(err,result){
		if(err){
			//console.log(err);
			deferred.reject(err);
		};
		deferred.resolve(result);
	});
	return deferred.promise;
}

function insertOneRecord(curKey, data, bucket){
	var deferred = Q.defer();

	bucket.insert(String(curKey),data, function(err,result){
		if(err){
			//console.log(err);
			deferred.reject(err);
		};
		deferred.resolve(true);
	});
	return deferred.promise;
}


function fetchOneRecord(bucket, key){
	var deferred = Q.defer();
	bucket.get(key, function(err,data){
		if(err){
			deferred.reject('no record exists with key : ' + key) // + ' in bucket : ' + bucket._name);
		}
	deferred.resolve(data);
//      console.dir(data);
	});
	return deferred.promise;
}

function bolKeyExists(strKey,bucket){
	var deferred = Q.defer();
	bucket.get(strKey, function(err,res){
		if(err){
			deferred.reject(false);
		}else{
			deferred.resolve(true);
		}
	});
	return deferred.promise;
}


function insertMultipleRecordswithAutoUUID(aryRecords, bucket){
	var deferred = Q.defer();
	function insertTheRecord(aKey,aRecord){
		//console.log("Inserting one record")
		var deferred = Q.defer();
		var insertRecord = upsertOneRecord(aKey, aRecord,bucket);
		insertRecord.then(deferred.resolve,deferred.reject);
		return deferred.promise;
	}

	var buildCalls = function(){
		//console.log("Building the calls")
		var aryAllOperations = [];
		for(var i=0; i<aryRecords.length; i++){
			//console.log("Iteration for record no : " + i)
			var getkey = getUniqueKey.getUniqueKey(bucket,i);
			getkey.then(prepareArrayOfPromises, deferred.reject);

			function prepareArrayOfPromises(aryParsedResult){
				//console.log("Got unique key. Pusing into array : " + aryParsedResult)
				aryAllOperations.push(insertTheRecord(aryParsedResult[1],aryRecords[aryParsedResult[0]]));
			}
		}
		return aryAllOperations;
	};

	Q.all(buildCalls())
		.then(function(results){
			deferred.resolve(true);
		}, function(err){
			deferred.reject(err)
		});

	return deferred.promise;
}

function updateMultipleRecords(strKeyName, aryRecords, bucket){
	var deferred = Q.defer();
	var aryParsedArray = [];
	var aryDBOperations = [];
	function getID(n){
	  console.log(n[strKeyName]);
		return n[strKeyName];
	}
	var aryKeys = _.map(aryRecords, getID);
	bucket.getMulti(aryKeys, function(err, data){
		if(err){
			deferred.reject(err);
		}else{
			for(var i=0; i< aryRecords.length; i++){
				if(data[aryRecords[i][strKeyName]]['value']){
					var tempObj = _.cloneDeep(data[aryRecords[i][strKeyName]]['value']);
					data[aryRecords[i][strKeyName]]['value'] = aryRecords[i];
					data[aryRecords[i][strKeyName]]['value']['previous'] = tempObj;
					aryParsedArray.push(data[aryRecords[i][strKeyName]]['value']);
				}
			}
			function prepareForDBOperations(){
				for (var i=0; i<aryParsedArray.length; i++){
					aryDBOperations.push(upsertOneRecord(aryParsedArray[i]['rowId'],aryParsedArray[i],dbBuckets.bucketTelecom));
				}
				return aryDBOperations;
			}

			Q.all(prepareForDBOperations())
				.then(updateSuccess, updateFailed);

			function updateSuccess(results){
				deferred.resolve(true)
			}

			function updateFailed(err){
				deferred.reject(false);
			}

		}
	});

	return deferred.promise;
}



function upsertMultipleRecords(aryRecords, bucket){
	var deferred = Q.defer();
	console.log("upsertMultipleRecords")
	function prepareForDBOperations(){
		var aryDBOperations = [];
		for (var i=0; i<aryRecords.length; i++){
			aryDBOperations.push(upsertOneRecord(aryRecords[i].id, aryRecords[i].value, bucket));
		}
		return aryDBOperations;
	}

	Q.all(prepareForDBOperations())
		.then(updateSuccess, updateFailed);

	function updateSuccess(results){

		deferred.resolve(true);
	}

	function updateFailed(err){

		deferred.reject(err);
	}

	return deferred.promise;
}




//----------------------------------

function removeOneRecord(strKey, bucket){
  var deferred = Q.defer();
  bucket.remove(strKey, function(err,results){
    if(err){
      deferred.reject(err);
    }else{
      deferred.resolve(results);
    }
  });
  return deferred.promise;
}


function deleteRecords(aryRecords, bucket){
  var deferred = Q.defer();
  console.log("deleting records from db now");

  function removeAllRecords(){
    console.log("Removing Database Records")
    var aryDBOperations = [];
    for (var i=0; i<aryRecords.length; i++){
      console.log("Removing Record No : " + i + " , id : " + aryRecords[i]);
      aryDBOperations.push(removeOneRecord(aryRecords[i],bucket));
    }
    return aryDBOperations;
  }

  Q.all(removeAllRecords())
    .then(updateSuccess, updateFailed);

  function updateSuccess(results){
    console.log("Removed records");
    deferred.resolve(true);
  }

  function updateFailed(err){

    deferred.reject(err);
  }

  return deferred.promise;
}


var db = {
	"insertOneRecord": insertOneRecord,
    "fetchOneRecord" : fetchOneRecord,
	"upsertOneRecord": upsertOneRecord,
	"readOneRecord": fetchOneRecord,
	"getViewQuery": getViewQuery,
	"executeQueryAndRetunResults": executeQueryAndRetunResults,
	"updateSingleKeyInRecord": updateSingleKeyInRecord,
	"updateMultipleRecords": updateMultipleRecords,
	"upsertMultipleRecords": upsertMultipleRecords,
	"insertMultipleRecordswithAutoUUID": insertMultipleRecordswithAutoUUID,
  "deleteRecords": deleteRecords,
  "bolKeyExists" : bolKeyExists
};

module.exports = db;
