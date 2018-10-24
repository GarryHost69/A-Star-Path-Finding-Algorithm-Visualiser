var gridsize = 10;
var begin = false;
var zoomIn, zoomOut, obs, startButton, reset;
var grid = [];
var start, goal;
var openSet = [];
var closedSet = [];
var found = false;
var path = [];

function setup() {
	createCanvas(600, 600);
	zoomIn = createButton('+');
	zoomOut = createButton('-');
	obs = createButton('Create Random Obstacles');
	startButton = createButton('Start');
	reset = createButton('Reset');
	zoomIn.position(700, 250);
	zoomOut.position(750, 250);
	obs.position(650, 200);
	startButton.position(670, 300);
	reset.position(750, 300);
	zoomIn.mouseClicked(DecreaseGridSize);
	zoomOut.mouseClicked(IncreaseGridSize);
	startButton.mouseClicked(Begin);
	obs.mouseClicked(RandomObstacles);
	reset.mouseClicked(ResetGrid);
	InitGrid();
	window.alert("Drag Your Cursor to the grid that you want\nto select as the starting and press the 's'\nkey. Do the same to select an end point or goal\nthis time press the 'e' key to select the end point\nPress the start button to find the shortest path.\nIn order to make sure that a solution exists, create the\nStart and end points after you've made the Obstacles.");
}

function draw() {
	background(255);
	drawGrid();
	if (begin && openSet.length > 0) {
		var lowest = 0
		for (let i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[lowest].f) {
				lowest = i;
			}
		}
		var current = openSet[lowest];
		if (current === goal) {
			begin = false;
			found = true;
		}
		removeFromOpenSet(current);
		closedSet.push(current);
		for (let i = 0; i < current.neighbours.length; i++) {
			var neighbour = current.neighbours[i];
			if (!(closedSet.includes(neighbour)) && !neighbour.obstacle) {
				var gscore = current.g + 1;
				if (openSet.includes(neighbour)) {
					if (gscore < neighbour.g) {
						neighbour.g = gscore;
					}
				}
				else {
					neighbour.g = gscore;
					openSet.push(neighbour);
				}
				neighbour.h = heuristic(neighbour, goal);
				neighbour.f = neighbour.h + neighbour.g;
				neighbour.cameFrom = current;
			}
			path = [];
			var temp = current;
			path.push(temp);
			while (temp.cameFrom) {
				path.push(temp.cameFrom);
				temp = temp.cameFrom;
			}
		}
		drawClosedSet();
		drawOpenSet();
		drawPath();
	}
	else {
		if (begin) {
			window.alert("No Solution Exist!!");
			begin = false;
		}
		else
		if (found) {
			window.alert("Shortest Path Found!!");
			found = false;
		}
		drawOpenSet();
		drawClosedSet();
		drawPath();
	}
}

function drawPath() {
	for (let i = 0; i < path.length; i++) {
		path[i].drawCell(color(255, 255, 0));
	}
}

function heuristic(x, y) {
	//return dist(x.x, x.y, y.x, y.y); //Eucledian distance
	return abs(x.x - y.x) + abs(x.y - y.y); // Manhattan distance
}

function removeFromOpenSet(element) {
	for (let i = openSet.length - 1; i >= 0; i--) {
		if (openSet[i] == element) {
			openSet.splice(i, 1);
		}
	}
}

function IncreaseGridSize() {
	gridsize += 2;
	grid = [];
	InitGrid();
	openSet = [];
	closedSet = [];
	begin = false;
	start = undefined;
	path = [];
	goal = undefined;
}

function DecreaseGridSize() {
	gridsize -= 2;
	grid = [];
	path = [];
	InitGrid();
	start = undefined;
	goal = undefined;
	openSet = [];
	closedSet = [];
	begin = false;
}

function Cell(i, j) {
	this.x = i;
	this.y = j;
	this.neighbours = [];
	this.f = 0;
	this.h = 0;
	this.g = 0;
	this.cameFrom = undefined;
	this.obstacle = false;
	this.drawCell = function(c) {
		fill(c);
		if (this.obstacle == true) {
			fill(0);
		}
		rect(this.x * (600 / gridsize), this.y * (600 / gridsize), ((600 / gridsize) - 1), ((600 / gridsize) - 1));
	}
	this.addNeighbourCells = function (i, j) {
		if (this.x > 0) {
			this.neighbours.push(grid[i-1][j]);
		}
		if (this.x < gridsize - 1) {
			this.neighbours.push(grid[i+1][j]);
		}
		if (this.y < gridsize - 1) {
			this.neighbours.push(grid[i][j+1]);
		}
		if (this.y > 0) {
			this.neighbours.push(grid[i][j-1]);
		}
	}
}

function InitGrid() {
	for (let i = 0; i < gridsize; i++) {
		grid[i] = Array(gridsize);
	}
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid.length; j++) {
			grid[i][j] = new Cell(i, j);
		}
	}
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid.length; j++) {
			grid[i][j].addNeighbourCells(i, j);
		}
	}
}

function drawOpenSet() {
	for (let i = 0; i < openSet.length; i++) {
		openSet[i].drawCell(color(0, 255, 255));
	}
}

function drawClosedSet() {
	for (let i = 0; i < closedSet.length; i++) {
		closedSet[i].drawCell(color(204, 102, 0));
	}
}

function drawGrid() {
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid.length; j++) {
			grid[i][j].drawCell(color(211, 211, 211));
		}
	}
}

function ResetGrid() {
	InitGrid();
	begin = false;
	start = undefined;
	goal = undefined;
	openSet = [];
	closedSet = [];
	path = [];
}

function Begin() {
	if (start == undefined || begin == undefined || goal == undefined) {
		window.alert("Select a Start and End point");
	}
	else {
		begin = true;
	}
}

function RandomObstacles() {
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid.length; j++) {
			if (grid[i][j].obstacle) {
				grid[i][j].obstacle = false;
				continue;
			}
			if (random(0, 1) < 0.3) {
				grid[i][j].obstacle = true;
			}
		}
	}
}

function keyTyped() {
	if (mouseX < 600 && mouseY < 600) {
		if (key === 's' && start === undefined) {
			let i = floor((gridsize * mouseX) / 600);
			let j = floor((gridsize * mouseY) / 600);
			start = grid[i][j];
			openSet.push(start);
		}
		else
		if (key === 'e' && goal === undefined) {
			let i = floor((gridsize * mouseX) / 600);
			let j = floor((gridsize * mouseY) / 600);
			goal = grid[i][j];
		}
	}
}

function mouseClicked() {
	if (mouseX < 600 && mouseY < 600) {
		let i = floor((gridsize * mouseX) / 600);
		let j = floor((gridsize * mouseY) / 600);
		if (grid[i][j].obstacle) {
			grid[i][j].obstacle = false;
		}
		else {
			grid[i][j].obstacle = true;
		}
	}
}
