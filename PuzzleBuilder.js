class Puzzle {

	/**
	Instance Variables
	length in px
	width in px
	vertical_pieces
	horizontal_pieces
	**/
	constructor(height,width,vertical_pieces,horizontal_pieces) {
		this.height = height;
		this.width = width;
		this.vertical_pieces = vertical_pieces;
		this.horizontal_pieces = horizontal_pieces;
		this.puzzle_pieces = this.buildPuzzle();

		for (var i = 0; i < vertical_pieces; i++) {
			for(var j = 0; j < horizontal_pieces; j++){

				let puzzle_piece = this.puzzle_pieces[i][j]
				var puzzle_piece_svg = puzzle_piece.getPiece();

				var collection = document.getElementById('puzzle');
				var img_div =  document.createElement('div');
				const id = "piece row:"+i+" col:"+j
				img_div.class = "board"
				img_div.id = id
				img_div.appendChild(puzzle_piece_svg);
				img_div.setAttribute("style", 		
					`position: absolute;
					z-index: 9;
					background-color: #transparent;
					text-align: center;
					border: 1px solid #transparent;
					width:140px;
					height:140px;
					cursor: move;`);

				//img_div.innerHTML = puzzle_piece
				collection.appendChild(img_div);
				dragElement(document.getElementById(id),puzzle_piece);

			}
		}
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
		const piece_height = (this.height+0.0) / this.vertical_pieces;
		const piece_width = (this.width+0.0) / this.horizontal_pieces;

		console.log(piece_height+":"+piece_width);

		var puzzle_pieces = [];
		for(var i = 0; i < edges_in_row; i++) {
			let row = [];
			for (var j = 0; j < edges_in_row; j++){
				var top,bottom,left,right;
				//top edge
				if(i == 0) top = BorderType.FLAT_HORIZONTAL;
				else {
					//previous row determined its bottom (this piece's top)
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

				let puzzle_piece = new PuzzlePiece(top,bottom,left,right,i,j,piece_height,piece_width);
				row.push(puzzle_piece)
			}
			puzzle_pieces.push(row);
		}


		return puzzle_pieces;
	}

	checkCorrectPieces(puzzle_piece_moved,final_x,final_y){
		//set new location
		puzzle_piece_moved.final_x = final_x;
		puzzle_piece_moved.final_y = final_y;

		let row = puzzle_piece_moved.row;
		let col = puzzle_piece_moved.col;

		var pieces_to_combine = []

		//check top

		//check bottom

		//check left

		//check right

		if(puzzle_piece_moved.right != BorderType.FLAT_VERTICAL){
			let right_piece = this.puzzle_pieces[row][col+1];
			let orientation = EdgeType.RIGHT
			let shouldBeConnected = this.piecesShouldBeConnected(puzzle_piece_moved,right_piece,orientation);

			console.log(shouldBeConnected);
			const id1 = "piece row:"+row+" col:"+col
			const id2 = "piece row:"+right_piece.row+" col:"+right_piece.col

			var piece1 = document.getElementById(id1);
			var piece2 = document.getElementById(id2);

			pieces_to_combine.push(right_piece);
			// console.log(piece1);
			// console.log(piece2);

			// console.log(piece1.style.top);
			// console.log(piece1.style.left)

			// console.log(piece2.style.top);
			// console.log(piece2.style.left)
			// let piece1_x = parseInt(piece1.style.left.replace("px",""))
			// console.log(piece1_x)
			// console.log(piece1_x+100)

			// piece2.style.top = final_y + "px"
			// piece2.style.left = (final_x + 100) + "px"

			// piece1.style.left
		}

		//some piece(s) were correct
		if(pieces_to_combine.length > 0){
			pieces_to_combine.push(puzzle_piece_moved);
			this.combinePieces(pieces_to_combine)
		}

	}

	combinePieces(pieces_to_combine){

		for (var i = 0; i < pieces_to_combine.length;i++){
			let piece = pieces_to_combine[i]
			console.log(piece);
		}
	}

	//true if pieces are lined up correct with given orientation
	piecesShouldBeConnected(puzzle_piece1,puzzle_piece2,orientation){

		//check pieces exist
		if(!(puzzle_piece1 && puzzle_piece2)) return false;

		//check both pieces have moved
		if(!puzzle_piece1.pieceHasMoved()) return false;
		if(!puzzle_piece2.pieceHasMoved()) return false;



		//pixel tolerance of 2 for closeness of pieces
		let tolerance = 2;

		let x_diff = puzzle_piece1.final_x - puzzle_piece2.final_x;
		let y_diff = puzzle_piece1.final_y - puzzle_piece2.final_y;

		console.log(x_diff);
		console.log(y_diff);

		let width = 100;

		let greaterThanNegativeWidth = Math.abs(x_diff + width) <= tolerance; 
		let greaterThanNegativeTolerance = Math.abs(y_diff) <= tolerance; 


		//#TODO check if orientation is right
		if(orientation == EdgeType.RIGHT && greaterThanNegativeWidth && greaterThanNegativeTolerance){
			return true
		}

		return false;
		//if(puzzle_piece1.final_xssdsd)
	}
}

class PuzzlePiece {
	constructor(top_shape,bottom_shape,left_shape,right_shape,i,j,piece_height,piece_width){
		this.top = top_shape;
		this.bottom = bottom_shape;
		this.right = right_shape;
		this.left = left_shape;
		this.row = i;
		this.col = j
		this.width = piece_width;
		this.height = piece_height
		this.puzzle_group = null;
	}

	pieceHasMoved(){
		return this.final_x != null && this.final_y != null;
	}

	getImageName(){
		return  "img_"+this.row+"_"+this.col;
	}
	getPiece(){
		var img_div =  document.createElement('div');
		img_div.id = "pieceheader"
		let img_name = this.getImageName()

		let top = getBorders(this.top,EdgeType.TOP,img_name)
		let bottom = getBorders(this.bottom,EdgeType.BOTTOM,img_name)
		let right = getBorders(this.right,EdgeType.RIGHT,img_name)
		let left = getBorders(this.left,EdgeType.LEFT,img_name)

		var svg = `<?xml version="1.0" encoding="UTF-8"?>
		<svg xmlns="http://www.w3.org/2000/svg" width="170px" height="170px" >
		<defs>
		<pattern id="`+img_name+`" patternUnits="userSpaceOnUse" width="600" height="600">
		<image xlink:href="https://ippcdn-ippawards.netdna-ssl.com/wp-content/uploads/2018/07/49-1st-SUNSET-Sara-Ronkainen-1.jpg" x="0" y="0"
		width="600" height="600" />
		</pattern>
		</defs>  
		<rect y="30" id="svg_1" height="100" width="100" x="30" stroke-width="0" stroke="#000" fill="url(#`+img_name+`)"/>

		<g id="Puzzle">
		<g id="RowGroup">
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

		//adjust picture location
		svg = svg.replace("x=\"0\" y=\"0\"","x=\""+(this.col*this.width * -1)+"\" y=\""+(this.row*this.height*-1)+"\"");
		img_div.innerHTML = svg
		return img_div;
	}
}

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

function getBorders(border_type, edge_type,img_name){

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
			border = border.replace("M 30 30","M 30 130")
		}
		else if(edge_type == EdgeType.RIGHT){
			border = border.replace("M 30 30","M 130 30")
		} 

		//fix coloring for non flat pieces
		if(border_type != BorderType.FLAT_VERTICAL && border_type != BorderType.FLAT_HORIZONTAL){
			if(edge_type == EdgeType.TOP && border_type == BorderType.HORIZONTAL1){// && border_type == BorderType.){
				border = border.replace("fill=\"white\"","fill=\"url(#"+img_name+")\"");
			}
			else if(edge_type == EdgeType.BOTTOM && border_type == BorderType.HORIZONTAL2){
				border = border.replace("fill=\"white\"","fill=\"url(#"+img_name+")\"");
			}
			else if(edge_type == EdgeType.RIGHT && border_type == BorderType.VERTICAL1){
				border = border.replace("fill=\"white\"","fill=\"url(#"+img_name+")\"");
			}
			else if(edge_type == EdgeType.LEFT && border_type == BorderType.VERTICAL2){
				border = border.replace("fill=\"white\"","fill=\"url(#"+img_name+")\"");
			}

		}

		return border;
}

const flat_horizontal = `<path id="flat_horizontal"  fill="none" stroke="black" stroke-width=".5px" d="
		M 30 30                                                  
		l
		100 0                                                                                                                            
		"
		/>`;
const flat_vertical = `<path id="flat_vertical"  fill="none" stroke="black" stroke-width=".5px" d="
		M 30 30                                                  
		l
		0 100                                                                                                                            
		"
		/>`;

const horizontal1 = `<path id="horizontal1"  fill="white" stroke="black" stroke-width=".5px" d="
		M 30 30
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
const horizontal2 = `<path id="horizontal2"  fill="white" stroke="black" stroke-width=".5px" d="                                                                                                                        
		M 30 30
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

const vertical1 = `<path id="vertical1"  fill="white" stroke="black" stroke-width=".5px" d="
		M 30 30
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
const vertical2 = `<path id="vertical2"  fill="white" stroke="black" stroke-width=".5px" d="
		M 30 30
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

class PuzzleGroup{
		constructor(puzzle_pieces) {
			this.pieces = puzzle_pieces
		}
}