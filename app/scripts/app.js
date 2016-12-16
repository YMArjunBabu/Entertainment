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
    $urlRouterProvider.otherwise('main');
    $stateProvider
      .state('main', {
        url:'/main',
        templateUrl: '/app/views/main.html'
    })
      .state('about', {
        url:'/about',
        templateUrl: '/app/views/about.html'
      })

  });
