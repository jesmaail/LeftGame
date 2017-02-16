//LOAD ASSETS REQUIRED IN PRELOADER AND THEN CALL PRELOADER STATE

var Scene = {};
Scene.Boot = function (game){
	//
};

Scene.Boot.prototype = {
	preload: function(){		
		
	},
	create: function(){
		this.game.state.start('Preloader');
	}
};