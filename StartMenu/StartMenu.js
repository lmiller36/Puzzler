function changeHorizontalPieces(change) {
    let horizontalPieces = document.getElementById("horizontalPiecesCount");
    let numPieces = parseInt(horizontalPieces.innerText);

    let newNumPiesces = numPieces + change;

    if (newNumPiesces > 4) horizontalPieces.innerText = newNumPiesces

}

function changeVerticalPieces(change) {
    let verticalPieces = document.getElementById("verticalPiecesCount");
    let numPieces = parseInt(verticalPieces.innerText);

    let newNumPiesces = numPieces + change;

    if (newNumPiesces > 4) verticalPieces.innerText = newNumPiesces

}

function submitImage() {

    let verticalPieces = parseInt(document.getElementById("verticalPiecesCount").innerText);

    let horizontalPieces = parseInt(document.getElementById("horizontalPiecesCount").innerText);

    console.log(verticalPieces + " " + horizontalPieces)
    console.log("here")


    document.puzzle = new Puzzle(500, 500, verticalPieces, horizontalPieces);

}

function hoverButton() {
    console.log("here");
    document.getElementById("showMenuButton").style.visibility = "visible";
}


function on() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("showMenuButton").style.visibility = "hidden";

}

function off() {
    document.getElementById("overlay").style.display = "none";
}

function solvePuzzle() {

    let puzzle = document.puzzle;

    console.log(puzzle);

    let widthOfScreen = window.innerWidth;
    let heightOfScreen = window.innerHeight;

    let puzzleWidth = puzzle.width;
    let puzzleHeight = puzzle.height;

    let startX = (widthOfScreen - puzzleWidth) / 2;
    let startY = (heightOfScreen - puzzleHeight) / 2;

    var x = startX;
    var y = startY;

console.log()

    for (var i = 0; i < puzzle.vertical_pieces; i++) {
        for (var j = 0; j < puzzle.horizontal_pieces; j++) {
            let piece = puzzle.puzzle_pieces[i][j];
            let pieceId = piece.getID();

            piece.move(x, y);

            // let elmnt = document.getElementById(pieceId);

            //  elmnt.style.top = y + "px";
            //  elmnt.style.left = x + "px";

            x += piece.width;
            console.log(x +" "+y)
        }
        x = startX;
        y += puzzle.puzzle_pieces[i][0].height;
    }

    // document.getElementById('topLeft').remove()

    // var newDiv = document.createElement("div");
    // let piece = document.puzzle.puzzle_pieces[0][0].getPiece()
    // newDiv.appendChild(piece);
    // document.body.appendChild(newDiv);
}