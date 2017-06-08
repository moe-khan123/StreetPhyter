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
var healthKen ;
var healthBison ;

function create()
{
    healthKen = 100;
     healthBison = 100;
     console.log(healthBison);
   

    kenIdle = true;
    kenAttacking = false;
    kenBlocking = false;


    bisonIdle = true;
    bisonAttacking = false;
    bisonBlocking = false;


  
    
    renderSprites();
    playerKenSpritesLoad();
    enemyBisonSpritesLoad();
    inputDeclarations();

 

    game.physics.startSystem(Phaser.Physics.P2JS);
 

    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0.8;


    //  Create our collision groups. One for the player, one for the enemy
     kenCollisionGroup = game.physics.p2.createCollisionGroup();
     mBisonCollisionGroup = game.physics.p2.createCollisionGroup();

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    game.physics.p2.updateBoundsCollisionGroup();

    
    game.physics.p2.enable(playerKen, true); //set to false if i want to get rid of the hitbox. 
    playerKen.body.setRectangle(20, 80, -15);

     playerKen.body.fixedRotation = true;
    
     
    playerKen.body.fixedRotation = true;
    playerKen.body.setCollisionGroup(kenCollisionGroup);

    //  Ken will collide with the enemy, and when it strikes one the hitPanda callback will fire, causing it to alpha out a bit
    //  When enemy collide with each other, nothing happens to them.
     playerKen.body.collides(mBisonCollisionGroup, hitEnemy, this);





    game.physics.p2.enable(enemyBison, true); //set to false if i want to get rid of the hitbox. 

    //  Tell the enemy to use the mBisonCollisionGroup
    enemyBison.body.setRectangle(40, 40, -15);  
    //enemyBison.body.kinematic = true;
   enemyBison.body.setCollisionGroup(mBisonCollisionGroup);  
   enemyBison.body.collides([mBisonCollisionGroup, kenCollisionGroup]);
   enemyBison.body.fixedRotation = true;
   



}




function hitEnemy(body1, body2) {  


    if (kenAttacking)
        {
    healthBison = healthBison - body1.sprite.damage;
    console.log('Bison Health: ' + healthBison);
    }


    if (bisonAttacking)
    {
        healthKen = healthKen - body2.sprite.damage;
        console.log('Ken Health: ' + healthKen);
    }



    if (healthBison <= 0)
    {
        console.log('died');
    }
    
   
}

