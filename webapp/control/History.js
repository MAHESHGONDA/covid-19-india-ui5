sap.ui.define(["sap/ui/core/Control"], function (t) {
	"use strict";
	return t.extend("com.covid19.india.control.ToTenCountry", {
		metadata: {
			properties: {
				history: {
					type: "any"
				},
				confirmedCasesIndian: {
					type: "boolean",
					defaultValue: true
				},
				chartType: {
					type: "string",
					defaultValue: "line"
				},
				selectedState: {
					type: "string"
				}

			}
		},
		init: function () {},
		renderer: function (oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addStyle("width", "100%");
			oRM.writeStyles();
			oRM.writeClasses();
			oRM.write(">");
			// oRM.renderControl(oControl.getAggregation("_rating"));
			// oRM.renderControl(oControl.getAggregation("_label"));
			// oRM.renderControl(oControl.getAggregation("_button"));
			oRM.write("</div>");
		},
		onAfterRendering: function (oSource) {

			// var canvas = 

			var history = this.getHistory();

			if (!history) {
				return;
			}
			if (history && !history.length) {
				return;
			}

			if (this.getChartType() === "line") {
				this.drawLineChart(oSource, history);
			} else {
				this.drawBarChart(oSource, history);
			}

		},
		drawBarChart: function (oSource, data) {

			var margin = {
					top: 20,
					right: 80,
					bottom: 20,
					left: 30
				},
				width = 1200 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;

			// Parse the date / time
			// var parseDate = d3.isoParse

			var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);

			var y = d3.scaleLinear().range([height, 0]);

			var xAxis = d3.axisBottom()
				.scale(x)
				.tickFormat(d3.timeFormat("%b %d"));

			var yAxis = d3.axisLeft()
				.scale(y)
				.ticks(10);

			var svg = d3.select(oSource.srcControl.getDomRef()).append('svg')
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform",
					"translate(" + margin.left + "," + margin.top + ")");
			var state = this.getSelectedState();
			if (state) {
				data = this.prepareStateHistoryData(data);
			} else {
				data = this.prepareHistoryData(data);

			}
			data.forEach(function (d) {
				d.date = new Date(d["date"]);
				d.value = +d.value;
			});

			x.domain(data.map(function (d) {
				return d.date;
			}));
			y.domain([0, d3.max(data, function (d) {
				return d.value;
			})]);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis.ticks(null).tickSize(0))
				.selectAll("text")
				.style("text-anchor", "middle")
				//       .attr("dx", "-.8em")
				//       .attr("dy", "-.55em")
				//       .attr("transform", "rotate(-90)" );

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis.ticks(null).tickSize(0))
				.append("text")
				//       .attr("transform", "rotate(-90)")
				.attr("y", 6)
				//       .attr("dy", ".71em")
				.style("text-anchor", "middle")
				.text("Value");

			var valueType = this.getConfirmedCasesIndian();
			var bars = svg.selectAll("bar")
				.data(data)
				.enter().append("rect")
				.style("fill", function (d) {
					return valueType ? "red" : "#800000";
				})
				.attr("x", function (d) {
					return x(d.date);
				})
				.attr("width", x.bandwidth())
				.attr("y", function (d) {
					return y(d.value);
				})
				.attr("height", function (d) {
					return height - y(d.value);
				});

			bars.append("text")
				.attr("class", "label")
				//y position of the label is halfway down the bar
				.attr("y", function (d) {
					return x(d.date) + x.bandwidth() + 5;
				})
				//x position is 3 pixels to the right of the bar
				.attr("x", function (d) {
					return y(d.value);
				})
				.text(function (d) {
					return d.value;
				});

		},
		drawLineChart: function (oSource, history) {
			var data = [];
			var state = this.getSelectedState();
			if (state) {
				data = this.prepareStateHistoryData(history);
			} else {
				data = this.prepareHistoryData(history);

			}

			// Margin setup
			var margin = {
					top: 20,
					right: 80,
					bottom: 20,
					left: 30
				},
				width = 1200 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;

			// Basic SVG canvas
			var svg = d3.select(oSource.srcControl.getDomRef()).append('svg')
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// http://bl.ocks.org/zanarmstrong/raw/05c1e95bf7aa16c4768e/
			var parseDate = d3.timeParse("%Y-%m");
			var displayDate = d3.timeFormat("%b %y");
			var displayValue = d3.format(",.0f");

			// Temporal scale
			var x = d3.scaleTime()
				.range([0, width]);

			// Linear scale
			var y = d3.scaleLinear()
				.range([height, height - 200]);

			var line = d3.line()
				.x(function (d) {
					return x(d.date);
				})
				.y(function (d) {
					return y(d.value);
				});

			var g = svg.append("g")
				.attr("transform", "translate(10, 0)");

			data.forEach(function (d) {
				d.value = +d.value;
				d["date"] = new Date(d["date"]);
			});

			x.domain(d3.extent(data, function (d) {
				return d.date;
			}));
			y.domain([0, d3.max(data, function (d) {
				return d.value;
			})]);

			svg.selectAll("text").data(data).enter()
				.append("text")
				.attr("y", 420)
				.attr("x", function (d) {
					return x(d.date);
				})
				.attr("id", "")
				.style("font-size", 10)
				.style("font-family", "monospace")
				.text(function (d, i) {
					return d.date;
				});

			g.selectAll(".value").data([data[data.length - 1]]).enter()
				.append("text")
				.attr("class", "value")
				.attr("y", function (d) {
					return y(d.value);
				})
				.attr("x", width - 20)
				.style("font-size", 20)
				.style("font-family", "monospace")
				.text(function (d, i) {
					return d.value;
				});

			g.selectAll("circle").data(data).enter()
				.append("circle")
				.attr("cx", function (d) {
					return x(d.date);
				})
				.attr("cy", function (d) {
					return y(d.value);
				})
				.attr("r", function (d, i) {
					return 5;
				})
				.attr("id", function (d) {
					return d.id;
				})
				.style("fill", "#fcb0b5")
				.on("mouseover", function (d) {

					d3.select(this).transition().duration(200).style("fill", "#d30715");

					g.selectAll("#tooltip").data([d]).enter().append("text")
						.attr("id", "tooltip")
						.text(function (d, i) {
							return d.value;
						})
						.attr("y", function (d) {
							return y(d.value) - 12
						})
						.attr("x", function (d) {
							return x(d.date);
						});

					g.selectAll("#tooltip_path").data([d]).enter().append("line")
						.attr("id", "tooltip_path")
						.attr("class", "line")
						.attr("d", line)
						.attr("x1", function (d) {
							return x(d.date);
						})
						.attr("x2", function (d) {
							return x(d.date);
						})
						.attr("y1", height)
						.attr("y2", function (d) {
							return y(d.value);
						})
						.attr("stroke", "red")
						.style("stroke-dasharray", ("3, 3"));
				})
				.on("mouseout", function (d) {
					d3.select(this).transition().duration(500).style("fill", "#fcb0b5");

					g.selectAll("#tooltip").remove();
					g.selectAll("#tooltip_path").remove();
				});
			var valueType = this.getConfirmedCasesIndian();
			g.selectAll("path").data([data]).enter().append("path")
				.attr("class", function (d) {
					return valueType ? "line" : "lineMarron";
				})
				.attr("d", line);

			svg.append("g")
				.attr("class", "axis axis--x")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// });

		},
		prepareStateHistoryData: function (data) {
			var value = "";
			var valueType = this.getConfirmedCasesIndian();
			if (valueType) {
				value = "confirmedCasesIndian";
			} else {
				value = "deaths";
			}
			var state = this.getSelectedState();
			debugger;
			var newData = [];
			for (var i = 0; i < data.length; i++) {
				var regional = data[i].regional;
				for (var j = 0; j < regional.length; j++) {
					if (state === regional[j].loc) {
						var dataVl = {
							"id": i + 1,
							"name": state,
							"value": regional[j][value],
							"date": data[i].day
						};
						newData.push(dataVl);
						break;
					}
				}
			}
			return newData;
		},
		prepareHistoryData: function (data) {
			var value = "";
			var valueType = this.getConfirmedCasesIndian();
			if (valueType) {
				value = "confirmedCasesIndian";
			} else {
				value = "deaths";
			}
			var state = this.getSelectedState();
			debugger;
			var newData = [];
			for (var i = 0; i < data.length; i++) {
				var dataVl = {
					"id": i + 1,
					"name": "A",
					"value": data[i].summary[value],
					"date": data[i].day
				};
				newData.push(dataVl);
			}
			return newData;
		}
	});
});