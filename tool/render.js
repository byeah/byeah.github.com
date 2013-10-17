(function(exports)
 {
	 var enter,svgs=[],svgheader=undefined;
	 
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
			 if (!svgheader)
			 {
				 svgheader=svg.cloneNode(true)
				 while(svgheader.firstChild)
					 svgheader.removeChild(svgheader.firstChild)
			 }
			 
			 var gg=svg.childNodes[1].childNodes[1]
			 while(gg.firstChild)
				 gg.removeChild(gg.firstChild)
			 res.header=svg.childNodes[1]
			 return res
		 })
//		 console.log(svgs[0])
	 }
		 
	 function clear()
	 {
		 console.log("!")
		 d3.selectAll("svg").remove()
		 //d3.selectAll()
		 d3.selectAll(".canvas").remove()
		 d3.selectAll("#sel").remove()
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
		 console.log(svgs.length)
		 var body=d3.select("body")
		 var div=body.append("div").attr("style","position:absolute;left:2%;top:10px;height:65%; width: 65%").attr("class","canvas")
		 steps=d3.max(svgs.map(function(d){return d.path.length}))
		 div.node().appendChild(svgheader.cloneNode(true))
		 var svg=d3.select("svg")
		 for(var i=0;i<steps;i++)
			 svgs.forEach(function(d,k){
				 //if (k>10)return
				 if (d.path.length<=i)return;
				 //var svg=d.header.cloneNode(true)
				 var g=d.header.cloneNode(true)
				 //var g=svg.childNodes[1].childNodes[1]
				 var gg=g.childNodes[1]
				 gg.appendChild(enter)
				 gg.appendChild(d.path[i].cloneNode(true))
				 gg.childNodes[1].setAttribute("id","path"+i+"_"+k)
				 //var div=body.append("div").attr("style","position:absolute;left:2%;top:10px;height:60%; width: 65%").attr("class","canvas")
				 svg.node().appendChild(g)
				 //div.node().appendChild(svg)
				 svg.select("#path"+i+"_"+k).attr("opacity",0).attr("stroke",color(i*1.0/d.path.length)).attr("onclick","click(this.id)").attr("class","ppp")
				 
			 })
		 var cur=0
		 var n=svgs.length
		 var frameT=100
		/* var tid=setInterval(function()
							 {
								 for(var i=0;i<n;i++)
								 {
									 var gs=d3.select("#path"+cur+"_"+i)
									 gs.attr("opacity",0.3)
								 }
								 cur=cur+1
							 },frameT)
		 setTimeout(function(){clearInterval(tid)},frameT*steps)*/
		 d3.selectAll(".ppp").attr("opacity",0.3)
		 
	 }

	 function add(i,k,svg,op)
	 {
		 var g=svgs[i].header.cloneNode(true)
		 //console.log(i,k,svgs[i].path[k])
		 //console.log("len",i,svgs[i].path.length)
		 var gg=g.childNodes[1]
		 gg.appendChild(enter)
		 gg.appendChild(svgs[i].path[k].cloneNode(true))
		 svg.select("#path"+k+"_"+i).remove()
		 gg.childNodes[1].setAttribute("id","path"+k+"_"+i)
		 //g.setAttribute("id","sel")
		 svg.node().appendChild(g)
		 svg.select("#path"+k+"_"+i).attr("opacity",op).attr("stroke",color(k*1.0/svgs[i].path.length)).attr("onclick","click(this.id)")
	 }

	 function addAll(svg,op)
	 {
		 console.log(steps)
		 for(var i=0;i<steps;i++)
			 for(k=0;k<svgs.length;k++)
				 if (svgs[k].path.length>i)
					 add(k,i,svg,op)
	 }

	 exports.cl=clear

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
			 select:function(tid,selected)
			 {
				 console.log(tid,selected)
				 d3.selectAll("g").remove()
				 //d3.selectAll("#sel").remove()
				 var svg=d3.select("svg")
				 if (tid==100)
				 {
					 if (selected.length==0)
						 addAll(svg,0.3)
//						 d3.selectAll("path").attr("opacity",0.3)
					 else
					 {
//						 d3.selectAll("path").attr("opacity",0.05)
						 addAll(svg,0.05)
						 selected.forEach(function(d){
							 var i=parseInt(d.substr(d.indexOf("_")+1))
							 for(var k=0;k<svgs[i].path.length;k++)
								 add(i,k,svg,0.8)
//								 svg.node()append()
								 //d3.select("#path"+k+"_"+i).attr("opacity",0.8)//,console.log("sel#path"+k+"_"+i)
//								 d3.select("#"+d).attr("opacity",0.8)
						 })
					 }
				 }
				 else
				 {
					 //d3.selectAll("path").attr("opacity",0)					 
					 for(var i=0;i<svgs.length;i++)
					 {
						 if (svgs[i].path.length<6)continue
						 var id=parseInt(tid/100.0*svgs[i].path.length)
					//	 console.log(tid)//*svgs[i].path.length)
					//	 console.log("#path"+id+"_"+i)
						 if (selected.length==0)
							 add(i,id,svg,0.5)
							 //d3.select("#path"+id+"_"+i).attr("opacity",0.5)
						 else
							 add(i,id,svg,0.1)
							// d3.select("#path"+id+"_"+i).attr("opacity",0.1)
					 }
					 selected.forEach(function(d){
						 var i=parseInt(d.substr(d.indexOf("_")+1))
						 console.log("leng",svgs[i].path.length)
						 var id=parseInt(tid/100.0*svgs[i].path.length)
						 add(i,id,svg,0.8)
						 //d3.select("#path"+id+"_"+i).attr("opacity",0.8)
					 })
				 }
				 
			 }
		 }
	 }
 
 }
)(this)


