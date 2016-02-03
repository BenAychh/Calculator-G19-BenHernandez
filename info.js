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
  // Leave 150 pixels for the graph controls.
  var graphWidth = canvas.width - 150;
  var lines = {};
  var balls = {};
  /**
   * repaint - Only called when the browser window is resized.
   *
   * @return {undefined}
   */
  this.repaint = function() {
    graphWidth = canvas.width - 150;
  };

  /**
   * addLine - Adds an column to the table.
   *
   * @param  {string} name     the name (i.e. f(x))
   * @param  {string} equation the equation (i.e. 2x)
   * @param  {string} color    the color for the text.
   * @return {undefined}
   */
  this.addLine = function(name, equation, color) {
    lines[name] = {equation: equation, color: color};
  };

  /**
   * this - Removes a column from the table
   *
   * @param  {string} name the name of the function to remove (i.e. f(x))
   * @return {type}
   */
  this.removeLine = function(name) {
    // since we are removing something, we should clear the info text.
    clearBalls();
    clearText();
    delete lines[name];
    delete balls[name];
  };
  // Adds mouse listener to the canvas.
  canvas.addEventListener('mousemove', function(e) {
    info.mouseLocation(e.clientX);
  });
  /**
   * mouseLocation - Mouse listener for the canvas
   *
   * @param  {number} xPage the xvalue of the mouse location relative to the
   *                        page.
   * @return {undefined}
   */
  this.mouseLocation = function(xPage) {
    // The calculation history is exactly 300 pixels regardless of screen size.
    var x = xPage - 300;
    // Clear first so we don't accidentally remove text or balls.
    clearText();
    clearBalls();
    setBalls(x);
    drawBalls();
    setText(x);
  };

  /**
   * clearText - Clears the info text. Clears as little as possible for CPU
   *             savings.
   *
   * @return {undefined}
   */
  function clearText() {
    var lineKeys = Object.keys(lines);
    var context = canvas.getContext('2d');
    // 30 pixels per line of text
    var top = canvas.height - 30 * (lineKeys.length - 1);
    // An extra 40 pixels for bottom clearing.
    context.clearRect(0, top - 30, 400, canvas.height - top + 40);
  }

  /**
   * setText - Displays the text info on the screen.
   *
   * @param  {number} x the mouse location relative to the canvas.
   * @return {undefined}
   */
  function setText(x) {
    var lineKeys = Object.keys(lines);
    // 30 pixels per line of text.
    var top = canvas.height - 30 * (lineKeys.length - 1);
    var xNumber = grapher.convertHPixelToNumber(x);
    // Loops through the defined functions.
    lineKeys.forEach(function(info, key) {
      context.font = '20px calibri';
      context.fillStyle = lines[info].color;
      var yNumber = math.eval(lines[info].equation, {x: xNumber});
      // I like rounding to five decimals
      var functionVal = 'f(' + math.round(xNumber, 5) + ')';
      // Since we are doing 5 decimals.
      var dimensions = context.measureText('f(0.00000)');
      // Draw f(#)
      context.fillText(functionVal, 10, top + 30 * key - 10);
      // Draw the resultant value.
      context.fillText('= ' + math.round(yNumber, 5),
          dimensions.width + 20, top + 30 * key - 10);
    });
  }

  /**
   * setBalls - Sets the location of the balls following the lines
   *
   * @param  {number} x The mouse location relative to the canvas.
   * @return {undefined}
   */
  function setBalls(x) {
    var lineKeys = Object.keys(lines);
    // Position a ball for each function we are graphing.
    lineKeys.forEach(function(key) {
      var xNumber = grapher.convertHPixelToNumber(x);
      var yNumber = math.eval(lines[key].equation, {x: xNumber});
      var y = grapher.convertVNumberToPixel(yNumber);
      balls[key] = {x: x, y: y};
    });
  }

  /**
   * drawBalls - Draws the balls after they have been placed by setBalls();
   *
   * @return {undefined}
   */
  function drawBalls() {
    var ballKeys = Object.keys(balls);
    // Loop through the balls and draw them.
    ballKeys.forEach(function(key) {
      context.beginPath();
      context.arc(balls[key].x, balls[key].y, ballRadius, 0, 2 * Math.PI, false);
      context.fillStyle = lines[key].color;
      context.fill();
    });
  }

  /**
   * clearBalls - Removes the balls from the screen, better than clearing the
   *              entire context
   *
   * @return {undefined}
   */
  function clearBalls() {
    context = canvas.getContext('2d');
    var ballKeys = Object.keys(balls);
    // Loop through the balls and clear a rectangle using the diameter.
    ballKeys.forEach(function(key) {
      context.clearRect(balls[key].x - ballRadius, balls[key].y - ballRadius,
        ballRadius * 2, ballRadius * 2);
    });
  }
}
