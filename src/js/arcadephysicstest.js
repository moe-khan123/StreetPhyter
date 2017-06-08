var game = new Phaser.Game(621, 224, Phaser.CANVAS, 'phaser-example',
    {
        preload: preload,
        create: create,
        update: update,
        render: render
    });


function render() {

    //game.debug.body(playerKen);
    //game.debug.body(enemyBison);

}

function preload() {

    game.load.spritesheet('kennewsprites', 'src/sprites/kennewsprites.png', 76, 101, 48);
    game.load.spritesheet('mbisonsprites', 'src/sprites/mbisonspritesheet.png', 65, 95, 48);
    game.load.image('blankaLevel', 'src/sprites/sf2ww-blanka.gif');
    game.load.image('bisonEnemy', 'src/sprites/bison enemy.png');

}

var backgroundImage;


var playerKen;
var YValueBlankaLevel = 140;
var cursors;

//Punches 
var lightPunchInput;
var mediumPunchInput;
var fiercePunchInput;

//Kicks
var lightKickInput;
var mediumKickInput;
var fierceKickInput;


//Player States;
var kenAttacking;
var kenIdle;
var kenBlocking;

var bisonAttacking;
var bisonIdle;
var bisonBlocking;

//Enemy Code:
var enemyBison;
var time_til_spawn;
var last_spawn_time;

//Hitbox
var hitBoxes;
var kenHitBox;
var hitbox1;

//collision groups
var kenCollisionGroup;
var mBisonCollisionGroup;


//Player health:
var healthKen;
var healthBison;


//Sizes Ken:
var standingHitBoxWidthKen;
var standingHitBoxHeightKen; 
var lightPunchWidthKen;
var mediumPunchWidthKen;

//Sizes Bison:
var standingHitBoxWidthBison;
var standingHitBoxHeightBison;
var lightPunchWidthBison;
var mediumPunchWidhBison;


function create() {
    healthKen = 100;
    healthBison = 100;
    console.log(healthBison);


    kenIdle = true;
    kenAttacking = false;
    kenBlocking = false;


    bisonIdle = true;
    bisonAttacking = false;
    bisonBlocking = false;

    standingHitBoxWidthKen= 30;
    standingHitBoxHeightKen = 60; 
    lightPunchWidthKen = 40;
    mediumPunchWidthKen = 60;

    standingHitBoxWidthBison = 30;
    standingHitBoxHeightBison = 60;
    lightPunchWidthBison = 60;
    mediumPunchWidhBison=60;


    renderSprites();
    playerKenSpritesLoad();
    enemyBisonSpritesLoad();
    inputDeclarations();



    game.physics.startSystem(Phaser.Physics.ARCADE); //game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.arcade.enable([playerKen, enemyBison], Phaser.Physics.ARCADE, true);
    playerKen.body.setSize(standingHitBoxWidthKen, standingHitBoxHeightKen);
    enemyBison.body.setSize(standingHitBoxWidthBison, standingHitBoxHeightBison);


}




function hitEnemy(body1, body2) {


    if (kenAttacking) {
        healthBison = healthBison - body1.damage;
        console.log('Bison Health: ' + healthBison);
    }


    if (bisonAttacking) {
        healthKen = healthKen - body2.damage;
        console.log('Ken Health: ' + healthKen);
    }
    else
    {
        console.log('else statement');
        enemyBison.body.velocity.x = 0;
    }



    if (healthBison <= 0) {
        console.log('died');
        enemyBison.destroy();
    }

    if (healthKen <= 0)
    {
        playerKen.destroy();

    }


}

function renderSprites() {


    backgroundImage = game.add.image(0, 0, 'blankaLevel');
    backgroundImage.smoothed = false;
    enemyBison = game.add.sprite(500, YValueBlankaLevel, 'mbisonsprites');
    playerKen = game.add.sprite(300, YValueBlankaLevel, 'kennewsprites');

}

