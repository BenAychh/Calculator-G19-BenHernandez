// Keypress Listener.
var listener = new window.keypress.Listener();
// Get all of the regular buttons and add the click processing.
var buttons = document.getElementsByClassName('button');
addOnClicks(buttons);
// Get the arrow buttons and add the click processing.
buttons = document.getElementsByClassName('arrowButton');
addOnClicks(buttons);

/**
 * addOnClicks - Adds click and keyboard binding to the buttons.
 *
 * @param  {array of divs} button The array of buttons to add handling to.
 * @return {undefined}
 */
function addOnClicks(button) {
  // Loop through the buttons
  for (var i = 0; i < buttons.length; i++) {
    // Add the click function.
    buttons[i].onclick = function() {
      var data = this.getAttribute('data-value');
      // Non-special buttons are easy to process.
      if (data.indexOf('special(') === -1 ) {
        buttonClicked(this.getAttribute('data-value'));
      } // We have to extract the information because input and keyboards
        // Are different.
      else {
        // special( is 7 characters. Split parameters by ,
        var parameters = data.substring(7, data.length).split(',');
        var buttonCommand = parameters[1].replace(')', '');
        buttonClicked(buttonCommand);
      }
      var tempButton = this;
      // Make the button light up for 100ms
      addClass(this, "active");
      setTimeout(function() {
        removeClass(tempButton, "active");
      }, 100);
    };
    // Add the corresponding key press.
    data = buttons[i].getAttribute('data-value');
    addKeyPress(data, buttons[i]);
  }
}

/**
 * addKeyPress - Maps the keypress input to the correct key.
 *
 * @param  {type} data   description
 * @param  {type} button description
 * @return {type}        description
 */
function addKeyPress(data, button) {
  // Single button commands (like '9') so we can use simple_combo.
  if (data.length === 1) {
    //console.log("length 1: ", data);
    listener.simple_combo(data, function() {
      buttonClicked(data);
      // Light up the corresponding button even though we didn't use the mouse.
      addClass(button, "active");
      setTimeout(function() {
        removeClass(button, "active");
      }, 100);
    });
  } // operations need special processing to use the previous calc result.
  else if(data.indexOf('operation') !== -1) {
    // Operation is 9 characters long.
    listener.simple_combo(data.substring(9, 10), function() {
      addClass(button, "active");
      setTimeout(function() {
        removeClass(button, "active");
      }, 100);
      buttonClicked(data);

    });
  } // Special buttons, key binding is different than internal command.
  else if (data.indexOf('special(') !== -1) {
    // I was having some weird scoping issues.
    (function() {
      //Special is 7 characters long, get parameters including parentheses.
      // parameters are divided by a comma.
      var parameters = data.substring(7, data.length).split(',');
      // The keypress combo is the first part.
      var typeCommand = parameters[0].substring(1, parameters[0].length);
      // The button command is the second part.
      var buttonCommand = parameters[1].substring(0, parameters[1].length - 1);
      // Add a keyboard listener and light up.
      listener.simple_combo(typeCommand, function() {
        addClass(button, "active");
        setTimeout(function() {
          removeClass(button, "active");
        }, 100);
        buttonClicked(buttonCommand);
      });
    })();
  } // Commands with the caret mean that the cursor should end up at the caret
    // location, must include a () to work.
  else if (data.indexOf('‸') !== -1) {
    var command = data.split('(')[0].split('');
    // For keyboard sequences, must be passed as 'c o m m a n d'
    var spacedCommand = command.join(' ');
    listener.sequence_combo(spacedCommand, function() {
      addClass(button, "active");
      //Make the button flash.
      setTimeout(function() {
        removeClass(button, "active");
      }, 100);
      buttonClicked(data);
    });
  }
}

/**
 * buttonClicked - Processes all button clicks by passing on the correct
 * function
 *
 * @param  {string} data is the value of data-input attribute.
 * @return {undefined}
 */
function buttonClicked(data) {
  // How the cursor is delimited
  var caret = '‸';
  var input = document.getElementById('expression');
  if (data.indexOf('move-') !== -1) {
    // Arrow buttons are pressed
    getMovement(input, data, caret);
  } else if (data.indexOf('backspace') !== -1) {
    // Backspace is pressed.
    deleteStuff(input, caret);
  } else if (data.indexOf('operation') !== -1) {
    // Called for mathematical operations.
    performOperation(input, data, caret);
  } else if (data.indexOf('clear') !== -1) {
    // Removes the history
    clearHistory();
  } else if (data != 'submit') {
    // Anything not special just gets added to the input.
    appendInput(input, data, caret);
  } else {
    // Calculate everything after a 150ms delay.
    setTimeout(calculate(), 150);
  }
}

