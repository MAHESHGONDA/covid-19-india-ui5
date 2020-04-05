sap.ui.define(["sap/ui/core/Control"], function (t) {
	"use strict";
	return t.extend("com.covid19.india.control.ToTenCountry", {
		metadata: {
			properties: {
				selectedData: {
					type: "object"
				}
			}
		},
		init: function () {},
		renderer: function (oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			// oRM.addClass("myAppDemoWTProductRating");
			oRM.writeClasses();
			oRM.write(">");
			// oRM.renderControl(oControl.getAggregation("_rating"));
			// oRM.renderControl(oControl.getAggregation("_label"));
			// oRM.renderControl(oControl.getAggregation("_button"));
			oRM.write("</div>");
		},
		onAfterRendering: function (oSource) {

			debugger;

			var data = this.getSelectedData();
			// var data = [26, 25, 10, 30, 30, 50, 33, 56, 38];
			if (data && jQuery.isEmptyObject(data)) {
				return;
			}

			// var canvas = d3.select(oSource.srcControl.getDomRef()).append('svg')
			var data = [20, 50, 80];
			var r = 150;

			var svg = d3.select("body").append("svg")
				.attr("width", 960)
				.attr("height", 500)
				.append("g");

			svg.append("g")
				.attr("class", "slices");
			svg.append("g")
				.attr("class", "labels");
			svg.append("g")
				.attr("class", "lines");
			var width = 500;
			var height = 400;
			var radius = Math.min(width, height) / 2;
			var color = d3.scaleOrdinal(d3.schemeCategory20);
			

			var pie = d3.pie().sort(null).value(d => d);
			var arc = d3.arc().innerRadius(radius * 0.8).outerRadius(radius * 0.6);

			var outerArc = d3.arc()
				.outerRadius(radius * 0.9)
				.innerRadius(radius * 0.9);

			svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			svg.selectAll('path')
				.data(pie(data))
				.enter()
				.append('path')
				.attr('d', arc)
				.attr('fill', (d, i) => color(i));
			svg.append('g').classed('labels', true);
			svg.append('g').classed('lines', true);

			var polyline = svg.select('.lines')
				.selectAll('polyline')
				.data(pie(data))
				.enter().append('polyline')
				.attr('points', function (d) {

					// see label transform function for explanations of these three lines.
					var pos = outerArc.centroid(d);
					pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
					return [arc.centroid(d), outerArc.centroid(d), pos]
				});

			var label = svg.select('.labels').selectAll('text')
				.data(pie(data))
				.enter().append('text')
				.attr('dy', '.35em')
				.html(function (d) {
					return d.data;
				})
				.attr('transform', function (d) {
					var pos = outerArc.centroid(d);
					pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
					return 'translate(' + pos + ')';
				})
				.style('text-anchor', function (d) {
					return (midAngle(d)) < Math.PI ? 'start' : 'end';
				});

			svg.append('text')
				.attr('class', 'toolCircle')
				.attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
				.html('sdfsd') // add text to the circle.
				.style('font-size', '.9em')
				.style('text-anchor', 'middle');

			function midAngle(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
			}
		}
	});
});