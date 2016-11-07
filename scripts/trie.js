// -------------------  TrieJS -----------------//
//
// History :
//   2011/04/17 ver.1 : Initial release.
//
// written by kogecoo. ( kogecoo'AT'gmail_com )
// -------------------  TrieJS -----------------//

/**
 * How to use.
 *
 *
 * var trie = new Trie();
 * trie.insert( "some_txt", SomeObj );
 * var some_obj = trie.find( "some_txt" );
 * trie.remove( "some_txt" );
 *
 *
 */
 
new function(){
	// private
	var nnodes = 0;
	Node = function( value ){
		this.count = 0;
		this.value = value;
		this.leaf = "
		this.children = [];
		
		this.isEmptyWord = function( word ){ return word === undefined || word === null || word === ""; }
		this.nnodes = 0;		//except root node
		this._insert = function( word, data ){
			if( this.isEmptyWord( word ) ){
				if( this.leaf === null ){
					this.count++;
					this.leaf = data; 
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
				
				if( child._insert( word.slice(1), data ) ){ 
					this.count++; 
					return true;
				} else {
					return false;
				}
			}
		};
		
		
		this._remove = function( word ){
			if( this.isEmptyWord( word ) ){
				if( this.leaf === null ){
					return false;
				} else {
					this.leaf = null;
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
				if( this.leaf === null ){
					return null;
				} else {
					 return this.leaf; 
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
		return this;
	}

	// public
	Trie = function(){
		this.root = new Node( "/" );
		this.insert = function( word, data ){ this.root._insert( word, data ); };
		this.remove = function( word ){ if( this.root._remove( word ) ){ this.root.count--; } };
		this.find = function( word ){ return this.root._find( word ); };
		
	};
}