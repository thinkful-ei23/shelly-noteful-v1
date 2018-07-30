'use strict';

// Load array of notes
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const data = require('./db/notes');
const app = express();

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
	res.json(data);
});

app.listen(62020, function() {
	console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
	console.error(err);
});