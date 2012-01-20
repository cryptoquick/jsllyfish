function Edit () {
	$('#generate').click(processFiles);
	$('#generate').hover(
		function () {
			$(this).css('background-color', 'orange');
		},
		function () {
			$(this).css('background-color', '#666');
		}
	);
}

var total = 0;
var processing = false;

function processFiles () {
	if (!processing) {
		var files = document.getElementById('fileinput').files;
		processing = true;
		toggleGenerate(0);
		setTimeout(resizeFile, 0, files, 0);
	}
}

function toggleGenerate (index) {
	if (processing) {
		$('#generate').text('Generating thumbnails...');
		$('#status').text(index + ' out of ' + document.getElementById('fileinput').files.length);
	}
	else {
		$('#generate').text('Generate more thumbs.');
		$('#status').text('Complete!');
	}
}

var curpath = '';

function resizeFile (files, index) {
	var reader = new FileReader();
	
	// Break when done.
	if (index >= files.length) {
		console.log(total);
		processing = false;
		toggleGenerate(0);
		return;
	}
	
	var f = files[index];
	
	// Skip non-image files.
	if (!f.type.match('image.*')) {
		index++;
		setTimeout(resizeFile, 0, files, index);
	}
	
	// Closure to capture the file information. \\^__^// http://www.html5rocks.com/en/tutorials/file/dndfiles/
	reader.onload = (function(theFile) {
		return function(e) {
			// Render thumbnail.
			img = new Image();
			img.onload = function () {
				var canvas = document.createElement("canvas");
				var thumber = new thumbnailer(canvas, this, thumbsize, 5, function () {
				var thumbdata = canvas.toDataURL();
				addThumb(thumbdata, index, thumber.dest.height, theFile.fileName);
				/*	var thumbimg = new Image();
					thumbimg.src = canvas.toDataURL();
					thumbimg.onload = function () {
					//	$('#filelist').append(thumbimg);
						
					}*/
				total += thumbdata.length;
				console.log(index);
				index++;
				toggleGenerate(index);
				setTimeout(resizeFile, 0, files, index);
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

var tempThumbsHigh = 0;

function addThumb (imgdata, index, height, path) {
/*	var curcat = images[i].cat;
	if (head.lastcat != curcat) {
		head.addcat(curcat, i);
		head.lastcat = curcat;
	}	*/
	
	// Create each thumb element.
	var p = $('<p>').attr('id', 'thumb_' + index).addClass('thumb');
	
	// Use this shadow technique: http://webdesignerwall.com/tutorials/css3-rounded-image-with-jquery
	p.css('height', height);
	p.css('width', thumbsize);
	p.css('background-image', 'url("' + imgdata + '")');
	p.css('background-repeat', 'no-repeat');
	p.css('background-attachment', 'center');
	p.css('background-position', 'center');
	p.css('border-radius', '10px');
	p.css('box-shadow', 'inset 0 2px 5px rgba(0, 0, 0, .5), 0 2px 0 rgba(63, 63, 63, .9), 0 -1px 0 rgba(0, 0, 0, .6)');
	
	$('#' + head.div).append(p);
	
	// Create image data.
	var p = $('<p>');
	var ti = $('<span>');
	var fi = $('<span>');
	
	ti.addClass('title');
	ti.text(path);
	
	fi.addClass('file');
	fi.text(path);
	
	p.append(ti);
	p.append(fi);
	
	$('#uncategorized').append(p);
	
	// For thumbstrip height.
	tempThumbsHigh += height + 10;
	console.log(tempThumbsHigh);
	$('#imgnum').text(index + 1);
	$('#thumbshigh').text(tempThumbsHigh);
	
	LoadImageData();
}
