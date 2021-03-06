'use strict'
let pathFrame = path.join(__dirname,'../js/classFrame.js')
const classFrame = require(pathFrame)
class Progress{
    constructor(){
        this.idFrames = 1; //inicializamos ids a 1
        this.frames = new Map(); //inicializamos map de frames
        this.fileName = "Sin título.p" //inicializamos el nombre del archivo al crearse desde cero
    }
    //LLamamos al constructor de la clase frame para crear un nuevo frame, lo metemos en nuestro array y actualizamos idFrames
    addFrame(name, title, type){ 
        let newFrame = new classFrame.Frame(this.idFrames,name,title,type);
        this.frames.set(this.idFrames,newFrame);
        this.idFrames ++;
        return this.idFrames -1;
    }
    addVartoFrame(idFrame,varInfo){
        let frame = this.frames.get(parseInt(idFrame));
        return frame.addVariable(varInfo['name'],varInfo['type'],varInfo['format'],varInfo['label'],varInfo['initial'], varInfo['tam']);
    }
    addVartoFrameRead(idFrame,varInfo){
        let frame = this.frames.get(parseInt(idFrame));
        /* console.log("variable que me llega: ", varInfo); */
        return frame.addVariableRead(varInfo['name'],varInfo['type'],varInfo['format'],varInfo['label'],varInfo['initial'],varInfo['col'],varInfo['row'],varInfo['movido'],varInfo['tam']);
    }
    addVartoOutputFrame(idFrame,varInfo){
        let frame = this.frames.get(parseInt(idFrame));
        let id = frame.addVariable(varInfo['name'],varInfo['type'],varInfo['format'],varInfo['label'],varInfo['initial'],0);
        frame.addVariableOutput(id);
        return id;
    }
    getFrames(){
        return this.frames;
    }
    getFrame(idFrame){
        return this.frames.get(parseInt(idFrame));
    }
    getFileName(){
        return this.fileName;
    }
    setFileName(fileName){
        this.fileName = fileName;
    }
    deleteFrame(idFrame){
        this.frames.delete(parseInt(idFrame));
    }
    deleteVariable(idFrame, idVar){
        this.frames.get(parseInt(idFrame)).deleteVariable(idVar);
    }
    editFrame(idFrame, newData){
        let frame = this.frames.get(parseInt(idFrame));
        frame.editData(newData);
    }
    getVariableByKey(idFrame,keyVar){
        let frame=this.frames.get(parseInt(idFrame));
        return frame.getVariable(keyVar);
    }
}
module.exports = {
    Progress:Progress
}