function Edit () {
	
}

var size = 150;

function processFiles (evt) {
	var files = evt.target.files;
	var path = '';
	
	for (var f in files) {
		if (path = files[f].fileName) {
			var img = new Image();
			img.src = 'images/' + path;
			img.name = path;
			img.onload = function (path) {
				var p = $('<p>');
				var sp = $('<span>')
				sp.attr('width', this.width);
				sp.attr('height', this.height);
				sp.addClass('file');
				sp.text(this.name);
				p.append(sp);
				$('#data').append(p);
			}
		}
	}
}
