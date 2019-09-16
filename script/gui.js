function abrirAristas(event){
  let input = event.target;
  let reader = new FileReader();
  $('#inAristasL').html(input.files[0].name);
  reader.onload = function(){
    let lines = reader.result.split('\n');
    for(const line of lines){
      console.log(line.match(/[A-Z]/g));
      console.log(line.match(/[0-9]+/g));
    }
  };
  reader.readAsText(input.files[0]);
};

function abrirNodos(event){
  let input = event.target;
  let reader = new FileReader();
  $('#inVertexL').html(input.files[0].name);
  reader.onload = function(){
    let lines = reader.result.split('\n');
    for(const line of lines){
      console.log(line.match(/[A-Z]/g));
    }
  };
  reader.readAsText(input.files[0]);
};

function cambioPesos(){
  
}
