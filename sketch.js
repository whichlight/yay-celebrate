'use strict';
var h;
var w;
var bcol;
var bval = 1;
var bhue = 0;

var synthpool = new SynthPool(10);

var notouch = true;

var bursts = [];

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



function SynthPool(numSynths){
  this.pool = [];
  this.index = 0;

  for(var i=0; i<numSynths; i++){
    var synth = new Tone.SimpleSynth();
    synth.toMaster();
    this.pool.push(synth);
  }

  this.getSynth = function(){
    var s = this.pool[this.index];
    this.index++;
    this.index%=numSynths;
    return s;
  }
}



var updateColor = function(hue){
  bhue = hue.toFixed(0);
  bval = 1;

  background(color(bhue,1,1));
}

var clicked = function(x,y){
  makeBurst(x,y);

  if(notouch){
  var el = document.getElementsByClassName('title')[0];
  el.remove();
  notouch = false;
  }
}

var makeBurst = function(x,y){
  updateColor(random(360));
  bursts.push(new Burst(x,y,50));
}


var draw = function(){

  bursts.forEach(function(b){
    b.update();

    if(b.pool.length ==0 & notouch){
      makeBurst(random(w),random(h));
    }

    if(b.pool.length ==0){
     // b.synth.dispose();
      var index = bursts.indexOf(b);
      if (index > -1) {
        bursts.splice(index, 1);
      }
    }
  });
}


var octaves= [3,4,5,6,7,8,9];
var letters = ["C","D","E","F","G","A","B"];

var noteScale = [];
octaves.forEach(function(o){
  letters.forEach(function(l){
    noteScale.push(l+o.toString());
  });
});

//var noteScale = ["C3","D3","E3", "F3", "G3", "A3", "B3", "C4","D4","E4", "F4", "G4", "A4", "B4", "C5","D5","E5", "F5", "G5", "A5", "B5", "C6","D6","E6", "F6", "G6", "A6", "B6", "C7","D7"];

function Burst(x,y,num){
  this.pool = [];
  var base = random(360);
  this.synth = synthpool.getSynth();
  this.playing = false;
  this.x = x;
  this.y = y;
  this.note =0;
  this.notesplayed = 0;

  for(var i=0; i<num; i++){
    var p = new Spark(x, y, base);
    this.pool.push(p);
  }


  this.update = function(){

    var duration = millis() - this.pool[0].start;

    var base = floor(map(this.y, 0,h,12,0));

    var arp = [0,7,3,5,7];


    if(!this.playing && this.notesplayed < 6){
      this.playing=true;
      var that = this;
      setTimeout(function(){
        that.playing = false;
      }, this.pool[0].life/20);

      if(this.notesplayed<5){
        this.synth.triggerAttackRelease(noteScale[base+this.note+7], 0.1);
      }else{
        this.synth.triggerAttackRelease(noteScale[base+21], 0.1);
      }
    //  this.synth.triggerAttackRelease(noteScale[base+this.note+7], 0.1, "+0.1");
      this.note+=floor(random(1,4));
      this.notesplayed++;
    }



    for(var i=0;i<this.pool.length; i++){
      var p = this.pool[i];

      //step length is 50
      if(millis() - p.updated>50){
        p.update();
        p.render();
      }


      if(millis() - p.updated>25){
        p.render();
      }
      if(p.radius<0){
        var index = this.pool.indexOf(p);
        if (index > -1) {
          this.pool.splice(index, 1);
        }
      }
    }

  }
}

function Spark(x,y, base){
  this.x = x;
  this.y = y;
  this.radiusStart=random(30,60);
  this.ang = random(360);
  this.step=15;
  this.base = base;
  this.start = millis();
  this.life = 1500;
  this.updated = millis();

  this.update = function(){
    var duration = millis() - this.start;
    this.x+=this.step*cos(this.ang);
    this.y+=this.step*sin(this.ang);
    this.radius =  map(duration,0,this.life,this.radiusStart,0);


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

