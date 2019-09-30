function descompone(arista){
  let [a,b] = arista.match(/([A-Za-z]+|\'[A-Za-z0-9]+\')/g)
     ,p = arista.match(/[0-9]+/g).pop();
  return [a.replace(/'/g,""),b.replace(/'/g,""),+p];
}

function abrirGrafo(event){
  let input = event.target;
  let reader = new FileReader();
  let nodos={};
  $('#inGrafoL').html(input.files[0].name);
  grafo =  new Springy.Graph();
  maxWeight = -Infinity;
  minWeight = Infinity
  reader.onload = function(){
    let lines = reader.result.split('\n');
    let mNodos = lines[0].match(/([A-Za-z]+|\'[A-Za-z0-9]+\')/g)
    if(mNodos)  mNodos.forEach(nodo=>nodos[nodo.replace(/'/g,"")]=grafo.newNode({'label':nodo.replace(/'/g,"")}).id);
    let mAristas = lines[1].match(/([A-Za-z]+|\'[A-Za-z0-9]+\'),([A-Za-z]+|\'[A-Za-z0-9]+\'),[0-9]+/g)
    if(mAristas) mAristas.forEach(arista=>{
      let [s,t,w] = descompone(arista);
      grafo.newEdge(grafo.nodeSet[nodos[s]],grafo.nodeSet[nodos[t]],{'weight':w,'s':s,'t':t});
      maxWeight = (w>maxWeight)?w:maxWeight;
      minWeight = (w<minWeight)?w:minWeight;
      console.log(minWeight,maxWeight);
    });
    layout = new Springy.Layout.ForceDirected(grafo, 40.0, 400.0, 0.5);
    autozoom = true;
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
  reader.readAsText(input.files[0]);
};

function cambioPesos(ev,ui){
  pesosDiv[0] = ui.values[0];
  pesosDiv[1] = ui.values[1];
  $('#pesosDispl').html(` ${minWeight} > Liviano > ${ui.values[0]} > Medio > ${ui.values[1]} > Pesado > ${maxWeight}`);
}

$(document).ready(()=>{
  $('#pesos-slider').slider({
    range: true,
    min: 0,
    max: 120,
    values: [40,80],
    slide: cambioPesos,
  });
  $('#pesosDispl').html(` ${minWeight} > Liviano > ${minWeight} > Medio > ${maxWeight} > Pesado > ${maxWeight}`);
})