function renderSprites() {


    backgroundImage = game.add.image(0, 0, 'blankaLevel');
    backgroundImage.smoothed = false;
    enemyBison = game.add.sprite(500, YValueBlankaLevel, 'mbisonsprites');
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

function enemyBisonSpritesLoad()
{
    //standing
    enemyBison.animations.add('standing', [0, 1, 2]);
    enemyBison.animations.add('walkingforward', [5, 4, 3, 6]);
    enemyBison.animations.add('walkingbackward',[4, 5, 6]);

    enemyBison.animations.add('crouching', [7]);
    enemyBison.animations.add('standingLightPunch', [8, 9, 10, 11]);
    enemyBison.animations.add('standingMediumPunch', [12,13,14,15,16,17,18,19]);


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



function bisonWalkingForward()
{
    if (!bisonAttacking) {

        //console.log(enemyBison.animations);
        enemyBison.body.velocity.x = -40;
        enemyBison.animations.play('walkingforward', 7, true);

        enemyBison.body.setRectangle(40, 40, -15);   //Increase the hitbox.
        //IMPORTANT: Whenever re setting the rectangle, must call setCollionGroup
        enemyBison.body.setCollisionGroup(mBisonCollisionGroup);
        enemyBison.body.collides(kenCollisionGroup, hitEnemy, this);
    }
}

function bisonWalkingBackward()
{
    if (!bisonAttacking) {
        enemyBison.body.velocity.x = 1000;
        enemyBison.animations.play('walkingbackward', 7, true);

        enemyBison.body.setRectangle(40, 40, -15);   //Increase the hitbox.
        //IMPORTANT: Whenever re setting the rectangle, must call setCollionGroup
        enemyBison.body.setCollisionGroup(mBisonCollisionGroup);
        enemyBison.body.collides(kenCollisionGroup, hitEnemy, this);
    }
}

function bisonLightPunch()
{
    enemyBison.damage = 1;
    enemyBison.body.setRectangle(55, 80, -18); //Increase the hitbox.
    //IMPORTANT: Whenever re setting the rectangle, must call setCollionGroup
    enemyBison.body.setCollisionGroup(mBisonCollisionGroup);
    enemyBison.body.collides(kenCollisionGroup, hitEnemy, this);

    enemyBison.body.velocity.x = 0;

    enemyBison.body.static = true;
    //console.log('light');
     bisonAttacking = true;
    enemyBison.animations.play('standingLightPunch', 10, false).onComplete.add(function () {
        //console.log('bisonPunching');
        //reset the graphics back
        enemyBison.body.setRectangle(40, 40, -15);  

        enemyBison.body.setCollisionGroup(mBisonCollisionGroup);
        enemyBison.body.collides(kenCollisionGroup, hitEnemy, this);



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

function enemyAI()
{
   



    //enemyBison.body.velocity.x = -50;

    var distanceBetweenEnemy = Math.abs(playerKen.position.x - enemyBison.position.x);
   // console.log('distance between enemy is ' + distanceBetweenEnemy);

    if (distanceBetweenEnemy > 50) {
        bisonWalkingForward();
    }
    else {
        console.log('near');   

        if (Math.floor(Math.random() * 100) + 1 > 1 && Math.floor(Math.random() * 100) + 1 <30) {
            bisonStanding();
        }
        else
        {
          

            if (consecutivePunches == 3) {
                bisonWalkingBackward();
                consecutivePunches = 0;
            }
            else
            {
                bisonLightPunch();
                console.log('punch');
                consecutivePunches++;
            }
        }


     //   bisonLightPunch();
  

        // if (!bisonAttacking) {
        //    enemyBison.body.velocity.x = 0;
        //    enemyBison.animations.play('standing', 7, true);
        //}
       
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





function standing()
{
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

function lightPunch()
{
    playerKen.damage = 1;
    playerKen.body.setRectangle(55, 80, -18); //Increase the hitbox.
    //IMPORTANT: Whenever re setting the rectangle, must call setCollionGroup
    playerKen.body.setCollisionGroup(kenCollisionGroup);
    playerKen.body.collides(mBisonCollisionGroup, hitEnemy, this);

    playerKen.body.velocity.x = 0;

    playerKen.body.static = true;
    //console.log('light');
    kenAttacking = true;
    playerKen.animations.play('standingLightPunch', 7, false).onComplete.add(function () {
        //reset the graphics back
      
        playerKen.body.setRectangle(35, 80, -18);

        playerKen.body.setCollisionGroup(kenCollisionGroup);
        playerKen.body.collides(mBisonCollisionGroup, hitEnemy, this);



        kenAttacking = false;
        playerKen.body.velocity.x = 0;
        playerKen.animations.play('standing', 7, true);
        playerKen.body.static = false;
        //console.log('inside oncomplete lightpunch')
    }, this);
}
     
function mediumPunch() {
    playerKen.damage = 3 ;
    playerKen.body.setRectangle(70, 80, -18); //Increase the hitbox.
 

    //IMPORTANT: Whenever re setting the rectangle, must call setCollionGroup
    playerKen.body.setCollisionGroup(kenCollisionGroup);
    playerKen.body.collides(mBisonCollisionGroup, hitEnemy, this);
    playerKen.body.velocity.x = 0;
    playerKen.body.static = true;

  
    //console.log('medium');
    kenAttacking = true;
    kenAnimation = playerKen.animations.play('standingMediumPunch', 10, false).onComplete.add(function () {
      
        //reset the graphics back
        playerKen.body.setRectangle(35, 80, -18);
      
        playerKen.body.setCollisionGroup(kenCollisionGroup);
        playerKen.body.collides(mBisonCollisionGroup, hitEnemy, this);
        kenAttacking = false;

        playerKen.body.velocity.x = 0;
        playerKen.animations.play('standing', 7, true);
        playerKen.body.static = false;
    
      
        //console.log('punching');
    }, this);
}


    