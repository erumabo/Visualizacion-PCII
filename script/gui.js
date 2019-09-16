function abrirArchivo(event){
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){
  var text = reader.result;
    console.log(text);
  };
  reader.readAsText(input.files[0]);
};

function cambioPesos(){
  
}
