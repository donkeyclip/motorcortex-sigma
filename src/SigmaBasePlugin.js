const MC = require("@kissmybutton/motorcortex/");
const WebComponentContextHandler = require("@kissmybutton/motorcortex/dist/corePlugins/SelfContainedIncidents/helpers/WebComponentContextHandler");
const sigma = require("sigma");


/**
 * Grouping of Main Sigma instance "incident" supporting animation
 * child-incidents. Renders the graph and imports all relevant plugins
 *
 * @class SigmaBasePlugin
 * @extends {MC.ExtendableClip}
 */
class SigmaBasePlugin extends MC.ExtendableClip {
    /**
     *Creates an instance of SigmaBasePlugin.
     * @param {*} attrs attributes of sigma and graph creatin commands
     * @param {*} props properties of sigma instanciation (not used)
     * @memberof SigmaBasePlugin
     */
    constructor(attrs, props) {
        //conditional imports for performance
        super(attrs, props);
        this.plugins = {};
        this.children = [];

        var ContextHanlder = null;
        ContextHanlder = WebComponentContextHandler;

        var contextHanlder = new ContextHanlder(props);

        this.ownContext = contextHanlder.context;
        this.isTheClip = true;
        this.rootElement = this.context.rootElement;

        var initializeOneTimePlugIn = false;
        
        this.init();
    }
    
    /**
     * initializes the instance of sigma with
     * graph (N/E) parameters, generates the said
     * graph and passes it in sigma.js constructor
     * along with its container
     */
    init(newGraph) {
        this.pluginImports();

        // establish which graph to create and call the appropriate function
        if (!newGraph) {
            this.context.g = {
                nodes: [],
                edges: [],
                name:"empty"
            };
            if (!this.attrs.attrs.customGraph) {
                this.generateRandomGraph(this.context.g);
            }
            else {
                this.context.customNodes = this.attrs.attrs.customGraph.nodes;
                this.context.customEdges = this.attrs.attrs.customGraph.edges;

                this.generateCustomGraph(this.context.g);
            }
            this.cmd = this.attrs.attrs.commands;
            this.context.s = new sigma({
                graph: this.context.g,
                renderer: {
                    container: this.props.container,
                    type: this.context.defaultRenderType
                },
                settings: this.context.settings
            });
        }
        else {
            this.cmd = this.attrs.attrs.commands;
            this.context.g = newGraph
            this.context.s = new sigma({
                graph: this.context.g,
                renderer: {
                    container: this.props.container,
                    type: this.context.defaultRenderType
                },
                settings: this.context.settings
            });
        }

        this.initializeDrag();
        this.methodUpdate(this.cmd);
    }

    /**
     * Initializes dragNodes plugin if applicable
     */
    initializeDrag() {
        // drag_nodes plugin initialization MUST BE ONGOING
        if (this.attrs.attrs.options.drag_nodes) {
            if (!this.plugins.drag_nodes) {
                this.plugins.drag_nodes = require("sigma/plugins/sigma.plugins.dragNodes/sigma.plugins.dragNodes")
            }

            var dragListener = 
                sigma.plugins.dragNodes(this.context.s, this.context.s.renderers[0]);

            dragListener.bind('startdrag', event => {});
            dragListener.bind('drag', event => {});
            dragListener.bind('drop', event => {});
            dragListener.bind('dragend', event => {
                this.data = event.data.node;
                const updateNode = node => {
                    var index = parseInt(node.id.substring(1));
                    var newx = node.x;
                    var newy = node.y;
                    this.context.g.nodes[index].x = newx;
                    this.context.g.nodes[index].y = newy;
                    this.context.s.kill();
                    this.init(this.context.g);
                    for (var child in this.children) {
                        this.children[child] = this.children[child].refreshInstance();
                    }
                } 
                updateNode(event.data.node);
            });
        }
    }


    /**
     * Creates a graph imported by the user with appropriate edges
     * and nodes.
     */
    generateCustomGraph(g) {
        for (var i = 0; i < this.context.N; i++) {
            g.nodes.push(
                this.context.customNodes[i]
            );
        }
        for (var i = 0; i < this.context.E; i++) {
            g.edges.push(
                this.context.customEdges[i]
            )
        }
        g.name = this.attrs.attrs.customGraph.name;
    }


