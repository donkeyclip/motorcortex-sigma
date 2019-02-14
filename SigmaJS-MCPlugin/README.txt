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
    neo4j.cypher
    parsers.gexf
    parsers.json
    pathfinding.astar
    plugins.filter
    plugins.neighborhoods
    plugins.relativeSize
    renderers.customEdgeShapes
    renderers.customEdgeShapes
    renderers.edgeDots
    renderers.edgeLabels
    renderers.parallelEdges
    renderers.snapshot
    statistics.HITS
}


PLUGINS OF SIGMAJS THAT CURRENTLY CANNOT
 BE IMPLEMENTED IN MC-SIGMAJS {
    layout.noverlap
 }

 PLUGINS OF SIGMAJS SUCCESFULY IMPLEMENTED IN MC-SIGMAJS {
    plugins.animate
    plugins.dragNodes
 }