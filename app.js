global.document = document;
global.gui = require("nw.gui");

var Splitter = require("./splitter");

var $ = function(id) {
  return document.getElementById(id);
};

Splitter({
  
  parent: $("parent"),
  panels: {
    
    left: {
      el: $("left"),
      min: 100,
      max: 300
    },
    
    center: {
      el: $("center"),
      min: 100,
      max: 400
    },
    
    right: {
      el:$("right"),
      min: 200,
      max: Infinity
    }
    
  }
});