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
    let tx=tX(p.p.x);
    let ty=tY(p.p.y);
    if(eucl(tx,ty,mx,my)<=(2*zoom)){
      select=true;
      nodo = n.id;
    }
  });
}

function tX(x){return (x+width/2)*zoom + dx;}
function tY(y){return (y+height/2)*zoom + dy;}

function render(){
  background(206);
  let M;
  if(autozoom){
    let mx=Infinity,Mx=-Infinity,my=Infinity,My=-Infinity;
    layout.eachNode((n,p)=>{
      if(p.p.x<mx)mx=p.p.x;
      if(p.p.y<my)my=p.p.y;
      if(p.p.x>Mx)Mx=p.p.x;
      if(p.p.y>My)My=p.p.y;
    });
    if(abs(Mx-mx)<abs(My-my)){
      zoom = w/abs(My-my);
      M = My;
    } else {
      zoom = w/abs(Mx-mx);
      M = Mx;
    }
    dx = -(mx+w/2)*zoom;
    dy = -(my+w/2)*zoom;
  }
  noStroke();
  {
    stroke(0,0,255);
    layout.eachEdge((e,s)=>{
      if(select && (e.source.id==nodo || e.target.id==nodo)){ stroke(0,0,0,255);strokeWeight(zoom>4?4:zoom);}
      else{ stroke(0,0,0,100); strokeWeight(1);}
      line(tX(s.point1.p.x),tY(s.point1.p.y),tX(s.point2.p.x),tY(s.point2.p.y));
    });
    
    layout.eachNode((n,p)=>{
      if(select && n.id == nodo){
        fill(0,0,0,205);
        stroke(0);
        ellipse(tX(p.p.x),tY(p.p.y),2.5*zoom);
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
}

function setup(){
  px = py = dx = dy = 0;
  w = (windowWidth>windowHeight)?windowHeight:windowWidth;
  w=w>600?600:w;
  canvas = createCanvas(w,w);
  fill(0);
}

function draw(){
  //fill(255,0,0);
  //ellipse(tX(w*((1/zoom)-1)/2 - dx/zoom),tY(w*(1/zoom - 1)/2 - dy/zoom),55);
  if(animate){
    layout.tick(0.03);
    Springy.requestAnimationFrame(()=>{
      render();
      if(layout.totalEnergy()<layout.minEnergyThreshold) animate=false;
    });
  } else {
    render();
  }
  /*noLoop();*/
}

function mouseWheel(event){
  console.log(event.delta);
  zoom -= (event.delta/10);
  if(zoom>100)zoom=100;
  if(zoom<1)zoom=1;
}

function fixzoom(z){
  //dx = w/2 * (z-zoom) + dx;
  //dy = w/2 * (z-zoom) + dy;
  dx = dx*zoom/z + zoom*w*(1/zoom - 1/z)/2;
  dy = dy*zoom/z + zoom*w*(1/zoom - 1/z)/2;
}

function zoomout(){
  let z=zoom;
  autozoom=false;
  zoom -=0.5;
  if(zoom<1) zoom=1;
  fixzoom(z);
}
function zoomin(){
  let z = zoom;
  autozoom=false;
  zoom +=0.5;
  if(zoom>100)zoom=100;
  fixzoom(z);
}
function keyPressed(){
  if(key==='+'){ 
    zoomin();
    return false;
  }
  if(key==='-'){
    zoomout();
    return false;
  }
  return true;
}

function touchStarted(){
  autozoom=false;
  nodoE(mouseX,mouseY);
  mx = mouseX;
  my = mouseY;
  px = dx;
  py = dy;
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

