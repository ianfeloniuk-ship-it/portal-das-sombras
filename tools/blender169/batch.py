import bpy,sys,numpy as np,bmesh,os,colorsys
src,out,glow=sys.argv[-3],sys.argv[-2],float(sys.argv[-1])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.device='CPU';sc.cycles.samples=32
done=set()
meshes=[o for o in sc.objects if o.type=='MESH']
for o in meshes:
  bpy.ops.object.select_all(action='DESELECT');bpy.context.view_layer.objects.active=o;o.select_set(True)
  if not o.data.shape_keys:
    bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(o.data);bm.free()
  for p in o.data.polygons:p.use_smooth=True
  try:bpy.ops.object.shade_smooth_by_angle(angle=0.75)
  except Exception as e:pass
  for m in o.data.materials:
    if not m or not m.use_nodes or m.name in done:continue
    nt=m.node_tree;bsdf=next((n for n in nt.nodes if n.type=='BSDF_PRINCIPLED'),None)
    if not bsdf:continue
    tex=next((l.from_node for l in nt.links if l.to_socket==bsdf.inputs['Base Color'] and l.from_node.type=='TEX_IMAGE'),None)
    if not tex or not tex.image:continue
    done.add(m.name);base=tex.image;W,H=base.size;s=min(1,1024/max(W,H))
    aw,ah=int(W*s),int(H*s)
    ao=bpy.data.images.new('ao',aw,ah);n=nt.nodes.new('ShaderNodeTexImage');n.image=ao;nt.nodes.active=n
    for mm in o.data.materials:
      if mm and mm.use_nodes and mm!=m:pass
    try:bpy.ops.object.bake(type='AO',margin=8)
    except Exception as e:print('bake',e);nt.nodes.remove(n);continue
    A=np.array(ao.pixels[:]).reshape(ah,aw,4)[...,0]
    if (aw,ah)!=(W,H):
      yi=(np.arange(H)*ah//H);xi=(np.arange(W)*aw//W);A=A[yi][:,xi]
    B=np.array(base.pixels[:]).reshape(H,W,4);rgb=B[...,:3].copy()
    mx=rgb.max(-1);mn=rgb.min(-1);sat=(mx-mn)/np.maximum(mx,1e-4)
    lum=rgb.mean(-1,keepdims=True);r2=np.clip(lum+(rgb-lum)*1.25,0,1);r2=np.clip((r2-.5)*1.12+.5,0,1)
    r2=r2*(0.45+0.55*A[...,None]);r2=np.clip(r2+((A[...,None]>.92)*(lum>.25))*.06,0,1)
    B[...,:3]=r2;base.pixels[:]=B.ravel();base.pack()
    if glow>0:
      thr=.6
      mask=np.clip((sat-thr)*5,0,1)*np.clip((mx-.3)*4,0,1)
      while mask.mean()>.18 and thr<.95:
        thr+=.08;mask=np.clip((sat-thr)*5,0,1)*np.clip((mx-.3)*4,0,1)
      if mask.mean()>.002 and not bsdf.inputs['Emission Color'].is_linked:
        em=bpy.data.images.new('emit',W,H);E=np.zeros((H,W,4));E[...,:3]=rgb*mask[...,None];E[...,3]=1;em.pixels[:]=E.ravel();em.pack()
        en=nt.nodes.new('ShaderNodeTexImage');en.image=em;nt.links.new(en.outputs[0],bsdf.inputs['Emission Color']);bsdf.inputs['Emission Strength'].default_value=glow
    nt.nodes.remove(n)
os.makedirs(os.path.dirname(out),exist_ok=True)
bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',export_image_format='WEBP',export_animations=True,export_skins=True)
print('OK',src)
