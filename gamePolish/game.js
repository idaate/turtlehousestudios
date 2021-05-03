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
var MAP_DOOR = 3;
var SIGIL = 4;

var WALL_COLOR = 0x212121;
var GRID_COLOR = 0x212121;

var CURRENT_STAGE = 1;

var player;
var currentLocation;
var PLAYER_PLANE = 1;

var CURRENT_DIALOGUE = 1;

var movedYet = false;

var activateTwice = 0;


var reachedEnd = false;
var whichClick = 0;

// MAP 1

var STAGE_1 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_1_1 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_1_2 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

// STAGE 2

var STAGE_2_0 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 3, 1, 1, 4, 0, 0, 1, 3, 1, 0, 0, 0,
		0, 0, 0, 1, 3, 1, 0, 0, 1, 1, 1, 3, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 1, 0, 1, 1, 2, 1, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_2_1 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 1, 4, 0, 0, 1, 3, 1, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 3, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 1, 0, 1, 1, 2, 1, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_2_2 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 3, 1, 1, 4, 0, 0, 1, 1, 1, 0, 0, 0,
		0, 0, 0, 1, 3, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 1, 0, 1, 1, 2, 1, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

// STAGE 3

var STAGE_3_0 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 4, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 4, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_3_1 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 4, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 4, 1, 0,
		0, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_3_2 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 4, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 4, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_3_3 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 0,
		0, 1, 4, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 4, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}


var STAGE_3_4 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 4, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 4, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_3_5_0 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 4, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 2, 1, 0,
		0, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}


var STAGE_3_5_1 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 4, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 2, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_3_5_2 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 0,
		0, 1, 4, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0,
		0, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 0,
		0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 2, 1, 0,
		0, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 0,
		0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		0, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

// STAGE 4 --------------------------------------

var STAGE_4_0 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 4, 1, 3, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 4, 1, 1, 0, 0,
		0, 0, 1, 4, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 4, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 0, 0,
		0, 0, 1, 1, 4, 1, 1, 0, 0, 0, 3, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_4_1 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 4, 1, 3, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 4, 1, 1, 0, 0,
		0, 0, 1, 4, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 1, 1, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 4, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 0, 0,
		0, 0, 1, 1, 4, 1, 1, 0, 0, 0, 3, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_4_2 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 0,
		0, 0, 1, 4, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 4, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 0, 0,
		0, 0, 1, 1, 4, 1, 1, 0, 0, 0, 3, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_4_3 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 4, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 3, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_4_4 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 4, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 4, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 3, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
}

