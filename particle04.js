//particle.js v. 04
//This framework contains particle related functions
//
//This version v. 04 uses the solution from http://www.adambrookesprojects.co.uk/project/canvas-collision-elastic-collision-tutorial/
//
//In resume, they swap normal velocities and continue with tangential velocities, but taking into account the mass they have.
//
//As we use many angular calculations, the use of vectors will simplify CPU usage
//
//STEP 1. Find normal and tangent unit velocity vectors
//STEP 2. Find normal and tangent velocity components for the 2 particles, by using the dot product
//STEP 3. Find the new normal scalar velocities taking into account the particles masses
//STEP 4. Convert new normal and tangential scalar speeds into vectorial velocities by multiplying
//          to the unit velocity vectors from STEP 1.
//STEP 5. Adding normal and tangential velocities and convert to x and y components
//
//The original equations found in the website:
//
//STEP 1.     var xDistance = (ball2.getX() - ball1.getX());
//            var yDistance = (ball2.getY() - ball1.getY());
// 
//            var normalVector = new vector(xDistance, yDistance); 
//            normalVector = normalVector.normalise();
//            var tangentVector = new vector((normalVector.getY() * -1), normalVector.getX());
//
//STEP 2. // create ball scalar normal direction.
//        var ball1scalarNormal =  normalVector.dot(ball1.velocity);
//        var ball2scalarNormal = normalVector.dot(ball2.velocity);
// 
//        // create scalar velocity in the tagential direction.
//        var ball1scalarTangential = tangentVector.dot(ball1.velocity); 
//        var ball2scalarTangential = tangentVector.dot(ball2.velocity);
//
//STEP 3.   var ball1ScalarNormalAfter = (ball1scalarNormal * (ball1.getMass() - ball2.getMass()) +
//          2 * ball2.getMass() * ball2scalarNormal) / (ball1.getMass() + ball2.getMass());
//          var ball2ScalarNormalAfter = (ball2scalarNormal * (ball2.getMass() - ball1.getMass()) + 
//          2 * ball1.getMass() * ball1scalarNormal) / (ball1.getMass() + ball2.getMass());
//
//STEP 4.   var ball1scalarNormalAfter_vector = normalVector.multiply(ball1ScalarNormalAfter); 
//          var ball2scalarNormalAfter_vector = normalVector.multiply(ball2ScalarNormalAfter);
// 
//          var ball1ScalarNormalVector = (tangentVector.multiply(ball1scalarTangential));
//          var ball2ScalarNormalVector = (tangentVector.multiply(ball2scalarTangential));;
//
//STEP 5.   ball1.velocity = ball1ScalarNormalVector.add(ball1scalarNormalAfter_vector);
//          ball2.velocity = ball2ScalarNormalVector.add(ball2scalarNormalAfter_vector);
//
//INFO:
//1. Particle life: 
// - when set to 0, the life is infinite;
// - when set to 100, the life is as short as possible, let's say 1 frame
// - the life counter starts with 100;it is subtracted the life value from life counter each frame
// - the particle dies when the life counter is 0
// - the boolean "dead" has to be handled externally to kill the particle
//
//2. Bounce effect:
// - every time the particle bounces (shock) it looses energy (speed)
//
//This release adds:
//1. Bounce (shock)
//2. Particle mass (still related to particle radius)
//3. Correct new directions after collision
//
//BUGS:
//1. the particles are loosing energy without using friction or bounce
//
//TO DO:
//1. create utils library; add function to convert angle from degrees to radius 
//2. make the life in seconds
//3. receive a friction number directly proportional and convert here
//4. correct energy lost
//5. correct direction after collision (the problem is easy to see when we set intial direction PI/2 
//  for all balls, after hitting there should be some horizontal velocities) 
//  http://en.wikipedia.org/wiki/Elastic_collision and
//  http://www.adambrookesprojects.co.uk/project/canvas-collision-elastic-collision-tutorial/
//
//By Marcelo Silva
var particle = {
    x:0,
    y:0,
    vx:0,
    vy:0,
    lifeCounter:100,
//    shock:0.5,//default 1 no shock particle looses shock units in its speed when collides
    
    color:'black',
    
    create:function(canvasHeigth,radius,x,y,speed,direction,grav,fric,shock,lif){
        var obj=Object.create(this);
        obj.canvasHeigth=canvasHeigth;
        obj.radius=radius;
        obj.x=x;
        obj.y=y;
        obj.speed=speed;
        obj.direction=direction;
        obj.vx=Math.cos(direction)*speed;
        obj.vy=Math.sin(direction)*speed;
//        obj.velocity=vector.create(0,0);
//        obj.velocity.setLength(speed);
//        obj.velocity.setAngle(direction);
        obj.gravity=grav||0;
        obj.friction=fric||1;//default friction v1 is 1 (no friction) and v2 is 0
        obj.life=lif||0;//default life is infinite
        obj.isColliding=false;
//        obj.isAbove=false;
        obj.mass=radius;
//        obj.normalVector=vector.create(0,0);
        obj.shock=shock;
        
        return obj;
    },
    
//    this.velocity=new vector(this.vx,this.vy),
    
    accelerate:function(ax,ay){
        this.vx+=ax;
        this.vy+=ay;
    },
    
    update:function(){

        this.vy+=this.gravity;
        this.vx*=this.friction;
        this.vy*=this.friction;
        this.x+=this.vx;
        this.y+=this.vy;
        if(this.lifeCounter>0){//calculating the remaining particle life
        this.lifeCounter-=this.life;}else{this.lifeCounter=0;}
    },
    
    angleTo:function(p2){
        return Math.atan2(p2.y-this.y,p2.x-this.x);
    },
    
    distanceTo:function(p2){
        var dx=p2.x-this.x,
            dy=p2.y-this.y;
        return Math.sqrt(dx*dx+dy*dy);
    },
    
    testBounds:function(canvasWidth,canvasHeigth,width,heigth){
        if(this.x>canvasWidth-width){
            this.x=canvasWidth-width;
            this.vx*=-1*this.shock;
        }else if(this.x<0+width){
            this.x=width;
            this.vx*=-1*this.shock;               
        }
        if (this.y>canvasHeigth-heigth){
            this.y=canvasHeigth-heigth;//to avoid the ball being trapped into the bottom
            this.vy*=-1*this.shock;
        }else if (this.y<0+heigth){
            this.y=heigth;//to avoid the ball being trapped into the top ceiling
            this.vy*=-1*this.shock;
}
},
    
    testCollision:function(p2){
        var dx=this.x-p2.x,
            dy=this.y-p2.y,
            distance=Math.sqrt(dx*dx+dy*dy);
            //ux=dx/distance,
            //uy=dy/distance;
        
        if(distance<=this.radius+p2.radius){
            console.log('COLLISION!!!');
            this.isColliding=true;
            this.color='red';
            p2.isColliding=true;
            p2.color='red';
            if(this.x>p2.x){this.x+=this.radius+p2.radius-distance;p2.x-=this.radius+p2.radius-distance;
                }else if(this.x<p2.x){p2.x+=this.radius+p2.radius-distance;this.x-=this.radius+p2.radius-distance;}//avoids one particle inside the other by adding horizontal position to each one
            if(this.y>p2.y){this.y+=this.radius+p2.radius-distance;p2.y-=this.radius+p2.radius-distance;
                }else if(this.y<p2.y){p2.y+=this.radius+p2.radius-distance;this.y-=this.radius+p2.radius-distance;}//avoids one particle inside the other by adding vertical position to each one

//Old part of collisionResponse            
//            var vxm=this.vx;//p1 receives p2 velocity and p2 receives p1 velocity
//            var vym=this.vy;
//            this.vx=p2.vx;
//            this.vy=p2.vy;
//            p2.vx=vxm;
//            p2.vy=vym;
//            if(this.y<p2.y){this.isAbove=true;
                           // console.log('p1 is above p2');
//                           }
            //new collision response
            //STEP 1
            var normalVector = vector.create(dx,dy);                        
            normalVector.normalise();
            var tangentVector = vector.create(normalVector.getY() * -1,normalVector.getX());
                        
            //STEP 2. 
            //create ball scalar normal direction
            var ball1Velocity = vector.create(this.vx,this.vy);
            var ball2Velocity = vector.create(p2.vx,p2.vy);
            var ball1scalarNormal = normalVector.dot(ball1Velocity);
            var ball2scalarNormal = normalVector.dot(ball2Velocity);
 
            // create scalar velocity in the tagential direction
            var ball1scalarTangential = tangentVector.dot(ball1Velocity); 
            var ball2scalarTangential = tangentVector.dot(ball2Velocity);
            
            //STEP 3
            var ball1ScalarNormalAfter = (ball1scalarNormal * (this.mass - p2.mass) +
            2 * p2.mass * ball2scalarNormal) / (this.mass + p2.mass);
            var ball2ScalarNormalAfter = (ball2scalarNormal * (p2.mass - this.mass) + 
            2 * this.mass * ball1scalarNormal) / (this.mass + p2.mass);
            
            //STEP 4
            var ball1scalarNormalAfter_vector = normalVector.multiply(ball1ScalarNormalAfter); 
            var ball2scalarNormalAfter_vector = normalVector.multiply(ball2ScalarNormalAfter);
 
            var ball1ScalarNormalVector = (tangentVector.multiply(ball1scalarTangential));
            var ball2ScalarNormalVector = (tangentVector.multiply(ball2scalarTangential));
            
            //STEP 5
            ball1Velocity = ball1ScalarNormalVector.add(ball1scalarNormalAfter_vector);
            ball2Velocity = ball2ScalarNormalVector.add(ball2scalarNormalAfter_vector);
            //new speeds
            this.vx=ball1Velocity.getX();
            this.vy=ball1Velocity.getY();
            p2.vx=ball2Velocity.getX();
            p2.vy=ball2Velocity.getY();
            
            
        }
        }
};