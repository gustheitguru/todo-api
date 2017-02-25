var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000
var todos = [];
var todoNextID = 1;

//will parse POST request into JSON format
app.use(bodyParser.json());

app.get('/', function (req, res){
	res.send('Todo API Root');
	});

// GET /todo - HTTP Get Method / url /todo

app.get('/todo', function (req, res){
	res.json(todos);
	});

// Get /todo/:id

app.get('/todo/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(todos, {id: todoId});
	//this code down here does the same thing as the line above
	// var matchedTodo;

	// todos.forEach(function (todo) {
	// 	if (todoId === todo.id) {
	// 		matchedTodo = todo;
	// 	}
	// });

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

//POST /todo - will show back in the terminal data passed via POST
// app.post('/todo', function (req, res){
// 	var body = req.body
// 	console.log('description: ' + body.description);
// 	res.json(body);
// 	});

//POST /todo
app.post('/todo', function (req, res){
	var body = _.pick(req.body, 'description', 'completed');
	// var body = _.pick(req.body, 'description', 'completed');
	
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim();

	//add ID field - set this to ID and add one each time
	body.id = todoNextID++;

	//push body into array
	todos.push(body);
	res.json(body);

	});

	//Delete /todo/:id
app.delete('/todo/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	

	if (!matchedTodo) {
		res.status(404).json({"Not Found" : "object not found"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json({"error": "no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});


app.listen(PORT, function(){
	console.log('Express Listening on port ' + PORT + '!');
});