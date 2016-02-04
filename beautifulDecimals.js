function Beautify(number) {
  // We lose the sign on some conversions so we need to store it.
  var sign = '';
  if (number < 0) {
    sign = '-';
  }
  // How to output the number.
  var isSquared = false;
  var isPi = false;
  var isNothing = true;
  var isFraction = false;
  // Fraction numerator and denominator.
  var num = 0;
  var den = 0;
  // Create a new fraction.
  if ((number + '').indexOf('i')=== -1) {
    fraction = new Fraction(number);
    // Store the results.
    num = fraction.n;
    den = fraction.d;
    // If our fraction numerator is more than 10000, there is probably a better
    // way to represent it.
    if (num > 10000) {
      // trying squaring everything and see if the resultant fraction is nicer.
      fraction = new Fraction(Math.pow(number, 2));
      // It was a square fraction, do some processing.
      if (fraction.n < 10000) {
        isSquared = true;
        isNothing = false;
        // Go back to the original decimals but know its square.
        num = Math.sqrt(fraction.n);
        den = Math.sqrt(fraction.d);
      } // Squaring doesn't simplify either so go ahead and try diving pi.
      else {
        fraction = new Fraction(math.eval(number + '/pi'));
        // pi works, use that.
        if (fraction.n < 10000) {
          isNothing = false;
          isPi = true;
          num = fraction.n;
          den = fraction.d;
        } // there is no way to make this number any prettier.
        else {
          num = number;
        }
      }
    } // This can be represented nicely with a simple fraction.
    else {
      isFraction = true;
      isNothing = false;
    }
  } else {
    num = number;
  }

  /**
   * toString - outputs a MathJax compatible string to printing.
   *
   * @return {string}  MathJax compatible string.
   */
  this.toString = function() {
    // We couldn't make it any prettier, just give back the number.
    if (isNothing) {
      return num;
    }
    // This is a fraction, put the sign back in and output that fraction.
    if (isFraction) {
      if (fraction.d === 1) {
        return sign + fraction.n;
      } else {
        return num + " / " + den;
      }
    }
    // this has pi in it, output that with a pi next to the numerator (if it
    // is a fraction.
    if (isPi) {
      var string = '';
      // The denominator is 1, no need to output as a fraction.
      if (den === 1) {
        // the numerator is 1, no need to print that 1.
        if (num === 1) {
          string += sign + 'pi';
        } else {
          string += sign + num + 'pi';
        }
      } // This pi reprentation is a fraction, display both if needed.
      else {
        // If the numerator is 1, no need to print that 1.
        if (num === 1) {
          string += sign + 'pi/' + den ;
        } else {
          string += sign + '(' + num + 'pi)/' + den;
        }
      }
      return string;
    }
    // This is prettier if we use the square root functions to display it.
    if (isSquared) {
      var numS = '';
      // The denominator is the square.
      if (num % 1 === 0) {
        numS = num;
      } // the numerator is the square, put sqrt so mathjax processes it.
      else {
        numS += 'sqrt(' + Math.round(Math.pow(num, 2)) + ')';
       }
      var denS = '';
      // The denominator is the square, we need to move the square root up
      // to the numerator and rationalize the whole fraction.
      if (den % 1 !== 0) {
        // We don't want to include any 1's in the numerator.
        if (numS === 1) {
          numS = 'sqrt(' + Math.round(Math.pow(den, 2)) + ')';
        } else {
          numS = '(' + numS + 'sqrt(' + Math.round(Math.pow(den, 2)) + '))';
        }
        // Square the denominator to complete the rationalizing.
        denS = Math.round(Math.pow(den, 2));
      } else {
        denS = den;
      }
      // Last minute processing.
      if (den != 1) {
        return sign + numS + " / " + denS;
      }
      else {
        return sign + numS;
      }
    }
  };
}
