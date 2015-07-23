/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoActions
 */

/** @jsx React.DOM */

/*jslint node: true */
/*jshint -W097*/
/*jshint -W109*/
/*jshint -W108*/

'use strict';

var TodoDispatcher = require('../dispatcher/TodoDispatcher');
var TodoConstants = require('../constants/TodoConstants');

var ActionTypes = TodoConstants.ActionTypes;

var TodoActions = {

  /**
   * @param  {string} text
   */
  create: function (title) {
    TodoDispatcher.handleViewAction({
      type: ActionTypes.TODO_CREATE,
      title: title
    });
  },

  /**
   * @param  {string} id The ID of the ToDo item
   * @param  {string} text
   */
  updateText: function (todo, title) {
    TodoDispatcher.handleViewAction({
      type: ActionTypes.TODO_UPDATE_TEXT,
      todo: todo,
      title: title
    });
  },

  /**
   * Toggle whether a single ToDo is complete
   * @param  {object} todo
   */
  toggleComplete: function (todo) {
    var actionType = todo.completed ?
      ActionTypes.TODO_UNDO_COMPLETE :
      ActionTypes.TODO_COMPLETE;

    TodoDispatcher.handleViewAction({
      type: actionType,
      todo: todo
    });
  },

  /**
   * Mark all ToDos as complete
   */
  toggleCompleteAll: function () {
    TodoDispatcher.handleViewAction({
      type: ActionTypes.TODO_TOGGLE_COMPLETE_ALL
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function (todo) {
    TodoDispatcher.handleViewAction({
      type: ActionTypes.TODO_DESTROY,
      todo: todo
    });
  },

  /**
   * Delete all the completed ToDos
   */
  destroyCompleted: function () {
    TodoDispatcher.handleViewAction({
      type: ActionTypes.TODO_DESTROY_COMPLETED
    });
  }

};

module.exports = TodoActions;
