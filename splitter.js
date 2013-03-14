(function() {

  // Variables
  var parent;
  var panels = {};
  var splitters = {};
  var parentOffset = 0;
  var width = 0;
  var active = false;
  var offset = {};
  var last = {
    pos: 0,
    width: 0
  };
  var win;

  var Panel = function(options) {
    this.id = options.id;
    this.el = options.el;
    this.min = options.min || 0;
    this.max = options.max || Infinity;
    this.width = options.width || 0;
    this.pos = 0;

    if (this.id === "left") {
      this.left = panels.left;
      this.right = panels.center;
    }
    else if (this.id === "right") {
      this.left = panels.center;
      this.right = panels.right;
    }

  };

  Panel.prototype.resize = function(width, relative) {
    if (relative) { this.width += width; }
    else { this.width = width; }
    this.el.style.width = this.width + "px";
  }

  Panel.prototype.move = function(position, relative) {
    if (relative) { this.pos += position}
    else { this.pos = position }
    this.el.style.left = this.pos + "px";
  }


  // Node-webkit
  if (typeof(window) !== "undefined") {
    console.log(global);
    var gui = global.gui;
    win = gui.Window.get();
  }
  else {
    win = window;
  }

  // If used in Node-Webkit, set `global.document = document` in the main js file.
  var doc;
  if (typeof(document) !== "undefined") {
    doc = global.document;
  }
  else {
    doc = document;
  }
  var body = doc.body;


  // Move `splitter` to `pos`
  var resize = function(splitter, pos) {

    var expandWindow = true;

    // Left min
    if (pos < splitter.left.min + offset.left) {
      pos = splitter.left.min + offset.left;
    }

    // Left max
    else if (pos > splitter.left.max + offset.left) {
      pos = splitter.left.max + offset.left;
    }

    if (splitter.id === "right") {

      expandWindow = false;

      // Right min
      if (offset.right - pos < splitter.right.min) {
        expandWindow = true;
      }

      // Right max
      else if (offset.right - pos > splitter.right.max) {
        pos = offset.right - splitter.right.max;
      }
    }

    // Calculate diff
    diff = pos - last.pos;
    if (diff === 0) {
      splitter.pos = last.pos = pos;
      return true;
    }

    // Right Splitter
    if (splitter.id === "right") {
      panels.center.resize(pos-offset.left);
      panels.right.move(pos);
      splitters.right.move(pos);
    }

    // Left splitter
    else if (splitter.id === "left") {

      // Move splitters
      splitters.left.move(pos);
      splitters.right.move(diff, true);

      // Move and resize panels
      panels.left.resize(pos - offset.left);
      panels.center.move(pos);
      panels.right.move(splitters.right.pos);
    }

    if (expandWindow) {
      // Resize window frame
      width +=  diff;
      win.width = width;
      offset.right = width;
    }

    // Save position
    splitter.pos = last.pos = pos;

  };

  // Calculate position of cursor on parent.
  getPos = function(clientX) {
    pos = clientX - parentOffset;
    if (pos < 0) {
      pos = 0;
    }
    else if (pos > width) {
      pos = width;
    }
    return pos;
  };

  // Mouse Events
  var mouse = {

    down: function(event) {
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
      last.pos = getPos(event.clientX);
      body.className = "dragging";
      down = true;
    },

    move: function(event) {
      if (active) {
        pos = getPos(event.clientX);
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

    panels.left = new Panel(options.panels.left);
    panels.center = new Panel(options.panels.center);
    panels.right = new Panel(options.panels.right);

    minWidth = options.minWidth;

    splitters.left = new Panel({
      id: "left",
      el: doc.createElement("div")
    });

    splitters.right = new Panel({
      id: "right",
      el: doc.createElement("div")
    });

    // Add splitters to DOM
    splitters.left.el.className = "splitter split-left";
    splitters.right.el.className = "splitter split-right";
    panels.left.el.insertAdjacentElement('afterend', splitters.left.el);
    panels.center.el.insertAdjacentElement('afterend', splitters.right.el);

    // Get initial position from CSS
    splitters.left.pos = splitters.left.el.offsetLeft;
    splitters.right.pos = splitters.right.el.offsetLeft;

    // Link splitter objects to elements
    splitters.left.el.obj = splitters.left;
    splitters.right.el.obj = splitters.right;

    // Get width of parent
    width = parent.offsetWidth;

    // Bind events
    splitters.left.el.onmousedown = mouse.down;
    splitters.right.el.onmousedown = mouse.down;
    doc.onmousemove = mouse.move;
    doc.onmouseup = mouse.up;

    // Adjust splitters on resize
    window.onresize = function(event) {

      // Only run if triggered by user
      if (!active) {

        width = parent.offsetWidth;
        diff = width - last.width;

        if (diff !== 0) {

          // Shrinking window
          if (diff < 0) {

            // Check panels.right for min width
            if (panels.right.el.offsetWidth <= panels.right.min) {

              panels.center.resize(diff, true);
              panels.right.move(diff, true);
              splitters.right.move(diff, true);

            }

          }

          last.width = width;
        }
      }
    };

  };

  var exports = {
    init: init,
    panels: panels,
    splitters: splitters
  }


  if (typeof(module) !== "undefined") {
    module.exports = exports;
  }
  else {
    window.Splitter = exports;
  }

}());
