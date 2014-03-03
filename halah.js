// Halah. WIP.
// reusable graphs for XY data.

// API amends
// Set new X or Y by array or index.
// this.set('x', [1,2,3]);
// this.set('x', 0, 5); -> [5,2,3];
// this.setX([]), this.setY(0, 5) - easier? ye.

// Chart types still needed: line, scatter, pie, area.

// Features still needed: axis labelling, better base styles, negative values.

var renderOptions = {
	'bar' : function(container) {
		var currentData = this.graph.get()['y'];
		var width = container.offsetWidth / this.graph.x.length;
		var height = container.offsetHeight;

		var x = d3.scale.linear().domain([0, 1]).range([0, width]);
		var y = d3.scale.linear().domain([0, d3.max(currentData)]).rangeRound([0, height]);

		// Define chartEl and set size.
		this.chartEl = this.chartEl || d3.select(container).append("svg");
		this.chartEl
			.attr("width", width * this.graph.x.length - 1)
			.attr("height", height);

		// Define bars.
		this.chartEl.selectAll('rect')
			.data(currentData)
			.enter().append('rect');

		this.chartEl.selectAll('rect')
			.data(currentData)
				.attr("x", function(d, i) { return x(i); })
				.attr("y", function(d) { return height - y(d); })
				.attr("width", width)
				.attr("height", function(d) { return y(d); });
	},
	'line' : function(container) {

	},
	'scatter' : function(container) {
		var currentData = this.graph.get()['y'];
		var width = container.offsetWidth / this.graph.x.length;
		var height = container.offsetHeight;

		var x = d3.scale.linear().domain([0, 1]).range([0, width]);
		var y = d3.scale.linear().domain([0, d3.max(currentData)]).rangeRound([0, height]);

		this.chartEl = this.chartEl || d3.select(container).append("svg");
		this.chartEl
			.attr("width", width * this.graph.x.length - 1)
			.attr("height", height);

		this.chartEl.selectAll('circle')
			.data(currentData)
			.enter().append('circle');

		this.chartEl.selectAll('circle')
			.data(currentData)
				.attr("cx", function(d, i) { return x(i); })
				.attr("cy", function(d) { return height - y(d); })
				.attr('r', 5)
				.attr("height", function(d) { return y(d); });
	},
	'pie': function(container) {

	}
};

var Graph = function(data) {
	this.dep = new Dependency();
	this.x = data.x;
	this.y = data.y;
};

var View = function(graph, el, type) {
	this.el = el;
	this.graph = graph;
	this.type = type;
	this.chartEl;
};

var _zipObject = function(keys, values) {
	var result = {};
	for (var i = 0; i < keys.length; i++) {
		result[keys[i]] = values[i];
	}
	return result;
};

View.prototype._render = function() {
	renderOptions[this.type].call(this, this.el);
};

View.prototype._init = function() {
	autorun(this._render.bind(this));
};

Graph.prototype.init = function(el, type) {
	var v = new View(this, el, type);
	v._init();
	return v;
};

Graph.prototype.JSON = function() {
	return JSON.stringify(_zipObject(this.x, this.y));
};

Graph.prototype._set = function(k, v) {
	this[k] = v;
	this.dep.changed();
};

Graph.prototype._setIndex = function(type, i, v) {
	this[type][i] = v;
	this.dep.changed();
};

Graph.prototype.setX = function(v, o) {
	if (Array.isArray(v)) {
		this._set('x', v);
	}
	else {
		this._setIndex('x', v, o);
	}
};

Graph.prototype.setY = function(v, o) {
	if (Array.isArray(v)) {
		this._set('y', v);
	}
	else {
		this._setIndex('y', v, o);
	}
};

Graph.prototype.get = function() {
	this.dep.depend();
	return this;
};
