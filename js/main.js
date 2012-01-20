var head, content, desc;
var curTop = 0;
var images = [];
var imgIDs = {};
var thumbshigh = 0; // How many thumbnails high the window allows
var visible = []; //9,10,11,12,13,14,15]; // Thumbs that are available in the header window.
var stripheight = 0;
var headerHeight = 0;
var activeHeader = 0;

function Init() {
	$(window).resize(Resize);
	$(window).scroll(Scroll);
	$(window).click(Click);
	
	head = new Header(activeHeader);
	content = new Content();
	
	LoadImageData();
	
	// Page height-related stuffs... TODO explain more
	headerHeight = $(window).height() + stripheight;
	// thumbshigh = $(window).height() + stripheight; //  - thumbsize + 10
	
	head.init();
	content.init();
	
	Edit();
}

function Resize () {
	content.size();
	headerHeight = $(window).height() + stripheight;
	$('#' + head.div).css('height', headerHeight + 'px');
}

function Click (evt) {
	if (evt.target.className == 'thumb' || evt.target.className == 'thumbimg') {
		console.log(imgIDs[evt.target.id]);
		content.setImage(imgIDs[evt.target.id]);
		document.location.href = '#' + evt.target.id;
	}
}

var Header = function (num) {
	this.div = 'header';
	
	this.init = function () {
		$('#header').css('height', headerHeight);
		
		// Populate full header with thumbs.
		// this.fill();
		
	/*	for (var i = 0, ii = thumbshigh; i < ii; i++) {
			visible.push(i);
			head.addimg(i);
		}	*/
	}
	
	this.lastcat = '';
	
/*	this.fill = function () {
		for (var i = 0, ii = images.length; i < ii; i++) {
			// Add category when appropriate.
			var curcat = images[i].cat;
			if (head.lastcat != curcat) {
				head.addcat(curcat, i);
				head.lastcat = curcat;
			}
			
			// Create each thumb element.
			var p = $('<p>').attr('id', 'thumb_' + i).addClass('thumb');
			
			// Use this shadow technique: http://webdesignerwall.com/tutorials/css3-rounded-image-with-jquery
			p.css('height', thumbsize);
			p.css('width', thumbsize);
			p.css('background-image', 'url("images/' + images[i].path + '")'); // thumbs TODO
			p.css('background-repeat', 'no-repeat');
			p.css('background-attachment', 'center');
			p.css('background-position', 'center');
			p.css('border-radius', '10px');
			p.css('box-shadow', 'inset 0 2px 5px rgba(0, 0, 0, .5), 0 2px 0 rgba(63, 63, 63, .9), 0 -1px 0 rgba(0, 0, 0, .6)');
			
			$('#' + this.div).append(p);
			
		//	head.addimg(i);
			
			// Add to the imgIDs dictionary.
			imgIDs["thumb_" + i] = i;
		}
	}	*/
	
	this.addimg = function (idnum) {
		var img = $('<img>').attr('id', "thumb_" + idnum);
		img.attr('src', path + images[idnum].path);
		img.addClass('thumbimg');
		$('#thumb_' + idnum).append(img);
		
		// console.log(idnum + ' added');
	}
	
	this.addcat = function (catname, i) {
		var div = $('<div>').attr('id', catname);
		div.text(catname.replace('_', ' '));
		div.addClass('thumbcat');
		
		// Makes it so when a category button is clicked, the content image is changed to the first image in the category.
		$('a[href$="#' + catname + '"]').click(function() {(content.setImage(i));});
		
		$('#' + this.div).append(div);
		
		// console.log(catname);
	}
	/*
	this.removeimg = function (idnum) {
		var id = "thumb_" + idnum;
		var par = document.getElementById(id).parentNode;
		par.removeChild(par.firstChild);
		console.log(idnum + " removed");
	}	*/
}

