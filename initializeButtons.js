var listener = new window.keypress.Listener();
var buttons = document.getElementsByClassName('button');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function() {
    var data = this.getAttribute('data-value');
    if (data.indexOf('special(') === -1 ) {
      buttonClicked(this.getAttribute('data-value'));
    } else {
      var parameters = data.substring(7, data.length).split(',');
      var buttonCommand = parameters[1].replace(')', '');
      buttonClicked(buttonCommand);
    }
    var tempButton = this;
    addClass(this, "active");
    setTimeout(function() {
      removeClass(tempButton, "active");
    }, 100);
  };
  data = buttons[i].getAttribute('data-value');
  addKeyPress(data, buttons[i]);
}
function addKeyPress(data, button) {
  if (data.length === 1) {
    //console.log("length 1: ", data);
    listener.simple_combo(data, function() {
      buttonClicked(data);
      addClass(button, "active");
      setTimeout(function() {
        removeClass(button, "active");
      }, 100);
    });
  } else if(data.indexOf('operation') !== -1) {
    //console.log("operation: ", data);
    listener.simple_combo(data.substring(9, 10), function() {
      addClass(button, "active");
      setTimeout(function() {
        removeClass(button, "active");
      }, 100);
      buttonClicked(data);

    });
  } else if (data.indexOf('special(') !== -1) {
    (function() {
      //console.log("special: ", data);
      var parameters = data.substring(7, data.length).split(',');
      var typeCommand = parameters[0].substring(1, parameters[0].length);
      var buttonCommand = parameters[1].substring(0, parameters[1].length - 1);
      // console.log("type: ", typeCommand);
      // console.log("button: ", buttonCommand);
      listener.simple_combo(typeCommand, function() {
        addClass(button, "active");
        setTimeout(function() {
          removeClass(button, "active");
        }, 100);
        buttonClicked(buttonCommand);
      });
    })();
  } else if (data.indexOf('‸') !== -1) {
    //console.log("caret: ", data);
    var command = data.split('(')[0].split('');
    var spacedCommand = command.join(' ');
    listener.sequence_combo(spacedCommand, function() {
      addClass(button, "active");
      setTimeout(function() {
        removeClass(button, "active");
      }, 100);
      buttonClicked(data);
    });
  }
}
function buttonClicked(data) {
  var caret = '‸';
  var input = document.getElementById('expression');
  if (data.indexOf('move') !== -1) {
    getMovement(input, data, caret);
  } else if (data.indexOf('backspace') !== -1) {
    deleteStuff(input, caret);
  } else if (data.indexOf('operation') !== -1) {
    performOperation(input, data, caret);
  } else if (data.indexOf('clear') !== -1) {
    clearHistory();
  } else if (data != 'submit') {
    appendInput(input, data, caret);
  } else {
    setTimeout(calculate(), 150);
  }
}
function getMovement(input, data, caret) {
  var inputValue = input.value;
  var caretIndex = inputValue.indexOf(caret);
  var direction = data.substring(5, data.length);
  var movement = 0;
  var regex = null;
  if (direction === 'right') {
    regex = /[a-z]|\(/i;
    movement = 1;
    while (shouldSkip(inputValue.charAt(caretIndex + movement + 1), regex)) {
      movement++;
    }
  } else if (direction === 'left') {
    regex = /[a-z]/i;
    do {
      movement--;
    }
    while (shouldSkip(inputValue.charAt(caretIndex + movement - 1), regex));
  } else if (direction === 'up') {
    regex = /[^(]/g;
    movement = -1;
    while (shouldSkip(inputValue[caretIndex + movement - 1], regex)) {
      movement--;
    }
  } else if (direction === 'down') {
    regex = /[^\)]/g;
    movement = 1;
    while (shouldSkip(inputValue[caretIndex + movement + 1], regex)) {
      movement++;
    }
  }
  inputValue = inputValue.replace(caret, '');
  inputValue = inputValue.substring(0, caretIndex + movement).replace(caret, '') +
      caret + inputValue.substring(caretIndex + movement, inputValue.length).replace(caret, '');
  input.value = inputValue;
  UpdateInput.Update();
}
function deleteStuff(input, caret) {
  var inputValue = input.value;
  var caretIndex = inputValue.indexOf(caret);
  inputValue = inputValue.replace(caret, '');
  if (inputValue[caretIndex - 1] === '(' ||
      !!inputValue.match(/([a-z]|:|=)/i)) {
    var movement = -1;
    regex = /([a-z]|:|=)/i;
    while (shouldSkip(inputValue.charAt(caretIndex + movement - 1), regex)) {
      movement--;
    }
    var parentheseCount = 1;
    var closingParenIndex = inputValue.length;
    for (var i = caretIndex; i < inputValue.length; i++) {
      if (inputValue[i] === '(') {
        parentheseCount++;
      } else if (inputValue[i] === ')') {
        parentheseCount--;
        if (parentheseCount === 0) {
          closingParenIndex = i;
          break;
        }
      }
    }
    var firstPart = inputValue.substring(0, caretIndex + movement);
    var secondPart = inputValue.substring(caretIndex, closingParenIndex);
    var thirdPart = inputValue.substring(closingParenIndex + 1, inputValue.length);
    inputValue = firstPart + caret + secondPart + thirdPart;
    input.value = inputValue;
  } else {
    var firstPartReg = inputValue.substring(0, caretIndex - 1);
    var secondPartReg = inputValue.substring(caretIndex, inputValue.length);
    inputValue = firstPartReg + caret + secondPartReg;
    input.value = inputValue;
  }
  UpdateInput.Update();
}
function performOperation(input, data, caret) {
  var inputValue = input.value;
  if (inputValue.length !== 1) {
    appendInput(input, data.substring(9, data.length), caret);
  } else {
    var calculatedResults = document.getElementsByClassName('calculatedResult');
    var calculatedResult = calculatedResults[calculatedResults.length - 2];
    appendInput(input, '(' + calculatedResult.getAttribute('data-input') + ')', caret);
    appendInput(input, data.substring(9, data.length), caret);
  }
}
function clearHistory() {
  var calcHistory = document.getElementById('calculationHistory');
  var outputs = document.getElementsByClassName('outputWrapper');
  for (var i = 0; i < outputs.length; i++) {
    calcHistory.removeChild(outputs[0]);
  }
}
function appendInput(input, data, caret) {
  var newInputValue = input.value;
  var caretPosition = newInputValue.indexOf(caret);
  newInputValue = newInputValue.replace(caret, '');
  input.value = newInputValue.substring(0, caretPosition) + data;
  if (data.indexOf(caret) === -1 ) {
    input.value += caret;
  }
  input.value += newInputValue.substring(caretPosition, newInputValue.length);
  UpdateInput.Update();
}
function shouldSkip(str, regex) {
  if (str) {
    return (str.length === 1 && !!str.match(regex));
  }
  return false;
}
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className);
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
function addClass(el, className) {
  if (el.classList)
    el.classList.add(className);
  else if (!hasClass(el, className)) el.className += " " + className;
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className);
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    el.className=el.className.replace(reg, ' ');
  }
}
