
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
  url: 'http://127.0.0.1:8026/saveComments',
      data: $scope.objMovie
}).then(function successCallback(response) {
      console.log(response);
    // this callback will be called asynchronously
    // when the response is available
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
  }
}
AboutCtrl.$inject = ['$scope','$state','$http','srvcCom'];
entApp.controller('AboutCtrl',AboutCtrl);
