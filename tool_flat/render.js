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

	 var stopAni;
	 var all=40
	 var W=800,H=600
	 
	 function render()
	 {
		 console.log(svgs.length)
		 var body=d3.select("body")
		 steps=d3.max(svgs.map(function(d){return d.path.length}))
		 svgs.forEach(function(d,k){
			 if (k>=all)return;
			 var x=parseInt(k/8),y=k%8;
			 var div=body.append("div").attr("style","position:absolute;left:"+(y*100+20)+"px;top:"+(x*100+20)+"px;height:100px; width: 100px").attr("class","canvas")
			 div.node().appendChild(svgheader.cloneNode(true))
			 var svg=div.select("svg")
			 
			 var g=d.header.cloneNode(true)
			 //var g=svg.childNodes[1].childNodes[1]
			 var gg=g.childNodes[1]
			 for(var i=0;i<d.path.length;i++)
				 {
					 //console.log(gg.childNodes.length)
					 //gg.appendChild(enter)
					 gg.appendChild(d.path[i].cloneNode(true))
//					 console.log(gg.childNodes[i*2+1])
					 gg.childNodes[i].setAttribute("id","path"+i+"_"+k)
				 }
			 svg.node().appendChild(g)
			 for(var i=0;i<d.path.length;i++)
				 svg.select("#path"+i+"_"+k).attr("opacity",0).attr("stroke",color(i*1.0/d.path.length)).attr("onclick","click(this.id)").attr("class","ppp").attr("stroke-width",4)
			 
		 })
		 var cur=0
		 var n=svgs.length
		 var frameT=50
		 var ttid=setInterval(function()
							 {
								 for(var i=0;i<n;i++)
								 {
									 var c=parseInt(svgs[i].path.length*cur/100)
									 var gs=d3.select("#path"+c+"_"+i)
									 gs.attr("opacity",1)
								 }
								 cur=cur+1
								 console.log(d3.select("input")[0][0].value)
								 d3.select("input")[0][0].value=cur
								 if (cur==100)
									 stopAni()
							 },frameT)
		 stopAni=function()
		 {
			 if (ttid<0)return;
			 clearInterval(ttid)
			 ttid=-1
			 d3.selectAll(".ppp").attr("opacity",1)
		 }
//		 setTimeout(stopAni,frameT*100)
	 }

	 exports.cl=clear

	 exports.renderer=function()
	 {
		 var cur=100
		 return {
			 init:function(data)
			 {
				 clear()
				 process(data)
				 render()
			 },
			 select:function(tid)
			 {
				 stopAni()
				 var single=false
				 if (!single)
				 {
					 for(var k=0;k<all;k++)
					 {
						 var st=parseInt(svgs[k].path.length*cur/100)
						 var end=parseInt(svgs[k].path.length*tid/100)
						 if (st<end)
							 for(var i=st+1;i<=end;i++)
								 d3.select("#path"+i+"_"+k).attr("opacity",1)
						 else
							 for(var i=end+1;i<=st;i++)
								 d3.select("#path"+i+"_"+k).attr("opacity",0)
					 }
					 cur=tid
				 }
			 }
		 }
	 }
	 
 }
)(this)


