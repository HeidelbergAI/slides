
module.exports = (function(global) {

	/*
	 * HELPERS
	 */

	const _encode_entities = function(value) {

		let text = value;

		text = text.split('"').join('&quot;');
		text = text.split('<').join('&lt;');
		text = text.split('>').join('&gt;');

		return text;

	};

	const _encode_inline = function(entities) {

		let text = '';

		entities.forEach(entity => {

			if (entity.token === 'Code') {

				text += ' <code>' + _encode_entities(entity.value) + '</code> ';

			} else if (entity.token === 'Text') {

				if (entity.value.match(/\.|,|\?|!/g)) {

					text += entity.value;

				} else {

					if (entity.type === 'bold') {
						text += ' <b>' + entity.value + '</b> ';
					} else if (entity.type === 'italic') {
						text += ' <i>'  + entity.value + '</i> ';
					} else {
						text += ' ' + entity.value;
					}

				}

			} else if (entity.token === 'Image') {

				text += ' <img src="' + entity.value + '" alt="' + entity.type + '"> ';

			} else if (entity.token === 'Link') {

				text += ' <a href="' + entity.value + '">' + entity.type + '</a> ';

			}

		});

		return text.trim();

	};

	const _encode = function(data) {

		let code         = '';
		let article_open = false;
		let section_open = false;


		data.forEach(entry => {

			if (entry.token === 'Article') {

				if (section_open === true) {
					code += '\t\t</section>\n';
				}

				if (article_open === true) {
					code += '\t</section>\n';
				}

				code += '\t<section>\n';
				article_open = true;
				section_open = false;

			} else if (entry.token === 'Headline') {

				if (section_open === true) {
					code += '\t\t</section>\n';
					section_open = false;
				}


				if (entry.type === 1) {

					code += '\t\t<section>\n';
					code += '\t\t\t<h1>' + entry.value + '</h1>\n';
					code += '\t\t</section>\n';

					section_open = false;

				} else if (entry.type === 2) {

					if (section_open === false) {
						code += '\t\t<section>\n';
						section_open = true;
					}

					code += '\t\t\t<h2>' + entry.value + '</h2>\n';

				}

			} else if (entry.token === 'List') {

				code += '\t\t\t<ul>\n';

				entry.value.forEach(function(item) {
					code += '\t\t\t\t<li>' + _encode_inline(item) + '</li>\n';
				});

				code += '\t\t\t</ul>\n';

			} else if (entry.token === 'Paragraph') {

				code += '\t\t\t<p>\n';
				code += '\t\t\t\t' + _encode_inline(entry.value) + '\n';
				code += '\t\t\t</p>\n';

			} else if (entry.token === 'Code') {

				code += '<pre class="' + entry.type + '">';
				code += '<code>';
				code += _encode_entities(entry.value);
				code += '</code>';
				code += '</pre>\n';

			}

		});


		if (section_open === true) {
			code += '\t\t</section>\n';
		}

		if (article_open === true) {
			code += '\t</section>\n';
		}


		return code;

	};


	return _encode;

})();

