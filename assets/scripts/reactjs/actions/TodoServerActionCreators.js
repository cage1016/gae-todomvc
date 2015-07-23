/**
 * Created by cage on 7/23/15.
 */

/*jslint node: true */
/*jshint -W097*/
/*jshint -W109*/
/*jshint -W108*/

'use strict';

var TodoDispatcher = require('../dispatcher/TodoDispatcher');
var TodoConstants = require('../constants/TodoConstants');

var ActionTypes = TodoConstants.ActionTypes;

module.exports = {

  reveiveAll: function (todos) {
    TodoDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_TODOS,
      todos: todos
    });
  }

};