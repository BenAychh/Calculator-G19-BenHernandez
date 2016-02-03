function Table(pCanvas) {
  var canvas = pCanvas;
  var context = canvas.getContext('2d');
  var lines = {};
  // An array of the cell values
  var screenData = [];
  // So we know where to start the table.
  var startNumber = 1;
  // How much the table should move up by.
  var delta = 1;
  // So we know how to divide the table.
  var maxFunctions = 4;
  // How high to make the header of hte table.
  var headerHeight = 50;
  // How many pixels each row should be.
  var rowHeight = 50;
  // Font size to print in.
  var font = 40;
  context.font = font + 'px Calibri';
  // For the controls on the right.
  var tableWidth = canvas.width - 150;
  // Color information for the table
  var headerColor = '#989898';
  var headerFontColor = '#000000';
  var borderColor = '#000000';
  var xFontColor = '#000000';
  // To enable click and hold for the table moving.
  var moveTimer;
  // Special counters for mousewheel info, moving down row per response is
  // too fast.
  var wheelDownCount = 0;
  var wheelUpCount = 0;
  // Draw the basics when first started.
  drawHeader();
  drawRows();
  canvas.addEventListener("mousedown", getPosition, false);

  /**
   * getPosition - Takes the mouse information and returns the value of that
   * cell.
   *
   * @param  {event} event mouse info relative to screen.
   * @return {undefined}
   */
  function getPosition(event)
  {
    // 300 pixels for the calculator history.
    var x = event.x - 300;
    var y = event.y;
    var divideLines = tableWidth / maxFunctions;
    // Only go if they didn't click on the header.
    if (x > 0 && y > headerHeight) {
      // Breaks the canvas into individual cells
      var screenRow = math.floor((y - headerHeight) / rowHeight);
      var screenColumn = math.floor(x / divideLines);
      // If there is a value there, return it.
      if (screenData[screenRow][screenColumn]) {
        setInput( '(' + screenData[screenRow][screenColumn] + ')', true);
      }
    }
  }
  canvas.addEventListener('mousewheel', scrollTable);

  /**
   * scrollTable - Handles mouse wheel events.
   *
   * @param  {event} e scroll wheel information.
   * @return {undefined}
   */
  function scrollTable(e) {
    // Scrolling down
    if (e.wheelDelta < 0 ) {
      wheelDownCount ++;
      // We only want to move down a row ever 10 wheel "clicks"
      if (wheelDownCount > 10) {
        wheelDownCount = 0;
        intervalMoveDown();
      }
    } // scrolling up
    else if (e.wheelDelta > 0 ) {
      wheelUpCount ++;
      // We only want to move up a row ever 10 wheel "clicks"
      if (wheelUpCount > 10) {
        wheelUpCount = 0;
        intervalMoveUp();
      }
    }
  }

  /**
   * repaint - Repaints the table.
   *
   * @return {undefined}
   */
  this.repaint = function() {
    tableWidth = canvas.width - rightMargin;
    drawHeader();
    drawRows();
  };
  /**
   * this - Adds a column to our table.
   *
   * @param  {string} name     the name of our function (i.e. f(x))
   * @param  {string} equation the equation to table (i.e. 2x)
   * @param  {string} color    HTML color to write the text in.
   * @return {undefined}
   */
  this.addLine = function(name, equation, color) {
    lines[name] = {equation: equation, color: color};
    // We added a line, repaint everything.
    this.repaint();
  };

  /**
   * this - Removes a column from our table.
   *
   * @param  {string} name the name of our function (i.e. f(x))
   * @return {undefined}
   */
  this.removeLine = function(name) {
    delete lines[name];
    // We removed a column, we need to repaint.
    this.repaint();
  };

  /**
   * moveDown - Called when the down arrow is clicked.
   *
   * @return {undefined}
   */
  this.moveDown = function() {
    // Runs once to move down a row.
    intervalMoveDown();
    // Then sets a timer to start repeating the command after 400ms.
    moveTimer = setTimeout(function() {
      repeat(intervalMoveDown);
    }, 400);
  };

  /**
   * moveUp - Called when the up arrow is clicked.
   *
   * @return {type}  description
   */
  this.moveUp = function() {
    // Runs once to move up a row.
    intervalMoveUp();
    // Then sets a timer to start repeating the command after 400ms.
    moveTimer = setTimeout(function() {
      repeat(intervalMoveUp);
    }, 400);
  };

  /**
   * stopMove - Removes the times to stop the movement.
   *
   * @return {undefined}
   */
  this.stopMove = function() {
    clearTimeout(moveTimer);
  };

  /**
   * setDelta - Sets the delta (how much the table progresses by each row).
   *
   * @param  {number/string} d the change per row.
   * @return {undefined}
   */
  this.setDelta = function(d) {
    // Allows the user to put in things like 1/3
    var evaluatedD = math.eval(d);
    // Only change the delta if it is a number.
    if (!isNaN(evaluatedD)) {
      delta = evaluatedD;
      // Our delta changed, we need to repaint the rows (but not the header)
      drawRows();
    }
  };

  /**
   * setStart - Sets the start value of our table.
   *
   * @param  {number/string} s description
   * @return {type}   description
   */
  this.setStart = function(s) {
    // Allows the user to type in things like 1/3
    var evaluatedS = math.eval(s);
    // Only change the start if it is a number.
    if (!isNaN(evaluatedS)) {
      startNumber = evaluatedS;
      drawRows();
    }
  };

  /**
   * drawHeader - Draws the header row.
   *
   * @return {undefined}
   */
  function drawHeader() {
    // We need to clear the header first.
    context.clearRect(0, 0, tableWidth, headerHeight);
    // Remove any stroke stuff already printed.
    context.strokeStyle = '';
    context.fillStyle = headerColor;
    context.fillRect(0, 0, tableWidth, headerHeight);
    context.fillStyle = borderColor;
    // How many pixels each column should be.
    var columnWidth = tableWidth / maxFunctions;
    // Header divider lines
    for (var j = 1; j < maxFunctions; j++) {
      context.fillRect(j * columnWidth - 1, 0, 3, headerHeight);
    }
    // Header Bottom
    context.fillRect(0, headerHeight - 1, tableWidth, 3);
    //Side Border
    context.fillRect(tableWidth - 3, 0, 3, canvas.height);
    // Get the center of each column.
    var centers = [];
    for (var i = columnWidth / 2; i < tableWidth; i += columnWidth) {
      centers.push(i);
    }
    context.fillStyle = '#ffffff';
    context.font = font + 'px Calibri';
    var textTop = headerHeight - (rowHeight - font);
    var dimensions = context.measureText('x');
    var textLeft = centers[0] - dimensions.width / 2;
    context.fillText('x', textLeft, textTop);
    var keys = Object.keys(lines);
    // Loop through the keys and draw the names. Using a regular four Loop
    // so we can work with the centers array via key.
    for (var k = 0; k < keys.length; k++) {
      var currentName = keys[k];
      dimensions = context.measureText(currentName);
      textLeft = centers[k + 1] - dimensions.width / 2;
      context.fillStyle = lines[currentName].color;
      context.fillText(currentName, textLeft, textTop);
    }
  }

  /**
   * drawRows - Draws the rows and populates the screenData array.
   *
   * @return {undefined}
   */
  function drawRows() {
    // Clear the rows area.
    context.clearRect(0, headerHeight, tableWidth, canvas.height - headerHeight);
    context.font = font + 'px Calibri';
    // Get the number of rows we need to draw, round up so partial rows show.
    var numberOfRows = math.ceil((canvas.height - headerHeight) / rowHeight);
    var columnWidth = tableWidth / maxFunctions;
    // Draw the vertical bars
    context.fillStyle = borderColor;
    for (var h = 1; h < maxFunctions; h++) {
      context.fillRect(h * columnWidth - 1, headerHeight, 3,
          canvas.height - headerHeight);
    }
    // Populate the centers of each column.
    var centers = [];
    for (var i = columnWidth / 2; i < tableWidth; i += columnWidth) {
      centers.push(i);
    }
    //Draw the side border.
    context.fillRect(tableWidth - 3, headerHeight, 3, canvas.height - headerHeight);
    context.fillStyle = xFontColor;
    var keys = Object.keys(lines);
    // Empty the screenData because we are about to repopulate.
    screenData = [];
    // Loop through the columns
    for (var j = 0; j <= numberOfRows; j++) {
      // Make a blank row to push to screenData.
      var row = [];
      var xNumber = math.round(j * delta + startNumber,3);
      row.push(xNumber);
      var dimensions = context.measureText(xNumber);
      var bottomOfRow = headerHeight + (j + 1) * rowHeight;
      var textTop = bottomOfRow - (rowHeight - font);
      var textLeft = centers[0] - dimensions.width / 2;
      context.fillStyle = xFontColor;
      context.fillText(xNumber, textLeft, textTop);
      context.fillStyle = borderColor;
      context.fillRect(0, bottomOfRow - 1, tableWidth, 3);
      // Loop through the defined functions, use regular loop so we can access
      // centers via key.
      for (var k = 0; k < keys.length; k++) {
        var equation = lines[keys[k]].equation;
        context.fillStyle = lines[keys[k]].color;
        // Evaluate the function at this row's x value.
        var functionNumber = math.eval(equation, {x: xNumber});
        row.push(functionNumber);
        // We can't round if it isn't a number or infinite
        if (!isNaN(functionNumber) && isFinite(functionNumber)) {
          functionNumber = math.round(functionNumber, 4);
        }
        dimensions = context.measureText(functionNumber.toLocaleString());
        // We are sizing the string to fit the column, to min left should be
        // the column start (don't want overflow).
        if (dimensions.width < divideLines) {
          textLeft = centers[k + 1] - dimensions.width / 2;
        } else {
          textLeft = divideLines * (k + 1);
        }
        context.fillText(functionNumber.toLocaleString(), textLeft, textTop, divideLines);
      }
      screenData.push(row);
    }
  }

  /**
   * repeat - A repeat function to mouse down and hold. Repeats the command
   * ever 100ms until timer is cleared.
   *
   * @param  {function} func The function to be repeated.
   * @return {undefined}
   */
  function repeat(func) {
    func();
    moveTimer = setTimeout(function() {
      repeat(func);
    }, 100);
  }

  /**
   * intervalMoveDown - moves the table down one row.
   *
   * @return {undefined}
   */
  function intervalMoveDown() {
    startNumber += delta;
    drawRows();
  }

  /**
   * intervalMoveUp - moves the table up one row.
   *
   * @return {undefined}
   */
  function intervalMoveUp() {
    startNumber -= delta;
    drawRows();
  }
}
