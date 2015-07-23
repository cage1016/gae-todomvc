/*global angular */

/**
 * Services that persists and retrieves todos from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */

'use strict';

angular.module('todomvc')
  .factory('Todo', function ($resource) {
    var Todo = $resource('/_ah/api/todo/v1/todos/:id', {id: '@id'}, {
      query: {method: 'GET', isArray: false},
      update: {method: 'PUT'},
      remove: {method: 'DELETE'}
    });
    return Todo;
  })

  .factory('TodoLoaders', function ($q, Todo) {
    return function () {
      var delay = $q.defer();
      Todo.query(function (response) {

        var todos = [];
        angular.forEach(response.items, function (item) {
          var todo = new Todo();
          todo.title = item.title;
          todo.completed = item.completed;
          todo.id = item.id;
          todo.created = item.created;
          todos.push(todo);
        });

        delay.resolve(todos);
      }, function (error) {
        delay.reject('Unable to fetch todos');
      });
      return delay.promise;
    };
  });
