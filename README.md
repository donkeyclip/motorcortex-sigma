# motorcortex-sigmajs


## Description
Sigma-JS library instanciates and renders graphs with any number of nodes and
edges in a web container. The MotorCortex implementation embeds these instanciates
and any animations performed on them within Groups of Incidents. Each Group refers 
to a different graph and therefore a different instance of sigma. Each Group can 
be a host to child-incidents that perform animations on the said sigma graph. 

Various options are available for the user, from different renderers and display 
properties, to exporting data and images from the rendered graphs (see inner 
documentation and Sigma-JS plugins implemented in this version below)


## Installation
```bash
$ npm install --save @kissmybutton/motorcortex-sigma
```

## Importing

```javascript
import MotorCortex from "@kissmybutton/motorcortex";
import Sigma from "@kissmybutton/motorcortex-sigma";
```

## Loading

```javascript
const plugins = MotorCortex.loadPlugin(Sigma);
const anime = new plugins.Sigma(attrs, props);
```

## API

### Graph Creation
-The user can either create their own graph or provide a certain number of nodes (N),
edges (E) and clusters (C) (optional). The graph must be an array containing a nodes
and an edges array. Each of those must contain node and edge objects following this 
template:
```javascript
graph.nodes[i] = {
    id: 'n'+i,
    lavel: 'Node ' + i, //user may change this
    x: xCoordinate,
    y: yCoordinate,
    size: decimal, (the size of node)
    color: colorOfNode (rgb or hex)
}
graph.edges[i] = {
    id: 'e' + i,
    label: 'Edge ' + i, (optional)
    source: 'n' + a,
    target: 'n' + b,
    size: sizeOfEdge,
    color: colorOfEdge
}
```

### Sigma Instanciation
Creating a SigmaBasePlugin instance requires certain attributes and properties:
```javascript
attrs = {
    attrs:{
        N: numberOfNodes,
        E: numberOfEdges,
        C: numberOfClusters, (optional)
        rendererType: DefaultIsCanvas (note that most feature of the current version only work in canvas)
        customGraph: userProvidedCustomGraph
        settings:{
            any setting provided in sigma.settings.js
        },
        options:{
            drag_nodes: T/F,
            parallelEdges: T/F,
            edgeCurve: T/F,
            customEdgeShapes: T/F,
            edgeLabels: T/F
        },
        cmd: {
            sigmaFunction: {
                params
            }
        }
    }
}
props = {
    css of group,
    host element of group,
    html of group,
    containerParameters of host element 
}
```
*NOTE* Simply instanciating Sigma will render the given graph.

### Animating the graph
Animation Child-Incidents of group are defined as follows:
```javascript
new Sigma.SigmaAnimPlugin(
    //attrs
    {
        attrs:{
            master: theParentGroup
        },
        animatedAttrs:{
            finalG: the final form of the graph
        }   
    },
    //props
    {
        duration: the duration of the animation in milliseconds,
        selector: DOM selector of the host element
    }
);
groupName.addIncident(childIncidentName, millisecondTimeStart)
```




## SIGMA PLUGINS IMPLEMENTED 

The following plugins of the SigmaJS library are currently supported by the
MC SigmaJS plugin implementation (most are exclusive to the canvas renderer):
    -plugins.animate --> implemented allowing MC to call requestAnimationFrame
        function instead of sigma
    -plugins.dragNodes --> resets the graph to he result after the drag
    -renderers.parallelEdges --> custom graph creation includes parallel edges.
    -renderers.customEdgeShapes --> renderers support custom edge creation
        for dashed, dotted, parallel and taperred edges (only compatible with canvas)
    -renderers.edgeDots --> renderers support the creation of curved edges/arrows
    -renderers.edgeLabels --> renderers support display of edge labels
    -renderers.snapshot --> can export an image file directly from a renderer
    -plugins.neighborhoods --> can export the nodes that a node is connected to
        (the node's neighborhood)
    -statistics.HITS --> can export Hub and Authority statistics about the 
        nodes of a graph.
    -pathfinding.astar  --> can export an array demonstrating the path from 2 
        target nodes (using the alpha-star algorithm)
