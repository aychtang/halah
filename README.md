halah
=====

no bullshit reactive XY graph model and views.

## Available graph types

* Bar Graphs - 'bar'
* Scatter Graphs - 'scatter'

## Usage

### Introduction

Halah intends to provide the simplest API for visualising XY data.

Start off by creating a model of this XY data. Halah graph models are instantiated
by calling new Graph(options), in your options object, add an x and y property
with arrays containing x labels and y values.

```js
var graphModel = new Graph({
  x: ['a', 'b', 'c'],
  y: [1, 5, 10]
});
```

Once you have defined a data model for your graph. You can start instantiating
Halah views by running init, keep a reference to the view object by saving the
result to a variable.

When running the init function, you need to pass an empty DOM element, which
Halah will fill with a d3 graph, and what type of graph you want as a string.

We could make a 500px square bar graph, given the following HTML:

```html
<div class="graph" style="width: 500px; height: 500px"></div>
```

Along with the following javascript:

```js
var barGraphView = graphModel.init(document.querySelector('.graph'), 'bar');
```

Now we should have a bar graph that shows three different values based on the
current model of the graph, which should be the values of a, b and c which are at
1, 5 and 10 respectively.

The magic is if you have changing data and you want to graph the latest results
in real time, halah does all that automagically! Just set the new data on the
graph model, and all dependant views will update.

```js
graphModel.setY([10, 5, 1]);
```

After running setY with a reversed set of the data we had, our bar graph should
automatically change to show that set of results.

### Multiple graphs of the same model

It's very easy to create multiple graphs on the same model, in the same way we
did with the first one. Each view is seperate and depends upon the model that
you run init() upon.

```js
// Before we had a barGraphView created with:
// graphModel.init(document.querySelector('.graph'), 'bar');

// We can have as many views of graphModel as we want, lets make a scatter graph.
// First we need another empty DOM element.
```
```html
<div class="scatter" style="width: 100%; height: 500px"></div>
```
```js
var scatterGraphView = graphModel.init(document.querySelector('.scatter'), 'scatter');
```

### API Documentation

#### Graph Model

##### Instantiation

```js
var graphModel = new Graph({
	x: ['a', 'b'],
	y: [1, 2]
});
```

##### Setting values

```js
// To set X or Y values, you can pass in new arrays to setX or setY.
graphModel.setY([1, 10]);

// You can also alter individual indexes, by passing setX/Y(index, value);
graphModel.setY(0, 5); // => Model Y values are now [5, 10]
```

##### Getting JSON values

```js
graphModel.JSON(); // => "{"a": 5, "b": 10}";
```
