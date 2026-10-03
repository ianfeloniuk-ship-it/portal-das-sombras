import bpy,sys
src,out,ratio=sys.argv[-3],sys.argv[-2],float(sys.argv[-1])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
t0=t1=0
for o in [o for o in bpy.context.scene.objects if o.type=='MESH']:
  bpy.context.view_layer.objects.active=o;o.select_set(True)
  t0+=sum(len(p.vertices)-2 for p in o.data.polygons)
  bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.remove_doubles(threshold=0.0001);bpy.ops.object.mode_set(mode='OBJECT')
  m=o.modifiers.new('d','DECIMATE');m.ratio=ratio;m.use_collapse_triangulate=True;bpy.ops.object.modifier_apply(modifier=m.name)
  t1+=sum(len(p.vertices)-2 for p in o.data.polygons)
bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',export_image_format='WEBP')
print('OK',t0,'->',t1)
