function PageTrackingObj(exp, titleName, cm, frame){
   this.VarTrivPageTracking = new Variable( 'VarTrivPageTracking', null, 0, cm, frame, exp, titleName, true );
   this.numPages = 0;
   this.publishTimeStamp = 0;
   this.title = null;
}

PageTrackingObj.prototype.InitPageTracking = function ( )
{
	var THIS = this;
	var pageTrackData = this.VarTrivPageTracking.getValue();
	var bDoInit = true;
	try {
	    if (pageTrackData && pageTrackData.length > 0 && pageTrackData != '~~~null~~~')
	    {
	        var topLevelSplit = pageTrackData.split('#');
	        if (topLevelSplit && topLevelSplit.length > 1)
            {
		        var arrIds = topLevelSplit[0].split(',');
		        var arrStatus = topLevelSplit[1].split('');
		        var bits = 4;
		        for( var i=0; i<arrIds.length; i++ )
		        {
			        var id = parseInt( '0x' + arrIds[i] );
			        var mask = 1<<(i%bits);
			        var status = ( parseInt('0x'+arrStatus[Math.floor(i/bits)] ) & mask ) == 0 ? 1 : 2;
			        var node = this.FindNode( this.title, id );
			        if( node )
				        node.v = status;
		        }
    		}
        }
    } catch (e) { }
}

PageTrackingObj.prototype.FindNode = function( node, id )
{
	if( node.id == id )
		return node;
	
	var match = null;
	if( typeof( node.c ) != 'undefined' ){
		for( var i=0; i<node.c.length; i++ ){
			match = this.FindNode( node.c[i], id );
			if( match != null )
				break;
		}
	}
	
	return match;
}

PageTrackingObj.prototype.InternalGetRangeStatus = function( node )
{
	if( node == null )
		return -1;
		
	if( typeof(node.c) == 'undefined' )
	{
		return node.v;
	}
	else
	{
		// we need to calculate
		if( node.v == 0 )
		{
			var bAllComplete = true;
			var bInprogress = false;
			for( var i=0; i<node.c.length; i++ )
			{
				var cnode = node.c[i];
				var status = this.InternalGetRangeStatus( cnode );
				if( status == 1 || status == 2 )
					bInprogress = true;
				if( status == 0 || status == 1)
					bAllComplete = false;
			}
			
			if( !node.t && bAllComplete )
				return 2;
			else if( bInprogress )
				return 1;
			else
				return 0;
		}
		else
			return node.v
			
	}
}

//returns a incomplete or inprogress or complete
PageTrackingObj.prototype.GetRangeStatus = function( id, bInit )
{
	var status = -1;
	if ( bInit ) 
		this.InitPageTracking();
	
	status = this.InternalGetRangeStatus( this.FindNode( this.title, id ) );
		
	if( status == 0)
		return 'notstarted';	
	else if( status == 1 )
		return 'inprogress';
		
	return 'complete';
}


PageTrackingObj.prototype.InternalSetRangeStatus=function( node, status )
{
	if( node == null )
		return;
	node.v = status;
	if( status == 0 && typeof(node.c)!='undefined')
	{
		for( var i=0; i<node.c.length; i++ )
			this.InternalSetRangeStatus( node.c[i], status ); 
	}
}

PageTrackingObj.prototype.SetRangeStatus = function( id, status /*0 or 1 or 2*/)
{
	this.InternalSetRangeStatus( this.FindNode(this.title, id), status );
	
	this.SavePageTracking();
}

PageTrackingObj.prototype.IterateTree = function( func )
{
	var stack = [];
	stack.push( this.title );
	var i = 0;
	while( stack.length > 0 )
	{
		var node = stack.shift();
		
		if( typeof(node.c) != 'undefined' )
			stack = node.c.concat(stack);
			
		//do the thing
		func( node, i, stack );
		i++;
	}	
}

PageTrackingObj.prototype.SavePageTracking = function()
{
	var hexVal = 0;
	var hexString = '';
	
	var arrayIds = [];
	var arrayStatus= [];
	
	this.IterateTree( function(node, i, stack){
		if( node.v != 0 )
		{
			arrayIds.push(node.id);
			arrayStatus.push(node.v);
		}
	});
	
	for( var i=0; i<arrayIds.length; i++ )
	{
		if( i!=0 ) hexString += ',';
		hexString += arrayIds[i].toString(16);
	}
	
	hexString += '#';
	
	var bits = 4;
	var num = 0;
	for( var i=0; i<arrayStatus.length; i++ )
	{
		var bit = arrayStatus[i] == 2 ? 1 : 0
		num |= bit << (i%bits);
		if( ((i+1)%bits==0) || ((i+1)==arrayStatus.length) )
		{
			hexString += num.toString(16);
			num = 0;
		}
	}
	
	this.VarTrivPageTracking.set(hexString);
}

