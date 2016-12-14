'use strict';

/**
 * @ngdoc overview
 * @name entApp
 * @description
 * # entApp
 *
 * Main module of the application.
 */
var entApp = angular
  .module('entApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router'
  ]);
  entApp.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('/', {
        templateUrl: '/app/views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .state('about', {
        templateUrl: '/app/views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })

  });
