const MC = require("@kissmybutton/motorcortex/");
const WebComponentContextHandler = require("@kissmybutton/motorcortex/dist/corePlugins/SelfContainedIncidents/helpers/WebComponentContextHandler");
const sigma = require("sigma");



class SigmaBasePlugin extends MC.ExtendableClip {
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
        // import all necessary plugins in this.plugins
        this.plugins.drag_nodes = require("sigma/plugins/sigma.plugins.dragNodes/sigma.plugins.dragNodes")
        this.plugins.animate = require("sigma/plugins/sigma.plugins.animate/sigma.plugins.animate")
        this.plugins.noOverlap = require("sigma/plugins/sigma.layout.noverlap/sigma.layout.noverlap")

        // initialize all variables necessary for instanciating sigma with a graph
        this.props.container = this.rootElement;
        this.context.N = this.attrs.attrs.N;
        this.context.E = this.attrs.attrs.E;
        this.context.C = this.attrs.attrs.C;
        this.context.cs = [];
        this.context.o;
        this.context.settings = this.attrs.attrs.settings;
        this.context.options = this.attrs.attrs.options;
        if (!this.attrs.attrs.rendererType) {
            this.context.defaultRenderType = 'canvas';
        } 
        else {
            this.context.defaultRenderType = this.attrs.attrs.rendererType;
        }

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

        this.initializePlugins();
        this.methodUpdate(this.cmd);
    }

    /**
     * Initializes all plugins
     */
    initializePlugins() {
        // drag_nodes plugin initialization MUST BE ONGOING
        if (this.attrs.attrs.options.drag_nodes) {
            var dragListener = sigma.plugins.dragNodes(this.context.s, this.context.s.renderers[0]);

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
                    this.context.o = this.context.cs[(Math.random() * this.context.C) | 0]
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
     * resets content of the passed containers
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

}

  
module.exports = SigmaBasePlugin;