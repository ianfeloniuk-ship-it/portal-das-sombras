import bpy,sys,math
from mathutils import Vector
body,rig,out=sys.argv[-3:]
HIDE={'tripo_part_0','tripo_part_1','tripo_part_2','tripo_part_3','tripo_part_4'}
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=body);bpy.ops.import_scene.gltf(filepath=rig)
for o in list(bpy.context.scene.objects):
  if o.type=='MESH' and (o.name.startswith('Icosphere') or o.name in HIDE):bpy.data.objects.remove(o)
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=24;sc.cycles.device='CPU';sc.render.resolution_x=900;sc.render.resolution_y=700
w=bpy.data.worlds.new('w');sc.world=w;w.use_nodes=True;w.node_tree.nodes['Background'].inputs[0].default_value=(.35,.36,.4,1);w.node_tree.nodes['Background'].inputs[1].default_value=1.2
mins=Vector((1e9,)*3);maxs=-mins
for o in sc.objects:
  if o.type=='MESH':
    for c in o.bound_box:
      v=o.matrix_world@Vector(c);mins=Vector(map(min,mins,v));maxs=Vector(map(max,maxs,v))
ctr=(mins+maxs)/2;hgt=(maxs-mins).z
l=bpy.data.objects.new('s',bpy.data.lights.new('s','SUN'));l.data.energy=3;l.rotation_euler=(.8,.2,.6);sc.collection.objects.link(l)
cam=bpy.data.objects.new('c',bpy.data.cameras.new('c'));sc.collection.objects.link(cam);sc.camera=cam
for i,(name,ang) in enumerate([('frente',0),('tres',math.pi/4)]):
  d=hgt*2.0;cam.location=ctr+Vector((math.sin(ang)*d,-math.cos(ang)*d,hgt*.1))
  cam.rotation_euler=(ctr-cam.location).to_track_quat('-Z','Y').to_euler()
  sc.render.filepath=out+'-'+name+'.png';bpy.ops.render.render(write_still=True)
print('OK')