    /**
     * Create the graph with Edges and Nodes
     */
    generateRandomGraph(g) {
        //Generate graph with no clusters
        if (!this.context.C) {
            //insert nodes into graph
            for (var i = 0; i < this.context.N; i++) {
                g.nodes.push({
                    id: 'n' + i,
                    label: 'Node ' + i,
                    x: Math.random(),
                    y: Math.random(),
                    size: Math.random(),
                    color: `rgb(${parseInt(Math.random() * 255)},${
                        parseInt(Math.random() * 255)},${
                        parseInt(Math.random() * 255)})`
                });
            }
            //insert edges into graph
            for (var i = 0; i < this.context.E; i++) {
                g.edges.push({
                    id: 'e' + i,
                    source: 'n' + (Math.random() * this.context.N | 0),
                    target: 'n' + (Math.random() * this.context.N | 0),
                    size: Math.random(),
                    color: 'rgb(155,155,155)'
                });
            }
        }
        //Generate graph with clusters C
        else {
            for (i = 0; i < this.context.C; i++) {
                this.context.cs.push({
                    id: i,
                    nodes: [],
                    color: '#' + (
                    Math.floor(Math.random() * 16777215).toString(16) + '000000'
                    ).substr(0, 6)
                });
            }

            for (i = 0; i < this.context.N; i++) {
                this.context.o = this.context.cs[(Math.random() * this.context.C) | 0];
                g.nodes.push({
                    id: 'n' + i,
                    label: 'Node' + i,
                    x: Math.random(),
                    y: Math.random(),
                    size: Math.random(),
                    color: this.context.o.color
                });
                this.context.o.nodes.push('n' + i);
            }

            for (i = 0; i < this.context.E; i++) {
                if (Math.random() < 1 - 0.5)
                    g.edges.push({
                        id: 'e' + i,
                        source: 'n' + ((Math.random() * this.context.N) | 0),
                        target: 'n' + ((Math.random() * this.context.N) | 0)
                    });
                else {
                    this.context.o = 
                        this.context.cs[(Math.random() * this.context.C) | 0]
                    g.edges.push({
                        id: 'e' + i,
                        source: this.context.o.nodes[(Math.random()
                            * this.context.o.nodes.length) | 0],
                        target: this.context.o.nodes[(Math.random()
                            * this.context.o.nodes.length) | 0]
                    });
                }
            }
        }
    }

    /**
     * resets content of the passed containers to prepare for a change
     * in the cameras/renderers display
     */
    changePrep(containers) {
        for (var cont in containers) {
            containers[cont].innerHTML = "";
        }
    }

    /**
     * Calls the methods passed to cmd
     */
    methodUpdate(cmd) {
        for (var key in cmd) {
            if (key == "cameraCMD") {
                this.context.s.cameras.cmd[key][0]
            }

            for (var subKey in cmd[key]) {
                this.context.s[key](...cmd[key][subKey]);
            }
        }
        this.context.s.refresh();
    }

