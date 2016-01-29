function Info(pCanvas) {
  var info = this;
  var ballRadius = 5;
  var canvas = pCanvas;
  var xmin = -10;
  var xmax = 10;
  var ymin = -10;
  var ymax = 10;
  var lines = {};
  var balls = {};
  this.addLine = function(name, equation, color) {
    lines[name] = {equation: equation, color: color};
  };
  this.removeLine = function(name) {
    clearBalls();
    clearText();
    delete lines[name];
    delete balls[name];
  };
  this.mouseLocation = function(x) {
    clearText();
    clearBalls();
    setBalls(x);
    drawBalls();
    setText(x);
  };
  canvas.addEventListener('mousemove', function(e) {
    info.mouseLocation(e.clientX);
  });
  function clearText() {
    var lineKeys = Object.keys(lines);
    var context = canvas.getContext('2d');
    var top = canvas.height - 30 * (lineKeys.length - 1);
    context.clearRect(0, top - 30, 400, canvas.height - top + 40);
  }
  function setText(x) {
    var lineKeys = Object.keys(lines);
    var top = canvas.height - 30 * (lineKeys.length - 1);
    var xNumber = convertHPixelToNumber(x);
    lineKeys.forEach(function(info, key) {
      context.font = '20px calibri';
      context.fillStyle = lines[info].color;
      var yNumber = math.eval(lines[info].equation, {x: xNumber});
      context.fillText('f(' + math.round(xNumber, 2) + ')', 10, top + 30 * key - 10);
      context.fillText('= ' + math.round(yNumber, 2), 80, top + 30 * key - 10);
    });
  }
  function setBalls(x) {
    var lineKeys = Object.keys(lines);
    lineKeys.forEach(function(key) {
      var xNumber = convertHPixelToNumber(x);
      var yNumber = math.eval(lines[key].equation, {x: xNumber});
      var y = convertVNumberToPixel(yNumber);
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
