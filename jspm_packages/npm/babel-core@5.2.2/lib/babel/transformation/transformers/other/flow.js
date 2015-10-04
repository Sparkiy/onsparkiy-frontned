/* */ 
"format cjs";
"use strict";

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === "object" && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } };

exports.__esModule = true;
exports.shouldVisit = shouldVisit;
exports.Flow = Flow;
exports.ClassProperty = ClassProperty;
exports.Class = Class;
exports.TypeCastExpression = TypeCastExpression;
exports.ImportDeclaration = ImportDeclaration;
exports.ExportDeclaration = ExportDeclaration;

var _import = require("../../../types");

var t = _interopRequireWildcard(_import);

function shouldVisit(node) {
  return node.isType || node.optional || node["implements"] || node.typeAnnotation || t.isFlow(node);
}

function Flow(node) {
  this.remove();
}

function ClassProperty(node) {
  node.typeAnnotation = null;
  if (!node.value) this.remove();
}

function Class(node) {
  node["implements"] = null;
}

exports.Function = function (node) {
  for (var i = 0; i < node.params.length; i++) {
    var param = node.params[i];
    param.optional = false;
  }
};

function TypeCastExpression(node) {
  return node.expression;
}

function ImportDeclaration(node) {
  if (node.isType) this.remove();
}

function ExportDeclaration(node) {
  if (this.get("declaration").isTypeAlias()) this.remove();
}