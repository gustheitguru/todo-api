var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000
var todos = [];
var todoNextID = 1;

//will parse POST request into JSON format
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todo - HTTP Get Method / url /todo
// GET /todos?completed=true&q=string
app.get('/todo', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}


	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});



	// var filteredTodos = todos;

	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: true
	// 	});
	// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: false
	// 	});
	// }


	// if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
	// 	});
	// }

	// res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todo/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});

	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });
	// //this code down here does the same thing as the line above
	// // var matchedTodo;

	// // todos.forEach(function (todo) {
	// // 	if (todoId === todo.id) {
	// // 		matchedTodo = todo;
	// // 	}
	// // });

	// if (matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send();
	// }
});

//POST /todo - will show back in the terminal data passed via POST
// app.post('/todo', function (req, res){
// 	var body = req.body
// 	console.log('description: ' + body.description);
// 	res.json(body);
// 	});

//POST /todo
app.post('/todo', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	// var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});

	// to write to a local array
	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// body.description = body.description.trim();

	// //add ID field - set this to ID and add one each time
	// body.id = todoNextID++;

	// //push body into array
	// todos.push(body);
	// res.json(body);

});

//Delete /todo/:id
app.delete('/todo/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'no to do with that ID'
			});
		} else {
			res.status(204).send();
		};
	})
});

// app.delete('/todos/:id', function(req, res) {
// 	var todoId = parseInt(req.params.id, 10);
// 	var matchedTodo = _.findWhere(todos, {
// 		id: todoId
// 	});

// 	if (!matchedTodo) {
// 		res.status(404).json({
// 			"error": "no todo found with that id"
// 		});
// 	} else {
// 		todos = _.without(todos, matchedTodo);
// 		res.json(matchedTodo);
// 	}
// });

//PUT /todo/:id
app.put('/todo/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			return todo.update(attributes);
		} else {
			res.status(404).send();
		}
	}, function (){
		res.status(500).send();
	}).then(function (todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).send(e);
	});


	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (!matchedTodo) {
	// 	return res.status(404).send();
	// }

	// if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
	// 	validAttributes.completed = body.completed;
	// } else if (body.hasOwnProperty('completed')) {
	// 	return res.status(400).send();
	// }

	// if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
	// 	validAttributes.description = body.description;
	// } else if (body.hasOwnProperty('description')) {
	// 	return res.status(400).send();
	// // }
	// _.extend(matchedTodo, validAttributes);
	// res.json(matchedTodo);

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express Listening on port ' + PORT + '!');
	});
});