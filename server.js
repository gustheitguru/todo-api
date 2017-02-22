var express = require('express');
var bodyParser = require('body-parser');
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
	var matchedTodo;

	todos.forEach(function (todo) {
		if (todoId === todo.id) {
			matchedTodo = todo;
		}
	});

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
	var body = req.body
	//add ID field - set this to ID and add one each time
	body.id = todoNextID++;

	//push body into array
	todos.push(body);
	res.json(body);
		
	});


app.listen(PORT, function(){
	console.log('Express Listening on port ' + PORT + '!');
});