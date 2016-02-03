function Info(pCanvas) {
  var info = this;
  var ballRadius = 5;
  var canvas = pCanvas;
  var windowInfo = {
    xmin: -10,
    xmax: 10,
    ymin: -10,
    ymax: 10,
  };
  var graphWidth = canvas.width - 150;
  var lines = {};
  var balls = {};
  this.repaint = function() {
    graphWidth = canvas.width - 150;
  }
  this.addLine = function(name, equation, color) {
    lines[name] = {equation: equation, color: color};
  };
  this.removeLine = function(name) {
    clearBalls();
    clearText();
    delete lines[name];
    delete balls[name];
  };
  this.mouseLocation = function(xPage) {
    var x = xPage - 300;
    clearText();
    clearBalls();
    setBalls(x);
    drawBalls();
    setText(x);
  };
  canvas.addEventListener('mousemove', function(e) {
    info.mouseLocation(e.clientX);
  });
  this.setBounds = function(arrayOfValues) {
    xmin = Number(arrayOfValues[0]);
    xmax = Number(arrayOfValues[1]);
    ymin = Number(arrayOfValues[3]);
    ymax = Number(arrayOfValues[4]);
    clearText();
  };
  function clearText() {
    var lineKeys = Object.keys(lines);
    var context = canvas.getContext('2d');
    var top = canvas.height - 30 * (lineKeys.length - 1);
    context.clearRect(0, top - 30, 400, canvas.height - top + 40);
  }
  function setText(x) {
    var lineKeys = Object.keys(lines);
    var top = canvas.height - 30 * (lineKeys.length - 1);
    var xNumber = grapher.convertHPixelToNumber(x);
    lineKeys.forEach(function(info, key) {
      context.font = '20px calibri';
      context.fillStyle = lines[info].color;
      var yNumber = math.eval(lines[info].equation, {x: xNumber});
      var functionVal = 'f(' + math.round(xNumber, 5) + ')';
      var dimensions = context.measureText('f(0.00000)');
      context.fillText(functionVal, 10, top + 30 * key - 10);
      context.fillText('= ' + math.round(yNumber, 5), dimensions.width + 20, top + 30 * key - 10);
    });
  }
  function setBalls(x) {
    var lineKeys = Object.keys(lines);
    lineKeys.forEach(function(key) {
      var xNumber = grapher.convertHPixelToNumber(x);
      var yNumber = math.eval(lines[key].equation, {x: xNumber});
      var y = grapher.convertVNumberToPixel(yNumber);
      balls[key] = {x: x, y: y};
    });
  }
  function drawBalls() {
    context = canvas.getContext('2d');
    var ballKeys = Object.keys(balls);
    ballKeys.forEach(function(key) {
      context.beginPath();
      context.arc(balls[key].x, balls[key].y, ballRadius, 0, 2 * Math.PI, false);
      context.fillStyle = lines[key].color;
      context.fill();
    });
  }
  function clearBalls() {
    context = canvas.getContext('2d');
    var ballKeys = Object.keys(balls);
    ballKeys.forEach(function(key) {
      context.clearRect(balls[key].x - ballRadius, balls[key].y - ballRadius,
        ballRadius * 2, ballRadius * 2);
    });
  }
}
