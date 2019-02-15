BEFORE RUNNING: TYPE IN THE FOLLOWING COMMANDS
    npm init
    npm install

    (if that fails run the following:
        npm init
        npm install webpack
        npm install webpack-dev-server
        npm install webpack-cli
        npm install babel-loader
        npm install @babel/core
    )

TO RUN ON 0.0.0.0:8080
    npm run build
    npm start


/* TODO */
PLUGINS OF SIGMAJS TO CHECK/IMPLEMENT ON MC-SIGMAJS {
    renderers.parallelEdges
    renderers.customEdgeShapes
    renderers.customEdgeShapes
    renderers.edgeDots
    renderers.edgeLabels
    renderers.snapshot
    statistics.HITS
    plugins.neighborhoods ???
    plugins.filter ???
    plugins.relativeSize ???

}


PLUGINS OF SIGMAJS THAT CURRENTLY CANNOT
 BE IMPLEMENTED IN MC-SIGMAJS {
    layout.noverlap
    neo4j.cypher |
    parsers.gexf |
    parsers.json | -> ways to import graphs from server queries 
 }

 PLUGINS OF SIGMAJS SUCCESFULY IMPLEMENTED IN MC-SIGMAJS {
    plugins.animate --> implemented allowing MC to call requestAnimationFrame
                        function instead of sigma
    plugins.dragNodes --> resets the graph to he result after the drag
    pathfinding.astar --> included in sigma cmd parameters
 }