var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sql-light-db'
});
//http://docs.sequelizejs.com/en/v3/docs/models-definition/

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true

		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})

sequelize.sync({
		force: true
	}).then(function() {
	console.log('Everything is synced');
	Todo.create({
		description: 'walk the dog'
	}).then(function(todo){
		return Todo.create({
			description: 'Take Shower!'
		});
	}).then(function(todo){
		return Todo.create({
			description: 'Clean Dog'
		});
	}).then(function(todo){
		//return Todo.findById(1)
		return Todo.findAll({
			where: {
				completed: false
			}
		});
	}).then(function(todos){
		if (todos) {
			todos.forEach(function(todo){
			console.log(todos.toJSON);
			});
		} else {
			console.log('Bob No Here')
		};
		
	}).then(function(todo) {
		console.log('Finished');
		console.log(todo);
	}).catch(function(e) {
		console.log(e);
	});
});