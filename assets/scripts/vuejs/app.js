/*global Vue, todoStorage */

(function (exports) {

  'use strict';

  exports.app = new Vue({

    // the root element that will be compiled
    el: '.todoapp',

    // app state data
    data: {
      //todos: todoStorage.fetch(),
      todos: [],
      newTodo: '',
      editedTodo: null,
      activeFilter: 'all',
      filters: {
        all: function () {
          return true;
        },
        active: function (todo) {
          return !todo.completed;
        },
        completed: function (todo) {
          return todo.completed;
        }
      },
      Todo: Vue.resource('/_ah/api/todo/v1/todos/:id')
    },

    // ready hook, watch todos change for data persistence
    ready: function () {

      this.Todo.query(function (data, status, request) {
        console.log(data);
        this.$set('todos', data.items);
      }.bind(this)).error(function (data, status, request) {
        console.error(data);
      });
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/directives.html#Writing_a_Custom_Directive
    directives: {
      'todo-focus': function (value) {
        if (!value) {
          return;
        }
        var el = this.el;
        setTimeout(function () {
          el.focus();
        }, 0);
      }
    },

    // a custom filter that filters the displayed todos array
    filters: {
      filterTodos: function (todos) {
        return todos.filter(this.filters[this.activeFilter]);
      }
    },

    // computed properties
    // http://vuejs.org/guide/computed.html
    computed: {
      remaining: function () {
        return this.todos.filter(this.filters.active).length;
      },
      allDone: {
        get: function () {
          return this.remaining === 0;
        },
        set: function (completed) {
          this.todos.forEach(function (todo) {
            //todo.completed = value;
            if (todo.completed !== completed) {
              this.toggleCompleted(todo, completed);
            }
          }, this);
        }
      }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
      addTodo: function () {
        var value = this.newTodo && this.newTodo.trim();
        if (!value) {
          return;
        }

        this.Todo.save({title: value, completed: false}, function (t) {
          this.todos.push({id: t.id, title: t.title, completed: t.completed, created: t.created});
        }.bind(this)).error(function (data, status, request) {
          // handle error
        });

        this.newTodo = '';
      },

      removeTodo: function (todo) {

        this.Todo.remove({id: todo.id}, function () {
        }).error(function (data, status, request) {
          // handle error
        });

        this.todos.$remove(todo.$data);
      },

      editTodo: function (todo) {
        this.beforeEditCache = todo.title;
        this.editedTodo = todo;
      },

      doneEdit: function (todo) {
        if (!this.editedTodo) {
          return;
        }
        this.editedTodo = null;
        todo.title = todo.title.trim();
        if (!todo.title) {
          this.removeTodo(todo);
        }

        this.Todo.update({id: todo.id}, {title: todo.title, completed: todo.completed}, function () {
        }).error(function (data, status, request) {
          // handle error
        });
      },

      cancelEdit: function (todo) {
        this.editedTodo = null;
        todo.title = this.beforeEditCache;
      },

      removeCompleted: function () {
        var completeTodos = [];
        var incompleteTodos = [];
        this.todos.forEach(function (todo) {
          if (todo.completed) {
            completeTodos.push(todo);
          } else {
            incompleteTodos.push(todo);
          }
        });

        this.$set('todos', incompleteTodos);

        completeTodos.forEach(function (todo) {
          this.removeTodo(todo);
        }, this);
      },

      toggleCompleted: function (todo, completed) {
        if (typeof completed !== 'undefined') {
          todo.completed = completed;
        }

        this.Todo.update({id: todo.id}, {title: todo.title, completed: todo.completed}, function () {
        }).error(function (data, status, request) {
          // handle error
        });
      }
    }
  });

})(window);
