var vis = '';
var scale_default = 1;
var def_translate = [];
def_translate.push(0)

var CollapsibleTree = function (elt, height, width, view_box) {
  var m = [0, 0, 0, 0],
    w = width - m[1] - m[3],
    h = height - m[0] - m[2],
    i = 0,
    root,
    root2,
    custome_height = 1.6;
  def_translate.push(height / 6)

  var tree = d3.layout.tree()
    .size([h, w]);

  var parentdiagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.x, -d.y]; });

  var childdiagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.x, d.y]; });

  vis = d3.select(elt).append("svg:svg")
    .attr("class", "svg_container")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("viewBox", view_box)
    .style("overflow", "scroll")
    .append("svg:g")
    .attr("class", "drawarea")
    .append("svg:g")
    // .attr("transform", "translate(" + m[3] + "," + m[0] + ")"); // left-right
    // .attr("transform", "translate(" + m[0] + "," + m[3] + ")"); // top-bottom
    .attr("transform", "translate(0," + h / 1.6 + ")"); // bidirectional-tree

  var div = d3.select("body").append("div")
    .attr("class", "my_tooltip")
    .style("opacity", 1e-6);

  var that = {
    init: function (json) {
      var that = this;
      root = json;

      // root.x0 = h / 2;
      // root.y0 = 0;
      root.x0 = w / 2;
      root.y0 = h / 2;
      that.updateBoth(root);
    },
    updateBoth: function (source) {
      var duration = d3.event && d3.event.altKey ? 5000 : 500;

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse();

      // Normalize for fixed-depth.
      nodes.forEach(function (d) { d.y = d.depth * 250; });

      // Update the nodes…
      var node = vis.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
      // .on("click", function (d) { that.toggle(d); that.updateBoth(d); });

      nodeEnter.append("svg:circle")
        .attr("r", 1e-6)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("svg:text")
        // .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("x", function (d) {
          if (that.isParent(d)) {
            return -35;
          }else if(d!=root && d.parents){
            return 100;
          } else {
            return d.children || d._children ? -20 : 35;
          }
        })
        .attr("dy", function (d) {
          return (d.children && d.children.length == 1) ? -10 : ".35em";
          // return ".35em";
        })
        // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .attr("text-anchor", function (d) {
          if (that.isParent(d)) {
            return "end";
          } else {
            return d.children || d._children ? "end" : "start";
          }
        })
        .attr("transform", function (d) {
          if (d != root) {
            if (that.isParent(d)) {
              return "rotate(90)";
            } else {
              return "rotate(90)";
            }
          }
        }).attr('a', function (d) {
          return d.name
        })
        .html(function (d) {
                return '<a>' + d.name + '</a>';
        })
        .attr('y',function(d){
            if(d!=root && d.parents){
                return '7';
            }
        })

        .style('font-weight',function(d){
            if(d.parents){
                return 'bold';
            }

        })
        .style("fill-opacity", 1e-6);

      nodeEnter.append("svg:image")
        .attr('class', 'info_icon_tree')
        .attr("xlink:href", function (d) {
        //   if (d != root) {
        //     return "/images/info-ico.png";
        //   }
           if( d!=root && (d.children || !d.parents)){ //!d.parents for tier
                return "/images/info-ico.png";
            }
        })
        .attr("width", 16)
        .attr("height", 16)
        .attr("x", function (d) {
          if (that.isParent(d)) {
            return -10;
          } else {
            return d.children || d._children ? -20 : -10;
          }
        })
        .attr("y", function (d) {
          if (that.isParent(d)) {
            return -30;
          } else {
            return d.children || d._children ? -20 : 12;
          }
        })
        .on("click", function (d) {
          that.mouseover()
          that.mousemove(d)
        }).append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .text("I'm a circle!");

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) {
          if (that.isParent(d)) {
            return "translate(" + d.x + "," + -d.y + ")";
          } else {
            return "translate(" + d.x + "," + d.y + ")";
          }
        });

      nodeUpdate.select("circle")
        .attr("r", 5.5)
        .style("fill", function (d) { return d._children ? d.color : d.color; });

      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(duration)
        // .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
        .remove();

      nodeExit.select("circle")
        .attr("r", 1e-6);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // Update the links…
      var link = vis.selectAll("path.link")
        .data(tree.links_parents(nodes).concat(tree.links(nodes)), function (d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("stroke", function (d) {
          return (d.target.stroke_color) ? d.target.stroke_color : d.source.stroke_color
        })
        .attr("stroke-width", function (d) {
          return 5
        })
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 };
          if (that.isParent(d.target)) {
            return parentdiagonal({ source: o, target: o });
          } else {
            // return parentdiagonal({source: o, target: o});
            return childdiagonal({ source: o, target: o });
          }
        })
        .transition()
        .duration(duration)
        // .attr("d", parentdiagonal);
        .attr("d", function (d) {
          if (that.isParent(d.target)) {
            return parentdiagonal(d);
          } else {
            // return parentdiagonal(d);
            return childdiagonal(d);
          }
        })

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        // .attr("d", parentdiagonal);
        .attr("d", function (d) {
          if (that.isParent(d.target)) {
            return parentdiagonal(d);
          } else {
            return childdiagonal(d);
          }
        })

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
          var o = { x: source.x, y: source.y };
          // return parentdiagonal({source: o, target: o});
          if (that.isParent(d.target)) {
            return parentdiagonal({ source: o, target: o });
          } else {
            return childdiagonal({ source: o, target: o });
          }
        })
        .remove();


      // Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
      //for drag/drop and auto tree zoom function
      d3.select(".svg_container")
        .call(d3.behavior.zoom()
          .scaleExtent([0.5, 5])
          .on("zoom", this.zoom));
      //buttons for zoom in zoom out
      d3.select('#zoom_in').on("click", this.zoomIn);
      d3.select('#zoom_out').on("click", this.zoomOut);
    },
    updateParents: function (source) {
      var duration = d3.event && d3.event.altKey ? 5000 : 500;

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse();

      // Normalize for fixed-depth.
      nodes.forEach(function (d) { d.y = d.depth * 180; });

      // Update the nodes…
      var node = vis.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        // .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .attr("transform", function (d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
        .on("click", function (d) { that.toggle(d); that.updateParents(d); });

      nodeEnter.append("svg:circle")
        .attr("r", 1e-6)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("svg:text")
        .attr("x", function (d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
        .text(function (d) { return d.name; })
        .style("fill-opacity", 1e-6);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + d.x + "," + -d.y + ")"; });

      nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(duration)
        // .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
        .remove();

      nodeExit.select("circle")
        .attr("r", 1e-6);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // Update the links…
      var link = vis.selectAll("path.link")
        .data(tree.links(nodes), function (d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("stroke", function (d) {
          return (d.target.stroke_color) ? d.target.stroke_color : d.source.stroke_color
        })
        .attr("stroke-width", function (d) {
          return 5
        })
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 };
          return parentdiagonal({ source: o, target: o });
        })
        .transition()
        .duration(duration)
        .attr("d", parentdiagonal);

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr("d", parentdiagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
          var o = { x: source.x, y: source.y };
          return parentdiagonal({ source: o, target: o });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },
    updateChildren: function (source) {
      var duration = d3.event && d3.event.altKey ? 5000 : 500;

      // Compute the new tree layout.
      var nodes = tree.nodes(root2).reverse();

      // Normalize for fixed-depth.
      nodes.forEach(function (d) { d.y = d.depth * 180; });

      // Update the nodes…
      var node = vis.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        // .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .attr("transform", function (d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
        .on("click", function (d) { that.toggle(d); that.updateChildren(d); });

      nodeEnter.append("svg:circle")
        .attr("r", 1e-6)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("svg:text")
        .attr("x", function (d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
        .text(function (d) { return d.name; })
        .style("fill-opacity", 1e-6);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        // .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

      nodeUpdate.select("circle")
        .attr("r", 4.5)
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(duration)
        // .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
        .remove();

      nodeExit.select("circle")
        .attr("r", 1e-6);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // Update the links…
      var link = vis.selectAll("path.link")
        .data(tree.links(nodes), function (d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("stroke", function (d) {
          return (d.target.stroke_color) ? d.target.stroke_color : d.source.stroke_color
        })
        .attr("stroke-width", function (d) {
          return 5
        })
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 };
          return childdiagonal({ source: o, target: o });
        })
        .transition()
        .duration(duration)
        .attr("d", childdiagonal);

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr("d", childdiagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
          var o = { x: source.x, y: source.y };
          return childdiagonal({ source: o, target: o });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },

    update: function (source) {
      var duration = d3.event && d3.event.altKey ? 5000 : 500;

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse();
      console.warn(nodes)

      // Normalize for fixed-depth.
      nodes.forEach(function (d) { d.y = d.depth * 50; });

      // Update the nodes…
      var node = vis.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", function (d) { toggle(d); update(d); });

      nodeEnter.append("svg:circle")
        .attr("r", function (d) {
          return Math.sqrt((d.part_cc_p * 1)) + 4;
        })
        .attr("class", function (d) { return "level" + d.part_level; })
        .style("stroke", function (d) {
          if (d._children) { return "blue"; }
        })
        ;

      nodeEnter.append("svg:text")
        .attr("x", function (d) { return d.children || d._children ? -((Math.sqrt((d.part_cc_p * 1)) + 6) + this.getComputedTextLength()) : Math.sqrt((d.part_cc_p * 1)) + 6; })
        .attr("y", function (d) { return d.children || d._children ? -7 : 0; })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
        .text(function (d) {
          if (d.part_level > 0) { return d.name; }
          else
            if (d.part_multi > 1) { return "Part " + d.name + " [" + d.part_multi + "]"; }
            else { return "Part " + d.name; }
        })
        .attr("title",
          function (d) {
            var node_type_desc;
            if (d.part_level != 0) { node_type_desc = "Labour"; } else { node_type_desc = "Component"; }
            return ("Part Name: " + d.text + "<br/>Part type: " + d.part_type + "<br/>Cost so far: " + d3.round(d.part_cc, 2) + "&euro;<br/>" + "<br/>" + node_type_desc + " cost at this node: " + d3.round(d.part_cost, 2) + "&euro;<br/>" + "Total cost added by this node: " + d3.round(d.part_cost * d.part_multi, 2) + "&euro;<br/>" + "Node multiplicity: " + d.part_multi);
          })
        .style("fill-opacity", 1e-6);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
        .attr("r", function (d) {
          return Math.sqrt((d.part_cc_p * 1)) + 4;
        })
        .attr("class", function (d) { return "level" + d.part_level; })
        .style("stroke", function (d) {
          if (d._children) { return "blue"; } else { return null; }
        });

      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

      nodeExit.select("circle")
        .attr("r", function (d) {
          return Math.sqrt((d.part_cc_p * 1)) + 4;
        });

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // Update the links…
      var link = vis.selectAll("path.link")
        .data(tree.links(nodes), function (d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        })
        .transition()
        .duration(duration)
        .attr("d", diagonal);

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
          var o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },

    isParent: function (node) {
      if (node.parent && node.parent != root) {
        return this.isParent(node.parent);
      } else
        // if ( node.name == 'data' || node.name == 'scale' || node.name == 'util' ) {
        if (node.isparent) {
          return true;
        } else {
          return false;
        }
    },

    // Toggle children.
    toggle: function (d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      if (d.parents) {
        d._parents = d.parents;
        d.parents = null;
      } else {
        d.parents = d._parents;
        d._parents = null;
      }
    },
    toggleAll: function (d) {
      if (d.children) {
        d.children.forEach(that.toggleAll);
        that.toggle(d);
      }
      if (d.parents) {
        d.parents.forEach(that.toggleAll);
        that.toggle(d);
      }
    },

    mouseover: function () {
      div.style("opacity", 1);
    },
    mousemove: function (d) {
      if (d.url != 'javascript:void(0)') {
        let html = "";
        if (d.is_owner) {
          if (d.country_code) {
            html = "<div class='main_box'>\
          <div style='width:95%' class='name_heading_org'>Parent Company: " + d.name + "</div>\
          <div style='width:5%'>\
            <i class='ion-close' onClick='closeInfoBox()' id='traceability_graph_popup_close_btn'></i>\
          </div></div>\
            <span class='country_info'><img class='flag_img' src='/images/flags/" + d.country_code + ".png'><p class='country_heading_org'>" + d.country + "</p></span>\
            <p><strong>Source:</strong> Open Data <i class='fa fa-lock'></i> and Corporate Disclosures</p>\
            <p class='profile_link_tracebility'><a href='" + d.url + "' target='_blank'>View Profile <i class='fa fa-arrow-right'></a></p>";
          } else {
            html = "<div class='main_box'>\
          <div style='width:95%' class='name_heading_org'>Parent Company: " + d.name + "</div>\
          <div style='width:5%'>\
            <i class='ion-close' onClick='closeInfoBox()' id='traceability_graph_popup_close_btn'></i>\
          </div></div>\
            <p><strong>Source:</strong> Open Data <i class='fa fa-lock'></i> and Corporate Disclosures</p>\
            <p class='profile_link_tracebility'><a href='" + d.url + "' target='_blank'>View Profile <i class='fa fa-arrow-right'></a></p>";
          }
        } else {
          if (d.country_code) {
            html = "<div class='main_box'><div style='width:95%' class='name_heading_org'>" + d.name + "</div><div style='width:5%'><i class='ion-close' onClick='closeInfoBox()' id='traceability_graph_popup_close_btn'></i></div></div><span class='country_info'><img class='flag_img' src='/images/flags/" + d.country_code + ".png'><p class='country_heading_org'>" + d.country + "</p></span><p class='profile_link_tracebility'><a href='" + d.url + "' target='_blank'>View Profile <i class='fa fa-arrow-right'></a></p>";
          } else {
            html = "<div class='main_box'><div style='width:95%' class='name_heading_org'>" + d.name + "</div><div style='width:5%'><i class='ion-close' onClick='closeInfoBox()' id='traceability_graph_popup_close_btn'></i></div></div><p class='profile_link_tracebility'><a href='" + d.url + "' target='_blank'>View Profile <i class='fa fa-arrow-right'></a></p>";
          }
        }

        div
          .html(html)
          .style("left", (d3.event.pageX) + -150 + "px")
          .style("top", (d3.event.pageY) + -150 + "px");
      } else {
        if (d.country_code) {
          div
            .html("<div class='main_box'><div style='width:95%' class='name_heading_org'>" + d.name + "</div><div style='width:5%'><i class='ion-close' onClick='closeInfoBox()' id='traceability_graph_popup_close_btn'></i></div></div><span class='country_info'><img class='flag_img' src='/images/flags/" + d.country_code + ".png'><p class='country_heading_org'>" + d.country + "</p></span>")
            .style("left", (d3.event.pageX) + -150 + "px")
            .style("top", (d3.event.pageY) + -150 + "px");
        } else {
          div
            .html("<div class='main_box'><div style='width:95%' class='name_heading_org'>" + d.name + "</div><div style='width:5%'><i class='ion-close' onClick='closeInfoBox()' id='traceability_graph_popup_close_btn'></i></div></div>")
            .style("left", (d3.event.pageX) + -150 + "px")
            .style("top", (d3.event.pageY) + -150 + "px");
        }
      }
    },

    mouseout: function () {
      div.transition()
        .duration(300)
        .style("opacity", 1e-6);
    },

    zoom: function () {
      var scale = d3.event.scale,
        translation = d3.event.translate,
        tbound = -h * scale,
        bbound = h * scale,
        lbound = (-w + m[1]) * scale,
        rbound = (w - m[3]) * scale;

      // limit translation to thresholds
      translation = [
        Math.max(Math.min(translation[0], rbound), lbound),
        Math.max(Math.min(translation[1], bbound), tbound)
      ];
      def_translate = translation
      scale_default = scale

      d3.select(".drawarea")
        .attr("transform", "translate(" + translation + ")" +
          " scale(" + scale + ")");
    },

    zoomIn: function () {
      zoomHandlerIn(0.02);
    },
    zoomOut: function () {
      zoomHandlerOut(0.02);
    }
  }
  return that;
}

function zoomHandlerIn(val) {
  scale_default = scale_default + val
  d3.select(".drawarea")
    .attr("transform", "translate(" + def_translate + ")" +
      " scale(" + scale_default + ")");
}

function zoomHandlerOut(val) {
  scale_default = scale_default - val
  d3.select(".drawarea")
    .attr("transform", "translate(" + def_translate + ")" +
      " scale(" + scale_default + ")");
}

