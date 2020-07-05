
let pathFrame = path.join(__dirname,'../assets/js/classFrame.js')
const validation=require(path.join(__dirname,'../assets/js/validation.js'));
const classFrame = require(pathFrame)

$(() => {
  $('.editEnabled').hide();
  $('.inputFrame').hide();
  $('#outputFrame').hide();
});

var vista;
let posx=0;
let posy=0;
let oldx=0;
let objetoMover=null;
let filasdis=24;
let columnasdis=9;
let porcentaje=0.94;


/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */
// target elements with the "draggable" class
interact('.draggable')
.draggable({
  // enable inertial throwing
  inertia: true,
  // keep the element within the area of it's parent
  modifiers: [
    interact.modifiers.restrictRect({
      //restriction: 'parent',
      restriction: document.getElementById("inner-dropzone"),
      
      endOnly: false
    })
  ],
  // enable autoScroll
  autoScroll: true,

  // call this function on every dragmove event
  onmove: dragMoveListener,
  // call this function on every dragend event
  onend: function (event) {
    var textEl = event.target.querySelector('p')
    textEl && (textEl.textContent =
      'moved a distance of ' +
      (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                  Math.pow(event.pageY - event.y0, 2) | 0))
        .toFixed(2) + 'px')
  }
})

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  posx=x;
  posy=y;

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
  }

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener

//*********************************************/
//INICIO CONTROLAMOS LAS FLECHAS
//*********************************************/
/*$(documetn).ready(function() {
  $('.drag-drop').onkeydown = detectKey;
});*/

document.onkeydown = detectKey;
//document.addEventListener('onkeydown', detectKey);

function detectKey(e) {
  let idFrame = $("#frames option:selected").attr('value');
  let objeto= nuevaPlantilla.getFrame(idFrame).getVariable($('#'+objetoMover.id).attr('key'));
  let tipo=nuevaPlantilla.getFrame(idFrame).getTipo();
  e = e || window.event;
  var target = e.target || e.srcElement;
  var targetTagName = (target.nodeType == 1) ? target.nodeName.toUpperCase() : "";
  let x=objeto.getPosition()['x'];
  let y=objeto.getPosition()['y'];
  posx=x;
  posy=y;
  let obj= document.getElementById(objeto["name"]);
  if(objeto["movido"]==1 && tipo == "input"){

    if ( !/INPUT|SELECT|TEXTAREA/.test(targetTagName) ) { 
      if (e.keyCode == '38') {
          // up arrow
          let daty = y - filasdis;
          posy=daty;
          if(daty>porcentaje*(document.getElementById('inner-dropzone').offsetTop)){
            calcularPosicionesFlechas(objeto, obj,x,daty);
          }      
      }
      else if (e.keyCode == '40') {
          // down arrow
          let daty = y + filasdis;
          posy=daty;
          if(daty+obj.offsetHeight<document.getElementById('inner-dropzone').offsetTop+document.getElementById('inner-dropzone').offsetHeight){
            calcularPosicionesFlechas(objeto, obj,x,daty);
          }
      }
      else if (e.keyCode == '37') {
         // left arrow
          let datx =x - columnasdis;
          console.log("datx:",datx);
          posx=datx;
          if(datx+ obj.offsetLeft>porcentaje*(document.getElementById('inner-dropzone').offsetLeft)){
            calcularPosicionesFlechas(objeto, obj,datx,y);
          }  
      }
      else if (e.keyCode == '39') {
         // right arrow
          let datx = x + columnasdis;
          posx=datx;
          if(datx+obj.offsetWidth+obj.offsetLeft<document.getElementById('inner-dropzone').offsetLeft+document.getElementById('inner-dropzone').offsetWidth){
            calcularPosicionesFlechas(objeto, obj,datx,y);
          }
      }
    }

  }

  function calcularPosicionesFlechas(objeto, objetodiv, datx, daty){
    calcularFilaColumna(objetodiv,objeto);
    objetodiv.setAttribute('data-y', daty);
    objetodiv.setAttribute('data-x', datx);
    objetodiv.style.webkitTransform =
    objetodiv.style.transform =
      'translate(' + datx + 'px, ' + daty + 'px)'
    objeto.setPosition(datx,daty);
  }

  /*$('#'+objetoMover.id).setAttribute('data-x', datx);
          objeto.setAttribute('data-y', daty);
          // translate the element
          objeto.style.webkitTransform =
          objeto.style.transform =
            'translate(' + datx + 'px, ' + daty + 'px)'*/
  
  
}

