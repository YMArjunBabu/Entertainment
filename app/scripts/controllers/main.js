'use strict';

/**
 * @ngdoc function
 * @name entApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the entApp
 */
function MainCtrl($scope) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}
MainCtrl.$inject = ['$scope'];
entApp.controller('MainCtrl',MainCtrl);
