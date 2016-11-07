// -------------------  Three-way Quick Sort JS -----------------//
//
// Description:
//  Quick sort with ouble pivot.
//
// History :
//   2011/04/18 ver.1 : Initial release.
//
// written by kogecoo. ( kogecoo'AT'gmail_com )
// -------------------  3-way QSort JS -----------------//

new function(){
	var _genrand = function( from, to ){
		return Math.floor( Math.random() * ( to - from + 1 ) ) + from;
	};
	var _genrandWOArg = function( from, to, x ){
		var n;
		do{
			n = _genrand( from, to );
		}while( x == n );
		return n;
	}
		
	var _swap = function( arr, x, y ){ var temp = arr[x]; arr[x] = arr[y]; arr[y] = temp; };
	var _part = function( arr, from, to ){
		var retpiv = [ from, to ];
		var lpivot = _genrand( from, to );
		var rpivot = _genrandWOArg( from, to, lpivot );
		if( lpivot > rpivot ){ var temp = lpivot; lpivot = rpivot; rpivot = lpivot; }
		if( arr[ lpivot ] > arr[ rpivot ] ){ _swap( arr, lpivot, rpivot ); }
		
		_swap( arr, from, lpivot );
		_swap( arr, rpivot, to );
		
		for( var i = from + 1; i <= to; ++i ){
			if( arr[i] < arr[from] ){ _swap( arr, ++retpiv[0], i ); }
		}
		_swap( arr, from, retpiv[0] );
		
		for( var j = to; j >= retpiv[0] + 1; --j ){
			if( arr[ j ] > arr[ to ] ){ _swap( arr, --retpiv[1], j ); }
		}
		_swap( arr, to, retpiv[1] );
		
		return retpiv;
	};
	var _threeWayQSort = function( arr, from, to ){
		if( from >= to ){ return; }
		var pivots = _part( arr, from, to );
		_threeWayQSort( arr, from, pivots[0] - 1 );
		_threeWayQSort( arr, pivots[0] + 1 , pivots[1] - 1 );
		_threeWayQSort( arr, pivots[1] + 1 , to );
	};
	
	threeWayQSort = function( arr ){
		_threeWayQSort( arr, 0, arr.length - 1 );	
	};


}