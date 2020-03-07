$(() => {
    $(".headerOptions").hide();
 });

 function generateCode(){
    let code = "\n";
    code += generarTablas();
    code += generarFrames();
   return code;
   
}
function generarTablas(){
    let tempTable = "\n";
    nuevaPlantilla.getFrames().forEach(function (elemF, indexF, array) {
        tempTable += "/* BEGIN TemporalTable */ \n";
        tempTable += "define temp-table tt_" + elemF.getNombre() + " no-undo \n";
        elemF.getVariables().forEach(function (elemV, indexV, array) {    
            tempTable += "   field " + elemV.getNombre() +" as " + elemV.getTipo();
            if(elemV.getInitial() != "")
                tempTable += " init " + '"' +elemV.getInitial() + '"';
            if(elemV.getFormato()!= "")
                tempTable += " format " + '"'+ elemV.getFormato() + '"';   
                tempTable += "\n";
        });
        tempTable += ". \n";
        tempTable += "/* END TemporalTable */ \n";

    });
    return tempTable;
}
function generarFrames(){
    let frame = "\n";
    nuevaPlantilla.getFrames().forEach(function (elemF, indexF, array) {
        frame+= "/* BEGIN Frame */ \n";
        frame += "define frame " + elemF.getNombre() + " \n";
        elemF.getVariables().forEach(function (elemV, indexV, array) {
            frame += "   " + elemV.getNombre() +' label "' + elemV.getLabel()  +'" at row '+elemV.getFila()+' column '+elemV.getColumna()+' \n';
        });
        frame += "with "
        if(elemF.getEtiqueta() == 0) {
            frame += "side-labels ";
        }
        else if(elemF.getEtiqueta() == 1){
            frame += "no-label ";
        }
        if(elemF.getBorde() == 0) {
            frame += "no-box. \n";
        }
        else{
            frame += ". \n";
        }
        frame+= "/* END Frame */ \n";
    });
    return frame;
}

function guardarPlantilla(){
    /*
        ENLACE PARA DIALOG
        https://es.ourcodeworld.com/articulos/leer/41/como-escoger-leer-guardar-eliminar-o-crear-un-archivo-con-electron-framework
    */
    var app = require('electron').remote; 
    var dialog = app.dialog;
    let code = generateCode();
    let fs = require('fs');
    let dia = dialog.showSaveDialog();

    dia.then(file => {
        if (file.filePath === undefined){
            alert("Ha ocurrido un error al guardar el archivo");
            return;
        }
        fs.writeFile(file.filePath, code, function(err) {
            if (err) {
                alert(err);
            }
            else{
                let fileName = getFileName(file.filePath);
                nuevaPlantilla.setFileName(fileName);
                $("#title").empty();
                $("#title").append(nuevaPlantilla.getFileName());
                alert("Guardado correctamente");
            }
            
        });
    });
    // CODIGO ANTIGUO QUE GUARDA DIRECTAMENTE
    /* 
    let fs = require('fs');

    fs.writeFile("codeTest.txt", code, function(err) {
        if (err) {
            alert(err);
        }

        alert("El archivo codeTest.txt fue creado correctamente");
    });
    */
}
 function viewCode(){
    //$('#designer').hide();
    //$('#code').show();
    let code = generateCode();
    let count = (code.match(/(?:\r\n|\r|\n)/g) || []).length;
    //code = code.replace(/(?:\r\n|\r|\n)/g, '<br />');
    code = code.split("\n").join(" <br> ");
    $('#codeView').html(code);
    for(let i = 1; i<= count; i++){
        $('.line-numbers').append(''+i+'<br>')
    }
 }
 function getFileName(filePath){
    let i = filePath.length -1 ;
    let encontrado = false ;
    let fileName = "";
     while (i >= 0 && !encontrado){
        if(filePath[i] !== "\\")
            fileName = filePath[i] + fileName;
        else
            encontrado = true;
        i--;
     }
     return fileName;
 }
