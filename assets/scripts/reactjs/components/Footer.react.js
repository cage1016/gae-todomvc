/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/** @jsx React.DOM */

/*jslint node: true */
/*jshint -W097*/
/*jshint -W109*/
/*jshint -W108*/

'use strict';

var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');
var TodoConstants = require('../constants/TodoConstants');

var TodoFilter = TodoConstants.FilterTypes;

var Footer = React.createClass({

  propTypes: {
    allTodos: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function () {
    var activeTodoWord = this.props.count === 1 ? ' item ' : ' items ';
    var clearButton = null;


    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this._onClearCompletedClick}>
          Clear completed
        </button>
      );
    }

    var cx = React.addons.classSet;
    var nowShowing = this.props.nowShowing;
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a
              href="#/"
              className={cx({selected: nowShowing === TodoFilter.ALL_TODOS})}>
              All
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/active"
              className={cx({selected: nowShowing === TodoFilter.ACTIVE_TODOS})}>
              Active
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/completed"
              className={cx({selected: nowShowing === TodoFilter.COMPLETED_TODOS})}>
              Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  },

  /**
   * Event handler to delete all completed TODOs
   */
  _onClearCompletedClick: function () {
    TodoActions.destroyCompleted();
  }

});

module.exports = Footer;
