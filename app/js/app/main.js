var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

var flot;
var player;
var platform;
var ground;
var stars;
var sound;
var jump = -280;
var run_left = -100;
var run_right = 100;
var allStars = 50;
var allGrounds = 20;

var score = 0;
var scoreText;

var cursors;

var GameState = {
    preload: function () {
        game.load.image('ufo', 'assets/images/ufo.png');
        game.load.image('cloud', 'assets/images/cloud.png');
        game.load.image('ground', 'assets/images/ground.png');
        game.load.image('star', 'assets/images/star.png');
        game.load.spritesheet('dude', 'assets/images/dude.png', 32, 47, 9);
        game.load.audio('sound', "assets/slurp.mp3");
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: 'white' });

        sound = game.add.audio("sound",1);

        var cloud = game.add.sprite(0, 0, 'cloud');
        cloud.scale.setTo(0.8);
        cloud.x = 50;

        platform = game.add.group();
        platform.enableBody = true;

        for(var i = 0; i < allGrounds; i++){

                ground = platform.create(game.world.randomX, game.world.randomY, 'ground');
                ground.width = Math.random() * (200 - 50) + 50;
                ground.height = 15;
                ground.body.immovable = true;
        }

        ground2 = platform.create(0, game.world.height - 10, 'ground');
        ground2.width = game.world.width;
        ground2.height = 20;
        ground2.body.immovable = true;

        flot = game.add.group();
        flot.enableBody = true;
        var ufo1 = flot.create(40, 10, 'ufo');
        ufo1.body.immovable = true;
        var ufo2 = flot.create(300, 40, 'ufo');
        ufo2.body.immovable = true;
        flot.angle = 10;


        player = game.add.sprite(700, 350, 'dude');
        player.height = 50;
        player.width = 30;
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 500;
        player.body.collideWorldBounds = true;

        player.animations.add('run-left', [0, 1, 2, 3], 8, true);
        player.animations.add('run-right', [5, 6, 7, 8], 8, true);

        player.animations.add('stay', [4], 8, true);

        cursors = game.input.keyboard.createCursorKeys();

        stars = game.add.group();
        stars.enableBody = true;

        for (var i = 0; i < allStars; i++) {
            var star = stars.create(game.world.randomX + 10, game.world.randomY + 10, 'star');
            star.width = 30;
            star.height = 30;
            star.scale.setTo(Math.random() * (0.3 - 0.1) + 0.1);
            star.body.gravity.y = 200;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }


    },
    update: function () {
        game.physics.arcade.collide(player, platform);
        game.physics.arcade.collide(stars, platform);

        game.physics.arcade.overlap(player, stars, collectStar, null, this);

        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.animations.play("run-left");
            player.body.velocity.x = run_left;

        } else if (cursors.right.isDown) {
            player.animations.play("run-right");
            player.body.velocity.x = run_right;

        } else if(cursors.down.isDown) {
            if (player.height > 20) {
                player.height = 20;
                player.width = 15;
                jump += 150;
            }
        }
        else {
                player.animations.play("stay");
                player.animations.stop();
            }

        if(cursors.up.isDown){

            if(player.height < 50){

                player.height = 50;
                player.width = 30;
                player.y -= 30;
                jump -= 150;
            }
        }

        if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR) && player.body.touching.down) {
            player.body.velocity.y = jump;
        }
    }
};

function collectStar(player, star){
    jump -= 2;
    run_left -= 1;
    run_right += 1;
    sound.play();
    star.kill();

    score += 1;

    scoreText.text = "Score: "+ score;
}

game.state.add('GameState', GameState);
game.state.start('GameState');
