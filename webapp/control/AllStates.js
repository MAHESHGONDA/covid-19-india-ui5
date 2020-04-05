sap.ui.define(["sap/ui/core/Control"], function (t) {
	"use strict";
	return t.extend("com.covid19.india.control.AllStates", {
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
			oRm.write("style=width: " + 600px + "; height: " + 600px );
			// oRM.addStyle("myAppDemoWThttps://api.rootnet.in/covid19-in/stats/testing/historyProductRating");
			oRM.writeClasses();
			oRM.write(">");
			// oRM.renderControl(oControl.getAggregation("_button"));
			oRM.write("</div>");
		},
		onAfterRendering: function (oSource) {

			// SETUP
			var theData = [{
				"letter": "A",
				"frequency": 0.08167
			}, {
				"letter": "B",
				"frequency": 0.01492
			}, {
				"letter": "C",
				"frequency": 0.02782
			}, {
				"letter": "D",
				"frequency": 0.04253
			}, {
				"letter": "E",
				"frequency": 0.12702
			}, {
				"letter": "F",
				"frequency": 0.02288
			}, {
				"letter": "G",
				"frequency": 0.02015
			}, {
				"letter": "H",
				"frequency": 0.06094
			}, {
				"letter": "I",
				"frequency": 0.06966
			}, {
				"letter": "J",
				"frequency": 0.00153
			}, {
				"letter": "K",
				"frequency": 0.00772
			}, {
				"letter": "L",
				"frequency": 0.04025
			}, {
				"letter": "M",
				"frequency": 0.02406
			}, {
				"letter": "N",
				"frequency": 0.06749
			}, {
				"letter": "O",
				"frequency": 0.07507
			}, {
				"letter": "P",
				"frequency": 0.01929
			}, {
				"letter": "Q",
				"frequency": 0.00095
			}, {
				"letter": "R",
				"frequency": 0.05987
			}, {
				"letter": "S",
				"frequency": 0.06327
			}, {
				"letter": "T",
				"frequency": 0.09056
			}, {
				"letter": "U",
				"frequency": 0.02758
			}, {
				"letter": "V",
				"frequency": 0.00978
			}, {
				"letter": "W",
				"frequency": 0.0236
			}, {
				"letter": "X",
				"frequency": 0.0015
			}, {
				"letter": "Y",
				"frequency": 0.01974
			}, {
				"letter": "Z",
				"frequency": 0.00074
			}]

			var svg = d3.select(oSource.srcControl.getDomRef()).append('svg');
			var margin = {
				top: 20,
				right: 20,
				bottom: 30,
				left: 40
			};
			var x = d3.scaleBand().padding(0.1);
			var y = d3.scaleLinear();
			// theData = undefined;

			var g = svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			g.append("g")
				.attr("class", "axis axis--x");

			g.append("g")
				.attr("class", "axis axis--y");

			g.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", "0.71em")
				.attr("text-anchor", "end")
				.text("Frequency");
			var x = x.domain(theData.map(function (d) {
				return d.letter;
			}));
			y.domain([0, d3.max(theData, function (d) {
				return d.frequency;
			})]);

			// DRAWING

			var bounds = svg.node().getBoundingClientRect(),
				width = bounds.width - margin.left - margin.right,
				height = bounds.height - margin.top - margin.bottom;

			x.rangeRound([0, width]);
			y.rangeRound([height, 0]);

			g.select(".axis--x")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			g.select(".axis--y")
				.call(d3.axisLeft(y).ticks(10, "%"));

			var bars = g.selectAll(".bar")
				.data(theData);

			// ENTER
			bars
				.enter().append("rect")
				.attr("class", "bar")
				.attr("x", function (d) {
					return x(d.letter);
				})
				.attr("y", function (d) {
					return y(d.frequency);
				})
				.attr("width", x.bandwidth())
				.attr("height", function (d) {
					return height - y(d.frequency);
				});

			// UPDATE
			bars.attr("x", function (d) {
					return x(d.letter);
				})
				.attr("y", function (d) {
					return y(d.frequency);
				})
				.attr("width", x.bandwidth())
				.attr("height", function (d) {
					return height - y(d.frequency);
				});

			// EXIT
			bars.exit()
				.remove();

			// LOADING DATA

			// START!

			// window.addEventListener("resize", draw);
			// this.loadData("data.tsv");
		},
		loadData: function (tsvFile) {}
	});
});