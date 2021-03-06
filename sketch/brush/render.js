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
	 var W=400,H=400,paddingx=20,paddingy=10
	 var points=[]
	 var remove=true
	 var images
	 var touch=[]
	 var curTime=0
	 var idlist
	 var canvas
	 var ctx
	 var bw=1
	 var tot_=0
	 
	 function expand(x,y)
	 {
		 var p=[]
		 var w=bw
		 for(var i=-w;i<=w;i++)
			 if (x+i>=0&&x+i<W)
				 for(var j=-w;j<=w;j++)
					 if (y+j>=0&&y+j<H)
						 p.push({x:x+i,y:y+j})
		 return p
	 }

	 function addP(x,y)
	 {
		 console.log(x,y)
		 points.push({x:x,y:y})
		 /*var svg=d3.select("svg")
		 svg.append("circle").attr("cx",x).attr("cy",y).attr("r",bw*5).attr("class","brush")
			 .attr("fill","red")*/

		 //ctx.fillStyle="red"

		 ctx.beginPath();
		 n=points.length
		 if (n==1)return
		 ctx.moveTo(points[n-2].x,points[n-2].y);
		 ctx.lineTo(x,y);
		 ctx.lineWidth = 5;
		 ctx.strokeStyle = 'blue';
		 ctx.stroke();
		 //ctx.fillRect(x-bw,y-bw,2*bw+1,2*bw+1)
		 
		 //console.log("!")
		 //ctx.fillRect(50,0,100,100)
		 //ctx.fillRect(200,0,100,50)
		 //ctx.fillRect(50,50,10,10)
	 }
	 
	 function addP_(x,y)
	 {
		 var p=expand(x,y)
		 for(var i=0;i<p.length;i++)
		 {
			 images.forEach(function(f,k){
				 var t=f[p[i].y][p[i].x]
				 if (t>0&&t<=curTime)
					 touch[k]++
			 })
		 }
		 points=points.concat(p)
	 }

	 function brushStart()
	 {
		 var x=d3.event.pageX-paddingx
		 var y=d3.event.pageY-paddingy
		 for(var i=0;i<svgs.length;i++)touch[i]=0
		 ctx.clearRect(0,0,W,H)
		 addP(x,y)
	 }

	 function cross()
	 {
		 var p=[]
		 for(var i=0;i<points.length;i++)
			 p=p.concat(expand(points[i].x,points[i].y))
		 console.log(p.length)
		 idlist.forEach(function(k){
			 f=images[k]
			 for(var i=0;i<p.length;i++)
			 {
				 var cur=parseInt(svgs[k].path.length*curTime/100)+2
				 for(var g=0;g<4;g++)
				 {
					 var t=f[p[i].y*2+(g>1)][p[i].x*2+(g&1)]
					 if (t>0&&t<=cur)
						 touch[k]++
				 }
				 if (remove&&touch[k]>1)
					 break
			 }
		 })
		 if (remove)
		 {
			 //console.log(touch)
			 var id=idlist.filter(function(d){return touch[d]>1})
			 idlist=idlist.filter(function(d){return touch[d]<=1})
			 id.forEach(function(d){
				 for(var i=0;i<steps;i++)
				 {
					 var gs=d3.select("#path"+i+"_"+d)
					 gs.attr("opacity",0)
				 }
			 })
		 }
	///	 setTimeout(function(){
	//		 ctx.clearRect(0,0,W,H)
	//	 },1000000)
		 d3.selectAll(".brush").remove()
	 }
	 

	 function brushEnd()
	 {
		 if (points.length==0)
			 return
		 var x=d3.event.pageX-paddingx
		 var y=d3.event.pageY-paddingy
		 addP(x,y)
		 cross()
		 points=[]
		 tot_=0
	 }

	 function brush()
	 {
		 if (points.length==0)
			 return
		 //tot_++
		 //if (tot_%2!=0)
			 //return
		 var x=d3.event.pageX-paddingx
		 var y=d3.event.pageY-paddingy
		 addP(x,y)
	 }
	 
	 function render()
	 {
		 console.log(svgs.length)
		 var body=d3.select("body")
		 var div=body.append("div").attr("style","position:absolute;left:"+paddingx+"px;top:"+paddingy+"px;height:"+H+"px; width:"+W+"px").attr("class","canvas")
		 canvas=d3.select("body").append("canvas").attr("style","position:absolute;left:"+paddingx+"px;top:"+paddingy+"px").attr("height",H).attr("width",W).on("mousedown",brushStart).on("mouseup",brushEnd).on("mousemove",brush).node()
		 ctx=canvas.getContext("2d")
		 steps=d3.max(svgs.map(function(d){return d.path.length}))
		 div.node().appendChild(svgheader.cloneNode(true))
		 
		 var svg=d3.select("svg")
		 for(var i=0;i<steps;i++)
			 svgs.forEach(function(d,k){
				 if (d.path.length<=i)return;
				 var g=d.header.cloneNode(true)
				 var gg=g.childNodes[1]
				 gg.appendChild(enter)
				 gg.appendChild(d.path[i].cloneNode(true))
				 gg.childNodes[1].setAttribute("id","path"+i+"_"+k)
				 svg.node().appendChild(g)
				 svg.select("#path"+i+"_"+k).attr("opacity",0).attr("stroke",color(i*1.0/d.path.length)).attr("onclick","click(this.id)").attr("class","ppp")
			 })
		 
		 var cur=0
		 var n=svgs.length
		 var frameT=1
		 var ttid=setInterval(function()
							 {
								 cur=cur+1
								 curTime++
								 idlist.forEach(function(i)
							     //for(var i=0;i<n;i++)
								 {
									 var c=parseInt(svgs[i].path.length*cur/100)
									 var gs=d3.select("#path"+c+"_"+i)
									 gs.attr("opacity",0.3)
								 })
								 
								 //idlist=d3.range(svgs.length)
								 if (cur==100)
									 stopAni()
								 //console.log(d3.select("input")[0][0].value)
								 d3.select("input")[0][0].value=cur
							 },frameT)
		 stopAni=function()
		 {
			 if (ttid<0)return;
			 clearInterval(ttid)
			 ttid=-1
			 //d3.selectAll(".ppp").attr("opacity",0.3)
		 }
		 //setTimeout(stopAni,frameT*100)
	 }

	 exports.cl=clear

	 exports.renderer=function()
	 {
		 var cur=100
		 return {
			 init:function(data)
			 {
				 if (stopAni)
					 stopAni()
				 clear()
				 process(data[0])
				 images=data[1]
				 idlist=d3.range(svgs.length)
				 render()
				 exports.data=data
			 },
			 select:function(tid)
			 {
				 stopAni()
				 var single=false
				 if (!single)
				 {
					 idlist.forEach(function(k)
					 //for(var k=0;k<svgs.length;k++)
					 {
						 var st=parseInt(svgs[k].path.length*cur/100)
						 var end=parseInt(svgs[k].path.length*tid/100)
						 if (st<end)
							 for(var i=st+1;i<=end;i++)
								 d3.select("#path"+i+"_"+k).attr("opacity",0.3)
						 else
							 for(var i=end+1;i<=st;i++)
								 d3.select("#path"+i+"_"+k).attr("opacity",0)
					 })
					 cur=tid
					 curTime=tid
				 }
			 }
		 }
	 }
	 
 }
)(this)


