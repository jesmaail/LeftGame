// Created By Joseph Shihab Esmaail
Scene.Game = function(game) { };
Scene.Game.prototype = {	

	create: function() {
		this.scale = 0.5;
		this.width = 400;
		this.height = 400;
		this.bound = 40;
		this.boundX = this.width - this.bound;
		this.boundY = this.height - this.bound;
		this.score = 0;
		this.speed = 250;
		this.buoySpeed = 50;
		this.buoyLimit = 1;
		this.tapBuffer = 150;
		this.lastTapped = this.game.time.now;
		this.danceTimer = 0;
		this.danceBuffer = 500;
		this.streamTimer = 0;
		this.rescued = false;
		this.rescueTimer = 0;

		//this.txtScore = this.game.add.text((this.boundX+this.bound/2), this.bound/2, this.score , {font: "22px Arial", fill: '#fff' });
		//this.txtScore.anchor.set(1, 0);
		this.txt = "Press SPACEBAR to turn"
		this.txtScore = this.game.add.text(this.width/2, this.height/2, this.score , {font: "80px Arial", fill: '#fff' });
		this.txtScore.anchor.set(0.5, 0.5);
		this.txtControls = this.game.add.text(this.width/2, (this.height/2)+50, this.txt, {font: "12px Arial", fill: '#fff' });
		this.txtControls.anchor.set(0.5, 0.5);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;
		this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

		this.game.stage.backgroundColor = '#99d9ea';
		this.facing = "right";
		this.spawnPlayer();
		this.spawnFood();
		
		this.buoys = this.game.add.group();
		this.streams = this.game.add.group();
		this.leftovers = this.game.add.group();

		this.leftShark = this.game.add.sprite(this.width/2, this.height/2, 'dance');
		this.leftShark.anchor.set(0.5, 0.5);
		this.leftShark.animations.add('dance', [0,1,2]);
		this.leftShark.visible = false;
	},	
	
	update: function(){ 
		this.txtScore.setText(this.score);
		this.leftShark.bringToTop();		
		this.controls();
		
		if(this.buoys.countLiving() < this.buoyLimit){
			this.spawnBuoy();
		}

		if(this.score > 0 && this.score % 10 == 0){
			this.dance();
		}

		if(this.game.time.now > this.danceTimer){
			this.leftShark.visible = false;
		}

		if(this.streamTimer < this.game.time.now){
			this.spawnStream();
			this.streamTimer = this.game.time.now + 10;
		}
		
		if(this.rescued && this.rescueTimer < this.game.time.now){
			this.spawnFood();
			this.rescued = false;
		}
		this.collisionDetection();
	},

	collisionDetection: function(){	
		this.left = this.shark.body.x <=0;
		this.right = (this.shark.body.x+this.shark.body.width) >= this.width;
		this.up = this.shark.body.y <= 0;
		this.down = (this.shark.body.y + this.shark.body.height) >= this.height;

		this.game.physics.arcade.overlap(this.shark, this.food, this.nom, null, this);
		this.game.physics.arcade.overlap(this.shark, this.buoys, this.die, null, this);
		this.game.physics.arcade.overlap(this.buoys, this.food, this.rescue, null, this);
		this.buoys.forEachAlive(this.buoyHandler, this);

		if(this.left || this.right || this.up || this.down){
			this.die(this.shark, this.shark);
		}
	},

	spawnPlayer: function(){
		this.shark = this.game.add.sprite(200, 200, 'shark');
		this.game.physics.enable(this.shark, Phaser.Physics.ARCADE);
		this.shark.scale.x = this.scale;
		this.shark.scale.y = this.scale;
		this.shark.body.collideWorldBounds = true;
		this.shark.body.velocity.x = this.speed;
		this.shark.animations.add('right', [0]);
		this.shark.animations.add('up', [1]);
		this.shark.animations.add('down', [2]);
		this.shark.animations.add('left', [3]);
	},

	spawnFood: function(){
		this.x = this.game.rnd.integerInRange(this.bound, this.boundX);
		this.y = this.game.rnd.integerInRange(this.bound, this.boundY);
		this.food = this.game.add.sprite(this.x, this.y, 'food');
		this.food.anchor.set(0.5, 0.5);
		this.game.physics.enable(this.food, Phaser.Physics.ARCADE);
		this.food.scale.x = this.scale;
		this.food.scale.y = this.scale;
		this.food.animations.add('bob', [0, 1]);
		this.food.animations.play('bob', 2, true);
	},

	spawnBuoy: function(){
		this.y = Math.random() *(this.height);
		this.buoy = this.buoys.create(-50, this.y, 'buoy');
		this.buoy.anchor.set(0.5, 0.5);
		this.game.physics.enable(this.buoy, Phaser.Physics.ARCADE);
		this.buoy.body.velocity.x = this.buoySpeed;
		this.buoy.scale.x = this.scale;
		this.buoy.scale.y = this.scale;
		this.buoy.animations.add('bob', [0,1,2,1]);
		this.buoy.animations.add('rescue', [3]);
		this.buoy.animations.play('bob', 2, true);
	},

	buoyHandler: function(object){
		if(object.body.x > this.width + 50){
			object.kill();
		}
	},

	spawnStream: function(){	

		if(this.facing=="left"){
			this.x = (this.shark.body.x) + 5;
			this.y = (this.shark.body.y + this.shark.body.height) - 2;

			this.stream = this.streams.create(this.x, this.y, 'stream');
			this.stream.animations.add('left', [3]);
			this.stream.animations.play('left', 1, true);

		}else if(this.facing=="down"){
			this.x = (this.shark.body.x + this.shark.body.width/2);
			this.y = (this.shark.body.y + this.shark.body.height/2);
			this.stream = this.streams.create(this.x, this.y, 'stream');
			this.stream.animations.add('down', [2]);
			this.stream.animations.play('down', 1, true);

		}else if(this.facing=="right"){
			this.x = (this.shark.body.x + this.shark.body.width) - 5;
			this.y = (this.shark.body.y + this.shark.body.height) - 2;

			this.stream = this.streams.create(this.x, this.y, 'stream');
			this.stream.animations.add('right', [1]);
			this.stream.animations.play('right', 1, true);

		}else{
			this.x = (this.shark.body.x + this.shark.body.width/2);
			this.y = (this.shark.body.y + this.shark.body.height/2);
			this.stream = this.streams.create(this.x, this.y, 'stream');
			this.stream.animations.add('up', [0]);
			this.stream.animations.play('up', 1, true);
		}

		this.stream.scale.x = this.scale;
		this.stream.scale.y = this.scale;
		this.stream.anchor.set(0.5, 0.5);
		this.stream.lifespan = 500;

		this.streams.forEachAlive(this.groupToTop, this);
		this.buoys.forEachAlive(this.groupToTop, this);
		this.shark.bringToTop();
		this.leftShark.bringToTop();

	},

	groupToTop: function(object){
		object.bringToTop();
	},

	dance: function(){
		this.leftShark.visible = true;
		this.leftShark.animations.play('dance', 2);
		this.leftShark.bringToTop();
		this.danceTimer = this.game.time.now + this.danceBuffer;
	},

	nom: function(player, food){
		this.txtControls.visible = false;		
		this.leftover = this.leftovers.create(food.body.x, food.body.y, 'leftovers');
		this.leftover.anchor.set(0.5, 0.5);
		this.leftover.lifespan = 1500;
		food.kill();
		this.score++;
		this.speed += 5;
		this.buoySpeed +=5;

		if(this.score % 10 ==0  && this.buoyLimit < 5){
			this.buoyLimit ++;
		}
		this.spawnFood();
	},

	die: function(player, killer){
		player.kill();
		this.game.state.start('Death');
	},

	rescue: function(food, buoy){
		buoy.animations.play('rescue', 1);
		food.kill();
		this.rescued = true;
		this.rescueTimer = this.game.time.now + 3000;
	},

	turn: function(){		
		 this.lastTapped = this.game.time.now + this.tapBuffer;

		if(this.facing=="left"){
			this.facing = "down";
			this.shark.body.velocity.x = 0;
			this.shark.body.velocity.y = this.speed;
			this.shark.animations.play('down', 1);

		}else if(this.facing=="down"){
			this.facing = "right";
			this.shark.body.velocity.x = this.speed;
			this.shark.body.velocity.y = 0;
			this.shark.animations.play('right', 1);

		}else if(this.facing=="right"){
			this.facing = "up";
			this.shark.body.velocity.x = 0;
			this.shark.body.velocity.y = -this.speed;
			this.shark.animations.play('up', 1);

		}else{
			this.facing = "left";
			this.shark.body.velocity.x = -this.speed;
			this.shark.body.velocity.y = 0;
			this.shark.animations.play('left', 1);
		}
	},
		
	controls: function(){
		this.spacePress = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.spacePress.onDown.add(this.turn, this);
		if(this.lastTapped < this.game.time.now){
			if(this.game.input.pointer1.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_A)){
				this.turn();
			}
		}
	}
	
};