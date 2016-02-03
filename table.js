function Table(pCanvas) {
  var canvas = pCanvas;
  var context = canvas.getContext('2d');
  var lines = {};
  var screenData = [];
  var startNumber = 1;
  var delta = 1;
  var maxFunctions = 4;
  var headerHeight = 50;
  var rowHeight = 50;
  var font = 40;
  context.font = font + 'px Calibri';
  var rightMargin = 150;
  var tableWidth = canvas.width - rightMargin;
  var headerColor = '#989898';
  var headerFontColor = '#000000';
  var borderColor = '#000000';
  var xFontColor = '#000000';
  var moveTimer;
  drawHeader();
  drawRows();
  canvas.addEventListener("mousedown", getPosition, false);
  function getPosition(event)
  {
    var x = event.x - 300;
    var y = event.y;
    var divideLines = tableWidth / maxFunctions;
    if (x > 0 && y > headerHeight) {
      var screenRow = math.floor((y - headerHeight) / rowHeight);
      var screenColumn = math.floor(x / divideLines);
      setInput( '(' + screenData[screenRow][screenColumn] + ')');
    }
  }
  this.repaint = function() {
    tableWidth = canvas.width - rightMargin;
    drawHeader();
    drawRows();
  };
  this.addLine = function(name, equation, color) {
    lines[name] = {equation: equation, color: color};
    this.repaint();
  };
  this.removeLine = function(name) {
    delete lines[name];
    this.repaint();
  };
  this.moveDown = function() {
    intervalMoveDown();
    moveTimer = setTimeout(function() {
      repeat(intervalMoveDown);
    }, 400);
  };

  this.moveUp = function() {
    intervalMoveUp();
    moveTimer = setTimeout(function() {
      repeat(intervalMoveUp);
    }, 400);
  };
  this.stopMove = function() {
    clearTimeout(moveTimer);
  };
  this.setDelta = function(d) {
    var evaluatedD = math.eval(d);
    if (!isNaN(evaluatedD)) {
      delta = evaluatedD;
      drawRows();
    }
  }
  this.setStart = function(s) {
    var evaluatedS = math.eval(s);
    if (!isNaN(evaluatedS)) {
      startNumber = evaluatedS;
      drawRows();
    }
  }
  function drawHeader() {
    context.clearRect(0, 0, tableWidth, headerHeight);
    context.strokeStyle = '';
    context.fillStyle = headerColor;
    context.fillRect(0, 0, tableWidth, headerHeight);
    context.fillStyle = borderColor;
    var divideLines = tableWidth / maxFunctions;
    // Header divider lines
    for (var j = 1; j < maxFunctions; j++) {
      context.fillRect(j * divideLines - 1, 0, 3, headerHeight);
    }
    // Header Bottom
    context.fillRect(0, headerHeight - 1, tableWidth, 3);
    //Side Border
    context.fillRect(tableWidth - 3, 0, 3, canvas.height);
    var columnWidth = tableWidth / maxFunctions;
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
    for (var k = 0; k < keys.length; k++) {
      var currentName = keys[k];
      dimensions = context.measureText(currentName);
      textLeft = centers[k + 1] - dimensions.width / 2;
      context.fillStyle = lines[currentName].color;
      context.fillText(currentName, textLeft, textTop);
    }
  }
  function drawRows() {
    context.clearRect(0, headerHeight, tableWidth, canvas.height - headerHeight);
    context.font = font + 'px Calibri';
    var numberOfRows = math.ceil((canvas.height - headerHeight) / rowHeight);
    var columnWidth = tableWidth / maxFunctions;
    var centers = [];
    var divideLines = tableWidth / maxFunctions;
    context.fillStyle = borderColor;
    for (var h = 1; h < maxFunctions; h++) {
      context.fillRect(h * divideLines - 1, headerHeight, 3, canvas.height - headerHeight);
    }
    for (var i = columnWidth / 2; i < tableWidth; i += columnWidth) {
      centers.push(i);
    }
    context.fillRect(tableWidth - 3, headerHeight, 3, canvas.height - headerHeight);
    context.fillStyle = xFontColor;
    var keys = Object.keys(lines);
    screenData = [];
    for (var j = 0; j <= numberOfRows; j++) {
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
      for (var k = 0; k < keys.length; k++) {
        var equation = lines[keys[k]].equation;
        context.fillStyle = lines[keys[k]].color;
        var functionNumber = math.eval(equation, {x: xNumber});
        row.push(functionNumber);
        if (!isNaN(functionNumber) && isFinite(functionNumber)) {
          functionNumber = math.round(functionNumber, 4);
        }
        dimensions = context.measureText(functionNumber.toLocaleString());
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
  function repeat(func) {
    func();
    moveTimer = setTimeout(function() {
      repeat(func);
    }, 100);
  }
  function intervalMoveDown() {
    startNumber += delta;
    drawRows();
  }
  function intervalMoveUp() {
    startNumber -= delta;
    drawRows();
  }
}
