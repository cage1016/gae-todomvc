/** @jsx React.DOM */

/*jslint node: true */
/*jshint -W097*/
/*jshint -W109*/
/*jshint -W108*/

'use strict';

var axios = require('axios');

var TodoServerActionCreators = require('../actions/TodoServerActionCreators');

module.exports = {

  getAllTodos: function () {
    axios.get('/_ah/api/todo/v1/todos').then(function (response) {
      TodoServerActionCreators.reveiveAll(response.data.items);
    });
  },

  addTodo: function (todo) {
    return axios.post('/_ah/api/todo/v1/todos', todo);
  },

  updateTodo: function (todo) {
    return axios.put('/_ah/api/todo/v1/todos/' + todo.id, todo);
  },

  deleteTodo: function (todo) {
    return axios.delete('/_ah/api/todo/v1/todos/' + todo.id);
  },

  waitAll: function (tasks) {
    return axios.all(tasks);
  }
};