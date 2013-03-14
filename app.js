global.document = document;
global.gui = require("nw.gui");

var Splitter = require("./splitter");

var $ = function(id) {
  return document.getElementById(id);
};

Splitter.init({

  minWidth: 950,
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
