const MotorCortex = require("@kissmybutton/motorcortex/");
const SigmaDefinition = require("./src/main.js");
const Sigma = MotorCortex.loadPlugin(SigmaDefinition);
const Player = require("@kissmybutton/motorcortex-player");

const host = document.getElementById("clip");
const html = `
    <div id="graph-container1" class="graph-container1"></div>
    `;
const css = `
    #animation1{
        background:black;
        width:90%;
        height:100%;
        position:absolute;

    }`;

const containerParams = {
    width: "90%",
    height: "90%"
}


const nodes = 1000;
const edges = 50;
const clusters = 5;

var square = {nodes:[], edges:[],name:"square"};
for (var i = 0; i < nodes; i++) {
    const xrand = Math.random() * 10;
    const yrand = Math.random() * 10;
    square.nodes.push({
        id: 'n' + i,
        label: 'Node ' + i,
        x:xrand,
        y:yrand,
        xFinal:xrand,
        yFinal:yrand,
        size: Math.random(),
        sizeFinal: Math.random(),
        color: 'rgb(255,255,255)',
        colorFinal: 'rgb(255,255,255)',
    })
}  
for (var i = 0; i < edges; i++)
square.edges.push({
        id: 'e' + i,
        source: 'n' + (Math.random() * nodes | 0),
        target: 'n' + (Math.random() * nodes | 0)
});


var circle = {nodes:[], edges:[],name:"circle"};
for (var i = 0; i < nodes; i++) {

    var r = 10 * Math.sqrt(Math.random());
    var theta = Math.random() * 2 * Math.PI;

    node = {
        id: 'n' + i,
        label: 'Node' + i,
        x: r * Math.cos(theta),
        y: r * Math.sin(theta),
        xFinal: r * Math.cos(theta),
        yFinal: r * Math.sin(theta),
        size: Math.random(),
        sizeFinal: Math.random(),
        color: 'rgb(255,0,255)',
        colorFinal: 'rgb(255,0,255)'
    }
    circle.nodes.push(node);
}
for (i = 0; i < edges; i++)
circle.edges.push({
    id: 'e' + i,
    source: 'n' + (Math.random() * nodes | 0),
    target: 'n' + (Math.random() * nodes | 0)
});


window.clip = new Sigma.Clip(
    //attrs
    {
        attrs:{
            N: nodes,  //nodes of graph
            E: edges,  //edges of graph
            // C: clusters, // clusters to organize nodes
            rendererType: 'webgl',
            customGraph: square,
            settings: {
                drawEdges: false,
                drawLabels: true,
            }, 
            options: {
                drag_nodes: true,
            }
        }
    },
    //props
    {
        css,
        host,
        html:"<div id='animation1'></div>",
        containerParams
    }
);



const animatedInc1 = new Sigma.SigmaAnimPlugin(
    //attrs
    {
        attrs:{
            master: clip
        },
        animatedAttrs:{
            finalG: circle
        }   
    },
    //props
    {
        duration: 1000,
        selector:"#animation1",
        // repeat:{
        //     delay: 300,
        //     times: 1,
        //     hiatus: 300
        // }
    }
);



const animatedInc2 = new Sigma.SigmaAnimPlugin(
    //attrs
    {
        attrs:{
            master: clip
        },
        animatedAttrs:{
            finalG: square
        }   
    },
    //props
    {
        duration: 1000,
        selector:"#animation1"
    }
);

clip.addIncident(animatedInc1, 0);
clip.addIncident(animatedInc2, 1000);

window.player = new Player({
    clip,
    pointerEvents: false
});

window.tc = new MotorCortex.TimeCapsule();
// var journey = tc.startJourney(player.clip)
// journey.station(1000)