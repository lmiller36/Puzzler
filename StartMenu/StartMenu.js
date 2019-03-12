function changeHorizontalPieces(change){
	let horizontalPieces = document.getElementById("horizontalPiecesCount");
	let numPieces = parseInt(horizontalPieces.innerText);

	let newNumPiesces = numPieces + change ;

	if(newNumPiesces > 4) horizontalPieces.innerText = newNumPiesces

}

function changeVerticalPieces(change){
	let verticalPieces = document.getElementById("verticalPiecesCount");
	let numPieces = parseInt(verticalPieces.innerText);

	let newNumPiesces = numPieces + change ;

	if(newNumPiesces > 4) verticalPieces.innerText = newNumPiesces

}

function submitImage(){

	let verticalPieces = parseInt(document.getElementById("verticalPiecesCount").innerText);

	let horizontalPieces = parseInt(document.getElementById("horizontalPiecesCount").innerText);

	console.log(verticalPieces+" "+horizontalPieces)
	console.log("here")

	
	document.puzzle = new Puzzle(500,500,verticalPieces,horizontalPieces);

}

function hoverButton(){
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