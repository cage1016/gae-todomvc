/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

/** @jsx React.DOM */

/*jslint node: true */
/*jshint -W097*/
/*jshint -W109*/
/*jshint -W108*/

'use strict';

var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');
var React = require('react');
var TodoStore = require('../stores/TodoStore');
var TodoConstants = require('../constants/TodoConstants');
var director = require('director');

var TodoFilter = TodoConstants.FilterTypes;

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getTodoState() {
  return {
    allTodos: TodoStore.getAll(),
    areAllComplete: TodoStore.areAllComplete(),
    nowShowing: TodoFilter.ALL_TODOS,
    editing: null
  };
}


var TodoApp = React.createClass({

  getInitialState: function () {
    return getTodoState();
    //return {
    //  nowShowing: TodoFilter.ALL_TODOS,
    //  editing: null,
    //  allTodos: TodoStore.getAll(),
    //  areAllComplete: TodoStore.areAllComplete(),
    //};
  },

  componentDidMount: function () {
    var setState = this.setState;
    var router = new director.Router({
      '/': setState.bind(this, {nowShowing: TodoFilter.ALL_TODOS}),
      '/active': setState.bind(this, {nowShowing: TodoFilter.ACTIVE_TODOS}),
      '/completed': setState.bind(this, {nowShowing: TodoFilter.COMPLETED_TODOS})
    });
    router.init('/');

    TodoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    TodoStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function () {
    var todos = this.state.allTodos;
    var shownTodos = todos.filter(function (todo) {
      switch (this.state.nowShowing) {
        case TodoFilter.ACTIVE_TODOS:
          return !todo.completed;
        case TodoFilter.COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    }, this);


    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    return (
      <div>
        <Header />
        <MainSection
          allTodos={shownTodos}
          nowShowing={this.state.nowShowing}
          areAllComplete={this.state.areAllComplete}
          />
        <Footer
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={this.state.areAllComplete}
          />
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function () {
    this.setState(getTodoState());
  }

});

module.exports = TodoApp;