//*********************************************/
//FIN DE ONTROLAMOS LAS FLECHAS
//*********************************************/


 // enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    //accept: '#yes-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: porcentaje,
  
    // listen for drop related events:
  
    ondropactivate: function (event) {
      // add active dropzone feedback
      event.target.classList.add('drop-active')
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget
      var dropzoneElement = event.target
  
      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
      //draggableElement.textContent = 'Dragged in'
    },
    ondragleave: function (event) {
      // remove the drop feedback style
      event.target.classList.remove('drop-target')
      event.relatedTarget.classList.remove('can-drop')
      //alert('No puedes sacar el objeto fuera de la zona');
      //event.relatedTarget.textContent = 'Dragged out'
    },
    ondrop: function (event) {
      let idFrame = $("#frames option:selected").attr('value');
      //event.relatedTarget.textContent = 'Dropped'
      console.log('x:' +posx + ' y:' + posy);
      //var style = window.getComputedStyle(myElement);
      //console.log('eventdx:',event.dx);
      var target = event.relatedTarget;
      var varid=target.getAttribute('id');
      var zone = document.getElementById('inner-dropzone');
      //var movido=target.getAttribute('movido');
      var objeto=document.getElementById(varid);
      var key= objeto.getAttribute("key");
      var variable=nuevaPlantilla.getVariableByKey(idFrame,key);
      
      //var variable=null;
      console.log('cordenadas izquierda:',objeto.offsetLeft,' coordenadas superiores:',objeto.offsetTop);
      
      console.log('zona iz:', zone.offsetLeft,' zona top:',zone.offsetTop);
      //var divmov='<div id="'+varid+'" class="'+varvar+'"><a href="#" onclick="createEditPanel('+infoVar["id"]+')" class="label label-default" title="'+infoVar["name"]+'"><label class ="labelVar">'+infoVar["label"]+':</label><input class ="inputVar field left" type="text" value="'+infoVar["initial"]+'" size="8"readonly></a></div>';
      //var divmov='<div id="'+varid+'"></div>'
      //$("#movend").append(divmov);
      //if(movido==0){
      if(variable['movido']==0){
        var objcln=objeto.cloneNode(true);
        $('#movend').append(objcln);
        posx=parseInt(objeto.getAttribute('data-x'));
        posy=parseInt(objeto.getAttribute('data-y'));
        console.log('zona iz:', zone.offsetLeft,' zona top:',zone.offsetTop);

        // x=objeto.offsetLeft+posx
        //                          -> dataX=posx+objeto.offsetLeft-clone.offsetLeft
        // x=clone.offsetLeft+dataX
        var x1=posx+objeto.offsetLeft-objcln.offsetLeft;

        // y=objeto.offsetTop+posy
        //                          -> datay=posy+objeto.offsetTop+clone.offsetTop
        // y=datay-clone.offsetTop
        var y1=posy+objeto.offsetTop+objcln.offsetTop;
        
        // translate the element
        objcln.style.webkitTransform =
        objcln.style.transform =
          'translate(' + x1 + 'px, ' + y1 + 'px)'
        // update the posiion attributes
        objcln.setAttribute('data-x', x1)
        objcln.setAttribute('data-y', y1)
        //objcln.setAttribute('movido',1)
        objeto.parentNode.removeChild(objeto);
        console.log('nueva cordenadas izquierda:',objcln.offsetLeft,' nueva coordenadas superiores:',objcln.offsetTop);
      //console.log(varid);
        //let key= objcln.getAttribute("key")
        //variable=nuevaPlantilla.getVariableByKey(idFrame,key);
        variable.setMovido();      
        //variable.setPosition(x1,y1);
        
        objeto=document.getElementById(varid);
        posx=x1;
        posy=y1;
      }else{       
        let key= objeto.getAttribute("key")
        variable=nuevaPlantilla.getVariableByKey(idFrame,key);
        //variable.setPosition(posx,posy);
        //console.log(variable);
      }
      //calculo columna y fila
      //calcularFilaColumna(objeto, variable);
      var col=Math.round((objeto.offsetLeft+posx-zone.offsetLeft)/columnasdis);
      var fil=Math.round((objeto.offsetTop+posy-zone.offsetTop)/filasdis);
      console.log('fila:',fil,'col:',col);
      variable.setFilaCol(fil,col);


      let datx=(col*columnasdis+zone.offsetLeft)-objeto.offsetLeft;
      let daty=(fil*filasdis+zone.offsetTop)-objeto.offsetTop;
      objeto.setAttribute('data-x', datx);
      objeto.setAttribute('data-y', daty);
          // translate the element
      objeto.style.webkitTransform =
      objeto.style.transform =
        'translate(' + datx + 'px, ' + daty + 'px)'
      posx=datx;
      posy=daty;
      variable.setPosition(posx,posy);

      console.log(variable);
      createEditPanel(variable.id); 
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
    }
    
})
var x = 0; var y = 0
interact('.drag-drop')
  .draggable({
    
    modifiers: [
      interact.modifiers.restrict({
        //restriction: 'parent',
        //restriction: [{x: 0, y: 0, width: 441, height: 826}],
        //restriction: '#prueba',
        restriction: document.getElementById("inner-dropzone"),
        endOnly: false
      }),
      interact.modifiers.snap({
        targets: [
          interact.createSnapGrid({ x: columnasdis, y: filasdis })
        ],
        range: Infinity,
        relativePoints: [ { x: 0, y: 0 } ]
      })
    ],
    inertia: true,
    //autoScroll: true,
    // dragMoveListener from the dragging demo above
    onmove: dragMoveListener,

    onend: function (event) {
      let idFrame = $("#frames option:selected").attr('value');
      let target = event.currentTarget;
      console.log(event);
      let varid=target.getAttribute('id');
      let zone = document.getElementById('inner-dropzone');
      //var movido=target.getAttribute('movido');
      let objeto=document.getElementById(varid);
      let key= objeto.getAttribute("key");
      console.log('id: '+varid+' key: '+key+' frame: '+idFrame);
      let variable=nuevaPlantilla.getVariableByKey(idFrame,key);
      console.log('ancho zona: '+zone.offsetWidth);
      console.log('alto zona: '+zone.offsetHeight);
      let posright=posx+objeto.offsetWidth+objeto.offsetLeft;
      let posbottom=posy+objeto.offsetHeight+objeto.offsetTop;
      
      if(variable['movido']==0){
        
        //Controlamos las X y las Y
        if(posright>(zone.offsetWidth+zone.offsetLeft) || (objeto.offsetLeft+posx)<zone.offsetLeft || (objeto.offsetTop+posy)<zone.offsetTop || posbottom>(zone.offsetHeight+zone.offsetTop)) {
          
          objeto.style.webkitTransform =
          objeto.style.transform =
          'translate(' + 0 + 'px, ' + 0 + 'px)'
          objeto.setAttribute('data-x', 0)
          objeto.setAttribute('data-y', 0)

        }
        
      }else{
        if(posright>(zone.offsetWidth+zone.offsetLeft) || (objeto.offsetLeft+posx)<zone.offsetLeft || (objeto.offsetTop+posy)<zone.offsetTop || posbottom>(zone.offsetHeight+zone.offsetTop)){
          
          let datx=(variable["columna"]*columnasdis+document.getElementById('inner-dropzone').offsetLeft)-document.getElementById(variable["name"]).offsetLeft;
          let daty=(variable["fila"]*filasdis+document.getElementById('inner-dropzone').offsetTop)-document.getElementById(variable["name"]).offsetTop;
          objeto.setAttribute('data-x', datx);
          objeto.setAttribute('data-y', daty);
          // translate the element
          objeto.style.webkitTransform =
          objeto.style.transform =
            'translate(' + datx + 'px, ' + daty + 'px)'

        }
      }

   
    }
  })
