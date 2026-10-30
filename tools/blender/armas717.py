# Base de luta nos golpes com arma (Ian, 30/10/2026): tronco e braços do clipe original; pernas em base e quadril mais baixo.
# uso: blender -b -P armas717.py -- anim-viajante155.glb pasta_saida
import bpy, sys
from mathutils import Quaternion, Vector
src, outdir = sys.argv[-2], sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
sc = bpy.context.scene; sc.render.fps = 30
nodes = {o.name: o for o in bpy.data.objects}
P = 'mixamorig:'
mix = {n[len(P):]: o for n, o in nodes.items() if n.startswith(P)}
for o in nodes.values():
    o.rotation_mode = 'QUATERNION'; o.animation_data_create()
def bind(a):
    for o in nodes.values(): o.animation_data.action = a
actions = {a.name: a for a in bpy.data.actions}
bind(actions['idle']); sc.frame_set(0); bpy.context.view_layer.update()
pos = lambda o: o.matrix_world.translation.copy()
R = pos(mix['RightArm']) - pos(mix['LeftArm']); R.z = 0; R.normalize()
U = Vector((0, 0, 1)); F = U.cross(R).normalized()
tv = pos(mix['RightToeBase']) - pos(mix['RightFoot']); tv.z = 0
if F.dot(tv) < 0: F = -F
vec = lambda f, r, u: (F * f + R * r + U * u).normalized()
def aim(o, c, d):
    bpy.context.view_layer.update()
    rot = (pos(c) - pos(o)).normalized().rotation_difference(d)
    w = o.matrix_world.to_quaternion(); p = o.parent.matrix_world.to_quaternion()
    o.rotation_quaternion = (p.inverted() @ rot @ w).normalized()
LEG = ['LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase', 'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase']
for name in ['golpe1', 'golpe2', 'golpe3', 'pesado1', 'pesado2', 'adaga1', 'adaga2']:
    bind(actions[name]); last = int(actions[name].frame_range[1]); data = []
    for f in range(last + 1):
        sc.frame_set(f); bpy.context.view_layer.update()
        data.append({n: (o.rotation_quaternion.copy(), o.location.copy()) for n, o in mix.items()})
    bind(None)
    na = bpy.data.actions.new(name)
    for o in mix.values(): o.animation_data.action = na
    down = (mix['Hips'].parent.matrix_world.inverted().to_3x3() @ (-U)) if mix['Hips'].parent else -U
    for f, d in enumerate(data):
        u = f / max(1, last); k = min(1, u * 3) * min(1, (1 - u) * 3)  # entra e sai da base
        for n, o in mix.items():
            o.rotation_quaternion, o.location = d[n][0], d[n][1]
        mix['Hips'].location = d['Hips'][1] + down * (.03 + .03 * k)
        bpy.context.view_layer.update()
        aim(mix['LeftUpLeg'], mix['LeftLeg'], vec(.38 + .14 * k, -.1, -.9))
        aim(mix['LeftLeg'], mix['LeftFoot'], vec(-.08 - .1 * k, -.03, -1))
        aim(mix['RightUpLeg'], mix['RightLeg'], vec(-.3 - .1 * k, .14, -.93))
        aim(mix['RightLeg'], mix['RightFoot'], vec(-.55 - .15 * k, .05, -.82))
        aim(mix['LeftFoot'], mix['LeftToeBase'], vec(1, -.15, -.2))
        aim(mix['RightFoot'], mix['RightToeBase'], vec(.75, .3, -.55))
        for o in mix.values():
            o.keyframe_insert('rotation_quaternion', frame=f)
        mix['Hips'].keyframe_insert('location', frame=f)
    sc.frame_start = 0; sc.frame_end = last
    bpy.ops.export_scene.gltf(filepath=outdir + '/anim-base_' + name + '.glb', export_format='GLB', export_animations=True, export_animation_mode='ACTIVE_ACTIONS', export_force_sampling=True, export_frame_range=True, export_yup=True, export_apply=False)
    print('OK', name)
