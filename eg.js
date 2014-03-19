(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var halah = require('./halah');
// Some y values.
var getData = function() {
  return [0,0,0,0,0,0,0].map(function() {
    return Math.floor(Math.random() * 100);
  });
};

// Define a graph model, with X and Y arrays for now.
var model1 = new halah.Graph({
  x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  'Sunday'],
  y: getData()
});

// Define as many views of this model as you wish.
// The graph should automatically fill an empty div.
var view = model1.init(document.querySelector('.graph'), 'bar');
var view2 = model1.init(document.querySelectorAll('.halfGraphs')[0], 'bar');
var view3 = model1.init(document.querySelectorAll('.halfGraphs')[1], 'scatter');

var log = document.querySelector('.log');
log.innerText = model1.JSON();
// It's reactive!
setInterval(function() {
  model1.setY(getData());
  log.innerText = model1.JSON();
}, 1000);
},{"./halah":2}],2:[function(require,module,exports){
// Halah. WIP.
// Chart types still needed: line, scatter, pie, area.r
// Features still needed: axis labelling, better base styles, negative values.

var recompute = require('./recompute');

var renderOptions = {
	'bar' : function(container) {
		var currentData = this.graph.get();
		var yData = currentData['y'];

		var width = container.offsetWidth / this.graph.x.length;
		var height = container.offsetHeight;

		var x = d3.scale.linear().domain([0, 1]).range([0, width]);
		var y = d3.scale.linear().domain([0, d3.max(yData)]).rangeRound([0, height]);

		var xScale = d3.scale.ordinal().domain(this.graph.x).rangePoints([0, container.offsetWidth]);
		var xAxis = d3.svg.axis().scale(xScale).orient('top');

		// Define chartEl and set size.
		this.chartEl = this.chartEl || d3.select(container).append("svg");
		this.chartEl
			.attr("width", width * this.graph.x.length - 1)
			.attr("height", height);

		// Define bars.
		this.chartEl.selectAll('rect')
			.data(yData)
			.enter().append('rect');

		this.chartEl.selectAll('rect')
			.data(yData)
			.exit().remove();

		this.chartEl.selectAll('rect')
			.data(yData)
				.attr("x", function(d, i) { return x(i); })
				.attr("y", function(d) { return height - y(d); })
				.attr("width", width)
				.attr("height", function(d) { return y(d); });

		this.axis = this.axis || this.chartEl.append("g")
			.attr('transform', 'translate(0,'+ (height) +')').call(xAxis);
	},
	'line' : function(container) {},
	'scatter' : function(container) {
		var currentData = this.graph.get()['y'];
		var width = container.offsetWidth / this.graph.x.length;
		var height = container.offsetHeight;

		var x = d3.scale.linear().domain([0, 1]).range([0, width]);
		var y = d3.scale.linear().domain([0, d3.max(currentData)]).rangeRound([0, height]);

		var xScale = d3.scale.ordinal().domain(this.graph.x).rangePoints([0, container.offsetWidth]);
		var xAxis = d3.svg.axis().scale(xScale).orient('top');

		this.chartEl = this.chartEl || d3.select(container).append("svg");
		this.chartEl
			.attr("width", width * this.graph.x.length - 1)
			.attr("height", height);

		this.chartEl.selectAll('circle')
			.data(currentData)
			.enter().append('circle');

		this.chartEl.selectAll('circle')
			.data(currentData)
			.exit().remove();

		this.chartEl.selectAll('circle')
			.data(currentData)
				.attr("cx", function(d, i) { return x(i) + width / 2 - 2.5; })
				.attr("cy", function(d) { return height - y(d); })
				.attr('r', 5)
				.attr("height", function(d) { return y(d); });

		this.axis = this.axis || this.chartEl.append("g")
			.attr('transform', 'translate(0,'+ (height) +')').call(xAxis);
	}
};

var Graph = function(data) {
	this.dep = new recompute.Dependency();
	this.x = data.x;
	this.y = data.y;
};

var View = function(graph, el, type) {
	this.el = el;
	this.graph = graph;
	this.type = type;
	this.chartEl;
	this.axis;
};

var _zipObject = function(keys, values) {
	var result = {};
	keys.forEach(function(e, i) {
		result[e] = values[i];
	});
	return result;
};

View.prototype._render = function() {
	renderOptions[this.type].call(this, this.el);
};

View.prototype._init = function() {
	recompute.autorun(this._render.bind(this));
	return this;
};

Graph.prototype.init = function(el, type) {
	return new View(this, el, type)._init();
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

exports.Graph = Graph;
exports.View = View;


},{"./recompute":3}],3:[function(require,module,exports){
var currentComputation = null;
var nextId = 0;
var toFlush = [];

// Computes all required computations on next tick.
var requireFlush = function() {
	setTimeout(flush, 0);
};

var flush = function() {
	toFlush.forEach(function(fn) {
		fn.compute();
	});
	toFlush = [];
};

var contains = function(array, obj) {
	array.some(function(e) {
		return e === obj;
	});
};

// Keeps reference to a function.
var Computation = function(f) {
	this.id = nextId++;
	this.onInvalidateCallbacks = [];
	this.func = f;
};

// While running the function, ensure that the current computation is this.
// After finished running, remove reference to this computation.
Computation.prototype.compute = function() {
	currentComputation = this;
	this.func();
	currentComputation = null;
};

// Adds to flush list.
Computation.prototype.invalidate = function() {
	if (!contains(toFlush, this)) {
		toFlush.push(this);
	}
	requireFlush();
	for (var i = 0; i < this.onInvalidateCallbacks; i++) {
		this.onInvalidateCallbacks[i]();
	}
	this.onInvalidateCallbacks = [];
};

// Tracks dependant functions and invalidates upon change.
var Dependency = function() {
	this.dependents = {};
};

// Adds current computation to list of dependants of this dependency.
Dependency.prototype.depend = function() {
	if (computation = currentComputation) {
		computationId = computation.id;
		this.dependents[computationId] = computation;
		computation.onInvalidateCallbacks.push(function() {
			delete this.dependents[computationId];
		}.bind(this));
	}
};

Dependency.prototype.changed = function() {
	for (var dep in this.dependents) {
		this.dependents[dep].invalidate();
	}
};

// autorun creates new computation and runs once.
autorun = function(f) {
	var c = new Computation(f);
	c.compute();
};

exports.autorun = autorun;
exports.Dependency = Dependency;

},{}]},{},[1])