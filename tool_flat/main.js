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

	 var viz;

	 function update(prefix,start)
	 {
		 console.log(prefix)
		 if (!start)start=0
		 files=d3.range(start,start+80).map(function(d){return "../svg/"+prefix+"/"+prefix+"_"+d+".svg"})
		 loadData(files,viz.init)
	 }
	 
	 exports.main=function()
	 {
		 viz=renderer()
		 update("bicycle")
		 controller(viz,{update:update})
	 }
 }
)(this)

main()


