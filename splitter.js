(function() {

  var Doc = document;

  var $ = function(id) {
    return Doc.getElementById(id);
  };

  var body = Doc.body;
  var parent = $("parent");

  var panels = {
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
  };

  var splitters = {
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
  splitters.left.el.className = "splitter split-left";
  splitters.right.el.className = "splitter split-right";
  left.insertAdjacentElement('afterend', splitters.left.el);
  center.insertAdjacentElement('afterend', splitters.right.el);
  splitters.left.pos = splitters.left.el.offsetLeft;
  splitters.right.pos = splitters.right.el.offsetLeft;
  splitters.left.el.obj = splitters.left;
  splitters.right.el.obj = splitters.right;


  var parentOffset = 0;
  var width = 0;
  var active = false;

  var setup = function() {
    width = parent.offsetWidth;
  };

  var resize = function(splitter, pos) {
    var offset = {
      left: 0,
      right: width
    };
    if (splitter.id === "right") {
      offset.left = splitters.left.pos;
    }
    else if (splitter.id === "left") {
      offset.right = splitters.right.pos;
    }

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


    splitter.left.el.style.width = pos - offset.left + "px";
    splitter.right.el.style.width = width - pos + "px";
    splitter.right.el.style.left = pos + "px";
    splitter.el.style.left = pos + "px";
    splitter.pos = pos;
  };

  mousedown = function() {
    active = this.obj;
    offset = parent.offsetLeft;
    body.className = "dragging";
    down = true;
  };

  splitters.left.el.onmousedown = mousedown;
  splitters.right.el.onmousedown = mousedown;


  Doc.onmousemove = function(event) {
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
  };
  Doc.onmouseup = function() {
    body.className = "";
    active = false;
  };
  window.onresize = function(event) {
    setup();
    resize(splitters.left, pos);
  };

  setup();

}());
