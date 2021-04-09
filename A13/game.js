/*
game.js for Perlenspiel 3.3.x
Last revision: 2021-03-24 (BM)

The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT delete this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// GLOBAL VARIABLES

var GRID_HEIGHT = 12;
var GRID_WIDTH = 8;
var GRID_TOP = 0;

var CIG_NUMBER = 0;

var CIG_START = 4;
var a = CIG_START + 1;
var b = CIG_START + 2;
var c = CIG_START + 3;

var rate = 40;

var currentCigHeight;

var smokeBits = [];

var createCig = function ( y ) {

	// resets the faders of where the old cigarettes used to be
	PS.fade( c, y, 0, { rgb : PS.COLOR_BLACK } );
	PS.fade( b, y, 0, { rgb : PS.COLOR_BLACK } );
	PS.fade( a, y, 0, { rgb : PS.COLOR_BLACK } );
	PS.fade( CIG_START, y, 0, { rgb : PS.COLOR_BLACK } );

	currentCigHeight = Math.floor(Math.random() * 11);
	CIG_START = Math.floor(Math.random() * 4);

	while ( currentCigHeight === y || currentCigHeight === (y - 1) || currentCigHeight === (y - 2) || currentCigHeight === (y-3)){
		currentCigHeight = Math.floor(Math.random() * 11);
	}

	while ( CIG_START === b ){
		CIG_START = Math.floor(Math.random() * 4);
	}

	a = CIG_START + 1;
	b = CIG_START + 2;
	c = CIG_START + 3;

	PS.color(c, currentCigHeight, PS.COLOR_ORANGE);
	PS.color(b, currentCigHeight, PS.COLOR_WHITE);
	PS.color(a, currentCigHeight, PS.COLOR_WHITE);
	PS.color(CIG_START, currentCigHeight, PS.COLOR_WHITE);

}

var smoke = function (x, y){

	var r = y-1;
	var t = y-2;

	var smoke3 = function(){
		if (t >= 0){
			PS.fade(x, (y-2), 30, { rgb : PS.COLOR_GRAY });
			PS.color(x, (y-2), PS.COLOR_BLACK);
		}
	}

	var smoke2 = function(){
		if (r >= 0) {
			PS.fade(x, (y - 1), 30, { rgb : PS.COLOR_GRAY, onEnd : smoke3});
			PS.color(x, (y - 1), PS.COLOR_BLACK);
		}
	}


	PS.fade(x, y, 30, { rgb : PS.COLOR_GRAY, onEnd : smoke2});
	PS.color(x, y, PS.COLOR_BLACK);

}

var burn = function ( x, y ){

	currentCigHeight = 99;

	PS.audioLoad("fx_swoosh");

	// SOMETHING WRONG WITH THIS MAYBE???
	var end3 = function() {

		PS.fade( (x + 3), y, rate, { rgb : PS.COLOR_RED, onEnd : createCig(y) } );
		PS.color( (x + 3), y, PS.COLOR_BLACK);
		PS.audioPlay("fx_swoosh");
	}

	var end2 = function() {

		PS.fade( (x + 2), y, rate, { rgb : PS.COLOR_RED, onEnd : end3 } );
		PS.color( (x + 2), y, PS.COLOR_BLACK);
		PS.audioPlay("fx_swoosh");
	}

	var end1 = function (){

		PS.fade( (x + 1), y, rate, { rgb : PS.COLOR_RED, onEnd : end2 } );
		PS.color( (x + 1), y, PS.COLOR_BLACK);
		PS.audioPlay("fx_swoosh");
	}


	var a = y - 1;

	if (a >= 0){
		smoke(x, a);
	}
	PS.fade( x, y, rate, { rgb : PS.COLOR_RED, onEnd : end1 } );
	PS.color( x, y, PS.COLOR_BLACK );
	PS.audioPlay("fx_swoosh");

}

PS.init = function( system, options ) {
	// Change this string to your team name
	// Use only ALPHABETIC characters
	// No numbers, spaces or punctuation!

	const TEAM = "TurtleHouseStudios";

	// Begin with essential setup
	// Establish initial grid size

	// PS.bgColor(PS.COLOR_BLACK);
	PS.gridSize( GRID_WIDTH, GRID_HEIGHT );
	PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_RED);
	PS.border(PS.ALL, PS.ALL, 0);
	PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.gridColor(PS.COLOR_BLACK);

	currentCigHeight = Math.floor(Math.random() * 7);
	createCig(currentCigHeight);

	PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
		if ( user === PS.ERROR ) {
			return;
		}
		PS.dbEvent( TEAM, "startup", user );
		PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
	}, { active : false } );
};

// CUSTOM FUNCTIONS:

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	if ( y === currentCigHeight ) {
		if (x === CIG_START) {
			burn(x, y);
		}
	}

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	PS.border(x, y, 3);

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	PS.border(x, y, 0);

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

	//	 var device = sensors.wheel; // check for scroll wheel
	//
	//	 if ( device ) {
	//	   PS.debug( "PS.input(): " + device + "\n" );
	//	 }

	// Add code here for when an input event is detected.
};

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

PS.shutdown = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

