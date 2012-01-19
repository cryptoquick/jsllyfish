function Edit () {
	
}

var size = 100;
var total = 0;

function processFiles (evt) {
	var files = evt.target.files;
	/*
	for (var i = 0, f; f = files[i]; i++) {
	//	console.log(f);
		var img = new Image();
		
		// Skip non-image files.
		if (!f.type.match('image.*')) {
			continue;
		}*/
		
		
	setTimeout(resizeFile, 0, files, 0);
//	}
}

function resizeFile (files, index) {
	var reader = new FileReader();
	
	if (index >= files.length) {
		return;
	}
	
	var f = files[index];
	
	// Skip non-image files.
	if (!f.type.match('image.*')) {
		return;
	}
	
	// Closure to capture the file information. \\^__^// http://www.html5rocks.com/en/tutorials/file/dndfiles/
	reader.onload = (function(theFile) {
		return function(e) {
			// Render thumbnail.
		//	spimg.attr('title', theFile.name);
		/*	spimg.ready(function () {
				var canvas = document.createElement("canvas");
				new thumbnailer(canvas, this, size, 8);
				
				console.log(this);
				console.log(canvas.toDataURL().length);
			});	*/
			img = new Image();
			img.onload = function () {
			//	var sp = $('<span>');
				var canvas = document.createElement("canvas");
			//	$(this).attr('onload', function () {
				//	console.log(this);
				var thumber = new thumbnailer(canvas, this, 100, 5, function () {
					
					var thumbimg = new Image();
					thumbimg.src = canvas.toDataURL();
					thumbimg.onload = function () {
						$('#filelist').append(thumbimg);
						total += thumbimg.src.length;
						console.log(index);
						setTimeout(resizeFile, 0, files, index += 1);
					}
				});
			//	console.log(thumber.src);
			//	this.src = thumber.src;
				
			//	var thumbimg = new Image();
			//	thumbimg.src = canvas.toDataURL();
			//	console.log(thumber.src);
			//	thumbimg.onload = function () { $('#filelist').append(thumbimg); };
				
			/*	thumbimg.onload = function () {
					$('#filelist').append(this);
				}	*/
				//	console.log(thumbimg.img.src.length);
			//	});
			};
		//	spimg.setAttribute('src', e.target.result);
			img.src = e.target.result;
		//	$('#filelist').append(spimg);
			
		//	sp.append(spimg);
		//	console.log(sp);
		};
	})(f);
	
	reader.readAsDataURL(f);
/*	img.src = 'images/' + f.fileName;
	img.name = f.fileName;
	img.onload = function (f.fileName) {
		var p = $('<p>');
		var sp = $('<span>')
		sp.attr('width', this.width);
		sp.attr('height', this.height);
		sp.addClass('file');
		sp.text(this.name);
		p.append(sp);
		$('#data').append(p);
	}	*/
}
