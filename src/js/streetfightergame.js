//TODO: 
//1) Jump Mechanics: https://phaser.io/examples/v2/arcade-physics/platformer-basics
var game = new Phaser.Game(621, 224, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function render() {

    game.debug.body(playerKen);
    game.debug.body(enemyBison);
    if (bullet != null) {
        game.debug.body(bullet);
    }
   


}

function preload() {

    game.load.spritesheet('kennewsprites', 'src/sprites/kennewsprites.png', 76, 101, 63);
    game.load.spritesheet('mbisonsprites', 'src/sprites/mbisonspritesheet.png', 65, 95, 48);
    game.load.image('blankaLevel', 'src/sprites/sf2ww-blanka.gif');
    game.load.image('bisonEnemy', 'src/sprites/bison enemy.png');
    game.load.image('hadouken', 'src/sprites/hadouken.png');

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
var kenRecovery;
var kenHadouken;

var bisonAttacking;
var bisonIdle;
var bisonBlocking;

//Enemy Code:
var enemyBison;

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

//Input History: 
var inputString;
var lastLeftInput;
var lastRightInput;
var lastDownInput;
var lastLightPunchInput;
var lastMediumPunchInput;

//fireball:
var bullets;
var bullet;
var nextShot;


function create() {
    nextShot = 0;
    inputString = "";

    healthKen = 100;
    healthBison = 100;

    kenIdle = true;
    kenAttacking = false;
    kenBlocking = false;
    kenHadouken = false;

    bisonIdle = true;
    bisonAttacking = false;
    bisonBlocking = false;

    standingHitBoxWidthKen = 30;
    standingHitBoxHeightKen = 60;
    lightPunchWidthKen = 40;
    mediumPunchWidthKen = 60;

    standingHitBoxWidthBison = 30;
    standingHitBoxHeightBison = 60;
    lightPunchWidthBison = 60;
    mediumPunchWidhBison = 60;


    renderSprites();
    playerKenSpritesLoad();
    enemyBisonSpritesLoad();
    inputDeclarations();


    bullets = game.add.group();

    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'hadouken', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    //console.log(bullets);
    //



    game.physics.startSystem(Phaser.Physics.ARCADE); //game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.arcade.enable([playerKen, enemyBison], Phaser.Physics.ARCADE, true);
    playerKen.body.setSize(standingHitBoxWidthKen, standingHitBoxHeightKen);
    enemyBison.body.setSize(standingHitBoxWidthBison, standingHitBoxHeightBison, 20);

}




function hitEnemy(body1, body2) {

    if (body1.key == "hadouken") {
        body1.destroy();
        healthBison = healthBison - body1.damage;
    }

    if (kenAttacking) {
        healthBison = healthBison - body1.damage;
        console.log('Bison Health: ' + healthBison);
    }


    if (bisonAttacking) {
        healthKen = healthKen - body2.damage;
        console.log('Ken Health: ' + healthKen);
    } else {
        enemyBison.body.velocity.x = 0;
    }



    if (healthBison <= 0) {
        console.log('died');
        enemyBison.destroy();
    }

    if (healthKen <= 0) {
        playerKen.destroy();

    }


}

var hadoukenSprite;

function renderSprites() {


    backgroundImage = game.add.image(0, 0, 'blankaLevel');
    backgroundImage.smoothed = false;
    enemyBison = game.add.sprite(500, YValueBlankaLevel, 'mbisonsprites');
    playerKen = game.add.sprite(300, YValueBlankaLevel, 'kennewsprites');
    //  hadoukenSprite = game.add.image(300, YValueBlankaLevel, 'hadouken');

}

function playerKenSpritesLoad() {
    //Standing:
    playerKen.animations.add('standing', [0, 1, 2, 3]);
    playerKen.animations.add('walkingforward', [4, 5, 6]);
    playerKen.animations.add('walkingbackward', [8, 9, 10, 11, 12, 13]);

    //Standing Punches:
    playerKen.animations.add('standingLightPunch', [25, 26, 27]);
    playerKen.animations.add('standingMediumPunch', [27, 28, 29, 30]);
    playerKen.animations.add('standingFiercePunch', [31, 32, 33, 34, 35]);

    //jump: 
    playerKen.animations.add('neutralJump', [36, 37, 38, 39]);


    //hadouken
    playerKen.animations.add('hadouken', [42, 43, 44, 45, 44, 43, 42]);


    //light kick:
    playerKen.animations.add('standingLightKick', [46, 47, 48, 49]);
    playerKen.animations.add('standingMediumKick', [50, 51, 52, 53, 54]);
    playerKen.animations.add('standingFierceKick', [55, 56, 57, 58, 59, 60]);

    //got hit standing
    playerKen.animations.add('gotHitStanding', [61, 62, 63]);


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
    console.log(playerKen.animations.currentAnim.frame);
    inputHandlers();
    enemyAI();
    inputTracker();
    // specialMovesTracker();

}

function inputTracker() {
    if (cursors.left.downDuration(1)) {
        inputString += "L";
    } else if (cursors.right.downDuration(1)) {
        inputString += "R";
    } else if (cursors.down.downDuration(1)) {
        inputString += "D";
    } else if (mediumPunchInput.downDuration(1)) {
        inputString += "[MP]";
    } else if (lightPunchInput.downDuration(1)) {
        inputString += "[LP]";
    }

}


function shootHadouken() {

    if (bullets.countLiving() == 0) //Only one hadouken on the screen at a time.
    {

        //getFirstExists(exists, createIfNull, x, y, key, frame) 
        //If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
        bullet = bullets.getFirstExists(false);
        console.log('bullet');
        console.log(bullet);
        bullet.damage = 0.7;
        bullet.body.setCircle(23, 10, 5);
        bullet.reset(playerKen.position.x + playerKen.width, playerKen.position.y);

        kenHadouken = true;
        kenAttacking = true;
        playerKen.body.velocity.x = 0;
        playerKen.animations.play('hadouken', 10, false).onComplete.add(function () {
            kenHadouken = false;
            kenAttacking = false;
            playerKen.body.setSize(standingHitBoxWidthKen, standingHitBoxHeightKen);
            playerKen.body.velocity.x = 0;
            playerKen.animations.play('standing', 7, true);
            inputString = "";
            playerKen.body.static = false;

        }, this);


        game.physics.arcade.moveToObject(bullet, enemyBison, 200);

    }

}

function specialMovesTracker() {
    if (inputString.includes("DR[LP]")) {
        if ((lastLightPunchInput - lastDownInput) < 0.44425) {
            shootHadouken();
        } else {
            inputString = "";
            //    console.log('Do not do hadouken, users inputs are too slow.');
        }
    } else if (inputString.includes("DRD[LP]")) //Shoryuken (Dragon Punch)
    {
        if ((lastDownInput - lastLightPunchInput) < 1.5) {
            //console.log('shoryuken');
            inputString = "";
        }
    } else {
        // console.log("No Special moves detected.");
    }
}

function bisonStanding() {
    enemyBison.damage = 0;
    if (!bisonAttacking) {
        enemyBison.body.velocity.x = 0;
        enemyBison.animations.play('standing', 7, true);
        enemyBison.body.setSize(standingHitBoxWidthBison, standingHitBoxHeightBison);
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
    enemyBison.damage = 0.3;
    enemyBison.body.setSize(lightPunchWidthBison, standingHitBoxHeightBison, -20);

    enemyBison.body.velocity.x = 0;


    bisonAttacking = true;
    enemyBison.animations.play('standingLightPunch', 10, false).onComplete.add(function () {
        console.log('the reset');
        enemyBison.body.setSize(standingHitBoxWidthBison, standingHitBoxHeightBison, 0);
        bisonAttacking = false;
        enemyBison.body.velocity.x = 0;
        enemyBison.animations.play('standing', 7, true);
        enemyBison.body.static = false;

    }, this);
}


function enemyAI() {


    //Note: Leave this uncommented, this is the collision detection. 
    var isColliding = game.physics.arcade.collide(playerKen, enemyBison, hitEnemy, null, this);
    var hadoukenColliding = game.physics.arcade.collide(bullet, enemyBison, hitEnemy, null, this);
    //console.log(hadoukenColliding);
    //  var isCollidingHadouken = game.physics.arcade.collide(hadoukenSprite, enemyBison, hitEnemy, null, this);

    //   console.log(Phaser.Rectangle.intersects(playerKen.position, enemyBison.position));
    // if (!(Phaser.Rectangle.intersects(playerKen, enemyBison))) {
    //if (!(isColliding)){
    //    bisonWalkingForward();      
    //}
    //else
    //    {
    //        bisonLightPunch();

    //    }

}




function inputHandlers() {

    //TODO: Neutral jump:
    //   playerKen.body.velocity.y = -50;
    //    playerKen.animations.play('neutralJump', 7, false);

    if (cursors.left.isDown && cursors.down.isUp) {
        lastLeftInput = this.game.time.totalElapsedSeconds();
        walkLeft();
    } else if (cursors.right.isDown) {
        lastRightInput = this.game.time.totalElapsedSeconds();
        walkRight();

    } else if (cursors.down.isDown) {
        lastDownInput = this.game.time.totalElapsedSeconds();
        crouch();
    } else if (mediumPunchInput.isDown) {
        lastMediumPunchInput = this.game.time.totalElapsedSeconds();
        standingHits(3, mediumPunchWidthKen, standingHitBoxHeightKen, 0, 0, 'standingMediumPunch', 10);
    } else if (lightPunchInput.isDown) {
        if (inputString.includes("DR[LP]")) {
            if ((lastLightPunchInput - lastDownInput) < 0.44425) {
                console.log('hadouken');
                shootHadouken();
            } else {
                inputString = "";
            }
        } else {
            lastLightPunchInput = this.game.time.totalElapsedSeconds();
            standingHits(3, lightPunchWidthKen, standingHitBoxHeightKen, 0, 0, 'standingLightPunch', 7);
            console.log('punch');
        }
    } else if (fiercePunchInput.isDown) {

    } else if (lightKickInput.isDown) {
        standingHits(5, 60, 60, 0, 0, 'standingLightKick', 12);
    } else if (mediumKickInput.isDown) {
        standingHits(5, 60, 60, 0, 0, 'standingMediumKick', 12);
    } else if (fierceKickInput.isDown) {
        standingHits(5, 65, 60, 0, 0, 'standingFierceKick', 15);
    } else {
        standing();
    }
}


function standing() {
    playerKen.damage = 0;
    if (!kenAttacking) {
        playerKen.body.velocity.x = 0;
        playerKen.animations.play('standing', 7, true);
    }
}

function walkLeft() {
    if (!kenAttacking) {
        playerKen.body.velocity.x = -100;
        playerKen.animations.play('walkingbackward', 7, true);
    }
}

function walkRight() {
    if (!kenAttacking) {
        console.log('walkingforward');
        kenIdle = false;
        playerKen.body.velocity.x = 100;
        playerKen.animations.play('walkingforward', 7, true);
    }
}

function crouch() {
    if (cursors.left.isDown) {
        kenIdle = true;
        kenBlocking = true;
        playerKen.animations.play('crouching', 7, true);
        playerKen.body.velocity.x = 0;
    } else {
        if (!kenAttacking && !kenHadouken) {
            kenIdle = true;
            playerKen.animations.play('crouching', 7, true);
            playerKen.body.velocity.x = 0;
        }
    }
}


function standingHits(damage, hitboxWidth, hitboxHeight, offsetX, offsetY, animationPlayString, frameRate) {
    playerKen.damage = damage;
    playerKen.body.setSize(hitboxWidth, hitboxHeight); //Increase the hitbox.
    playerKen.body.velocity.x = 0;
    playerKen.body.static = true;
    kenAttacking = true;
    playerKen.animations.play(animationPlayString, frameRate, false).onComplete.add(function () {
        playerKen.body.setSize(standingHitBoxWidthKen, standingHitBoxHeightKen);
        kenAttacking = false;
        playerKen.body.velocity.x = 0;
        playerKen.animations.play('standing', 7, true);
        playerKen.body.static = false;
    }, this);

}