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