function playerKenSpritesLoad() {
    //Standing:
    playerKen.animations.add('standing', [0, 1, 2, 3]);
    playerKen.animations.add('walkingforward', [4, 5, 6]);
    playerKen.animations.add('walkingbackward', [8, 9, 10, 11, 12, 13]);

    //Standing Punches:

    playerKen.animations.add('standingLightPunch', [25, 26, 27]);
    playerKen.animations.add('standingMediumPunch', [27, 28, 29, 30]);



    //Crouching:
    playerKen.animations.add('crouching', [14]);
    playerKen.animations.add('crouchingLightPunch', [15, 16, 17]);
    playerKen.animations.add('crouchingMediumPunch', [18, 19, 20, 21, 22, 15]);
    //TODO: add this to the sprite sheet playerKen.animations.add('crouchingFierce',)


    playerKen.animations.add('neutralJump', [36, 37, 38, 39, 40, 41, 42]);
}

function enemyBisonSpritesLoad() {
    //standing
    enemyBison.animations.add('standing', [0, 1, 2]);
    enemyBison.animations.add('walkingforward', [5, 4, 3, 6]);
    enemyBison.animations.add('walkingbackward', [4, 5, 6]);

    enemyBison.animations.add('crouching', [7]);
    enemyBison.animations.add('standingLightPunch', [8, 9, 10, 11]);
    enemyBison.animations.add('standingMediumPunch', [12, 13, 14, 15, 16, 17, 18, 19]);


}

function inputDeclarations() {
    cursors = game.input.keyboard.createCursorKeys();
    lightPunchInput = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    mediumPunchInput = game.input.keyboard.addKey(Phaser.Keyboard.W);
    fiercePunchInput = game.input.keyboard.addKey(Phaser.Keyboard.E);
    lightKickInput = game.input.keyboard.addKey(Phaser.Keyboard.A);
    mediumKickInput = game.input.keyboard.addKey(Phaser.Keyboard.S);
    fierceKickInput = game.input.keyboard.addKey(Phaser.Keyboard.D);


}


function update() {
  //  game.physics.arcade.overlap(playerKen, enemyBison, overlapHandler, null, this);
 
  
    inputHandlers();

    enemyAI();


}


function bisonStanding() {
    enemyBison.damage = 0;
    if (!bisonAttacking) {

        enemyBison.body.velocity.x = 0;
        enemyBison.animations.play('standing', 7, true);
        //console.log('standing');

    }
}



function bisonWalkingForward() {
    if (!bisonAttacking) {        
     
            game.physics.arcade.moveToObject(enemyBison, playerKen.position);
            enemyBison.animations.play('walkingforward', 7, true);
            enemyBison.body.setSize(standingHitBoxWidthBison, standingHitBoxHeightBison);

       }
}

function bisonWalkingBackward() {
    if (!bisonAttacking) {
        enemyBison.body.velocity.x = 1000;
        enemyBison.animations.play('walkingbackward', 7, true);

     
    }
}

function bisonLightPunch() {
    console.log('punching');
    enemyBison.damage = 1;
    enemyBison.body.setSize(lightPunchWidthBison, standingHitBoxHeightBison, -20);

    enemyBison.body.velocity.x = 0;
  
    //console.log('light');
    bisonAttacking = true;
    enemyBison.animations.play('standingLightPunch', 10, false).onComplete.add(function () {
        console.log('the reset');
        enemyBison.body.setSize(standingHitBoxWidthBison, standingHitBoxHeightBison,0); //Putting it back to 0 after I have changed it to -20.
        bisonAttacking = false;
        enemyBison.body.velocity.x = 0;
        enemyBison.animations.play('standing', 7, true);
        enemyBison.body.static = false;
        //console.log('inside oncomplete lightpunch')
    }, this);
}


//var time_til_spawn = Math.random() * 3000 + 2000;  //Random time between 2 and 5 seconds.
//var last_spawn_time = game.time.time;

