
var parserTable = require(path.join(__dirname,'../js/tempTable.js'));
var parserForm  = require(path.join(__dirname,'../js/form.js'));
var parserVars  = require(path.join(__dirname,'../js/vars.js'));

exports.parserCode = function parserCode(code, callback){
    let lineas = code.split('\n');
    let tablas = new Map();
    let frames = new Map();
    let vars   = new Map();
    let saveTable = 0;
    let saveFrameInput = 0;
    let saveFrameOutput = 0;
    let saveVars = 0;
    let actualTable;
    let actualFrame;
    let codeToParserT = "";
    let codeToParserF = "";
    let codeToParserV = "";
    let errorMSg = "";
    for(let linea of lineas) {
        if(saveVars == 0 && linea.includes("/* BEGIN VARS Autogenerated */")){
            saveVars = 1;
            continue;
        }
        if(saveVars == 1){//GUARDAMOS LINEAS Hasta fin de vars
            if(!linea.includes("/* END VARS Autogenerated */")){
                codeToParserV = codeToParserV + linea;
            }
            else{
                try {
                    actualVars=parserVars.parse(codeToParserV);
                    actualVars.forEach(element =>{
                      vars.set(element.vars.name,element.vars.opciones);
                    });
                  }
                  catch(err) {
                    errorMSg= err;
                  }
                  finally {
                    saveVars = 0;
                    codeToParserV = "";
                  }
            }
        }
        if(saveTable == 0 && linea.includes("/* BEGIN TemporalTable Autogenerated */")){
            saveTable = 1;
            continue;
        }
        if(saveTable == 1){//GUARDAMOS LINEAS Hasta fin de tabla
            if(!linea.includes("/* END TemporalTable Autogenerated */")){
                codeToParserT = codeToParserT + linea;
            }
            else{
                try {
                    actualTable=parserTable.parse(codeToParserT);
                    tablas.set(actualTable.name,actualTable.campos);
                  }
                  catch(err) {
                    errorMSg= err;
                    //alert("Error temp-table: " + err + ".");
                  }
                  finally {
                    saveTable = 0;
                    codeToParserT = "";
                  }
            }
        }
        if(saveFrameInput == 0 && linea.includes("/* BEGIN INPUT Frame Autogenerated */")){
            saveFrameInput = 1;
            continue;
        }
        if(saveFrameInput == 1){
            if(!linea.includes("/* END INPUT Frame Autogenerated */")){
                codeToParserF = codeToParserF + linea;
            }
            else{
                try {
                    actualFrame=parserForm.parse(codeToParserF);
                    let dataFrame = {
                        lines:actualFrame.lines,
                        title:actualFrame.dataFrame.title,
                        type: 0
                    }
                    frames.set(actualFrame.dataFrame.name,dataFrame);
                  }
                  catch(err) {
                    errorMSg= err;
                    //alert("Error frame: " + err + ".");
                  }
                  finally {
                    saveFrameInput = 0;
                    codeToParserF = "";
                  }
            }
        }
        
        if(saveFrameOutput == 0 && linea.includes("/* BEGIN OUTPUT Frame Autogenerated */")){
          saveFrameOutput = 1;
          continue;
      }
      if(saveFrameOutput == 1){
          if(!linea.includes("/* END OUTPUT Frame Autogenerated */")){
              codeToParserF = codeToParserF + linea;
          }
          else{
              try {
                  actualFrame=parserForm.parse(codeToParserF);
                  let dataFrame = {
                      lines:actualFrame.lines,
                      title:actualFrame.dataFrame.title,
                      type: 1
                  }
                  frames.set(actualFrame.dataFrame.name,dataFrame);
                }
                catch(err) {
                  errorMSg= err;
                  //alert("Error frame: " + err + ".");
                }
                finally {
                  saveFrameInput = 0;
                  codeToParserF = "";
                }
          }
      }
    }
    callback(errorMSg,tablas,frames,vars);
    //console.log(tablas);
    //console.log(frames);
}