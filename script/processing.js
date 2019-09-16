let grafo = new Springy.Graph();
grafo.addNodes('0','1','2','3','4','5','6','7','8','9','10','11','12','13','14');
grafo.addEdges(
  ['0','2'],
  ['0','9'],
  ['2','4'],
  ['2','9'],
  ['2','11'],
  ['4','11'],
  ['9','11'],
  ['14','9'],
  ['14','11']
);
let layout = new Springy.Layout.ForceDirected(grafo, 40.0, 400.0, 0.5);

let canvas = undefined;
let change = true, animate=true;
let zoom = 1;
let mx,my,dx,dy,px,py;

function render(){
  background(206);
  layout.eachEdge((e,s)=>{
    line(zoom*s.point1.p.x, zoom*s.point1.p.y, zoom*s.point2.p.x, zoom*s.point2.p.y);
  });
  layout.eachNode((n,p)=>{
    ellipse(zoom*p.p.x,zoom*p.p.y,2);
  });
}


function setup(){
  px = py = dx = dy = 0;
  canvas = createCanvas(600,600);
  fill(0);
}

function draw(){
  translate(displayWidth/2,displayHeight/2);
  scale(zoom);
  translate(dx/zoom,dy/zoom);
  
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

function keyPressed(){
  if(key==='+'){ 
    zoom +=0.5;
    if(zoom>100)zoom=100;
    return false;
  }
  if(key==='-'){
    zoom -=0.5;
    if(zoom<0) zoom=0;
    return false;
  }
  return true;
}

function mousePressed(){
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

