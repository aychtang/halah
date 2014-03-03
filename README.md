halah
=====

no bullshit reactive XY graph model and views.

## Available graph types

* Bar Graphs - 'bar'
* Scatter Graphs - 'scatter'

## Usage

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

Given the following HTML:

```html
<div class="graph" style="width: 500px; height: 500px"></div>
```

We could make a 500px square bar graph with the following javascript.

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
