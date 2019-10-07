let matriz = undefined, nodecount=0;
let selectedRow, selectedColumn;

function matrixRender(){
  if(!matriz) genMatriz();
  background(206);
  let di=0,dj=0;
  
  if(autozoom){
    zoom = min( width/(24*(nodecount+1)),height/(24*(nodecount+1)) );
    dx = (24-w/2)*zoom;
    dy = (24-h/2)*zoom;
  }

  textSize(15*zoom);
  fill(255);
  noStroke();
  for(let u in matriz){
    if(grafo.nodeSet[u]){
      textAlign(RIGHT,TOP);
      text(grafo.nodeSet[u].data.label,tX(0)-zoom,tY((dj++)*24));
      textAlign(RIGHT,BOTTOM);
      text(grafo.nodeSet[u].data.label,tX((dj)*24)-zoom,tY(0));
    }
  }
  
  dj=0;
  strokeWeight(1);
  stroke(28,39,53,100);
  for(let u in matriz){
    di = 0;
    for(let v in matriz[u]){
      let al = 100, x = tX(di*24)+zoom, y = tY(dj*24)+zoom;
      if(selectedColumn === v || selectedRow === u){
        al=205;
      }
      if(matriz[u][v]<=-1){
        fill(255,al);
      } else if(matriz[u][v]<=pesosDiv[0]){
        fill(2,39,53,al);
      } else if(matriz[u][v]<=pesosDiv[1]){
        fill(170,137,57,al);
      } else {
        fill(128,40,21,al);
      }
      if(selectedColumn === v || selectedRow === u){
        rect(x-zoom,y-zoom,24*zoom,24*zoom);
      } else {
        rect(x,y,22*zoom,22*zoom);
      }
      di++;
    }
    dj++;
  }
  
  di = dj = 0;
  textSize(8*zoom);
  textAlign(LEFT,TOP);
  fill(255);
  stroke(0);
  strokeWeight(zoom>4?4:zoom);
  for(let u in matriz){
    di = 0;
    for(let v in matriz[u]){
      let x = tX(di*24)+zoom, y = tY(dj*24)+zoom;
      if(selectedColumn === v || selectedRow === u){
        if(grafo.nodeSet[u] && grafo.nodeSet[v] && selectedRow === u && selectedColumn === v){
          text((matriz[u][v]<=-1?'~':matriz[u][v])+'\n('+grafo.nodeSet[u].data.label+','+grafo.nodeSet[v].data.label+')',x,y);
        } else {
          text((matriz[u][v]<=-1?'~':matriz[u][v]),x,y);
        }
      }
      di++;
    }
    dj++;
  }
  if(grafo.nodeSet[selectedRow] && grafo.nodeSet[selectedColumn] && selectedRow && selectedColumn){ 
    fill(0,120);
    rect(0,0,200,200);
    textSize(32);
    textAlign(LEFT,TOP);
    fill(255);
    stroke(0);
    strokeWeight(4);
    let u = selectedRow, v = selectedColumn;
    text('Peso:'+(matriz[u][v]<=-1?'~':matriz[u][v])+'\nFuente:'+grafo.nodeSet[u].data.label+'\nDestino:'+grafo.nodeSet[v].data.label,10,10);
  }
  return true;
}

function rcE(mouseX,mouseY){
  let di=0,dj=0, y0=tY(-24), yM=tY(nodecount*24), x0=tX(-24), xM=tX(nodecount*24);
  selectedRow = undefined; selectedColumn = undefined;
  for(let u in matriz){
    di = 0;
    for(let v in matriz[u]){
      let tx = tX(di*24), ty = tY(dj*24);
      if( mouseY>y0 && mouseY<yM && mouseX >= tx && mouseX <= tx+24*zoom){
        selectedColumn = v;
      }
      if( mouseX>x0 && mouseX<xM && mouseY >= ty && mouseY <= ty+24*zoom){
        selectedRow = u;
      }
      di++;
    }
    dj++;
  }
}

function genMatriz(){
  nodecount = 0;
  /*crea la matriz de adyacencia completa, aristas no existentes tiene peso -1*/
  let ids, idt, edge, label;
  matriz = {};
  for(let s in grafo.nodeSet){
    nodecount++;
    ids = grafo.nodeSet[s];
    if(!matriz[s]) matriz[s] = {};
    for(let t in grafo.nodeSet){
      idt = grafo.nodeSet[t];
      if(!matriz[t]) matriz[t]={};
      edge = grafo.getEdges(ids,idt);
      if(!edge[0])
        edge = grafo.getEdges(idt,ids);
      if(edge[0]){
        matriz[t][s] = matriz[s][t] = (edge[0].data.weight?edge[0].data.weight:1);
      } else {
        matriz[t][s] = matriz[s][t] = -1;
      }
    }
  }
  /*
  for(let u in matriz){
    let s = u+':';
    for(let v in matriz[u]){
      s += ' ' + v + '.' + matriz[u][v];;
    }
    console.log(s);
  }
  */
}
