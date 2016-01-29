function clean(input) {
  input = input.replace(/\s/g, '');
  while (input.search(/[0-9][a-z]/g) !== -1) {
    var index = input.search(/[0-9][a-z]/g);
    var beginning = input.substring(0, index + 1);
    var end = input.substring(index + 1, input.length);
    input = beginning + '*' + end;
  }
  return input;
}
var expression = 'f(2g(3))';
console.log(clean(expression));
var functionStrings = expression.match(/\b[a-z]\((?!x)/g);
console.log(functionStrings);
