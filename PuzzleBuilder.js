class Puzzle {

/**
Instance Variables
length in px
width in px
vertical_pieces
horizontal_pieces
**/


constructor(length,width,vertical_pieces,horizontal_pieces) {
	this.length = length;
	this.width = width;
	this.vertical_pieces = vertical_pieces;
	this.horizontal_pieces = horizontal_pieces;
	this.puzzle = this.buildPuzzle();

	var collection = document.getElementById('topLeft');
	console.log(collection)
// var a = document.createElement('div');
for (var i = 0; i<vertical_pieces;i++){
	for (var j = 0; j<horizontal_pieces;j++){
		var a = this.puzzle[i][j].getPiece();
	// a.innerHTML = 'some text';
	collection.appendChild(a);
}
}

	// var newdiv = document.createElement("examplePiece");
	// newdiv.appendChild(document.createElement(this.puzzle[0][0].getPiece()));
	// document.body.appendChild(newdiv);
}

randomHorizontal(){
	let arr = [BorderType.HORIZONTAL1,BorderType.HORIZONTAL2]
	return  arr[Math.floor(Math.random() * arr.length)];
}


randomVertical(){
	let arr = [BorderType.VERTICAL1,BorderType.VERTICAL2]
	return arr[Math.floor(Math.random() * arr.length)];
}

buildPuzzle(){
	const edges_in_col = this.horizontal_pieces;
	const edges_in_row = this.vertical_pieces ;
	var puzzle_pieces = [];
	for(var i = 0; i < edges_in_row; i++) {
		let row = [];
		for (var j = 0; j < edges_in_row; j++){
			var top,bottom,left,right;
			//top edge
			if(i == 0) top = BorderType.FLAT_HORIZONTAL;
			else {
				//previous row determined its bottom (this piece's top)
				console.log(puzzle_pieces[i - 1][j])
				top = puzzle_pieces[i - 1][j].bottom;
			}

			//bottom edge
			if(i == edges_in_row - 1) bottom = BorderType.FLAT_HORIZONTAL;
			else {
				bottom = this.randomHorizontal();
			}

			//left edge
			if(j == 0) left = BorderType.FLAT_VERTICAL;
			else{
				//previous column determined its right (this piece's left)
				left = row[j - 1].right;
			}

			//right edge
			if(j == edges_in_col - 1) right = BorderType.FLAT_VERTICAL;
			else{
				right = this.randomVertical();
			}

			let puzzle_piece = new PuzzlePiece(top,bottom,left,right);
			row.push(puzzle_piece)
		}
		puzzle_pieces.push(row);
	}

	console.log(puzzle_pieces)

	return puzzle_pieces;
}

}

class PuzzlePiece {
	constructor(top_shape,bottom_shape,left_shape,right_shape){
		this.top = top_shape;
		this.bottom = bottom_shape;
		this.right = right_shape;
		this.left = left_shape;
	}

	getPiece(){
		let img_div =  document.createElement('div');
		let top = getBorders(this.top,EdgeType.TOP)
		let bottom = getBorders(this.bottom,EdgeType.BOTTOM)
		let right = getBorders(this.right,EdgeType.RIGHT)
		let left = getBorders(this.left,EdgeType.LEFT)

		let svg = `<?xml version="1.0" encoding="UTF-8"?>
		<svg xmlns="http://www.w3.org/2000/svg" width="1000px" height="1000px" >
		<g id="WolfiesPuzzleGenerator" transform="scale(3.779528749457873844999636220357925)"><title>Wolfie's Puzzle Generator</title>
		<g id="Puzzle"><title>Puzzle</title>
		<g id="RowGroup"><title>RowGroup</title>
		`
		+
		top
		+
		bottom
		+
		`
		</g>
		<g id="ColumnGroup"><title>ColumnGroup</title>
		`
		+
		left
		+
		right
		+
		`
		</g>

		</g>

		</svg>`	
		img_div.innerHTML = svg
		console.log(svg)
		  //img_div.innerHTML = "<img src = \"10x10 puzzl.svg\" alt=\"triangle with all three sides equal\" height=\"400px\"width=\"600px\"\\>"
		  return img_div;
		}
	}