function calcularFilaColumna(objeto, variable){
  let zone=document.getElementById('inner-dropzone');
  var col=Math.round((objeto.offsetLeft+posx-zone.offsetLeft)/columnasdis);
  var fil=Math.round((objeto.offsetTop+posy-zone.offsetTop)/filasdis);
  console.log('fila:',fil,'col:',col);
  variable.setFilaCol(fil,col);
  //console.log("cakcyka",variable)
  createEditPanel(variable.id); 
}

btnAnyadirFrame.addEventListener('click',function(){
  let e = document.getElementById("tipoFrame");
  var tipo= e.options[e.selectedIndex].value;
  let frameInfo = {
    nombre: document.getElementById('nombreFrame').value,
    titulo: document.getElementById('tituloFrame').value,
    tipo: tipo
  }

  validation.validateNewFrame(frameInfo, function(message) { 
    $('.errorFrame').empty();
    if ("Ok" === message) {
      let idFrame = nuevaPlantilla.addFrame(frameInfo['nombre'],frameInfo['titulo'],frameInfo['tipo']); 
      //seleccionamos frame para mostrar
      $('#frames').append('<option value= "'+idFrame+'">'+frameInfo['nombre']+'</option>');
      $("#frames option:selected").removeAttr("selected");
      $('#frames option[value="'+idFrame+'"]').prop("selected",true);
      //cargamos datos del frame
      cargarFrame(idFrame);
      $('#nombreFrame').val("");
      cerrarModal("#modalNewFrame");
    } else {
      //mostramos mensaje de error
      $('.errorFrame').append(message);
    }
  })
})
function vaciarVariables(){
   //borramos datos del frame anterior
  $('#movend').empty();
  $('#varsMov').empty();
}

