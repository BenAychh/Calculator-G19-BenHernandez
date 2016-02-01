//var math = require('./math.min.js');
function Graphing(pCanvas) {
  var canvas = pCanvas;
  var xmin = -10;
  var xmax = 10;
  var hgrid = 1;
  var ymin = -10;
  var ymax = 10;
  var vgrid = 1;
  var lines = {};
  drawGrid();
  this.repaint = function () {
    clearGraph();
    drawGrid();
    graphLines();
  }
  this.addLine = function(name, equation, color) {
    if (lines[name]) {
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
    }
    equation = equation.replace(/\s/, '');
    lines[name] = {equation: equation, color: color};
    graphLines();
  };
  this.removeLine = function(name) {
    delete lines[name];
    clearGraph();
    drawGrid();
    graphLines();
  };
  this.setBounds = function(arrayOfValues) {
    xmin = Number(arrayOfValues[0]);
    xmax = Number(arrayOfValues[1]);
    hgrid = Number(arrayOfValues[2]);
    ymin = Number(arrayOfValues[3]);
    ymax = Number(arrayOfValues[4]);
    vgrid = Number(arrayOfValues[5]);
    clearGraph();
    drawGrid();
    graphLines();
  };
  function clearGraph() {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  function graphLines() {
    var context = canvas.getContext('2d');
    var linesToGraph = Object.keys(lines);
    linesToGraph.forEach(function(name) {
      var color = lines[name].color;
      context.strokeStyle = color;
      context.lineWidth = 3;
      context.beginPath();
      var started = false;
      for(xPixel = 1; xPixel < canvas.width; xPixel++ ){
        xNumber = convertHPixelToNumber(xPixel);
        yNumber = math.eval(lines[name].equation, {x: xNumber});
        yPixel = convertVNumberToPixel(yNumber);
        if (yPixel ) {
          if (started) {
            context.lineTo(xPixel, yPixel);
          } else {
            context.moveTo(xPixel, yPixel);
            started = true;
          }
        }
      }
      context.stroke();
    });
  }
  function drawGrid() {
    var context = canvas.getContext('2d');
    context.strokeStyle = '#d0d0d0';
    context.fillStyle = '#000000';
    context.lineWidth = 1;
    var vzero = convertHNumberToPixel(0);
    var textV = vzero;
    context.font = "14px Calibri";
    if (vzero) {
      textV = vzero /* font */ - 2;
    }
    var hzero = convertVNumberToPixel(0);
    var textH;
    if (hzero) {
      textH = hzero - 2;
    }
    for (i = xmin + hgrid; i < xmax; i += hgrid) {
      var xNumber = convertHNumberToPixel(i);
      context.beginPath();
      context.moveTo(xNumber,0);
      context.lineTo(xNumber, canvas.height);
      context.stroke();
      var width = context.measureText(i).width;
      context.fillText(i, xNumber - width / 2, textH + 14 + 3);
    }
    for (i = ymin + vgrid; i < ymax; i += vgrid) {
      var yNumber = convertVNumberToPixel(i);
      context.beginPath();
      context.moveTo(0,yNumber);
      context.lineTo(canvas.width, yNumber);
      context.stroke();
      var textWidth = context.measureText(i).width;
      context.fillText(i, textV - textWidth, yNumber + 5);
    }
    if (convertHNumberToPixel(0)) {
      context.fillStyle = '#000000';
      context.fillRect(convertHNumberToPixel(0) - 1, 0, 3, canvas.height);
    }
    if (convertVNumberToPixel(0)) {
      var vzero = convertVNumberToPixel(0);
      context.fillStyle = '#000000';
      context.fillRect(0, vzero - 1, canvas.width, 3);
    }
  }
  function convertHNumberToPixel(number) {
    return Math.round((number - xmin) / (xmax - xmin) * canvas.width);
  }
  function convertHPixelToNumber(pixel) {
    return ((xmax - xmin) / canvas.width * pixel) + xmin;
  }
  function convertVNumberToPixel(number) {
    return Math.round((1 - (number - ymin) / (ymax - ymin)) * canvas.height);
  }
  function convertVPixelToNumber(pixel) {
    return ((ymax - ymin) / canvas.height * pixel) + ymin;
  }
}
