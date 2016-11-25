'use strict';

/**
 * @ngdoc function
 * @name entApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the entApp
 */
function AboutCtrl($scope) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}
AboutCtrl.$inject = ['$scope'];
entApp.controller('AboutCtrl',AboutCtrl);
