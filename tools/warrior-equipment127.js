(function(global){
'use strict';
var COLORS=[0x9a9aa0,0xd0d8e0,0x7fd8ff,0xb18cff,0xff6a3a,0x3a3048,0xd02040,0xffd070,0xffda9f,0xf4f0ff];
function material(T,color,metal,rough){return new T.MeshStandardMaterial({color,metalness:metal,roughness:rough});}
function profile(T,points,depth,mat){var s=new T.Shape();s.moveTo(...points[0]);points.slice(1).forEach(p=>s.lineTo(...p));s.closePath();var g=new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:2,bevelSize:.0015,bevelThickness:.0015});g.translate(0,0,-depth/2);return new T.Mesh(g,mat);}
function weapon(T,item){var root=new T.Group();root.userData.materials=[];if(!item)return root;var tier=item.tier||0,shape=item.visual?.shape||(tier>=6?'long':tier>=3?'broad':'sword'),color=item.visual?.color??COLORS[tier]??COLORS[0];
var blade=material(T,0x3f4b5b,.75,.26),edge=material(T,0x9aaabd,.78,.20),leather=material(T,0x3a2020,.18,.82),gold=material(T,0x927044,.75,.35),accent=material(T,color,.65,.35);
root.userData.materials=[blade,edge,leather,gold,accent];root.userData.shape=shape;root.userData.color=color;root.userData.rank=tier;
var len=shape==='long'?.53:.43,width=shape==='broad'?.075:.055;
var h=profile(T,[[-width/2,0],[width/2,0],[width*.38,len*.86],[0,len],[-width*.38,len*.86]],.008,blade);h.position.y=.07;root.add(h);
for(var sign of [-1,1]){var line=profile(T,[[-.006,.04],[.006,.04],[.004,len*.79],[0,len*.92],[-.004,len*.79]],.0015,edge);line.position.set(0,.07,sign*.005);root.add(line);}
var guard=new T.Mesh(new T.BoxGeometry(.15,.022,.027),gold);guard.position.y=.055;root.add(guard);
var handle=new T.Mesh(new T.CylinderGeometry(.010,.012,.07,10),leather);root.add(handle);
var pom=new T.Mesh(new T.SphereGeometry(.017,10,8),gold);pom.position.y=-.045;root.add(pom);
var band=new T.Mesh(new T.TorusGeometry(.017,.003,5,10),accent);band.rotation.x=Math.PI/2;band.position.y=.062;root.add(band);return root;}
function armor(T,slot,item){var root=new T.Group();root.name='armor_'+slot;root.userData.materials=[];return root;}
global.WarriorEquipment127={weapon,armor};
})(window);
