(function() {

  var init = function() {

    var $ = function(id) {
      return document.getElementById(id);
    };

    Splitter.init({

      parent: $("parent"),
      panels: {

        left: {
          el: $("left"),
          min: 150,
          width: 150,
          max: 400
        },

        center: {
          el: $("center"),
          min: 250,
          width: 250,
          max: 850
        },

        right: {
          el:$("right"),
          min: 550,
          width: 550,
          max: Infinity
        }

      }
    });
  };

  // Using Node.js
  if (typeof(require) !== "undefined") {
    gui = require("nw.gui");
    global.document = document;
    global.gui = require("nw.gui");
    Splitter = require("./splitter");
    init();
  }

  // Using a browser
  else {
    script = document.createElement("script")
    script.src = "splitter.js";
    script.onload = init;
    document.body.appendChild(script);
  }

}());
