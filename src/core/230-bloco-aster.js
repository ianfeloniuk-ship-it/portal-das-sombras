// BEGIN ASTER MATERIALS130 — only the local Warrior study in Aster.
if(window.WARRIOR127_ENABLE&&window.AsterMaterials130){
 AsterMaterials130.buildings(BLDMAT);
 const asterGroundBase130=envGroundMat;
 envGroundMat=function(){return AsterMaterials130.ground(asterGroundBase130())};
}
// END ASTER MATERIALS130
