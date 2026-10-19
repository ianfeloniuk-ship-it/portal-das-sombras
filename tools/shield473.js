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
/* pose de defesa: clipe "guarda" no corpo + (v474) braço esquerdo erguendo o escudo à frente do peito, por cima da
   animação, logo antes de desenhar. Mira em espaço do mundo: o braço aponta para a frente/baixo do ombro, o antebraço
   cruza para o meio do peito, e o escudo vira com a face para onde o personagem olha. Entra e sai em ~0,1 s. */
const T=THREE,V1=new T.Vector3(),V2=new T.Vector3(),V3=new T.Vector3(),Q1=new T.Quaternion(),Q2=new T.Quaternion(),QP=new T.Quaternion();
let wgt=0,lastT=performance.now();
function aimBone(bone,child,target,k){/* gira o osso para a direção osso→alvo, misturando k */
 bone.updateMatrixWorld(true);bone.getWorldPosition(V1);child.getWorldPosition(V2);const cur=V2.sub(V1).normalize(),want=V3.copy(target).sub(V1).normalize();
 if(cur.lengthSq()<1e-6||want.lengthSq()<1e-6)return;Q1.setFromUnitVectors(cur,want);Q2.identity().slerp(Q1,k);
 bone.getWorldQuaternion(QP);QP.premultiply(Q2);const pq=bone.parent.getWorldQuaternion(new T.Quaternion()).invert();bone.quaternion.copy(pq.multiply(QP))}
function shieldNode(m){if(m.shield474&&m.shield474.parent)return m.shield474;const hl=m.bones&&m.bones.hand_l;if(!hl)return null;let n=null;for(const c of hl.children)if(c.isGroup&&c.children.length&&(m.wnodes||[]).includes(c))n=c;m.shield474=n;return n}
function raise(){const now=performance.now(),dt=Math.min(.1,(now-lastT)/1000);lastT=now;const P=player;if(!P||!P.m||!P.m.bones)return;
 const on=!!(P.block472&&!(P.atkT>0)&&shieldActive473());wgt=Math.max(0,Math.min(1,wgt+(on?dt:-dt)/.1));
 if(P.block472&&!(P.atkT>0))P.skillAnim155={k:'guarda',until:time+.12};
 if(wgt<=0){const sn=P.m.shield474;if(sn&&sn.userData.q474){sn.quaternion.copy(sn.userData.q474)}return}const B=P.m.bones,ua=B.upperarm_l,fa=B.forearm_l,hd=B.hand_l,ch=B.chest||B.spine;if(!ua||!fa||!hd||!ch)return;
 const f=P.face,fx=Math.sin(f),fz=Math.cos(f),rx=Math.cos(f),rz=-Math.sin(f);/* frente e direita do personagem */
 ch.updateMatrixWorld(true);ch.getWorldPosition(V3);const cx=V3.x,cy=V3.y,cz=V3.z,sc=P.m.root.scale.y||1;
 const elbow=new T.Vector3(cx+fx*.28*sc-rx*.22*sc,cy-.05*sc,cz+fz*.28*sc-rz*.22*sc);/* cotovelo à frente, do lado esquerdo */
 const hand=new T.Vector3(cx+fx*.42*sc-rx*.02*sc,cy+.04*sc,cz+fz*.42*sc-rz*.02*sc);/* mão na frente do peito */
 aimBone(ua,fa,elbow,wgt);aimBone(fa,hd,hand,wgt);
 const sn=shieldNode(P.m);if(sn){sn.updateMatrixWorld(true);const want=new T.Quaternion().setFromEuler(new T.Euler(0,f,0));const pq=sn.parent.getWorldQuaternion(new T.Quaternion()).invert();
  if(!sn.userData.q474)sn.userData.q474=sn.quaternion.clone();const tgt=pq.multiply(want).multiply(new T.Quaternion().setFromEuler(new T.Euler(0,Math.PI/2,0)));sn.quaternion.copy(sn.userData.q474).slerp(tgt,wgt)}}
(function hook(){if(typeof camUpdate!=='function'){setTimeout(hook,300);return}const prev=camUpdate;camUpdate=function(){prev.apply(this,arguments);try{raise()}catch(err){if(!window.Shield473err){console.warn('shield474',err);window.Shield473err=err}}}})();
})();
