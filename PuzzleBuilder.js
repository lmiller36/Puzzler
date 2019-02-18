function removeElementById(id) {
	var elem = document.getElementById(id);
	if (elem)
		return elem.parentNode.removeChild(elem);
	else return null;
}

class Puzzle {

    /**
    Instance Variables
    length in px
    width in px
    vertical_pieces
    horizontal_pieces
    **/
    constructor(height, width, vertical_pieces, horizontal_pieces) {
    	this.height = height;
    	this.width = width;
    	this.vertical_pieces = vertical_pieces;
    	this.horizontal_pieces = horizontal_pieces;
    	this.puzzle_pieces = this.buildPuzzle();

    	this.addPuzzlePiecesToPuzzle();
    }

    addPuzzlePiecesToPuzzle() {
    	let widthOfScreen = window.innerWidth;
    	let heightOfScreen = window.innerHeight;

        let scale = 1.5;


    	let width = 100 * scale;
    	let height = 100 * scale;

    	for (var i = 0; i < this.vertical_pieces; i++) {
    		for (var j = 0; j < this.horizontal_pieces; j++) {

    			let puzzle_piece = this.puzzle_pieces[i][j]
    			var puzzle_piece_svg = puzzle_piece.getPiece();

    			var collection = document.getElementById('puzzle');
    			var img_div = document.createElement('div');
    			const id = puzzle_piece.getID();
    			img_div.class = "board"
    			img_div.id = id
    			img_div.appendChild(puzzle_piece_svg);
    			img_div.setAttribute("style",
    				`position: absolute;
    				z-index: 9;
    				background-color: #transparent;
    				text-align: center;
    				border: 1px solid #transparent;

    				cursor: move;`);

                //img_div.innerHTML = puzzle_piece
                collection.appendChild(img_div);
                dragElement(document.getElementById(id), puzzle_piece);

                /**randomize location**/

                let randomX = Math.floor(Math.random() * (widthOfScreen - width));
                let randomY = Math.floor(Math.random() * (heightOfScreen - height));

                puzzle_piece.move(randomX, randomY);

            }
        }

    }

    randomHorizontal() {
    	let arr = [BorderType.HORIZONTAL1, BorderType.HORIZONTAL2]
    	return arr[Math.floor(Math.random() * arr.length)];
    }


    randomVertical() {
    	let arr = [BorderType.VERTICAL1, BorderType.VERTICAL2]
    	return arr[Math.floor(Math.random() * arr.length)];
    }

    buildPuzzle() {
    	const edges_in_col = this.horizontal_pieces;
    	const edges_in_row = this.vertical_pieces;

        

    	const piece_height = (this.height + 0.0) / this.vertical_pieces;
    	const piece_width =  (this.width + 0.0) / this.horizontal_pieces;

        const scale = piece_height / 100.0;

        this.piece_height = piece_height;
        this.piece_width = piece_width;

    	var puzzle_pieces = [];
    	for (var i = 0; i < edges_in_row; i++) {
    		let row = [];
    		for (var j = 0; j < edges_in_row; j++) {
    			var top, bottom, left, right;
                //top edge
                if (i == 0) top = BorderType.FLAT_HORIZONTAL;
                else {
                    //previous row determined its bottom (this piece's top)
                    top = puzzle_pieces[i - 1][j].bottom;
                }

                //bottom edge
                if (i == edges_in_row - 1) bottom = BorderType.FLAT_HORIZONTAL;
                else {
                	bottom = this.randomHorizontal();
                }

                //left edge
                if (j == 0) left = BorderType.FLAT_VERTICAL;
                else {
                    //previous column determined its right (this piece's left)
                    left = row[j - 1].right;
                }

                //right edge
                if (j == edges_in_col - 1) right = BorderType.FLAT_VERTICAL;
                else {
                	right = this.randomVertical();
                }

                let puzzle_piece = new PuzzlePiece(top, bottom, left, right, i, j, piece_height, piece_width);
                row.push(puzzle_piece)
            }
            puzzle_pieces.push(row);
        }
        return puzzle_pieces;
    }

    checkCorrectPieces(puzzle_piece_moved) {
        //piece has already been connected to other pieces
        if (puzzle_piece_moved.puzzleGroup) {
        	let pieces = puzzle_piece_moved.puzzleGroup.pieces;
        	for (var i = 0; i < pieces.length; i++) {
        		let piece = pieces[i];
        		this.checkPieceNeighbors(piece);
        	}
        } else {
        	this.checkPieceNeighbors(puzzle_piece_moved);
        }
    }

