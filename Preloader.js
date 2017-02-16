Scene.Preloader = function (game) {
	this.background = null; // define background
	this.preloadBar = null; // define loader bar
};

Scene.Preloader.prototype = {	

	preload: function () {
		this.width = 400;
		this.height = 400;
		this.imgPath = './source/media/js/games/left/assets/img/';

		this.game.stage.backgroundColor = '#2f2f2f';
		this.load.image('logo', this.imgPath + 'logo.png');
		this.load.image('fb', this.imgPath + 'fb.png');
		this.load.image('twitter', this.imgPath + 'twitter.png');
		this.load.image('leftovers', this.imgPath+'leftovers.png');
		this.load.spritesheet('shark', this.imgPath +'shark.png', 52, 54, 4);
		this.load.spritesheet('food', this.imgPath +'food.png', 93, 65, 2);
		this.load.spritesheet('buoy', this.imgPath +'buoy.png', 73, 103, 4);
		this.load.spritesheet('dance', this.imgPath +'dance.png', 286, 350, 3);
		this.load.spritesheet('stream', this.imgPath +'stream.png', 24, 24, 4);


		this.load.image('block', this.imgPath +'player.png');
        this.load.image('blockFood', this.imgPath +'blockFood.png');
        this.load.image('red', this.imgPath +'block.png');
        this.load.image('tail', this.imgPath +'tail.png');
	},

	create: function () {
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;
		this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
		this.blockGame = true;

		this.shark = this.game.add.sprite(this.width/2, (this.height/2) - 30, 'dance');
		this.shark.anchor.set(0.5, 0.5);
		this.shark.animations.add('dance', [0,1,2]);
		this.shark.animations.play('dance', 2, true);
		this.shark.scale.x = 0.5;
		this.shark.scale.y = 0.5;
		this.shark.visible = false;

		this.playerBlock = this.game.add.sprite(this.width/2, (this.height/2) - 30, 'block');
		this.playerBlock.anchor.set(0.5, 0.5);
		// this.playerBlock.scale.x = 0.5;
		// this.playerBlock.scale.y = 0.5;
		this.playerBlock.visible = false;
		this.game.add.tween(this.playerBlock.scale).to({x: 0.25, y: 0.25}, 300, Phaser.Easing.Linear.None, true, 0, 90, true).start();

		this.logo = this.add.button(this.width - 10, this.height - 10, 'logo', this.decigames);
		this.logo.scale.x = 0.25;
		this.logo.scale.y = 0.25;
		this.logo.anchor.set(1,1);

		this.txt2 = "Press SPACEBAR to Begin!"

		this.txtTop = this.game.add.text(this.width/2, 30, "", {font: "40px Arial", fill: '#fff' });
		this.txtTop.anchor.set(0.5, 0.5);
		this.txtStart = this.game.add.text(this.width/2, this.height - 90, this.txt2, {font: "26px Arial", fill: '#fff' });
		this.txtStart.anchor.set(0.5, 0.5);
	},
	
	update: function(){
		if(this.blockGame){
			this.blockMode();
		}else{
			this.sharkMode();
		}

		this.leftPress = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightPress = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		this.leftPress.onDown.add(this.switchMode, this);
		this.rightPress.onDown.add(this.switchMode, this);
	},

	switchMode: function(){
		if(this.blockGame){
			this.playerBlock.kill();
			this.blockGame = false;			
		}else{
			this.shark.kill();
			this.blockGame = true;
			this
		}
	},

	sharkMode: function(){
		this.game.stage.backgroundColor = '#99d9ea';
		this.shark.visible = true;
		this.shark.animations.play('dance', 2, true);
		this.txt1 = "< LEFT-SHARK >";
		this.txtTop.setText(this.txt1);

		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.pointer1.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_A)){
			this.game.state.start('Game');
		}
	},

	blockMode: function(){
		this.game.stage.backgroundColor = '#2f2f2f';		
		this.playerBlock.visible = true;
		this.txt1 = "< LEFT-BLOCK >";
		this.txtTop.setText(this.txt1);

		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.pointer1.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_A)){
			this.game.state.start('Block');
		}
	},

	decigames: function(){
		this.url = "http://www.decigames.co.uk";
		window.open(this.url, '_blank');
	}
};