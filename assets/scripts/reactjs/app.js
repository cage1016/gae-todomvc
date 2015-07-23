var React = require('react');

var api  = require('./utils/apiUtils');

var TodoApp = require('./components/TodoApp.react');

api.getAllTodos();

React.render(
  <TodoApp />,
  document.getElementById('todoapp')
);