function cerrarModal(idModal){
  $(idModal).modal('hide');//ocultamos el modal
  $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
  $('.modal-backdrop').remove();//eliminamos el backdrop del modal

}
//AL CAMBIAR DE FRAME CARGAR VISTA DE NUEVO FRAME CON SUS VARIABLES
$(document).on('change', '#frames', function(event) {
  let id = $("#frames option:selected").attr('value');
  cargarFrame(id);
});
btnAnyadirVar.addEventListener('click',function(){
  let tipo = $("#tipoVar option:selected").attr('value');
  let varInfo;
  if(tipo == "integer"){
    let ini=document.getElementById('valorInicial').value;
    if(ini==""){
      ini= parseInt(0);
    }
    varInfo = {
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: ini,
      format: "->,>>>,>>9",
      tam: 8
    }

    /*let ini = parseInt(document.getElementById('valorInicial').value);
    if(isNaN(ini))
      ini = 0;
    varInfo = {
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: ini.toFixed(),
      format: "->,>>>,>>9",
      tam: Math.max(8,ini.toFixed().toString().length)
    }*/
  }
  else if(tipo == "decimal"){
    //let parteDecimal = parseInt(document.getElementById('formatoDecimal').value);
    //let ini = parseFloat(document.getElementById('valorInicial').value);
    let parteDecimal=document.getElementById('formatoDecimal').value;
    let ini=document.getElementById('valorInicial').value;
    //if(parteDecimal <= 0 || isNaN(parteDecimal))
    if(parteDecimal=="")
      parteDecimal = 1;
    //if(isNaN(ini))
    if(ini=="")
      ini = 0;
    varInfo = {
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: ini, //ini.toFixed(parteDecimal),
      format: getFormatDecimal(1), //getFormatDecimal(parteDecimal)
      decimal: parteDecimal, //no existia
      tam: 8 //Math.max(8,ini.toFixed().toString().length + 1 + ini.toFixed(parteDecimal))
    }
  }
  else if(tipo=="character"){
    let formatCharacter = document.getElementById('formato').value
    if(formatCharacter == "" ){
      formatCharacter = 8
    }
    varInfo = {
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: document.getElementById('valorInicial').value,
      format: formatCharacter,//'x(' + formatCharacter + ')',
      tam: 8//formatCharacter
    }
    console.log(varInfo.format);
  }
  else if(tipo=="logical"){
    varInfo = {
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: $("#fLogical option:selected").attr('value'),
      format: "",
      tam: 8
    }
  }
  else if(tipo=="date"){
    let e=document.getElementById("fDate");
    varInfo = {
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: document.getElementById('valorInicial').value,
      //format: $("#fDate option:selected").attr('value'),
      format: e.options[e.selectedIndex].text,
      tam: 10
    }
  }
  if(varInfo.label == "")
        varInfo.label = varInfo.name;
  let idFrame = $("#frames option:selected").attr('value');
  validation.validateNewVar(varInfo,idFrame, function(message) { 
    $('.errorVar').empty();
    if ("Ok" === message) {
      let idVar = nuevaPlantilla.addVartoFrame(idFrame,varInfo);
      varInfo.id=idVar;
      let obj=nuevaPlantilla.getVariableByKey(idFrame,idVar);
      varInfo.movido=obj.movido;
      let frame = nuevaPlantilla.getFrame(idFrame);
      let vista = frame.getVista();
      if(frame.getTipo() == "output") {
        frame.addVariableOutput(idVar);
        addVisualVarOutput(varInfo);
      }
      else{
        addVisualVar(varInfo, vista);
      }
      
      cerrarModal("#modalNewVar");
    } else {
      //mostramos mensaje de error
      $('.errorVar').append(message);
    }
  })
})
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
function getFormat(infoVar){
  let tipo = infoVar["type"];
  let format;
  if(tipo == "decimal"){
    format = infoVar["format"].split(".");
    let i;
    for(i = 0; i < format[1].length; i++){
      if(format[1][i] == "<")
        break;
    }
    format = i.toString();
  }
  else if(tipo == "character"){
    format = infoVar["format"].split("(");
    if (format[1] != undefined)
      format = format[1].split(")");
    format = format[0];
  }
  return format;
}
function setFormatEdit(infoVar){
  let tipo = infoVar["type"];
  $('#lugarFormat').empty();
  if(tipo == "character") {
    $('#lugarFormat').append('<label>Longitud caracter (Format):</label>');
    $('#lugarFormat').append('<input id="formato" type="text" class="form-control" value="'+ getFormat(infoVar) +'">');
  }
  else if (tipo == "decimal"){
    $('#lugarFormat').append('<label>Parte decimal obligatoria:</label>');
    $('#lugarFormat').append('<input id="formatoDecimal" type="text" class="form-control" value="'+ getFormat(infoVar) +'">');
  }
  else if(tipo == "date"){
    $('#lugarFormat').append('<label>Formato:</label>');
    $('#lugarFormat').append('<select id="fDate" class="form-control" name="selectDate">\
                              <option value="mm/dd/yy">mm/dd/yyyy</option>\
                              <option value="dd/mm/yy">dd/mm/yyyy</option>\
                              <option value="yy/mm/dd">yyyy/mm/dd</option></select>');
    $('#lugarFormat option:selected').removeAttr("selected");
    $('#lugarFormat option[value="'+ infoVar["format"] +'"]').prop("selected",true);
  }
}
//AL CAMBIAR DE FORMATO DE VAR AJUSTAMOS EL FORMATO Y EL INIT
$(document).on('change', '#tipoVar', function(event) {
  let tipo = $("#tipoVar option:selected").attr('value');
  //siempre nos cargamos el formato y el init y lo cargamos como debamos en función del tipo
  $('#lugarFormat').empty();
  $('#lugarInit').empty();
  if(tipo == "integer" || tipo == "decimal"){// ponemos inicio = 0, dejamos el formato vacío por el momento
    if(tipo == "decimal"){
      $('#lugarFormat').append('<label>Parte decimal obligatoria:</label>');
      $('#lugarFormat').append('<input id="formatoDecimal" type="text" class="form-control" placeholder="1">');
    }
    $('#lugarInit').append('<label>Valor Inicial:</label>');
    $('#lugarInit').append('<input id="valorInicial" type="text" class="form-control" placeholder="0">');
  }
  else if(tipo=="character"){// Dejamos el formato vacío por el momento, por defecto ponemos 8
    $('#lugarFormat').append('<label>Longitud caracter (Format):</label>');
    $('#lugarFormat').append('<input id="formato" type="text" class="form-control" placeholder="8">');
    $('#lugarInit').append('<label>Valor Inicial:</label>');
    $('#lugarInit').append('<input id="valorInicial" type="text" class="form-control" placeholder="abcdefg1">');
  }
  else if(tipo=="date"){ // Añadimos opción de year en 2 o 4 digitos y escribimos todos los formatos en un select
    $('#lugarFormat').append('<label>Formato:</label>');
    $('#lugarFormat').append('<select id="fDate" class="form-control" name="selectDate">\
                              <option value="mm/dd/yy">mm/dd/yyyy</option>\
                              <option value="dd/mm/yy">dd/mm/yyyy</option>\
                              <option value="yy/mm/dd">yyyy/mm/dd</option></select>');
    $('#lugarInit').append('<label>Valor Inicial:</label>');
    
    
    $('#lugarInit').append('<p><input id="valorInicial" type="text" class="form-control date"></p>');
    $( ".accordion" ).accordion();
    $.datepicker.regional['es'] = {
      closeText: 'Cerrar',
      prevText: '< Ant',
      nextText: 'Sig >',
      currentText: 'Hoy',
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
      dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
      weekHeader: 'Sm',
      dateFormat: $("#lugarFormat option:selected").attr('value'),
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ''
      };
      $.datepicker.setDefaults($.datepicker.regional['es']);
    $( ".date" ).datepicker({
      changeMonth: true,
      changeYear: true
    });
  }
  else if(tipo=="logical"){
    $('#lugarInit').append('<label>Valor Inicial:</label>');
    $('#lugarInit').append('<select id="fLogical" class="form-control">\
                            <option value="false">No seleccionado (False)</option>\
                            <option value="true">Seleccionado (True)</option></select>');
  }
});
$(document).on('change', '#lugarFormat', function(event) {
  let format = $("#lugarFormat option:selected").attr('value');
  $('.date').val("");
  $.datepicker.regional['es'] = {
    closeText: 'Cerrar',
    prevText: '< Ant',
    nextText: 'Sig >',
    currentText: 'Hoy',
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
    dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
    weekHeader: 'Sm',
    dateFormat: $("#lugarFormat option:selected").attr('value'),
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
  $( ".date" ).datepicker({
    changeMonth: true,
    changeYear: true
  });
});
function borrarFrame(id){
  nuevaPlantilla.deleteFrame(id);
  $('#frames option[value="'+id+'"]').remove();
  $('#frames option[value="0"]').prop("selected",true);
  $('.editEnabled').hide();
  $('.frameSelected').hide();
  $('.inputFrame').hide();
  $('#outputFrame').hide();
  $("#varsMov").empty();
}
function borrarVariable(idVar){
  let idFrame = $("#frames option:selected").attr('value');
  nuevaPlantilla.deleteVariable(idFrame,idVar);
  let frame = nuevaPlantilla.getFrame(idFrame);
  if(frame.getTipo() == "output"){
    $('#varsOutput').empty();
    cargarPanelVarOutput( idFrame);
  }
  else{ //input frame
    $('#vars').empty();
    $('.var'+idVar+'').remove(); // Borro el arrastrable
  }
  
}
function cargarFrame(idFrame){
  vaciarVariables();
  if(idFrame == 0){
    $('.editEnabled').hide();
    $('.inputFrame').hide();
    $('.frameSelected').hide();
    $('#outputFrame').hide();
  }
  else{
    let frame = nuevaPlantilla.getFrame(idFrame);
    $('.frameSelected').empty();
    $('.frameSelected').append(' <a href="#" class="btnFrame" data-toggle="modal" data-target="#modalFrameEdit"><h6 class="text-dark"><i class="far fa-edit"></i> Editar Frame </h6></a>');
    $('.frameSelected').append(' <a href="#" onclick="borrarFrame('+idFrame+')" class="btnFrame"><h6 class="text-dark"><i class="fas fa-trash-alt"></i> Borrar Frame </h6></a>');
    if(frame.getTipo() == "output") {
      cargarFrameSalida(idFrame);
      cargarPanelEdicionFrame(idFrame);
      cargarPanelVarOutput(idFrame);
    }
    else if (frame.getTipo() == "input"){
      if(frame.getVista() == "display")
        $('.frameSelected').append(' <a href="#" onclick="cambiarVista()" class="btnFrame inputFrame" id ="cambiarVista" ><h6 class="text-dark"><i class="far fa-eye"></i> Cambiar a Vista Update</h6></a>');
      else if(frame.getVista() == "update")
        $('.frameSelected').append(' <a href="#" onclick="cambiarVista()" class="btnFrame inputFrame" id ="cambiarVista" ><h6 class="text-dark"><i class="far fa-eye"></i> Cambiar a Vista Display</h6></a>');
      $('#outputFrame').hide();
      $('.inputFrame').show();
      $('.editEnabled').show();
      cargarPanelEdicionFrame(idFrame);
      cargarPanelVar(idFrame);
    }
    $('.frameSelected').show();
    $('.tituloFrameActual').empty();
    $('.tituloFrameActual').append(frame.title);
  }
}
function cambiarVista(){
  let idFrame = $("#frames option:selected").attr('value');
  let frame = nuevaPlantilla.getFrame(idFrame);
  let vista = frame.getVista();
  if(vista == "update"){
    frame.setVista("display");
  }
  else if(vista == "display"){
    frame.setVista("update");
  }
  cargarFrame(idFrame);
}
function cargarPanelEdicionFrame(idFrame){
  let frame = nuevaPlantilla.getFrame(idFrame);
  $("#eNombreFrame").val(frame["name"]);
  $("#etituloFrame").val(frame["title"]);
  //Botón guardar
  $("#btnEditarFrame").removeAttr("onclick");
  $("#btnEditarFrame").attr("onclick", 'modificarFrame('+idFrame+')');
}
function cargarPanelVar(idFrame){
  $("#vars").empty();
  
  $("#vars").append('<small><div id="container" style="width:100%;"><div id="accordion" style="width:100%;"></small>');
  let frame = nuevaPlantilla.getFrame(idFrame);
  let mapIter = frame.getVariables().entries();
  let value = mapIter.next().value;
  let vista = frame.getVista();
  while(value != undefined) {
    //console.log('variables: ', value);
    
    addVisualVar(value[1], vista);
    value = mapIter.next().value;
  }

}
function addVisualVar(infoVar, vista){
  createVisualDraggable(infoVar,vista);
  createEditPanel(infoVar["id"]);
}

function createVisualDraggable(infoVar, vista){
  let stringDiv;
  let tam=parseInt(infoVar["tam"]);
  let tipo = infoVar["type"];
  
  if (vista == "update"){
    if(tipo == "character" || tipo=="integer"){    
      stringDiv = '<div id="'+infoVar["name"]+'" class="drag-drop var'+infoVar["id"]+'" key="'+infoVar["id"]+'" movido="'+infoVar["movido"]+'"><a href="#" onclick="createEditPanel('+infoVar["id"]+')" class="label label-default" title="'+infoVar["name"]+'"><label class ="labelVar">'+infoVar["label"]+':</label><input class ="inputVar field left" type="text" value="'+infoVar["initial"]+'" size="'+tam+'" readonly></a></div>';
    }else if(tipo == "decimal" || tipo=="date"){
      stringDiv = '<div id="'+infoVar["name"]+'" class="drag-drop var'+infoVar["id"]+'" key="'+infoVar["id"]+'" movido="'+infoVar["movido"]+'"><a href="#" onclick="createEditPanel('+infoVar["id"]+')" class="label label-default" title="'+infoVar["name"]+'"><label class ="labelVar">'+infoVar["label"]+':</label><input class ="inputVar field left" type="text" value="'+infoVar["initial"]+'" size="'+tam+'" readonly></a></div>';
    }else if(tipo=="logical"){
      if(infoVar["initial"] == "true"){
        stringDiv = '<div id="'+infoVar["name"]+'" class="drag-drop var'+infoVar["id"]+'" key="'+infoVar["id"]+'"  movido="'+infoVar["movido"]+'"><a href="#" onclick="createEditPanel('+infoVar["id"]+')" class="label label-default" title="'+infoVar["name"]+'"><label class ="labelVar">'+infoVar["label"]+'</label> <i class="far fa-check-square"></i></a></div>';
      }
      else{
        stringDiv = '<div id="'+infoVar["name"]+'" class="drag-drop var'+infoVar["id"]+'" key="'+infoVar["id"]+'"  movido="'+infoVar["movido"]+'"><a href="#" onclick="createEditPanel('+infoVar["id"]+')" class="label label-default" title="'+infoVar["name"]+'"><label class ="labelVar">'+infoVar["label"]+'</label> <i class="far fa-square"></i></a></div>';
      }
    }
  }
  else if (vista == "display"){
    if(tipo == "integer" || tipo == "decimal" || tipo=="character" || tipo=="date" || tipo=="logical"){
      stringDiv = '<div id="'+infoVar["name"]+'" class="drag-drop var'+infoVar["id"]+'" key="'+infoVar["id"]+'" movido="'+infoVar["movido"]+'"><a href="#" onclick="createEditPanel('+infoVar["id"]+')" class="label label-default" title="'+infoVar["name"]+'"><label class ="labelVar">'+infoVar["label"]+':</label>'+infoVar["initial"]+'</a></div>';
    }
  } 
  
  if(infoVar["movido"]==1){
    $("#movend").append(stringDiv);
    let idFrame = $("#frames option:selected").attr('value');
    let obj= nuevaPlantilla.getFrame(idFrame).getVariable($('#'+infoVar["name"]).attr('key'));
    var zona=document.getElementById('inner-dropzone');
    var objeto=document.getElementById(infoVar["name"]);
    console.log("left: ",objeto.offsetLeft );
    console.log("top: ",objeto.offsetTop );
    if(infoVar["fila"]!=undefined && infoVar["columna"]!=undefined){
      let datx=(infoVar["columna"]*columnasdis+zona.offsetLeft)-objeto.offsetLeft;
      let daty=(infoVar["fila"]*filasdis+zona.offsetTop)-objeto.offsetTop;
      objeto.setAttribute('data-x', datx);
      objeto.setAttribute('data-y', daty);
      obj.setPosition(datx,daty);
      // translate the element
      document.getElementById(infoVar["name"]).style.webkitTransform =
      document.getElementById(infoVar["name"]).style.transform =
        'translate(' + datx + 'px, ' + daty + 'px)'
    }

  }else{
    $("#varsMov").append(stringDiv);  
  }
  /*
  document.getElementById(infoVar["name"]).onkeydown = detectKey; 
  document.getElementById(infoVar["name"]).onfocus = function () {
    document.getElementById(infoVar["name"]).addClass('classVarSelected');
    alert('coge foco');
  };
  document.getElementById(infoVar["name"]).onblur = function () {
    document.getElementById(infoVar["name"]).removeClass('classVarSelected');
    alert('pierde foco');
  };
  console.log("tipo de infoVar "+typeof(infoVar));*/
}

function createEditPanel(idVar){
  let idFrame = $("#frames option:selected").attr('value');
  let infoVar = nuevaPlantilla.getFrame(idFrame).getVariable(idVar);
  let columna = 0;
  let fila=0;
  if(infoVar["columna"] !=null && infoVar["label"].length!=0){
    columna=parseInt(infoVar["columna"])+infoVar["label"].length+1;
  }
  if(infoVar["fila"] !=null){
    fila=infoVar["fila"]+1;
  }
  $("#vars").empty();  
  $("#vars").append('<div class="card border-d mb-3 text-center">\
    <div class="card-header text-center">\
      <h5 class="card-title text-dark"> Variable seleccionada: '+infoVar["name"]+'</h5>\
      <h6 class="card-title text-dark"> Posición: Fila '+fila+' Columna '+columna+'</h5>\
    </div>\
      <div class="card-body text-left">\
      <table class="table">\
        <tbody>\
          <tr>\
          <td>Nombre:</td>\
          <td>'+infoVar["name"]+'</td>\
        </tr>\
        <tr>\
          <td>Tipo:</td>\
          <td>'+infoVar["type"]+'</td>\
        </tr>\
          <tr>\
          <td>Formato:</td>\
          <td>'+infoVar["format"]+'</td>\
        </tr>\
        <tr>\
          <td>Etiqueta:</td>\
          <td>'+infoVar["label"]+'</td>\
          </tr>\
          <tr>\
          <td>Valor inicial:</td>\
          <td>'+infoVar["initial"]+'</td>\
          </tr>\
        </tbody>\
      </table>\
      <div id ="editVarBtn" class="text-center"></div>\
    </div>\
  </div>');
  $("#vars").append('<span class="errorEditVar errorMessage"></span>');
  //buttons
  $('#editVarBtn').append(' <a data-toggle="modal" data-target="#modalNewVar" href="#" onclick="prepararEditarVariable('+infoVar["id"]+')"class="btnFrame"><h6 class="text-dark"><i class="far fa-edit"></i> Editar </h6></a>');
  $('#editVarBtn').append(' <a href="#" onclick="borrarVariable('+infoVar["id"]+')" class="btnFrame"><h6 class="text-dark"><i class="fas fa-trash-alt"></i> Borrar </h6></a>');
  //Le doy el foco a mi classVar para moverla con el teclado
  objetoMover=document.getElementById(infoVar["name"]);
}
function prepararEditarVariable(idVar){
  let idFrame = $("#frames option:selected").attr('value');
  let infoVar = nuevaPlantilla.getFrame(idFrame).getVariable(idVar);
  $('.errorVar').empty();
  //RELLENAR LOS DATOS EN EL PANEL DE EDICIÓN
  $('#tipoVar option:selected').removeAttr("selected");
  $('#tipoVar option[value="'+infoVar["type"]+'"]').prop("selected",true);

  $('#nombreVariable').val(infoVar["name"]);
  $('#labelVariable').val(infoVar["label"]);

  let tipo = infoVar["type"];
  //siempre nos cargamos el formato y el init y lo cargamos como debamos en función del tipo
  $('#lugarFormat').empty();
  $('#lugarInit').empty();
  if(tipo == "integer" || tipo == "decimal"){
    if(tipo == "decimal"){
      setFormatEdit(infoVar);
    }
    $('#lugarInit').append('<label>Valor Inicial:</label>');
    $('#lugarInit').append('<input id="valorInicial" type="text" class="form-control" value="'+infoVar["initial"]+'">');
  }
  else if(tipo=="character"){
    setFormatEdit(infoVar);
    $('#lugarInit').append('<label>Valor Inicial:</label>');
    $('#lugarInit').append('<input id="valorInicial" type="text" class="form-control" value="'+infoVar["initial"]+'">');
  }
  else if(tipo=="date"){
    setFormatEdit(infoVar);
    $('#lugarInit').append('<label>Valor Inicial:</label>');
    
    
    $('#lugarInit').append('<p><input id="valorInicial" type="text" class="form-control date" value="'+infoVar["initial"]+'"></p>');
    $.datepicker.regional['es'] = {
      closeText: 'Cerrar',
      prevText: '< Ant',
      nextText: 'Sig >',
      currentText: 'Hoy',
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
      dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
      weekHeader: 'Sm',
      dateFormat: $("#lugarFormat option:selected").attr('value'),
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ''
      };
      $.datepicker.setDefaults($.datepicker.regional['es']);
    $( ".date" ).datepicker({
      changeMonth: true,
      changeYear: true
    });
  }
  else if(tipo=="logical"){
    $('#lugarInit').append('<label>Valor Inicial:</label>');
    $('#lugarInit').append('<select id="fLogical" class="form-control">\
                            <option value="false">No seleccionado (False)</option>\
                            <option value="true">Seleccionado (True)</option></select>');
    $('#lugarInit option:selected').removeAttr("selected");
    $('#lugarInit option[value="'+ infoVar["initial"] +'"]').prop("selected",true);
  }
  $('#lugarBotonEditVar').empty();
  $('#btnAnyadirVar').hide();
  //$('#lugarBotonEditVar').append('<a href="#" onclick="editarVariable('+idVar+')" class="btnFrame"><h6 class="text-dark"><i class="fas fa-trash-alt"></i> Editar Variable </h6></a>');
  $('#lugarBotonEditVar').append('<a href= "#" onclick="editarVariable('+idVar+')" id="btnEditVar" class="btn btn-info">Editar Variable</a>');
  $('#actionTitle').empty();
  $('#actionTitle').append('Editar variable ' + infoVar["name"]);
  
}
function cleanVariablePanel(){
  $('#tipoVar option:selected').removeAttr("selected");
  $('#actionTitle').empty();
  $('#actionTitle').append('Crear variable');
  $('#btnAnyadirVar').show();
  $('#lugarBotonEditVar').empty();
  $('#nombreVariable').val("");
  $('#labelVariable').val("");
  $('#valorInicial').val("");

}
function editarVariable(idVar){
  let idFrame = $("#frames option:selected").attr('value');
  let infoVar = nuevaPlantilla.getFrame(idFrame).getVariable(idVar);
  let frame = nuevaPlantilla.getFrame(idFrame);
  let tipo = $("#tipoVar option:selected").attr('value');
  let varInfo;
  if(tipo == "integer"){
    let ini = parseInt(document.getElementById('valorInicial').value);
    if(isNaN(ini))
      ini = 0;
    varInfo = {
      idVar: idVar,
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: ini.toFixed(),
      format: "->,>>>,>>9",
      tam: Math.max(8,ini.toFixed().toString().length)
    }
  }
  else if(tipo == "decimal"){
    let parteDecimal = parseInt(document.getElementById('formatoDecimal').value);
    let ini = parseFloat(document.getElementById('valorInicial').value);
    if(parteDecimal <= 0 || isNaN(parteDecimal))
      parteDecimal = 1;
    if(isNaN(ini))
      ini = 0;
    varInfo = {
      idVar: idVar,
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: ini.toFixed(parteDecimal),
      format: getFormatDecimal(parteDecimal),
      tam: Math.max(8,ini.toFixed().toString().length + 1 + ini.toFixed(parteDecimal))
    }
  }
  else if(tipo=="character"){
    let formatCharacter = document.getElementById('formato').value
    if(formatCharacter == "" ){
      formatCharacter = 8
    }
    varInfo = {
      idVar: idVar,
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: document.getElementById('valorInicial').value,
      format: 'x(' + formatCharacter + ')',
      tam: formatCharacter
    }
  }
  else if(tipo=="logical"){
    varInfo = {
      idVar: idVar,
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: $("#fLogical option:selected").attr('value'),
      format: "",
      tam: 8
    }
  }
  else if(tipo=="date"){
    varInfo = {
      idVar: idVar,
      name: document.getElementById('nombreVariable').value,
      type: tipo,
      label: document.getElementById('labelVariable').value,
      initial: document.getElementById('valorInicial').value,
      format: $("#fDate option:selected").attr('value'),
      tam: 10
    }
  }
  if(varInfo.label == "")
        varInfo.label = varInfo.name;
  console.log("nuevo",varInfo, "antiguo",infoVar);
  let antiguoName= infoVar.name;
  validation.validateEditVar(idFrame,infoVar, varInfo, function(message) { 
  //validation.validateNewVar  (idFrame,infoVar, varInfo, function(message) { 
    $('.errorVar').empty();
    if ("Ok" === message) {
      nuevaPlantilla.getFrame(idFrame).editVar(varInfo);
      varInfo = nuevaPlantilla.getFrame(idFrame).getVariable(idVar);
      cargarFrame(idFrame);
      if(frame.getTipo() == "output"){
        createEditPanelOutput(varInfo.id);
      }
      else{
        createEditPanel(varInfo.id);
      }
      cerrarModal("#modalNewVar");
    }
    else {
      $('.errorVar').append(message);
    }
  })
}
function modificarFrame(idFrame){
  let e = document.getElementById("etipoFrame");
  let newData = {
    name: document.getElementById('eNombreFrame').value,
    titulo: document.getElementById('etituloFrame').value
  }
  let frameInfoOld = nuevaPlantilla.getFrame(idFrame);
  validation.validateEditFrame(frameInfoOld, newData, function(message) { 
    $('.errorFrame').empty();
    if ("Ok" === message) {
      newData.tipo = frameInfoOld.getTipo();
      nuevaPlantilla.editFrame(idFrame, newData);
      cargarFrame(idFrame);
      $('#nombreFrame').val("");
      cerrarModal("#modalFrameEdit");
      $("#frames option:selected").text(document.getElementById('eNombreFrame').value);
    } else {
      //mostramos mensaje de error
      $('.errorFrame').append(message);
    }
  })
}   
function borrarMensajeErrorFrame(){
  $('.errorFrame').empty();
}
