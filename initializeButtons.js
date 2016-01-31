var buttons = document.getElementsByClassName('button');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function() {
    buttonClicked(this.getAttribute('data-value'));
  };
}
function buttonClicked(data) {
  var input = document.getElementById('expression');
  if (data != 'submit') {
    input.value += data;
    UpdateInput.Update();
  } else {
    setTimeout(calculate(), 150);
  }
}
