var view = {
	displayMessage: function(msg){
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
			{locations: [0, 0, 0], hits: ["", "", ""]},
			{locations: [0, 0, 0], hits: ["", "", ""]}],
				
	fire: function(guess){
		for(var i = 0; i < this.numShips; i++){
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if(index >= 0){
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if(this.isSunk(ship)){
					view.displayMessage("You sank my ship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed!");
		return false;
	},
	
	isSunk: function(ship){
		for(var i = 0; i < this.shipLength; i++){
			if(ship.hits[i] != "hit"){
				return false;
			}
		}
		return true;
	},
	
	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		//console.log("Ships array: ");
		//console.log(this.ships);
	},
	
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1)); //why +1
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1)); //same question
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i)); //with "" returns a string
			} else {
				newShipLocations.push((row + i) + "" + col); 
			}
		}
		return newShipLocations;
	},
	
	collision: function(locations){ //locations is an array of locations of the new ships placed on the board
		for(var i = 0; i < this.numShips; i ++){
			var ship = model.ships[i];
			for(var j = 0; j < locations.length; j ++){
				if(ship.locations.indexOf(locations[j]) >= 0){
					return true; /*returning from inside a loop that is inside another loop will stop iteration of both loops immediately, exiting the function and returning true*/
				}
			}
		}
		return false; //meaning never found a match hence no collision
	}
};

var controller = {
	guesses: 0,
	
	processGuess: function(guess){
		var location = parseGuess(guess);
		if(location){
			this.guesses++;
			var hit = model.fire(location);
			if(hit && model.shipsSunk === model.numShips){ //p.357 game over, no more guesses
				view.displayMessage("You sank all my battleships, in" + this.guesses + " guesses");
			}
		}
	}
};

function parseGuess(guess){
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	
	if(guess === null || guess.length !== 2){
		alert("Oops, please enter a letter and a number on the board.");
	}else{
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		
		if(isNaN(row) || isNaN(column)){
			alert("Oops, that isn't on the board.");
		}else if(row < 0 || row >= model.boardSize || column < 0 || column >=model.boardSize){
			alert("Oops, that's off the board!");
		}else{
			return row + column;
		}
	}
	return null;
}

function init(){
	var fireBtn = document.getElementById("fireBtn");
	fireBtn.onclick = handleFireBtn;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	
	model.generateShipLocations(); /*happens right away when the page is loaded before starting to play, all the locations of the ships will be ready when starting to play*/
}

function handleFireBtn(){
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	
	guessInput.value = "";
}

function handleKeyPress(e){
	var fireBtn = document.getElementById("fireBtn");
	if(e.keyCode === 13){
		fireBtn.click();//trick the browser pressing this key equals to click on the fire button
		return false;//to prevent from e.g. submitting the form etc.
	}
}

window.onload = init;

/*view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");

view.displayMessage("Hello! Anybody there?");

model.fire("53");
model.fire("06");
model.fire("16");
model.fire("26");
model.fire("34");
model.fire("24");
model.fire("44");
model.fire("12");
model.fire("11");
model.fire("10");

console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7"));

controller.processGuess("A0");
controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");
controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");
controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2");*/
