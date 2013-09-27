(function (exports)
{
	//const value here
	var blockWidth=100,blockHeight=20;
	var maxSlot=12
	var padding=30
	var margin={left:50,top:40}
	var height=2*maxSlot*blockHeight+padding+20+margin.top
	var gap=5
	var colorR=[[[255,255],[51,51],[255,0]],
				[[140,30],[140,30],[255,255]],
				[[255,255],[255,255],[255,0]],
				[[205,0],[255,255],[255,255]]
			   ];

	function getType(id,d)
	{
		if (d.event=="launch")
			if (id.indexOf("_m_")>=0)
				return 0 //map
		    else
				return 1 //reduce_copy
		else
			if (d.event=="sort")
				return 2 //reduce_sort
		    else
				return 3 //reduce_reduce
	}

	function getEvent(d)
	{
		res=[]
		for(var i=0;i<d.events.length-1;i++)
		{
			cur={id:d.id,type:getType(d.id,d.events[i]),slot:d.slot,len:d.events[i+1].time-d.events[i].time,time:d.events[i].time,ison:0}
			res.push(cur)
		}
		return res
//		return [{id:d.id,type:getType(d.id),slot:d.slot,len:d.events[1].time-d.events[0].time,time:d.events[0].time,ison:0}]
	}

	function getMax(i,b)
	{
		return d3.max(b.filter(function(d){return d.type==i}).map(function(d){return d.len}))
	}
	
	function display(data)
	{
		var blocks=data.map(getEvent).reduce(function(a,b){return a.concat(b)})
		var maxLens=[]
		for(var i=0;i<4;i++)
			maxLens[i]=getMax(i,blocks)
		
		var func=colorR.map(function(d,i)
							{
								return d.map(function(dd){return d3.scale.linear().domain([0,maxLens[i]]).range(dd)})
							});
		maxSlot=d3.max(blocks.map(function(d){return d.slot}))+1
		height=maxSlot*blockHeight+padding+20+margin.top
		var maxLen=d3.max(blocks.map(function(d){return d.len}))
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
			.attr("y", function(d){return (maxSlot*(d.id.indexOf("_rr_")>=0)+d.slot)*blockHeight+margin.top+gap})
			.attr("height", function(d) { return blockHeight-gap })
			.attr("fill",function(d){return getColor(d)})
			.on("mouseover",function(d){d.ison=1;selected=d;redraw(curLen)})
			.on("mouseout",function(d,i){blocks[i].ison=0;selected=0;redraw(curLen)})
			.transition()
			.duration(1000)
//			.delay(function(d){return x(d.time)*10})
//			.duration(function(d){return x(d.len)*10} )
//			.ease(function(x){return x})
			.attr("width", function(d){return x(d.len)})



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
				.attr("y", function(d){return (maxSlot*(d.id.indexOf("_rr_")>=0)+d.slot)*blockHeight+margin.top+gap})
				.attr("height", function(d) { return blockHeight-gap })
				.attr("fill",function(d){return getColor(d)})
				.attr("opacity",function(d){return 1-0.5*d.ison})
				.transition()
				.duration(100)
				.attr("x", function(d, i) { return x(d.time)+margin.left })
				.attr("width", function(d){return x(d.len)})
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

		function trans(para,x)
		{
			para.map(function(d){d3.scale.linear().domain()})
		}

		function getColor(d)
		{
			return "rgb("+func[d.type].map(function(f){return Math.round(f(d.len))}).join(",")+")"
			if (d.type==0)
				return "rgb(255,51,"+Math.round(255-d.len/maxLens[0]*255)+")"
			if (d.type==1)
				return "rgb("+func[d.type].map(function(f){return Math.round(f(d.len))}).join(",")+")"
//				return "rgb(0,0,"+Math.round(d3.scale.linear().domain([0,maxLens[1]]).range([255,100])(d.len))+",255)"
			//return "rgb("+Math.round(d3.scale.linear().domain([0,maxLens[1]]).range([153,0])(d.len))+",153,255)"
			if (d.type==2)
				return "rgb(255,255,"+Math.round(255-d.len/maxLens[2]*255)+")"
			if (d.type==3)
				return "rgb("+Math.round(d3.scale.linear().domain([0,maxLens[3]]).range([205,0])(d.len))+",255,255)"
		}
	}

	exports.display=display
})(this)
display(jsondata)
