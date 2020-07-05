
exports.validateNewFrame = function validateNewFrame(frameInfo, callback){

    let encontrado = false;
    if (frameInfo["nombre"] == ""){
        callback("Nombre de frame vacío, debe rellenar este campo");
    }
    else{
        nuevaPlantilla.getFrames().forEach(function (elemF, indexF, array) {
            if (elemF.getNombre() == frameInfo["nombre"]){
                encontrado = true;
            }
        });
        if (encontrado){
            callback("Nombre de frame ya existente, elija otro");
        }
        else
        callback("Ok");
    }
    
}
exports.validateEditFrame = function validateEditFrame(frameInfoOld,frameInfoNew, callback){

    let encontrado = false;
    if (frameInfoNew["name"] === ""){
        callback("Nombre de frame vacío, debe rellenar este campo");
    }
    else{
        if(frameInfoNew["name"] !== frameInfoOld["name"]){ //Si ha cambiado el nombre, compruebo que no sea uno existente
            nuevaPlantilla.getFrames().forEach(function (elemF, indexF, array) {
                if (elemF.getNombre() == frameInfoNew["name"]){
                    encontrado = true;
                }
            });
        }
        if (encontrado){
            callback("Nombre de frame ya existente, elija otro");
        }
        else
        callback("Ok");
    }
    
}
exports.validateNewVar = function validateNewVar(varInfo, idFrame, callback){
    //validaciones["nombre"]=nombre ; validaciones[1]=valor inicial coincide con formato; 
    let validaciones={
        "nombre": null,
        "ini": null
    };
    
    let encontrado = false;
    if (varInfo["name"] == ""){
        validaciones["nombre"]="vacio";
        //callback("Nombre de variable vacío, debe rellenar este campo");
    }
    else{
        let frames=nuevaPlantilla.getFrames();
        //variable en frame de entrada
        if(nuevaPlantilla.getFrame(idFrame).getTipo()==0){
            for(let frame of frames){
                if(frame.getTipo()==0){
                    frame.getVariables().forEach(function (elemF, indexF, array) {
                        if (elemF.getNombre() == varInfo["name"]){
                            //encontrado = true;
                            validaciones["nombre"]="repetido"
                        }
                    })
                }
            }
        }else{
            nuevaPlantilla.getFrame(idFrame).getVariables().forEach(function (elemF, indexF, array) {
                if (elemF.getNombre() == varInfo["name"]){
                    //encontrado = true;
                    validaciones["nombre"]="repetido"
                }
            });
        }
       
        /*if (encontrado){
            callback("Nombre de variable ya existente, elija otro");
            validaciones[0]="repetido"
        }
        else
        callback("Ok");*/
    }
    
    if(varInfo["type"]=="integer"){ //integer
        
        validaciones["ini"]=!isNaN(varInfo["initial"]);
        if(validaciones["ini"]){
            varInfo["tam"]=Math.max(8,varInfo["initial"].toString().length);
            varInfo["initial"]=parseInt(varInfo["initial"]).toFixed();
        }
        
    }else if(varInfo["type"]=="date"){//date
        //console.log("date initial:",varInfo["initial"]);
        //console.log("date format:",varInfo["format"]);
        validaciones["ini"]=isValidDate(varInfo["initial"],varInfo["format"]);
            
    } else if(varInfo["type"]=="decimal"){//decimal
        let initial=!isNaN(varInfo["initial"]);
        let decimal=!isNaN(varInfo["decimal"]);
        if(initial && decimal){
            if(parseInt(decimal)<=0){
                varInfo["decimal"]=1;
            }else{
                varInfo["decimal"]=parseInt(varInfo["decimal"]);
            }
            varInfo["initial"]=parseFloat(varInfo["initial"]).toFixed(parseInt(varInfo["decimal"]));
            varInfo["format"]=getFormatDecimal(parseInt(varInfo["decimal"]));
            varInfo["tam"]=varInfo["initial"].toString().length;
        }else if(initial==false && decimal){
            validaciones["ini"]="decimalInitial";
        }else if(initial==false && decimal==false){
            validaciones["ini"]="ini&decimal";
        }else{
            validaciones["ini"]="decimal"
        }

    }else if(varInfo["type"]=="character"){
        if(!isNaN(varInfo["format"])){
            if(parseInt(varInfo["format"])<=0){
                varInfo["format"]='x(8)';
            }else{
                varInfo["tam"]=parseInt(varInfo["format"]);
                varInfo["format"]='x('+parseInt(varInfo["format"])+')';
                
            }
        }else{
            validaciones["ini"]="character";
        }
    }
    else if(varInfo["type"]=="logical"){
        if (varInfo["initial"] != "true" && varInfo["initial"] != "false")
            validaciones["ini"]="logical";
    }
    if(validaciones["nombre"]=="vacio"){
        callback("Nombre de variable vacío, debe rellenar este campo");
    }else if(validaciones["nombre"]=="repetido"){
        callback("Nombre de variable ya existente, elija otro");
    }else if(validaciones["ini"]==false){
        callback("Valor inicial no corresponde con el tipo elegido");
    }else if(validaciones["ini"]=="decimalInitial"){
        callback("Valor inicial no corresponde con el tipo elegido");
    }else if(validaciones["ini"]=="ini&decimal"){
        callback("Valor inicial no corresponde con el tipo elegido y valor decimal debe ser un número");
    }else if(validaciones["ini"]=="decimal"){
        callback("Valor decimal debe ser un número");
    }else if(validaciones["ini"]=="character"){
        callback("Formato incorrecto");
    }else if(validaciones["ini"]=="logical"){
        callback("El valor inicial debe ser true o false para variables logical");
    }else{
        callback("Ok");
    }
    
}

function isValidDate(dateString,format)
{   
    console.log("date que me llega: ", dateString);
    console.log("formato que me llega: ", format);
    var parts = dateString.split("/");
    if(format=="dd/mm/yyyy" || format=="dd/mm/yy"){
        if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString) )
            return false;
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10);
        var year = parseInt(parts[2], 10);
    }else if(format=="mm/dd/yyyy" || format=="mm/dd/yy"){
        if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString) )
            return false;
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);
    }else if(format=="yyyy/mm/dd" || format=="yy/mm/dd"){
        if(!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString)){
            return false;
        }
        var day = parseInt(parts[2], 10);
        var month = parseInt(parts[1], 10);
        var year = parseInt(parts[0], 10);
    }else{
        return false;
    }
    
    // Creamos rangos para años y meses
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Ajustamos años bisisestos
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Comprobamos el día con el mes
    return day > 0 && day <= monthLength[month - 1];
};


function getFormatDecimal(parteDecimal){
    // 9<<<<<<<<
    let format = "->,>>>,>>9."
    for(let i = 0; i < parteDecimal; i++){
      format += "9";
    }
    for (let j = parteDecimal; j < 10; j++){
      format +="<";
    }
    
    return format;
  }

exports.validateEditVar= function validateEditVar(idFrame, varInfoOld,validateEditVar, callback){
    let encontrado = false;
    if (validateEditVar["name"] === ""){
        callback("Nombre de variable vacío, debe rellenar este campo");
    }
    else{
        if(validateEditVar["name"] !== varInfoOld["name"]){ //Si ha cambiado el nombre, compruebo que no sea uno existente
            nuevaPlantilla.getFrame(idFrame).getVariables().forEach(function (elemF, indexF, array) {
                if (elemF.getNombre() == validateEditVar["name"]){
                    encontrado = true;
                }
            });
        }
        if (encontrado){
            callback("Nombre de variable ya existente, elija otro");
        }
        else
        callback("Ok");
    }
    
}