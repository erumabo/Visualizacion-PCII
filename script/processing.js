let grafo = new Springy.Graph();
grafo.addNodes('a','b','c','d','e');
grafo.addEdges(
  ['a','b'],['c','d'],['b','c'],['d','e'],['e','a']
);
let layout = new Springy.Layout.ForceDirected(grafo, 40.0, 400.0, 0.5);

/*globals of control*/
let canvas, w, select=false;
let origin = true, change = true, animate=true, autozoom = true, grafomode=true;
let mx,my,dx,dy,px,py;
let nodo = [undefined,undefined], pesosDiv = [40,80], minWeight=0, maxWeight=120, zoom=1;

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


function setup(){
  px = py = dx = dy = 0;
  w = (windowWidth>windowHeight)?windowHeight:windowWidth;
  w=w>600?600:w;
  canvas = createCanvas(w,w);
  fill(0);
}

function draw(){
  if(grafomode){
    if(animate){
      layout.tick(0.03);
      Springy.requestAnimationFrame(()=>{
        graforender();
        if(layout.totalEnergy()<layout.minEnergyThreshold) animate=false;
      });
    } else {
      graforender();
    }
  } else {
    matrixRender();
  }
}


/*
 *Funciones que se encargan de manejar la interacción de processing con la interfaz
 */

/*Capitulo Uno, del control de zoom por mouse, teclado y botones*/
function fixzoom(z){
  dx = dx*zoom/z + zoom*w*(1/zoom - 1/z)/2;
  dy = dy*zoom/z + zoom*w*(1/zoom - 1/z)/2;
}
function zoomin(w){
  let z = zoom;
  $('#switch-zoom')[0].checked = autozoom = false;
  zoom = w(zoom);
  if(zoom>100) zoom=100;
  if(zoom<1) zoom=1;
  fixzoom(z);
  return false;
}
function mouseWheel(event){
  if(mouseX<0 || mouseX>w || mouseY<0 || mouseY>w) return true;
  return zoomin(z=>z-event.delta);
}
function keyPressed(){
  if(key==='+') return zoomin(z=>z+0.5)
  if(key==='-') return zoomin(z=>z-0.5)
  return true;
}

/*Captulo Dos, del movimiento del mouse y el arrastre del grafo*/
function inMouse(mouseX,mouseY){
  if(mouseX<0 || mouseX>w || mouseY<0 || mouseY>w) return change=false;
  if(grafomode) nodoE(mouseX,mouseY);
  mx = mouseX;
  my = mouseY;
  px = dx;
  py = dy;
  return change = true;
}
function touchStarted(){inMouse(mouseX,mouseY);}
function mousePressed(){inMouse(mouseX,mouseY);return false;}
function mouseDragged(){
  if(grafomode){
    if(!change) return;
    if(select){
      layout.eachNode((n,p)=>{
        if(n.id == nodo){
          p.p.x = mouseX/zoom - dx/zoom - w/2;
          p.p.y = mouseY/zoom - dy/zoom - w/2;
        }
      });
    } else {
      $('#switch-zoom')[0].checked = autozoom = false;
      dx = mouseX-mx+px;
      dy = mouseY-my+py;
    }
  }
  return false;
}
function mouseReleased(){
  if(select) animate = true;
}

/*Capitulo Tres, de los switches y otros botones*/
function autozoomSwitch(){
  autozoom = $('#switch-zoom')[0].checked;
}
function grafomodeSwitch(){
  grafomode = $('#switch-grafo')[0].checked;
  if(grafomode) $('#div-origin').show();
  else $('#div-origin').hide();
}
function originSwitch(){
 origin = $('#switch-origin')[0].checked;
}
