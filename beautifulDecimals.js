function Beautify(number) {
  var sign = '';
  if (number < 0) {
    sign = '-';
  }
  var isSquared = false;
  var isPi = false;
  var isNothing = true;
  var isFraction = false;
  var num = 0;
  var den = 0;
  fraction = new Fraction(number);
  num = fraction.n;
  den = fraction.d;
  if (num > 10000) {
    fraction = new Fraction(Math.pow(number, 2));
    if (fraction.n < 10000) {
      isSquared = true;
      isNothing = false;
      num = Math.sqrt(fraction.n);
      den = Math.sqrt(fraction.d);
    } else {
      fraction = new Fraction(math.eval(number + '/pi'));
      if (fraction.n < 10000) {
        isNothing = false;
        isPi = true;
        num = fraction.n;
        den = fraction.d;
      } else {
        num = number;
      }
    }
  } else {
    isFraction = true;
    isNothing = false;
  }
  this.toString = function() {
    if (isNothing) {
      //console.log("nothing");
      return num;
    }
    if (isFraction) {
      //console.log("fraction");
      if (fraction.d === 1) {
        return sign + fraction.n;
      } else {
        return num + " / " + den;
      }
    }
    if (isPi) {
      //console.log("pi");
      var string = '';
      if (den === 1) {
        if (num === 1) {
          string += sign + 'pi';
        } else {
          string += sign + + num + 'pi';
        }
      } else {
        if (num === 1) {
          string += sign + 'pi/' + den ;
        } else {
          string += sign + '(' + num + 'pi)/' + den;
        }
      }
      return string;
    }
    if (isSquared) {
      //console.log("squared");
      var numS = '';
      if (num % 1 === 0) {
        numS = num;
      } else {
        numS += 'sqrt(' + Math.round(Math.pow(num, 2)) + ')';
       }
      var denS = '';
      if (den % 1 !== 0) {
        if (numS === 1) {
          numS = 'sqrt(' + Math.round(Math.pow(den, 2)) + ')';
        } else {
          numS = '(' + numS + 'sqrt(' + Math.round(Math.pow(den, 2)) + '))';
        }

        denS = Math.round(Math.pow(den, 2));
      } else {
        denS = den;
      }
      if (den != 1) {
        return sign + numS + " / " + denS;
      }
      else {
        return sign + numS;
      }
    }
  };
}
