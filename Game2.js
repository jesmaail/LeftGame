// Created By Joseph Shihab Esmaail
Scene.BlockGame = function(game) { };
Scene.BlockGame.prototype = {	

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
		this.buoyScale = this.scale;
		this.buoyLimit = 1;
		this.tapBuffer = 150;
		this.lastTapped = this.game.time.now;
		this.streamTimer = 0;
		this.rescued = false;
		this.rescueTimer = 0;

		this.txt = "Press SPACEBAR to turn"
		this.txtScore = this.game.add.text(this.width/2, this.height/2, this.score , {font: "80px Arial", fill: '#6d6d6d' });
		this.txtScore.anchor.set(0.5, 0.5);
		this.txtControls = this.game.add.text(this.width/2, (this.height/2)+50, this.txt, {font: "12px Arial", fill: '#6d6d6d' });
		this.txtControls.anchor.set(0.5, 0.5);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;
		this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

		this.game.world.setBounds(-20, -20, this.width+20, this.height+20);
		this.game.stage.backgroundColor = '#2f2f2f';
		this.facing = "right";
		this.spawnPlayer();
		this.spawnFood();
		
		this.buoys = this.game.add.group();
		this.streams = this.game.add.group();
	},	
	
	update: function(){ 
		this.txtScore.setText(this.score);		
		this.controls();
		
		if(this.buoys.countLiving() < this.buoyLimit){
			this.spawnBuoy();			
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

	screenShake: function(){
		// this.game.add.tween(this.game.camera).to({x: -20, y: -20}, 100, Phaser.Easing.Linear.None, true, 0, 3, true).start();
		// this.game.add.tween(this.game.camera).to({x: this.width+20, y: this.height+20}, 100, Phaser.Easing.Linear.None, true, 100, 3, true).start();
		this.game.add.tween(this.game.camera).to({x: -20}, 100, Phaser.Easing.Linear.None, true, 0, 3, true).start();
		this.game.add.tween(this.game.camera).to({x: this.width+20}, 100, Phaser.Easing.Linear.None, true, 100, 3, true).start();
	},

	spawnPlayer: function(){
		this.shark = this.game.add.sprite(200, 200, 'block');
		this.shark.anchor.set(0.5, 0.5);
		this.game.physics.enable(this.shark, Phaser.Physics.ARCADE);
		this.shark.scale.x = this.scale;
		this.shark.scale.y = this.scale;
		this.shark.body.collideWorldBounds = true;
		this.shark.body.velocity.x = this.speed;

	},

	spawnFood: function(){
		this.x = this.game.rnd.integerInRange(this.bound, this.boundX);
		this.y = this.game.rnd.integerInRange(this.bound, this.boundY);
		this.food = this.game.add.sprite(this.x, this.y, 'blockFood');
		this.food.anchor.set(0.5, 0.5);
		this.game.physics.enable(this.food, Phaser.Physics.ARCADE);
		this.food.scale.x = this.scale;
		this.food.scale.y = this.scale;
		this.game.add.tween(this.food.scale).to({x: 0.25, y: 0.25}, 300, Phaser.Easing.Linear.None, true, 0, 90, true).start();
	},

	spawnBuoy: function(){
		this.y = Math.random() *(this.height);
		this.buoy = this.buoys.create(-50, this.y, 'red');
		this.buoy.anchor.set(0.5, 0.5);
		this.game.physics.enable(this.buoy, Phaser.Physics.ARCADE);
		this.buoy.body.velocity.x = this.buoySpeed;
		this.buoy.scale.x = this.buoyScale;
		this.buoy.scale.y = this.buoyScale;
	},

	buoyHandler: function(object){
		if(object.body.x > this.width + 50){
			object.kill();
		}
	},

	spawnStream: function(){	
		this.x = (this.shark.body.x + this.shark.body.width/2);
		this.y = (this.shark.body.y + this.shark.body.height/2);
		this.stream = this.streams.create(this.x, this.y, 'tail');

		this.stream.scale.x = this.scale;
		this.stream.scale.y = this.scale;
		this.stream.anchor.set(0.5, 0.5);
		this.stream.lifespan = 500;

		this.streams.forEachAlive(this.groupToTop, this);
		this.buoys.forEachAlive(this.groupToTop, this);
		this.shark.bringToTop();
	},

	groupToTop: function(object){
		object.bringToTop();
	},

	nom: function(player, food){
		this.screenShake();
		this.txtControls.visible = false;
		food.kill();
		this.score++;
		this.speed += 5;
		this.buoySpeed +=5;

		this.game.add.tween(player).to({angle: 180}, 300).start();

		if(this.score % 10 ==0  && this.buoyLimit < 5){
			this.buoyLimit ++;
		}
		this.spawnFood();
	},

	die: function(player, killer){
		player.kill();
		this.game.state.start('BlockDeath');
	},

	rescue: function(food, buoy){
		food.kill();
		this.buoyScale += 0.2;
		this.game.add.tween(buoy.scale).to({x: this.buoyScale, y: this.buoyScale}, 300, Phaser.Easing.Linear.None, true, 0, 0 , false).start();

		buoy.body.velocity.x += 50;
		this.buoySpeed += 25;
		this.rescued = true;
		this.rescueTimer = this.game.time.now + 3000;
	},

	turn: function(){		
		 this.lastTapped = this.game.time.now + this.tapBuffer;

		if(this.facing=="left"){
			this.facing = "down";
			this.shark.body.velocity.x = 0;
			this.shark.body.velocity.y = this.speed;

		}else if(this.facing=="down"){
			this.facing = "right";
			this.shark.body.velocity.x = this.speed;
			this.shark.body.velocity.y = 0;

		}else if(this.facing=="right"){
			this.facing = "up";
			this.shark.body.velocity.x = 0;
			this.shark.body.velocity.y = -this.speed;

		}else{
			this.facing = "left";
			this.shark.body.velocity.x = -this.speed;
			this.shark.body.velocity.y = 0;
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