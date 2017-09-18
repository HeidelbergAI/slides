
(function(elements) {

	var _PREVIEW = null;


	if (elements.length > 0) {

		for (var e = 0, el = elements.length; e < el; e++) {

			(function(element, code) {

				code = code.split('\n').filter(function(line) {

					var tmp = line.trim();
					if (tmp.match(/html|DOCTYPE/g)) {
						return false;
					}

					return true;

				}).join('\n');


				element.onclick = function() {

					if (_PREVIEW === null) {
						_PREVIEW = window.open('/source/preview.html', 'Code Preview', '');
					} else if (_PREVIEW.closed === true) {
						_PREVIEW = window.open('/source/preview.html', 'Code Preview', '');
					}


					_PREVIEW.document.head.innerHTML = '';
					_PREVIEW.document.body.innerHTML = '';
					_PREVIEW.document.write(code);

				};

			})(elements[e], elements[e].innerText);

		}

	}

})([].slice.call(document.querySelectorAll('pre code')));

