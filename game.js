var game = new Phaser.Game(621 , 224, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });




function preload() {
    
   game.load.spritesheet('kennewsprites', 'kennewsprites.png', 76 , 101, 48);
     game.load.image('blankaLevel', 'sf2ww-blanka.gif');
}

var backgroundImage;


var playerKen;
var kenWalkingForward;
var kenWalkingBackward;

var YValueBlankaLevel= 140;


var cursors;

//Punches
var lightPunchInput;
var mediumPunchInput;
var fiercePunchInput;

//Kicks
var lightKickInput;
var mediumKickInput;
var fierceKickInput;



function create() {
    idle=true;
    attacking=false;
    walking=false;


     backgroundImage = game.add.image(0, 0, 'blankaLevel'); 
    backgroundImage.smoothed = false;



    playerKen = game.add.sprite(300, YValueBlankaLevel, 'kennewsprites');
     game.physics.arcade.enable(playerKen);

     playerKen.body.bounce.y = 0.2;
    playerKen.body.gravity.y = 300;
    playerKen.body.collideWorldBounds = true;

    //Standing:
    playerKen.animations.add('standing', [0, 1, 2, 3]);
    playerKen.animations.add('walkingforward',[4,5,6]);
     playerKen.animations.add('walkingbackward', [8,9,10,11,12,13]);

    //Standing Punches:
   
      playerKen.animations.add('standingLightPunch', [25,26,27]);
    playerKen.animations.add('standingMediumPunch', [27,28,29,30]);



    //Crouching:
    playerKen.animations.add('crouching', [14]);
      playerKen.animations.add('crouchingLightPunch', [15,16,17]);
     playerKen.animations.add('crouchingMediumPunch', [18,19,20,21,22,15]);
   //TODO: add this to the sprite sheet playerKen.animations.add('crouchingFierce',)


    playerKen.animations.add('neutralJump',[36,37,38,39,40,41,42]);



     cursors = game.input.keyboard.createCursorKeys();


    lightPunchInput = game.input.keyboard.addKey(Phaser.Keyboard.Q); 
    mediumPunchInput = game.input.keyboard.addKey(Phaser.Keyboard.W);
    fiercePunchInput = game.input.keyboard.addKey(Phaser.Keyboard.E);
    lightKickInput = game.input.keyboard.addKey(Phaser.Keyboard.A);
    mediumKickInput =  game.input.keyboard.addKey(Phaser.Keyboard.S);
    fierceKickInput =  game.input.keyboard.addKey(Phaser.Keyboard.D);

    

}




//booleans;
var attacking;
var idle;
var walking;

function update() {  

 inputHandlers();
    
}


function inputHandlers()
{  


       //TODO: Neutral jump:
   //   playerKen.body.velocity.y = -50;
//    playerKen.animations.play('neutralJump', 7, false);
    
    if (cursors.left.isDown) {
        console.log('left');  
    playerKen.body.velocity.x = -100;   
    playerKen.animations.play('walkingbackward', 7, true);
}
   
    
    else if (cursors.right.isDown) {
        console.log('right');
          idle = false;
  playerKen.body.velocity.x = 100;
    playerKen.animations.play('walkingforward', 7, true);
}
  
  else   if (cursors.down.isDown) 
    {
        idle = true; //idle is true whether u are crouching down or letting go of the key
        console.log('down');
    playerKen.animations.play('crouching', 7, true);
         playerKen.body.velocity.x = 0;
}
else     if (mediumPunchInput.isDown) {  
          console.log('medium');
          attacking = true;
        kenAnimation = playerKen.animations.play('standingMediumPunch',7, false).onComplete.add(function () {	attacking = false; console.log('punching');}, this);      
        
            }
    else if (lightPunchInput.isDown) {  
          console.log('light');
          attacking = true;
        playerKen.animations.play('standingLightPunch', 3, false).onComplete.add(function () {	     playerKen.body.velocity.x = 0;  playerKen.animations.play('standing', 7, true);}, this);  ;  
}     


    else
        {
        if (!attacking & (cursors.left.isUp || cursors.right.isUp)){
       playerKen.body.velocity.x = 0;
      playerKen.animations.play('standing', 7, true);
        console.log('standing');
            }
    }


}
