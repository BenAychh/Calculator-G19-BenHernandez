function resizeCanvas(){
  var graphing = document.getElementById("graphing");
  var info = document.getElementById("info");
  var table = document.getElementById("tables")
  var calculationHistory = document.getElementById("calculationHistory");
  // graphing.width = window.innerWidth -  300;
  // graphing.height = window.innerHeight - 200;
  // info.width = window.innerWidth -  300;
  // info.height = window.innerHeight - 200;
  calculationHistory.setAttribute("style", "height: " + tables.height + "px");
  // if (grapher) {
  //   grapher.repaint();
  // }
  if (tabler) {
    tabler.repaint();
  }
}
resizeCanvas();