    checkPieceNeighbors(puzzle_piece_moved) {
        //set new location
        let row = puzzle_piece_moved.row;
        let col = puzzle_piece_moved.col;

        var pieces_to_combine = []

        //check top
        if (puzzle_piece_moved.top != BorderType.FLAT_HORIZONTAL) {
        	let top_piece = this.puzzle_pieces[row - 1][col];
        	let orientation = EdgeType.TOP
        	let shouldBeConnected = this.piecesShouldBeConnected(puzzle_piece_moved, top_piece, orientation);
            //	if (shouldBeConnected) console.log("TOPS match")
            if (shouldBeConnected) {

            	pieces_to_combine.push(top_piece);
            }
        }
        //check bottom
        if (puzzle_piece_moved.bottom != BorderType.FLAT_HORIZONTAL) {
        	let bottom_piece = this.puzzle_pieces[row + 1][col];
        	let orientation = EdgeType.BOTTOM
        	let shouldBeConnected = this.piecesShouldBeConnected(puzzle_piece_moved, bottom_piece, orientation);
            //if (shouldBeConnected) console.log("BOTTOMs match")

            if (shouldBeConnected) {
            	pieces_to_combine.push(bottom_piece);
            }
        }

        //check left
        if (puzzle_piece_moved.left != BorderType.FLAT_VERTICAL) {
        	let left_piece = this.puzzle_pieces[row][col - 1];
        	let orientation = EdgeType.LEFT
        	let shouldBeConnected = this.piecesShouldBeConnected(puzzle_piece_moved, left_piece, orientation);
            //if (shouldBeConnected) console.log("Left match")

            if (shouldBeConnected) {
            	pieces_to_combine.push(left_piece);
            }
        }

        //check right

        if (puzzle_piece_moved.right != BorderType.FLAT_VERTICAL) {
        	let right_piece = this.puzzle_pieces[row][col + 1];
        	let orientation = EdgeType.RIGHT
        	let shouldBeConnected = this.piecesShouldBeConnected(puzzle_piece_moved, right_piece, orientation);
            //        	if (shouldBeConnected) console.log("Right match")


            if (shouldBeConnected) {

            	pieces_to_combine.push(right_piece);
            }
        }

        console.log(pieces_to_combine);

        //some piece(s) were correct
        if (pieces_to_combine.length > 0) {
        	pieces_to_combine.push(puzzle_piece_moved);
        	let puzzleGroup = this.combinePieces(pieces_to_combine, puzzle_piece_moved)
        	console.log(puzzleGroup);
        	this.movePieces(puzzle_piece_moved, puzzleGroup);
        }

    }

    movePieces(mainPiece, puzzleGroup) {
    	for (var i = 0; i < puzzleGroup.pieces.length; i++) {
    		let piece = puzzleGroup.pieces[i];

    		let rowDiff = piece.row - mainPiece.row;
    		let colDiff = piece.col - mainPiece.col;

    		let newX = mainPiece.final_x + this.piece_width  * colDiff;
    		let newY = mainPiece.final_y + this.piece_height * rowDiff;

    		piece.move(newX, newY);
    	}

    }


