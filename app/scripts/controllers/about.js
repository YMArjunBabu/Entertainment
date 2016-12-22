
/**
 * @ngdoc function
 * @name entApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the entApp
 */
function AboutCtrl($scope,$state,$http,srvcCom,toaster) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
  $scope.strUserName = "";
  $scope.strComments = "";
  $scope.objMovie = srvcCom.getObj();
//  console.dir($scope.objMovie);
  $scope.objMovie.numMovieRating = 0;
  $scope.jqueryRating = function(){
     $('#rate').rating({
       onRate : function(value){
//         console.log(value);
         $scope.objMovie.numMovieRating = value;
       }
     });

  }
  $scope.jqueryRating();
  $scope.save = function(){
    $scope.objMovie.userName = $scope.strUserName;
    $scope.objMovie.strMovieComments = $scope.strComments;
    if($scope.objMovie.userName.length > 0 && $scope.objMovie.strMovieComments.length > 0 && $scope.objMovie.numMovieRating > 0){
      $http({
        method: 'POST',
        url: 'http://192.168.1.88:8026/saveComments',
        data: $scope.objMovie
      }).then(function successCallback(response) {
//        console.log(response);
        if(response.data.value.comments){
          $scope.res = response.data.value.comments;
          $scope.strComments = "";
          $scope.strUserName = "";
          $scope.jqueryRating();
          toaster.pop('success', "", "Thankyou Have a Great Day!!!");
        }
        $scope.strComments = "";
        $scope.strUserName = "";
        $scope.jqueryRating();

      }, function errorCallback(response) {
        console.log("error",response);
      });
    }else if($scope.objMovie.userName.length == 0){
      toaster.pop('info', "", "Please enter your Name");
//      console.log("Please enter your Name");
    }else if($scope.objMovie.strMovieComments.length == 0){
      toaster.pop('info', "", "Please Comment");
//      console.log("Please Comment");
    }else if($scope.objMovie.numMovieRating == 0){
      toaster.pop('info', "", "Please rate the movie");
//      console.log("Please rate the movie");
    }

  }
  $scope.getPreviousCommenst = function(){
    $http({
      method: 'POST',
      url: 'http://192.168.1.88:8026/previousComments',
      data: $scope.objMovie
    }).then(function successCallback(response) {
      console.log(response);
      if(response.data.value.comments){
        $scope.res = response.data.value.comments;
      }
    }, function errorCallback(response) {
        console.log("error",response);
    });
  }
  $scope.getPreviousCommenst();
}
AboutCtrl.$inject = ['$scope','$state','$http','srvcCom','toaster'];
entApp.controller('AboutCtrl',AboutCtrl);
