// ls -p > img.html
// dir /B > img.html
var head, content, desc;
var curTop = 0;
var curImg;
var images = [];
var imgIDs = {};
var thumbheight = 170;
var thumbshigh = 0; // How many thumbnails high the window allows
var visible = []; //9,10,11,12,13,14,15]; // Thumbs that are available in the header window.
var thumbshigh = 0;

/*function Init () {
//	$(window).resize(Resize);
//	$(window).scroll(Scroll);
//	$(window).click(Click);
//	makeXHR("GET", filename, null, LoadImages);
	
	Init2();
}*/

function Init() {
	LoadImages();
	thumbshigh = Math.ceil((window.innerHeight - 10) / thumbheight);
	head = new Header(0);
	head.init();
	content = new Content();
	content.init();
	curImg = document.getElementById("image" + curTop);
}

function Resize () {
	content.size();
	thumbshigh = Math.ceil((window.innerHeight - 10) / thumbheight);
}

function Click (evt) {
	if (evt.target.className == 'thumb' || evt.target.className == 'thumbimg') {
		console.log(imgIDs[evt.target.id]);
		content.setImage(imgIDs[evt.target.id]);
	}
}

var Header = function (num) {
	this.div = 'head_' + num;
	
	this.icons = [
		
	];
	
	this.init = function () {
		var d = $('<div>');
		d.attr('id', this.div);
		d.addClass('header');
		$('#container').prepend(d);
		this.fill();
		
		for (var i = 0, ii = thumbshigh; i < ii; i++) {
			visible.push(i);
			head.addimg(i);
		}
	}
	/*
	this.createthumb = function (idnum) {
		var sp = $('span');
		var pp = $('p');
		var p = $('p');
		
		pp.attr('id', 'imagep' + idnum);
		sp.append(pp);
		
		p.addClass('thumb');
		p.attr('id', 'thumb' + idnum);
		p.append(sp);
		
		$(this.div).append(p);
	}*/
	
	this.fill = function () {
		for (var i = 0, ii = images.length; i < ii; i++) {
			// Create each thumb element.
		//	this.createthumb(i);
			var p = $('<p>').attr('id', 'thumb_' + i).addClass('thumb');
			$("#" + this.div).append(p);
			
			// Add to the imgIDs dictionary.
			imgIDs["image" + i] = i;
		}
	}
	
	this.addimg = function (idnum) {
		var img = document.createElement('img');
		img.src = path + images[idnum].path;
		img.className = 'thumbimg';
		img.id = "image" + idnum;
		$("imagep" + idnum).append(img);
	}
	
	this.removeimg = function (idnum) {
		var id = "image" + idnum;
		var par = document.getElementById(id).parentNode;
		par.removeChild(par.firstChild);
	}
}

var Content = function () {
	this.div;
	this.img;
	
	this.init = function () {
		this.div = $("content");
		this.size();
	//	this.setImage(0);
	}
	
	this.size = function () {
		this.div.css('height', $(window).height() - 30) + 'px';
		this.div.css('width', $(window).width() - 200) + 'px';
	}
	
	this.setImage = function (index) {
		if (images.length > 0) {
			var ch = this.div.childNodes[0];
			this.div.removeChild(ch);
			
			var img = document.createElement('img');
			img.src = path + images[index].path;
			img.style.maxHeight = this.div.style.height;
			img.style.maxWidth = this.div.style.width;
			img.title = images[index].title;
		
			var sp = document.createElement('span');
			var pp = document.createElement('p');
		
			var p = document.createElement('p');
		
			pp.appendChild(img);
			sp.appendChild(pp);
			
			this.div.appendChild(sp);
		}
	}
}

var changeImg = false;

function Scroll (evt) {
	// Used to make iOS work. (No position: fixed!!!)
	var mobileOffset = 0;
	if (DetectIos()) {
		mobileOffset = window.pageYOffset;
		content.div.style.top = (window.pageYOffset + 25) + 'px';
	}
	
	var elid = document.elementFromPoint(50, mobileOffset + 25).id;
	// Image still at top
	if (elid == "image" + curTop || elid == "thumb" + curTop) {
		changeImg = false;
	}
	// User scrolled down
	else if (elid == "image" + (curTop + 1) || elid == "thumb" + (curTop + 1)) {
		curTop++;
		changeImg = true;
	}
	// User scrolled up
	else if (elid == "image" + (curTop - 1) || elid == "thumb" + (curTop - 1)) {
		curTop--;
		changeImg = true;
	}
	// User scrolled fast!
	else if (elid != "image" + curTop || elid != "thumb" + curTop) {
		for (var i = 0, ii = images.length; i < ii; i++) {
			if (elid == "image" + i || elid == "thumb" + i) {
				curTop = i;
				changeImg = true;
				break;
			}
		}
	}
	
	if (changeImg) {
		content.setImage(curTop);
		updateHeader();
		changeImg = false;
	}
}

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
	
	for(var i = 0, ii = visible.length; i < ii; i++) {
		if (maximg > last) {
			downwards = true;
		}
		if (minimg < first) {
			upwards = true;
		}
	}
	
	if (downwards) {
		for(var j = last, jj = maximg; j < jj; j++) {
			head.removeimg(visible.shift());
			head.addimg(j + 1);
			visible.push(j + 1);
		}
		downwards = false;
	}
	
	if (upwards) {
		for(var j = first, jj = minimg; j > jj; j--) {
			head.removeimg(visible.pop());
			visible.unshift(j - 1);
			head.addimg(j - 1);
		}
		upwards = false;
	}
	
	console.log(visible);
}

function LoadImages () {
	// For every category div in #data...
	$('#data div').each(function() {
		// get its category name...
		var cat = $('> span', this).text();
		// for every cat, push the rest of the information held in each span.
		$('> p' , this).each(function () {
			var path = cat + '/' + $(this).text();
			var title = $('.title', this).text();
			images.push({cat: cat, path: path, title: title, info: "blaarbl"});
		});
	});
}
