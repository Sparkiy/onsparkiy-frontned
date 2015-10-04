/* */ 
"format cjs";
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.__esModule = true;

var _includes = require("lodash/collection/includes");

var _includes2 = _interopRequireDefault(_includes);

var _traverse = require("../traversal");

var _traverse2 = _interopRequireDefault(_traverse);

/**
 * This class is responsible for traversing over the provided `File`s
 * AST and running it's parent transformers handlers over it.
 */

var TransformerPass = (function () {
  function TransformerPass(file, transformer) {
    _classCallCheck(this, TransformerPass);

    this.shouldTransform = !transformer.shouldVisit;
    this.transformer = transformer;
    this.handlers = transformer.handlers;
    this.skipKey = transformer.skipKey;
    this.file = file;
    this.ran = false;
  }

  TransformerPass.prototype.canTransform = function canTransform() {
    var transformer = this.transformer;

    var opts = this.file.opts;
    var key = transformer.key;

    // internal
    if (key[0] === "_") return true;

    // blacklist
    var blacklist = opts.blacklist;
    if (blacklist.length && _includes2["default"](blacklist, key)) return false;

    // whitelist
    var whitelist = opts.whitelist;
    if (whitelist) return _includes2["default"](whitelist, key);

    // stage
    var stage = transformer.metadata.stage;
    if (stage != null && stage >= opts.stage) return true;

    // optional
    if (transformer.metadata.optional && !_includes2["default"](opts.optional, key)) return false;

    return true;
  };

  TransformerPass.prototype.checkPath = function checkPath(path) {
    if (this.shouldTransform || this.ran) return;

    this.shouldTransform = this.transformer.shouldVisit(path.node);
  };

  TransformerPass.prototype.transform = function transform() {
    if (!this.shouldTransform) return;

    var file = this.file;

    file.log.debug("Start transformer " + this.transformer.key);

    _traverse2["default"](file.ast, this.handlers, file.scope, file);

    file.log.debug("Finish transformer " + this.transformer.key);

    this.ran = true;
  };

  return TransformerPass;
})();

exports["default"] = TransformerPass;
module.exports = exports["default"];