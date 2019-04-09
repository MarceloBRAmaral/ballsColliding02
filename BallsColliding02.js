//Two Balls Colliding v. 02
//This tutorial shows how to make two balls collide correctly
//
//This release adds:
//1. horizontal velocity
//
//BUGS:
//1. the particles are loosing energy without the use of friction
//
//TO DO:
//1. (DONE) horizontal velocity
//
//2. (DONE) add collision between balls
//3. (DONE) use bounce (shock) instead of friction
//
//By Marcelo Silva

//canvas definition
var document;var window;var init;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//get canvas dimensions
var canvasWidth = canvas.width;
var canvasHeigth = canvas.height;
//font size and color
ctx.font = '20px Arial';

// var definitions
//var radius = 40;//radius of the ball
var particles = [];//array of particles
var numParticles = 12;//number of particles to be created
//var frameCounter=0;//for testing if gravity is making balls vibrate
var gravity=0;//zero = no gravity
var friction=1;//default 1 = no friction
var shock=1;//default 1 no shock particle looses shock units in its speed when collides

//instanciate the particles objects
for(var i=0;i<numParticles;i++){
    var radius = Math.random()*35+5;//make each ball different size
    var x = Math.random()*(canvasWidth-2*radius)+radius;//spawning each ball at different x
    var y = Math.random()*(canvasHeigth-2*radius)+radius;//spawning each ball at random y
    var speed = Math.random()*8+1;//spawn wach ball at different random speed
    var dir = Math.PI/2;//spawn all balls with vx=0 and same vy to check if vx is created during collision
    particles.push(particle.create(//canvasHeigth,radius,x,y,speed,direction,gravity,friction,shock,life
    canvasHeigth,radius,x,y,speed,dir,gravity,friction,shock));
}

var clearCanvas = function () {
	ctx.clearRect(0,0,canvasWidth,canvasHeigth);
};

function main() {
    init = window.requestAnimationFrame(main);
    // Whatever your main loop needs to do    
    clearCanvas();//clear the canvas
    for(var i=0;i<numParticles;i++){
        var p=particles[i];
        p.testBounds(canvasWidth,canvasHeigth,p.radius,p.radius);
        for(var j=i+1;j<numParticles;j++){
        p.testCollision(particles[j]);}
//        frameCounter++;
        p.update();
        ctx.beginPath();//only this can erase stroke and arc
        //if(i===0){ctx.fillStyle="rgb(255,0,0)";}else{ctx.fillStyle="rgb(0,255,0)";}
        ctx.fillStyle=p.color;
        ctx.arc(p.x,p.y,p.radius,0,Math.PI*2,false);
        ctx.fill();
        ctx.fillStyle='white';
        ctx.fillText(i,p.x-8,p.y+8);
    }
    
}

main();