PageTrackingObj.prototype.GetNumCompPages = function(childArray, countCompleted)
{
	//Pass in title.c to get all completed pages
	for(var idx = 0; idx < childArray.length; idx++ )
	{
		if(childArray[idx].c)
			countCompleted = this.GetNumCompPages(childArray[idx].c, countCompleted);
		else if( typeof(childArray[idx].c) == 'undefined')
		{
			var strStatus ='';
			strStatus = this.GetRangeStatus(childArray[idx].id);
			if (strStatus === 'complete')
				countCompleted++;
		}
	}
	return countCompleted;
}

var trivPageTracking = new PageTrackingObj(365,'assessing_and_protecting_official_information_', 0, 'scorm');
trivPageTracking.numPages = 96;

trivPageTracking.publishTimeStamp = 2021216132439;

trivPageTracking.title={id:1,v:0,c:[{id:38,v:0,c:[{id:376436,v:0,c:[{id:199474,v:0},{id:376437,v:0},{id:376465,v:0},{id:376479,v:0},{id:384180,v:0},{id:380334,v:0},{id:376483,v:0},{id:377258,v:0},{id:376554,v:0},{id:377539,v:0},{id:377644,v:0},{id:377646,v:0},{id:377671,v:0},{id:377710,v:0}]},{id:374876,v:0,c:[{id:377958,v:0},{id:378126,v:0},{id:384498,v:0},{id:378310,v:0},{id:378606,v:0},{id:378545,v:0},{id:378546,v:0},{id:378550,v:0},{id:378554,v:0},{id:384763,v:0},{id:378558,v:0}]},{id:374878,v:0,c:[{id:374879,v:0},{id:375805,v:0},{id:376018,v:0},{id:376187,v:0},{id:375979,v:0},{id:375958,v:0},{id:375893,v:0},{id:376250,v:0},{id:380957,v:0},{id:384813,v:0},{id:380969,v:0},{id:381002,v:0},{id:375909,v:0},{id:385522,v:0},{id:376224,v:0},{id:375852,v:0},{id:375719,v:0}]},{id:374880,v:0,c:[{id:374882,v:0}]},{id:421245,v:0,t:1,c:[{id:426632,v:0,c:[{id:421267,v:0},{id:422499,v:0},{id:422508,v:0},{id:422509,v:0},{id:422510,v:0},{id:422511,v:0},{id:422512,v:0},{id:422513,v:0},{id:422514,v:0},{id:422515,v:0},{id:422516,v:0},{id:422517,v:0},{id:422518,v:0},{id:422519,v:0},{id:422520,v:0},{id:422521,v:0},{id:422522,v:0},{id:422523,v:0},{id:422524,v:0},{id:422525,v:0},{id:422526,v:0},{id:422527,v:0},{id:422528,v:0},{id:422529,v:0},{id:421268,v:0}]},{id:425022,v:0}]},{id:375680,v:0,c:[{id:375645,v:0},{id:374909,v:0}]},{id:375683,v:0,c:[{id:418502,v:0},{id:418493,v:0},{id:385095,v:0},{id:375790,v:0},{id:376296,v:0},{id:376306,v:0},{id:380856,v:0},{id:376010,v:0},{id:376494,v:0},{id:376822,v:0},{id:376832,v:0},{id:377560,v:0},{id:377600,v:0},{id:377610,v:0},{id:377620,v:0},{id:377680,v:0},{id:377690,v:0},{id:377700,v:0},{id:378245,v:0},{id:378261,v:0},{id:378331,v:0},{id:378656,v:0},{id:379134,v:0},{id:379237,v:0},{id:379517,v:0},{id:380454,v:0},{id:380507,v:0},{id:380521,v:0},{id:380498,v:0},{id:380567,v:0},{id:381012,v:0},{id:381023,v:0},{id:381033,v:0},{id:381109,v:0},{id:381477,v:0},{id:387342,v:0}]},{id:385089,v:0,c:[{id:385804,v:0},{id:376531,v:0},{id:378096,v:0},{id:384451,v:0}]}]}]};