/**
 * getMovement - Moves the cursor through the input.
 *
 * @param  {HTML element} input the hidden [input type=text]
 * @param  {string} data  Which direction we are moving in
 * @param  {string} caret The cursor delimiter
 * @return {type}       description
 */
function getMovement(input, data, caret) {
  var inputValue = input.value;
  var caretIndex = inputValue.indexOf(caret);
  // move- is 5 characters.
  var direction = data.substring(5, data.length);
  var movement = 0;
  var regex = null;
  // We want to skip over words like sin so we aren't breaking up the word.
  if (direction === 'right') {
    // Look for letters or (
    regex = /[a-z]|\(/i;
    movement = 1;
    // As long as we are getting a letter or (, keep moving back.
    while (shouldSkip(inputValue.charAt(caretIndex + movement + 1), regex)) {
      movement++;
    }
  } // We want to skip over words like sin so we aren't breaking the word.
  else if (direction === 'left') {
    //Look for letters.
    regex = /[a-z]/i;
    // Same as setting movement = 1 above, just in a different way.
    // As look as we are getting a letter, keep moving forward.
    do {
      movement--;
    }
    while (shouldSkip(inputValue.charAt(caretIndex + movement - 1), regex));
  } // Up should move to the previous (
  else if (direction === 'up') {
    // Anything not a (
    regex = /[^(]/g;
    movement = -1;
    // Keep going backwards until we get to a (
    while (shouldSkip(inputValue[caretIndex + movement - 1], regex)) {
      movement--;
    }
  } // Up should move to the next )
  else if (direction === 'down') {
    // Anything not a ) should be skipped.
    regex = /[^\)]/g;
    movement = 1;
    // Keep moving forwards until we get to a ).
    while (shouldSkip(inputValue[caretIndex + movement + 1], regex)) {
      movement++;
    }
  }
  // Drop the caret so we can put it somewhere else.
  inputValue = inputValue.replace(caret, '');
  // Reassemble the string with the caret in the new location.
  inputValue =
      inputValue.substring(0, caretIndex + movement).replace(caret, '') +
      caret + inputValue.substring(caretIndex +
          movement, inputValue.length).replace(caret, '');
  // Replace the hidden input with the caret in the correct location.
  input.value = inputValue;
  // Use MathJax to prettify the input.
  UpdateInput.Update();
}

/**
 * deleteStuff - Processes the backspace command.
 *
 * @param  {HTML element} input the hidden [input type=text]
 * @param  {string} caret The cursor delimiter.
 * @return {undefined}
 */
function deleteStuff(input, caret) {
  var inputValue = input.value;
  var caretIndex = inputValue.indexOf(caret);
  inputValue = inputValue.replace(caret, '');
  // We need to backspace over multiple things if we are at ( or a letter or a
  // define sign :=
  if (inputValue[caretIndex - 1] === '(' ||
      !!inputValue.match(/([a-z]|:|=)/i)) {
    // Start moving backwards over any letters or define signs.
    var movement = -1;
    regex = /([a-z]|:|=)/i;
    while (shouldSkip(inputValue.charAt(caretIndex + movement - 1), regex)) {
      movement--;
    }
    // We need to delete the matching parentheses to ( but we can't just use
    // regex to remove ( and ) because math also contains parentheses.
    var parentheseCount = 1;
    var closingParenIndex = inputValue.length;
    // Loop through the next characters until we find the matching )
    for (var i = caretIndex; i < inputValue.length; i++) {
      if (inputValue[i] === '(') {
        parentheseCount++;
      } else if (inputValue[i] === ')') {
        parentheseCount--;
        // Using plus and minus to keep track until we get to matching )
        // If we hit zero, we are at the matching one. (because they all
        // cancelled each other out.)
        if (parentheseCount === 0) {
          closingParenIndex = i;
          break;
        }
      }
    }
    // Reassemble the string without the functions or matching ().
    var firstPart = inputValue.substring(0, caretIndex + movement);
    var secondPart = inputValue.substring(caretIndex, closingParenIndex);
    var thirdPart = inputValue.substring(closingParenIndex + 1, inputValue.length);
    inputValue = firstPart + caret + secondPart + thirdPart;
    input.value = inputValue;
  }
  // This is much easier, if it is just a number, we can just backspace one :p
  else {
    var firstPartReg = inputValue.substring(0, caretIndex - 1);
    var secondPartReg = inputValue.substring(caretIndex, inputValue.length);
    inputValue = firstPartReg + caret + secondPartReg;
    input.value = inputValue;
  }
  // Use MathJax to prettify.
  UpdateInput.Update();
}

/**
 * performOperation - Does stuff such as plus or minus, any operation.
 *
 * @param  {HTML element} input the hidden [input type=text]
 * @param  {string} data  The operation we are performing.
 * @param  {string} caret The cursor delimiter.
 * @return {undefined}       description
 */
function performOperation(input, data, caret) {
  var inputValue = input.value;
  // The user has typed something in, nothing special.
  if (inputValue.length !== 1) {
    appendInput(input, data.substring(9, data.length), caret);
  }
  // The user hasn't typed anything in yet so we have to go get the last
  // calculated result. No error handling if this is first calculation.
  else {
    var calculatedResults =
        document.getElementsByClassName('calculatedResult');
    var calculatedResult =
        calculatedResults[calculatedResults.length - 2];
    appendInput(input,
          '(' + calculatedResult.getAttribute('data-input') + ')', caret);
    appendInput(input, data.substring(9, data.length), caret);
  }
}

/**
 * clearHistory - Clears the history of the calculator.
 *
 * @return {undefined}
 */
function clearHistory() {
  // Just repopulates calcHistory with what was originally there.
  var calcHistory = document.getElementById('calculationHistory');
  calcHistory.innerHTML = '<div id="buffer" class="output" style="visibility:' +
      ' hidden; position: absolute;"></div><div id="precalculated"' +
      ' class="calculatedResult" style="visibility: hidden; position:' +
      ' absolute;"></div> <div class="outputWrapper"> <div class="inputResult' +
      ' output outputBase" onclick="setInput(this)"></div><div class=' +
      '"calculatedResult outputBase" onclick="setInput(this)"></div></div>';
}

/**
 * appendInput - Appends the user input to the hidden input
 *
 * @param  {HTML element} input the hidden [input type=text]
 * @param  {string} data  The user input.
 * @param  {string} caret The cursor delimiter
 * @return {undefined}
 */
function appendInput(input, data, caret) {
  var newInputValue = input.value;
  var caretPosition = newInputValue.indexOf(caret);
  newInputValue = newInputValue.replace(caret, '');
  console.log(newInputValue);
  input.value = newInputValue.substring(0, caretPosition) + data;
  // If there is not caret in button pressed, just append a caret. Otherwise
  // the caret will be placed by the button itself.
  if (data.indexOf(caret) === -1 ) {
    input.value += caret;
  }
  input.value += newInputValue.substring(caretPosition, newInputValue.length);
  UpdateInput.Update();
}

/**
 * shouldSkip - description
 *
 * @param  {string} str   Usually a letter.
 * @param  {regex} regex  What to match.
 * @return {bool}         True if a match.
 */
function shouldSkip(str, regex) {
  if (str) {
    return (str.length === 1 && !!str.match(regex));
  }
  return false;
}

// Taken from http://jaketrent.com/post/addremove-classes-raw-javascript/
/**
 * hasClass - Checks to see if an HTML Element has a class.
 *
 * @param  {HTML Element} el
 * @param  {string} className The class to check.
 * @return {bool}           true if it has the clsas.
 */
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className);
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

/**
 * addClass - Adds a class to an HTML element.
 *
 * @param  {HTML Element} el
 * @param  {string} className The class to add.
 * @return {undefined}
 */
function addClass(el, className) {
  if (el.classList)
    el.classList.add(className);
  else if (!hasClass(el, className)) el.className += " " + className;
}

/**
 * removeClass - Removes a class from an HTML Element.
 *
 * @param  {HTML Element} el
 * @param  {string} className The class to remove.
 * @return {undefined}
 */
function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className);
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    el.className=el.className.replace(reg, ' ');
  }
}

/**
 * toggleGraph - Special button for the graph/table toggle
 *
 * @param  {HTML Element} div
 * @return {undefined}
 */

function toggleGraph(div) {
  var card = document.getElementById('card');
  if (hasClass(card, 'flipped')) {
    removeClass(card, 'flipped');
    //div.innerHTML = '<img src="images/table.png" alt="graph" />';
  } else {
    addClass(card, 'flipped');
    //div.innerHTML = '<img src="images/graph.png" alt="graph" />';
  }
  if (hasClass(div, 'flipped')) {
    removeClass(div, 'flipped');
  } else {
    addClass(div, 'flipped');
  }
}
