'use strict';

// This is strictly for heroku purposes

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
//this is an object {variable through exports known as PORT} *locally
const { PORT } = require('./config');
const notesRouter = require('./router/notes.router');
const morgan = require('morgan');
//const notesRouter = require('./router/notes.router');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));
//from mentor session ==> app.use(morgan('combined'));

app.use('/api/notes', notesRouter);

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

if (require.main === module) {
	app
		.listen(PORT, function() {
			console.info(`Server listening on ${this.address().port}`);
		})
		.on('error', err => {
			console.error(err);
		});
}

module.exports = app;
