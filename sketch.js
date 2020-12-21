
var db, stock, foodS
var feedtime, ft, gamestate, gs


function preload()
{
d1=loadImage("images/dogImg.png")
d2=loadImage("images/dogImg1.png")
milk=loadImage("Milk.png")
bed=loadImage("Bed Room.png")
garden=loadImage("Garden.png")
wash=loadImage("Wash Room.png")
}

function setup() {
  createCanvas(800, 700);
  
  db=firebase.database()

  var stock=db.ref("food")
  stock.on("value", read)


  feedtime=db.ref("FeedT")
  feedtime.on("value", readtime)
  
  dog=createSprite(550,300,10,10)
  dog.addImage(d1)

  gs=db.ref("gamestate")
  gs.on("value", function(data){
    gamestate=data.val()
  })

  b1=createButton("Click here to feed the dog")
 b1.position(400,100)
  b2=createButton("Click here to get food")
b2.position(600,100)
b2.mousePressed(getfood)
b1.mousePressed(feedfood)
}


function draw() {  
background("white")
dog.scale=0.5
imageMode(CENTER)

currenttime=hour()
if(currenttime===(ft+1)){
  gamestate="playing"
  image(garden, 400,350,800,700)
}
 
else if(currenttime===(ft+2)){
  gamestate="sleeping"
  image(bed, 400,350,800,700)
}

else if(currenttime>(ft+2)&& currenttime<=(ft+4)){
  gamestate="bathing"
  image(wash, 400,350,800,700)
}

else{
  gamestate="hungry"
}

if(gamestate!="hungry"){
  b1.hide()
  b2.hide()
  dog.remove()
}

else{
  b1.show()
  b2.show()
  dog.addImage(d1)
}

db.ref("/").update({
gamestate:gamestate
})
if(keyWentDown(UP_ARROW)){
    writeStock(foodS)
    dog.addImage(d2)
  }
  var x=80, y=100


  if(foodS!=0){
    for(var i=0; i<foodS; i++){
      if(i%10===0){
        x=80
        y=y+50
      }
      image(milk, x, y, 50,50)
      x=x+30
    }
  }
   
  db.ref("/").update({
    FeedT: hour()
  })

  if(ft>12){
    text("Last fed: " + ft%12 +" pm", 100,250)
  }
  else if(ft===0){
    text("Last fed: 12 am", 100,250)
  }
  else if(ft<12){
    text("Last fed: " + ft +" am", 100,250)
  }
  else{
    text("Last fed: "+  "12 pm", 100,250)
  }
 // text("Press Up arrow key to feed the dog!", 80,200)
  drawSprites();

}
function read(data){
  foodS=data.val()
}

function writeStock(x){

  if(x<=0){
    x=0
  }
  else{
    x=x-1
  }

}


function getfood(){
  foodS++
db.ref("/").update({
  food:foodS
})

}
function feedfood(){
  if(foodS>0){
    foodS=foodS-1
    //dog.addImage(happydog,250,300)
  }
  db.ref("/").update({
    food:foodS
    
  })
}


function readtime(data){
ft=data.val()
}

