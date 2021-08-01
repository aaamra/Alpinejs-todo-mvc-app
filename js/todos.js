window.todoStore = {
	STORAGE_KEY: 'today-todo-list',

	todos: JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]'),

	save() {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
	}
};


window.todos = function () {
	return {
		...todoStore,
		newTodo: '',
		editedTodo: null,
		filter: 'all',

		get activeTodos() {
			return this.todos.filter(todo => !todo.completed);
		},

		get completedTodos() {
			return this.todos.filter(todo => todo.completed);
		},

		get filteredTodos() {
			return {
				all: this.todos,
				active: this.activeTodos,
				completed: this.completedTodos
			}[this.filter];
		},

		get allCompleted() {
			return this.todos.length === this.completedTodos.length;
		},

		addTodo() {
			if (this.newTodo.trim() === '') {
				return;
			}
			this.todos.push({
				id: Date.now(),
				title: this.newTodo,
				completed: false
			});

			this.save();

			this.newTodo = '';
		},

		deleteTodo(todo) {
			const index = this.todos.indexOf(todo);
			this.todos.splice(index, 1);
			this.save();
		},

		editTodo(todo) {
			todo.cachedTitle = todo.title;

			this.editedTodo = todo;
		},

		cancelEdit(todo) {
			todo.title = todo.cachedTitle;

			this.editedTodo = null;

			delete todo.cachedTitle;

			this.save();
		},

		editComplete(todo) {
			if (todo.title.trim() === '') {
				this.deleteTodo(todo);
			}

			this.editedTodo = null;

			delete todo.cachedTitle;

			this.save();
		},

		toggleCompletion(todo) {
			todo.completed = !todo.completed;

			this.save();
		},

		toggleAllCompletion() {
			const allCompleted = this.allCompleted;

			this.todos.forEach(todo => todo.completed = !allCompleted);

			this.save();
		},

		clearCompletedTodos() {
			this.todos = this.activeTodos;

			this.save();
		}

	};
};
