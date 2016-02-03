//var math = require('./math.min.js');
function Graphing(pCanvas) {
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
  // The controls are on the last 150 pixels
  var graphWidth = canvas.width - 150;
  var lines = {};
  // When we first start we don't want a blank canvas.
  drawGrid();

  /**
   * Repaints the entire canvas.
   *
   * @return {undefined}
   */
  this.repaint = function () {
    graphWidth = canvas.width - 150;
    clearGraph();
    drawGrid();
    graphLines();
  };


  /**
   * addLine - Adds a line to the graph window
   *
   * @param  {string} name     name of the graph, (i.e. f(x))
   * @param  {string} equation the equation to graph (i.e. 2x)
   * @param  {string} color    html color
   * @return {undefined}
   */
  this.addLine = function(name, equation, color) {
    // If this function is already being graphed we need to clear the screen.
    if (lines[name]) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
    }
    // Make sure there are no spaces.
    equation = equation.replace(/\s/, '');
    lines[name] = {equation: equation, color: color};
    // Repaint the lines being graphed. Doesn't need to repaint grid so don't
    // use this.repaint()
    graphLines();
  };

  /**
   * removeLine - Takes a graph off of the screen.
   *
   * @param  {string} name the name of the function (i.e. f(x))
   * @return {undefined}
   */
  this.removeLine = function(name) {
    delete lines[name];
    // What we are graphing has changed so we need to repaint.
    this.repaint()
  };

  /**
   * setBounds - Changes the dimensions of the graphing window.
   *             todo: Needs to learn to account for incomplete arrays.
   *
   * @param  {array} arrayOfValues [xmin, xmax, hgrid, ymin, ymax, vgrid]
   * @return {undefined}
   */
  this.setBounds = function(arrayOfValues) {
    windowInfo.xmin = Number(arrayOfValues[0]);
    windowInfo.xmax = Number(arrayOfValues[1]);
    windowInfo.hgrid = Number(arrayOfValues[2]);
    windowInfo.ymin = Number(arrayOfValues[3]);
    windowInfo.ymax = Number(arrayOfValues[4]);
    windowInfo.vgrid = Number(arrayOfValues[5]);
    // The window has changed so we need to repaint.
    clearGraph();
    drawGrid();
    graphLines();
  };

  /**
   * setWindow - Sets individual window dimensions.
   *
   * @param  {string} key   the name of the dimension we are changing.
   * @param  {string/number} value The value to change it to.
   * @return {type}       description
   */
  this.setWindow = function(key, value) {
    // We evaluate this so people can type in stuff like 1/3
    var evaluatedValue = math.eval(value);
    // Only make the change if the result is a number.
    if (!isNaN(evaluatedValue)) {
      // We need to do a second check for 0 if on the vgrid or hgrid because
      // 0 will cause an infinite loop.
      if (key !== 'hgrid' && key !== 'vgrid') {
        windowInfo[key] = evaluatedValue;
      } else if (value != 0) {
        windowInfo[key] = evaluatedValue;
      }
      // We changed the dimensions so we need to repaint the graph.
      this.repaint();
    }
  };

  /**
   * clearGraph - Shorthand function to clear the canvas.
   *
   * @return {undefined}
   */
  function clearGraph() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * graphLines - Graphs all of the functions that are defined.
   *
   * @return {undefined}
   */
  function graphLines() {
    var linesToGraph = Object.keys(lines);
    // Loop through the defined graphs.
    linesToGraph.forEach(function(name) {
      var color = lines[name].color;
      context.strokeStyle = color;
      context.lineWidth = 3;
      // Our lines and curves are just big paths.
      context.beginPath();
      // If it is the beginning of our path we need to do some extra stuff.
      var started = false;
      // Loop through the entire horizontal pixels of the canvas
      for(xPixel = 1; xPixel < graphWidth; xPixel++ ){
        // Pixel to number
        xNumber = convertHPixelToNumber(xPixel);
        // Find yNumber from the converted number above
        yNumber = math.eval(lines[name].equation, {x: xNumber});
        // We need this in pixels so we can paint.
        yPixel = convertVNumberToPixel(yNumber);
        if (yPixel ) {
          if (started) {
            context.lineTo(xPixel, yPixel);
          } else {
            // This is the beginning of the path.
            context.moveTo(xPixel, yPixel);
            started = true;
          }
        }
      }
      // Stroke our path.
      context.stroke();
    });
  }

  /**
   * drawGrid - Draws the vertical and horizontal lines across the graph. Also
   * populates the numbers for those lines.
   *
   * @return {undefined}
   */
  function drawGrid() {
    context.strokeStyle = '#d0d0d0';
    context.fillStyle = '#000000';
    context.lineWidth = 1;
    // Get the vertical zero location if it exists.
    var vzero = convertHNumberToPixel(0);
    var textV = vzero;
    context.font = "14px Calibri";
    if (vzero) {
      // Gives a little breathing room
      textV = vzero - 2;
    }
    // Get the horizontal zero location if it exists.
    var hzero = convertVNumberToPixel(0);
    var textH;
    if (hzero) {
      // Gives a litlte breathing room
      textH = hzero - 2;
    }
    // We want to round our numbers printed to the grid value needed. Accounts
    // for the base10 to base2 rounding errors
    var rounded = (windowInfo.hgrid + '').split('.');
    // If we have decimals...
    if (rounded[1]) {
      rounded = rounded[1].length;
    } else {
      rounded = 0;
    }
    // negatives make it rotate more than non negatives but we want our x-axis
    // to be consistant so if we rotate one, we need to rotate them all.
    var rotateTheRest = false;
    // Paint the vertical grid lines and the x-axis numbers.
    for (i = windowInfo.xmin + windowInfo.hgrid;
          i < windowInfo.xmax; i += windowInfo.hgrid) {
      var xNumber = convertHNumberToPixel(i);
      // Not sure if it is better to draw a line or a rectangle...
      context.beginPath();
      context.moveTo(xNumber,0);
      context.lineTo(xNumber, canvas.height);
      context.stroke();
      // The text width.
      var width = context.measureText(math.round(i, rounded)).width;
      // This is the max width we want our text to be before we rotate it
      // sideways.
      var maxWidth =
          convertHNumberToPixel(windowInfo.xmin + windowInfo.hgrid) * 3 / 4;
      // We keep track of if one of them has been rotated so we can rotate
      // the rest of our functions as well.
      rotateTheRest = rotateTextIfNeeded(math.round(i, rounded),
          xNumber - width / 2, textH + 14 + 3, maxWidth, rotateTheRest);
    }
    // Now see about rounding for the y-axis numbers to avoid the same base10 to
    // base2 rounding errors.
    rounded = (windowInfo.vgrid + '').split('.');
    if (rounded[1]) {
      rounded = rounded[1].length;
    } else {
      rounded = 0;
    }
    // Paint the horizontal lines on the screen as well as the numbers to print.
    for (i = windowInfo.ymin + windowInfo.vgrid;
          i < windowInfo.ymax; i += windowInfo.vgrid) {
      var yNumber = convertVNumberToPixel(i);
      // Still not sure if it is better to paint a line or rectangle.
      context.beginPath();
      context.moveTo(0,yNumber);
      context.lineTo(graphWidth, yNumber);
      context.stroke();
      // This will always paint horizontally so no worry about flipping.
      var textWidth = context.measureText(math.round(i, rounded)).width;
      context.fillText(math.round(i, rounded), textV - textWidth, yNumber + 5);
    }
    // If the y-axis is on the screen, paint it.
    if (convertHNumberToPixel(0)) {
      context.fillStyle = '#000000';
      context.fillRect(convertHNumberToPixel(0) - 1, 0, 3, canvas.height);
    }
    // If the x-axis is on the screen, paint it.
    if (convertVNumberToPixel(0)) {
      var vzero = convertVNumberToPixel(0);
      context.fillStyle = '#000000';
      context.fillRect(0, vzero - 1, graphWidth, 3);
    }
  }

  /**
   * convertHNumberToPixel - Converts a horizontal number to a pixel location
   * based on canvas dimensions and the graph dimensions.
   *
   * @param  {number} number the number to be converted.
   * @return {number}        pixel which corresponds to the number
   */
  function convertHNumberToPixel(number) {
    return Math.round((number - windowInfo.xmin) /
        (windowInfo.xmax - windowInfo.xmin) * graphWidth);
  }
  /**
   * convertHNumberToPixel - Converts a horizontal number to a pixel location
   * based on canvas dimensions and the graph dimensions. (Public for info).
   *
   * @param  {number} number the number to be converted.
   * @return {number}        pixel which corresponds to the number
   */
  this.convertHNumberToPixel = function(number) {
    return convertHNumberToPixel(number);
  };
  /**
   * convertHPixelToNumber - Converts a horizontal pixel location to a number
   * based on canvas dimensions and the graph dimensions.
   *
   * @param  {number} pixel the pixel to be converted.
   * @return {number}        number which corresponds to the pixels
   */
  function convertHPixelToNumber(pixel) {
    return ((windowInfo.xmax - windowInfo.xmin) /
    graphWidth * pixel) + windowInfo.xmin;
  }
  /**
   * convertHPixelToNumber - Converts a horizontal pixel location to a number
   * based on canvas dimensions and the graph dimensions. (Public for info)
   *
   * @param  {number} pixel the pixel to be converted.
   * @return {number}        number which corresponds to the pixels
   */
  this.convertHPixelToNumber = function(pixel) {
    return convertHPixelToNumber(pixel);
  };
  /**
   * convertVNumberToPixel - Converts a vertical number to a pixel location
   * based on canvas dimensions and the graph dimensions.
   *
   * @param  {number} number the number to be converted.
   * @return {number}        pixel which corresponds to the number
   */
  function convertVNumberToPixel(number) {
    return Math.round((1 - (number - windowInfo.ymin) /
        (windowInfo.ymax - windowInfo.ymin)) * canvas.height);
  }
  /**
   * convertVNumberToPixel - Converts a vertical number to a pixel location
   * based on canvas dimensions and the graph dimensions. (Public for info).
   *
   * @param  {number} number the number to be converted.
   * @return {number}        pixel which corresponds to the number
   */
  this.convertVNumberToPixel = function(number) {
    return convertVNumberToPixel(number);
  };
  /**
   * convertVPixelToNumber - Converts a vertical pixel location to a number
   * based on canvas dimensions and the graph dimensions.
   *
   * @param  {number} pixel the pixel to be converted.
   * @return {number}        number which corresponds to the pixels
   */
  function convertVPixelToNumber(pixel) {
    return ((windowInfo.ymax - windowInfo.ymin) /
        canvas.height * pixel) + windowInfo.ymin;
  }
  /**
   * convertVPixelToNumber - Converts a horizontal pixel location to a number
   * based on canvas dimensions and the graph dimensions. (Public for info)
   *
   * @param  {number} pixel the pixel to be converted.
   * @return {number}        number which corresponds to the pixels
   */
  this.convertVPixelToNumber = function(pixel) {
    return convertVPixelToNumber(pixel);
  };

  /**
   * rotateTextIfNeeded - Determines if the text is too long for its area and
   * rotates it 90 degrees if needed. Assumes default text size.
   *
   * @param  {string} text     The text to be printed.
   * @param  {number} x        The x-value where the text should be printed.
   * @param  {number} y        The y-value where the text should be printed.
   * @param  {number} maxWidth The max width the text should take.
   * @param  {bool} rotated    If we want it to just rotate the text without
   *                           checking the text width at all.
   * @return {true}            Returns true if the text was rotated.
   */
  function rotateTextIfNeeded(text, x, y, maxWidth, rotated) {
    var dimensions = context.measureText(text);
    if((maxWidth !== null && dimensions.width > maxWidth) || rotated)  {
      // We are rotating the canvas so we need to save the canvas so we can
      // restore the canvas to its unrotated state after we are done writing
      // sideways text.
      context.save();
      // We want to rotate around the center of the text
      var centerX = x + dimensions.width / 2;
      var centerY = y + 5; // (Assuming font size 10px);
      // Move the canvas to the center of the string
      context.translate(centerX, centerY);
      // Spin everything 90 degrees.
      context.rotate(Math.PI / 2);
      // Go back to the the regular origin.
      context.translate(-centerX, -centerY);
      // Fill the text, x is now -y and y is now x for 90 degree rotation.
      context.fillText(text, x + dimensions.width / 6, y + 10);
      // We rotated, we probably want to continue that.
      rotated = true;
      // Back to our unrotated context.
      context.restore();
    } else {
      // It isn't too wide, just write it out.
      context.fillText(text, x, y);
    }
    return rotated;
  }
}
