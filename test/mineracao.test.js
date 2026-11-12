"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {criarNave,criarAsteroide,cargaTotal,coletar,entregar}=require("../src/mineracao");
test("cinco coletas de uma unidade esgotam asteroide",()=>{
  let nave=criarNave(5),asteroide=criarAsteroide({id:"A-01",mineral:"ferro",quantidade:5});
  for(let n=0;n<5;n++){const r=coletar(nave,asteroide,1);nave=r.nave;asteroide=r.asteroide;}
  assert.equal(cargaTotal(nave),5);
  assert.equal(asteroide.quantidade,0);
  assert.throws(()=>coletar(nave,asteroide,1),RangeError);
});
test("transação inválida não altera objetos de entrada",()=>{
  const nave=criarNave(3),asteroide=criarAsteroide({id:"B",mineral:"cobre",quantidade:7});
  assert.throws(()=>coletar(nave,asteroide,4),RangeError);
  assert.equal(cargaTotal(nave),0);
  assert.equal(asteroide.quantidade,7);
});
test("entrega esvazia inventário e soma saldo inteiro",()=>{
  const nave=criarNave(10),asteroide=criarAsteroide({id:"C",mineral:"ferro",quantidade:5});
  const extraido=coletar(nave,asteroide,3);
  const entrega=entregar(extraido.nave,{ferro:150});
  assert.equal(entrega.credito,450);
  assert.equal(entrega.nave.saldo,450);
  assert.equal(cargaTotal(entrega.nave),0);
  assert.equal(cargaTotal(extraido.nave),3);
});
test("preço inválido não consome carga nem credita saldo",()=>{
  const r=coletar(criarNave(),criarAsteroide({id:"C",mineral:"prata",quantidade:3}),2);
  assert.throws(()=>entregar(r.nave,{ferro:15}),RangeError);
  assert.equal(cargaTotal(r.nave),2);
  assert.equal(r.nave.saldo,0);
});
test("entradas inválidas e quantidades negativas são rejeitadas",()=>{
  assert.throws(()=>criarNave(0),RangeError);
  assert.throws(()=>criarAsteroide({id:"",mineral:"ferro",quantidade:5}),RangeError);
  const nave=criarNave(),asteroide=criarAsteroide({id:"X",mineral:"ferro",quantidade:1});
  assert.throws(()=>coletar(nave,asteroide,0),RangeError);
  assert.throws(()=>coletar(nave,asteroide,2),RangeError);
  assert.throws(()=>entregar(nave,null),TypeError);
});
