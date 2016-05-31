'use strict';

let GameState = {
	preload: function () {
		this.load.image('purple','images/purple.png');
		this.load.image('rightArrow', 'images/arrow.png');
		this.load.image('canguro', 'images/canguro.png');
		this.load.image('gato', 'images/cat.png');
		this.load.image('pollito', 'images/chick.png');
		this.load.image('elefante', 'images/elephant.png');
		this.load.image('gallina', 'images/gallina.png');
		this.load.image('chango', 'images/monkey.png');
		this.load.image('perro', 'images/perro.png');
		this.load.image('conejo', 'images/rabbit.png');
		
		this.load.audio('canguroSound', 'images/canguro.mp3');
		this.load.audio('gatoSound', 'images/gato.mp3');
		this.load.audio('pollitoSound', 'images/pollo.mp3');
		this.load.audio('elefanteSound', 'images/elefante.mp3');
		this.load.audio('gallinaSound', 'images/gallina.mp3');
		this.load.audio('changoSound', 'images/chango.mp3');
		this.load.audio('perroSound', 'images/perro.mp3');
		this.load.audio('conejoSound', 'images/conejo.mp3')

	},

	create: function (){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		// create background
		this.purple = this.game.add.sprite(0, 0, 'purple');
		
		// group for things
		let animalData = [
			{key: 'canguro', text: 'Canguro', audio: 'canguroSound'},
			{key: 'gato', text: 'Gato', audio: 'gatoSound'},
			{key: 'pollito', text: 'Pollo', audio: 'pollitoSound'},
			{key: 'elefante', text: 'Elefante', audio: 'elefanteSound'},
			{key: 'gallina', text: 'Gallina', audio: 'gallinaSound'},
			{key: 'chango', text: 'Chango', audio: 'changoSound'},
			{key: 'perro', text: 'Perro', audio: 'perroSound'},
			{key: 'conejo', text: 'Conejo', audio: 'conejoSound'}
		];

		this.animals = this.game.add.group();

		let self = this;
		let animal;

		animalData.forEach(function(element) {
			//create each animal and put it in the group
      		animal = self.animals.create(-1000, self.game.world.centerY, element.key);

      		//I'm saving everything that's not Phaser-related in a custom property
      		animal.customParams = {text: element.key, sound: self.game.add.audio(element.audio)};

      		//anchor point set to the center of the sprite
     		 animal.anchor.setTo(0.5);
     	//enable input so we can touch it
      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true;
      animal.events.onInputDown.add(self.animateAnimal, self);
    });

    //place current animal in the middle
    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);
	
	//show animal text
	this.showText(this.currentAnimal);


		//left arrow
		this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'rightArrow');
		this.leftArrow.anchor.setTo(0.5);
		this.leftArrow.scale.x = -1;
		this.leftArrow.customParams = {direction:-1};

		//left arrow allow user input
		this.leftArrow.inputEnabled = true;
		this.leftArrow.input.pixelPerfectClick = true;
		this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

		//right arrow
		this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'rightArrow');
		this.rightArrow.anchor.setTo(0.5);
		this.rightArrow.customParams = {direction:1};

		//right arrow allow user input
		this.rightArrow.inputEnabled = true;
		this.rightArrow.input.pixelPerfectClick = true;
		this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

	},

update: function(){
},
//play animal animation and sound

animateAnimal: function(sprite, event) {
	sprite.play('animate');
	sprite.customParams.sound.play();
},

//switch animal
switchAnimal: function(sprite, event) {
	
	//if an animation is taking place don't do anything
	if(this.isMoving) {
		return false;
	}

	this.isMoving = true;

	//hide text
	this.animalText.visible = false;

	let newAnimal, endX;
	if(sprite.customParams.direction > 0) {
		newAnimal = this.animals.next();
		newAnimal.x = -newAnimal.width/2;
		endX = 640 + this.currentAnimal.width/2;
	}
	else {
		newAnimal = this.animals.previous();
		newAnimal.x = 640 + newAnimal.width/2;
		endX = -this.currentAnimal.width/2;
	}
	
	let newAnimalMovement = game.add.tween(newAnimal);
	newAnimalMovement.to({x: this.game.world.centerX});
	newAnimalMovement.onComplete.add(function(){
		this.isMoving = false;
		this.showText(newAnimal);
	}, this);
	newAnimalMovement.start();
	
	let currentAnimalMovement = game.add.tween(this.currentAnimal);
	currentAnimalMovement.to({x: endX}, 1000);
	currentAnimalMovement.start();

	this.currentAnimal = newAnimal;
},
showText: function(animal) {
	if(!this.animalText) {
		this.animalText = this.game.add.text(this.game.width/2, this.game.height * .95, '');
		this.animalText.anchor.setTo(0.5);
	}
	this.animalText.setText(animal.customParams.text);
	this.animalText.visible = true;
}

};

let game = new Phaser.Game(640, 360, Phaser.AUTO, 'animales');

game.state.add('GameState', GameState);
game.state.start('GameState');