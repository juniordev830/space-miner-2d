"use strict";

// Regras determinísticas de mineração; não implementa nave visual ou mapa 2D.
function positivo(value, descricao) {
  if (!Number.isSafeInteger(value) || value <= 0)
    throw new RangeError(descricao + " deve ser inteiro positivo.");
}
function nome(value, descricao) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 60)
    throw new RangeError(descricao + " inválido.");
  return value.trim();
}
function criarNave(capacidade = 10) {
  positivo(capacidade, "Capacidade");
  if(capacidade>100000)throw new RangeError("Capacidade excessiva.");
  return Object.freeze({capacidade, carga: Object.freeze(Object.create(null)), saldo: 0});
}
function criarAsteroide({id, mineral, quantidade}) {
  id = nome(id, "ID");
  mineral = nome(mineral, "Mineral");
  positivo(quantidade, "Quantidade");
  return Object.freeze({id,mineral,quantidade});
}
function cargaTotal(nave) {
  return Object.values(nave.carga).reduce((total,q)=>total+q,0);
}
function coletar(nave, asteroide, quantidade) {
  positivo(quantidade,"Quantidade a minerar");
  if(quantidade>asteroide.quantidade)throw new RangeError("Minério insuficiente.");
  if(cargaTotal(nave)+quantidade>nave.capacidade)throw new RangeError("Capacidade de carga excedida.");
  // Um mapa sem protótipo também permite minerais chamados "constructor" ou "__proto__".
  const carga = Object.assign(Object.create(null), nave.carga);
  const atual = Object.hasOwn(nave.carga, asteroide.mineral) ? nave.carga[asteroide.mineral] : 0;
  carga[asteroide.mineral] = atual + quantidade;
  Object.freeze(carga);
  return Object.freeze({
    nave:Object.freeze({...nave,carga}),
    asteroide:Object.freeze({...asteroide,quantidade:asteroide.quantidade-quantidade})
  });
}
function entregar(nave, precos) {
  if(precos===null || typeof precos!=="object" || Array.isArray(precos))
    throw new TypeError("Tabela de preços inválida.");
  let credito=0;
  for(const [mineral,quantidade] of Object.entries(nave.carga)) {
    const preco=Object.hasOwn(precos,mineral)?precos[mineral]:undefined;
    if(!Number.isSafeInteger(preco) || preco<0)
      throw new RangeError("Preço ausente ou inválido para " + mineral);
    const subtotal=quantidade*preco;
    if(!Number.isSafeInteger(subtotal)||!Number.isSafeInteger(credito+subtotal))
      throw new RangeError("Valor total ultrapassou o limite de inteiro seguro.");
    credito+=subtotal;
  }
  if(!Number.isSafeInteger(nave.saldo+credito))
    throw new RangeError("Saldo ultrapassou o limite de inteiro seguro.");
  return Object.freeze({
    nave:Object.freeze({...nave,carga:Object.freeze(Object.create(null)),saldo:nave.saldo+credito}),
    credito
  });
}
module.exports={criarNave,criarAsteroide,cargaTotal,coletar,entregar};
