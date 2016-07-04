var h;
var w;
var bcol;
var bval = 1;
var bhue = 0;

var notouch = true;

var pool = [];


var setup = function(){
  colorMode(HSB, 360,1,1)
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  w = windowWidth;
  h = windowHeight;

  //disable default touch events for mobile
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", pdefault, false);
  el.addEventListener("touchend", pdefault, false);
  el.addEventListener("touchcancel", pdefault, false);
  el.addEventListener("touchleave", pdefault, false);
  el.addEventListener("touchmove", pdefault, false);

  updateColor(random(360));

  makeBurst(random(w),random(h));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function pdefault(e){
  e.preventDefault()
}


var touchStarted= function(){
//  clicked(touchX,touchY);
}

var touchMoved= function(){
//  clicked(touchX,touchY);
}

var touchEnded= function(){
  clicked(touchX,touchY);
}

var updateColor = function(hue){
  bhue = hue.toFixed(0);
  bval = 1;

  background(color(bhue,1,1));
}

var clicked = function(x,y){
  makeBurst(x,y);

  if(notouch){
el = document.getElementsByClassName('title')[0];
el.remove();
  notouch = false;
  }
}

var makeBurst = function(x,y){
  num=50;
  updateColor(random(360));
  var base = random(360);
  for(var i=0; i<num; i++){
    var p = new Burst(x, y, base);
    pool.push(p);
  }
}


var draw = function(){
  for(var i=0;i<pool.length; i++){
    var p = pool[i];
    p.update();
    p.render();
  }


  if(pool.length ==0 & notouch){
  makeBurst(random(w),random(h));
  }

}

function Burst(x,y, base){
  this.x = x;
  this.y = y;
  this.radius=random(50,100);
  this.ang = random(360);
  this.step=10;
  this.base = base;
  this.start = millis();
  this.life = 2000;

  this.update = function(){
    var duration = millis - this.start;
    this.x+=this.step*cos(this.ang);
    this.y+=this.step*sin(this.ang);
//    this.radius =  map(duration,0,this.life,this.radiusStart,0);

    this.radius-=1;

    if(this.radius<0){
      var index = pool.indexOf(this);
      if (index > -1) {
        pool.splice(index, 1);
      }
    }

  }

  this.render = function(){
    push();
    var col = ((this.base+random(100))%360);
    fill(col,1,1);
    noStroke();
    translate(this.x,this.y);
    ellipse(0,0,this.radius, this.radius);
    pop();
  }
}

