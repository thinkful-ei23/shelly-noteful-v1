const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function() {
	it('true should be true', function() {
		expect(true).to.be.true;
	});
	it('2 + 2 should equal 4', function() {
		expect(2 + 2).to.equal(4);
	});
});

describe('Express static', function() {
	it('GET request "/" should return the index page', function() {
		return chai
			.request(app)
			.get('/')
			.then(function(res) {
				expect(res).to.exist;
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});

describe('404 handler', function() {
	it('should respond with 404 when given a bad path', function() {
		return chai
			.request(app)
			.get('/DOES/NOT/EXIST')
			.then(res => {
				expect(res).to.have.status(404);
			});
	});
});

describe('GET/api/notes', function() {
	it('should return the default of 10 Notes as an array', function() {
		return chai
			.request(app)
			.get('/api/notes')
			.then(res => {
				expect(res.body)
					.to.be.an('array')
					.to.have.lengthOf(10);
				//console.info(res.body);
				//expect(res.body).to.have.an('object');
			});
	});

	it('should return an array of objects with the id, title, and content', function() {
		return chai
			.request(app)
			.get('/api/notes')
			.then(res => {
				res.body.forEach(note => {
					expect(note).has.keys('id', 'title', 'content');
				});
			});
	});

	it('should return correct search results for a valid query', function() {
		return chai
			.request(app)
			.get('/api/notes?searchTerm=about%20cats')
			.then(res => {
				res.body.forEach(note => {
					expect(note.title).to.include('about cats');
				});
			});
	});
	it('should return an empty array for an incorrect query', function() {
		return chai
			.request(app)
			.get('/api/notes?searchTerm=nooooo%20why%20fail')
			.then(res => {
				expect(res.body).to.have.lengthOf(0);
			});
	});
});

//:id tests
describe('GET/api/notes/:id', function() {
	it('should return correct note object with id, title, and content for given id', function() {
		return chai
			.request(app)
			.get('/api/notes/1006')
			.then(res => {
				expect(res.body)
					.to.be.an('object')
					.has.keys('id', 'title', 'content');
				expect(res.body.id).to.equal(1006);
			});
	});
	it('should respond with 404 for an invalid id', function() {
		return chai
			.request(app)
			.get('/api/notes/DOESNOTEXIST')
			.then(res => {
				expect(res).to.have.status(404);
			});
	});
});

//post tests
describe('POST/api/notes', function() {
	it('should create and return a new item with location header when provided valid data', function() {
		const newItem = {
			title: 'lalalalala',
			content: 'pupupupu'
		};
		return chai
			.request(app)
			.post('/api/notes')
			.send(newItem)
			.then(res => {
				expect(res.body).to.have.status(201);
				expect(res.body.title).to.equal(newItem.title);
				expect(res).to.have.header('location');
			});
	});
});
