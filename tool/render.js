(function(exports)
 {
	 var enter,svgs;
	 
	 function process(data)
	 {
		 var id=0;
		 enter={}
		 svgs=data.map(function(xml){
			 res={}
			 res.path=xml.getElementsByTagName("path")
			 d=xml.getElementsByTagName("svg")
			 enter=d[0].childNodes[0]
			 var svg=d[0].cloneNode(true)
			 var gg=svg.childNodes[1].childNodes[1]
			 while(gg.firstChild)
				 gg.removeChild(gg.firstChild)
			 res.header=svg
			 return res
		 })
		 console.log(svgs[0])
	 }
		 
	 function clear()
	 {
		// d3.selectAll("svg").remove()
		 d3.selectAll(".canvas").remove()
	 }

	 function test()
	 {
		 svgs.forEach(function(d,k){
			 var svg=d.header.cloneNode(true)
			 var g=svg.childNodes[1].childNodes[1]
			 console.log(g)
			 for(var i=0;i<d.path.length;i++)
			 {
				 g.appendChild(enter)
				 g.appendChild(d.path[i])
			 }
			 body.append("div").attr("id","div"+k).attr("style","position:absolute;left:50px;top:50px;height:800px; width: 1200px").node().appendChild(svg)
		 })
	 }

	 
	 function color(d)
	 {
//		 var a=d3.scale.category20()
//		 console.log(a(0),a(4))
//		 console.log(a(parseInt(d*10)))
//		 return a(parseInt(d*5))
		 if (d>1)d=1
		 var red=d3.scale.linear().domain([0,1]).range([0,255])
		 return "rgb("+parseInt(red(d))+","+(255-parseInt(red(d)))+",0)"
	 }

	 var steps
	 
	 function render()
	 {
		 var body=d3.select("body")
		 steps=d3.max(svgs.map(function(d){return d.path.length}))
		 for(var i=0;i<steps;i++)
			 svgs.forEach(function(d,k){
				 if (d.path.length<=i)return;
				 var svg=d.header.cloneNode(true)
				 var g=svg.childNodes[1].childNodes[1]
				 g.appendChild(enter)
				 g.appendChild(d.path[i])
				 var div=body.append("div").attr("style","position:absolute;left:2%;top:10px;height:65%; width: 65%").attr("class","canvas")
				 div.node().appendChild(svg)
				 div.select("path").attr("id","path"+i+"_"+k).attr("opacity",0).attr("stroke",color(i*1.0/d.path.length))
			 })
		 var cur=0
		 var n=svgs.length
		 var frameT=100
		 var tid=setInterval(function()
							 {
								 for(var i=0;i<n;i++)
								 {
									 var gs=d3.select("#path"+cur+"_"+i)
									 gs.attr("opacity",0.3)
								 }
								 cur=cur+1
							 },frameT)
		 setTimeout(function(){clearInterval(tid)},frameT*steps)
		 
	 }

	 exports.renderer=function()
	 {
		 var cur=101
		 return {
			 init:function(data)
			 {
				 clear()
				 process(data)
				 render()
			 },
			 select:function(tid)
			 {
				 console.log(tid)
				 if (tid==100)
					 d3.selectAll("path").attr("opacity",0.3)
				 else
				 {
					 d3.selectAll("path").attr("opacity",0)
					 for(var i=0;i<svgs.length;i++)
					 {
						 if (svgs[i].path.length<6)continue
						 var id=parseInt(tid/100.0*svgs[i].path.length)
					//	 console.log(tid)//*svgs[i].path.length)
					//	 console.log("#path"+id+"_"+i)
						 d3.select("#path"+id+"_"+i).attr("opacity",0.5)
					 }
				 }
				 
			 }
		 }
	 }
 
 }
)(this)


