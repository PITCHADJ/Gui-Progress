tabla = _ defineTempTable __ name:tableName __ noUndo _ lines:lines "." _ {
  return {name: name, campos: lines}
  }
defineTempTable = "define temp-table" 
tableName = "tt_" n:$[a-zA-Z0-9]+ {
return n;
}
noUndo  = "no-undo"
lines = line+
line
  = field __ v:var __ t:type opciones:Opcion* _{
  return {var: v, type: t, opciones: opciones}
  }

field = "field" / "fields"
var = ("_" / [a-zA-Z0-9] / "-")*  {
return text()
}
type = "as" __ t:$defType+ {return t;}
defType = "integer" / "character" / "date" / "logical"

Opcion = __ opcion:(OpcionLabel/OpcionInit/OpcionFormat) {
return opcion
}
   
OpcionLabel = "label" __ cadena:LiteralCadena {
return { type: "label", label: cadena }
}

OpcionInit = "init" __ result:(LiteralCadena/Integer) {
return { type: "init", value: result }
}

OpcionFormat = "format" __ cadena:LiteralCadena {
return { type: "format", format: cadena }
}

LiteralCadena = "\"" texto:([^\"]*) "\"" {
return texto.join("")
}
Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*
 
__ "whitespace_mandatory"
  = [ \t\n\r]+