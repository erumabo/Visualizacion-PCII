function descompone(arista){
  let [a,b] = arista.match(/([A-Za-z]+|\'[A-Za-z0-9]+\')/g)
      ,p,ws = arista.match(/[0-9]+/g);
  if(ws) p = ws.pop();
  else p = 1;
  return [a.replace(/'/g,""),b.replace(/'/g,""),+p];
}

function abrirGrafo(event){
  let reader = new FileReader();
  let nodos={};
  $('#inGrafoL').html(event.target.files[0].name);
  grafo =  new Springy.Graph();
  maxWeight = -Infinity;
  minWeight = Infinity;
  reader.onload = ()=>{
    let lines, mNodos, mAristas;
    lines = reader.result.split('\n');
    mNodos = lines.shift().match(/([A-Za-z]+|\'[A-Za-z0-9]+\')/g);
    if(mNodos)
      mNodos.forEach( nodo => nodos[nodo.replace(/'/g,"")] = grafo.newNode({'label':nodo.replace(/'/g,"")}).id );
    mAristas = lines.join().match(/\(([A-Za-z]+|\'[A-Za-z0-9]+\'),([A-Za-z]+|\'[A-Za-z0-9]+\')(,[0-9]+|,?)\)/g);
    if(mAristas)
      mAristas.forEach(arista=>{
        let [s,t,w] = descompone(arista);
        grafo.newEdge(grafo.nodeSet[nodos[s]],grafo.nodeSet[nodos[t]],{'weight':w,'s':s,'t':t});
        maxWeight = (w>maxWeight)?w:maxWeight;
        minWeight = (w<minWeight)?w:minWeight;
      });
    layout = new Springy.Layout.ForceDirected(grafo, 40.0, 400.0, 0.5);
    animate = true;
    $('#pesos-slider').slider('destroy');
    $('#pesos-slider').slider({
      range: true,
      min: minWeight-1,
      max: maxWeight+1,
      values: [minWeight,maxWeight],
      slide: cambioPesos
    });
    pesosDiv = [minWeight,maxWeight];
    $('#pesosDispl').html(` ${minWeight} > Liviano > ${minWeight} > Medio > ${maxWeight} > Pesado > ${maxWeight}`);
  };
  reader.readAsText(event.target.files[0]);
};

function cambioPesos(ev,ui){
  pesosDiv[0] = ui.values[0];
  pesosDiv[1] = ui.values[1];
  $('#pesosDispl').html(` ${minWeight} > Liviano > ${ui.values[0]} > Medio > ${ui.values[1]} > Pesado > ${maxWeight}`);
}

$(document).ready(()=>{
  $('#switch-origin')[0].checked = $('#switch-grafo')[0].checked = $('#switch-zoom')[0].checked=true;
  $('#pesos-slider').slider({
    range: true,
    min: 0,
    max: 120,
    values: [40,80],
    slide: cambioPesos,
  });
  $('#pesosDispl').html(` ${minWeight} > Liviano > ${minWeight} > Medio > ${maxWeight} > Pesado > ${maxWeight}`);
});
