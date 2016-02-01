var listener = new window.keypress.Listener();
var buttons = document.getElementsByClassName('button');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function() {
    buttonClicked(this.getAttribute('data-value'));
  };
  data = buttons[i].getAttribute('data-value');
  addKeyPress(data);

}
function addKeyPress(data) {
  if (data.length === 1) {
    listener.simple_combo(data, function() {
      buttonClicked(data);
    });
  } else if(data.indexOf('operation') !== -1) {
    listener.simple_combo(data.substring(9, 10), function() {
      buttonClicked(data);
    });
  } else if (data.indexOf('‸') !== -1) {
    var command = data.split('(')[0].split('');
    var spacedCommand = command.join(' ');
    listener.sequence_combo(spacedCommand, function() {
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
  if (inputValue.charAt(caretIndex - 1) === '(') {
    var movement = -1;
    regex = /[a-z]/i;
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
    appendInput(input, data.substring(9, 10), caret);
  } else {
    var calculatedResults = document.getElementsByClassName('calculatedResult');
    var calculatedResult = calculatedResults[calculatedResults.length - 2];
    appendInput(input, calculatedResult.getAttribute('data-input'), caret);
    appendInput(input, data.substring(9, 10), caret)
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
  return str.length === 1 && !!str.match(regex);
}
listener.simple_combo('enter', function() {
  buttonClicked('submit');
});
listener.simple_combo('left', function() {
  buttonClicked('move-left');
});
listener.simple_combo('right', function() {
  buttonClicked('move-right');
});
listener.simple_combo('backspace', function() {
  buttonClicked('backspace');
});
listener.simple_combo('(', function() {
  buttonClicked('(‸)');
});
listener.simple_combo('p i', function() {
  buttonClicked('pi');
});
