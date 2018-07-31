'use strict';

// Load array of notes

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const { PORT } = require('./config');
//const morgan = require('morgan');
const data = require('./db/notes');
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


app.listen(PORT, function() {
	console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
	console.error(err);
});