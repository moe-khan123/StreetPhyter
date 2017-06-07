var game = new Phaser.Game(621, 224, Phaser.CANVAS, 'phaser-example',
{
    preload: preload,
    create: create,
    update: update,
    render: render
});


function render() {


  //  game.debug.spriteBounds(playerKen);

}

function preload()
{

    game.load.spritesheet('kennewsprites', 'src/sprites/kennewsprites.png', 76, 101, 48);
    game.load.image('blankaLevel', 'src/sprites/sf2ww-blanka.gif');

    game.load.image('bisonEnemy', 'src/sprites/bison enemy.png');
}

var backgroundImage;


var playerKen;
var kenWalkingForward;
var kenWalkingBackward;
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
var attacking;
var idle;
var walking;
var blocking;

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


function create()
{
  

    idle = true;
    attacking = false;
    blocking = false;
  
    
    renderSprites();
    playerKenSpritesLoad();
    inputDeclarations();

 

    game.physics.startSystem(Phaser.Physics.P2JS);
 

    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0.8;


    //  Create our collision groups. One for the player, one for the pandas
     kenCollisionGroup = game.physics.p2.createCollisionGroup();
     mBisonCollisionGroup = game.physics.p2.createCollisionGroup();

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    game.physics.p2.updateBoundsCollisionGroup();

    
    game.physics.p2.enable(playerKen, true); //set to false if i want to get rid of the hitbox. 
    playerKen.body.setRectangle(35, 80, -18);  
    //playerKen.body.setSize(35, 80, -18);  
    playerKen.body.fixedRotation = true;
    playerKen.body.setCollisionGroup(kenCollisionGroup);

    //  Ken will collide with the enemy, and when it strikes one the hitPanda callback will fire, causing it to alpha out a bit
    //  When enemy collide with each other, nothing happens to them.
    playerKen.body.collides(mBisonCollisionGroup, hitEnemy, this);





    game.physics.p2.enable(enemyBison, true); //set to false if i want to get rid of the hitbox. 

    //  Tell the enemy to use the mBisonCollisionGroup
    enemyBison.body.setCollisionGroup(mBisonCollisionGroup);  
    enemyBison.body.collides([mBisonCollisionGroup, kenCollisionGroup]);


  

    //Arcade Physics.

        //game.physics.arcade.enable(playerKen);
    //playerKen.body.bounce.y = 0.2;
    //playerKen.body.gravity.y = 300;
    //playerKen.body.collideWorldBounds = true;


  
  
   



}





function consolething()
{
    console.log('consolething');
}


function hitEnemy(body1, body2) {
    console.log('hit');
}

function renderSprites() {


    backgroundImage = game.add.image(0, 0, 'blankaLevel');
    backgroundImage.smoothed = false;
    enemyBison = game.add.sprite(500, YValueBlankaLevel, 'bisonEnemy');
    playerKen = game.add.sprite(300, YValueBlankaLevel, 'kennewsprites');
    
}

