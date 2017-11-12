d3.select("svg").remove();
var drag = d3.behavior.drag()
.origin(function(d) { return d; })
.on("dragstart", dragstarted)
.on("drag", dragged)
.on("dragend", dragended);

d3.csv("data/sport.csv", function(error, links) {
    var nodes = {};
    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] ||
            (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] ||
            (nodes[link.target] = {name: link.target});
        link.value = +link.value;
    });
    var width = 690,
        height = 350,
        color = d3.scale.category20c();

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width,height])
        .linkDistance(50)
        .charge(-200)
        .on("tick", tick)
        .start();
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.behavior.zoom().on("zoom", function () {
            svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
          }))
        .append("g")
        // build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .style("fill", function(d) { return color(d.name); })
        .append("svg:path")
        .style("fill", function(d) { return "white"; })
        .attr("d", "M0,-5L10,0L0,5");

    // add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
    //   .attr("class", function(d) { return "link " + d.type; })
        .attr("class", "link")
        .attr("marker-end", "url(#end)");

    // define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);
    // add the nodes
    node.append("circle")
        .attr("r", 5);
    // add the text
    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });



    // add the curvy lines
    function tick() {
        path.attr("d", function(d) {
        //trasnformation - curve between links
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });
        node
            .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"; });
    }

    });
    /*function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    }

    function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
    }

    function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    }
*/

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}