var offline = true;
var curselect = '';
var offFiles = [];
var highQuality = false;

function Edit () {
	// Generate thumbs.
	$('#generate').click(processFiles);
	
	// Generate button effects.
	$('#generate').hover(
		function () {
			$(this).css('background-color', 'orange');
		},
		function () {
			$(this).css('background-color', '#666');
		}
	);
	
	// Toggle Offline Mode from checkbox.
	$('#seloff').click(function () {
		if (offline) {
			offline = false;
			$('#editor').css('display', 'none');
		}
		else
			offline = true;
	});
	
	// Toggle Offline Mode from text.
	$('#seloffsp').click(function () {
		if (offline) {
			offline = false;
			$('#seloff').attr('checked', false);
			$('#editor').css('display', 'none');
		}
		else {
			offline = true;
			$('#seloff').attr('checked', true);
		}
	});
	
	// Category renaming.
	$('.thumbcat').click(function () {
		$('#selname').attr('value', $(this).text());
		$('#seldel').attr('value', 'Remove ' + $(this).text());
		$('#' + $(this).text()).css('border', '1px solid orange');
		curselect = $(this).text().replace(' ', '_');
	});
	
	$('#selname').keypress(function(evt) {
		if (evt.keyCode == 13) {
			// Prevent enter key from submitting.
			evt.preventDefault();
			
			var input = $(this).attr('value');
			
			$('#' + curselect).css('border', 'none');
			
			// Found element with id.
			if ($('#' + input.replace(' ','_')).length != 0) {
				alert('Name, "' + input + '" already used. Nothing changed.');
			}
			// Didn't find element with id.
			else {
				$('#' + curselect).text(input).attr('id', input.replace(' ', '_'));
			//	$('#' + $(this).attr('value').replace(' ','_'));
			}
			
			$('#seldel').attr('value', 'Remove none');
			$(this).attr('value', 'none');
			
			curselect = 'none';
		}
	});
	
	$(window).keypress(function(evt) {
		if (evt.keyCode === 96 && !offline) {
			offline = true;
			$('#seloff').attr('checked', true);
			$('#editor').css('display', 'block');
		}
	});
}

var total = 0;
var processing = false;

function processFiles () {
	if (!processing) {
		var files = document.getElementById('fileinput').files;
		
		if (offline) {
			for (var f in files) {
				offFiles.push(files[f]);
			}
		}
		
		processing = true;
		toggleGenerate(0);
		setTimeout(resizeFile, 0, files, 0);
	}
}

// Clear file values when appropriate, and changes the status div when necessary.
function toggleGenerate (index) {
	if (processing) {
		$('#generate').text('Generating thumbnails...');
		$('#status').text(index + ' out of ' + document.getElementById('fileinput').files.length);
	}
	else {
		$('#generate').text('Generate more thumbs.');
		$('#status').text('Complete!');
	//	$('#fileinput').each(function() {this.form.reset();})
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
				var thumber, thumbdata;
				if (highQuality) {
					thumber = new thumbnailer(canvas, this, thumbsize, 3, function () {
						thumbdata = canvas.toDataURL();
						
						total += thumbdata.length;
						console.log(index);
						index++;
						toggleGenerate(index);
						
						addThumb(thumbdata, thumber.dest.height, theFile.fileName);
						
						setTimeout(resizeFile, 0, files, index);
					});
				}
				else {
					canvas.width = thumbsize;
					canvas.height = Math.round(this.height * thumbsize / this.width);
					var ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					thumbdata = canvas.toDataURL('image/jpeg');
					
					total += thumbdata.length;
					console.log(index);
					index++;
					toggleGenerate(index);
					
					addThumb(thumbdata, canvas.height, theFile.fileName);
					
					setTimeout(resizeFile, 0, files, index);
				}
					
					/*	var thumbimg = new Image();
						thumbimg.src = canvas.toDataURL();
						thumbimg.onload = function () {
						//	$('#filelist').append(thumbimg);
							
						}*/
		//	});			///////
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
		}
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

function addThumb (imgdata, height, path) {
/*	var curcat = images[i].cat;
	if (head.lastcat != curcat) {
		head.addcat(curcat, i);
		head.lastcat = curcat;
	}	*/
	
	var index = parseInt($('#imgnum').text());
	
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
	
	p.attr('id', 'data_' + index);
	
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
	
	AddClick();
	LoadImageData();
	
	content.setImage(index);
}
