let grafo = new Springy.Graph();
grafo.addNodes('0','1','2','3','4','5','6','7','8','9','10','11','12','13','14');
grafo.addEdges(['0','2'],['0','9'],['2','4'],['2','9'],['2','11'],['4','11'],['9','11'],['14','9'],['14','11']);

let layout = new Springy.Layout.ForceDirected(grafo, 40.0, 400.0, 0.5);

let canvas;
let change = true, animate=true, select=false;
let zoom = 1;
let mx,my,dx,dy,px,py;
let nodo = [undefined,undefined];

function eucl(x,y,u,v){
  return sqrt((x-u)*(x-u)+(y-v)*(y-v));
}

function nodoE(mx,my){
  select = false;
  layout.eachNode((n,p)=>{
    let tx=tX(zoom*p.p.x);
    let ty=tY(zoom*p.p.y);
    if(eucl(tx,ty,mx,my)<=(4*zoom)){
      select=true;
      nodo = n.id;
    }
  });
}

function tX(x){return (x+width/2)*zoom + dx;}
function tY(y){return (y+height/2)*zoom + dy;}

function render(){
  background(206);
  fill(0,0,255);
  stroke(0,0,255);
  layout.eachEdge((e,s)=>{
    if(select && (e.source.id==nodo || e.target.id==nodo)){ stroke(0,0,0,255);strokeWeight(zoom);}
    else{ stroke(0,0,0,100); strokeWeight(1);}
    line(tX(zoom*s.point1.p.x),tY(zoom*s.point1.p.y),tX(zoom*s.point2.p.x),tY(zoom*s.point2.p.y));
  });
  noStroke();
  layout.eachNode((n,p)=>{
    if(select && n.id == nodo) fill(0,0,0,255);
    else fill(0,0,0,100);
    ellipse(tX(zoom*p.p.x),tY(zoom*p.p.y),4*zoom);
  });
}

function setup(){
  px = py = dx = dy = 0;
  canvas = createCanvas(600,600);
  fill(0);
}

function draw(){
  if(animate){
    layout.tick(0.03);
    Springy.requestAnimationFrame(()=>{
      render();
      if(layout.totalEnergy()<layout.minEnergyThreshold) animate=false;
    });
  } else {
    render();
  }
}

function mouseWheel(event){
  console.log(event.delta);
  zoom -= (event.delta/10);
  if(zoom>100)zoom=100;
  if(zoom<1)zoom=1;
}

function keyPressed(){
  if(key==='+'){ 
    zoom +=0.5;
    if(zoom>100)zoom=100;
    return false;
  }
  if(key==='-'){
    zoom -=0.5;
    if(zoom<1) zoom=1;
    return false;
  }
  return true;
}

function mousePressed(){
  nodoE(mouseX,mouseY);
    mx = mouseX;
    my = mouseY;
    px = dx;
    py = dy;
}
function mouseDragged(){
  change = true;
  dx = mouseX-mx+px;
  dy = mouseY-my+py;
  return false;
}

