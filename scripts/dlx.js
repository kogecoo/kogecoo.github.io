// -------------------  Exact Cover Solver. ( with Sudoku solver. ) -------------//
// Description :
//   Solve the exact cover problem by brute-force with the algorithm named "Dancing Links".
//  Because recent JavaScript interpreter ( or compiler ) in browser improves its effeciency, 
//  I try to write down relatively heavy process like this.
//  Yes, it's purely out of curiosity.
// 
// Reference : 
//   Dancing Links : http://arxiv.org/abs/cs/0011047
//   Exact cover : http://en.wikipedia.org/wiki/Exact_cover
//
// History :
//   ver.1 : Initial release. 2011/04/09
//
// written by kogecoo.
// -------------------  Exact Cover Solver. (Sudoku restriction table generator ) -------------//

new function(){
	
	// FUTURE WORK : We should test the connections of doubly linked list.
	function DLXNode(){
		this.id = null;
		this.x = null;
		this.y = null;	
		this.up = null;
		this.down = null;
		this.left = null;
		this.right = null;
		this.column = null;
		
		this.cover = function(){
			this.right.left = this.left;
			this.left.right = this.right;
			for( var i = this.down; i != this; i = i.down ){
				for( var j = i.right; j != i; j = j.right ){
					j.down.up = j.up;
					j.up.down = j.down;
				}
			}
		};
		this.uncover = function(){
			for( var i = this.up; i != this; i = i.up ){
				for( var j = i.left; j != i; j = j.left ){
					j.down.up = j;
					j.up.down = j;
				}
			}
			this.right.left = this;
			this.left.right = this;
		};
	}
	
	function SudokuInfo( x, y, n ){
		this.x = x;
		this.y = y;
		this.n = n;
	}

	function createTable( width, height ){
		var table = Array( height );
		for( var i = 0; i < height; ++i ){
			table[i] = new Array( width ); 
			for( var j = 0; j < width; ++j ){
				table[i][j] = 0;
			}
		}
		return table;
	}

	function createArrayWithNull( len ){
		var a = new Array( len );
		for( var i = 0; i < len; ++i ){ a[i] = null; }
		return a;
	}
	

	function getGridHeight( root ){
		var height = 0;
		for( var i = root.right; i != root; i = i.right ){
			if( i.up.y >= height ){ height = i.up.y; }
		}
		return height;
	}

	// for test
	function reverseGrid2Matrix( root ){
		var width = root.left.x;
		var height = getGridHeight( root );
		var table = createTable( width, height );

		for( var i = root.right; i != root; i = i.right ){ 
			for( var j = i.down; j != i; j = j.down ){
				table[ j.y - 1 ][ j.x - 1 ] = 1;
			}
		 }
		return table;
	}
	
	DancingLinks = {
		rownodes : null,
		//solution : null,
		createLinkedGrid : function( table ){	// arg "table" is the restriction matrix. Each cell must take a binary value.
			var ncol = table[0].length;
			var nrow = table.length;
			var root = new DLXNode();
			root.id = "root";
			rownodes = createArrayWithNull( nrow );
			var lnodes = createArrayWithNull( nrow );
			var colnodes = createArrayWithNull( ncol );
			var lcolnode = root;
			for( var i = 0; i < ncol; ++i ){ 
				// create a column header node
				colnodes[i] = new DLXNode();
				colnodes[i].x = i + 1;
				colnodes[i].y = 0;
				colnodes[i].left = lcolnode;
				lcolnode.right = colnodes[i];
				lcolnode = colnodes[i];
				
				var unode = colnodes[i];
				for( var j = 0; j < nrow; ++j ){
					if( table[j][i] === 1 ){
						node = new DLXNode();
						node.x = i + 1;
						node.y = j + 1;
						node.up = unode;
						node.column = colnodes[i];
						unode.down = node;
						unode = node;
						if( lnodes[j] === null ){
							lnodes[j] = node;
							rownodes[j] = node;
						} else {
							node.left = lnodes[j];
							lnodes[j].right = node;
							lnodes[j] = node;
						}
					}
				}
				unode.down = colnodes[i];
				colnodes[i].up = unode;
			}
			for( var i = 0; i < nrow; ++i ){
				if( lnodes[i] !== null ){
					lnodes[i].right = rownodes[i];
					rownodes[i].left = lnodes[i];
				} else {
					throw "Error in " + arguments.callee.name + " : row #" + i + "has no node";
				}
			}
			colnodes[ncol-1].right = root;
			root.left = colnodes[ncol-1];
			return root;
		},

		// for test
		createSimpleConstraintTable : function(){
			var matrix = Array(6);
			matrix[0] = new Array( 0, 0, 1, 0, 1, 1, 0 );
			matrix[1] = new Array( 1, 0, 0, 1, 0, 0, 1 );
			matrix[2] = new Array( 0, 1, 1, 0, 0, 1, 0 );
			matrix[3] = new Array( 1, 0, 0, 1, 0, 0, 0 );	
			matrix[4] = new Array( 0, 1, 0, 0, 0, 0, 1 );
			matrix[5] = new Array( 0, 0, 0, 1, 1, 0, 1 );
			return matrix;
		},
		
		
		createSudokuConstraintTable : function(){
			var nmax = colmax = rowmax = 9;
			var offset = 81;
			var table = createTable( rowmax * colmax * 4, rowmax * colmax * nmax );
			
			// fill table( matrix ) with flag.
			for( var r = 0; r < rowmax; ++r ){
				for( var c = 0; c < colmax; ++c ){
					for( var n = 0; n < nmax; ++n ){
						var y = n + ( c * colmax ) + ( r * rowmax * rowmax );
						table[ y ][ c + 9 * r ] = 1;	// position constraint
						table[ y ][ offset + n + 9 * c ] = 1;	// row constraint
						table[ y ][ offset * 2 + n + 9 * r ] = 1;	// column constraint
						table[ y ][ offset * 3 + ( Math.floor( r / 3 ) * 3 + Math.floor( c / 3 ) ) * 9  + n ] = 1;
					}
				}
			}
			return table;
		},
		
		// Convert partial filled Sudoku 2-dimension array to an array of Sudoku constraint table's row number.
		sudokuTable2ConstraintRows : function( sudoku_table ){
			var a = new Array();
			var colmax = rowmax = 9;
			for( var i = 0; i < sudoku_table.length; ++i ){
				for( var j = 0; j < sudoku_table[i].length; ++j ){
					if( sudoku_table[i][j] != 0 ){
						var y = sudoku_table[i][j] - 1 + ( j * colmax ) + ( i * rowmax * rowmax );
						a.push( y );
					}
				}
			}
			return a;
		},
		
		nodeArray2SudokuMatrix: function( array ){
			var mat = createTable( 9, 9 );
			for( var i = 0; i < array.length; ++i ){
				var c = array[i].y - 1;
				var y = Math.floor( c / 81 );
				var x = Math.floor( ( c % 81 ) / 9 );
				var n = c % 9;
				mat[y][x] = n+1;
			}
			return mat;
		},
		
		// Prunning links by given number placement.
		pruneSudokuSolutionSpace : function( sudoku_placement ){	
			var sol = new Array();
			var constraints = this.sudokuTable2ConstraintRows( sudoku_placement );
			for( var i = 0; i < constraints.length; ++i ){
				var leftmost = rownodes[ constraints[i] ];
				sol[i] = leftmost;
				var j = leftmost;
				do{
					j.column.cover();
					j = j.right;
				} while( j != leftmost );
			}
			return sol;
		},
		// NOTICE :
		//  Even if there are multiple solution, solve() returns only single solution which is found first.
		solve : function( root, solution ){
			//var solutions = Array(); // future work
			//solution = Array();
			var solved = false;
			var _solve = function( h, k ){
					if( h.right === h ){
						solved = true;
						return solved;
					} else {
						var node = h.right;
						node.cover();
						
						for( var i = node.down; i != node; i = i.down ){
							solution[k] = i;
							for( var j = i.right; j != i; j = j.right ){
								j.column.cover();
							}

							if( _solve( h, k + 1 ) ){ return true; }
							i = solution[k];
							node = i.column;
							for( var j = i.left; j != i; j = j.left ){
								j.column.uncover();
							}
						}
						node.uncover();
						solution = solution.slice( 0, k );
					}
				};
			_solve( root, solution.length );
			return this.nodeArray2SudokuMatrix( solution );
		},
	};
	
	DancingLinksTest = function(){
		with( DancingLinks ){
			this.doAll = function(){ 
				for( var method in this ){ 
					if(method != "doAll"){ 
						if( this[method]() == false ){ return "Test FAILED at " + method; }
					}
				}
				return "Test passed";
			};
			this.createLinkedGrid = function(){
				var t = createSimpleConstraintTable();
				var root = createLinkedGrid( t );
				var reverse = reverseGrid2Matrix( root );
				for( var i = 0; i < t.length; ++i ){
					for( var j = 0; j < t[0].length; ++j ){
						if( t[i][j] !== reverse[i][j] ){ return false; }
					}
				}
				return true;
			};
			this.createSudokuConstraintTable = function(){
				var t = createSudokuConstraintTable();
				var col_counter = new Array( t[0].length );
				for( var i = 0; i < col_counter.length; ++i ){ col_counter[i] = 0; }
				
				for( var i = 0; i < t.length; ++i ){
					var row_counter = 0;
					for( var j = 0; j < t[i].length; ++j ){
						row_counter += t[i][j];
						col_counter[j] += t[i][j];
					}
					if( row_counter != 4 ){ return false; }
				}
				
				for( var i = 0; i < col_counter.length; ++i ){
					if( col_counter[i] != 9 ){ return false; }
				}
			};
			this.checkLinks = function(){
				var t = createSimpleConstraintTable();
				var root = createLinkedGrid( t );
				var width = root.left.x;
				var height = getGridHeight( root );
				var table = createTable( width, height );
				if( root.right === null || root.right === undefined ){ return false; }
				for( var i = root.right; i != root; i = i.right )
					var ncol = i.x;{
					if( i.down === null || i.down === undefined ){ return false; }
					for( var j = i.down; j != i; j = j.down ){
						var prev = -1;
						if( j.up === null || j.up === undefined 
							|| j.down === null || j.down === undefined
							|| j.left === null || j.left === undefined
							|| j.right === null || j.right === undefined
							|| j.x !== ncol || j.y <= prev ){
							return false;
						}
						prev = j.y;
					}
				}
				return true;
			};
		}
	};
}