    /**
     * import all necessary plugins in this.plugins
     */
    pluginImports() {
        // supports parallel edges when there are more than one edge
        // with the same target and same source nodes
        if (this.attrs.attrs.options.parallelEdges) {
            if (!this.plugins.parallelE) {
                this.plugins.parallelE = [];
                this.plugins.parallelE.edgehovers = [];
                this.plugins.parallelE.edges = [];
                this.plugins.parallelE.edges.labels = [];
                this.plugins.parallelE.edgehovers.curve = require("sigma/plugins/sigma.renderers.parallelEdges/sigma.canvas.edgehovers.curve")
                this.plugins.parallelE.edgehovers.curvedArrow = require("sigma/plugins/sigma.renderers.parallelEdges/sigma.canvas.edgehovers.curvedArrow")
                this.plugins.parallelE.edges.curve = require("sigma/plugins/sigma.renderers.parallelEdges/sigma.canvas.edges.curve")
                this.plugins.parallelE.edges.curvedArrow = require("sigma/plugins/sigma.renderers.parallelEdges/sigma.canvas.edges.curvedArrow")
                this.plugins.parallelE.edges.labels.curve = require("sigma/plugins/sigma.renderers.parallelEdges/sigma.canvas.edges.labels.curve")
                this.plugins.parallelE.utils = require("sigma/plugins/sigma.renderers.parallelEdges/utils")
            }
        }
        
        // initialize all variables necessary for instanciating sigma with a graph
        this.props.container = this.rootElement;
        this.context.N = this.attrs.attrs.N;
        this.context.E = this.attrs.attrs.E;
        this.context.C = this.attrs.attrs.C;
        this.context.cs = [];
        this.context.o;
        this.context.settings = this.attrs.attrs.settings;
        this.context.options = this.attrs.attrs.options;

        // setup or defaultize the renderer type that the Sigma instance will use to
        // display the graph
        if (!this.attrs.attrs.rendererType) {
            this.context.defaultRenderType = 'canvas';
        } 
        else {
            this.context.defaultRenderType = this.attrs.attrs.rendererType;
        }

        // support for curved edges (compatible only with canvas renderer)
        if (this.attrs.attrs.options.edgeCurve == true) {
            if (this.context.defaultRenderType !== 'canvas') {
                throw "Custom renderers are only compatible with 'canvas' renderer";
            }
            this.plugins.edgeCurve = [
                require("sigma/plugins/sigma.renderers.edgeDots/sigma.canvas.edges.dotCurve"),
                require("sigma/plugins/sigma.renderers.edgeDots/sigma.canvas.edges.dotCurvedArrow")
            ]
        }

        // supporting provided custom edge shapes compatible with canvas renderer
        if (this.attrs.attrs.options.customEdgeShapes == true) {
            if (this.context.defaultRenderType !== 'canvas') {
                throw "Custom renderers are only compatible with 'canvas' renderer";
            }
            this.plugins.customEdgeShapes = [
                require("sigma/plugins/sigma.renderers.customEdgeShapes/sigma.canvas.edgehovers.dashed"),
                require("sigma/plugins/sigma.renderers.customEdgeShapes/sigma.canvas.edgehovers.dotted"),
                require("sigma/plugins/sigma.renderers.customEdgeShapes/sigma.canvas.edgehovers.parallel"),
                require("sigma/plugins/sigma.renderers.customEdgeShapes/sigma.canvas.edgehovers.tapered"),
                require("sigma/plugins/sigma.renderers.customEdgeShapes/sigma.canvas.edges.dashed"),
                require("sigma/plugins/sigma.renderers.customEdgeShapes/sigma.canvas.edges.dotted"),
                require("sigma/plugins/sigma.renderers.customEdgeShapes/sigma.canvas.edges.parallel"),
                require("sigma/plugins/sigma.renderers.customEdgeShapes/sigma.canvas.edges.tapered")
            ]
        }

        // supports edge labels
        if (this.attrs.attrs.options.edgeLabels == true) {
            this.plugins.edgeLabels = [
                require("sigma/plugins/sigma.renderers.edgeLabels/settings"),
                require("sigma/plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.curve"),
                require("sigma/plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.curvedArrow"),
                require("sigma/plugins/sigma.renderers.edgeLabels/sigma.canvas.edges.labels.def"),
            ]
        }

        /***********************
         * Helper method plugins
         */

        // supports fetching HITS statistics for each node in the graph
        if (!this.plugins.HITS) {
            this.plugins.HITS = require("sigma/plugins/sigma.statistics.HITS/sigma.statistics.HITS");
        }

        // supports finding the path from a node to another using the Alpha-Star algorithm
        if (!this.plugins.aStar) {
            this.plugins.aStar = require("sigma/plugins/sigma.pathfinding.astar/sigma.pathfinding.astar");
        }
        
        // supports fetching or downloading the rendered graph in formats png, jpeg, gif and tiff
        if (!this.plugins.snapshot) {
            this.plugins.snapshot = require("sigma/plugins/sigma.renderers.snapshot/sigma.renderers.snapshot");
        }

        // Importing and constructing the Neighborhoods plugin class to be 
        // used further down in exponsed helper method neighborhood()
        const Neighborhoods = require("sigma/plugins/sigma.plugins.neighborhoods/sigma.plugins.neighborhoods");
        this.plugins.Neighborhoods = new sigma.plugins.neighborhoods();

        // Animation plugin, necessary for any animated attributes of the s instance
        this.plugins.animate = require("sigma/plugins/sigma.plugins.animate/sigma.plugins.animate");
    }

    /***********************************
     * Helper methods for plugins called on the incident itself,
     * they provide information drawn from the sigma graph
     * ******************************/
    
     /**
      * provides Authority and Hub measure (HITS statistics) for every 
      * node in the graph of the sigma instance
      */
    HITS (isUndirected) {
        return this.context.s.graph.HITS(isUndirected);
    }

    /**
     * Computes path between two nodes using the Alpha-Star algorithm
     */
    aStarPathFinder (node1, node2, previousPathLength) {
        return this.context.s.graph.astar(node1, node2, previousPathLength);
    }

    /**
     * Fetches or downloads a snapshot of the graph in the said renderer
     */
    snapshot (i, params) {
        return this.context.s.renderers[i].snapshot(params);
    }

    /** 
     * returns a graph that is the neighborhood of the center node 
     * passed as a parameter to this function
     */
    neighborhood (centerId) {
        return this.context.s.graph.neighborhood(centerId);
    }
}

  
module.exports = SigmaBasePlugin;