    combinePieces(pieces_to_combine, original_piece) {

    	// var getRowColID = function(row, col) {
    	// 	return row + "_" + col
    	// };

    	let original_puzzleGroup = original_piece.puzzleGroup;
    	var seen_ids = {}
        //combine all pieces, including pieces in groups
        var all_pieces_to_combine = [];
        var seen_group_ids = [];
        var seen_piece_ids = [];

        for (var i = 0; i < pieces_to_combine.length; i++) {
        	let piece = pieces_to_combine[i]
        	if (piece.puzzleGroup && seen_group_ids.indexOf(piece.puzzleGroup.group_id) == -1) {
        		let puzzleGroup = piece.puzzleGroup;

        		all_pieces_to_combine = all_pieces_to_combine.concat(puzzleGroup.pieces);
        		seen_group_ids.push(piece.puzzleGroup.group_id);
        	} else {
        		all_pieces_to_combine.push(piece);
        	}
        }


        var puzzleGroup = new PuzzleGroup(all_pieces_to_combine, all_pieces_to_combine[0].getID());
        for (var i = 0; i < all_pieces_to_combine.length; i++) {
        	let piece = all_pieces_to_combine[i];
        	piece.puzzleGroup = puzzleGroup;
        	seen_piece_ids[piece.getID()] = "here";
        }

        puzzleGroup.addSeenIDs(seen_piece_ids);

        // console.log(seen_piece_ids)
        // console.log(original_puzzleGroup)

        //remove edges of original puzzle group (if available)



        var checkNeighbors = (piece) => {
        	var checkEdge = (row, col, edge1, edge2) => {
        		let id = PuzzlePiece.getIDWithRowCol(row,col);
       
                //check if neighboring piece in puzzle group
                if (seen_piece_ids[id]) {
                	let pieceToCheck = this.puzzle_pieces[row][col];

                	//check that edges have not already been removed
                	if(!(original_puzzleGroup  && original_puzzleGroup.isPieceInGroup(pieceToCheck))) {
                		piece.removeEdge(edge1);
                		this.puzzle_pieces[row][col].removeEdge(edge2);
                	}
                }
            }

            checkEdge(piece.row - 1, piece.col, EdgeType.TOP, EdgeType.BOTTOM);
            checkEdge(piece.row + 1, piece.col, EdgeType.BOTTOM, EdgeType.TOP);
            checkEdge(piece.row, piece.col - 1, EdgeType.LEFT, EdgeType.RIGHT);
            checkEdge(piece.row, piece.col + 1, EdgeType.RIGHT, EdgeType.LEFT);

            // if (seen_piece_ids[getRowColID(piece.row - 1, piece.col)]) {
            // 	piece.removeEdge(EdgeType.TOP);
            // 	this.puzzle_pieces[piece.row - 1][piece.col].removeEdge(EdgeType.BOTTOM);
            // }
            // if (seen_piece_ids[getRowColID(piece.row + 1, piece.col)]) {
            // 	piece.removeEdge(EdgeType.BOTTOM);
            // 	this.puzzle_pieces[piece.row + 1][piece.col].removeEdge(EdgeType.TOP);
            // }
            // if (seen_piece_ids[getRowColID(piece.row, piece.col - 1)]) {
            // 	piece.removeEdge(EdgeType.LEFT);
            // 	this.puzzle_pieces[piece.row][piece.col - 1].removeEdge(EdgeType.RIGHT);
            // }
            // if (seen_piece_ids[getRowColID(piece.row, piece.col + 1)]) {
            // 	piece.removeEdge(EdgeType.RIGHT);
            // 	this.puzzle_pieces[piece.row][piece.col + 1].removeEdge(EdgeType.LEFT);
            // }
        }

        if (original_puzzleGroup) {
        	for (var i = original_puzzleGroup.pieces.length - 1; i >= 0; i--) {
        		let piece = original_puzzleGroup.pieces[i];
        		checkNeighbors(piece);
        	}
        }
        //remove eges of original piece
        else {
        	checkNeighbors(original_piece);
        }

        return puzzleGroup;
    }

