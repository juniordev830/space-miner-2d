"use strict";
const {criarNave,criarAsteroide,coletar,entregar,cargaTotal}=require("../src/mineracao");
const nave=criarNave(5),asteroide=criarAsteroide({id:"DEMO-01",mineral:"ferro",quantidade:7});
const extraido=coletar(nave,asteroide,3);
console.log("Carga:",cargaTotal(extraido.nave),"unidades");
console.log("Asteroide restante:",extraido.asteroide.quantidade);
const entregue=entregar(extraido.nave,{ferro:100});
console.log("Saldo fictício (créditos):",entregue.nave.saldo);
