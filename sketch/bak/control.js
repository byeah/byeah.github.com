(function(exports)
{
	var viz,model

	function build()
	{
		var div=d3.select("body").append("div").attr("style","position:absolute;left:5%;top:70%;height:15%; width: 65%")
		div.append("tspan").html("Select Time Frame").attr("style","left:2%;position:absolute;top:0%")
		div.append("input").attr("style","width:30%;left:16%;position:absolute;top:0%")
			.attr("type","range").attr("onchange","adjust(this.value)")
		var div2=d3.select("body").append("div").attr("style","position:absolute;left:70%;top:10%;height:80%; width: 25%")
		var sel=div2.append("form").append("select").attr("onchange","select(this.value)")
		d3.text("category.txt",function(d)
				{
					sel.selectAll("option").data(d.split("\n")).enter().append("option").attr("value",function(d){return d}).html(function(d){return d})
					//sel.selectAll("option").data(["tomato","potted plant","bicycle","giraffe"]).enter().append("option").attr("value",function(d){return d}).html(function(d){return d})
				})
	}
	
	exports.controller=function(v,m)
	{
		viz=v
		model=m
		build()
	}

	var curmodel=100

	exports.adjust=function(d)
	{
		curmodel=d
		viz.select(d,selected)
	}

	exports.select=function(d)
	{
		selected=[]
		model.update(d)
	}

	var selected=[]

	 exports.click=function(d)
	 {
		 //console.log(d)
//		 if (selected.length==0)
//			 d3.selectAll("path").attr("opacity",0.05)
		 selected.push(d)
//		 if (selected.length==1)
			 viz.select(curmodel,selected)
/*		 else
		 {
			 d3.select("#"+d).attr("opacity",0.8)
		 }*/
			 
	 }

})(this)
