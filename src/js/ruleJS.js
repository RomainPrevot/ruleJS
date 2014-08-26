/*
* TODO:
* 1) error handling
* 2) tests
* */

 var ruleJS = (function () {
  'use strict';

  /**
   * current version
   * @type {string}
   */
  var version = '0.0.1';

  /**
   * formulas delivered by formulaJS library
   * contains most of Microsoft Excel formula functions
   * @type {Window.Formula|*|{}}
   */
  var formulas = Formula || {};

  /**
   * parser object delivered by jison library
   * @type {Parser|*|{}}
   */
  var parser = Parser || {};

  /**
   * helper with methods using by parser
   * @type {{number: number, numberInverted: numberInverted, mathMatch: mathMatch, callFunction: callFunction}}
   */
  var helper = {
    /**
     * check if value is array
     * @param value
     * @returns {boolean}
     */
    isArray: function (value) {
      return Object.prototype.toString.call(value) === '[object Array]';
    },
    /**
     * get number
     * @param  {Number|String} num
     * @returns {Number}
     */
    number: function (num) {
      switch (typeof num) {
        case 'number':
          return num;
        case 'string':
          if (!isNaN(num)) {
            return parseInt(num, 10);
          }
      }
      return num;
    },

    /**
     * invert number
     * @param num
     * @returns {Number}
     */
    numberInverted: function(num) {
      return this.number(num) * (-1);
    },

    /**
     * match math operation
     * @param {String} type
     * @param {Number} number1
     * @param {Number} number2
     * @returns {*}
     */
    mathMatch: function (type, number1, number2) {
      var result;

      number1 = !isNaN(number1) ? parseInt(number1, 10) : 0;
      number2 = !isNaN(number2) ? parseInt(number2, 10) : 0;

      switch (type) {
        case '+':
          result = number1 + number2;
          break;
        case '-':
          result = number1 - number2;
          break;
        case '/':
          result = number1 / number2;
          if (value == Infinity || isNaN(result)) {
            result = 0;
          }
          break;
        case '*':
          result = number1 * number2;
          break;
        case '^':
          result = Math.pow(number1, number2);
          break;
      }

      return result;
    },

    /**
     * call function from Formula
     * @param {String} fn
     * @param {Array} args
     * @returns {*}
     */
    callFunction: function (fn, args) {
      fn = fn.toUpperCase();
      args = args || [];

      if (formulas[fn]) {
        return formulas[fn].apply(this, args);
      }
    },

    /**
     * get variable
     * @param {Array} args
     * @returns {*}
     */
    callVariable: function (args) {
      args = args || [];
      var str = args[0];

      if (str) {
        str = str.toUpperCase();
        if (formulas[str]) {
          return ((typeof formulas[str] === 'function') ? formulas[str].apply(this, args) : formulas[str]);
        }
      }

      return false;
    }
  };

  /**
   * parse input string using parser
   * @param {String} input
   * @returns {Object} {{error: *, result: *}}
   */
  var parse = function (input) {
    var result = null,
        error = null;

    try {
      result = parser.parse(input);
      error = null;
    } catch (ex) {
      error = ex.message;
    }

    return {
      error: error,
      result: result
    }
  };

  return {
    version: version,
    formulas: formulas,
    helper: helper,
    parse: parse
  };
})();

/*
if (typeof(window) !== 'undefined') {
  window.FormulaParser = function(handler) {
    var formulaLexer = function () {};
    formulaLexer.prototype = parser.lexer;

    var formulaParser = function () {
      this.lexer = new formulaLexer();
      this.yy = {};
    };

    formulaParser.prototype = parser;
    var newParser = new formulaParser;
    newParser.setObj = function(obj) {
      newParser.yy.obj = obj;
    };

    newParser.yy.handler = handler;
    return newParser;
  };
}
*/