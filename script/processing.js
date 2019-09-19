let grafo = new Springy.Graph();
grafo.addNodes('0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','A','B','c','d,','e');
grafo.addEdges(['0','3'],['0','5'],['3','5'],['3','10'],['3','12'],['10','12'],['5','14'],['5','12'],['12','14'],
['1','8'],['1','6'],['6','8'],
['2','7'],['2','9'],['7','9'],
['4','11'],['4','13'],['11','13']);

let layout = new Springy.Layout.ForceDirected(grafo, 40.0, 400.0, 0.5);

let canvas, w;
let change = true, animate=true, select=false;
let autozoom = true;
let zoom = 1;
let mx,my,dx,dy,px,py;
let nodo = [undefined,undefined];
 
function eucl(x,y,u,v){
  return sqrt((x-u)*(x-u)+(y-v)*(y-v));
}

function nodoE(mx,my){
  select = false;
  layout.eachNode((n,p)=>{
    let tx = tX(p.p.x), ty = tY(p.p.y);
    if(eucl(tx,ty,mx,my)<=(2*zoom)){
      select=true;
      nodo = n.id;
    }
  });
  return select;
}

function tX(x){return (x+width/2)*zoom + dx;}
function tY(y){return (y+height/2)*zoom + dy;}

function render(){
  background(206);
  let M;
  if(autozoom){
    let mx=Infinity,Mx=-Infinity,my=Infinity,My=-Infinity;
    layout.eachNode((n,p)=>{
      mx=min(mx,p.p.x);
      my=min(my,p.p.y);
      Mx=max(Mx,p.p.x);
      My=max(My,p.p.y);
    });
    if(abs(Mx-mx)<abs(My-my)){
      zoom = w/(My-my+4);
      M = My;
    } else {
      zoom = w/(Mx-mx+4);
      M = Mx;
    }
    dx = -(mx-2+w/2)*zoom;
    dy = -(my-2+w/2)*zoom;
  }
  
  layout.eachEdge((e,s)=>{
    if(select && (e.source.id==nodo || e.target.id==nodo)) {
      stroke(0,0,0,255);
      strokeWeight(zoom>3?3:zoom);
    } else {
      stroke(0,0,0,100);
      strokeWeight(1);
    }
    line(tX(s.point1.p.x),tY(s.point1.p.y),tX(s.point2.p.x),tY(s.point2.p.y));
  });
  
  layout.eachNode((n,p)=>{
    if(select && n.id == nodo){
      fill(0,0,0,205);
      stroke(0);
      ellipse(tX(p.p.x),tY(p.p.y),2*zoom+4);
    } else {
      fill(0,0,0,100);
      noStroke();
      ellipse(tX(p.p.x),tY(p.p.y),2*zoom);
    }
    if(zoom>=3){
      textSize(15+zoom);
      fill(255);
      text(n.id,tX(p.p.x),tY(p.p.y));
    }
  });
}

function setup(){
  px = py = dx = dy = 0;
  w = (windowWidth>windowHeight)?windowHeight:windowWidth;
  w=w>600?600:w;
  canvas = createCanvas(w,w);
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
  zoom -= (event.delta/10);
  if(zoom>100)zoom=100;
  if(zoom<1)zoom=1;
}

function fixzoom(z){
  dx = dx*zoom/z + zoom*w*(1/zoom - 1/z)/2;
  dy = dy*zoom/z + zoom*w*(1/zoom - 1/z)/2;
}

function zoomin(w){
  let z = zoom;
  autozoom=false;
  zoom = w(zoom);
  if(zoom>100) zoom=100;
  if(zoom<1) zoom=1;
  fixzoom(z);
}
function keyPressed(){
  if(key==='+'){zoomin(z=>{return z+0.5;});return false;}
  if(key==='-'){zoomin(z=>{return z-0.5;});return false;}
  return true;
}

function inMouse(mouseX,mouseY){
  autozoom=false;
  nodoE(mouseX,mouseY);
  mx = mouseX;
  my = mouseY;
  px = dx;
  py = dy;
}
function touchStarted(){inMouse(mouseX,mouseY);return false;}
function mousePressed(){inMouse(mouseX,mouseY);return false;}
function mouseDragged(){
  change = true;
  if(select){
    layout.eachNode((n,p)=>{
      if(n.id == nodo){
        p.p.x = mouseX/zoom - dx/zoom - w/2;
        p.p.y = mouseY/zoom - dy/zoom - w/2;
      }
    });
  } else {
    dx = mouseX-mx+px;
    dy = mouseY-my+py;
  }
  return false;
}
function mouseReleased(){
  if(select) animate = true;
}
