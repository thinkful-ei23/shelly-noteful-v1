'use strict';

// Load array of notes

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
//this is an object {variable through exports known as PORT} *locally
const { PORT } = require('./config');
const morgan = require('morgan');
//const notesRouter = require('./router/notes.router');
const app = express();
const router = require('./router/notes.router.js');

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));
//from mentor session ==> app.use(morgan('combined'));

app.use(router);
//app.use('/api', notesRouter);

app.listen(PORT, function() {
	console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
	console.error(err);
});