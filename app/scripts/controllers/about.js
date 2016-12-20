
/**
 * @ngdoc function
 * @name entApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the entApp
 */
function AboutCtrl($scope,$state,$http,srvcCom) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
  $scope.objMovie = srvcCom.getObj();
  $scope.objMovie.numMovieRating = 0;
  $scope.jqueryRating = function(){
     $('.ui.rating').rating({
       onRate : function(value){
         console.log(value);
         $scope.objMovie.numMovieRating = value;
       }
     });

  }
  $scope.jqueryRating();
  $scope.save = function(){
    $scope.objMovie.strMovieComments = $scope.strComments;
    $http({
      method: 'POST',
      url: 'http://192.168.1.88:8026/saveComments',
      data: $scope.objMovie
    }).then(function successCallback(response) {
      console.log(response);
      if(response.data.value.comments){
        $scope.res = response.data.value.comments;
      }
    }, function errorCallback(response) {

    });
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

    });
  }
  $scope.getPreviousCommenst();
}
AboutCtrl.$inject = ['$scope','$state','$http','srvcCom'];
entApp.controller('AboutCtrl',AboutCtrl);
