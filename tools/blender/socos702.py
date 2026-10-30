# Socos do Viajante para quem luta sem arma (Ian, 29/10/2026).
# uso: blender -b -P socos702.py -- entrada.glb pasta_saida
# Poses por DIREÇÃO no corpo (F frente, R direita, U cima): o braço aponta e o script acha a rotação.
import bpy, sys, json
from mathutils import Quaternion, Vector
src, outdir = sys.argv[-2], sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
sc = bpy.context.scene
sc.render.fps = 30
nodes = {o.name: o for o in bpy.data.objects}
B = lambda s: nodes['mixamorig:' + s]
idle = bpy.data.actions['idle']
for o in nodes.values():
    o.rotation_mode = 'QUATERNION'
    o.animation_data_create()
    o.animation_data.action = idle
sc.frame_set(0)
bpy.context.view_layer.update()
base_q = {n: o.rotation_quaternion.copy() for n, o in nodes.items()}
base_loc = {n: o.location.copy() for n, o in nodes.items()}
for o in nodes.values():
    o.animation_data.action = None
order, seen = [], set()
def visit(o):
    if o.name in seen: return
    if o.parent: visit(o.parent)
    seen.add(o.name); order.append(o)
for o in nodes.values(): visit(o)
def reset():
    for n, o in nodes.items():
        o.rotation_quaternion = base_q[n]; o.location = base_loc[n]
    bpy.context.view_layer.update()
reset()
pos = lambda o: o.matrix_world.translation.copy()
R = (pos(B('RightArm')) - pos(B('LeftArm'))); R.z = 0; R.normalize()
U = Vector((0, 0, 1))
tv = pos(B('RightToeBase')) - pos(B('RightFoot')); tv.z = 0
F = U.cross(R).normalized()
if F.dot(tv) < 0: F = -F
print('EIXOS', F, R)
vec = lambda f, r, u: (F * f + R * r + U * u).normalized()
def aim(o, child, d):
    bpy.context.view_layer.update()
    cur = (pos(child) - pos(o)).normalized()
    rot = cur.rotation_difference(d)
    w = o.matrix_world.to_quaternion()
    p = o.parent.matrix_world.to_quaternion() if o.parent else Quaternion()
    o.rotation_quaternion = (p.inverted() @ rot @ w).normalized()
def yaw(o, deg):
    w = o.matrix_world.to_quaternion()
    p = o.parent.matrix_world.to_quaternion() if o.parent else Quaternion()
    from math import radians
    o.rotation_quaternion = (p.inverted() @ Quaternion(U, radians(deg)) @ w).normalized()
    bpy.context.view_layer.update()
def lean(o, deg):
    from math import radians
    w = o.matrix_world.to_quaternion()
    p = o.parent.matrix_world.to_quaternion() if o.parent else Quaternion()
    o.rotation_quaternion = (p.inverted() @ Quaternion(U.cross(F).normalized(), radians(deg)) @ w).normalized()
    bpy.context.view_layer.update()
GUARD_R = (vec(.35, .35, -.87), vec(.75, -.2, .63))
GUARD_L = (vec(.35, -.35, -.87), vec(.75, .2, .63))
def solve(right, left=GUARD_L, twist=0, drop=0):
    reset()
    if twist:
        # o corpo vai junto: quadril e ombros giram para dentro do golpe e o tronco inclina para a frente
        yaw(B('Hips'), twist * .4); yaw(B('Spine'), twist * .3); yaw(B('Spine2'), twist * .3)
        lean(B('Spine'), abs(twist) * .3)
    aim(B('RightArm'), B('RightForeArm'), right[0]); aim(B('RightForeArm'), B('RightHand'), right[1])
    aim(B('LeftArm'), B('LeftForeArm'), left[0]); aim(B('LeftForeArm'), B('LeftHand'), left[1])
    bpy.context.view_layer.update()
    q = {n: o.rotation_quaternion.copy() for n, o in nodes.items()}
    return q
# sinal do giro: positivo em torno de U gira a frente para a esquerda; o soco da direita avança o ombro direito
guard = solve(GUARD_R)
CLIPS = {
    'soco_jab': [(0, GUARD_R, 0), (3, (vec(.15, .5, -.85), vec(.8, -.1, .6)), -20), (6, (vec(.97, .05, .1), vec(1, -.03, .1)), 50), (9, (vec(.95, .08, .05), vec(1, 0, .06)), 42), (15, GUARD_R, 0)],
    'soco_gancho': [(0, GUARD_R, 0), (3, (vec(-.1, .9, -.3), vec(.55, .7, .4)), -35), (7, (vec(.72, .68, .12), vec(.75, -.65, .1)), 65), (10, (vec(.75, .6, .1), vec(.65, -.75, .1)), 55), (16, GUARD_R, 0)],
    'soco_alto': [(0, GUARD_R, 0), (4, (vec(.05, .3, -.95), vec(.8, -.1, -.55)), -25), (7, (vec(.7, .15, -.68), vec(.3, -.08, .95)), 45), (10, (vec(.72, .15, -.65), vec(.28, -.08, .96)), 38), (17, GUARD_R, 0)],
}
report = {}
mir = lambda v: v - R * (2 * v.dot(R))
for name, keys in list(CLIPS.items()) + [(k + '_esq', v) for k, v in CLIPS.items()]:
    esq = name.endswith('_esq')
    solved = [(f, solve(GUARD_R, (mir(p[0]), mir(p[1])), -t) if esq else solve(p, twist=t)) for f, p, t in keys]
    # conferência: onde fica a mão no impacto (metros, no corpo)
    (solve(GUARD_R, (mir(keys[2][1][0]), mir(keys[2][1][1])), -keys[2][2]) if esq else solve(keys[2][1], twist=keys[2][2])); bpy.context.view_layer.update()
    h = pos(B('RightHand')) - pos(B('Spine2'))
    report[name] = {'frente': round(h.dot(F), 2), 'direita': round(h.dot(R), 2), 'cima': round(h.dot(U), 2)}
    joints = {k: list(pos(B(k))) for k in ['Hips', 'Spine2', 'Head', 'RightArm', 'RightForeArm', 'RightHand', 'LeftArm', 'LeftForeArm', 'LeftHand']}
    report[name + '_j'] = joints
    for a in list(bpy.data.actions): bpy.data.actions.remove(a)
    act = bpy.data.actions.new(name)
    for o in nodes.values():
        o.animation_data_create(); o.animation_data.action = act
    last = solved[-1][0]
    for f in range(last + 1):
        i = max(j for j in range(len(solved)) if solved[j][0] <= f)
        j = min(i + 1, len(solved) - 1)
        f0, f1 = solved[i][0], solved[j][0]
        t = 0 if f1 == f0 else (f - f0) / (f1 - f0)
        t = t * t * (3 - 2 * t)
        for n, o in nodes.items():
            if not n.startswith('mixamorig:'): continue
            o.rotation_quaternion = solved[i][1][n].slerp(solved[j][1][n], t)
            o.keyframe_insert('rotation_quaternion', frame=f)
            if n == 'mixamorig:Hips':
                o.location = base_loc[n]; o.keyframe_insert('location', frame=f)
    sc.frame_start = 0; sc.frame_end = last
    bpy.ops.export_scene.gltf(filepath=outdir + '/anim-' + name + '.glb', export_format='GLB', export_animations=True, export_force_sampling=True, export_frame_range=True, export_yup=True, export_apply=False)
    for o in nodes.values(): o.animation_data.action = None
open(outdir + '/socos702.json', 'w').write(json.dumps(report))
print('RELATORIO', {k: v for k, v in report.items() if not k.endswith('_j')})
