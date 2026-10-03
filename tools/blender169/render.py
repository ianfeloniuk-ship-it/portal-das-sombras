import bpy,sys,math,mathutils
src,out=sys.argv[-2],sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
objs=[o for o in bpy.context.scene.objects if o.type=='MESH']
mn=mathutils.Vector((1e9,)*3);mx=-mn
for o in objs:
  for c in o.bound_box:
    w=o.matrix_world@mathutils.Vector(c);mn=mathutils.Vector(map(min,mn,w));mx=mathutils.Vector(map(max,mx,w))
ctr=(mn+mx)/2;size=max(mx-mn)
tris=sum(len(o.data.polygons) for o in objs)
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=48;sc.cycles.device='CPU';sc.render.resolution_x=sc.render.resolution_y=600
w=bpy.data.worlds.new('w');sc.world=w;w.use_nodes=True;w.node_tree.nodes['Background'].inputs[0].default_value=(.12,.12,.15,1);w.node_tree.nodes['Background'].inputs[1].default_value=.6
cam=bpy.data.objects.new('cam',bpy.data.cameras.new('cam'));sc.collection.objects.link(cam);sc.camera=cam
d=size*1.9;cam.location=ctr+mathutils.Vector((d*.55,-d*.85,d*.35))
cam.rotation_euler=(ctr-cam.location).to_track_quat('-Z','Y').to_euler()
for p,e in [((3,-4,5),900),((-4,-2,2),300),((0,4,3),400)]:
  l=bpy.data.objects.new('l',bpy.data.lights.new('l','AREA'));l.data.energy=e*size*size;l.data.size=size*2;l.location=ctr+mathutils.Vector(p)*size;l.rotation_euler=(ctr-l.location).to_track_quat('-Z','Y').to_euler();sc.collection.objects.link(l)
sc.render.filepath=out;bpy.ops.render.render(write_still=True)
print('TRIS',tris)
