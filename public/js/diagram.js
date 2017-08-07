var Diagram = {
	init: function(){
		var novobavar = listResult.filter(function(obj){
			return obj.address['2'] == "Жовтневий"
		});

		var osnovyn = listResult.filter(function(obj){
			return obj.address['2'] == "Червонозаводський"
		});

		var district = [['42','43','44','45','65'],['58','59','60','61']];
		var districtNames = [{'name': 'Ново-Баварский район'}, {'name': 'Основянский район'}]

		var novobavarDistrict = district[0].map(function(dist){
			return novobavar.filter(function(obj){
				return obj.address['3'] == dist
			})
		});

		var osnovynDistrict = district[1].map(function(dist){
			return osnovyn.filter(function(obj){
				return obj.address['3'] == dist
			})
		});

		var floorLevel = [2,3,4,5,6,7,8,9,10,12,14,16].map(String);

		var novobavarFloorLevel = floorLevel.map(function(level){
			return novobavarDistrict.map(function(dist){
				return dist.filter(function(obj){
					return obj.address['17'] == level
				})
			})
		})
		novobavarFloorLevelRoofValue = novobavarFloorLevel.map(function(dist){
			return dist.map(function(adrs){
				return adrs.map(function(ad){
					return ad.address['22'];
				}).map(Number)
				.reduce(function(obj, num){
					if (!!num) {
						return {
							count: obj.count + 1,
							value: obj.value + num
						}
					} else {
						return obj
					}
				}, {count: 0, value: 0})
			})
			
		})

		var osnovynFloorLevel = floorLevel.map(function(level){	
			return osnovynDistrict.map(function(dist){
				return dist.filter(function(obj){
					return obj.address['17'] == level
				})
			})
		})

		osnovynFloorLevelRoofValue = osnovynFloorLevel.map(function(dist){
			return dist.map(function(adrs){
				return adrs.map(function(ad){
					return ad.address['22'];
				}).map(Number)
				.reduce(function(obj, num){
					if (!!num) {
						return {
							count: obj.count + 1,
							value: obj.value + num
						}
					} else {
						return obj
					}
				}, {count: 0, value: 0})
			})
		})
		var FloorLevelRoofValue = [novobavarFloorLevelRoofValue, osnovynFloorLevelRoofValue];

		var dataNovo = {}
		var dataOsno = {}

		function helpfunction(data, typeRepair, district, typeRepairObj){
			data[typeRepair] = district.map(function(adrs){
				return adrs.map(function(ob){
					return ob[typeRepairObj].value
				})
				.map(Number)
				.reduce(function(obj, num){
					if (!!num) {
						return {
							count: obj.count + 1,
							value: obj.value + num
						}
					} else {
						return obj
					}
				}, {count: 0, value: 0})
			})
		}
		var typeRepair = ["Очистка кровли", "Ремонт отдельных элементов", "Проклейка отдельных элементов", "Ремонт металлических элементов"];
		var typeRepairObj = ["clear", "element", "glue", "metal"];

		typeRepair.forEach(function(val, ind){
			helpfunction(dataNovo, val, novobavarDistrict, typeRepairObj[ind])
			helpfunction(dataOsno, val, osnovynDistrict, typeRepairObj[ind])
		})
		var fullDistrictData = [dataNovo, dataOsno];

		typeRepair.forEach(function(typeOfRepair, ind){
			district.forEach(function(dist, indx){

				// default params
				var params = {
					parentSelector: ".diagram",
					graphWidth: 350,
					graphHeigth: 280,
					title: typeOfRepair,
					yAxisName: "№ Участка",
					xLeftAxisName: "Количество домов",
					xRightAxisName: "Объем", 
					xAxisPadding: 30,
					yAxisPadding: 20,
					barPadding: 4
				};
				var margin = {top: 40, right: 20, bottom: 60, left: 50},
				totalWidth = params.graphWidth + margin.left + margin.right,
				totalHeight = params.graphHeigth + margin.top + margin.bottom;

				var svg = d3.select(params.parentSelector).append("svg")
				.attr("width", totalWidth)
				.attr("height", totalHeight)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

			// add title
			svg.append("text").attr("x", params.graphWidth/2 ) .attr("y", 0 - (margin.top / 2))
			.attr("text-anchor", "middle").style("font-size", "20px").style("font-weight", "700")
			.text(params.title);

			// scale
			var xLeft = d3.scale.linear()
			.range([0, params.graphWidth/2 - params.barPadding/2]);

			var xRight = d3.scale.linear()
			.range([0, params.graphWidth/2 - params.barPadding/2]);

			var y = d3.scale.ordinal()
			.rangeRoundBands([0, params.graphHeigth], 0.2);

			xLeftAxis = d3.svg.axis().scale(xLeft).orient('botton').ticks(5);
			xRightAxis = d3.svg.axis().scale(xRight).orient('botton');
			yAxis = d3.svg.axis().scale(y).orient('left');

			xLeft.domain([d3.max(fullDistrictData[indx][typeOfRepair].map(function(d) { return d.count; })), 0]).nice();
			xRight.domain([0, d3.max(fullDistrictData[indx][typeOfRepair].map(function(d) { return d.value; }))]).nice();
			y.domain(dist);

			var bars = svg.selectAll(".bar").data(fullDistrictData[indx][typeOfRepair]).enter();


			// left bars
			bars.append("rect")
			.attr("class", "bar bar"+indx)
			.attr("x", function(d){ return xLeft(d.count) })
			.attr("width", function(d){ return params.graphWidth/2 - params.barPadding/2 - xLeft(d.count); })
			.attr("y", function(d, ind){ return y(dist[ind])} )
			.attr("height", y.rangeBand());

			// right bars
			bars.append("rect")
			.attr("class", "bar")
			.attr("x", params.graphWidth/2 + params.barPadding/2 )
			.attr("width", function(d){ return xRight(d.value); })
			.attr("y", function(d, ind){ return y(dist[ind])} )
			.attr("height", y.rangeBand());


			// axis
			svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(' + 0 + ',' + (params.graphHeigth + params.xAxisPadding) + ')')
			.call(xLeftAxis)
			.selectAll('.domain')
			.attr({
				'fill': 'none',
				'stroke-width': 1,
				'stroke': 'grey'
			})
			.select(function() {
				return this.parentNode;
			})
			.selectAll('.tick line')
			.attr({
				'fill': 'none',
				'stroke-width': 1,
				'stroke': 'grey'
			})

			svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(' + (params.graphWidth/2 + params.barPadding) + ',' + (params.graphHeigth + params.xAxisPadding) + ')')
			.call(xRightAxis)
			.selectAll('.domain')
			.attr({
				'fill': 'none',
				'stroke-width': 1,
				'stroke': 'grey'
			})
			.select(function() {
				return this.parentNode;
			})
			.selectAll('text')
			.attr({
				'transform': 'rotate(-90)',
				'text-anchor': 'middle',
				'dx': '1.4em',
				'dy': '-0.2em'
			})
			.select(function() {
				return this.parentNode;
			})
			.selectAll('.tick line')
			.attr({
				'fill': 'none',
				'stroke-width': 1,
				'stroke': 'grey'
			})

			svg.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + ( -params.yAxisPadding ) + ',' + 0 + ')')
			.call(yAxis)
			.selectAll('.domain')
			.attr({
				'fill': 'none',
				'stroke-width': 1,
				'stroke': 'grey'
			})
			.select(function() {
				return this.parentNode;
			})
			.selectAll('.tick line')
			.attr({
				'fill': 'none',
				'stroke-width': 1,
				'stroke': 'grey'
			})

			// label
			svg.append("text")
			.attr("x", params.yAxisPadding + 10)
			.attr("y", 0)
			.attr("text-anchor", "middle")
			.style("font-size", "11px")
			.text(params.yAxisName);

			svg.append("text")
			.attr("x", params.xAxisPadding + 10)
			.attr("y", params.graphHeigth + params.yAxisPadding)
			.attr("text-anchor", "middle")
			.style("font-size", "11px")
			.text(params.xLeftAxisName);

			svg.append("text")
			.attr("x", params.graphWidth)
			.attr("y", margin.top + params.graphHeigth + 6)
			.attr("text-anchor", "end")
			.style("font-size", "11px")
			.text(params.xRightAxisName);
		})
})

var width = 830;
var height = 900;

var svg = d3.select('.diagram')
.append("svg")
.attr("width", width)
.attr("height", height)

var color = d3.scale.category20b();

var sankey = d3.sankey()
.nodeWidth(40)
.nodePadding(20)
.extent([[0, 0], [width - 1, height - 10]]);

var link = svg.append("g")
.attr("class", "links")
.attr("fill", "none")
.attr("stroke", "#000")
.attr("stroke-opacity", 0.2)
.selectAll("path");

var node = svg.append("g")
.attr("class", "nodes")
.attr("font-size", 14)
.selectAll("g");

var districtNodes = district
.reduce(function(arr, ar){ return arr.concat(ar)})
.map(function(val){
	return {
		'name': val + ' участок'
	}
})

var floorLevelNodes = floorLevel.map(function(val){
	return {
		'name': val + ' этажный'
	}
})
floorLevelNodes = floorLevelNodes.concat(districtNodes, districtNames)

var FloorLevelRoofValueLinks = [];
FloorLevelRoofValue.forEach(function(dist, ind){
	
	var floorLinks = dist.map(function(floor, indx){
		return floor.map(function(numDist, inds){
			return {
				'source': floorLevelNodes.map(function(e) { return e.name; }).indexOf(floorLevelNodes[indx].name),
				'target': floorLevelNodes.map(function(e) { return e.name; }).indexOf(district[ind][inds] + ' участок'),
				'value': numDist.value,
				'count': numDist.count
			}
		})
	}).reduce(function(a, b){ return a.concat(b) })
	

	var districtLinks = dist.map(function(floor, indx){
		return floor.map(function(distObj, inds){
			return {
				'source': floorLevelNodes.map(function(e) { return e.name; }).indexOf(district[ind][inds] + ' участок'),
				'target': floorLevelNodes.map(function(e) { return e.name; }).indexOf(districtNames[ind].name),
				'value': distObj.value,
				'count': distObj.count
			}
		})
	})

	var dist = district[ind].map(function(disNum, indsx){
		return {
			'source': floorLevelNodes.map(function(e) { return e.name; }).indexOf(disNum + ' участок'),
			'target': floorLevelNodes.map(function(e) { return e.name; }).indexOf(districtNames[ind].name),
			'value': districtLinks.reduce(function(a, b, i){
				return a += b[indsx].value
			}, 0),
			'count': districtLinks.reduce(function(a, b, i){
				return a += b[indsx].count
			}, 0)
		}
	})

	districtLinks = dist
	FloorLevelRoofValueLinks.push(floorLinks)

	FloorLevelRoofValueLinks.push(districtLinks)
})


FloorLevelRoofValueLinks = FloorLevelRoofValueLinks.reduce(function(a, b){ return a.concat(b) })

var dataToSankey = {
	'nodes': floorLevelNodes,
	'links': FloorLevelRoofValueLinks.map(function(val){ val.value = val.value>>0; return val }).filter(function(val){ return val.count !== 0 })
}

sankey(dataToSankey);

link = link
.data(dataToSankey.links)
.enter().append("path")
.attr("d", d3.sankeyLinkHorizontal())
.attr("stroke-width", function(d) { return Math.max(1, d.width); });

link.append("title")
.text(function(d) { return d.source.name + " → " + d.target.name + "\n" + d.value + "м2" + "\n" + d.count + "домов"; });

node = node
.data(dataToSankey.nodes)
.enter().append("g");

node.append("rect")
.attr("x", function(d) { return d.x0; })
.attr("y", function(d) { return d.y0; })
.attr("height", function(d) { return d.y1 - d.y0; })
.attr("width", function(d) { return d.x1 - d.x0; })
.attr("fill", function(d, i) { return color(i); })
.attr("stroke", "#000");

node.append("text")
.attr("x", function(d) { return d.x0 - 6; })
.attr("y", function(d) { return (d.y1 + d.y0) / 2; })
.attr("dy", "0.35em")
.attr("text-anchor", "end")
.text(function(d) { return d.name; })
.filter(function(d) { return d.x0 < width / 2; })
.attr("x", function(d) { return d.x1 + 6; })
.attr("text-anchor", "start");

node.append("title")
.text(function(d) { return d.name + "\n" + d.value + "м2"; });

var table = d3.select('.diagram')
.append("table")
.attr({
	'class': 'table-hover table-bordered table-condensed text-center',
	'table-layout': 'fixed'
})


d3.select('.diagram').append("div").attr({
	'class': 'newTable'
}).html('<h2>Обследуемый объем кровли домов</h2>')
var table = d3.select('.diagram').append("table").attr({
	'class': 'table-hover table-bordered table-condensed text-center',
	'table-layout': 'fixed'
})

var thead = table.append('thead')
thead.append('tr')
.selectAll('th')
.data(['Участки \\ Этажность'].concat(floorLevel)).enter()
.append('th')
.html(function (column) { return (column !== 'Участки \\ Этажность')? column + ' этаж.': column; });

FloorLevelRoofValue.forEach(function(dis, indexes){

	var	tbody = table.append('tbody');
	tbody.append('tr').html(districtNames[indexes].name).attr({
		'class': 'captionTbody' + ' legend' + indexes
	})
	
	var rows = tbody.selectAll('tr')
	.data(district[indexes])
	.enter()
	.append('tr');


	var cells = rows.selectAll('td')
	.data([''].concat(dis))
	.enter()
	.append('td')
	.html(function (d, i, k) { if(i == 0){return district[indexes][k] } else return d[k].value?(Math.floor(d[k].value) + ''):'-'; });

})



d3.select('.diagram').append("div").attr({
	'class': 'newTable'
}).html('<h2>Количество домов</h2>')
var table = d3.select('.diagram').append("table")
.attr({
	'class': 'table-hover table-bordered table-condensed text-center',
	'table-layout': 'fixed'
})

var thead = table.append('thead')
thead.append('tr')
.selectAll('th')
.data(['Участки \\ Этажность'].concat(floorLevel)).enter()
.append('th')
.html(function (column) { return (column !== 'Участки \\ Этажность')? column + ' этаж.': column; });

FloorLevelRoofValue.forEach(function(dis, indexes){

	var	tbody = table.append('tbody');
	tbody.append('tr').html(districtNames[indexes].name).attr({
		'class': 'captionTbody' + ' legend' + indexes
	})
	
	var rows = tbody.selectAll('tr')
	.data(district[indexes])
	.enter()
	.append('tr');


	var cells = rows.selectAll('td')
	.data([''].concat(dis))
	.enter()
	.append('td')
	.html(function (d, i, k) { if(i == 0){return district[indexes][k] } else return d[k].value?(d[k].count + ''):'-'; });

})

}
};
Diagram.init();