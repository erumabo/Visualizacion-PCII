let grafo = new Springy.Graph();
grafo.addNodes('a','b','c','d','e');
grafo.addEdges(
  ['a','b'],['c','d'],['b','c'],['d','e'],['e','a']
);
let layout = new Springy.Layout.ForceDirected(grafo, 40.0, 400.0, 0.5);

/*globals of control*/
let canvas, w,h, select=false;
let origin = true, change = true, animate=true, autozoom = true, grafomode=false;
let mx,my,dx,dy,px,py;
let nodo = [undefined,undefined], pesosDiv = [40,80], minWeight=0, maxWeight=120, zoom=1;

let grafoCfg = {dx:0,dy:0,z:1,auto:true,}
  , matrizCfg = {dx:0,dy:0,z:1,auto:true,};

function setup(){
  px = py = dx = dy = 0;
  w = windowWidth;
  h = windowHeight;
  canvas = createCanvas(w,h);
  fill(0);
  $('canvas').addClass('canvas-click');
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
function fixzoom(z, x=(width/2), y=(height/2)){
  dx = dx*zoom/z + zoom*x*(1/zoom - 1/z);
  dy = dy*zoom/z + zoom*y*(1/zoom - 1/z);
}
function zoomin(w,x=(width/2),y=height/2){
  let z = zoom;
  $('#switch-zoom')[0].checked = autozoom = false;
  zoom = w(zoom);
  if(zoom>100) zoom=100;
  if(zoom<1) zoom=1;
  fixzoom(z,x,y);
  return false;
}
function mouseWheel(event){
  if(mouseX<0 || mouseX>w || mouseY<0 || mouseY>h) return true;
  return zoomin(z=>z-event.delta,mouseX,mouseY);
}
function keyPressed(){
  if(key==='+') return zoomin(z=>z+5)
  if(key==='-') return zoomin(z=>z-5)
  if(key==='ArrowLeft'){ dx-=24*(zoom); return false;}
  if(key==='ArrowRight'){ dx+=24*(zoom); return false;}
  if(key==='ArrowUp'){ dy-=24*(zoom); return false;}
  if(key==='ArrowDown'){ dy+=24*(zoom); return false;}
  return true;
}

/*Captulo Dos, del movimiento del mouse y el arrastre del grafo*/
function inMouse(mouseX,mouseY){
  if(!document.elementFromPoint(mouseX,mouseY).classList.contains('canvas-click')) return change=false;
  if(mouseButton===LEFT){
    if(grafomode) nodoE(mouseX,mouseY);
    else{
      rcE(mouseX, mouseY);
      $('#switch-zoom')[0].checked = autozoom = false;
    }
    mx = mouseX;
    my = mouseY;
    px = dx;
    py = dy;
  } else if(mouseButton === CENTER){
    mx = mouseX;
    my = mouseY;
    px = dx;
    py = dy;
  }
  return change = true;
}
function touchStarted(){inMouse(mouseX,mouseY);return false;}
function mousePressed(){inMouse(mouseX,mouseY);return false;}
function mouseDragged(){
  if(!change) return true;
  if(grafomode){
    if( mouseButton===LEFT && select){
      layout.eachNode((n,p)=>{
        if(n.id == nodo){
          p.p.x = mouseX/zoom - dx/zoom - w/2;
          p.p.y = mouseY/zoom - dy/zoom - h/2;
        }
      });
    } else {
      $('#switch-zoom')[0].checked = autozoom = false;
    }
  } else {
    $('#switch-zoom')[0].checked = autozoom = false;
  }
  if(mouseButton === CENTER){
    dx = mouseX-mx+px;
    dy = mouseY-my+py;
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
  if(grafomode){
    $('#div-origin').show();
    matrizCfg.auto = autozoom;
    matrizCfg.dx = dx;
    matrizCfg.dy = dy;
    matrizCfg.z = zoom;
    autozoom = grafoCfg.auto;
    zoom = grafoCfg.z;
    dx = grafoCfg.dx;
    dy = grafoCfg.dy;
    $('#switch-zoom')[0].checked = autozoom;
  }else{
    $('#div-origin').hide();
    grafoCfg.auto = autozoom;
    grafoCfg.z = zoom;
    grafoCfg.dx = dx;
    grafoCfg.dy = dy;
    autozoom = matrizCfg.auto;
    dx = matrizCfg.dx;
    dy = matrizCfg.dy;
    zoom = matrizCfg.z;
    $('#switch-zoom')[0].checked = autozoom;
  }
}
function originSwitch(){
 origin = $('#switch-origin')[0].checked;
}
