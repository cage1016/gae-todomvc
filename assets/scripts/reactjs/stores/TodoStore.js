/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

/** @jsx React.DOM */

/*jslint node: true */
/*jshint -W097*/
/*jshint -W109*/
/*jshint -W108*/

'use strict';
var TodoDispatcher = require('../dispatcher/TodoDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var TodoConstants = require('../constants/TodoConstants');

var ActionTypes = TodoConstants.ActionTypes;

var api = require('../utils/apiUtils');

var CHANGE_EVENT = 'change';

var _todos = [];

function init(todos) {
  _todos = todos;
}


/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(title, cb) {
  api.addTodo({
    title: title,
    completed: false
  }).then(function (response) {
    _todos = _todos || [];
    _todos = _todos.concat(response.data);
    cb();
  });
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(todoToSave, properties, cb) {
  api.updateTodo(assign({}, todoToSave, properties)).then(function (response) {
    _todos = _todos.map(function (todo) {
      return todo.id !== todoToSave.id ? todo : assign({}, todo, response.data);
    });

    cb();
  });
}

/**
 * Update all of the TODO items with the same object.
 *     the data to be updated.  Used to mark all TODOs as completed.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.

 */
function updateAll(properties, cb) {
  //_todos = _todos.map(function (todo) {
  //  return api.updateTodo(assign({}, todo, properties)).then(function (response) {
  //    return response.data;
  //  });
  //});

  var tasks = [];
  _todos.forEach(function (todo) {
    tasks.push(api.updateTodo(assign({}, todo, properties)));
  });

  api.waitAll(tasks).then(function () {
    _todos = _todos.map(function (todo) {
      return assign({}, todo, properties);
    });

    cb();
  });
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(todo, cb) {
  api.deleteTodo(todo).then(function (response) {
    _todos = _todos.filter(function (candidate) {
      return candidate !== todo;
    });

    cb();
  });
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted(cb) {
  var completeTodos = [];
  var incompleteTodos = [];
  _todos.forEach(function (todo) {
    if (todo.completed) {
      completeTodos.push(todo);
    } else {
      incompleteTodos.push(todo);
    }
  });

  completeTodos.forEach(function (todo) {
    api.deleteTodo(todo).then(function (response) {

    });
  });

  _todos = incompleteTodos;

  cb();
}

var TodoStore = assign({}, EventEmitter.prototype, {

  init: function (todos) {
    init(todos);
  },

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function () {
    for (var key in _todos) {
      var todo = _todos[key];
      if (!todo.completed) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function () {
    return _todos.sort(function (a, b) {
      return a.created < b.created;
    });
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
TodoDispatcher.register(function (payload) {
  var title;
  var action = payload.action;

  switch (action.type) {
    case ActionTypes.TODO_CREATE:
      title = action.title.trim();
      if (title !== '') {
        create(title, function () {
          TodoStore.emitChange();
        });
      }
      break;

    case ActionTypes.TODO_TOGGLE_COMPLETE_ALL:
      if (TodoStore.areAllComplete()) {
        updateAll({completed: false}, function () {
          TodoStore.emitChange();
        });
      } else {
        updateAll({completed: true}, function () {
          TodoStore.emitChange();
        });
      }
      break;

    case ActionTypes.TODO_UNDO_COMPLETE:
      update(action.todo, {completed: false}, function () {
        TodoStore.emitChange();
      });
      break;

    case ActionTypes.TODO_COMPLETE:
      update(action.todo, {completed: true}, function () {
        TodoStore.emitChange();
      });
      break;

    case ActionTypes.TODO_UPDATE_TEXT:
      title = action.title.trim();
      if (title !== '') {
        update(action.todo, {title: title}, function () {
          TodoStore.emitChange();
        });
      }
      break;

    case ActionTypes.TODO_DESTROY:
      destroy(action.todo, function () {
        TodoStore.emitChange();
      });
      break;

    case ActionTypes.TODO_DESTROY_COMPLETED:
      destroyCompleted(function () {
        TodoStore.emitChange();
      });
      break;

    case ActionTypes.RECEIVE_TODOS:
      TodoStore.init(action.todos);
      TodoStore.emitChange();
      break;

    default:
    // no op
  }
});

module.exports = TodoStore;
