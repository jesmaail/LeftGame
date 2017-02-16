var game = new Phaser.Game(400, 400, Phaser.CANVAS, 'game_div');

game.state.add('Boot', Scene.Boot); 
game.state.add('Preloader', Scene.Preloader);
game.state.add('Block', Scene.BlockGame);
game.state.add('BlockDeath', Scene.BlockDeath);
game.state.add('Game', Scene.Game);
game.state.add('Death', Scene.Death);
game.state.start('Boot');