window.addEventListener('load', function () {
	Init();
}, false);

window.addEventListener('resize', function () {
	Resize();
}, false);

window.addEventListener('click', function (evt) {
	Click(evt);
}, false);

window.addEventListener('scroll', function (evt) {
	Scroll(evt);
}, false);

var container;

var head, content, desc;
var curTop = 0;
var curImg;

var imgIDs = {};

function Init () {
	container = document.getElementById("container");
	head = new Header(0);
	head.init();
	desc = new Description();
	desc.init();
	content = new Content();
	content.init();
	curImg = document.getElementById("image" + curTop);
}

function Resize () {
	content.size();
	desc.size();
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
		this.populate();
		container.appendChild(this.div);
	}
	
	this.populate = function () {
		for (var i = 0, ii = images.length; i < ii; i++) {
			var id = "image" + i;
			var p = this.createIcon(images[i], id);
			imgIDs[id] = i;
			this.div.appendChild(p);
		}
	}
	
	this.createIcon = function (icon, id) {
		var img = document.createElement('img');
		img.src = icon.img;
		img.className = 'thumbimg';
		img.id = id;
		
		var sp = document.createElement('span');
		var pp = document.createElement('p');
		
		var p = document.createElement('p');
		
		pp.appendChild(img);
		sp.appendChild(pp);
		
		p.className = 'thumb';
		p.id = id;
		p.appendChild(sp);
		
		return p;
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
		this.div.style.width = ((document.body.clientWidth / 3) * 2 - 100) + 'px';
	}
	
	this.setImage = function (index) {
		if (images.length > 0) {
			var ch = this.div.childNodes[0];
			this.div.removeChild(ch);
			
			var img = document.createElement('img');
			img.src = images[index].img;
			img.style.maxHeight = this.div.style.height;
			img.style.maxWidth = this.div.style.width;
		
			var sp = document.createElement('span');
			var pp = document.createElement('p');
		
			var p = document.createElement('p');
		
			pp.appendChild(img);
			sp.appendChild(pp);
			
			this.div.appendChild(sp);
			desc.div.innerText = images[index].title;
		}
	}
}

var Description = function () {
	this.div;
	
	this.init = function () {
		this.div = document.getElementById("description");
		this.size();
	}
	
	this.size = function () {
		this.div.style.height = (document.body.clientHeight - 60) + 'px';
		this.div.style.width = ((document.body.clientWidth / 3) - 140) + 'px';
		this.div.style.left = ((document.body.clientWidth / 3) * 2 + 110) + 'px';
	}
}

var changeImg = false;

function Scroll (evt) {
	var elid = document.elementFromPoint(50, 25).id;

	if (elid == "image" + curTop) {
		changeImg = false;
	}
	else if (elid == "image" + (curTop + 1)) {
		curTop++;
		changeImg = true;
	}
	else if (elid == "image" + (curTop - 1)) {
		curTop--;
		changeImg = true;
	}
	else if (elid != "image" + curTop) {
		for (var i = 0, ii = images.length; i < ii; i++) {
			if (elid == "image" + i) {
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
