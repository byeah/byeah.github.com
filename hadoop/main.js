(function (exports)
{
	//const value here
	var blockWidth=100,blockHeight=20;
	var maxSlot=10
	var padding=30
	var colors=["rgba(255,0,0,","rgba(0,0,255,"]
	var margin={left:50,top:5}
	var height=2*maxSlot*blockHeight+padding+20+margin.top
	function getType(id)
	{
		if (id.indexOf("_m_")>=0)
			return 0
		else
			return 1
	}

	function getEvent(d)
	{
		return [{id:d.id,type:getType(d.id),slot:d.slot,len:d.events[1].time-d.events[0].time,time:d.events[0].time,ison:0}]
	}

	function display(data)
	{
		var blocks=data.map(getEvent).reduce(function(a,b){return a.concat(b)})
		var maxLen=d3.max(blocks.filter(function(d){return d.id.indexOf("_m_")>=0}).map(function(d){return d.len}))
		var maxTime=d3.max(blocks.map(function(d){return d.time+d.len}))
		alert(maxTime)
		var chart = d3.select("body").append("svg")
			.attr("class", "chart")
			.attr("width", blocks.length*blockWidth*10)
			.attr("height", height)
		var x=d3.scale.linear().domain([0,maxLen]).range([0,blockWidth])
		var svg=chart.selectAll("rect")
			.data(blocks)
			.enter().append("rect")
			.attr("x", function(d, i) { return x(d.time)+margin.left })
			.attr("y", function(d){return (maxSlot*(d.id.indexOf("_rr_")>=0)+d.slot)*blockHeight+margin.top+0.5})
			.attr("width", function(d){return x(d.len)})
			.attr("height", function(d) { return blockHeight-0.5 })
			.attr("fill",function(d){return colors[d.type]+1+")"})
			.on("mouseover",function(d,i){blocks[i].ison=1;redraw(curLen)})
			.on("mouseout",function(d,i){blocks[i].ison=0;redraw(curLen)})

/*		chart.selectAll("text")
			.data(blocks)
			.enter().append("text")
			.attr("x", function(d, i) { return x(d.time)+margin.left })
			.attr("y", function(d){return (maxSlot*(d.id.indexOf("_rr_")>=0)+d.slot+0.5)*blockHeight+margin.top})
			.text(function(d){if (x(d.len)>30) return d.len+"s"; else return "";})
			.attr("dx", function(d){return 3})
			.attr("dy", function(d) { return ".35em" })
*/
		var xAxis = d3.svg.axis().scale(d3.scale.linear().domain([0,maxTime]).range([0,x(maxTime)])).orient("bottom");
		chart.append("g")
			.attr("class", "axis")
			.attr("transform", "translate("+margin.left+"," + (height - padding) + ")")
			.call(xAxis)



		var curLen=maxLen
		d3.select("body").on("mousewheel",function(){if (curLen+event.wheelDelta/60<3)return;curLen+=event.wheelDelta/60;redraw(curLen)})

		function redraw(curLen)
		{
			var x=d3.scale.linear().domain([0,curLen]).range([0,blockWidth])
			var xAxis = d3.svg.axis().scale(d3.scale.linear().domain([0,maxTime]).range([0,x(maxTime)])).orient("bottom");
			chart.select("g")
				.transition()
				.duration(100)
				.call(xAxis)
			//		.text(function(d){return d.+"s"})
			chart.selectAll("rect")
				.transition()
				.duration(100)
				.attr("x", function(d, i) { return x(d.time)+margin.left })
				.attr("y", function(d){return (maxSlot*(d.id.indexOf("_rr_")>=0)+d.slot)*blockHeight+margin.top})
				.attr("width", function(d){return x(d.len)})
				.attr("height", function(d) { return blockHeight })
				.attr("fill",function(d){return colors[d.type]+(1-0.5*d.ison)+")"})
			
/*			chart.selectAll("text")
				.data(blocks)
				.transition()
				.duration(200)
				.attr("x", function(d, i) { return x(d.time)+margin.left })
				.attr("y", function(d){return (maxSlot*(d.id.indexOf("_rr_")>=0)+d.slot+0.5)*blockHeight+margin.top})
				.text(function(d){if (x(d.len)>30) return d.len+"s"; else return "";})
				.attr("dx", function(d){return 3})
				.attr("dy", function(d) { return ".35em" })
*/		}
	}
	exports.display=display
})(this)
display(jsondata)

