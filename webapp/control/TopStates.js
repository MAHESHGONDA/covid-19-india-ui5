sap.ui.define([
	"sap/ui/core/Control"
], function(Control) {
	"use strict";
	return Control.extend("com.covid19.india.control.ToTenCountry", {
		metadata: {
			properties: {
				/* Business Object properties */

				// only for demonstration
				states: {
					type: "object"
				}
			}

		},
		init: function() {

			// this.margin = {
			// 	top: 80,
			// 	right: 180,
			// 	bottom: 80,
			// 	left: 180
			// };
			// this.width = 960 - this.margin.left - this.margin.right;
			// this.height = 500 - this.margin.top - this.margin.bottom;
		},
		renderer: function(oRM, oControl) {
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
		onAfterRendering: function(oSource) {
			// var svg = d3.select('svg');
			debugger;

			var dataset;
			var map_data;

			var data = [{
				"Country": "Australia",
				"Val": "8.3"
			}, {
				"Country": "Russia",
				"Val": "3.5"
			}, {
				"Country": "Taiwan",
				"Val": "2.2"
			}, {
				"Country": "S Korea",
				"Val": "2.1"
			}, {
				"Country": "Brazil",
				"Val": "1.8"
			}, {
				"Country": "Saudi Arabia",
				"Val": "1.3"
			}, {
				"Country": "Indonesia",
				"Val": "1.2"
			}, {
				"Country": "Thailand",
				"Val": "1.1"
			}, {
				"Country": "Japan",
				"Val": "1.0"
			}, {
				"Country": "Germany",
				"Val": "0.8"
			}, {
				"Country": "France",
				"Val": "0.6"
			}, {
				"Country": "Spain",
				"Val": "0.5"
			}, {
				"Country": "Nigeria",
				"Val": "0.5"
			}, {
				"Country": "UK",
				"Val": "0.4"
			}, {
				"Country": "Turkey",
				"Val": "0.3"
			}, {
				"Country": "Italy",
				"Val": "0.3"
			}, {
				"Country": "India",
				"Val": "0.3"
			}, {
				"Country": "Canada",
				"Val": "0.1"
			}];

			var data = [{
				"fire": "Oakland Hills",
				"year": "1991",
				"deaths": "25",
				"structures": "2.6"
			}, {
				"fire": "Jones",
				"year": "1999",
				"deaths": "1",
				"structures": "0.7"
			}, {
				"fire": "Cedar",
				"year": "2003",
				"deaths": "15",
				"structures": "2.3"
			}, {
				"fire": "Old",
				"year": "2003",
				"deaths": "6",
				"structures": "0.8"
			}, {
				"fire": "Witch",
				"year": "2007",
				"deaths": "2",
				"structures": "1.7"
			}, {
				"fire": "Valley",
				"year": "2015",
				"deaths": "4",
				"structures": "1.9"
			}, {
				"fire": "Tubbs",
				"year": "2017",
				"deaths": "22",
				"structures": "5.5"
			}, {
				"fire": "Nuns",
				"year": "2017",
				"deaths": "3",
				"structures": "1.2"
			}, {
				"fire": "Thomas",
				"year": "2017",
				"deaths": "2",
				"structures": "0.8"
			}, {
				"fire": "Camp",
				"year": "2018",
				"deaths": "56",
				"structures": "10.3"
			}, {
				"fire": "Carr",
				"year": "2018",
				"deaths": "8",
				"structures": "1.6"
			}];

			// d3.csv("data.csv", function(err, data) {

			// 	dataset = data;
			// 	dataset.forEach(function(d) {
			// 		d.year = +d.year;
			// 		d.deaths = +d.deaths;
			// 		d.structures = +d.structures;
			// 	});

			// 	dataset.sort(function(x, y) {
			// 		return d3.descending(x.structures, y.structures);
			// 	})

			// 	draw(dataset);
			// });

			// function draw(data) {
			"use strict";

			var margin = {
					top: 90,
					right: 50,
					bottom: 70,
					left: 175
				},
				container_width = 560,
				container_height = 600,
				width = container_width - margin.left - margin.right,
				height = container_height - margin.top - margin.bottom;

			var svg = d3.select(oSource.srcControl.getDomRef()).append('svg')
				.attr("id", "svg_container")
				.attr("viewBox", `0 0 ${container_width} ${container_height}`)
				.attr("preserveAspectRatio", "xMidYMid")
				.append("g")
				.attr("id", "container")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var main_padding = 20;
			var sub_padding = 45;

			var chart = d3.select('#svg_container')
				.append('g')
				.attr('id', 'text-label')

			chart.append("text")
				.attr("class", "main")
				.text("Historical Perspective of California Wildfires")
				.attr(
					"transform",
					"translate(" + 0 + "," + main_padding + ")"
				);
			chart
				.append("text")
				.attr("class", "sub")
				.text("Structured burned ('000)")
				.attr(
					"transform",
					"translate(" + 0 + "," + sub_padding + ")"
				);

			var footer_data = ["As of Nov 15", "Source: Calfire"]
			svg
				.append("g")
				.attr('class', 'footnote')
				.selectAll('text')
				.data(footer_data)
				.enter()
				.append('text')
				.text(function(d) {
					return d;
				})
				.attr("transform", function(d, i) {
					return "translate(" + (-margin.left) + "," + (height + margin.bottom / 1.3 + i * 14) + ")"
				});

			console.log(data);

			var y_scale = d3
				.scaleBand()
				.domain(
					data.map(function(d) {
						return d.fire;
					})
				)
				.range([0, height])
				.paddingInner(0.1);

			var x_scale = d3
				.scaleLinear()
				.domain([0, d3.max(data, function(d) {
					return d.structures;
				})])
				.nice()
				.rangeRound([0, width]);

			var bars = svg
				.selectAll(".bar")
				.data(data)
				.enter()
				.append("g");

			bars
				.append("rect")
				.attr("class", "background")
				.attr("y", function(d) {
					return y_scale(d.fire);
				})
				.attr("x", -margin.left)
				.style('stroke', 'none')
				.attr("height", y_scale.bandwidth())
				.attr("width", container_width)
				.style("fill", function(d, i) {
					if (i % 2 == 0) {
						return '#FFF1E5';
					} else {
						return '#FFFFFF';
					}
				});

			var xAxis = svg.append("g").attr("class", "x-axis");
			xAxis
				.attr("transform", "translate(0," + 0 + ")")
				.call(
					d3
					.axisTop(x_scale)
					.tickSizeInner(-height + y_scale.bandwidth() * y_scale.paddingInner())
					.tickPadding(6)
				)
				.call(g => g.select(".domain").remove());
			d3.select(".x-axis")
				.selectAll(".tick")
				.each(function(d, i) {
					if (i % 2 != 0) {
						d3.select(this).remove();
					}
				});

			var yAxis = svg.append("g").attr("class", "y-axis");
			yAxis
				.attr("transform", "translate(-5," + 0 + ")")
				.call(
					d3
					.axisLeft(y_scale)
					.tickSizeInner(15)
					.tickSizeOuter(0)
					.tickPadding(85)
				)
				.call(g => g.select(".domain").remove());

			bars
				.append("rect")
				.attr("class", "bar")
				.attr("y", function(d) {
					return y_scale(d.fire);
				})
				.attr("x", function(d) {
					return 0;
				})
				.attr("height", y_scale.bandwidth())
				.attr("width", function(d) {
					return x_scale(d.structures);
				})
				.style("fill", "#1e558a")
				.append("title")
				.text(function(d, i) {
					return d.structures;
				});

			var death_header = svg.append('text')
				.attr('class', 'header-deaths')
				.attr("text-anchor", "middle")
				.attr("x", width + margin.right / 2)
				.attr("y", -5)
				.text("Deaths");
			var year_header = svg.append('text')
				.attr('class', 'header-deaths')
				.attr("text-anchor", "middle")
				.attr("x", -margin.left / 3)
				.attr("y", -5)
				.text("Years");

			var deaths = bars.append("g")
				.attr("class", "deaths")
				.attr("text-anchor", "middle")
				.attr("transform", function(d, i) {
					return "translate(0," + i * (y_scale.bandwidth() + y_scale.bandwidth() * y_scale.padding()) + ")";
				});
			deaths.append("text")
				.attr("x", width + margin.right / 2)
				.attr("y", y_scale.bandwidth() / 2)
				.attr("dominant-baseline", "central")
				.text(function(d) {
					return d.deaths;
				});

			var years = bars.append("g")
				.attr("class", "deaths")
				.attr("text-anchor", "middle")
				.attr("transform", function(d, i) {
					return "translate(0," + i * (y_scale.bandwidth() + y_scale.bandwidth() * y_scale.padding()) + ")";
				});
			years.append("text")
				.attr("x", -margin.left / 3)
				.attr("y", y_scale.bandwidth() / 2)
				.attr("dominant-baseline", "central")
				.text(function(d) {
					return d.year;
				});
			// d3.csv("data.csv", function(err, data) {
			// 	dataset = data;

			// 	dataset.forEach(function(d) {
			// 		d.Val = +d.Val;
			// 		d.OverParity = +d.Val > 1.0 ? true : false;
			// 	})

			// 	dataset.sort(function(x, y) {
			// 		return d3.descending(x.Val, y.Val);
			// 	})

			// 	draw(dataset);
			// });

			// "use strict";

			// var margin = {
			// 		top: 140,
			// 		right: 20,
			// 		bottom: 60,
			// 		left: 90
			// 	},
			// 	container_width = 960,
			// 	container_height = 950,
			// 	width = container_width - margin.left - margin.right,
			// 	height = container_height - margin.top - margin.bottom;

			// var svg = d3.select(oSource.srcControl.getDomRef()).append('svg')
			// 	.append("svg")
			// 	.attr("id", "svg_container")
			// 	.attr("viewBox", `0 0 ${container_width} ${container_height}`)
			// 	.attr("preserveAspectRatio", "xMidYMid")
			// 	.append("g")
			// 	.attr("id", "container")
			// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// var main_padding = 20;
			// var sub_padding = 45;

			// var chart = d3.select('#svg_container')
			// 	.append('g')
			// 	.attr('id', 'text-label')

			// chart.append("text")
			// 	.attr("class", "main")
			// 	.text("Trade dependence on the two superpowers")
			// 	.attr(
			// 		"transform",
			// 		"translate(" + 0 + "," + main_padding + ")"
			// 	);
			// chart
			// 	.append("text")
			// 	.attr("class", "sub")
			// 	.text("Exports to China over exports to the U.S. 2017 (ratio)")
			// 	.attr(
			// 		"transform",
			// 		"translate(" + 0 + "," + sub_padding + ")"
			// 	);

			// var footer_data = ["Source: IMF"]
			// svg
			// 	.append("g")
			// 	.attr('class', 'footnote')
			// 	.selectAll('text')
			// 	.data(footer_data)
			// 	.enter()
			// 	.append('text')
			// 	.text(function(d) {
			// 		return d;
			// 	})
			// 	.attr("transform", function(d, i) {
			// 		return "translate(" + (-margin.left) + "," + (height + margin.bottom / 1.3 + i * 14) + ")"
			// 	});

			// var countries = data.map(function(d) {
			// 	return d["Country"];
			// })

			// var x_max = d3.max(data, function(d) {
			// 	return d.Val;
			// })

			// var y_scale = d3
			// 	.scaleBand()
			// 	.domain(countries)
			// 	.range([0, height])
			// 	.paddingInner(0.1);

			// var x_scale = d3
			// 	.scaleLinear()
			// 	.domain([0, x_max])
			// 	.range([0, width]);

			// var z_scale = d3
			// 	.scaleOrdinal()
			// 	.domain([true, false])
			// 	.range(["#f14e58", "#1c558d"]);

			// var parity = 1;

			// var bars = svg
			// 	.selectAll(".bar")
			// 	.data(data)
			// 	.enter()
			// 	.append("rect")
			// 	.attr("y", function(d) {
			// 		return y_scale(d["Country"]);
			// 	})
			// 	.attr("x", function(d) {
			// 		return x_scale(0)
			// 	})
			// 	.attr("height", y_scale.bandwidth())
			// 	.attr("width", function(d) {
			// 		return x_scale(d.Val);
			// 	})
			// 	.attr("fill", function(d) {
			// 		return z_scale(d.OverParity);
			// 	})
			// 	.append('title')
			// 	.text(function(d) {
			// 		return d.Val;
			// 	})

			// var xAxis = svg.append("g").attr("class", "x-axis");
			// xAxis
			// 	.attr("transform", "translate(0," + 0 + ")")
			// 	.call(
			// 		d3
			// 		.axisTop(x_scale)
			// 		.tickSizeInner(-height)
			// 		.tickSizeOuter(0)
			// 		.tickPadding(10)

			// 	)
			// 	.call(g => g.select(".domain").remove()).style('pointer-events', 'none');

			// d3.select(".x-axis")
			// 	.selectAll(".tick")
			// 	.each(function(d, i) {
			// 		if (i % 2 != 0) {
			// 			d3.select(this).remove();
			// 		}
			// 	});

			// var paddingParity = 50
			// var partyLine = svg.append("line")
			// 	.attr("x1", x_scale(1))
			// 	.attr("y1", -paddingParity)
			// 	.attr("x2", x_scale(1))
			// 	.attr("y2", height)
			// 	.attr("stroke-width", 0.3)
			// 	.attr('stroke-dasharray', 1)
			// 	.attr("stroke", "black");
			// var partyLabel = svg.append("text")
			// 	.attr("x", x_scale(1))
			// 	.attr("y", -paddingParity - 10)
			// 	.attr('text-anchor', 'middle')
			// 	.attr('dominant-baseline', 'baseline')
			// 	.attr('fill', 'black')
			// 	.attr('font-size', '11')
			// 	.text("Parity (ratio=1)");

			// console.log(z_scale.range());
			// svg.selectAll('.z_scale')
			// 	.data(z_scale.range())
			// 	.enter()
			// 	.append("svg:defs").append("svg:marker")
			// 	.attr('class', 'skirty')
			// 	.attr("id", function(d) {
			// 		return "bro" + d;
			// 	})
			// 	.attr("refX", 4)
			// 	.attr("refY", 4)
			// 	.attr("markerWidth", 30)
			// 	.attr("markerHeight", 30)
			// 	.attr("markerUnits", "userSpaceOnUse")
			// 	.attr("orient", "auto")
			// 	.append("path")
			// 	.attr("d", "M 0,0 8,4 0,8 3,4")
			// 	.style("fill", function(d) {
			// 		return d;
			// 	});

			// var labelPadding = 5;
			// var exportLabel = ['Export more to US', 'Export more to China']
			// svg.selectAll('boise').data(exportLabel)
			// 	.enter()
			// 	.append('text')
			// 	.attr("x", function(d, i) {
			// 		if (i == 0) {
			// 			return x_scale(1) - labelPadding
			// 		};
			// 		if (i == 1) {
			// 			return x_scale(1) + labelPadding
			// 		};
			// 	})
			// 	.attr("y", -paddingParity / 2)
			// 	.attr('text-anchor', function(d, i) {
			// 		if (i == 0) {
			// 			return 'end';
			// 		} else {
			// 			return 'start';
			// 		}
			// 	})
			// 	.attr('dominant-baseline', 'baseline')
			// 	.attr('fill', function(d, i) {
			// 		if (i == 0) {
			// 			return z_scale(false)
			// 		};
			// 		if (i == 1) {
			// 			return z_scale(true)
			// 		};
			// 	})
			// 	.attr('font-weight', 'bold')
			// 	.attr('font-size', '10')
			// 	.text(function(d) {
			// 		return d;
			// 	});

			// var linePadding = -(paddingParity + paddingParity / 2) / 2 - 5;
			// svg.selectAll('line.dsaboi')
			// 	.data(exportLabel)
			// 	.enter()
			// 	.append('line')
			// 	.attr('class', 'skirt')
			// 	.attr("x1", x_scale(1) + labelPadding)
			// 	.attr("y1", linePadding)
			// 	.attr("x2", 100)
			// 	.attr("y2", linePadding)
			// 	.attr('transform', function(d, i) {
			// 		if (i == 0) {
			// 			return `rotate(0,${x_scale(1)}, ${linePadding})`
			// 		};
			// 		if (i == 1) {
			// 			return `rotate(180,${x_scale(1)}, ${linePadding})`
			// 		};
			// 	})
			// 	.attr("stroke-width", 1.0)
			// 	.attr('stroke', function(d, i) {
			// 		if (i == 0) {
			// 			return z_scale(true)
			// 		};
			// 		if (i == 1) {
			// 			return z_scale(false)
			// 		};
			// 	})
			// 	.attr('marker-end', function(d, i) {
			// 		if (i == 0) {
			// 			return `url(${'#bro' + z_scale(true)})`
			// 		};
			// 		if (i == 1) {
			// 			return `url(${'#bro' + z_scale(false)})`
			// 		};
			// 	})

			// var yAxis = svg.append("g").attr("class", "y-axis");
			// yAxis
			// 	.attr("transform", "translate(-5," + 0 + ")")
			// 	.call(
			// 		d3
			// 		.axisLeft(y_scale)
			// 		.tickSizeInner(15)
			// 		.tickSizeOuter(0)
			// 		.tickPadding(5)
			// 	)
			// 	.call(g => g.select(".domain").remove());

			// // set the dimensions and margins of the graph
			// var margin = {
			// 		top: 20,
			// 		right: 30,
			// 		bottom: 40,
			// 		left: 90
			// 	},
			// 	width = 460 - margin.left - margin.right,
			// 	height = 400 - margin.top - margin.bottom;

			// // append the svg object to the body of the page
			// // var svg = d3.select("#my_dataviz")
			// var svg = d3.select(oSource.srcControl.getDomRef()).append('svg')
			// 	.append("svg")
			// 	.attr("width", width + margin.left + margin.right)
			// 	.attr("height", height + margin.top + margin.bottom)
			// 	.append("g")
			// 	.attr("transform",
			// 		"translate(" + margin.left + "," + margin.top + ")");

			// // Parse the Data
			// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function(data) {

			// 	// Add X axis
			// 	var x = d3.scaleLinear()
			// 		.domain([0, 13000])
			// 		.range([0, width]);
			// 	svg.append("g")
			// 		.attr("transform", "translate(0," + height + ")")
			// 		.call(d3.axisBottom(x))
			// 		.selectAll("text")
			// 		.attr("transform", "translate(-10,0)rotate(-45)")
			// 		.style("text-anchor", "end");

			// 	// Y axis
			// 	var y = d3.scaleBand()
			// 		.range([0, height])
			// 		.domain(data.map(function(d) {
			// 			return d.Country;
			// 		}))
			// 		.padding(.1);
			// 	svg.append("g")
			// 		.call(d3.axisLeft(y))

			// 	//Bars
			// 	svg.selectAll("myRect")
			// 		.data(data)
			// 		.enter()
			// 		.append("rect")
			// 		.attr("x", x(0))
			// 		.attr("y", function(d) {
			// 			return y(d.Country);
			// 		})
			// 		.attr("width", function(d) {
			// 			return x(d.Value);
			// 		})
			// 		.attr("height", y.bandwidth())
			// 		.attr("fill", "#69b3a2")

			// 	// .attr("x", function(d) { return x(d.Country); })
			// 	// .attr("y", function(d) { return y(d.Value); })
			// 	// .attr("width", x.bandwidth())
			// 	// .attr("height", function(d) { return height - y(d.Value); })
			// 	// .attr("fill", "#69b3a2")

			// });

		}
	});
});