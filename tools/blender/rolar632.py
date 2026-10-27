import bpy,sys,math
from mathutils import Quaternion,Vector,Matrix
src,out=sys.argv[-2],sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
sc=bpy.context.scene
sc.render.fps=30
nodes={o.name:o for o in bpy.data.objects}
mix={n.replace('mixamorig:',''):o for n,o in nodes.items() if n.startswith('mixamorig:')}
print("NODES",len(nodes),"MIX",len(mix),"ACTS",[a.name for a in bpy.data.actions][:30])
idle=bpy.data.actions['idle']
for o in nodes.values():
    o.rotation_mode='QUATERNION'
    o.animation_data_create()
    o.animation_data.action=idle
sc.frame_set(0)
bpy.context.view_layer.update()
base_loc={n:o.location.copy() for n,o in nodes.items()}
base_q={n:o.rotation_quaternion.copy() for n,o in nodes.items()}
base_world={n:o.matrix_world.to_quaternion() for n,o in nodes.items()}
par={n:(o.parent.name if o.parent else None) for n,o in nodes.items()}
print("HIPS",base_loc.get('mixamorig:Hips'),base_q.get('mixamorig:Hips'))

N=20  # quadros 0..20 a 30 fps = 0,667 s
def sm(a,b,x):
    t=max(0.0,min(1.0,(x-a)/(b-a)));return t*t*(3-2*t)
def tuck(f):  # 0 em pe -> 1 encolhido -> 0
    return sm(0,4,f)*(1-sm(14,20,f))
def theta(f): # rolamento 0 -> 360 graus
    return 2*math.pi*sm(3,15,f)
# graus por osso (positivo = para a frente em torno do eixo lateral X do personagem)
TUCK={ 'Spine':25,'Spine1':20,'Spine2':15,'Neck':30,'Head':-10,
       'LeftUpLeg':-95,'RightUpLeg':-95,'LeftLeg':115,'RightLeg':115,'LeftFoot':-25,'RightFoot':-25,
       'LeftArm':-70,'RightArm':-70,'LeftForeArm':-105,'RightForeArm':-105 }
ax=Vector((1,0,0))
names=[n for n in nodes]
# ordem pai antes de filho
order=[];seen=set()
def visit(n):
    if n in seen:return
    p=par[n]
    if p:visit(p)
    seen.add(n);order.append(n)
for n in names:visit(n)

for o in nodes.values():
    o.animation_data.action=None
rol=bpy.data.actions.new('rolar')
for o in nodes.values():
    o.animation_data.action=rol
for f in range(0,N+1):
    sc.frame_set(f)
    T=tuck(f);th=theta(f)
    for n in order:
        o=nodes[n]
        short=n.replace('mixamorig:','')
        ang=0.0
        if short=='Hips': ang=th
        elif short in TUCK: ang=math.radians(TUCK[short])*T
        pw=base_world[par[n]] if par[n] else Quaternion((1,0,0,0))
        axl=pw.inverted()@ax
        d=Quaternion(axl.normalized(),ang) if abs(ang)>1e-9 else Quaternion((1,0,0,0))
        o.rotation_quaternion=d@base_q[n]
        o.keyframe_insert('rotation_quaternion',frame=f)
        if short=='Hips':
            l=base_loc[n].copy()
            l.z-=0.14*T   # quadril desce enquanto encolhe
            o.location=l
            o.keyframe_insert('location',frame=f)
sc.frame_start=0;sc.frame_end=N
# so a acao rolar vai para o arquivo
for a in list(bpy.data.actions):
    if a.name!='rolar': bpy.data.actions.remove(a)
bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',export_animations=True,export_force_sampling=True,export_frame_range=True,export_yup=True,export_apply=False)
print("OK",out)
