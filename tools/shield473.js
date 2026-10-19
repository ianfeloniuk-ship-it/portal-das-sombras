/* v473 (Ian, 19/10/2026): "faz o slot de escudo com modelo na mão e animação de defesa".
   - Slot novo "Escudo" (sh) no equipamento, junto de Arma/Armadura/Elmo/Luvas/Botas: aparece em baús, loja do Kael
     e forja como as outras peças (todas usam a lista EQUIP_SLOTS). Dá escudo/vida/armadura como meia armadura.
   - O escudo só vale com arma de uma mão (espada, machado, maça sacra, pistola); com arma de duas mãos
     (cajado, arco, lança, grimório, cajado de osso) ou adagas ele fica guardado e não conta (aviso na ficha).
   - Modelo: o mesmo escudo que o machado e a maça já mostravam, na mão esquerda (warrior-player127).
   - Defesa (v472) com escudo: 25% do dano, aparar mais fácil (0,32 s) e escudada no botão esquerdo.
   - Animação: segurando o botão direito, o Viajante faz a pose "guarda" (clipe do anim-viajante155). */
(function(){
'use strict';
if(typeof EQUIP_SLOTS==='undefined'||typeof EQUIP_LABEL==='undefined')return;
const ONE=window.ONEHAND473={sword:1,axe:1,wand:1,firearm:1};
if(!EQUIP_SLOTS.includes('sh'))EQUIP_SLOTS.push('sh');
EQUIP_LABEL.sh='Escudo';
if(typeof equipFactor==='function'){const EF0=equipFactor;equipFactor=function(sl){return sl==='sh'?.5:EF0.apply(this,arguments)}}
/* escudo vale? (arma de uma mão ou sem arma) */
window.shieldActive473=function(){try{const s=run&&run.equip&&run.equip.sh;if(!s)return false;const w=run.equip.w;return !w||!!ONE[w.kind155]}catch(_){return false}};
/* ficha: posição do slot e aviso quando a arma é de duas mãos */
try{const st=document.createElement('style');st.textContent='.gear-sh{grid-column:1/4;grid-row:4}';document.head.appendChild(st)}catch(_){}
if(typeof equipmentPanel==='function'){const EP0=equipmentPanel;equipmentPanel=function(){let h=EP0.apply(this,arguments);try{if(run.equip.sh&&!shieldActive473())h=h.replace('data-gear-slot="sh">','data-gear-slot="sh"><div class="sysline" style="font-size:11px;color:#ffb36b;margin-bottom:4px">Escudo guardado: só vale com arma de uma mão (espada, machado, maça sacra ou pistola).</div>')}catch(_){}return h}}
/* pose de defesa */
(function hook(){if(typeof camUpdate!=='function'){setTimeout(hook,300);return}const prev=camUpdate;camUpdate=function(){prev.apply(this,arguments);try{const P=player;if(P&&P.block472&&!(P.atkT>0))P.skillAnim155={k:'guarda',until:time+.12}}catch(_){}}})();
})();
