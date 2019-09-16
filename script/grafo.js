class Grafo {
  constructor(){
    this.V = [];/*lista de objetos que corresponden a los nodos*/
    this.E = [];/*array de objetos que representa las aristas  */
  }
  inV(nodo){
    var index = this.V.push(nodo)-1;
    this.V[index].index = index;
    this.E.push(new Map([[index,1]]));
  }
  inE(u,v,w){
    this.E[u].set(v,w);
    this.E[v].set(u,w);
  }
  outV(index){
    this.V.splice(index,1); /*Remove vertex*/
    for(let i=index-1; i<this.V.length;++i)
      this.V[i].index=i; /*fix index*/
    this.E.splice(index,1); /*Remove edges*/
    for(let i=0;i<this.E.length;++i){ /*for every element*/
      for(let j=index+1;j<this.E.length;++j){ /*for every possible conection above the removed one*/
        if(this.E[i].has(j)){ /*conection exists*/
          this.E[i].set(j-1,this.E[i].get(j)); /*must shift every conection from index+1 one position before*/
          this.E[i].delete(j); /*coenction no loger E*/
        }
      }
    }
  }
  outE(u,v){
    if(this.E[u] && this.E[u].has(v)) this.E[u].delete(v);  
    if(this.E[v] && this.E[v].has(u)) this.E[v].delete(u);
  }
  print(){
    for(const V of this.V) console.log(V);
    for(let u=0;u<this.E.length;++u){
      let s="";
      for(let [v,w] of this.E[u]) s = s + " " +u+"->"+v+":"+w;
      console.log(s);
    }
  }
}

grafo = new Grafo();
/*je, la relacion rColorc es un grafo tambien*/
grafo.inV({'value':'r0c0','color':'purple','x':0,'y':0,});
grafo.inV({'value':'r1c0','color':'green', 'x':0,'y':1,});
grafo.inV({'value':'r2c0','color':'purple','x':0,'y':2,});
grafo.inV({'value':'r3c0','color':'green', 'x':0,'y':3,});
grafo.inV({'value':'r4c0','color':'purple','x':0,'y':4,});
grafo.inV({'value':'r1c1','color':'red',   'x':1,'y':1,});
grafo.inV({'value':'r2c1','color':'orange','x':1,'y':2,});
grafo.inV({'value':'r3c1','color':'red',   'x':1,'y':3,});
grafo.inV({'value':'r4c1','color':'orange','x':1,'y':4,});
grafo.inV({'value':'r2c2','color':'purple','x':2,'y':2,});
grafo.inV({'value':'r3c2','color':'green', 'x':2,'y':3,});
grafo.inV({'value':'r4c2','color':'purple','x':2,'y':4,});
grafo.inV({'value':'r3c3','color':'red',   'x':3,'y':3,});
grafo.inV({'value':'r4c3','color':'orange','x':3,'y':4,});
grafo.inV({'value':'r4c4','color':'purple','x':4,'y':4,});

grafo.inE(0,2,1);
grafo.inE(0,9,5);
grafo.inE(2,4,3);
grafo.inE(2,9,6);
grafo.inE(2,11,7);
grafo.inE(4,11,8);
grafo.inE(9,11,10);
grafo.inE(14,9,12);
grafo.inE(14,11,13);