var STAGE_4_5 ={
	width : GRID_WIDTH,
	height : GRID_HEIGHT,
	pixelSize : 1,
	data : [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 4, 1, 3, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 4, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 3, 3, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 0, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
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
					color = 0xDDDDDD;
					break;
				case MAP_WALL:
					color = WALL_COLOR;
					break;
				case MAP_GOAL:
					color = 0xFFFFFF;
					break;
				case MAP_DOOR:
					color = 0x3D3D3D;
					break;
				case SIGIL:
					PS.glyph(x, y, "o");
					PS.glyphColor ( x, y, PS.COLOR_WHITE );
					color = 0x3B3B3B;
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

// PS.statusText("Move as always; up, down, left, & right.");

var textDisplay = function () {

	switch ( CURRENT_DIALOGUE ){
		case 1:
			PS.statusText("Move as always; UP, DOWN, LEFT, RIGHT.");
			break;
		case 2:
			PS.statusText("The SPACE between the sigils...");
			break;
		case 3:
			PS.statusText("Your goal, as always, is light.");
			break;
		case 4:
			PS.statusText("Not all paths open doors.");
			break;
		case 5:
			PS.statusText("The goal may be unclear at first...");
			break;
		case 6:
			PS.statusText("...but you cannot afford to stop moving.");
	}

}


PS.init = function( system, options ) {

	PS.gridSize( GRID_WIDTH, GRID_HEIGHT );
	PS.border(PS.ALL, PS.ALL, 0);
	PS.fade(PS.ALL, PS.ALL, 10);
	PS.gridColor(GRID_COLOR);


	drawMap( STAGE_1 );

	PS.statusColor(PS.COLOR_WHITE);
	textDisplay();

	player = PS.spriteSolid(1, 1);
	PS.spritePlane(player, PLAYER_PLANE);
	PS.spriteMove(player, 11, 2);
	PS.spriteSolidColor(player, 0x949494);

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
	if ( PS.color (x, y) === 0x3B3B3B ){
		return true;
	}
	else if ( PS.color (x, y ) === 0x3D3D3D ){
		return true;
	}
	return ( PS.color( x, y ) === WALL_COLOR );
}

var isGoal = function ( x, y ){
	if ( PS.color( x, y ) === 0xFFFFFF ){
		PS.statusText(" ");
	}
	return ( PS.color( x, y ) === 0xFFFFFF );
}

var isSigil = function () {
	var dy = currentLocation.y + 1;
	var uy = currentLocation.y - 1;
	var lx = currentLocation.x - 1;
	var rx = currentLocation.x + 1;

	if (PS.color ( currentLocation.x, dy ) === 0x3B3B3B )
		return true;
	else if ( PS.color ( currentLocation.x, uy ) === 0x3B3B3B )
		return true;
	else if ( PS.color ( lx, currentLocation.y ) === 0x3B3B3B )
		return true;
	else if ( PS.color ( rx, currentLocation.y ) === 0x3B3B3B )
		return true;

	return false;
}

var drawNewMap = function () {

	PS.glyph(PS.ALL, PS.ALL, "");

	if ( CURRENT_STAGE === 2 ){
		PS.spriteMove(player, 6, 6);
		drawMap(STAGE_2_0);
	}
	else if ( CURRENT_STAGE === 3 ){
		CURRENT_DIALOGUE = 5;
		textDisplay();
		PS.spriteMove(player, 10, 13);
		drawMap(STAGE_3_0);
	}
	else if ( CURRENT_STAGE === 4 ) {
		PS.spriteMove(player, 3, 3);
		drawMap(STAGE_4_0);
	}

}

var moveUp = function(){

	currentLocation = PS.spriteMove(player);
	var ny = currentLocation.y - 1;

	if (isGoal (currentLocation.x, currentLocation.y)){
		CURRENT_STAGE += 1;
		drawNewMap();
	}

	else if (isWall( currentLocation.x, (ny) )){

	}
	else if (currentLocation.y > 0 ) {
		PS.spriteMove(player, currentLocation.x, (currentLocation.y - 1));
	}

};

var moveDown = function(){
	currentLocation = PS.spriteMove(player);
	var yd = currentLocation.y + 1;

	if (isGoal (currentLocation.x, currentLocation.y)){
		CURRENT_STAGE += 1;
		drawNewMap();
	}

	else if (isWall(currentLocation.x, yd)) {

	}
	else if (currentLocation.y < (GRID_HEIGHT - 1)) {
		PS.spriteMove(player, currentLocation.x, (currentLocation.y + 1));
	}
};

var moveLeft = function(){
	currentLocation = PS.spriteMove(player);
	var lx = currentLocation.x - 1;

	if (isGoal (currentLocation.x, currentLocation.y)){
		CURRENT_STAGE += 1;
		drawNewMap();
	}


	else if (isWall(lx, (currentLocation.y))) {

	}
	else if (currentLocation.x > 0){
		PS.spriteMove(player, currentLocation.x - 1, (currentLocation.y));
	}

};

var moveRight = function(){
	currentLocation = PS.spriteMove(player);
	var rx = currentLocation.x + 1;

	if (isGoal (currentLocation.x, currentLocation.y)){
		CURRENT_STAGE += 1;
		drawNewMap();
	}

	else if (isWall(rx, (currentLocation.y))) {

	}
	else if (currentLocation.x < (GRID_WIDTH - 1)){
			PS.spriteMove(player, currentLocation.x + 1, (currentLocation.y));
	}

};

var sigilTest = function(){
	if ( isSigil () ){

		PS.audioPlay("hchord_d4");

		switch ( CURRENT_STAGE ){
			case 1:
				if ( currentLocation.y < 5 ) {
					drawMap( STAGE_1_1 );
				}
				else{
					CURRENT_DIALOGUE = 3;
					textDisplay();
					drawMap( STAGE_1_2 );
				}
				break;

			case 2:
				if ( currentLocation.y < 10 && currentLocation.y > 4 ){
					drawMap( STAGE_2_1 );
				}
				else if ( currentLocation.y < 10 ){
					drawMap( STAGE_2_2 );
				}
				else{
					CURRENT_DIALOGUE = 4;
					textDisplay();
					drawMap( STAGE_2_0 );
				}
				break;
			case 3:
				if ( activateTwice < 1 ){
					if ( currentLocation.y > 7 && currentLocation.x < 7 ){
						drawMap( STAGE_3_1 );
						PS.statusText(" ");

					}
					else if ( currentLocation.x < 7 ){
						drawMap(STAGE_3_2);
					}
					else if ( currentLocation.y < 7){
						drawMap( STAGE_3_3 );
					}
					else{
						drawMap( STAGE_3_4 );
						activateTwice = 1;
					}
				}
				else {
					if ( currentLocation.y > 7 && currentLocation.x < 7 ){
						drawMap ( STAGE_3_5_0 );
						CURRENT_DIALOGUE = 6;
						textDisplay();
					}
					else if ( currentLocation.x < 7 ){
						drawMap(STAGE_3_5_1);
					}
					else if ( currentLocation.y < 7){
						drawMap( STAGE_3_5_2 );
					}
				}
				break;
			case 4:


				if ( !reachedEnd ){
					if ( currentLocation.y > 3 && currentLocation.y < 8 && currentLocation.x < 5 ){
						if ( whichClick === 0 ){
							whichClick = 1;
						}
						PS.glyph(PS.ALL, PS.ALL, "");
						drawMap(STAGE_4_1);
					}
					else if ( currentLocation.y < 5 && currentLocation.x < 8 ){
						if ( whichClick === 0 ){
							whichClick = 2;
						}
						PS.glyph(PS.ALL, PS.ALL, "");
						drawMap(STAGE_4_2);
					}
					else {
						reachedEnd = true;
						PS.glyph(PS.ALL, PS.ALL, "");
						drawMap(STAGE_4_3);
						PS.statusText("The first choice is not always the best one.");
					}

				}
				else {

					if ( currentLocation.y > 3 && currentLocation.x < 5 ){
						if ( whichClick === 2 ){
							PS.glyph(PS.ALL, PS.ALL, "");
							drawMap(STAGE_4_4);
						}
					}
					else if ( currentLocation.y < 5 && currentLocation.x < 8 ){
						if ( whichClick === 1 ){
							PS.glyph(PS.ALL, PS.ALL, "");
							drawMap(STAGE_4_4);
						}
					}
					else {
						PS.statusText("But every choice is final.");
						PS.glyph(PS.ALL, PS.ALL, "");
						drawMap(STAGE_4_5);
					}
				}
		}
	}
}


PS.keyDown = function( key, shift, ctrl, options ) {

	currentLocation = PS.spriteMove(player);

	var dy = currentLocation.y + 1;
	var uy = currentLocation.y - 1;
	var lx = currentLocation.x - 1;
	var rx = currentLocation.x + 1;

	if ( key === PS.KEY_ARROW_UP || key === 119 ){

		if ( movedYet === false ){
			movedYet = true;
			CURRENT_DIALOGUE = 2;
			textDisplay();
		}

		if (uy > 0 ){
			if (!isWall(currentLocation.x, uy)){
				moveUp();
			}
		}
	}

	if ( key === PS.KEY_ARROW_DOWN || key === 115 ) {

		if ( movedYet === false ){
			movedYet = true;
			CURRENT_DIALOGUE = 2;
			textDisplay();
		}

		if (dy < ( GRID_HEIGHT - 1 ) ){
			if (!isWall(currentLocation.x, dy)){
				moveDown();
			}
		}
	}

	if ( key === PS.KEY_ARROW_LEFT || key === 97 ) {

		if ( movedYet === false ){
			movedYet = true;
			CURRENT_DIALOGUE = 2;
			textDisplay();
		}

		if (lx > 0 ){
			if (!isWall(lx, currentLocation.y)){
				moveLeft();
			}
		}
	}

	if ( key === PS.KEY_ARROW_RIGHT || key === 100 ) {

		if ( movedYet === false ){
			movedYet = true;
			CURRENT_DIALOGUE = 2;
			textDisplay();
		}

		if (rx < ( GRID_WIDTH - 1)){
			if (!isWall(rx, currentLocation.y)){
				moveRight();
			}
		}
	}

	if ( key === PS.KEY_SPACE ){

		sigilTest();

	}

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

