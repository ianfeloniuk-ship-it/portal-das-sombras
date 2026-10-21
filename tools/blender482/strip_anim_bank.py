"""v486 Povo482: tira a malha do banco de animações do Tripo (fica só o esqueleto Mixamo + os clipes, nomes mantidos).
blender -b --python tools/blender482/strip_anim_bank.py -- <entrada.glb> <saida.glb>"""
import bpy,sys
a=sys.argv[sys.argv.index('--')+1:];src,dst=a[0],a[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
for o in list(bpy.data.objects):
    if o.type!='ARMATURE' and not (o.type=='EMPTY' and any(c.type=='ARMATURE' for c in o.children)):
        bpy.data.objects.remove(o,do_unlink=True)
arm=[o for o in bpy.data.objects if o.type=='ARMATURE'][0]
acts=sorted(bpy.data.actions,key=lambda x:x.name);print('acoes',len(acts))
ad=arm.animation_data or arm.animation_data_create()
for t in list(ad.nla_tracks):ad.nla_tracks.remove(t)
for ac in acts:
    tr=ad.nla_tracks.new();tr.name=ac.name;st=tr.strips.new(ac.name,int(ac.frame_range[0]),ac);tr.mute=True
ad.action=None
bpy.ops.export_scene.gltf(filepath=dst,export_format='GLB',export_animation_mode='NLA_TRACKS',export_skins=True,export_morph=False,export_materials='NONE',export_force_sampling=True,export_optimize_animation_size=True)