//update() {  // This is your state's update loop
//    var current_time = game.time.time;
//    if (current_time - last_spawn_time > time_til_spawn) {
//        time_til_spawn = Math.random() * 3000 + 2000;
//        last_spawn_time = current_time;
//        spawnCustomer();
//    }
//}


var consecutivePunches = 0;

function enemyAI() {


    var isColliding = game.physics.arcade.collide(playerKen, enemyBison, hitEnemy, null, this);

 //   console.log(Phaser.Rectangle.intersects(playerKen.position, enemyBison.position));
   // if (!(Phaser.Rectangle.intersects(playerKen, enemyBison))) {
    if (!(isColliding)){
        bisonWalkingForward();      
    }
else
    {
        bisonLightPunch();
   
    }

  
 
   
}




function inputHandlers() {




    //TODO: Neutral jump:
    //   playerKen.body.velocity.y = -50;
    //    playerKen.animations.play('neutralJump', 7, false);

    if (cursors.left.isDown && cursors.down.isUp) {
        walkLeft();
    }
    else if (cursors.right.isDown) {
        walkRight();
    }
    else if (cursors.down.isDown) {
        crouch();
    }
    else if (mediumPunchInput.isDown) {
        mediumPunch();
    }
    else if (lightPunchInput.isDown) {
        lightPunch();
    }
    else {
        standing();
    }
}





function standing() {
    playerKen.damage = 0;
    if (!kenAttacking) {

        playerKen.body.velocity.x = 0;
        playerKen.animations.play('standing', 7, true);
        //console.log('standing');

    }
}

function walkLeft() {
    if (!kenAttacking) {
        //console.log('left');
        playerKen.body.velocity.x = -100;
        playerKen.animations.play('walkingbackward', 7, true);
    }
}

function walkRight() {
    if (!kenAttacking) {
        //console.log('right');
        kenIdle = false;

        playerKen.body.velocity.x = 100;
        playerKen.animations.play('walkingforward', 7, true);
    }
}

function crouch() {
    if (cursors.left.isDown) {
        kenIdle = true;
        kenBlocking = true;
        //console.log('crouch block');
        playerKen.animations.play('crouching', 7, true);
        playerKen.body.velocity.x = 0;
    }
    else {
        if (!kenAttacking) {
            kenIdle = true; //kenIdle is true whether u are crouching down or letting go of the key
            //console.log('down');
            playerKen.animations.play('crouching', 7, true);
            playerKen.body.velocity.x = 0;
        }
    }
}

function lightPunch() {
    playerKen.damage = 1;
    playerKen.body.setSize(lightPunchWidthKen, standingHitBoxHeightKen); //Increase the hitbox.
    

    playerKen.body.velocity.x = 0;

    playerKen.body.static = true;
    //console.log('light');
    kenAttacking = true;
    playerKen.animations.play('standingLightPunch', 7, false).onComplete.add(function () {
        //reset the graphics back

        playerKen.body.setSize(standingHitBoxWidthKen, standingHitBoxHeightKen);  


        kenAttacking = false;
        playerKen.body.velocity.x = 0;
        playerKen.animations.play('standing', 7, true);
        playerKen.body.static = false;
        //console.log('inside oncomplete lightpunch')
    }, this);
}

function mediumPunch() {
    playerKen.damage = 3;
    playerKen.body.setSize(mediumPunchWidthKen, standingHitBoxHeightKen); //Increase the hitbox.


 
    playerKen.body.velocity.x = 0;
    playerKen.body.static = true;


    //console.log('medium');
    kenAttacking = true;
    kenAnimation = playerKen.animations.play('standingMediumPunch', 10, false).onComplete.add(function () {

        //reset the graphics back
        playerKen.body.setSize(standingHitBoxWidthKen, standingHitBoxHeightKen);

        kenAttacking = false;

        playerKen.body.velocity.x = 0;
        playerKen.animations.play('standing', 7, true);
        playerKen.body.static = false;


        //console.log('punching');
    }, this);
}


