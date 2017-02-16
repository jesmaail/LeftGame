Scene.BlockDeath = function (game){};

Scene.BlockDeath.prototype = {
	create: function(){	
		this.width = 400;
		this.height = 400;	
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.gamepad.start();
		this.pad1 = this.game.input.gamepad.pad1;

		this.bufferTimer = this.game.time.now + 1500;
		this.points = this.game.state.states['Block'].score;
		this.txt1 = "OH BUOY,";
		this.txt11 = "THAT MUST HAVE HURT!";
		this.txt2 = "You Scored";
		if(this.points == 1){
			this.txt3 = "Point";
		}else{
			this.txt3 = "Points";
		}		
		this.txt4 = "Press SPACEBAR to reset";

		this.txtTop = this.game.add.text(this.width/2, 30, this.txt1, {font: "26px Arial", fill: '#f00' });
		this.txtTop.anchor.set(0.5, 0.5);
		this.txtTop2 = this.game.add.text(this.width/2, 60, this.txt11, {font: "26px Arial", fill: '#f00' });
		this.txtTop2.anchor.set(0.5, 0.5);
		this.txtStart = this.game.add.text(this.width/2, 120, this.txt4, {font: "22px Arial", fill: '#fff' });
		this.txtStart.anchor.set(0.5, 0.5);
		this.txtStart.visible = false;

		this.txtYou = this.game.add.text(this.width/2 - 90, (this.height/2), this.txt2, {font: "18px Arial", fill: '#fff' });
		this.txtYou.anchor.set(0.5, 0.5);
		this.txtScore = this.game.add.text(this.width/2, (this.height/2), ""+this.points , {font: "80px Arial", fill: '#fff' });
		this.txtScore.anchor.set(0.5, 0.5);		
		this.txtPoints = this.game.add.text(this.width/2 + 80, (this.height/2), this.txt3, {font: "18px Arial", fill: '#fff' });
		this.txtPoints.anchor.set(0.5, 0.5);


		this.txtShare = this.game.add.text(10, (this.height - 100), "Share your score!",{font:"bold 18px Courier New", fill:'#fff'});
		this.txtShare.anchor.set(0, 1);

		this.fb = this.add.button(40, (this.height - 50), 'fb', this.facebook, this);
		this.fb.anchor.set(0, 1);
		this.twit = this.add.button(100, (this.height - 50), 'twitter', this.twitter, this);
		this.twit.anchor.set(0, 1);


		this.logo = this.add.button(this.width - 10, this.height - 10, 'logo', this.decigames, this);
		this.logo.scale.x = 0.25;
		this.logo.scale.y = 0.25;
		this.logo.anchor.set(1,1);
	},
	
	update: function(){
		if(this.bufferTimer <  this.game.time.now){
			this.reset();
		}
	},

	reset: function(){
		this.txtStart.visible = true;
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.pointer1.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_A)){
			this.game.state.start('Preloader');
		}	
	},

	facebook: function(){
		this.url = "http://www.facebook.com/sharer/sharer.php?u=http://decigames.co.uk/leftshark/";
		window.open(this.url, '_blank');
	},

	twitter: function(){
		this.url = "https://twitter.com/intent/tweet?text=I%20scored%20"+ this.game.state.states['Game'].score +"%20points%20in%20the%20Left%20Shark,%20Can%20you%20do%20better?%0Ahttp://decigames.co.uk/leftshark/%20%23DeciGames";
		window.open(this.url, '_blank');
	},

	decigames: function(){
		this.url = "http://www.decigames.co.uk";
		window.open(this.url, '_blank');
	}
};