    //true if pieces are lined up correct with given orientation
    piecesShouldBeConnected(puzzle_piece1, puzzle_piece2, orientation) {

        //check pieces exist
        if (!(puzzle_piece1 && puzzle_piece2)) return false;


        //check both pieces have a location
        if (!puzzle_piece1.pieceHasLocation()) return false;
        if (!puzzle_piece2.pieceHasLocation()) return false;

       	//both pieces in same puzzle group
       	if(puzzle_piece1.puzzleGroup && puzzle_piece2.puzzleGroup 
       		&& puzzle_piece1.puzzleGroup.group_id ==  puzzle_piece2.puzzleGroup.group_id)
       		return false;

        //pixel tolerance of 2 for closeness of pieces
        let tolerance = 4;

        let x_diff = puzzle_piece1.final_x - puzzle_piece2.final_x;
        let y_diff = puzzle_piece1.final_y - puzzle_piece2.final_y;

        let width = this.piece_width;
        let height = this.piece_height;

        let pieceOnRight = Math.abs(x_diff + width) <= tolerance;
        let pieceOnLeft = Math.abs(x_diff - width) <= tolerance;

        let pieceOnBottom = Math.abs(y_diff + height) <= tolerance;
        let pieceOnTop = Math.abs(y_diff - height) <= tolerance;

        let heightsAlmostEqual = Math.abs(y_diff) <= tolerance;
        let widthsAlmostEqual = Math.abs(x_diff) <= tolerance;

        // console.log(puzzle_piece1.getID());
        // console.log(puzzle_piece2.getID());

        // console.log("x_diff:"+x_diff);
        // console.log("y_diff"+y_diff);

        // console.log("pieceOnRight:"+pieceOnRight);
        // console.log("pieceOnLeft:"+pieceOnLeft);

        // console.log("pieceOnBottom:"+pieceOnBottom);
        // console.log("pieceOnTop:"+pieceOnTop);

        // console.log("heightsAlmostEqual:"+heightsAlmostEqual);
        // console.log("widthsAlmostEqual:"+widthsAlmostEqual);



        if (orientation == EdgeType.BOTTOM && pieceOnBottom && widthsAlmostEqual) {
        	return true
        }

        if (orientation == EdgeType.TOP && pieceOnTop && widthsAlmostEqual) {
        	return true
        }

        if (orientation == EdgeType.RIGHT && pieceOnRight && heightsAlmostEqual) {
        	return true
        }

        if (orientation == EdgeType.LEFT && pieceOnLeft && heightsAlmostEqual) {
        	return true
        }

        return false;
    }
}

class PuzzlePiece {
	constructor(top_shape, bottom_shape, left_shape, right_shape, i, j, piece_height, piece_width) {
		this.top = top_shape;
		this.bottom = bottom_shape;
		this.right = right_shape;
		this.left = left_shape;
		this.row = i;
		this.col = j
		this.width = piece_width;
		this.height = piece_height
		this.puzzleGroup = null;
	}

	move(newX, newY) {

		let pieceDiv = document.getElementById(this.getID());
        // pieceDiv.style.top = () + "px"
        // pieceDiv.style.left = () + "px"

        pieceDiv.style.top = newY + "px"
        pieceDiv.style.left = newX + "px"

        this.final_x = newX;
        this.final_y = newY;
    }

    pieceHasLocation() {
    	return this.final_x != null && this.final_y != null;
    }

    static getIDWithRowCol(row,col){
    	return "piece row:" + row + " col:" + col;
    }

    getID() {
    	return PuzzlePiece.getIDWithRowCol(this.row,this.col);
    }

    getImageName() {
    	return "img_" + this.row + "_" + this.col;
    }


    removeEdge(edge_type) {
    	console.log("remove: " + this.getID() + " : " + edge_type)
        //var edge = document.getElementById(this.getBorderID(this.getBorderTypeForEdge(edge_type)));
        //console.log(edge)
        let edgeID = this.getBorderID(edge_type);
        removeElementById(edgeID);

    }

    getBorderID(edge) {
    	return this.getID() + "_" + edge;
    }

    getPiece() {
    	var img_div = document.createElement('div');
    	img_div.id = "pieceheader"
    	let img_name = this.getImageName()

        let scale = this.height / 100.0;
        let newLength = scale * 170.0;
        console.log(newLength);

    	let top = getBorders(this.top, EdgeType.TOP, img_name).replace("id=\"\"", "id=\"" + this.getBorderID(EdgeType.TOP) + "\"")
    	let bottom = getBorders(this.bottom, EdgeType.BOTTOM, img_name).replace("id=\"\"", "id=\"" + this.getBorderID(EdgeType.BOTTOM) + "\"")
    	let right = getBorders(this.right, EdgeType.RIGHT, img_name).replace("id=\"\"", "id=\"" + this.getBorderID(EdgeType.RIGHT) + "\"")
    	let left = getBorders(this.left, EdgeType.LEFT, img_name).replace("id=\"\"", "id=\"" + this.getBorderID(EdgeType.LEFT) + "\"")

    	var svg = `<?xml version="1.0" encoding="UTF-8"?>
    	<svg xmlns="http://www.w3.org/2000/svg" height="`+newLength+`px" width = "`+newLength+`px">
        <g id="WolfiesPuzzleGenerator" transform="scale(`+scale+`)">
    	<defs>
    	<pattern id="` + img_name + `" patternUnits="userSpaceOnUse" width="`+(scale*600)+`" height="`+(scale*600)+`">
    	<image xlink:href="https://ippcdn-ippawards.netdna-ssl.com/wp-content/uploads/2018/07/49-1st-SUNSET-Sara-Ronkainen-1.jpg" x="0" y="0"
    	width="600" height="600" />
    	</pattern>
    	</defs>  
        `+
    	      `<rect y="30" id="svg_1" height="100" width="100" x="30" stroke-width="0" stroke="#000" fill="url(#` + img_name + `)"/>`+
`
    	<g id="Puzzle">
    	<g id="RowGroup">
    	` +
    	top +
    	bottom +
    	`
    	</g>
    	<g id="ColumnGroup"><title>ColumnGroup</title>
    	` +
    	left +
    	right +
    	`
    	</g>

    	</g>

    	</svg>`

        //adjust picture location
        svg = svg.replace("x=\"0\" y=\"0\"", "x=\"" + (this.col * this.width * -1) + "\" y=\"" + (this.row * this.height * -1) + "\"");
        img_div.innerHTML = svg
        return img_div;
    }
}

