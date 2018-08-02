const express = require('express');
//this is a mini-application inside main application
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.post('/', (req,res,next) => {
	const { title, content } = req.body;
	
	const newItem = { title, content };
	if (!newItem.title) {
		const err = new Error('Missing `title` in request body');
		err.status = 400;
		return next(err);
	}

	notes.create(newItem)
		.then(item => {
			if (item) {
				res.location(`http://${req.headers.host}/notes/${item.id}`).status(201)
			} else {
				next();
			}
		})
		.catch(err => {
			next(err);
		});
});

router.delete('/:id', (req, res, next) => {
	const id = req.params.id;

	notes.delete(id)	
		.then(() => {
			return res.sendStatus(204);
		})
		.catch(err => {
			next(err);
		});
});

router.put('/:id', (req, res, next) => {
	const id = req.params.id;

	/***** Never trust users - validate input *****/
	const updateObj = {};
	const updateFields = ['title', 'content'];

	updateFields.forEach(field => {
		if (field in req.body) {
			updateObj[field] = req.body[field];
		}
	});

	notes.update(id, updateObj)
		.then(item => {
			if (item) {
				res.json(item);
			} else {
				next();
			}
		})
		.catch(err => {
			next(err);
		});
});

router.get('/', (req, res, next) => {
	const {searchTerm} = req.query;
	notes.filter(searchTerm)
		.then(list => {
			if (list) {
				res.json(list);
			} else {
				next();
			}
		})
		.catch(err => {
			next(err);
		}); 
});

router.get('/:id', (req, res, next) => {
	const id = req.params.id;
	notes.find(id)
		.then(item => {
			if (item) {
				res.json(item);
			} else {
				next();
			}
		})
		.catch(err => {
			next(err);
		});
});

router.use(function (req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	res.status(404).json({ message: 'Not Found' });
});

router.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
});

module.exports = router;