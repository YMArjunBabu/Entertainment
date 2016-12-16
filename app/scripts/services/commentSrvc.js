function srvcCom(){
  var objDetails = {};
  this.setObj = function(objD){
    objDetails = objD;
  }
  this.getObj = function(){
    return objDetails;
  }
}
entApp.service('srvcCom',srvcCom);
