define(function (require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var Mirror = require("../worker/mirror").Mirror;
  var linter = require("htmlhint");

  var WorkerModule = exports.WorkerModule = function (sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
    this.setOptions();
  };

  oop.inherits(WorkerModule, Mirror);


  (function () {
    this.onUpdate = function () {
      var value = this.doc.getValue();
      var errors = [];
      var results = linter.HTMLParser(value);

      for (var i = 0; i < results.length; i++) {
        var error = results[i];
        // Convert to ACE gutter annotation
        errors.push({
          row: error.line - 1,
          column: error.character,
          text: error.message,
          type: "error" | "warning" | "info"
        });
      }
      this.sender.emit("lint", errors);
    };
  }).call(WorkerModule.prototype);

});