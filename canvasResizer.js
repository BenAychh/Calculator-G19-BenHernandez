/**
 * resizeCanvas - Handles resizing the window.
 *
 * @return {undefined}
 */
function resizeCanvas(){
  var graphing = document.getElementById("graphing");
  var info = document.getElementById("info");
  var table = document.getElementById("tables")
  var calculationHistory = document.getElementById("calculationHistory");
  var tableContainer = document.getElementById('tableInterface');
  var graphContainer = document.getElementById('graphInterface');
  // Leave 300 pixels for the calculator history on the left.
  graphing.width = window.innerWidth -  300;
  info.width = window.innerWidth -  300;
  table.width = window.innerWidth -  300;
  // Leave 200 pixels for the buttons on the bottom.
  graphing.height = window.innerHeight - 200;
  info.height = window.innerHeight - 200;
  table .height = window.innerHeight - 200;
  // We want the calculator history to have the same height as our canvases.
  calculationHistory.setAttribute("style", "height: " + tables.height + "px");
  // For our card flip on graphs and tables.
  tableContainer.setAttribute("style", "left: " +
      (tables.width - 150) + "px; height: " + tables.height + "px");
  graphContainer.setAttribute("style", "left: " + (graphing.width - 150) +
      "px; height: " + graphing.height + "px");

  // We resized these elements, we need to repaint them.
  if (grapher) {
    grapher.repaint();
    infoer.repaint();
  }
  if (tabler) {
    tabler.repaint();
  }
}
// Call when the page is first loaded to make sure the canvases are painted
// correctly.
resizeCanvas();
