/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngResource'])
  .config(function ($routeProvider) {
    'use strict';

    var routeConfig = {
      controller: 'TodoCtrl',
      templateUrl: 'todomvc-index.html',
      resolve: {
        _todos: function (TodoLoaders) {
          return TodoLoaders();
        }
      }
    };

    $routeProvider
      .when('/', routeConfig)
      .when('/:status', routeConfig)
      .otherwise({
        redirectTo: '/'
      });
  });
