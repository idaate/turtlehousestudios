/*
game.js for Perlenspiel 3.3.xd
Last revision: 2021-04-08 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-21 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT delete this directive!

var GRID_HEIGHT = 16;
var GRID_WIDTH = 16;

var MAP_WALL = 0;
var MAP_GROUND = 1;
var MAP_GOAL = 2;
var GRID_BG = 3;

var WALL_COLOR = 0x938499;
var GRID_COLOR = 0x3a3a3b;

var CURRENT_STAGE = 1;

var goal;

// variables relating to the player sprite
var player;

var currentLocation;
var PLAYER_PLANE = 1;
var slideSpeed = 3;
var currentTimer;
var currentlySliding = false;
var HIT_NOISE;

// --------------------------- MAPS ---------------------------

var imageMap = {
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3,
		3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 3,
		3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 3,
		3, 3, 0, 1, 0, 2, 1, 1, 1, 1, 1, 1, 1, 0, 3, 3,
		3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 3,
		3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 3,
		3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
	]
};

var STAGE_2 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 2, 0, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
	]
}

var STAGE_3 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 3,
		3, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 0, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
	]
}

var STAGE_4 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 3, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
	]
}

var STAGE_5 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
		3, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3,
		3, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 3, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 3, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 3,
		3, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 3,
		3, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 3,
		3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
	]
}

var STAGE_6 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
		3, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 3,
		3, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 0, 1, 0, 1, 2, 1, 0, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
	]
}

var STAGE_7 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3,
		0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0,
		0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0,
		0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3
	]
}

var STAGE_8 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3,
		0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
		0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
		0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
		3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3
	]
}


var STAGE_9 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		3, 3, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3,
		3, 2, 1, 1, 0, 0, 3, 0, 0, 1, 1, 1, 1, 0, 3, 3,
		0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		3, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0,
		3, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 3,
		3, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 3,
		0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3,
		0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
		3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		3, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0,
		3, 3, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1,
		3, 3, 0, 3, 3, 3, 0, 0, 0, 3, 0, 0, 1, 0, 1, 1
	]
}

var STAGE_FINAL ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1,
		1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1,
		1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1,
		1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1,
		1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1,
		1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1,
		1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1,
		1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1,
		1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
	]
}


var drawMap = function( map ){
	var i, x, y, data, color;

	i = 0;
	for ( y = 0; y < map.height; y += 1){
		for ( x = 0; x < map.width; x += 1){
			data = map.data[ i ];
			switch ( data ){
				case MAP_GROUND:
					color = 0xe3edfc;
					break;
				case MAP_WALL:
					color = WALL_COLOR;
					break;
				case MAP_GOAL:
					color = 0xe8a2cf;
					break;
				case GRID_BG:
					color = GRID_COLOR;
					break;
				default:
					color = PS.COLOR_WHITE;
					break;
			}
			PS.color( x, y, color );
			i += 1;
		}
	}

};


PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	PS.gridSize( GRID_WIDTH, GRID_HEIGHT );
	PS.border(PS.ALL, PS.ALL, 0);
	PS.fade(PS.ALL, PS.ALL, 10);
	PS.gridColor(GRID_COLOR);


	drawMap( imageMap );

	player = PS.spriteSolid(1, 1);
	PS.spritePlane(player, PLAYER_PLANE);
	PS.spriteMove(player, 11, 7);
	PS.spriteSolidColor(player, 45, 47, 61);

//	PS.audioLoad("snow", {
//	})

	PS.audioLoad("xylo_eb6");
	PS.audioLoad("xylo_e7");


	PS.audioPlay("xylo_b4");


	PS.statusText(" ");

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	// PS.statusText( "Game" );

	// Add any other initialization code you need here.

	// Change this TEAM constant to your team name,
	// using ONLY alphabetic characters (a-z).
	// No numbers, spaces, punctuation or special characters!

	const TEAM = "turtlehousestudios";

	// This code should be the last thing
	// called by your PS.init() handler.
	// DO NOT MODIFY IT, except for the change
	// explained in the comment below.

	PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
		if ( user === PS.ERROR ) {
			return;
		}
		PS.dbEvent( TEAM, "startup", user );
		PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
	}, { active : false } );

	// Change the false in the final line above to true
	// before deploying the code to your Web site.
};

var whichMap = function( ){
	if ( CURRENT_STAGE === 1 ){
		drawMap ( imageMap );
	}
	else if ( CURRENT_STAGE === 2 ){
		PS.audioPlay("xylo_e7");
		drawMap ( STAGE_2 );
		PS.spriteMove(player, 3, 7);
	}
	else if ( CURRENT_STAGE === 3){
		PS.audioPlay("xylo_e7");
		drawMap ( STAGE_3 );
		PS.spriteMove(player, 3, 3);
	}
	else if ( CURRENT_STAGE === 4){
		PS.audioPlay("xylo_e7");
		drawMap ( STAGE_4 );
		PS.spriteMove(player, 10, 2);
	}
	else if ( CURRENT_STAGE === 5){
		PS.audioPlay("xylo_e7");
		drawMap ( STAGE_5 );
		PS.spriteMove(player, 8, 3);
	}
	else if ( CURRENT_STAGE === 6){
		PS.audioPlay("xylo_e7");
		drawMap ( STAGE_6 );
		PS.spriteMove(player, 8, 11);
	}
	else if ( CURRENT_STAGE === 7){
		PS.audioPlay("xylo_e7");
		drawMap ( STAGE_7 );
		PS.spriteMove(player, 9, 13);
	}
	else if ( CURRENT_STAGE === 8){
		PS.audioPlay("xylo_e7");
		drawMap ( STAGE_8 );
		PS.spriteMove(player, 2, 2);
	}
	else if ( CURRENT_STAGE === 9){
		PS.audioPlay("xylo_e7");
		drawMap ( STAGE_9 );
		PS.spriteMove(player, 14, 14);
	}
	else if ( CURRENT_STAGE === 10){
		PS.audioPlay("xylo_e7");
		drawMap ( STAGE_FINAL );
		PS.spriteMove(player, 1, 13);
	}
}


PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
};


PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};


PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};


PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};


PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};


var isWall = function ( x, y ){
	return ( PS.color( x, y ) === WALL_COLOR );
}

var isGoal = function ( x, y ){
	return ( PS.color( x, y ) === 0xe8a2cf );
}

var moveUp = function(){

	currentLocation = PS.spriteMove(player);
	var ny = currentLocation.y - 1;

	if (isGoal (currentLocation.x, currentLocation.y)){
		PS.timerStop(currentTimer);
		currentlySliding = false;
		CURRENT_STAGE += 1;
		whichMap();
	}



	else if (currentLocation.y === 0 ){
		PS.timerStop(currentTimer);
		currentlySliding = false;
		PS.audioPlay("xylo_eb6");
	}
	else if (isWall( currentLocation.x, (ny) )){
		PS.timerStop(currentTimer);
		currentlySliding = false;
		PS.audioPlay("xylo_eb6");
	}
	else if (currentLocation.y > 0 ) {
		PS.spriteMove(player, currentLocation.x, (currentLocation.y - 1));
	}

};

var moveDown = function(){
	currentLocation = PS.spriteMove(player);
	var yd = currentLocation.y + 1;

	if (isGoal (currentLocation.x, currentLocation.y)){
		PS.timerStop(currentTimer);
		currentlySliding = false;
		CURRENT_STAGE += 1;
		whichMap();
	}

	else if (currentLocation.y === (GRID_HEIGHT - 1)){
		PS.timerStop(currentTimer);
		currentlySliding = false;
		PS.audioPlay("xylo_eb6");
	}
	else if (isWall(currentLocation.x, yd)) {
		PS.timerStop(currentTimer);
		currentlySliding = false;
		PS.audioPlay("xylo_eb6");
	}
	else if (currentLocation.y < (GRID_HEIGHT - 1)) {
		PS.spriteMove(player, currentLocation.x, (currentLocation.y + 1));
	}
};

var moveLeft = function(){
	currentLocation = PS.spriteMove(player);
	var lx = currentLocation.x - 1;

	if (isGoal (currentLocation.x, currentLocation.y)){
		PS.timerStop(currentTimer);
		currentlySliding = false;
		CURRENT_STAGE += 1;
		whichMap();
	}

	else if (lx < 0){
		PS.timerStop(currentTimer);
		currentlySliding = false;
		PS.audioPlay("xylo_eb6");
	}
	else if (isWall(lx, (currentLocation.y))) {
		PS.timerStop(currentTimer);
		currentlySliding = false;
		PS.audioPlay("xylo_eb6");
	}
	else if (currentLocation.x > 0){
		PS.spriteMove(player, currentLocation.x - 1, (currentLocation.y));
	}

};

var moveRight = function(){
	currentLocation = PS.spriteMove(player);

	if (isGoal (currentLocation.x, currentLocation.y)){
		PS.timerStop(currentTimer);
		currentlySliding = false;
		CURRENT_STAGE += 1;
		whichMap();
	}
	else {
		var rx = currentLocation.x + 1;

		if (rx === ( GRID_WIDTH )){
			PS.timerStop(currentTimer);
			currentlySliding = false;
			PS.audioPlay("xylo_eb6");
		}
		else if (isWall(rx, (currentLocation.y))) {
			PS.timerStop(currentTimer);
			currentlySliding = false;
			PS.audioPlay("xylo_eb6");
		}
		else if (currentLocation.x < (GRID_WIDTH - 1)){
			PS.spriteMove(player, currentLocation.x + 1, (currentLocation.y));
		}
	}
};

PS.keyDown = function( key, shift, ctrl, options ) {

	currentLocation = PS.spriteMove(player);

	var dy = currentLocation.y + 1;
	var uy = currentLocation.y - 1;
	var lx = currentLocation.x - 1;
	var rx = currentLocation.x + 1;

	if ( key === PS.KEY_ARROW_UP ){
		if (uy > 0 ){
			if (!isWall(currentLocation.x, uy)){
				if (currentlySliding === false){
					currentlySliding = true;
					currentTimer = PS.timerStart( slideSpeed, moveUp );
				}
			}
		}
	}

	if ( key === PS.KEY_ARROW_DOWN ) {
		if (dy < ( GRID_HEIGHT - 1 ) ){
			if (!isWall(currentLocation.x, dy)){
				if (currentlySliding === false) {
					currentlySliding = true;
					currentTimer = PS.timerStart(slideSpeed, moveDown);
				}
			}
		}
	}

	if ( key === PS.KEY_ARROW_LEFT ) {
		if (lx > 0 ){
			if (!isWall(lx, currentLocation.y)){
				if (currentlySliding === false) {
					currentlySliding = true;
					currentTimer = PS.timerStart(slideSpeed, moveLeft);
				}
			}
		}
	}

	if ( key === PS.KEY_ARROW_RIGHT ) {
		if (rx < ( GRID_WIDTH - 1)){
			if (!isWall(rx, currentLocation.y)){
				if (currentlySliding === false) {
					currentlySliding = true;
					currentTimer = PS.timerStart(slideSpeed, moveRight);
				}
			}
		}
	}

	if ( key === PS.KEY_SPACE ){
		PS.audioPlay("xylo_b4");
		if ( CURRENT_STAGE === 1 ){
			PS.spriteMove(player, 11, 7);
		}
		else if ( CURRENT_STAGE === 2 ){
			PS.spriteMove(player, 3, 7);
		}
		else if ( CURRENT_STAGE === 3 ){
			PS.spriteMove(player, 3, 3);
		}
		else if ( CURRENT_STAGE === 4){
			PS.spriteMove(player, 10, 2);
		}
		else if ( CURRENT_STAGE === 5 ){
			PS.spriteMove(player, 8, 3);
		}
		else if ( CURRENT_STAGE === 6 ){
			PS.spriteMove(player, 8, 11);
		}
		else if ( CURRENT_STAGE === 7 ){
			PS.spriteMove(player, 9, 13);
		}
		else if ( CURRENT_STAGE === 8 ){
			PS.spriteMove(player, 2, 2);
		}
		else if ( CURRENT_STAGE === 9 ){
			PS.spriteMove(player, 14, 14);
		}
	}

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};



PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};



PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

	//	 var device = sensors.wheel; // check for scroll wheel
	//
	//	 if ( device ) {
	//	   PS.debug( "PS.input(): " + device + "\n" );
	//	 }

	// Add code here for when an input event is detected.
};



PS.shutdown = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

