#!/usr/bin/env node



(function(global) {

	const _create_directory = function(path, mode) {

		if (mode === undefined) {
			mode = 0o777 & (~process.umask());
		}


		let is_directory = false;

		try {

			is_directory = _fs.lstatSync(path).isDirectory();

		} catch (err) {

			if (err.code === 'ENOENT') {

				if (_create_directory(_path.dirname(path), mode) === true) {
					_fs.mkdirSync(path, mode);
				}

				try {
					is_directory = _fs.lstatSync(path).isDirectory();
				} catch (err) {
				}

			}

		}

		return is_directory;

	};



	const _BOOK   = require('fs').readFileSync(__dirname + '/book.html').toString('utf8');
	const _HTML   = require('./html.js');
	const _INDEX  = require('fs').readFileSync(__dirname + '/index.html').toString('utf8');
	const _MD     = require('./markdown.js');
	const _fs     = require('fs');
	const _index  = [];
	const _path   = require('path');

	process.argv[2]
		.split(':')
		.filter(tmp => tmp !== '')
		.forEach(file => {

			let book_in  = _path.resolve(__dirname + '/../../', file);
			let book_out = _path.resolve(__dirname + '/../../book/html/' + file.split('/').pop().replace('.md', '.html'));


			let blob = _MD(_fs.readFileSync(book_in, 'utf8').toString('utf8'));
			if (blob !== null) {

				let statistics = blob.filter(val => /^(Headline|Article)$/g.test(val.token)).length;

				let book_data = _HTML(blob);
				let book_html = './book/html/' + file.split('/').pop().replace('.md', '.html');
				let book_pdf  = './book/pdf/'  + file.split('/').pop().replace('.md', '.pdf');
				let book_name = file.split('/').pop().substr(3).replace('.md', '');

				if (book_data !== null && book_data.length > 0) {

					let tmp = _BOOK;

					tmp = tmp.split('${data}').join(book_data);
					tmp = tmp.split('${name}').join(book_name);

					_create_directory(_path.dirname(book_out));
					_fs.writeFileSync(book_out, tmp, 'utf8');

					_index.push('<li><h3>' + book_name + '</h3><a href="' + book_html + '">html</a>, <a href="' + book_pdf + '">pdf</a></li>');

					console.log('> ' + book_name + ': ' + statistics + ' Slides');

				}

			}

		});


	_fs.writeFileSync(
		__dirname + '/../../index.html',
		_INDEX.split('${index}').join(_index.join('\n\t')),
		'utf8'
	);

})(typeof global !== 'undefined' ? global : this);

