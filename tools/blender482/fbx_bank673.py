# v673 — junta animações do Mixamo (FBX sem malha, esqueleto mixamorig) num banco GLB para o jogo
# (mesmo formato de models/povo482/anim-povo482.glb: só esqueleto + clipes; o jogo reaproveita pelo delta da pose T).
# Uso: blender -b --python tools/blender482/fbx_bank673.py -- --dir PASTA_FBX --out models/anim-lobisomem673.glb
import bpy, sys, os, glob
argv = sys.argv[sys.argv.index('--') + 1:]
arg = lambda k: argv[argv.index('--' + k) + 1]
D, OUT = arg('dir'), arg('out')
bpy.ops.wm.read_factory_settings(use_empty=True)
base = None
names = []
for f in sorted(glob.glob(os.path.join(D, '*.fbx'))):
    nm = os.path.splitext(os.path.basename(f))[0]
    before = set(bpy.data.objects)
    bpy.ops.import_scene.fbx(filepath=f, automatic_bone_orientation=False)
    new = [o for o in bpy.data.objects if o not in before]
    arm = next(o for o in new if o.type == 'ARMATURE')
    act = arm.animation_data.action
    act.name = nm
    if base is None:
        base = arm
        base.animation_data.action = None
    else:
        for o in new: bpy.data.objects.remove(o, do_unlink=True)
    tr = base.animation_data.nla_tracks.new(); tr.name = nm
    tr.strips.new(nm, int(act.frame_range[0]), act)
    names.append(nm)
    print('B673', nm, int(act.frame_range[1] - act.frame_range[0] + 1), 'quadros')
for o in list(bpy.data.objects):
    if o is not base: bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS',
                          export_force_sampling=True, export_skins=False, export_morph=False, export_def_bones=False)
print('B673 GLB', OUT, len(names))
