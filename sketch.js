var h;
var w;
var bcol;
var bval = 1;
var bhue = 0;
var synth;

var notouch = true;

var pool = [];


var setup = function(){
  colorMode(HSB, 360,1,1)
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  createSynth();

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

var createSynth = function(){
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

    //step length is 50
    if(millis() - p.updated>50){
      p.update();
      p.render();
    }


    if(millis() - p.updated>25){
      p.render();
    }
  }


  if(pool.length ==0 & notouch){
  makeBurst(random(w),random(h));
  }

}

var noteScale = ["D3","E3", "F3", "G3", "A4", "B4", "C4","D4","E4", "F4", "G4", "A5", "B5", "C5","D5","E5", "F5", "G5", "A6", "B6", "C6","D6","E6", "F6", "G6", "A7", "B7", "C7","D7"];

function Burst(x,y, base){
  this.x = x;
  this.y = y;
  this.radiusStart=random(30,60);
  this.ang = random(360);
  this.step=20;
  this.base = base;
  this.start = millis();
  this.life = 1500;
  this.updated = millis();

  this.update = function(){
    var duration = millis() - this.start;
    this.x+=this.step*cos(this.ang);
    this.y+=this.step*sin(this.ang);
    this.radius =  map(duration,0,this.life,this.radiusStart,0);

    var interval = floor(map(duration,0,this.life,0,noteScale.length-1));
    if(interval<noteScale.length-1){
     // synth.triggerAttackRelease(noteScale[interval], 0.1);
    }


    if(this.radius<0){
      var index = pool.indexOf(this);
      if (index > -1) {
        pool.splice(index, 1);
      }
    }
    this.updated = millis();
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

