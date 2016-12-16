'use strict';

/**
 * @ngdoc function
 * @name entApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the entApp
 */
function menuCtrl($scope,$state) {
  $scope.home = function(){
    $state.go('main');
  }
}
menuCtrl.$inject = ['$scope','$state'];
entApp.controller('menuCtrl',menuCtrl);
