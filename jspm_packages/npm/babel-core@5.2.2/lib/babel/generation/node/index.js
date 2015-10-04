/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.__esModule = true;

var _whitespace = require("./whitespace");

var _whitespace2 = _interopRequireDefault(_whitespace);

var _import = require("./parentheses");

var parens = _interopRequireWildcard(_import);

var _each = require("lodash/collection/each");

var _each2 = _interopRequireDefault(_each);

var _some = require("lodash/collection/some");

var _some2 = _interopRequireDefault(_some);

var _import2 = require("../../types");

var t = _interopRequireWildcard(_import2);

var find = function find(obj, node, parent) {
  if (!obj) return;
  var result;

  var types = Object.keys(obj);
  for (var i = 0; i < types.length; i++) {
    var type = types[i];

    if (t.is(type, node)) {
      var fn = obj[type];
      result = fn(node, parent);
      if (result != null) break;
    }
  }

  return result;
};

var Node = (function () {
  function Node(node, parent) {
    _classCallCheck(this, Node);

    this.parent = parent;
    this.node = node;
  }

  Node.isUserWhitespacable = function isUserWhitespacable(node) {
    return t.isUserWhitespacable(node);
  };

  Node.needsWhitespace = function needsWhitespace(node, parent, type) {
    if (!node) return 0;

    if (t.isExpressionStatement(node)) {
      node = node.expression;
    }

    var linesInfo = find(_whitespace2["default"].nodes, node, parent);

    if (!linesInfo) {
      var items = find(_whitespace2["default"].list, node, parent);
      if (items) {
        for (var i = 0; i < items.length; i++) {
          linesInfo = Node.needsWhitespace(items[i], node, type);
          if (linesInfo) break;
        }
      }
    }

    return linesInfo && linesInfo[type] || 0;
  };

  Node.needsWhitespaceBefore = function needsWhitespaceBefore(node, parent) {
    return Node.needsWhitespace(node, parent, "before");
  };

  Node.needsWhitespaceAfter = function needsWhitespaceAfter(node, parent) {
    return Node.needsWhitespace(node, parent, "after");
  };

  Node.needsParens = function needsParens(node, parent) {
    if (!parent) return false;

    if (t.isNewExpression(parent) && parent.callee === node) {
      if (t.isCallExpression(node)) return true;

      var hasCall = _some2["default"](node, function (val) {
        return t.isCallExpression(val);
      });
      if (hasCall) return true;
    }

    return find(parens, node, parent);
  };

  Node.needsParensNoLineTerminator = function needsParensNoLineTerminator(node, parent) {
    if (!parent) return false;

    // no comments
    if (!node.leadingComments || !node.leadingComments.length) {
      return false;
    }

    return t.isTerminatorless(parent);
  };

  return Node;
})();

exports["default"] = Node;

_each2["default"](Node, function (fn, key) {
  Node.prototype[key] = function () {
    // Avoid leaking arguments to prevent deoptimization
    var args = new Array(arguments.length + 2);

    args[0] = this.node;
    args[1] = this.parent;

    for (var i = 0; i < args.length; i++) {
      args[i + 2] = arguments[i];
    }

    return Node[key].apply(null, args);
  };
});
module.exports = exports["default"];