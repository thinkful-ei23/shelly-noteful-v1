/* global $ noteful api store */
'use strict';

$(document).ready(function () {
	noteful.bindEventListeners();

	api.search(store.currentSearchTerm)
		.then(searchResponse => {
			store.notes = searchResponse;
			noteful.render();
		});

});