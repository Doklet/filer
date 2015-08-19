'use strict';

/**
 * @ngdoc overview
 * @name filerApp
 * @description
 * # filerApp
 *
 * Main module of the application.
 */
angular
  .module('filerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.module('filerApp').config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});