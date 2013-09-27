(function (exports)
 {
	 //const here
	 var colors = [
		 0xff7f0eff, 0xffbb78ff,
		 0x1f77b4ff, 0xaec7e8ff,
		 0x2ca02cff, 0x98df8aff,
		 0xd62728ff, 0xff9896ff,
		 0x9467bdff, 0xc5b0d5ff,
		 0x8c564bff, 0xc49c94ff,
		 0xe377c2ff, 0xf7b6d2ff,
		 0x7f7f7fff, 0xc7c7c7ff,
		 0xbcbd22ff, 0xdbdb8dff,
		 0x17becfff, 0x9edae5ff
	 ];

	 function rand()
	 {
		 return Math.floor(Math.random()*1000007);
	 }

	 function generateGraph()
	 {
		 var graph = Viva.Graph.graph();
		 for(var i=2;i<100;i++)
		 {
			 graph.addLink(Math.floor(i/2),i)
			 if (i%2==1)
				 graph.addLink(i,i-1)
		 }
		 return graph
		 for(var i=1;i<2000;i++)
		 {
			 graph.addLink(i,rand()%i);
		 }
		 return graph
		 for(var i=0;i<500;i++)
			 if (rand()%100<1)
				 graph.addLink(rand()%1000,rand()%1000)
		 else
			 if (rand()%100<50)
				 graph.addLink(rand()%200,rand()%200)
		 else
			 graph.addLink(800+rand()%200,800+rand()%200)
	 }

	 //A hashTable that change whatever input to a index number (starting from 0)
	 function hashTable()
	 {
		 var hash=[]
		 var tot=0
		 var func=function(x)
		 {
			 if (!hash[x])
				 hash[x]=++tot
		//	 console.log(x,hash[x])
			 return hash[x]-1
		 }
		 func.data=hash
		 return func
	 }

	 exports.graphViz=function(data)
	 {
		 //Useful data structures
		 var attr,id,pg
		 
		 function buildGraph(data)
		 {
			 attr=[],id=[],pg=[]
			 for(var i=0;i<data.attr.length;i+=2)
			 {
				 id[i]=parseInt(data.attr[i])
				 attr[parseInt(data.attr[i])]=parseInt(data.attr[i+1].substr(0,4))
				 pg[parseInt(data.pg[i])]=parseFloat(data.pg[i+1])
			 }
			 id.sort(function(a,b){return pg[b]-pg[a]})
			 edges=data.edges
			 var graph = Viva.Graph.graph();
			 var predicate=function(d)
			 {
				 if (d<3000)return false
				 if (pg[d]<pg[id[1000]])return false
//				 return attr[d]=="1998"
				 return true
				 //return attr[parseInt(d)]>=0&&attr[parseInt(d)]<3
			 }
			 tot=0
			 for(var i=0;i<edges.length;i+=2)
			 {
				 var x=parseInt(edges[i]),y=parseInt(edges[i+1])
				 if (predicate(x)&&predicate(y))
				 {
					 graph.addLink(x,y)
					 tot++
				 }
			 }
			 return graph;
		 }
		 
		 var graph = buildGraph(data)
		 var settings={
		 	 springLength : 100,
			 springCoeff : 0.0003,
			 dragCoeff : 0.01,
			 gravity : -1.2
		 }
		 var layout = Viva.Graph.Layout.forceDirected(graph,settings)
		 var communities = Viva.Graph.community().slpa(graph, 100, 0.30)
		 var graphics = Viva.Graph.View.webglGraphics();
		 var hashc=hashTable()
		 var hashnode=hashTable()
		 graph.forEachNode(function(node){node.isPinned=false})
		 graphics.node(function(node){
			 var id=node.id
			 var comm=colors.length-1
			 if (node.communities.length>0)
				 comm=hashc(node.communities[0].name)
			 //return Viva.Graph.View.webglSquare(3+Math.floor(Math.sqrt(node.links.length)*2), colors[comm]);
			 if (pg[id])
				 return Viva.Graph.View.webglSquare(3+Math.floor(Math.sqrt(pg[id]*pg[id])*3), colors[hashnode(attr[id])]);
			 else
				 return Viva.Graph.View.webglSquare(3+Math.floor(Math.sqrt(node.links.length)*2), colors[hashnode(attr[id])]);
			 //return Viva.Graph.View.webglSquare(1 + Math.random() * 10, colors[(Math.random() * colors.length) << 0]);
		 }).link(function(link) {
			 return Viva.Graph.View.webglLine(0x1f77b4c0)
			 return Viva.Graph.View.webglLine(colors[(0) << 0]);
			 //return Viva.Graph.View.webglLine(colors[(Math.random() * colors.length) << 0]);
		 });
		 
		 var renderer = Viva.Graph.View.renderer(graph,
												 {
													 layout     : layout,
													 graphics   : graphics,
													 container  : document.getElementById('graph1'),
													 renderLinks : true
												 });
		 
		 return {
			 run:function(t)
			 {
				 if (!t)t=10000
				 renderer.run(t);
			 },
			 
			 layout: function(para)
			 {
				 if (para.springLength)
					 layout.springLength(para.springLength)
				 if (para.springCoeff)
					 layout.springCoeff(para.springCoeff)
				 if (para.dragCoeff)
					 layout.drag(para.dragCoeff)
				 if (para.gravity)
					 layout.gravity(para.gravity)
				 renderer.rerender()
				 return {
					 springLength:layout.springLength(),
					 springCoeff:layout.springCoeff(),
					 dragCoeff:layout.drag(),
					 gravity:layout.gravity()
				 }
			 },

			 category:function()
			 {
				 return {
					 colors:colors,
					 items:hashnode
				 }
			 }
		 }
	 }
 })(this)


