function resizeCanvas(){
  var graphing = document.getElementById("graphing");
  var info = document.getElementById("info");
  var table = document.getElementById("tables")
  var calculationHistory = document.getElementById("calculationHistory");
  var tableContainer = document.getElementById('tableInterface');
  var graphContainer = document.getElementById('graphInterface');
  graphing.width = window.innerWidth -  300;
  graphing.height = window.innerHeight - 200;
  info.width = window.innerWidth -  300;
  info.height = window.innerHeight - 200;
  table.width = window.innerWidth -  300;
  table .height = window.innerHeight - 200;
  calculationHistory.setAttribute("style", "height: " + tables.height + "px");
  tableContainer.setAttribute("style", "left: " + (tables.width - 150) + "px; height: " + tables.height + "px");
  graphContainer.setAttribute("style", "left: " + (graphing.width - 150) + "px; height: " + graphing.height + "px");
  if (grapher) {
    grapher.repaint();
    infoer.repaint();
  }
  if (tabler) {
    tabler.repaint();
  }
}
resizeCanvas();
