(function(exports)
 {

	 function loadData(files,callback)
	 {
		 var data=[];
		 
		 (function load()
		  {
			  if (data.length<files.length)
				  d3.xml(files[data.length],"image/svg+xml",function(d)
						 {
							 data.push(d)
							 load()
						 })
			  else
				  callback(data)
		  })()
	 }

	 function loadData2(files,dd,callback)
	 {
		 var data=[];
		 
		 (function load()
		  {
			  if (data.length<files.length)
				  d3.text(files[data.length],function(d)
						 {
							 //console.log(d)
							 data.push(d.split("\n").filter(function(d){return d.length>1})
							 		   .map(function(d){return d.split(" ").map(function(dd){return parseInt(dd)})}))
							 /*var f=d3.range(400).map(function(){return d3.range(400).map(function(d){return 0})})
							 d.split("\n").filter(function(d){return d.length>1}).forEach(function(line){
								 var dd=line.split(" ").map(function(d){return parseInt(d)})
								 //console.log(dd)
								 f[dd[0]][dd[1]]=dd[2]
							 })
							 data.push(f)*/
							 load()
						 })
			  else
				  callback([dd,data])
		  })()
	 }

	 var viz;

	 function update(prefix,start)
	 {
		 console.log(prefix)
		 if (!start)start=0
		 var all=80
		 files=d3.range(start,start+all).map(function(d){return "../svg/"+prefix+"/"+prefix+"_"+d+".svg"})
		 loadData(files,function(d){
			 var f=d3.range(1,1+all).map(function(d){return "../data/"+prefix+"/"+prefix+"_"+d+".txt"})
			 loadData2(f,d,viz.init)
		 })
	 }
	 
	 exports.main=function()
	 {
		 viz=renderer()
		 update("bicycle")
		 //update("apple")
		 controller(viz,{update:update})
	 }
 }
)(this)

main()