var BorderType = Object.freeze({
	'HORIZONTAL1': 'HORIZONTAL1',
	'HORIZONTAL2': 'HORIZONTAL2',

	'VERTICAL1': 'VERTICAL1',
	'VERTICAL2': 'VERTICAL2',

	'FLAT_HORIZONTAL': 'FLAT_HORIZONTAL',
	'FLAT_VERTICAL': 'FLAT_VERTICAL'
})

var EdgeType = Object.freeze({
	'TOP': 'TOP',
	'BOTTOM': 'BOTTOM',

	'LEFT': 'LEFT',
	'RIGHT': 'RIGHT'
})

function getBorders(border_type, edge_type, img_name) {

	var border;

	switch (border_type) {
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
    if (edge_type == EdgeType.BOTTOM) {
    	border = border.replace("M 30 30", "M 30 130")
    } else if (edge_type == EdgeType.RIGHT) {
    	border = border.replace("M 30 30", "M 130 30")
    }

    //fix coloring for non flat pieces
    if (border_type != BorderType.FLAT_VERTICAL && border_type != BorderType.FLAT_HORIZONTAL) {
        if (edge_type == EdgeType.TOP && border_type == BorderType.HORIZONTAL1) { // && border_type == BorderType.){
        	border = border.replace("fill=\"white\"", "fill=\"url(#" + img_name + ")\"");
        } else if (edge_type == EdgeType.BOTTOM && border_type == BorderType.HORIZONTAL2) {
        	border = border.replace("fill=\"white\"", "fill=\"url(#" + img_name + ")\"");
        } else if (edge_type == EdgeType.RIGHT && border_type == BorderType.VERTICAL1) {
        	border = border.replace("fill=\"white\"", "fill=\"url(#" + img_name + ")\"");
        } else if (edge_type == EdgeType.LEFT && border_type == BorderType.VERTICAL2) {
        	border = border.replace("fill=\"white\"", "fill=\"url(#" + img_name + ")\"");
        }

    }

    return border;
}

const flat_horizontal = `<path id=""  fill="none" stroke="black" stroke-width=".5px" d="
M 30 30                                                  
l
100 0                                                                                                                            
"
/>`;
const flat_vertical = `<path id=""  fill="none" stroke="black" stroke-width=".5px" d="
M 30 30                                                  
l
0 100                                                                                                                            
"
/>`;

const horizontal1 = `<path id=""  fill="white" stroke="black" stroke-width=".5px" d="
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
const horizontal2 = `<path id=""  fill="white" stroke="black" stroke-width=".5px" d="                                                                                                                        
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

const vertical1 = `<path id=""  fill="white" stroke="black" stroke-width=".5px" d="
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
const vertical2 = `<path id=""  fill="white" stroke="black" stroke-width=".5px" d="
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

class PuzzleGroup {
	constructor(puzzle_pieces, group_id) {
		this.pieces = puzzle_pieces;
		this.group_id = group_id;
	}

	addSeenIDs(seen_piece_ids) {
		this.seen_piece_ids = seen_piece_ids;
	}

	isPieceInGroup(piece) {
		if (!this.seen_piece_ids) return null;
		if(!piece) return false;
		let id = piece.getID();

		if (this.seen_piece_ids[id]) return true;

		return false;
	}
}