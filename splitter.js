(function() {
  
  // Variables
  var Doc = document;
  var body = Doc.body;
  var parent;
  var panels = {};
  var splitters = {};
  var parentOffset = 0;
  var width = 0;
  var active = false;
  var offset = {};
  
  
  // Needs to be updated when page is resized.
  var setWidth = function() {
    width = parent.offsetWidth;
  };
  
  
  // Move `splitter` to `pos`
  var resize = function(splitter, pos, bubble) {
    
    var changeLeft = true;
    var changeRight = true;

    // Left min
    if (pos < splitter.left.min + offset.left) {
      pos = splitter.left.min + offset.left;
    }

    // Left max
    else if (pos > splitter.left.max + offset.left) {
      pos = splitter.left.max + offset.left;
    }

    // Right min
    if (offset.right - pos < splitter.right.min) {
      pos = offset.right - splitter.right.min;
    }

    // Right max
    else if (offset.right - pos > splitter.right.max) {
      pos = offset.right - splitter.right.max;
    }
    
    // Set DOM styles
    splitter.left.el.style.width = pos - offset.left + "px";
    splitter.right.el.style.width = offset.right - pos + "px";
    splitter.right.el.style.left = pos + "px";
    splitter.el.style.left = pos + "px";
    
    // Save position
    splitter.pos = pos;
    
  };
  
  
  // Mouse Events
  var mouse = {
    
    down: function() {
      active = this.obj;
      offset = {
        left: 0,
        right: width
      };
      if (active.id === "right") {
        offset.left = splitters.left.pos;
      }
      else if (active.id === "left") {
        offset.right = splitters.right.pos;
      }
      body.className = "dragging";
      down = true;
    },
    
    move: function(event) {
      if (active) {
        pos = event.clientX - parentOffset;
        if (pos < 0) {
          pos = 0;
        }
        else if (pos > width) {
          pos = width;
        }
        resize(active, pos);
      }
    },
    
    up: function() {
      body.className = "";
      active = false;
    }
    
  };
  
  var init = function(options) {
    parent = options.parent;
    panels = options.panels;
    
    splitters = {
    
      left: {
        id: "left",
        el: Doc.createElement("div"),
        pos: 0,
        left: panels.left,
        right: panels.center
      },
    
      right: {
        id: "right",
        el: Doc.createElement("div"),
        pos: 0,
        left: panels.center,
        right: panels.right
      }
    
    };
    
    // Add splitters to DOM
    splitters.left.el.className = "splitter split-left";
    splitters.right.el.className = "splitter split-right";
    left.insertAdjacentElement('afterend', splitters.left.el);
    center.insertAdjacentElement('afterend', splitters.right.el);
  
    // Get initial position from CSS
    splitters.left.pos = splitters.left.el.offsetLeft;
    splitters.right.pos = splitters.right.el.offsetLeft;
  
    // Link splitter objects to elements
    splitters.left.el.obj = splitters.left;
    splitters.right.el.obj = splitters.right;
    
    // Get width of parent
    setWidth();
    
    // Bind events
    splitters.left.el.onmousedown = mouse.down;
    splitters.right.el.onmousedown = mouse.down;
    Doc.onmousemove = mouse.move;
    Doc.onmouseup = mouse.up;
    
    // Adjust splitters on resize
    window.onresize = function(event) {
      setWidth();
      resize(splitters.left, pos);
    };
    
  };
  
  
  if (typeof(module) !== "undefined") {
    module.exports = init;
  }
  else {
    window.Splitter = init;
  }

}());

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
