new function(){
	// private
	var nnodes = 0;
	Node = function( value ){
		this.count = 0;
		this.value = value;
		this.leaflabel = ""
		this.children = [];
		
		this.isEmptyWord = function( word ){ return word === undefined || word === null || word === ""; }
		this.nnodes = 0;		//except root node
		this._insert = function( word, value ){
			if( this.isEmptyWord( word ) ){
				if( this.isEmptyWord( this.leaflabel ) ){
					this.count++;
					this.leaflabel = value; 
					return true;
				}
			} else {
				var ch = word[0];
				var child = this.children[ ch ];
				if( child === undefined ){
					this.children[ ch ] = new Node( ch );
					child = this.children[ ch ];
					++nnodes;
				}
				
				if( child._insert( word.slice(1), value ) ){ 
					this.count++; 
					return true;
				} else {
					return false;
				}
			}
		};
		
		
		this._remove = function( word ){
			if( this.isEmptyWord( word ) ){
				if( this.isEmptyWord( this.leaflabel ) ){
					return false;
				} else {
					this.leaflabel = ""
					return true;
				}
			} else {
				var ch = word[0];
				var child = this.children[ ch ];
				if( child === undefined ){ return false; }
				if( child._remove( word.slice(1) ) ){
					if( child.count == 1 ){ delete this.children[ch]; }
					child.count--;
					--nnodes;
					return true;
				} else {
					return false;
				}
			}
		};
		
		this._find = function( word ){
			if( this.isEmptyWord( word ) ){
				if( this.isEmptyWord( this.leaflabel ) ){
					return null;
				} else {
					 return this.leaflabel; 
				}
			} else {
				var child = this.children[ word[0] ];
				if( child === undefined ){
					return null;
				} else {
					return child._find( word.slice(1) );
				}
			}
		};
		
		this._draw = function( f, parent_elm ){
			if( !this.isEmptyWord( this.value ) ){
				var me = new f( this.value + " : " + this.count + " ... " + this.leaflabel, parent_elm, true );
				for( n in this.children ){
					this.children[n]._draw( f, me );
				}
			}
			
		};
		return this;
	}

	// public
	Trie = function(){
		this.root = new Node( "/" );
		this.insert = function( word ){ this.root._insert( word, word ); };
		this.draw = function( f, parent_elm ){ this.root._draw( f, parent_elm ); };
		this.remove = function( word ){ if( this.root._remove( word ) ){ this.root.count--; } };
		this.find = function( word ){ return this.root._find( word ); };
		
	};
}