// -------------------  Sudoku Solver UI -------------//
// Description :
//   A Sudoku solver UI generator. 
//
// This script needs
//  jQuery ( tested v1.5.2 )
//  Exact Cover Solver ( dlx.js written by kogecoo )
//
// History :
//   ver.1 : Initial release. 2011/04/09
//
// written by kogecoo.
// -------------------  Sudoku Solver UI -------------//

new function(){
	var table_contents = new Array();
	var current_table = createTable( 9, 9 );
	function createTable( width, height ){
		var table = Array( height );
		for( var i = 0; i < height; ++i ){
			table[i] = new Array( width ); 
			for( var j = 0; j < width; ++j ){
				table[i][j] = 0;
			}
		}
		return table;
	};
	function writeLine( line ){ $( "#result" ).append( line + "<br>" ); }		// for test
	function writeMatrix( mat ){ for( var i = 0; i < mat.length; ++i ){ writeLine( mat[i] ); } }	// for test
	
	var css_alertbg = "pink";
	var css_table = { "border-collapse" : "collapse", "border" : "solid 4px black" };
	var css_td_default = { "border" : "dotted 2px gray", "width" : "2em", "height" : "2em", "text-align" : "center" };
	var css_td_gridtop = { "border-top" : "solid 4px black" };
	var css_td_gridbottom = { "border-bottom" : "solid 4px black" };
	var css_td_gridleft = { "border-left" : "solid 4px black" };
	var css_td_gridright = { "border-right" : "solid 4px black" };
	var css_cellinputhide = { "width" : "100%", "height" : "100%", "display" : "none" };
	var css_cellinputshow = { "width" : "100%", "height" : "100%", "display" : "inline" };
	var css_celltexthide = { "width" : "100%", "height" : "100%", "display" : "none", "font-size" : "1em" };
	var css_celltextshow = { "width" : "100%", "height" : "100%", "display" : "block", "font-size" : "1em" };
	SudokuUI = {
		default_msg : "Click the cell, input a number, and push the solve button",
		default_msgbg : "yellowgreen",
		showMsg : function( msg, bg ){
			if( bg == undefined || bg == null ){ bg = "black"; }
			$("#msg").css( {"background-color" : bg } );
			$("#msg").text( msg );
		},
		textClickHandler : function( e ){
			var elm = $( e.target ).css( css_celltexthide );
			var x = elm.attr( "x" );
			var y = elm.attr( "y" );
			$( "[_type=_input][x=" + x + "][y=" + y + "]" ).css( css_cellinputshow ).focus();
		},
		inputChangeHandler : function( e ){
			var elm = $( e.target );
			SudokuUI.showMsg( SudokuUI.default_msg, SudokuUI.default_msgbg );
		},
		inputBlurHandler : function( e ){
			var elm = $( e.target );
			var x = elm.attr( "x" );
			var y = elm.attr( "y" );
			var t = elm.attr( "value" );
			if( t === undefined || t === null || t === "" ){ 
				$( "[_type=_text][x=" + x + "][y=" + y + "]" ).css( css_celltextshow ).text( t );
				elm.css( { "display" : "none" } );
				return;
			}
			var n = parseInt( t );
			if( SudokuUI.check( x, y, t ) ){ 
				$( "[_type=_text][x=" + x + "][y=" + y + "]" ).css( css_celltextshow ).text( t );
				elm.css( { "display" : "none" } );
				SudokuUI.updateTable( x, y, t );
				return; 
			} else {
				var n = $( "[_type=_text][x=" + x + "][y=" + y + "]" ).css( css_celltextshow ).text();
				elm.attr( "value", n );
				elm.css( { "display" : "none" } );
				//elm.focus();
				return;
			}
		},
		createTDJQObj : function( i, j ){
			var td = $("<td>").attr( "id", j + "-" + i ).attr( "x", j ).attr("y", i );
			td.css( css_td_default );
			if( i % 3 == 0 ){ td.css( css_td_gridtop ); }
			if( i % 3 == 2 ){ td.css( css_td_gridbottom ); }
			if( j % 3 == 0 ){ td.css( css_td_gridleft ); }
			if( j % 3 == 2 ){ td.css( css_td_gridright ); }
			return td;								
		},
		createInputJQObj : function( i, j ){
			var input = $("<input>").attr("type", "text" ).attr( "x", j ).attr( "y", i ).attr( "_type", "_input" )
			input.css( css_cellinputhide ).blur( this.inputBlurHandler ).change( this.inputChangeHandler );
			return input;
		},
		createTextJQObj : function( i, j ){
			var text = $("<span>").attr( "x", j ).attr( "y", i ).attr( "_type", "_text" );
			text.css( css_celltextshow ).click( this.textClickHandler );
			return text;
		},
		createSudokuTable : function(){
			var table = $("<table>").css( css_table );
			for( var i = 0; i < 9; ++i ){
				var tr = $("<tr>");
				for( var j = 0; j < 9; ++j ){
					var td = this.createTDJQObj( i, j );
					var input = this.createInputJQObj( i, j );
					var text = this.createTextJQObj( i, j );
					td.append( input ).append( text );
					tr.append( td );
				}
				table.append( tr );
			}
			return table;
		},

		check : function( x, y, n ){
			if( !this.checkCellValue( n ) ){ SudokuUI.showMsg( "Invalid number. The number must range of 1-9.", css_alertbg ); return false; }
			if( !this.checkRule( x, y, n ) ){return false; }
			return true;
		},
		checkCellValue : function( n ){ return ( n >= 1 && n <= 9 );},
		checkRule : function ( x, y, n ){
			if( !this.checkRowRule( x, y, n ) ){
				SudokuUI.showMsg( "Row rule violation. Your number placement is against the Sudoku rule.", css_alertbg );
				return false;
			} else if( !this.checkColumnRule( x, y, n ) ){
				SudokuUI.showMsg( "Column rule violation. Your number placement is against the Sudoku rule.", css_alertbg );
				return false;
			} else if( !this.checkBoxRule( x, y, n ) ){
				SudokuUI.showMsg( "Box rule violation. Your number placement is against the Sudoku rule.", css_alertbg );
				return false;
			} else {
				return true;
			}
		},
		clear : function() {
			for( var i = 0; i < current_table.length; ++i ){
				for( var j = 0; j < current_table[i].length; ++j ){
					current_table[i][j] = 0;
					$( "[_type=_text][x=" + j + "][y=" + i + "]" ).text( "" );
					$( "[_type=_input][x=" + j + "][y=" + i + "]" ).attr( "value", "" );
				}
			}
		},
		checkBoxRule : function( x, y, n ){
			var prev = current_table[y][x];
			current_table[y][x] = n;
			var ncounter = this.createNCounter();
			var bx = Math.floor( x / 3 );
			var by = Math.floor( y / 3 );
			for( var i = by * 3; i < ( by + 1 ) * 3; ++i ){
				for( var j = bx * 3; j < ( bx + 1 ) * 3; ++j ){
					var h = current_table[j][i];
					if( h != 0 ){
						if( h >= 1 && h <= 9 ){
							if( ncounter[ h - 1 ] > 0 ){
								current_table[y][x] = prev;
								return false;
							} else {
								ncounter[ h - 1 ] += 1;
							}
						} else {
							throw "Error in " + arguments.callee.name + "Invalid Number";
						}
					}
				}
			}
			return true;
		},
		checkColumnRule : function( x, y, n ){
			var prev = current_table[y][x];
			current_table[y][x] = n;
			var ncounter = this.createNCounter();
			for( var i = 0; i < current_table.length; ++i ){
				var h = current_table[i][x];
				if( h != 0 ){
					if( h >= 1 && h <= 9 ){
						if( ncounter[ h - 1 ] > 0 ){
							current_table[y][x] = prev;
							return false;
						} else {
							ncounter[ h - 1 ] += 1;
						}
					} else {
						throw "Error in " + arguments.callee.name + "Invalid Number";
					}
				}
			}
			current_table[y][x] = prev;
			return true;
		},
		checkRowRule : function( x, y, n ){
			var prev = current_table[y][x];
			current_table[y][x] = n;
			var ncounter = this.createNCounter();
			for( var i = 0; i < current_table[y].length; ++i ){
				var h = current_table[y][i];
				if( h != 0 ){
					if( h >= 1 && h <= 9 ){
						if( ncounter[ h - 1 ] > 0 ){
							current_table[y][x] = prev;
							return false;
						} else {
							ncounter[ h - 1 ] += 1;
						}
					} else {
						throw "Error in " + arguments.callee.name + "Invalid Number";
					}
				}
			}
			current_table[y][x] = prev;
			return true;
		},
		createNCounter : function(){ 
			var h = new Array(9); 
			for( var i=0; i<9; ++i){
				 h[i]=0;
			}
			return h;
		},
		updateTable : function( x, y, n ){
			if( x >= 0 && x <= 9 && y >= 0 && y <= 9 && n >= 1 && n <= 9 ){
				current_table[y][x] = n;
			}else {
				throw "Error in " + arguments.callee.name;
			}
		},
		solve : function(){
			var tbl = DancingLinks.createSudokuConstraintTable();
			var root = DancingLinks.createLinkedGrid( tbl );
			var solution = DancingLinks.pruneSudokuSolutionSpace( current_table );
			current_table = DancingLinks.solve( root, solution );
			
			for( var i = 0; i < current_table.length; ++i ){
				for( var j = 0; j < current_table[i].length; ++j ){
					$( "[_type=_input][x=" + j + "][y=" + i + "]" ).attr( "value", current_table[i][j] );
				}
			}
			return current_table;
		},
		solveAndWrite : function(){
			try{
				var soltable = this.solve();
				
				for( var y = 0; y < soltable.length; ++y ){
					for( var x = 0; x < soltable[y].length; ++x ){
						var cell = $( "[_type=_text][x=" + x + "][y=" + y + "]" );
						cell.text( soltable[y][x] );
					}
				}
			}catch( e ){
				var errmsg = "";
				for( var p in e ){ errmsg += p + " : " + e[p] + "\n"; }
				alert( errmsg );
			}
				current_table = soltable;
		}
	};
}
