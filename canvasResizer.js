function resizeCanvas(){
  var graphing = document.getElementById("graphing");
  var info = document.getElementById("info");
  var table = document.getElementById("tables")
  var calculationHistory = document.getElementById("calculationHistory");
  var container = document.getElementById('tableInterface');
  graphing.width = window.innerWidth -  300;
  graphing.height = window.innerHeight - 200;
  info.width = window.innerWidth -  300;
  info.height = window.innerHeight - 200;
  table.width = window.innerWidth -  300;
  table .height = window.innerHeight - 200;
  calculationHistory.setAttribute("style", "height: " + tables.height + "px");
  container.setAttribute("style", "left: " + (tables.width - 150) + "px;")
  if (grapher) {
    grapher.repaint();
  }
  if (tabler) {
    tabler.repaint();
  }
}
resizeCanvas();
