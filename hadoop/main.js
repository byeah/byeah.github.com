(function (exports)
{
	//const value here
	var blockWidth=100,blockHeight=20;
	var maxSlot=10
	var padding=30
	var colors=["#FF47A3","#3366FF"]
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
		var maxLen=d3.max(blocks.map(function(d){return d.len}))
		var maxMapLen=d3.max(blocks.filter(function(d){return d.id.indexOf("_m_")>=0}).map(function(d){return d.len}))
		var maxReduceLen=d3.max(blocks.filter(function(d){return d.id.indexOf("_r_")>=0}).map(function(d){return d.len}))
		var maxTime=d3.max(blocks.map(function(d){return d.time+d.len}))
		var chart = d3.select("body").append("svg")
			.attr("class", "chart")
			.attr("width", blocks.length*blockWidth*10)
			.attr("height", height)
		var curLen=d3.scale.linear().range([0,maxTime]).domain([0,1024])(blockWidth)
		var x=d3.scale.linear().domain([0,curLen]).range([0,blockWidth])
		var selected=0
		var svg=chart.selectAll("rect")
			.data(blocks)
			.enter().append("rect")
			.attr("x", function(d, i) { return x(d.time)+margin.left })
			.attr("y", function(d){return (maxSlot*(d.id.indexOf("_rr_")>=0)+d.slot)*blockHeight+margin.top+0.5})
			.attr("width", function(d){return x(d.len)})
			.attr("height", function(d) { return blockHeight-0.5 })
			.attr("fill",function(d){return getColor(d)})
			.on("mouseover",function(d){d.ison=1;selected=d;redraw(curLen)})
			.on("mouseout",function(d,i){blocks[i].ison=0;selected=0;redraw(curLen)})

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
		var line = [chart.append("line"),chart.append("line")]
		d3.select("body").on("mousewheel",function()
							 {
								 var delta=curLen*(event.wheelDelta/120)*0.15
								 if (Math.abs(delta)<2)
									 delta=event.wheelDelta/60
								 if (curLen-delta<3)return
								 curLen+=-delta
								 x=d3.scale.linear().domain([0,curLen]).range([0,blockWidth])
								 redraw(curLen)
							})

		function redraw(curLen)
		{
			//filter(function(d){return d.id.indexOf("_m_")>=0})	
			var x=d3.scale.linear().domain([0,curLen]).range([0,blockWidth])
			var xAxis = d3.svg.axis().scale(d3.scale.linear().domain([0,maxTime]).range([0,x(maxTime)])).orient("bottom");
			if (selected==0)
				line.map(function(d){d.style("opacity",0)});
			else
			{
				var d=selected
				line[0].transition().duration(100)
					.attr("x1",x(d.time)+margin.left).attr("y1",margin.top).attr("x2",x(d.time)+margin.left).attr("y2",height-padding)
					.style("stroke", "#000").style("stroke-dasharray","5,5").style("opacity",1)
				line[1].transition().duration(100)
					.attr("x1",x(d.time+d.len)+margin.left).attr("y1",margin.top).attr("x2",x(d.time+d.len)+margin.left).attr("y2",height-padding)
					.style("stroke", "#000").style("stroke-dasharray","5,5").style("opacity",1)
			}			
			chart.select("g")
				.transition()
				.duration(100)
				.call(xAxis)
				  //		.text(function(d){return d.+"s"})
			chart.selectAll("rect")
				.transition()
				.duration(100)
				.attr("x", function(d, i) { return x(d.time)+margin.left })
				.attr("y", function(d){return (maxSlot*(d.id.indexOf("_rr_")>=0)+d.slot)*blockHeight+margin.top+0.5})
				.attr("width", function(d){return x(d.len)})
				.attr("height", function(d) { return blockHeight-0.5 })
				.attr("fill",function(d){return getColor(d)})
				.attr("opacity",function(d){return 1-0.5*d.ison})
/*			chart.selectAll("text")
				.data(blocks)
				.transition()
				.duration(200)
				.attr("x", function(d, i) { return x(d.time)+margin.left })
				.attr("y", function(d){return (maxSlot*(d.id.indexOf("_rr_")>=0)+d.slot+0.5)*blockHeight+margin.top})
				.text(function(d){if (x(d.len)>30) return d.len+"s"; else return "";})
				.attr("dx", function(d){return 3})
				.attr("dy", function(d) { return ".35em" })
*/	

		}

		function getColor(d)
		{
//			console.log(d.type,d.len,maxMapLen,maxReduceLen)
			if (d.type==0)
			{
			//	console.log((255-d.len/maxMapLen*255))
//				console.log("rgb(255,51,"+int(255-d.len/maxMapLen*255)+")")
				return "rgb(255,51,"+Math.round(255-d.len/maxMapLen*255)+")"
			}
			else
				return "rgb(0,51,"+Math.round(d3.scale.linear().domain([0,maxReduceLen]).range([255,153])(d.len))+")"
		}
	}

	exports.display=display
})(this)
display(jsondata)

