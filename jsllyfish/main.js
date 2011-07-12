window.addEventListener('load', function () {
	Init();
}, false);

if( window.addEventListener ) {
	window.addEventListener('resize', Resize, false);
} else if( document.addEventListener ) {
	document.addEventListener('resize', Resize, false);
}

window.addEventListener('click', function (evt) {
	Click(evt);
}, false);

if( window.addEventListener ) {
	window.addEventListener('scroll', Scroll, false);
} else if( document.addEventListener ) {
	document.addEventListener('scroll', Scroll, false);
}

var container;

// ls -p > img.html
// dir /B > img.html
var filename = "img.html";
var path = "images/"
var head, content, desc;
var curTop = 0;
var curImg;
var images = [];
var imgIDs = {};
var thumbheight = 170;
var thumbshigh = 0; // How many thumbnails high the window allows
var visible = []; //9,10,11,12,13,14,15]; // Thumbs that are available in the header window.
var thumbshigh = 0;

function Init () {
	container = document.getElementById("container");
	makeXHR("GET", filename, null, LoadImages);
}

function Init2() {
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
	this.num = num;
	this.div;
	
	this.icons = [
		
	];
	
	this.init = function () {
		this.div = document.createElement("div");
		this.div.id = "header" + num;
		this.div.className = "header";
	//	this.populate();
		this.fill();
		container.appendChild(this.div);
		
		for (var i = 0, ii = thumbshigh; i < ii; i++) {
			visible.push(i);
			head.addimg(i);
		}
	}
	
	this.createthumb = function (idnum) {
		var sp = document.createElement('span');
		var pp = document.createElement('p');
		var p = document.createElement('p');
		
		pp.id = 'imagep' + idnum;
		sp.appendChild(pp);
		
		p.className = 'thumb';
		p.id = 'thumb' + idnum;
		p.appendChild(sp);
		
		this.div.appendChild(p);
	}
	
	this.fill = function () {
		for (var i = 0, ii = images.length; i < ii; i++) {
			this.createthumb(i);
			imgIDs["image" + i] = i;
		}
	}
	
	this.addimg = function (idnum) {
		var img = document.createElement('img');
		img.src = images[idnum].img;
		img.className = 'thumbimg';
		img.id = "image" + idnum;
		document.getElementById("imagep" + idnum).appendChild(img);
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
		this.div = document.getElementById("content");
		this.size();
		this.setImage(0);
	}
	
	this.size = function () {
		this.div.style.height = (document.body.clientHeight - 30) + 'px';
		this.div.style.width = ((document.body.clientWidth) - 200) + 'px';
	}
	
	this.setImage = function (index) {
		if (images.length > 0) {
			var ch = this.div.childNodes[0];
			this.div.removeChild(ch);
			
			var img = document.createElement('img');
			img.src = images[index].img;
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

function LoadImages (data) {
	var output = data.split("\n");
	for (var i = 0, ii = output.length; i < ii; i++) {
		if (output[i].substr(-1,1) != "/" && output[i] != "") {
			images.push({img: path + output[i], title: output[i]});
		}
	}
	
	Init2();
}
