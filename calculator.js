//var math = require('./math.min.js');
//var Beautify = require('./beautifulDecimals');
//var Graphing = require('./graphing.js')
var graphingCanvas = document.getElementById('graphing');
var infoCanvas = document.getElementById('info');
var grapher = new Graphing(graphingCanvas);
var infoer = new Info(infoCanvas);
var functions = {};
// Colors in order of graphing sequence
var colors = ['#0000ff', '#009900', '#990099', '#9fa700', '#e8184b'];

/**
 * addLine - Much simpler version of the above where the values are already
 * split.
 * @param  {string} the name of our function 'f(x), etc'
 * @param  {string} equation the equation to be graphed.
 * @param  {string} color    any html-compliant color descriptor.
 * @return {undefined}          description
 */
function addLine(name, equation, color) {
  grapher.addLine(name, equation, color);
  infoer.addLine(name, equation, color);
  return
}

/**
 * removeLine - Removes a line from the graph.
 *
 * @param  {string} expression the line to be removed.
 * @return {undefined}
 */
function removeLine(expression) {
  // If we don't have the command removegraph being passed then we
  // can assume we are getting the equation directly.
  var removegraphIndex = expression.indexOf('removegraph');
  var frStartIndex = expression.indexOf('(', removegraphIndex) + 1;
  var frEndIndex = expression.lastIndexOf(')');
  var functionToRemove = expression.substring(frStartIndex, frEndIndex);
  grapher.removeLine(functionToRemove);
  infoer.removeLine(functionToRemove);
  return functionToRemove;
}

/**
 * calculate - All user input comes through this function to be calculated or
 * processed.
 *
 * @return {undefined}
 */
function calculate() {
  // Grab the input.
  var input = document.getElementById('expression');
  var inputValue = clean(input.value);
  // We are not defining a function so we need to convert things like f(2) to
  // their numerical value.
  if (inputValue.indexOf(':=') === -1) {
    while (inputValue.search(/\b[a-z]\((?!x)/) !== -1) {
      inputValue = evaluateFunctionsAtSpecificValues(inputValue);
    }
  }
  // Check o see if we are doing anything special like defining a function.
  // If something special is being done, that is returned.
  var special = specialProcessor(inputValue);
  // For the MathJax display.
  var precalculated = document.getElementById('precalculated');
  var calculated = document.getElementById('calculated');
  // Nothing special was done, this just needs to be calculated.
  if (special.length === 0) {
    // Evaluate the expression.
    var simpleEvaluation = math.eval(inputValue);
    // Create a beauty object to process the output.
    var beauty = new Beautify(simpleEvaluation);
    // This means that there is a way to beautify the number.
    if (math.abs(beauty.toString() - simpleEvaluation) > 0.00000000001 ||
        isNaN(math.abs(beauty.toString() - simpleEvaluation))) {
      // Put both the beautified math and the decimal in the hidden div.
      precalculated.innerHTML = '`' + beauty.toString() + " = " +
          math.round(simpleEvaluation, 10) + '`';
      // Queue the MathJax processing.
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'precalculated']);
      // After MathJax processing, display the beautified math.
      MathJax.Hub.Queue(function() {
        calculated.innerHTML = precalculated.innerHTML;
      });
    } else {
      // Number can't be beautified, just display it.
      calculated.innerHTML = beauty.toString();
    }
  } else {
    // Something special happen, display what we did.
    calculated.innerHTML = special;
  }
  // Put the focus back on the input bar.
  input.select();
  input.focus();
}

/**
 * clean - cleans the user input.
 *
 * @param  {string} input the raw string from the user.
 * @return {string}       cleaned input.
 */
function clean(input) {
  input = input.replace(/\s/g, '');
  input = input.toLowerCase();
  while (input.search(/[0-9][a-z]/g) !== -1) {
    var index = input.search(/[0-9][a-z]/g);
    var beginning = input.substring(0, index + 1);
    var end = input.substring(index + 1, input.length);
    input = beginning + '*' + end;
  }
  return input;
}
/**
 * evaluateFunctionsAtSpecificValues - Replaces all of the x's in a defined
 * function with the number passed and evaluates it. Example: f(x):= 2x
 * f(3) gets changed to (3)2 and evaluated = 6. Does not work when functions
 * are nested like f(g(2)).
 *
 * @param  {string} expression the function/value to be evaluated.
 * @return {string}            The original string except f(3) is now (6)
 */
