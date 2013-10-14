(function(exports)
 {
	 var viz=null,div=null
	 var data
	 
	 function buildRange(name)
	 {
		 div=d3.select(name)
		 div.append("tspan").html("SpringLength").attr("style","left:5%;position:absolute;top:5%")
		 div.append("input").attr("style","width:55%;left:40%;position:absolute;top:5%")
			 .attr("type","range").attr("onchange","adjust('springLength',this.value)").attr("value",15)
		 
		 div.append("tspan").html("SpringCoeff").attr("style","left:5%;position:absolute;top:10%")
		 div.append("input").attr("style","width:55%;left:40%;position:absolute;top:10%")
			 .attr("type","range").attr("onchange","adjust('springCoeff',this.value)")
		 
		 div.append("tspan").html("DragCoeff").attr("style","left:5%;position:absolute;top:15%")
		 div.append("input").attr("style","width:55%;left:40%;position:absolute;top:15%")
			 .attr("type","range").attr("onchange","('dragCoeff',this.value)")
		 
		 div.append("tspan").html("Gravity").attr("style","left:5%;position:absolute;top:20%")
		 div.append("input").attr("style","width:55%;left:40%;position:absolute;top:20%")
			 .attr("type","range").attr("onchange","adjust('gravity',this.value)")
	 }

	 function getColor(d,op)
	 {
		 var r=(d&0xff000000)>>>24,g=(d&0x00ff0000)>>16,b=(d&0x0000ff00)>>8,a=d&0x000000ff
		 return "rgb("+r+","+g+","+b+")"//","+a+")"
	 }
	 
	 function showCategory(cate)
	 {
		 data=[]
		 for(var it in cate.items.data)
			 if (it!="undefined"&&it!=undefined)
				 data.push({name:it,selected:false})
		 
		 var svg=div.append("svg").attr("width","100%").attr("height","75%").attr("style","position:absolute;top:25%")
		 svg.selectAll("circle").data(data).enter().append("circle")
			 .attr("r",10).attr("cx","15%").attr("cy",function(d,i){return 20+30*i}).attr("fill",function(d){return getColor(cate.colors[cate.items(d.name)],false)}).attr("stroke-width",4).attr("stroke","white")
			 .on("click",function(d,i){
				 data[i].selected=!data[i].selected;
				 var list=data.filter(function(d){return d.selected})
				 if (list.length==0)
					 list=data
				 viz.filterNode(list.map(function(d){return d.name}))
				 svg.selectAll("circle").data(data).attr("fill",function(d){return getColor(cate.colors[cate.items(d.name)],d.selected)}).attr("stroke",function(d){if (d.selected)return "grey" ;else return "white"})
			 })
		 svg.selectAll("text").data(data).enter().append("text")
			 .text(function(d){return d.name}).attr("x","25%").attr("y",function(d,i){return 25+30*i})
	 }
	
	 exports.controller=function(name,v)
	 {
		 viz=v
		 buildRange(name)
		 showCategory(viz.category())
	 }

	 var scale=[]
	 scale['springLength']=d3.scale.linear().domain([0,100]).range([0,200])
	 scale['springCoeff']=d3.scale.linear().domain([0,100]).range([0,0.002])
	 scale['dragCoeff']=d3.scale.linear().domain([0,100]).range([0,0.02])
	 scale['gravity']=d3.scale.linear().domain([0,100]).range([-2,2])
	 
	 exports.adjust=function(type,data)
	 {
		 if (!viz)return
		 para={}
		 para[type]=scale[type](data)
		 viz.layout(para)
	 }
 })(this)
 
