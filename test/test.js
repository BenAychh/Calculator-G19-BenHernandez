var code = require('../calculator');
var expect = require('chai').expect;
  describe('It correctly parses two number basic functions', function() {
    it('Handles +, -, * and /', function() {
      expect(code.calculate('20 + 5')).to.equal(25);
      expect(code.calculate('20 - 5')).to.equal(15);
      expect(code.calculate('20 * 5')).to.equal(100);
      expect(code.calculate('20 / 5')).to.equal(4);
    });
  });
  describe('It correctly handles trig functions', function() {
    it('correctly handles trig and arctrig functions', function() {
      expect(code.calculate('sin(30)', 'd')).to.equal(Math.sin(Math.pi/6));
      expect(code.calculate('sin(pi / 6)', 'r')).to.equal(Math.sin(Math.pi/6));
      expect(code.calculate('cos(30)', 'd')).to.equal(Math.cos(Math.pi/6));
      expect(code.calculate('cos(pi / 6)', 'r')).to.equal(Math.cos(Math.pi/6));
      expect(code.calculate('tan(30)', 'd')).to.equal(Math.tan(Math.pi/6));
      expect(code.calculate('tan(pi / 6)', 'r')).to.equal(Math.tan(Math.pi/6));
    });
  });
  describe('it correctly parses three number basic functions', function() {
    it('handles combinations of +, -, * and /', function() {
      expect(code.calculate('20 + 10 + 5')).to.equal(35);
      expect(code.calculate('20 + 10 - 5')).to.equal(25);
      expect(code.calculate('20 + 10 * 5')).to.equal(70);
      expect(code.calculate('20 + 10 / 5')).to.equal(25);
      expect(code.calculate('20 - 10 + 5')).to.equal(15);
      expect(code.calculate('20 - 10 - 5')).to.equal(5);
      expect(code.calculate('20 - 10 * 5')).to.equal(-50);
      expect(code.calculate('20 - 10 / 5')).to.equal(18);
    });
  });
  describe('it correctly parses parentheses and exponents', function() {
    it('does parenthese first', function() {
      expect(code.calculate('(5 + 7) * 10')).to.equal(120);
    });
    it('handles exponents correctly', function() {
      expect(code.calculate('(5 + 7)^2')).to.equal(144);
      expect(code.calculate('(5 + 7)^3')).to.equal(1728);
    });
    it('handles parentheses and exponents correctly', function() {
      expect(code.calculate('((2 + 3) * 3)^3')).to.equal(3375);
    });
  });
  describe('It correctly parses crazy functions', function() {
    it('handles combinations of +, -, * and /', function() {
      expect(code.calculate('20 + 10 + 5 / sin(30)', 'd')).to.equal(20 + 10 + 5 / Math.sin(30));
      expect(code.calculate('20 + 10 - 5 * (2 + 3)^2')).to.equal(-95);
      expect(code.calculate('20^3 + 10 * 5 - sin(50)', 'd')).to.equal(Math.pow(20,3) + 10 * 5 - Math.sin(50 * 2 * Math.pi / 180));
    });
  });
