function dragElement(elmnt, puzzle_piece) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;

    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;


        let final_x = elmnt.offsetLeft - pos1
        let final_y = elmnt.offsetTop - pos2

        puzzle_piece.final_x = final_x;
        puzzle_piece.final_y = final_y;

        // set the element's new position:

        //   if a piece is in a puzzle group, drag all pieces as well
        if (puzzle_piece.puzzleGroup) {
            let puzzleGroup = puzzle_piece.puzzleGroup;
            document.puzzle.movePieces(puzzle_piece, puzzleGroup);
        } else {
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

    }

    function closeDragElement() {

        document.puzzle.checkCorrectPieces(puzzle_piece);

        if (puzzle_piece.puzzleGroup) {
            let puzzleGroup = puzzle_piece.puzzleGroup;
            document.puzzle.movePieces(puzzle_piece, puzzleGroup);
        }

        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}