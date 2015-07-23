/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoConstants
 */

var keyMirror = require('keymirror');

module.exports = {

  ActionTypes: keyMirror({
    TODO_CREATE: null,
    TODO_COMPLETE: null,
    TODO_DESTROY: null,
    TODO_DESTROY_COMPLETED: null,
    TODO_TOGGLE_COMPLETE_ALL: null,
    TODO_UNDO_COMPLETE: null,
    TODO_UPDATE_TEXT: null,
    RECEIVE_TODOS: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  }),

  FilterTypes: {
    ALL_TODOS: 'all',
    ACTIVE_TODOS: 'active',
    COMPLETED_TODOS: 'completed'
  }
};
