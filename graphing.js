//var math = require('./math.min.js');
function Graphing(pCanvas) {
  var grapher = this;
  var canvas = pCanvas;
  var context = canvas.getContext('2d');
  var windowInfo = {
    xmin: -1,
    xmax: 1,
    hgrid: 0.1,
    ymin: -1,
    ymax: 1,
    vgrid: 0.1,
  };
  var graphWidth = canvas.width - 150;
  var lines = {};
  drawGrid();
  this.repaint = function () {
    graphWidth = canvas.width - 150;
    clearGraph();
    drawGrid();
    graphLines();
  };
  this.addLine = function(name, equation, color) {
    if (lines[name]) {
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
    windowInfo.xmin = Number(arrayOfValues[0]);
    windowInfo.xmax = Number(arrayOfValues[1]);
    windowInfo.hgrid = Number(arrayOfValues[2]);
    windowInfo.ymin = Number(arrayOfValues[3]);
    windowInfo.ymax = Number(arrayOfValues[4]);
    windowInfo.vgrid = Number(arrayOfValues[5]);
    clearGraph();
    drawGrid();
    graphLines();
  };
  this.setWindow = function(key, value) {
    var evaluatedValue = math.eval(value);
    if (!isNaN(evaluatedValue)) {
      if (key !== 'hgrid' && key !== 'vgrid') {
        windowInfo[key] = evaluatedValue;
      } else if (value != 0) {
        windowInfo[key] = evaluatedValue;
      }
      this.repaint();
    }
  };
  function clearGraph() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  function graphLines() {
    var linesToGraph = Object.keys(lines);
    linesToGraph.forEach(function(name) {
      var color = lines[name].color;
      context.strokeStyle = color;
      context.lineWidth = 3;
      context.beginPath();
      var started = false;
      for(xPixel = 1; xPixel < graphWidth; xPixel++ ){
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
    var rounded = (windowInfo.hgrid + '').split('.');
    if (rounded[1]) {
      rounded = rounded[1].length;
    } else {
      rounded = 0;
    }
    var rotateTheRest = false;
    for (i = windowInfo.xmin + windowInfo.hgrid;
          i < windowInfo.xmax; i += windowInfo.hgrid) {
      var xNumber = convertHNumberToPixel(i);
      context.beginPath();
      context.moveTo(xNumber,0);
      context.lineTo(xNumber, canvas.height);
      context.stroke();
      var width = context.measureText(math.round(i, rounded)).width;
      var maxWidth = convertHNumberToPixel(windowInfo.xmin + windowInfo.hgrid) * 3 / 4;
      rotateTheRest = rotateTextIfNeeded(math.round(i, rounded),
          xNumber - width / 2, textH + 14 + 3, maxWidth, rotateTheRest);
    }
    rounded = (windowInfo.vgrid + '').split('.');
    if (rounded[1]) {
      rounded = rounded[1].length;
    } else {
      rounded = 0;
    }
    for (i = windowInfo.ymin + windowInfo.vgrid;
          i < windowInfo.ymax; i += windowInfo.vgrid) {
      var yNumber = convertVNumberToPixel(i);
      context.beginPath();
      context.moveTo(0,yNumber);
      context.lineTo(graphWidth, yNumber);
      context.stroke();
      var textWidth = context.measureText(math.round(i, rounded)).width;
      context.fillText(math.round(i, rounded), textV - textWidth, yNumber + 5);
    }
    if (convertHNumberToPixel(0)) {
      context.fillStyle = '#000000';
      context.fillRect(convertHNumberToPixel(0) - 1, 0, 3, canvas.height);
    }
    if (convertVNumberToPixel(0)) {
      var vzero = convertVNumberToPixel(0);
      context.fillStyle = '#000000';
      context.fillRect(0, vzero - 1, graphWidth, 3);
    }
  }
  function convertHNumberToPixel(number) {
    return Math.round((number - windowInfo.xmin) /
        (windowInfo.xmax - windowInfo.xmin) * graphWidth);
  }
  this.convertHNumberToPixel = function(number) {
    return convertHNumberToPixel(number);
  };
  function convertHPixelToNumber(pixel) {
    return ((windowInfo.xmax - windowInfo.xmin) /
    graphWidth * pixel) + windowInfo.xmin;
  }
  this.convertHPixelToNumber = function(pixel) {
    return convertHPixelToNumber(pixel);
  };
  function convertVNumberToPixel(number) {
    return Math.round((1 - (number - windowInfo.ymin) /
        (windowInfo.ymax - windowInfo.ymin)) * canvas.height);
  }
  this.convertVNumberToPixel = function(number) {
    return convertVNumberToPixel(number);
  };
  function convertVPixelToNumber(pixel) {
    return ((windowInfo.ymax - windowInfo.ymin) /
        canvas.height * pixel) + windowInfo.ymin;
  }
  this.convertVPixelToNumber = function(pixel) {
    return convertVPixelToNumber(pixel);
  }
  function rotateTextIfNeeded(text, x, y, maxWidth, rotated) {
    var dimensions = context.measureText(text);
    context.save();
    if((maxWidth !== null && dimensions.width > maxWidth) || rotated)  {
        var centerX = x + dimensions.width / 2;
        var centerY = y + 5;
        context.translate(centerX, centerY);
        context.rotate(Math.PI / 2);
        context.translate(-centerX, -centerY);
        context.fillText(text, x + dimensions.width / 6, y + 10);
        rotated = true;
    } else {
      context.fillText(text, x, y);
    }
    context.restore();
    return rotated;
  }
}
