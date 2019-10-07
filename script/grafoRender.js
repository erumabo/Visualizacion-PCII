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

function graforender(){
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
    let wh = min(w,h), hw = max(w,h);
    if(abs(Mx-mx)<abs(My-my)){
      zoom = wh/(My-my+4);
      M = My;
    } else {
      zoom = wh/(Mx-mx+4);
      M = Mx;
    }
    dx = ((Mx+mx+w)/2)*(1-zoom);
    dy = ((My+my+h)/2)*(1-zoom);
  }
  if(origin){
    strokeWeight(1);
    stroke(0);
    line(tX(0),tY(-h),tX(0),tY(h));
    line(tX(-w),tY(0),tX(w),tY(0));
    fill(255);
    ellipse(tX(0),tY(0),5);
  }
  layout.eachEdge((e,s)=>{
    if(e.data.weight<=pesosDiv[0]){
      strokeWeight(zoom*0.2);
      stroke(2,39,53,100);
    } else if(e.data.weight<=pesosDiv[1]){
      strokeWeight(zoom*0.4);
      stroke(170,137,57,100);
    } else {
      strokeWeight(zoom*0.6);
      stroke(128,40,21,100);
    }
    if(select && (e.source.id==nodo || e.target.id==nodo)) {
      stroke(0,0,0,200);
    }
    line(tX(s.point1.p.x),tY(s.point1.p.y),tX(s.point2.p.x),tY(s.point2.p.y));
  });
  textAlign(LEFT,BOTTOM); 
  layout.eachNode((n,p)=>{
    if(select && n.id == nodo){
      fill(55,52,69,200);
      stroke(0);
      strokeWeight(3);
      ellipse(tX(p.p.x),tY(p.p.y),2*zoom+4);
    } else {
      fill(0,0,0,100);
      noStroke();
      ellipse(tX(p.p.x),tY(p.p.y),2*zoom);
    }
    if(zoom>=3){
      textSize(15+zoom);
      fill(255);
      text(n.data.label,tX(p.p.x),tY(p.p.y));
    }
  });
}
