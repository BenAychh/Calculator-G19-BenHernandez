function Table(pCanvas) {
  var canvas = pCanvas;
  var context = canvas.getContext('2d');
  var lines = {};
  var startNumber = 1;
  var delta = 1;
  var drawHeader = function() {
    context.fillStyle = '#00b63e';
    context.fillRect(0, 0, canvas.width, 50);
    context.fillStyle = '#000000';
  };
  this.populateTable = function() {
    drawHeader();
  };
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
}
