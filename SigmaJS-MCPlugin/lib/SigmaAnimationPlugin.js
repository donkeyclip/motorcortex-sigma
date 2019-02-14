/**
 *  Class that implements the code from SigmaJS Animated Plugin
 *  requestAnimationFrame functionality and ability to kill
 *  animations and cancelAnimationFrame has been removed and
 *  implemented by SigmaAnimPlugin.js through MotorCortex Classes
 **/
class SigmaAnimation {
  constructor(id, initialGraph,finalGraph, s, animate, options) {
    sigma.utils.pkg('sigma.plugins');
    this.id = id,
    this._cache = {};

    this.s = s;
    this.animate = animate;
    this.options = options;

    this.o = null;
    this.duration = null;
    this.easing = null;
    this.start  = null;
    this.finalGraph = finalGraph.nodes;
    this.initialGraph  = initialGraph;
    this.nodes = null;
    this.prepAnimation( this.animate, this.options);
  }

  /**
   * animating Color
   */
  parseColor(val) {
    if (this._cache[val]) {
      return this._cache[val];
    }

    var result = [0, 0, 0];

    if (val.match(/^#/)) {
      val = (val || '').replace(/^#/, '');
      result = (val.length === 3) ?
        [
          parseInt(val.charAt(0) + val.charAt(0), 16),
          parseInt(val.charAt(1) + val.charAt(1), 16),
          parseInt(val.charAt(2) + val.charAt(2), 16)
        ] :
        [
          parseInt(val.charAt(0) + val.charAt(1), 16),
          parseInt(val.charAt(2) + val.charAt(3), 16),
          parseInt(val.charAt(4) + val.charAt(5), 16)
        ];
    } 
    else if (val.match(/^ *rgba? *\(/)) {
      val = val.match(
        /^ *rgba? *\( *([0-9]*) *, *([0-9]*) *, *([0-9]*) *(,.*)?\) *$/
      );
      result = [
        +val[1],
        +val[2],
        +val[3]
      ];
    }

    this._cache[val] = {
      r: result[0],
      g: result[1],
      b: result[2]
    };

    return this._cache[val];
  }

  /**
   * helper function for animating color change
   */
  interpolateColors(c1, c2, p) {
    c1 = this.parseColor(c1);
    c2 = this.parseColor(c2);

    var c = {
      r: c1.r * (1 - p) + c2.r * p,
      g: c1.g * (1 - p) + c2.g * p,
      b: c1.b * (1 - p) + c2.b * p
    };

    return 'rgb(' + [c.r | 0, c.g | 0, c.b | 0].join(',') + ')';
  }



  /** 
   * Prepares the variables of the class so that animations can be 
   * performed
   */
  prepAnimation( animate, options) {
    this.o = options || {};
    this.duration = this.o.duration || this.s.settings('animationsTime');
    this.easing = typeof this.o.easing === 'string' ?
      sigma.utils.easings[this.o.easing] :
      typeof this.o.easing === 'function' ?
      this.o.easing :
      sigma.utils.easings.quadraticInOut;
      this.start = sigma.utils.dateNow();

      this.nodes = this.s.graph.nodes();


    // Store initial positions:
    this.startPositions = this.initialGraph.nodes.reduce( (res, node) => {
      var k;
      res[node.id] = {};
      for (k in animate) {
        if (k in node) {
          res[node.id][k] = node[k];
          res[node.id][animate[k]] = node[k];
        }
      }
      return res;
    }, {});

    this.finalGraph = this.finalGraph.reduce( (res, node) => {
      var k;
      res[node.id] = {};
      for (k in animate) {
        if (k in node) {
          res[node.id][k] = node[k];
          res[node.id][animate[k]] = node[k];
        }
      }
      
      return res;
    }, {});
  };


  /**
   * Changes the x/y positions of nodes in the graph to be displayed
   * by the renderer according to p(progress)
   */
  changeFrame (p) {
    p = this.easing(p);
    this.nodes.forEach( (node) => {
      for (var k in this.animate) {
        if (k in this.animate) {
          if (k.match(/color$/)) {
            node[k] = this.interpolateColors(
              this.startPositions[node.id][k],
              this.finalGraph[node.id][this.animate[k]],
              p
            );
          }
          else {
            node[k] =
              this.finalGraph[node.id][this.animate[k]] * p +
              this.startPositions[node.id][k] * (1 - p);
          }
        }
      }
    });
    this.s.refresh();
  }
}

module.exports = SigmaAnimation;