// class Puzzle_Piece {
	var BorderType = Object.freeze({
		'HORIZONTAL1':'HORIZONTAL1',
		'HORIZONTAL2':'HORIZONTAL2',

		'VERTICAL1':'VERTICAL1',
		'VERTICAL2':'VERTICAL2',

		'FLAT_HORIZONTAL':'FLAT_HORIZONTAL',
		'FLAT_VERTICAL':'FLAT_VERTICAL'})

	var EdgeType = Object.freeze({
		'TOP':'TOP',
		'BOTTOM':'BOTTOM',

		'LEFT':'LEFT',
		'RIGHT':'RIGHT'
	})

	function getBorders(border_type,edge_type){

		var border;

		switch(border_type){
			case BorderType.FLAT_HORIZONTAL:
			border = flat_horizontal;
			break;
			case BorderType.FLAT_VERTICAL:
			border = flat_vertical;
			break;
			case BorderType.HORIZONTAL1:
			border = horizontal1;
			break;
			case BorderType.HORIZONTAL2:
			border = horizontal2;
			break;
			case BorderType.VERTICAL1:
			border = vertical1;
			break;
			case BorderType.VERTICAL2:
			border = vertical2;
			break;
			default:
			return null;
		}

		//translate up or down
		if(edge_type == EdgeType.BOTTOM) {
			border = border.replace("M 100 100","M 100 200")
		}
		else if(edge_type == EdgeType.RIGHT){
			border = border.replace("M 100 100","M 200 100")
		} 
		return border;
	}

	const flat_horizontal = `<path id="flat_horizontal"  fill="none" stroke="red" stroke-width=".5px" d="
	M 100 100                                                  
	l
	100 0                                                                                                                            
	"
	/>`;

	const flat_vertical = `<path id="flat_vertical"  fill="none" stroke="red" stroke-width=".5px" d="
	M 100 100                                                  
	l
	0 100                                                                                                                            
	"
	/>`;


	const horizontal1 = `<path id="horizontal1"  fill="none" stroke="red" stroke-width=".5px" d="
	M 100 100
	c 
	8.938547,-1.815642 24.20857,-2.793296 30.81937,0 
	4.003725,1.606145 8.566108,-0.2793296 6.610801,-2.513967 
	-3.258845,-3.631285 -6.424581,-5.307262 -6.424581,-11.52235 
	0,-6.284916 8.100558,-9.916202 18.99441,-9.916202 
	10.98696,0 18.99441,3.631285 18.99441,9.916202 
	0,6.215084 -3.165735,7.891061 -6.424581,11.52235 
	-1.955307,2.234637 2.607076,4.120112 6.610801,2.513967 
	6.610801,-2.793296 21.97393,-1.815642 30.81937,0                                                                                                                            
	"
	/>`
	const horizontal2 = `<path id="horizontal2"  fill="none" stroke="red" stroke-width=".5px" d="                                                                                                                        
	M 100 100
	c 
	8.938547,1.815642 24.20857,2.793296 30.81937,0 
	4.003725,-1.606145 8.566108,0.2793296 6.610801,2.513967 
	-3.258845,3.631285 -6.424581,5.307262 -6.424581,11.52235 
	0,6.284916 8.100558,9.916202 18.99441,9.916202 
	10.98696,0 18.99441,-3.631285 18.99441,-9.916202 
	0,-6.215084 -3.165735,-7.891061 -6.424581,-11.52235 
	-1.955307,-2.234637 2.607076,-4.120112 6.610801,-2.513967 
	6.610801,2.793296 21.97393,1.815642 30.81937,0 
	"
	/>`

	const vertical1 = `<path id="vertical1"  fill="none" stroke="red" stroke-width=".5px" d="
	M 100 100
	c 
	1.815642,8.938547 2.793296,24.20857 0,30.81937 
	-1.606145,4.003725 0.2793296,8.566108 2.513967,6.610801 
	3.631285,-3.258845 5.307262,-6.424581 11.52235,-6.424581 
	6.284916,0 9.916202,8.100558 9.916202,18.99441 
	0,10.98696 -3.631285,18.99441 -9.916202,18.99441 
	-6.215084,0 -7.891061,-3.165735 -11.52235,-6.424581 
	-2.234637,-1.955307 -4.120112,2.607076 -2.513967,6.610801 
	2.793296,6.610801 1.815642,21.97393 0,30.81937 
	"
	/>`
	const vertical2 = `<path id="vertical2"  fill="none" stroke="red" stroke-width=".5px" d="
	M 100 100
	c 
	-1.815642,8.938547 -2.793296,24.20857 0,30.81937 
	1.606145,4.003725 -0.2793296,8.566108 -2.513967,6.610801 
	-3.631285,-3.258845 -5.307262,-6.424581 -11.52235,-6.424581 
	-6.284916,0 -9.916202,8.100558 -9.916202,18.99441 
	0,10.98696 3.631285,18.99441 9.916202,18.99441 
	6.215084,0 7.891061,-3.165735 11.52235,-6.424581 
	2.234637,-1.955307 4.120112,2.607076 2.513967,6.610801 
	-2.793296,6.610801 -1.815642,21.97393 0,30.81937 
	"
	/>`