function playerKenSpritesLoad()
{
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


function inputDeclarations()
{
    cursors = game.input.keyboard.createCursorKeys();
    lightPunchInput = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    mediumPunchInput = game.input.keyboard.addKey(Phaser.Keyboard.W);
    fiercePunchInput = game.input.keyboard.addKey(Phaser.Keyboard.E);
    lightKickInput = game.input.keyboard.addKey(Phaser.Keyboard.A);
    mediumKickInput = game.input.keyboard.addKey(Phaser.Keyboard.S);
    fierceKickInput = game.input.keyboard.addKey(Phaser.Keyboard.D);


}


function update()
{


   
    inputHandlers();



}



function inputHandlers() {


    //TODO: Neutral jump:
    //   playerKen.body.velocity.y = -50;
    //    playerKen.animations.play('neutralJump', 7, false);

    if (cursors.left.isDown && cursors.down.isUp) {

        if (!attacking) {
            console.log('left');
            playerKen.body.velocity.x = -100;
            playerKen.animations.play('walkingbackward', 7, true);
        }
    }
    else if (cursors.right.isDown) {
        if (!attacking) {
            console.log('right');
            idle = false;

            playerKen.body.velocity.x = 100;
            playerKen.animations.play('walkingforward', 7, true);
        }
    }
    else if (cursors.down.isDown) {
        if (cursors.left.isDown) {
            idle = true;
            blocking = true;
            console.log('crouch block');
            playerKen.animations.play('crouching', 7, true);
            playerKen.body.velocity.x = 0;
        }
        else {
            if (!attacking)
                {
            idle = true; //idle is true whether u are crouching down or letting go of the key
            console.log('down');
            playerKen.animations.play('crouching', 7, true);
            playerKen.body.velocity.x = 0;
            }
        }

    }
    else if (mediumPunchInput.isDown) {       
        playerKen.body.setRectangle(85, 80, -18); //Increase the hitbox.
        
        //IMPORTANT: Whenever re setting the rectangle, must call setCollionGroup
        playerKen.body.setCollisionGroup(kenCollisionGroup);
        playerKen.body.collides(mBisonCollisionGroup, hitEnemy, this);


        console.log(game.physics.p2.boundsCollisionGroup);
        playerKen.body.velocity.x = 0;
        console.log('medium');
        attacking = true;
        kenAnimation = playerKen.animations.play('standingMediumPunch', 10, false).onComplete.add(function () {
            //reset the graphics back
            playerKen.body.setRectangle(35, 80, -18);  
            playerKen.body.setCollisionGroup(kenCollisionGroup);
            playerKen.body.collides(mBisonCollisionGroup, hitEnemy, this);

            playerKen.body.velocity.x = 0;
            attacking = false;
            console.log('punching');
        }, this);

    }
    else if (lightPunchInput.isDown) {
        playerKen.body.velocity.x = 0;
        console.log('light');
        attacking = true;
        playerKen.animations.play('standingLightPunch', 7, false).onComplete.add(function () {
            attacking = false;
            playerKen.body.velocity.x = 0;
            playerKen.animations.play('standing', 7, true);
            console.log('inside oncomplete lightpunch')
        }, this);
    }
    else {
        if (!attacking) {
           
            playerKen.body.velocity.x = 0;
            playerKen.animations.play('standing', 7, true);
            console.log('standing');
          
        }
    }


}




/*

//HITBOXES:

function create() {
    // make the player  
    player = game.add.sprite(0, 0, 'mario');
    // create a group for all the player's hitboxes    
    hitboxes = game.add.group();
    // give all the hitboxes a physics body (I'm using arcade physics btw)    
    hitboxes.enableBody = true;
    // make the hitboxes children of the player. They will now move with the player   
    player.addChild(hitboxes);
    // create a "hitbox" (really just an empty sprite with a physics body)   
    var hitbox1 = hitboxes.create(0, 0, null);
    // set the size of the hitbox, and its position relative to the player   
    hitbox1.body.setSize(50, 50, player.width, player.height / 2);
    // add some properties to the hitbox. These can be accessed later for use in calculations   
    hitbox1.name = "punch";
    hitbox1.damage = 50;
    hitbox1.knockbackDirection = 0.5;
    hitbox1.knockbackAmt = 600;
}
// activate a hitbox by name
function enableHitbox(hitboxName) {
    // search all the hitboxes  
    for (var i = 0; i < hitboxes.children.length; i++) {
        // if we find the hitbox with the "name" specified  
        if (hitboxes.children[i].name === hitboxName) {
            // reset it      
            hitboxes.children[i].reset(0, 0);
        }
    }
}
// disable all active hitboxes
function disableAllHitboxes() {
    hitboxes.forEachExists(function(hitbox) {
        hitbox.kill();
    });
}

*/