function evaluateFunctionsAtSpecificValues(expression) {
  // Searches for 'f(2' where f is any lettter and 2 is anything except x;
  var functionStrings = expression.match(/\b[a-z]\((?!x)/g);
  var specificFunctionString = functionStrings[functionStrings.length - 1];
  // Gets the start of the first function it finds. This probably needs to
  // work backwards in order to support nested functions.
  var specificFunctionStringStart =
      expression.indexOf(specificFunctionString, specificFunctionStringStart);
  // This is the start of the single function to the end of the string.
  var subString =
      expression.substring(specificFunctionStringStart, expression.length);
  // This part goes through and does parentheses tracking to find the end of
  // the current function.
  var parenthesesCount = 0;
  var length = 0;
  for (var i = 0; i < subString.length; i++) {
    if (subString[i] === '(') {
      parenthesesCount++;
    } else if (subString[i] === ')'){
      parenthesesCount--;
      if (parenthesesCount === 0) {
        length = i;
        break;
      }
    }
  }
  // This names the function so we can find it in our global functions object.
  var functionName = subString.substring(0, 2);
  functionName += 'x)';
  // All functions start as f(, that is why we add two to the start.
  var numberStart = specificFunctionStringStart + 2;
  // Length is the number of characters until the matching parentheses.
  var number = subString.substring(2, length);
  // This is why nexted functions aren't working.
  number = math.eval(number);
  // Put parentheses around the evaluated number so the math doesn't change.
  var evaluated = '(' + math.eval(functions[functionName], {x: number}) + ')';
  // Gets the beginning of the string up until f(
  var beginning = expression.substring(0, specificFunctionStringStart);
  // Gets the rest of the string after the final function )
  var end = expression.substring(specificFunctionStringStart +
      length + 1, expression.length);
  // Put it all together.
  return beginning + evaluated + end;
}

/**
 * replaceFunctions - This replaces the function name with the actual function
 * expression so if f(x):=2x then f(x) becomes 2x
 *
 * @param  {string} input the function name.
 * @return {string}       expression with the names replaced with expressions.
 */
function replaceFunctions(input) {
  // Look for f(x) where f is any letter.
  var indexOfFunction = input.search(/\b[a-z]\([^x]/g);
  // We didn't find any named functions, just return the input.
  if (indexOfFunction === -1) {
    return input;
  }
  // functions should always be of the form f(x) so their length is always 4
  var specificFunctionName =
      input.substring(indexOfFunction, indexOfFunction + 4);
  // Grab the equation from our global functions map.
  var specificFunction = functions[specificFunctionName];
  // Everything up until the start of the function name.
  var beginning = input.substring(0, indexOfFunction);
  // Everything after the function name.
  var end = input.substring(indexOfFunction + 4, input.length);
  // The replaced expression.
  var newInput = beginning + specificFunction + end;
  // Recursive so we replace all the f(x)s if there is more than one.
  // (Not sure why there would be.)
  return replaceFunctions(newInput);
}

/**
 * specialProcessor - Checks for special commands.
 *
 * @param  {string} expression the input from the user.
 * @return {string}            How the string was processed.
 */
function specialProcessor(expression) {
  // If the user is removing a function.
  if (expression.indexOf('removegraph') !== -1) {
    return 'removed: ' + removeLine(expression);
  // If the user is defining a function.
  } else if (expression.indexOf(':=') !== -1) {
    // What color are we on?
    var keys = Object.keys(functions);
    var color = colors[keys.length];
    // Split on our definition key"word".
    info = expression.split(':=');
    // Add the function to our global map and graph it.
    functions[info[0]] = info[1];
    addLine(info[0], functions[info[0]], color);
    return 'defined function ' + info[0] + ' := ' + functions[info[0]];
  }
  return '';
}
//module.exports = calculate;
