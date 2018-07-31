'use strict';

// Load array of notes

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const { PORT } = require('./config');
//const morgan = require('morgan');
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);
const app = express();

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
	const sTerm = req.query.searchTerm
	if (!sTerm) {
		res.json(data);
	} else{
		res.json(data.filter(item => item.title.includes(sTerm)));
	}	
});

app.get('/api/notes/:id', (req, res) => {
	res.json(data.find(item => item.id === Number(req.params.id)));
});

app.get('/boom', (req, res, next) => {
	throw new Error('Boom!!');
});

app.use(function (req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
});

app.listen(PORT, function() {
	console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
	console.error(err);
});