var Content = function () {
	this.img;
	
	this.init = function () {
		this.size();
		this.setImage(0);
	}
	
	this.size = function () {
		$('#content').css('height', ($(window).height() - 60));
		$('#content').css('width', ($(window).width() - 120));
	//	Couldn't get this to vertically-center the image. Not sure if that's desired, anyway.
	//	$('#content img').css('margin-top', -Math.floor(($(window).height() - 30) / 2));
	//	$('#content img').css('top', '50%'); 
		$('#content img').css('max-height', $('#content').height());
		$('#content img').css('max-width', $('#content').width());
		
		$('#selector').css('width', $('#content').width());
	}
	
	this.lastSelectorCat = '';
	this.lastThumbIndex = 0;
	
	this.setImage = function (index) {
		if (images.length > 0) {
			$('#content > img').fadeOut('fast', function () {
				$(this).remove()
				
				var img = $('<img>');
				img.attr('src', path + images[index].path);
				img.attr('title', images[index].title);
				
				img.css('max-height', $('#content').height());
				img.css('max-width', $('#content').width());
				
				$('#content').append(img);
				
				// Set title to that image name.
				$('#title').text(images[index].title);
				
				// Set category button highlight if necessary.
				var cat = images[index].cat;
				
				if (cat != head.lastSelectorCat) {
					$('a[href$="#' + cat + '"]').addClass('selOn');
					$('a[href$="#' + head.lastSelectorCat + '"]').removeClass('selOn');
					head.lastSelectorCat = cat;
				}
				
				// Highlight thumbnail.
				$('#thumb_' + index).addClass('thumbOn');
				$('#thumb_' + head.lastThumbIndex).removeClass('thumbOn');
				head.lastThumbIndex = index;
			});
		}
	}
}

var changeImg = false;

function Scroll () {
	// Use jQuery viewport script to determine which thumb is in the viewport.
	var top = $(":in-viewport.thumb").attr('id');
	
	if (top) {
		var topThumb = parseInt(top.substr(6));
		// Image still at top
		if (topThumb == curTop) {
			changeImg = false;
		}
		// User scrolled down
		else if (topThumb == (curTop + 1)) {
			curTop++;
			changeImg = true;
		}
		// User scrolled up
		else if (topThumb == (curTop - 1)) {
			curTop--;
			changeImg = true;
		}
		// User scrolled fast!
		else if (topThumb != curTop) {
			for (var i = 0, ii = images.length; i < ii; i++) {
				if (topThumb == i) {
					curTop = i;
					changeImg = true;
					break;
				}
			}
		}
		
		if (changeImg) {
			content.setImage(curTop);
			changeImg = false;
		}
	}
}
/*
var minimg = 0;
var maximg = 0;
var first = 0;
var last = 0;

function updateHeader () {
	var slack = 5;
	minimg = curTop;
	maximg = curTop + thumbshigh - 1;
	first = visible[0];
	last = visible[visible.length - 1];
	var downwards = false;
	var upwards = false;
	
	// Expand header thumb list.
	for(var i = 0, ii = visible.length; i < ii; i++) {
		if (maximg > last) {
			downwards = true;
		}
		if (minimg < first) {
			upwards = true;
		}
	}
	
	// If going down, add images.
	if (downwards) {
		for(var j = last, jj = maximg; j < jj; j++) {
			visible.shift(); // head.removeimg(visible.shift());
			head.addimg(j + 1);
			visible.push(j + 1);
		}
		downwards = false;
	}
	
	// If going up... Well, it needs to keep track of this.
	if (upwards) {
		for(var j = first, jj = minimg; j > jj; j--) {
			visible.pop(); // head.removeimg(visible.pop());
			visible.unshift(j - 1);
			head.addimg(j - 1);
		}
		upwards = false;
	}
	
	// Make sure there's something on the bottom.
	// TODO
	
	console.log(visible);
}
*/

var lastcat = '';

function LoadImageData () {
	var index = 0;
	images = [];
	
	stripheight = parseInt($('#thumbshigh').text());
	
	// For every category div in #data...
	$('#data div').each(function() {
		// get its category name...
		var cat = $('> span', this).text();
		
		// Add category to selector and head, when necessary.
		if (lastcat != cat) {
			head.addcat(cat, index);
			
			var catsel = $('<a>');
			catsel.attr('href', '#' + cat);
			catsel.text(cat.replace(' ','_'));
			$('#selector').append(catsel);
			
			lastcat = cat;
		}
		
		// for every cat, push the rest of the information held in each span.
		$('> p' , this).each(function () {
			var path = $('.file', this).text();
			var title = $('.title', this).text();
			imgIDs["thumb_" + index] = index;
			images.push({cat: cat, path: path, title: title, info: "blaarbl"});
			index++;
		});
	});
	
	Resize();
}
