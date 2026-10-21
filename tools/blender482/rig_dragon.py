# v482 — rig e animação de DRAGÃO no Blender (regra do Ian: rig SEMPRE no Blender, nunca no Tripo).
# Uso:
#   blender -b --python tools/blender482/rig_dragon.py -- --in RAW.glb --out models/povo482/ID.glb --id ID
#           --marks tools/blender482/dragon_marks/ID.json [--proofs DIR] [--height 4.0] [--tris 19000]
#           [--stage marks|all] [--force-proxy]
# Faz: importa o GLB cru do Tripo, orienta (plano de simetria + cabeça = ponta alta do eixo longo) para frente -Y
# (glTF +Z), normaliza (altura = --height), lê os marcos (arquivo --marks, unidades com altura 1; cauda "auto"
# = linha central por fatias), monta o esqueleto próprio (root, pelvis, spine 5, neck 6, head, jaw, tail 12,
# pernas traseiras thigh/shin/foot(metatarso)/toe, patas dianteiras se houver, asas: raiz, úmero, antebraço, mão,
# polegar/garra e 4 dedos de 2 segmentos), pesa (heat; se falhar, proxy voxel fechado + Data Transfer) e corrige
# por regras (membrana = inverso da distância aos ossos da asa; mandíbula por linha da boca; lados), textura 1024
# JPEG, animação por código (pose = função do tempo; ondas com atraso por osso ao longo de pescoço/cauda/asa,
# antecipação e follow-through, IK analítico dos pés no chão), exporta GLB + JSON e as provas.
# Corpo "quad" (4 patas + asas, como o dragao_anciao) ou "wyvern" (asas = membros dianteiros; sem "fore" nos marcos).
import bpy, bmesh, sys, os, json, struct, math, time
import numpy as np
from mathutils import Matrix, Vector, Quaternion, kdtree

T0 = time.time()
def log(*a):
    print('D482:', *a, flush=True)

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def arg(name, default=None, flag=False):
    if flag: return ('--' + name) in argv
    if ('--' + name) in argv: return argv[argv.index('--' + name) + 1]
    return default
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC = arg('in'); OUT = arg('out'); OUT = OUT and os.path.abspath(OUT); NID = arg('id')
MARKS = arg('marks', os.path.join(HERE, 'dragon_marks', (NID or '') + '.json'))
H = float(arg('height', '4.0'))
TRIS = int(arg('tris', '19000'))
PROOFS = os.path.abspath(arg('proofs', os.path.join(os.path.dirname(os.path.abspath(OUT)), 'proofs')))   # absoluto: caminho relativo no render do Blender cai na raiz do disco
STAGE = arg('stage', 'all')
FORCE_PROXY = arg('force-proxy', flag=True)
TEMPO = float(arg('tempo', '1.0'))   # ritmo pelo porte: <1 = mais rápido (dragão pequeno/ágil), >1 = mais pesado e lento
FPS = 30
assert SRC and OUT and NID, 'faltou --in/--out/--id'
os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
os.makedirs(PROOFS, exist_ok=True)
MK = json.load(open(MARKS, encoding='utf-8'))
QUAD = 'fore' in MK

# ---------------------------------------------------------------- GLB (JSON + binário) para verificação
def read_glb(path):
    d = open(path, 'rb').read(); off = 12; js = None; bin_ = None
    while off < len(d):
        ln, typ = struct.unpack('<II', d[off:off + 8]); chunk = d[off + 8:off + 8 + ln]
        if typ == 0x4E4F534A: js = json.loads(chunk)
        elif typ == 0x004E4942: bin_ = chunk
        off += 8 + ln
    return js, bin_
def accessor(js, bin_, i):
    a = js['accessors'][i]; bv = js['bufferViews'][a['bufferView']]
    comp = {5126: ('<f', 4), 5123: ('<H', 2), 5121: ('<B', 1), 5125: ('<I', 4)}[a['componentType']]
    n = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}[a['type']]
    start = bv.get('byteOffset', 0) + a.get('byteOffset', 0); stride = bv.get('byteStride', 0) or comp[1] * n
    out = np.empty((a['count'], n))
    for k in range(n):
        out[:, k] = np.ndarray((a['count'],), dtype=np.dtype(comp[0]), buffer=bin_, offset=start + k * comp[1], strides=(stride,))
    return out

# ---------------------------------------------------------------- importar, limpar, orientar, normalizar
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
bpy.ops.import_scene.gltf(filepath=SRC)
for o in list(sc.objects):
    if o.animation_data: o.animation_data_clear()
for a in list(bpy.data.actions): bpy.data.actions.remove(a)
meshes = [o for o in sc.objects if o.type == 'MESH' and len(o.data.polygons)]
for o in meshes:
    mw = o.matrix_world.copy()
    for md in list(o.modifiers): o.modifiers.remove(md)
    o.parent = None; o.matrix_world = mw; o.vertex_groups.clear()
    if o.data.shape_keys: o.shape_key_clear()
for o in list(sc.objects):
    if o not in meshes: bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.object.select_all(action='DESELECT')
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1: bpy.ops.object.join()
ob = bpy.context.view_layer.objects.active; ob.name = NID; ob.data.name = NID
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
me = ob.data
def V():
    a = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', a); return a.reshape(-1, 3)
def setV(a):
    me.vertices.foreach_set('co', a.reshape(-1)); me.update()

co = V()
# eixo lateral = plano de simetria (espelho com menor erro)
kd = kdtree.KDTree(len(co))
for i, p in enumerate(co): kd.insert(p, i)
kd.balance()
smp = np.random.default_rng(0).choice(len(co), min(2000, len(co)), replace=False)
def symerr(ax):
    c = co[smp].copy(); m = 0.5 * (co[:, ax].min() + co[:, ax].max()); c[:, ax] = 2 * m - c[:, ax]
    return float(np.mean([kd.find(p)[2] for p in c]))
e0, e1 = symerr(0), symerr(1)
lat = 0 if e0 < e1 else 1; lon = 1 - lat
# cabeça = lado do eixo longo onde está o topo da faixa central
zr = co[:, 2].max() - co[:, 2].min()
cen = np.abs(co[:, lat] - 0.5 * (co[:, lat].min() + co[:, lat].max())) < 0.05 * zr
top = co[cen & (co[:, 2] > co[cen, 2].max() - 0.25 * zr)]
mid_lon = 0.5 * (co[:, lon].min() + co[:, lon].max())
head_sign = 1 if top[:, lon].mean() > mid_lon else -1
# queremos cabeça em -Y, esquerda em +X (sistema destro): Y' = -head_sign*lon ; X' escolhido p/ manter destro
if lon == 1:
    Rm = np.array([[-head_sign, 0, 0], [0, -head_sign, 0], [0, 0, 1]]) if True else None
else:
    Rm = np.array([[0, head_sign, 0], [-head_sign, 0, 0], [0, 0, 1]])  # lon=X: Y' = -s*X, X' = s*Y
co = co @ Rm.T
log('simetria x %.4f y %.4f -> lateral %s, cabeça %+d' % (e0, e1, 'xy'[lat], head_sign))
zmin = co[:, 2].min(); s = 1.0 / (co[:, 2].max() - zmin)
co[:, 2] -= zmin
co[:, 0] -= 0.5 * (co[:, 0].min() + co[:, 0].max()); co[:, 1] -= 0.5 * (co[:, 1].min() + co[:, 1].max())
co *= s
CN = co.copy()            # coordenadas normalizadas (altura 1) — referência dos marcos
setV(co * H)

bm = bmesh.new(); bm.from_mesh(me)
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4 * H)
bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
bm.to_mesh(me); bm.free(); me.update()
tris = sum(len(p.vertices) - 2 for p in me.polygons)
if tris > TRIS * 1.05:
    md = ob.modifiers.new('dec', 'DECIMATE'); md.decimate_type = 'COLLAPSE'; md.ratio = TRIS / tris; md.use_collapse_triangulate = True
    bpy.context.view_layer.objects.active = ob; bpy.ops.object.modifier_apply(modifier=md.name)
tris = sum(len(p.vertices) - 2 for p in me.polygons)
for p in me.polygons: p.use_smooth = True
while len(me.uv_layers) > 1: me.uv_layers.remove(me.uv_layers[-1])
for ca in list(me.color_attributes): me.color_attributes.remove(ca)
CN = V() / H
if os.environ.get('D482_DUMP'): np.save(os.environ['D482_DUMP'], CN)
log('malha', len(me.vertices), 'verts', tris, 'tris')

# ---------------------------------------------------------------- marcos -> pontos do esqueleto
def v3(p, side=1):
    return Vector((p[0] * side * H, p[1] * H, p[2] * H))
def resample(pts, n):
    """Polilinha -> n+1 pontos igualmente espaçados (comprimento de arco)."""
    P_ = [Vector(p) for p in pts]
    seg = [(P_[i + 1] - P_[i]).length for i in range(len(P_) - 1)]; tot = sum(seg)
    out = []
    for k in range(n + 1):
        d = tot * k / n; i = 0
        while i < len(seg) - 1 and d > seg[i]: d -= seg[i]; i += 1
        f = 0 if seg[i] == 0 else min(1, d / seg[i]); out.append(P_[i].lerp(P_[i + 1], f))
    return out
def bezier(pts, n=24):
    a, b, c = [Vector(p) for p in pts]
    return [a * (1 - t) ** 2 + b * 2 * t * (1 - t) + c * t * t for t in (k / n for k in range(n + 1))]

if MK.get('tail', 'auto') == 'auto':
    pel = MK['pelvis']; tl = [pel]; xc = 0.0; y0 = pel[1] + 0.06
    while True:
        m = (CN[:, 1] >= y0) & (CN[:, 1] < y0 + 0.04) & (CN[:, 2] < pel[2] + 0.2) & (np.abs(CN[:, 0] - xc) < 0.13)
        if m.sum() < 6: break
        p = CN[m]; xc = float(np.median(p[:, 0]))
        tl.append([float(p[:, 0].mean()), y0 + 0.02, float(0.5 * (p[:, 2].min() + p[:, 2].max()))]); y0 += 0.04
    far = CN[(CN[:, 1] > y0 - 0.06) & (np.abs(CN[:, 0] - xc) < 0.15)]
    if len(far): tl.append(list(far[np.argmax(far[:, 1])]))
    TAILPTS = tl
else:
    TAILPTS = MK['tail']
BONES = []   # (nome, head, tail, pai)
def add(n, h, t, p): BONES.append((n, Vector(h), Vector(t), p))
root = v3(MK['root']); add('root', root, root + Vector((0, -0.08 * H, 0)), None)
spine_c = resample(bezier(MK['spine']), 24)
sp = [v3(p) for p in resample([list(p) for p in spine_c], 6)]
add('pelvis', sp[0], sp[1], 'root')
for i in range(5): add('spine_%02d' % (i + 1), sp[i + 1], sp[i + 2], 'pelvis' if i == 0 else 'spine_%02d' % i)
nk = [v3(p) for p in resample(MK['neck'], 6)]
for i in range(6): add('neck_%02d' % (i + 1), nk[i], nk[i + 1], 'spine_05' if i == 0 else 'neck_%02d' % i)
add('head', v3(MK['head']), v3(MK['snout']), 'neck_06')
add('jaw', v3(MK['jaw']), v3(MK['chin']), 'head')
tp = [v3(p) for p in resample(TAILPTS, 13)][1:]   # cauda começa um pouco atrás da pelve
for i in range(12): add('tail_%02d' % (i + 1), tp[i], tp[i + 1], 'pelvis' if i == 0 else 'tail_%02d' % i)
for sg, S in ((1, 'L'), (-1, 'R')):
    hd = MK['hind']
    add('thigh_' + S, v3(hd['hip'], sg), v3(hd['knee'], sg), 'pelvis')
    add('shin_' + S, v3(hd['knee'], sg), v3(hd['hock'], sg), 'thigh_' + S)
    add('foot_' + S, v3(hd['hock'], sg), v3(hd['ball'], sg), 'shin_' + S)
    add('toe_' + S, v3(hd['ball'], sg), v3(hd['toe'], sg), 'foot_' + S)
    if QUAD:
        fr = MK['fore']
        add('upperarm_' + S, v3(fr['shoulder'], sg), v3(fr['elbow'], sg), 'spine_05')
        add('forearm_' + S, v3(fr['elbow'], sg), v3(fr['wrist'], sg), 'upperarm_' + S)
        add('hand_' + S, v3(fr['wrist'], sg), v3(fr['ball'], sg), 'forearm_' + S)
        add('fingers_' + S, v3(fr['ball'], sg), v3(fr['toe'], sg), 'hand_' + S)
    w = MK['wing_R'] if (S == 'R' and 'wing_R' in MK) else MK['wing']   # Tripo não é simétrico: asa direita pode ter marcos próprios (em +X espelhado)
    add('wing_root_' + S, v3(w['root'], sg), v3(w['shoulder'], sg), 'spine_04')
    add('wing_upper_' + S, v3(w['shoulder'], sg), v3(w['elbow'], sg), 'wing_root_' + S)
    add('wing_fore_' + S, v3(w['elbow'], sg), v3(w['wrist'], sg), 'wing_upper_' + S)
    wr = v3(w['wrist'], sg); fm = sum((v3(f, sg) for f in w['fingers']), Vector()) / len(w['fingers'])
    add('wing_hand_' + S, wr, wr + (fm - wr).normalized() * 0.03 * H, 'wing_fore_' + S)
    add('wing_thumb_' + S, wr, v3(w['thumb'], sg), 'wing_hand_' + S)
    for k, f in enumerate(w['fingers']):
        tip = v3(f, sg); midp = wr.lerp(tip, 0.5)
        add('finger%d_a_%s' % (k + 1, S), wr, midp, 'wing_hand_' + S)
        add('finger%d_b_%s' % (k + 1, S), midp, tip, 'finger%d_a_%s' % (k + 1, S))
NAMES = [b[0] for b in BONES]; PARENT = {b[0]: b[3] for b in BONES}
HEAD = {b[0]: b[1] for b in BONES}; TAIL = {b[0]: b[2] for b in BONES}
log('ossos', len(NAMES))

arm_d = bpy.data.armatures.new(NID + '_rig'); arm = bpy.data.objects.new(NID + '_rig', arm_d)
sc.collection.objects.link(arm); bpy.context.view_layer.objects.active = arm
bpy.ops.object.mode_set(mode='EDIT')
for n, h, t, p in BONES:
    eb = arm_d.edit_bones.new(n); eb.head = h; eb.tail = t
    if (t - h).length < 0.01 * H: eb.tail = h + Vector((0, 0, 0.01 * H))
    d = (eb.tail - eb.head).normalized()
    eb.align_roll(Vector((0, 0, 1)) if abs(d.z) < 0.9 else Vector((0, -1, 0)))
    if p: eb.parent = arm_d.edit_bones[p]
    eb.use_deform = n != 'root'
bpy.ops.object.mode_set(mode='OBJECT')
REST = {b.name: b.matrix_local.copy() for b in arm_d.bones}
RROT = {k: m.to_quaternion() for k, m in REST.items()}

# cena de render (Workbench: rápido e fiel à malha)
sc.render.engine = 'BLENDER_WORKBENCH'
sh = sc.display.shading
sh.light = 'STUDIO'; sh.color_type = 'TEXTURE'; sh.show_cavity = False; sh.show_backface_culling = False
sc.display.render_aa = '8'
sc.world = bpy.data.worlds.new('w'); sc.world.color = (0.36, 0.37, 0.40)
sc.view_settings.view_transform = 'Standard'
sc.render.resolution_x = 520; sc.render.resolution_y = 420
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = 'ORTHO'
def shoot(path, yaw=0.0, el=0.0, scale=1.5, c=None):
    """yaw 0 = vista do lado esquerdo (+X), 90 = de frente (-Y)."""
    c = Vector((0, -0.05 * H, 0.5 * H)) if c is None else c
    cam.data.ortho_scale = scale * H
    a = math.radians(yaw); e = math.radians(el); d = 6 * H
    dirv = Vector((math.cos(a) * math.cos(e), -math.sin(a) * math.cos(e), math.sin(e)))
    cam.location = c + dirv * d
    cam.rotation_euler = (-dirv).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = path; bpy.ops.render.render(write_still=True)
    return path
def sheet(paths, cols, out, labels=None):
    ims = [bpy.data.images.load(p) for p in paths]
    w_, h_ = ims[0].size; rows = (len(ims) + cols - 1) // cols
    big = np.full((rows * h_, cols * w_, 4), 1.0, dtype=np.float32); big[:, :, :3] = 0.18
    for k, im in enumerate(ims):
        a = np.empty(w_ * h_ * 4, dtype=np.float32); im.pixels.foreach_get(a); a = a.reshape(h_, w_, 4)
        r, c_ = k // cols, k % cols
        big[(rows - 1 - r) * h_:(rows - r) * h_, c_ * w_:(c_ + 1) * w_] = a
        big[(rows - 1 - r) * h_:(rows - r) * h_, c_ * w_:c_ * w_ + 1, :3] = 0.1
        big[(rows - 1 - r) * h_:(rows - 1 - r) * h_ + 1, c_ * w_:(c_ + 1) * w_, :3] = 0.1
    o = bpy.data.images.new('sheet', cols * w_, rows * h_); o.pixels.foreach_set(big.ravel())
    o.filepath_raw = out; o.file_format = 'PNG'; o.save()
    for im in ims: bpy.data.images.remove(im)
    bpy.data.images.remove(o)
    for p in paths:
        try: os.remove(p)
        except OSError: pass
    return out
TMP = os.path.join(PROOFS, '_tmp_' + NID); os.makedirs(TMP, exist_ok=True)

def marks_proof(path):
    """Ossos como bastões coloridos sobre a malha em raio-X: confere os marcos."""
    objs = []
    mat_cols = {'wing': (0.1, 0.6, 1.0), 'finger': (0.1, 0.9, 0.9), 'tail': (1.0, 0.8, 0.1), 'neck': (1.0, 0.3, 0.9),
                'thigh': (0.2, 1.0, 0.2), 'shin': (0.2, 1.0, 0.2), 'foot': (0.2, 1.0, 0.2), 'toe': (0.2, 1.0, 0.2),
                'jaw': (1, 0.1, 0.1), 'head': (1, 0.5, 0.1)}
    for n, h, t, p in BONES:
        if n == 'root': continue
        col = (1.0, 1.0, 1.0)
        for k, c in mat_cols.items():
            if n.startswith(k): col = c
        if n.startswith(('upperarm', 'forearm', 'hand_', 'fingers')): col = (0.6, 1.0, 0.4)
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.006 * H, depth=(t - h).length, location=(h + t) / 2)
        cy = bpy.context.active_object
        cy.rotation_mode = 'QUATERNION'; cy.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(t - h)
        cy.color = col + (1,); objs.append(cy)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.011 * H, location=h, segments=8, ring_count=6)
        sp_ = bpy.context.active_object; sp_.color = col + (1,); objs.append(sp_)
    sh.color_type = 'OBJECT'; ob.color = (0.55, 0.5, 0.45, 1)
    sh.show_xray = True; sh.xray_alpha = 0.35
    shots = [shoot(os.path.join(TMP, 'k0.png'), 0, 0, 1.25), shoot(os.path.join(TMP, 'k1.png'), 90, 0, 1.4),
             shoot(os.path.join(TMP, 'k2.png'), 0, 89, 1.4), shoot(os.path.join(TMP, 'k3.png'), 45, 20, 1.4)]
    sh.show_xray = False; sh.color_type = 'TEXTURE'
    for o in objs: bpy.data.objects.remove(o, do_unlink=True)
    sheet(shots, 2, path)
    log('prova marcos', path)

marks_proof(os.path.join(PROOFS, NID + '-marcos.png'))
if STAGE == 'marks':
    log('fim (stage marks) %.1fs' % (time.time() - T0)); sys.exit(0)

# cor de referência: malha crua com o material original do Tripo (mesma luz das provas finais)
COR0 = [shoot(os.path.join(TMP, 'r0.png'), 0, 4, 1.5), shoot(os.path.join(TMP, 'r1.png'), 40, 16, 1.5)]


# ---------------------------------------------------------------- pesos
DEFB = [n for n in NAMES if n != 'root']
JI = {n: i for i, n in enumerate(DEFB)}
def bind(target):
    bpy.ops.object.select_all(action='DESELECT')
    target.select_set(True); arm.select_set(True); bpy.context.view_layer.objects.active = arm
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
def weight_matrix(o):
    W = np.zeros((len(o.data.vertices), len(DEFB)))
    gi = {g.index: JI[g.name] for g in o.vertex_groups if g.name in JI}
    for v in o.data.vertices:
        for g in v.groups:
            if g.group in gi: W[v.index, gi[g.group]] = g.weight
    return W
def weights_ok(W):
    zero = float((W.sum(1) < 1e-4).mean())
    dead = [DEFB[j] for j in range(len(DEFB)) if W[:, j].max() < 0.05 and not DEFB[j].startswith(('wing_hand', 'pelvis'))]
    return zero, dead
method = 'heat'
if not FORCE_PROXY:
    bind(ob); W = weight_matrix(ob); zero, dead = weights_ok(W)
    log('heat: sem peso %.2f%%' % (100 * zero), 'ossos mortos', dead)
    if zero > 0.01: method = 'proxy'
else:
    method = 'proxy'
if method == 'proxy':
    for g in list(ob.vertex_groups): ob.vertex_groups.remove(g)
    for md in list(ob.modifiers): ob.modifiers.remove(md)
    ob.parent = None
    px = ob.copy(); px.data = ob.data.copy(); px.name = 'proxy'; sc.collection.objects.link(px)
    rm = px.modifiers.new('rm', 'REMESH'); rm.mode = 'VOXEL'; rm.voxel_size = 0.006 * H
    bpy.context.view_layer.objects.active = px; bpy.ops.object.select_all(action='DESELECT'); px.select_set(True)
    bpy.ops.object.modifier_apply(modifier=rm.name)
    d2 = px.modifiers.new('d', 'DECIMATE'); d2.ratio = min(1.0, 60000 / max(1, len(px.data.polygons)))
    bpy.ops.object.modifier_apply(modifier=d2.name)
    bind(px)
    for b in DEFB: ob.vertex_groups.new(name=b)
    dt = ob.modifiers.new('dt', 'DATA_TRANSFER'); dt.object = px; dt.use_vert_data = True
    dt.data_types_verts = {'VGROUP_WEIGHTS'}; dt.vert_mapping = 'POLYINTERP_NEAREST'
    dt.layers_vgroup_select_src = 'ALL'; dt.layers_vgroup_select_dst = 'NAME'
    bpy.context.view_layer.objects.active = ob; bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True)
    bpy.ops.object.modifier_apply(modifier=dt.name)
    W = weight_matrix(ob); zero, dead = weights_ok(W)
    log('proxy: sem peso %.2f%%' % (100 * zero), 'ossos mortos', dead)
    bpy.data.objects.remove(px, do_unlink=True)

co = V() / H; X, Y, Z = co[:, 0], co[:, 1], co[:, 2]; n = len(co)
def soft(v, a, b):
    t = np.clip((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def segd(b):
    h = np.array(HEAD[b][:]) / H; t = np.array(TAIL[b][:]) / H; d = t - h; ll = max(1e-12, d @ d)
    u = np.clip(((co - h) @ d) / ll, 0, 1)
    return np.linalg.norm(co - (h + u[:, None] * d), axis=1)
DIST = np.stack([segd(b) for b in DEFB], 1)
near = np.array(DEFB)[DIST.argmin(1)]

# --- lados: osso _L só em x >= 0, _R só em x <= 0 (com faixa suave no meio)
for j, b in enumerate(DEFB):
    if b.endswith('_L'): W[:, j] *= soft(X, -0.015, 0.004)
    if b.endswith('_R'): W[:, j] *= soft(-X, -0.015, 0.004)

# --- membrana e ossos da asa: inverso da distância aos ossos da asa do mesmo lado (a membrana segue os dedos)
WING = ('wing_upper', 'wing_fore', 'wing_hand', 'wing_thumb', 'finger')
wmask = np.zeros(n, bool)
for sg, S in ((1, 'L'), (-1, 'R')):
    wb = [b for b in DEFB if b.startswith(WING) and b.endswith('_' + S)]
    js_ = [JI[b] for b in wb]
    sh_x = HEAD['wing_upper_' + S].x * sg / H
    isw = np.isin(near, wb) & (X * sg > sh_x + 0.02)
    D_ = DIST[isw][:, js_]
    w_ = 1.0 / (D_ ** 4 + 1e-7)
    # 3 maiores
    keep = np.argsort(-w_, 1)[:, :3]; m_ = np.zeros_like(w_); np.put_along_axis(m_, keep, 1, 1); w_ *= m_
    w_ /= w_.sum(1, keepdims=True)
    # perto do ombro: mistura com o que o heat deu (úmero/corpo) para não rasgar a raiz
    blend = soft(X[isw] * sg, sh_x + 0.02, sh_x + 0.08)[:, None]
    Wn = np.zeros((isw.sum(), len(DEFB))); Wn[:, js_] = w_
    W[isw] = W[isw] * (1 - blend) + Wn * blend
    wmask |= isw
    # nada de asa no corpo longe da raiz
    far_body = ~np.isin(near, wb) & (X * sg < sh_x - 0.02)
    for j in js_: W[far_body, j] = 0

# --- cabeça x mandíbula pela linha da boca (a boca abre)
hy, hz = HEAD['head'].y / H, HEAD['head'].z / H
jy, jz = HEAD['jaw'].y / H, HEAD['jaw'].z / H
cz = TAIL['jaw'].z / H; sy = TAIL['head'].y / H
(m0y, m0z), (m1y, m1z) = [(p[1], p[2]) for p in MK['mouth']]
def mouth_z(y):
    # linha da boca da ponta (m0) até o fundo (m1) e depois sobe até a dobradiça
    a = np.interp(y, [m0y, m1y, jy], [m0z, m1z, jz])
    return a
headreg = (Y < hy - 0.015) & (Z > cz - 0.04) & (np.abs(X) < 0.16) | (np.isin(near, ['head', 'jaw']) & (Y < hy + 0.02))
horn = (near == 'head') & (Z > hz + 0.03)
headreg |= horn
jawp = soft(mouth_z(Y) - Z, -0.002, 0.012) * (Y < jy + 0.02) * soft(Z, cz - 0.03, cz - 0.01)
jawp *= 1 - soft(Y, jy - 0.005, jy + 0.025)
Wh = np.zeros((headreg.sum(), len(DEFB)))
Wh[:, JI['jaw']] = jawp[headreg]; Wh[:, JI['head']] = 1 - jawp[headreg]
# perto da nuca mistura com o pescoço que o heat deu
bl = np.maximum(soft(-(Y[headreg] - hy), -0.02, 0.03), horn[headreg] * 1.0)[:, None]
W[headreg] = W[headreg] * (1 - bl) + Wh * bl
W[~headreg, JI['jaw']] = 0

# --- pernas e patas só abaixo do corpo; cauda só atrás da pelve
pel = HEAD['pelvis'] / H
for S in ('L', 'R'):
    for b in ('shin', 'foot', 'toe'):
        W[:, JI[b + '_' + S]] *= 1 - soft(Z, HEAD['thigh_' + S].z / H - 0.02, HEAD['thigh_' + S].z / H + 0.03)
    if QUAD:
        for b in ('forearm', 'hand', 'fingers'):
            W[:, JI[b + '_' + S]] *= 1 - soft(Z, HEAD['upperarm_' + S].z / H - 0.06, HEAD['upperarm_' + S].z / H)
for i in range(12):
    W[:, JI['tail_%02d' % (i + 1)]] *= soft(Y, pel.y - 0.02, pel.y + 0.04)

# suaviza (Laplaciano) — membrana mais leve para não borrar os dedos
ev = np.empty(len(me.edges) * 2, dtype=np.int64); me.edges.foreach_get('vertices', ev); ev = ev.reshape(-1, 2)
deg = np.bincount(ev.ravel(), minlength=n).astype(float); deg[deg == 0] = 1
def smooth(M, it, f):
    for _ in range(it):
        acc = np.zeros_like(M)
        np.add.at(acc, ev[:, 0], M[ev[:, 1]]); np.add.at(acc, ev[:, 1], M[ev[:, 0]])
        M = (1 - f) * M + f * acc / deg[:, None]
    return M
W = smooth(W, 3, 0.5)
W[~headreg, JI['jaw']] = 0
s_ = W.sum(1); bad = s_ < 1e-6
if bad.any():  # sem peso: osso mais próximo
    W[bad] = 0; W[np.where(bad)[0], DIST[bad].argmin(1)] = 1
# 4 influências
keep = np.argsort(-W, 1)[:, :4]; m_ = np.zeros_like(W); np.put_along_axis(m_, keep, 1, 1); W *= m_
W[W < 0.02] = 0; W /= W.sum(1, keepdims=True)
for g in list(ob.vertex_groups): ob.vertex_groups.remove(g)
for b in DEFB: ob.vertex_groups.new(name=b)
for j, b in enumerate(DEFB):
    g = ob.vertex_groups[b]; idx = np.nonzero(W[:, j])[0]
    for i in idx: g.add([int(i)], float(W[i, j]), 'REPLACE')
if not ob.modifiers.get('Armature'):
    md = ob.modifiers.new('Armature', 'ARMATURE'); md.object = arm
ob.parent = arm
log('pesos ok (%s); membrana %d verts; boca %d verts' % (method, wmask.sum(), (jawp > 0.5).sum()))

# ---------------------------------------------------------------- motor de pose (por código)
# L[b] = rotação local expressa nos eixos de repouso (frente -Y, esquerda +X, cima +Z); D(filho) = D(pai) @ L(filho).
# Pose final por osso = quatérnio da pose (matrix_basis) = Rrest⁻¹ · (D(pai)⁻¹ · D) · Rrest.
I4 = Quaternion()
def q(axis, deg): return Quaternion(axis, math.radians(deg))
def X_(d): return q((1, 0, 0), d)     # +: frente/pescoço desce; cauda sobe; perna vai para trás
def Y_(d): return q((0, 1, 0), d)     # +: rola (lado esquerdo desce)
def Z_(d): return q((0, 0, 1), d)     # +: frente vira p/ a esquerda; cauda vai p/ a direita
def mir(qq): return Quaternion((qq.w, qq.x, -qq.y, -qq.z))
def side(S, qq): return qq if S == 'L' else mir(qq)
def smoothstep(a, b, v):
    t = min(1.0, max(0.0, (v - a) / (b - a))) if b != a else float(v >= a); return t * t * (3 - 2 * t)
class Curve:
    """Chaves (t, v) com Hermite (Catmull-Rom; tangente zero nas pontas): curvas suaves com antecipação/overshoot."""
    def __init__(self, keys): self.k = sorted(keys)
    def __call__(self, t):
        k = self.k
        if t <= k[0][0]: return k[0][1]
        if t >= k[-1][0]: return k[-1][1]
        i = max(j for j in range(len(k) - 1) if k[j][0] <= t)
        t0, v0 = k[i]; t1, v1 = k[i + 1]; u = (t - t0) / (t1 - t0)
        def tan(j):
            if j <= 0 or j >= len(k) - 1: return 0.0
            return (k[j + 1][1] - k[j - 1][1]) / (k[j + 1][0] - k[j - 1][0])
        m0 = tan(i) * (t1 - t0); m1 = tan(i + 1) * (t1 - t0)
        h00 = 2 * u ** 3 - 3 * u * u + 1; h10 = u ** 3 - 2 * u * u + u; h01 = -2 * u ** 3 + 3 * u * u; h11 = u ** 3 - u * u
        return h00 * v0 + h10 * m0 + h01 * v1 + h11 * m1
TAU = 2 * math.pi
SPN = ['spine_%02d' % i for i in range(1, 6)]
NCK = ['neck_%02d' % i for i in range(1, 7)]
TL = ['tail_%02d' % i for i in range(1, 13)]
LEGS = {'H': ('thigh', 'shin', 'foot', 'toe')}
if QUAD: LEGS['F'] = ('upperarm', 'forearm', 'hand', 'fingers')
FEET = [(k, S) for k in LEGS for S in ('L', 'R')]
REST_BALL = {(k, S): HEAD[LEGS[k][3] + '_' + S].copy() for k, S in FEET}
FLY = 0.30 * H

def frame_of(u, nrm):
    u = u.normalized(); nn = (nrm - u * nrm.dot(u)).normalized(); w = u.cross(nn)
    return Matrix((u, nn, w)).transposed()
def align(u0, n0, u1, n1):
    return (frame_of(u1, n1) @ frame_of(u0, n0).transposed()).to_quaternion()

class Pose:
    def __init__(self):
        self.L = {}; self.D = {}; self.loc = Vector(); self.ik = {}
    def rot(self, b, qq):  # acumula rotação local
        self.L[b] = qq @ self.L.get(b, I4)
    def chain(self, bones, f):
        for i, b in enumerate(bones): self.rot(b, f(i, b))

def solve(p):
    """Pose -> (basis quats, pelvis loc local, cabeças posadas, D)."""
    D = {}; P = {}
    done = set()
    for b in NAMES:
        if b in done: continue
        par = PARENT[b]
        Dp = D[par] if par else I4
        leg = None
        for (k, S), tgt in p.ik.items():
            if b == LEGS[k][0] + '_' + S: leg = (k, S, tgt)
        if leg:
            k, S, (ball, qmeta, qtoe) = leg
            b1, b2, b3, b4 = [x + '_' + S for x in LEGS[k]]
            Pa = P[par] + Dp @ (HEAD[b1] - HEAD[par])
            A0, K0, H0, B0, T0_ = HEAD[b1], HEAD[b2], HEAD[b3], HEAD[b4], TAIL[b4]
            a = (K0 - A0).length; bb = (H0 - K0).length
            n0 = (K0 - A0).cross(H0 - K0).normalized(); nn = Dp @ n0
            Ht = ball - qmeta @ (B0 - H0)
            d = Ht - Pa; L_ = d.length
            # IK macio: perto da perna esticada o ângulo do joelho muda muito por cm (acos); a pata dianteira do
            # dragão já está 94% esticada no repouso e dava 30°/quadro no antebraço. Acima de 88% do alcance a
            # distância é comprimida de forma suave (o pé fica uns mm aquém do alvo em vez de o joelho estalar).
            r_ = a + bb; ds_ = 0.88 * r_
            if L_ > ds_: L_ = ds_ + (0.995 * r_ - ds_) * (1 - math.exp(-(L_ - ds_) / (0.995 * r_ - ds_)))
            L_ = max(L_, abs(a - bb) + 1e-4 * H); dh = d.normalized()
            ca = (a * a + L_ * L_ - bb * bb) / (2 * a * L_); sa = math.sqrt(max(0, 1 - ca * ca))
            d0 = (H0 - A0).normalized(); e0 = n0.cross(d0); sgn = 1 if (K0 - A0).dot(e0) >= 0 else -1
            e = nn.cross(dh).normalized() * sgn
            knee = Pa + (dh * ca + e * sa) * a; hock = Pa + dh * L_
            D[b1] = align(K0 - A0, n0, knee - Pa, nn)
            D[b2] = align(H0 - K0, n0, hock - knee, nn)
            D[b3] = align(B0 - H0, n0, qmeta @ (B0 - H0), nn)
            D[b4] = qtoe
            P[b1] = Pa; P[b2] = knee; P[b3] = hock; P[b4] = hock + D[b3] @ (B0 - H0)
            done |= {b1, b2, b3, b4}
            continue
        if b in p.D: D[b] = p.D[b]
        else: D[b] = Dp @ p.L.get(b, I4)
        P[b] = (HEAD[b] if not par else P[par] + Dp @ (HEAD[b] - HEAD[par])) + (p.loc if b == 'pelvis' else Vector())
        done.add(b)
    out = {}
    for b in NAMES:
        par = PARENT[b]; Dp = D[par] if par else I4
        Ll = Dp.inverted() @ D[b]
        out[b] = RROT[b].inverted() @ Ll @ RROT[b]
    loc = RROT['pelvis'].inverted() @ p.loc
    return out, loc, P, D
def blend(A, B, w):
    (qa, la), (qb, lb) = A, B
    return {b: qa[b].slerp(qb[b], w) if qa[b].dot(qb[b]) >= 0 else qa[b].slerp(-qb[b], w) for b in qa}, la.lerp(lb, w)
def final(p):
    o, l, _, _ = solve(p); return o, l

# ---------------------------------------------------------------- asas
def wing_geo(S):
    sh_, el, wr = HEAD['wing_upper_' + S], HEAD['wing_fore_' + S], HEAD['wing_hand_' + S]
    tips = [TAIL['finger%d_b_%s' % (k, S)] for k in range(1, 5)]
    nrm = (tips[0] - wr).cross(tips[-1] - wr).normalized()
    if S == 'L' and nrm.x < 0 or S == 'R' and nrm.x > 0: pass
    return sh_, el, wr, tips, nrm
WG = {S: wing_geo(S) for S in ('L', 'R')}
def straighten(S):
    sh_, el, wr, tips, nrm = WG[S]
    u = (el - sh_).normalized(); v = (wr - el).normalized()
    ax = u.cross(v).normalized(); ang = u.angle(v)
    return ax, ang
def fly_align(S, k_str):
    """Rotação que leva a asa de repouso (já esticada k_str) para a asa aberta na horizontal do corpo."""
    sh_, el, wr, tips, nrm = WG[S]
    ax, ang = straighten(S); Rs = Quaternion(ax, -ang * k_str)
    wr2 = el + Rs @ (wr - el); tm = sum((Rs @ (t - el) + el for t in tips), Vector()) / 4
    c0 = (wr2 - sh_); m0 = (tm - wr2)
    sg = 1 if S == 'L' else -1
    c1 = Vector((sg * 1.0, -0.12, 0.10)); m1 = Vector((sg * 0.25, 1.0, -0.05))
    return align(c0, m0, c1, m1), Rs
FA = {S: fly_align(S, 0.75) for S in ('L', 'R')}
def fan_rots(S, close):
    """Fecha o leque dos dedos em torno da normal da asa, rumo ao antebraço (close 0 = repouso, 1 = fechado)."""
    sh_, el, wr, tips, nrm = WG[S]; ref = (el - wr).normalized(); out = []
    for t in tips:
        f = (t - wr).normalized()
        th = math.atan2(ref.cross(f).dot(nrm), ref.dot(f))
        out.append(Quaternion(nrm, -th * close * 0.82))
    return out
FAN0 = {S: [None] * 4 for S in ('L', 'R')}
def wing(p, S, mode, t=0.0, fold=0.0, flap=(0, 0, 0, 0), sweep=0.0, spread=0.0, fan=None, lift=0.0):
    """Asa por modo.
    'ground': repouso dobrado (fold 0..1) + 'lift' (ergue o úmero, graus) + flap pequeno (graus) em cascata.
    'fly': alinhada aberta (FA) + flap (graus por segmento, com atraso) + sweep (recolhe no upstroke)."""
    sg = 1 if S == 'L' else -1
    if mode == 'ground' and S in getattr(p, '_wbase', {}):   # ações sobrepostas SOMAM à respiração do Idle (sem salto no 1º quadro)
        bl_, bf_ = p._wbase[S]; lift += bl_; flap = tuple(a_ + b_ for a_, b_ in zip(flap, bf_))
    sh_, el, wr, tips, nrm = WG[S]
    ax, ang = straighten(S)
    def flapq(dg): return Y_(-sg * dg)          # +dg = asa sobe
    def swq(dg): return Z_(sg * dg)             # +dg = asa vai para trás
    if mode == 'fly':
        A, Rs = FA[S]
        Gu = flapq(flap[0]) @ swq(sweep * 0.4) @ A
        Gf = flapq(flap[1]) @ swq(sweep) @ A @ Rs @ Quaternion(ax, math.radians(sweep * 0.9))
        Gh = flapq(flap[2]) @ swq(sweep * 1.3) @ A @ Rs @ Quaternion(ax, math.radians(sweep * 0.9))
        cl = 0.18 * max(0.0, sweep) / 25.0 + (fan or 0.0)
        Gfin = flapq(flap[3]) @ swq(sweep * 1.3) @ A @ Rs @ Quaternion(ax, math.radians(sweep * 0.9))
    else:
        f = fold
        base_u = Z_(sg * 22 * f) @ Y_(sg * 16 * f) @ flapq(lift + flap[0])
        Gu = base_u
        Gf = flapq(flap[1]) @ Gu @ Quaternion(ax, math.radians(38 * f))
        Gh = flapq(flap[2]) @ Gf
        Gfin = flapq(flap[3]) @ Gh
        cl = 0.85 * f + (fan or 0.0)
    G_root = Z_(sg * 2 * spread) if spread else I4
    fr = fan_rots(S, max(0.0, min(1.0, cl)))
    p.D['wing_root_' + S] = None   # marcador: preenchido em wing_apply
    p._wing = getattr(p, '_wing', {}); p._wing[S] = (G_root, Gu, Gf, Gh, Gfin, fr)
def wing_apply(p, Dspine04):
    for S, (G_root, Gu, Gf, Gh, Gfin, fr) in getattr(p, '_wing', {}).items():
        p.D.pop('wing_root_' + S, None)
        p.D['wing_root_' + S] = Dspine04 @ G_root
        p.D['wing_upper_' + S] = Dspine04 @ Gu
        p.D['wing_fore_' + S] = Dspine04 @ Gf
        p.D['wing_hand_' + S] = Dspine04 @ Gh
        p.D['wing_thumb_' + S] = Dspine04 @ Gh
        for k in range(4):
            Dk = Dspine04 @ Gfin @ fr[k]
            p.D['finger%d_a_%s' % (k + 1, S)] = Dk
            # segunda falange: curva leve (onda de follow-through vem do flap[3])
            p.D['finger%d_b_%s' % (k + 1, S)] = Dk
def body_D(p, upto='spine_04'):
    D = I4; b = upto; chain_ = []
    while b: chain_.append(b); b = PARENT[b]
    for b in reversed(chain_): D = D @ p.L.get(b, I4)
    return D
def finish(p):
    """Resolve as asas depois do corpo e devolve a pose final."""
    if getattr(p, '_wing', None): wing_apply(p, body_D(p))
    return final(p)

# ---------------------------------------------------------------- pés no chão
def plant(p, k, S, dy=0.0, dz=0.0, toe=0.0, meta=0.0, dx=0.0):
    b = REST_BALL[(k, S)] + Vector((dx, dy, dz))
    p.ik[(k, S)] = (b, X_(meta), X_(toe))
def gait(u, duty, stride, lift):
    """Fase 0..1 -> (dy, dz, rolagem do pé). Apoio: desliza para trás em linha reta; balanço: arco suave à frente."""
    u %= 1.0
    # devolve (dy, dz, calcanhar, dedos): calcanhar sobe no fim do apoio e desce no balanço SEM salto (era o tranco de 14°/quadro)
    if u < duty:
        v = u / duty; return stride * (-0.5 + v), 0.0, smoothstep(0.72, 1.0, v), 0.0
    v = (u - duty) / (1 - duty); e = v * v * (3 - 2 * v)
    return stride * (0.5 - e), lift * math.sin(math.pi * v) ** 0.8, 1.0 - smoothstep(0.0, 0.55, v), math.sin(math.pi * v)

# ---------------------------------------------------------------- pose base no chão (Idle) e clipes
def ground_base(p, t, T, fold=0.55, breath=1.0, look=1.0, tailamp=1.0):
    w = TAU * t / T
    b = math.sin(w)
    p.loc += Vector((0, 0, -0.004 * H * (1 + b) * breath))
    p.chain(SPN, lambda i, _: X_(-0.9 * b * breath))
    p.chain(NCK, lambda i, _: X_(1.2 * math.sin(w - 0.5 - i * 0.35) * breath) @ Z_(2.2 * look * math.sin(w + 0.9 - i * 0.3)))
    p.rot('head', Z_(4.0 * look * math.sin(w + 0.4)) @ X_(-2.0 * math.sin(w - 1.6) * breath))
    p.rot('jaw', X_(1.2 * (1 + math.sin(w - 0.8)) * breath))
    p.chain(TL, lambda i, _: Z_(tailamp * (1.2 + 0.35 * i) * math.sin(w - 0.45 * i)) @ X_(0.8 * math.sin(2 * w - 0.4 * i)))
    for S in ('L', 'R'):
        wl_, wf_ = 1.8 * b * breath, (0, 1.2 * math.sin(w - 0.8), 1.6 * math.sin(w - 1.3), 2.2 * math.sin(w - 1.8))
        wing(p, S, 'ground', fold=fold, lift=wl_, flap=wf_)
        p._wbase = getattr(p, '_wbase', {}); p._wbase[S] = (wl_, wf_)
    for k, S in FEET: plant(p, k, S)

def c_idle(t, T):
    p = Pose(); ground_base(p, t, T); return finish(p)

def walk_like(t, T, duty, stride_h, stride_f, lift, phases, bob, fold, run=False):
    p = Pose(); w = TAU * t / T
    # passos: cada pé tem fase; o corpo cai quando o pé apoia (peso)
    load = 0.0
    for (k, S) in FEET:
        u = t / T + phases[(k, S)]
        fs = 0.35 if (k == 'F' and REST_BALL[(k, S)].z > 0.1 * H) else 1.0   # pata dianteira erguida (dragão empinado): balança como braço, sem passo largo
        dy, dz, heel, curl = gait(u, duty, (stride_h if k == 'H' else stride_f) * fs, lift * (1.0 if k == 'H' else 0.85) * fs)
        toe = 18 * curl - 10 * heel
        meta = -14 * heel + 10 * curl
        plant(p, k, S, dy=dy, dz=dz, toe=toe, meta=meta)
        uu = u % 1.0
        if uu < duty: load += math.exp(-((uu / duty) / 0.18) ** 2)   # impacto logo após apoiar
    zb = -bob * H * (0.5 + 0.5 * math.cos(2 * (2 * w))) if not run else -bob * H * (0.5 + 0.5 * math.cos(w - 0.6))
    p.loc += Vector((0, 0, zb - 0.01 * H * (1 if run else 0)))
    if run:
        p.rot('pelvis', X_(4 * math.sin(w)))
        p.chain(SPN, lambda i, _: X_(-5 * math.sin(w - 0.5 - 0.25 * i)) @ Z_(1.0 * math.sin(w - 0.3 * i)))
        p.chain(NCK, lambda i, _: X_(2.6 + 2.4 * math.sin(w - 1.4 - 0.3 * i)) @ Z_(0.6 * math.sin(w - 1 - 0.3 * i)))
        p.rot('head', X_(-12 - 5 * math.sin(w - 2.6)))
        p.chain(TL, lambda i, _: X_(1.6 + 3.2 * math.sin(w - 1.2 - 0.45 * i)) @ Z_((1 + 0.25 * i) * math.sin(w - 0.5 * i)))
        p.rot('jaw', X_(4 + 3 * math.sin(2 * w)))
    else:
        p.rot('pelvis', Z_(3 * math.sin(w)) @ Y_(2.2 * math.sin(w - 0.3)))
        p.chain(SPN, lambda i, _: Z_(-1.6 * math.sin(w - 0.25 * i)) @ Y_(-0.6 * math.sin(w - 0.3 - 0.2 * i)) @ X_(0.6 * math.sin(2 * w - 1.0)))
        p.chain(NCK, lambda i, _: Z_(0.9 * math.sin(w - 0.9 - 0.3 * i)) @ X_(0.9 + 1.2 * math.sin(2 * w - 1.4 - 0.3 * i)))
        p.rot('head', X_(-5 - 2.4 * math.sin(2 * w - 2.6)) @ Z_(-2 * math.sin(w - 1.8)))
        p.chain(TL, lambda i, _: Z_((1.5 + 0.45 * i) * math.sin(w - 1.2 - 0.5 * i)) @ X_(1.0 * math.sin(2 * w - 0.4 * i)))
        p.rot('jaw', X_(1.5))
    for S in ('L', 'R'):
        sg = 1 if S == 'L' else -1
        ww = 2 * w if not run else w
        wing(p, S, 'ground', fold=fold, lift=2.5 * math.sin(ww - 1.0),
             flap=(0, 2.5 * math.sin(ww - 1.5), 3.5 * math.sin(ww - 2.0), 4.5 * math.sin(ww - 2.5)))
    return finish(p)

def c_walk(t, T):
    ph = {('H', 'L'): 0.0, ('F', 'L'): 0.25, ('H', 'R'): 0.5, ('F', 'R'): 0.75}
    return walk_like(t, T, 0.64, 0.20 * H, 0.13 * H, 0.05 * H, ph, 0.008, 0.7)
def c_run(t, T):
    ph = {('H', 'L'): 0.0, ('H', 'R'): 0.1, ('F', 'L'): 0.5, ('F', 'R'): 0.6}
    return walk_like(t, T, 0.42, 0.34 * H, 0.22 * H, 0.085 * H, ph, 0.03, 0.85, run=True)

def fly_body(p, t, T, hover):
    """Corpo no ar: hover = mais em pé, pernas penduradas; voo = horizontal, pernas recolhidas."""
    w = TAU * t / T
    pitch = 8 if hover else 27
    p.loc += Vector((0, 0, FLY + 0.025 * H * math.sin(w - 0.6)))
    p.rot('pelvis', X_(pitch + 2.5 * math.sin(w - 1.0)))
    p.chain(SPN, lambda i, _: X_(1.2 * math.sin(w - 1.4 - 0.2 * i)))
    nk = 3.0 if hover else 6.5
    p.chain(NCK, lambda i, _: X_(nk + 1.4 * math.sin(w - 2.0 - 0.35 * i)))
    p.rot('head', X_(-(pitch + 6 * nk) * 0.85 - 1.5 * math.sin(w - 3.0)))
    p.chain(TL, lambda i, _: X_((-1.5 if hover else -2.6) + 2.2 * math.sin(w - 1.6 - 0.5 * i)) @ Z_((0.8 + 0.3 * i) * math.sin(0.5 * w * 2 - 0.45 * i)))
    for S in ('L', 'R'):
        lt = 1 if S == 'L' else -1
        th = 18 if hover else 55; sh = 35 if hover else -40
        p.rot('thigh_' + S, X_(th + 4 * math.sin(w - 1.5)))
        p.rot('shin_' + S, X_(sh + 5 * math.sin(w - 2.0)))
        p.rot('foot_' + S, X_(25 + 6 * math.sin(w - 2.5)))
        p.rot('toe_' + S, X_(20 + 6 * math.sin(w - 3.0)))
        if QUAD:
            p.rot('upperarm_' + S, X_((10 if hover else 35) + 4 * math.sin(w - 1.6)))
            p.rot('forearm_' + S, X_(-(25 if hover else 60) + 5 * math.sin(w - 2.1)))
            p.rot('hand_' + S, X_(30 + 5 * math.sin(w - 2.6)))
            p.rot('fingers_' + S, X_(25))
def flapcurve(u, down=0.42):
    """Batida assimétrica: descida rápida (fração 'down' do ciclo), subida lenta. +1 = asa no alto."""
    u %= 1.0
    if u < down: return math.cos(math.pi * u / down)
    return -math.cos(math.pi * (u - down) / (1 - down))
def fly_wings(p, t, T, amp, base, sweepamp):
    for S in ('L', 'R'):
        u = t / T
        f = [base + amp * flapcurve(u - d) for d in (0.0, 0.06, 0.12, 0.19)]
        up = max(0.0, -math.sin(TAU * (u - 0.42 - 0.1)))   # recolhe na subida
        sw = sweepamp * (0.5 - 0.5 * math.cos(TAU * (u - 0.5))) * 1.0
        wing(p, S, 'fly', flap=(f[0], f[1], f[2], f[3]), sweep=sw)
def c_flyidle(t, T):
    p = Pose(); fly_body(p, t, T, True); fly_wings(p, t, T, 48, 10, 26); return finish(p)
def c_fly(t, T):
    p = Pose(); fly_body(p, t, T, False); fly_wings(p, t, T, 36, 4, 18); return finish(p)

T_IDLE = 4.0; T_FI = 1.2
IDLE0 = None
def idle0(): return c_idle(0.0, T_IDLE)

def c_takeoff(t, T):
    # agacha (antecipação), ergue as asas, salta com a batida; termina = FlyIdle(0)
    p = Pose()
    c = Curve([(0, 0), (0.45, 1), (0.62, -0.4), (0.9, 0)])(t)
    ground_base(p, 0.0, T_IDLE)
    p.loc += Vector((0, 0, -0.06 * H * max(0, c)))
    p.chain(SPN, lambda i, _: X_(3 * c))
    p.chain(NCK, lambda i, _: X_(-3 * Curve([(0, 0), (0.5, 1), (0.8, -0.5), (1.1, 0)])(t - 0.03 * i)))
    raise_ = Curve([(0, 0), (0.45, 1), (0.6, 0.9)])(t)
    p._wing = {}
    for S in ('L', 'R'):
        wing(p, S, 'ground', fold=0.55 * (1 - raise_), lift=45 * raise_,
             flap=(0, 12 * raise_, 18 * raise_, 22 * raise_))
    A = finish(p)
    B = c_flyidle(t - T, T_FI)
    return blend(A, B, smoothstep(0.42, 1.35, t))
def c_land(t, T):
    A = c_flyidle(t, T_FI)
    p = Pose(); ground_base(p, 0.0, T_IDLE)
    imp = Curve([(0.85, 0), (1.0, 1), (1.18, 0.35), (1.35, -0.12), (1.5, 0.04), (1.6, 0)])(t)
    p.loc += Vector((0, 0, -0.05 * H * imp))
    p.chain(SPN, lambda i, _: X_(2.5 * imp))
    p.chain(NCK, lambda i, _: X_(5 * Curve([(0.9, 0), (1.08, 1), (1.3, -0.4), (1.6, 0)])(t - 0.03 * i)))
    p.chain(TL, lambda i, _: X_(-3 * Curve([(0.9, 0), (1.1, 1), (1.35, -0.5), (1.6, 0)])(t - 0.03 * i)))
    fl = Curve([(0, 1), (0.9, 1), (1.3, 0.2), (1.6, 0)])(t)
    p._wing = {}
    for S in ('L', 'R'):
        wing(p, S, 'ground', fold=0.55 * (1 - fl), lift=40 * fl, flap=(0, 10 * fl, 14 * fl, 18 * fl))
    Bp = finish(p)
    return blend(A, Bp, smoothstep(0.35, 0.95, t))

def oneshot(t, T, f):
    """Ataques/reações: Idle(0) congelado + ações sobrepostas que voltam a zero no fim."""
    p = Pose(); ground_base(p, 0.0, T_IDLE); f(p, t); return finish(p)

def c_bite(t, T):
    d = Curve([(0, 0), (0.30, -1.0), (0.46, 1.0), (0.54, 1.1), (0.66, 0.85), (0.88, 0.2), (1.1, 0)])
    j = Curve([(0, 0), (0.22, 0.15), (0.40, 1.0), (0.50, 0.0), (0.56, 0.08), (0.66, 0), (1.2, 0)])
    def f(p, t):
        p.loc += Vector((0, -0.035 * H * max(0, d(t - 0.02)), -0.012 * H * max(0, d(t))))
        p.chain(SPN, lambda i, _: X_(2.2 * d(t - 0.01 * (4 - i))))
        p.chain(NCK, lambda i, _: X_(7.5 * d(t - 0.018 * i)))
        p.rot('head', X_(-18 * d(t - 0.1) + 8 * d(t)))
        p.rot('jaw', X_(34 * j(t)))
        p.chain(TL, lambda i, _: X_(-2.5 * d(t - 0.12 - 0.035 * i)) @ Z_(1.5 * d(t - 0.15 - 0.04 * i)))
        for S in ('L', 'R'):
            p._wing[S] = None
            wing(p, S, 'ground', fold=0.55 - 0.2 * max(0, -d(t)), lift=10 * max(0, -d(t - 0.05)),
                 flap=(0, -6 * d(t - 0.12), -8 * d(t - 0.18), -10 * d(t - 0.24)))
    return oneshot(t, T, f)
def c_tailswipe(t, T):
    s = Curve([(0, 0), (0.38, -1.0), (0.62, 1.25), (0.78, 0.85), (0.95, 0.95), (1.2, 0.3), (1.42, 0)])
    def f(p, t):
        p.rot('pelvis', Z_(-9 * s(t)))
        p.chain(SPN, lambda i, _: Z_(-2.2 * s(t - 0.02 * i)))
        p.chain(NCK, lambda i, _: Z_(4.5 * s(t - 0.06 - 0.03 * i)))
        p.rot('head', Z_(8 * s(t - 0.2)))
        p.chain(TL, lambda i, _: Z_(-(4 + 0.9 * i) * s(t - 0.03 - 0.028 * i)) @ X_(1.8 * abs(s(t - 0.03 * i))))
        for S in ('L', 'R'):
            sg = 1 if S == 'L' else -1
            wing(p, S, 'ground', fold=0.55, lift=6 * abs(s(t - 0.1)),
                 flap=(0, 4 * s(t - 0.15) * sg, 6 * s(t - 0.22) * sg, 8 * s(t - 0.3) * sg))
    return oneshot(t, T, f)
def c_wingbuffet(t, T):
    r = Curve([(0, 0), (0.35, 1.0), (1.30, 1.0), (1.62, 0.0), (1.8, 0)])
    o = Curve([(0, 0), (0.18, -0.15), (0.42, 1.0), (1.28, 1.0), (1.62, 0), (1.8, 0)])
    def beat(t):
        if t < 0.42 or t > 1.30: return 0.0
        return math.sin(TAU * 2 * (t - 0.42) / 0.88) * math.sin(math.pi * (t - 0.42) / 0.88)
    def f(p, t):
        rr = r(t)
        p.rot('pelvis', X_(-24 * rr))
        p.loc += Vector((0, 0.02 * H * rr, 0.035 * H * rr))
        p.chain(SPN, lambda i, _: X_(-1.5 * rr))
        p.chain(NCK, lambda i, _: X_(7 * rr - 3 * beat(t - 0.05 - 0.03 * i)))
        p.rot('head', X_(-10 * rr))
        p.rot('jaw', X_(18 * smoothstep(0.4, 0.6, t) * (1 - smoothstep(1.1, 1.35, t))))
        p.chain(TL, lambda i, _: X_(2 * rr + 2.5 * beat(t - 0.1 - 0.04 * i)))
        if QUAD:
            for S in ('L', 'R'):
                plant(p, 'F', S, dy=-0.05 * H * rr, dz=0.16 * H * r(t - 0.04) + 0.01 * H * beat(t - 0.1), toe=25 * rr, meta=30 * rr)
        for S in ('L', 'R'):
            oo = o(t); bt = beat(t)
            wing(p, S, 'ground', fold=0.55 * (1 - max(0, oo)), lift=55 * oo - 40 * bt * oo,
                 flap=(0, 14 * oo - 18 * beat(t - 0.05), 18 * oo - 24 * beat(t - 0.1), 22 * oo - 30 * beat(t - 0.16)))
    return oneshot(t, T, f)
def c_breath(t, T):
    a = Curve([(0, 0), (0.7, -1.0), (0.92, 1.0), (1.02, 0.85), (2.15, 0.9), (2.55, 0.0), (2.8, 0)])
    j = Curve([(0, 0), (0.75, 0.2), (0.95, 1.0), (2.15, 0.95), (2.45, 0.0), (2.8, 0)])
    def f(p, t):
        aa = a(t); sus = smoothstep(0.95, 1.1, t) * (1 - smoothstep(2.05, 2.3, t))
        trem = sus * math.sin(TAU * 11 * t) * 0.6
        sweep = sus * math.sin(TAU * (t - 1.0) / 1.2) * 1.0
        p.loc += Vector((0, -0.02 * H * aa, 0.01 * H * min(0, aa)))
        p.chain(SPN, lambda i, _: X_(-2.2 * max(0, -aa) + 1.6 * max(0, aa)))
        p.chain(NCK, lambda i, _: X_(6 * a(t - 0.02 * i) + trem) @ Z_(3 * sweep))
        p.rot('head', X_(-10 * a(t - 0.1)) @ Z_(6 * sweep))
        p.rot('jaw', X_(30 * j(t) + 1.5 * trem))
        p.chain(TL, lambda i, _: X_(-2 * a(t - 0.1 - 0.04 * i)) @ Z_(1.5 * sweep * (i / 6)))
        for S in ('L', 'R'):
            wing(p, S, 'ground', fold=0.55 - 0.15 * max(0, -aa), lift=14 * max(0, -a(t - 0.05)) + 4 * sus,
                 flap=(0, -4 * aa, -5 * a(t - 0.08), -6 * a(t - 0.16)))
    return oneshot(t, T, f)
def c_roar(t, T):
    a = Curve([(0, 0), (0.45, 1.0), (0.6, 1.1), (1.75, 1.0), (2.1, 0.0), (2.4, 0)])
    j = Curve([(0, 0), (0.4, 0.3), (0.62, 1.0), (1.75, 0.95), (2.05, 0), (2.4, 0)])
    def f(p, t):
        aa = a(t); sus = smoothstep(0.55, 0.7, t) * (1 - smoothstep(1.6, 1.85, t))
        shake = sus * math.sin(TAU * 9 * t)
        p.rot('pelvis', X_(-7 * aa)); p.loc += Vector((0, 0.01 * H * aa, 0.012 * H * aa))
        p.chain(SPN, lambda i, _: X_(-1.5 * aa))
        p.chain(NCK, lambda i, _: X_(-6 * a(t - 0.03 * i) + 0.6 * shake) @ Z_(1.2 * shake))
        p.rot('head', X_(-12 * a(t - 0.12)) @ Z_(2.5 * shake))
        p.rot('jaw', X_(40 * j(t) + 3 * shake))
        p.chain(TL, lambda i, _: Z_((1 + 0.4 * i) * math.sin(TAU * 1.5 * (t - 0.05 * i)) * aa) @ X_(2.5 * aa))
        for S in ('L', 'R'):
            wing(p, S, 'ground', fold=0.55 * (1 - 0.7 * aa), lift=26 * a(t - 0.08),
                 flap=(0, 8 * a(t - 0.14) + 1.5 * shake, 10 * a(t - 0.2), 12 * a(t - 0.26)))
    return oneshot(t, T, f)
def c_hit(t, T):
    h = Curve([(0, 0), (0.07, 1.0), (0.2, 0.55), (0.33, -0.18), (0.46, 0.05), (0.58, 0)])
    def f(p, t):
        hh = h(t)
        p.loc += Vector((0, 0.025 * H * hh, 0.006 * H * hh))
        p.rot('pelvis', X_(-2 * hh))
        p.chain(SPN, lambda i, _: X_(-1.5 * h(t - 0.01 * i)))
        p.chain(NCK, lambda i, _: X_(-4 * h(t - 0.02 - 0.012 * i)) @ Z_(2.5 * h(t - 0.03 - 0.012 * i)))
        p.rot('head', X_(-12 * h(t - 0.06)) @ Z_(6 * h(t - 0.07)))
        p.rot('jaw', X_(16 * h(t - 0.03)))
        p.chain(TL, lambda i, _: X_(3 * h(t - 0.05 - 0.02 * i)) @ Z_(2 * h(t - 0.08 - 0.02 * i)))
        for S in ('L', 'R'):
            wing(p, S, 'ground', fold=0.55, lift=12 * h(t - 0.04),
                 flap=(0, 8 * h(t - 0.08), 10 * h(t - 0.12), 12 * h(t - 0.16)))
    return oneshot(t, T, f)
def c_death(t, T):
    st = Curve([(0, 0), (0.12, 1), (0.3, 0.5), (0.5, 0.8), (0.7, 0.3)])
    fall = Curve([(0, 0), (0.55, 0), (1.25, 1.0), (1.42, 0.93), (1.6, 1.0), (2.6, 1.0)])
    p = Pose(); ground_base(p, 0.0, T_IDLE)
    ss = st(t); ff = fall(t)
    p.loc += Vector((0, 0.02 * H * ss, -0.17 * H * ff))
    p.rot('pelvis', Y_(-62 * ff) @ X_(-3 * ss))
    p.chain(SPN, lambda i, _: X_(-2 * st(t - 0.02 * i)) @ Y_(-2 * ff))
    nf = fall(t - 0.12)
    p.chain(NCK, lambda i, _: X_(-5 * st(t - 0.03 * i) + 9 * nf) @ Z_(3 * math.sin(TAU * 1.4 * t) * (1 - nf) * ss - 4 * nf))
    p.rot('head', X_(-15 * st(t - 0.08) + 6 * nf) @ Y_(25 * nf))
    p.rot('jaw', X_(18 * st(t) * (1 - nf) + 12 * nf))
    p.chain(TL, lambda i, _: Z_(4 * fall(t - 0.2 - 0.03 * i) - 2) @ X_(-1.5 * fall(t - 0.2 - 0.03 * i)))
    for S in ('L', 'R'):
        sg = 1 if S == 'L' else -1
        p.ik.pop(('H', S), None)
        lf = fall(t - 0.05)
        p.rot('thigh_' + S, X_(-20 * lf) @ Z_(sg * 10 * lf)); p.rot('shin_' + S, X_(25 * lf)); p.rot('foot_' + S, X_(20 * lf))
        if QUAD:
            p.ik.pop(('F', S), None)
            p.rot('upperarm_' + S, X_(25 * lf) @ Z_(sg * 15 * lf)); p.rot('forearm_' + S, X_(-30 * lf)); p.rot('hand_' + S, X_(25 * lf))
        wing(p, S, 'ground', fold=0.55 + 0.3 * lf * (1 if S == 'R' else 0) - 0.25 * lf * (1 if S == 'L' else 0),
             lift=15 * ss * (1 - lf) - 30 * lf * (1 if S == 'L' else -0.2),
             flap=(0, 6 * st(t - 0.1) - 12 * lf, 8 * st(t - 0.16) - 16 * fall(t - 0.15), 10 * st(t - 0.22) - 20 * fall(t - 0.25)))
    o = finish(p)
    # pés: enquanto não cai, ficam no chão (mistura IK -> mole)
    pk = Pose(); ground_base(pk, 0.0, T_IDLE)
    pk.loc += Vector((0, 0.02 * H * ss, 0)); pk.rot('pelvis', X_(-3 * ss))
    pk.chain(SPN, lambda i, _: X_(-2 * st(t - 0.02 * i)))
    pk.chain(NCK, lambda i, _: X_(-5 * st(t - 0.03 * i)) @ Z_(3 * math.sin(TAU * 1.4 * t) * ss))
    pk.rot('head', X_(-15 * st(t - 0.08)))
    pk.rot('jaw', X_(18 * st(t)))
    stand = finish(pk)
    return blend(stand, o, smoothstep(0.5, 1.1, t))

CLIPS = [('Idle', T_IDLE, c_idle, 'loop'), ('Walk', 1.6, c_walk, 'loop'), ('Run', 0.8, c_run, 'loop'),
         ('FlyIdle', T_FI, c_flyidle, 'loop'), ('Fly', 1.0, c_fly, 'loop'),
         ('TakeOff', 1.8, c_takeoff, 'to_fly'), ('Land', 1.6, c_land, 'from_fly'),
         ('Bite', 1.25, c_bite, 'shot'), ('TailSwipe', 1.45, c_tailswipe, 'shot'), ('WingBuffet', 1.8, c_wingbuffet, 'shot'),
         ('Breath', 2.8, c_breath, 'shot'), ('Roar', 2.4, c_roar, 'shot'), ('Hit', 0.6, c_hit, 'shot'), ('Death', 2.6, c_death, 'end')]

# ---------------------------------------------------------------- bake dos clipes (quadro a quadro, 30 fps)
IDLE0 = c_idle(0.0, T_IDLE)
FLY0 = c_flyidle(0.0, T_FI)
CLOSE = 0.32   # s: os golpes voltam ao Idle(0) nesse trecho final (follow-through termina, ciclo fecha)
def clip_pose(name, T, fn, kind, t):
    o, l = fn(t, T)
    if kind in ('shot', 'from_fly'):
        o, l = blend((o, l), IDLE0, smoothstep(T - CLOSE, T, t))
    return o, l
def qdist(a, b):
    d = abs(a.dot(b)); return math.degrees(2 * math.acos(min(1.0, d)))
pb = arm.pose.bones
for b in pb: b.rotation_mode = 'QUATERNION'
arm.animation_data_create()
REPORT = {}
BAKED = {}
for name, T, fn, kind in CLIPS:
    nf = int(round(T * TEMPO * FPS)); frames = []
    prev = None
    for f in range(nf + 1):
        t = T if f == nf else min(T, f / FPS / TEMPO)   # tempo do clipe "lógico"; TEMPO estica/encolhe o real
        o, l = clip_pose(name, T, fn, kind, t)
        if prev:   # hemisfério contínuo (three.js faz slerp entre chaves)
            o = {b: (-o[b] if o[b].dot(prev[0][b]) < 0 else o[b]) for b in o}
        frames.append((o, l)); prev = (o, l)
    BAKED[name] = (T * TEMPO, kind, frames)
    # métricas: fechamento, velocidade e aceleração angular (tranco), movimento total
    f0, f1 = frames[0], frames[-1]
    close = max(qdist(f0[0][b], f1[0][b]) for b in NAMES) + (f0[1] - f1[1]).length / H * 100
    ref0 = {'loop': f0, 'shot': IDLE0, 'to_fly': IDLE0, 'from_fly': FLY0, 'end': IDLE0}[kind]
    ref1 = {'loop': f0, 'shot': IDLE0, 'to_fly': FLY0, 'from_fly': IDLE0, 'end': None}[kind]
    e0 = max(qdist(f0[0][b], ref0[0][b]) for b in NAMES)
    e1 = max(qdist(f1[0][b], ref1[0][b]) for b in NAMES) if ref1 else 0.0
    vel = []; acc = []; wb_ = ('', 0)
    for i in range(1, len(frames)):
        for b in NAMES:
            d_ = qdist(frames[i][0][b], frames[i - 1][0][b])
            if d_ > wb_[1]: wb_ = ('%s@%d' % (b, i), d_)
        vel.append(max(qdist(frames[i][0][b], frames[i - 1][0][b]) for b in NAMES))
    for i in range(1, len(frames) - 1):
        # tranco = mudança brusca de velocidade (por osso)
        acc.append(max(abs(qdist(frames[i + 1][0][b], frames[i][0][b]) - qdist(frames[i][0][b], frames[i - 1][0][b])) for b in NAMES))
    span = max(max(qdist(fr[0][b], f0[0][b]) for fr in frames) for b in NAMES)
    REPORT[name] = {'T': T, 'kind': kind, 'frames': nf + 1, 'start_err_deg': round(e0, 3), 'end_err_deg': round(e1, 3),
                    'loop_close_deg': round(close, 3) if kind == 'loop' else None,
                    'max_deg_per_frame': round(max(vel), 2), 'max_jerk_deg': round(max(acc) if acc else 0, 2), 'span_deg': round(span, 2), 'worst': wb_[0]}
    log('clipe %-10s %s' % (name, REPORT[name]))

def solo(name):
    for tr in arm.animation_data.nla_tracks: tr.mute = (tr.name != name)
def show(name, f):
    solo(name); sc.frame_set(f)
def apply_pose(o, l):
    for b in NAMES: pb[b].rotation_quaternion = o[b]
    for b in NAMES: pb[b].location = Vector()
    pb['pelvis'].location = l
for name, (T, kind, frames) in BAKED.items():
    act = bpy.data.actions.new(name); act.use_fake_user = True
    arm.animation_data.action = act
    for f, (o, l) in enumerate(frames):
        apply_pose(o, l)
        for b in NAMES:
            pb[b].keyframe_insert('rotation_quaternion', frame=f, group=b)
        pb['pelvis'].keyframe_insert('location', frame=f, group='pelvis')
    try:
        for fc in act.fcurves:
            for k in fc.keyframe_points: k.interpolation = 'LINEAR'
    except AttributeError:
        pass
    trk = arm.animation_data.nla_tracks.new(); trk.name = name
    st = trk.strips.new(name, 0, act); st.name = name
    arm.animation_data.action = None
for b in NAMES: pb[b].rotation_quaternion = Quaternion(); pb[b].location = Vector()

# ---------------------------------------------------------------- material: só a Base Color original, 1024 JPEG, dois lados
def base_image():
    for m in me.materials:
        if not m or not m.use_nodes: continue
        bs = next((x for x in m.node_tree.nodes if x.type == 'BSDF_PRINCIPLED'), None)
        if not bs or not bs.inputs['Base Color'].links: continue
        nd = bs.inputs['Base Color'].links[0].from_node; hops = 0
        while nd.type != 'TEX_IMAGE' and hops < 6:
            lk = [i.links[0] for i in nd.inputs if i.links]
            if not lk: break
            nd = lk[0].from_node; hops += 1
        if nd.type == 'TEX_IMAGE': return nd.image
    return None
img = base_image()
log('materiais', len(me.materials), 'imagem', img and img.name, img and tuple(img.size))
mat = bpy.data.materials.new(NID); mat.use_nodes = True; nt = mat.node_tree
bs = next(x for x in nt.nodes if x.type == 'BSDF_PRINCIPLED')
if img:
    if max(img.size) > 1024: img.scale(1024, 1024)
    img.name = NID + '_basecolor'
    tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = img
    nt.links.new(tx.outputs['Color'], bs.inputs['Base Color'])
bs.inputs['Metallic'].default_value = 0.0; bs.inputs['Roughness'].default_value = 0.72
mat.use_backface_culling = False
me.materials.clear(); me.materials.append(mat)

# ---------------------------------------------------------------- exportar
bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True); arm.select_set(True)
bpy.context.view_layer.objects.active = arm
props = {p.identifier for p in bpy.ops.export_scene.gltf.get_rna_type().properties}
kw = dict(filepath=OUT, export_format='GLB', use_selection=True, export_animations=True, export_animation_mode='NLA_TRACKS',
          export_force_sampling=True, export_frame_step=1, export_optimize_animation_size=True, export_image_format='JPEG',
          export_jpeg_quality=86, export_texcoords=True, export_normals=True, export_tangents=False, export_materials='EXPORT',
          export_skins=True, export_all_influences=False, export_def_bones=False, export_reset_pose_bones=True,
          export_anim_single_armature=True, export_yup=True, export_apply=False, export_morph=False,
          export_bake_animation=False, export_merge_animation='NLA_TRACK', export_nla_strips=True)
bad = [k for k in kw if k != 'filepath' and k not in props]
for k in bad: kw.pop(k)
log('export (sem opções:', bad, ')')
bpy.ops.export_scene.gltf(**kw)
js, bn = read_glb(OUT)
kb = os.path.getsize(OUT) / 1024
anims = [a['name'] for a in js.get('animations', [])]
gtris = sum(js['accessors'][p_['indices']]['count'] // 3 for m_ in js['meshes'] for p_ in m_['primitives'])
log('GLB %.0f KB, %d tris, juntas %s, anims %s' % (kb, gtris, [len(s_['joints']) for s_ in js.get('skins', [])], anims))
# ciclo fechado conferido no próprio GLB (primeiro = último quadro de cada canal)
glb_close = {}
for a in js.get('animations', []):
    worst = 0.0
    for ch in a['channels']:
        smp_ = a['samplers'][ch['sampler']]; out_ = accessor(js, bn, smp_['output'])
        worst = max(worst, float(np.abs(out_[0] - out_[-1]).max()) if ch['target']['path'] == 'rotation' else 0.0)
    glb_close[a['name']] = round(worst, 4)
log('GLB fechamento (|q0-qN| máx por canal):', glb_close)
meta = {'id': NID, 'kind': 'dragon', 'race': 'dragon', 'body': 'quad' if QUAD else 'wyvern', 'family': 'dragao',
        'height': H, 'tempo': TEMPO, 'tris': gtris, 'kb': round(kb), 'bones': len(NAMES), 'clips': anims, 'fps': FPS,
        'inPlace': True, 'flyHeight': round(FLY, 3), 'weights': method,
        'loops': [n_ for n_, T, fn, k in CLIPS if k == 'loop'], 'note': 'rig e animação por código no Blender (tools/blender482/rig_dragon.py)'}
json.dump(meta, open(os.path.splitext(OUT)[0] + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({'clips': REPORT, 'glb_close': glb_close}, open(os.path.join(PROOFS, NID + '-check.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- provas: folha de contato (lado e 3/4) + closes
gp = bpy.data.objects.new('chao', bpy.data.meshes.new('chao'))
gbm = bmesh.new(); bmesh.ops.create_grid(gbm, x_segments=1, y_segments=1, size=2.2 * H); gbm.to_mesh(gp.data); gbm.free()
gmat = bpy.data.materials.new('chao'); gmat.diffuse_color = (0.25, 0.27, 0.24, 1); gp.data.materials.append(gmat)
sc.collection.objects.link(gp)
sc.render.resolution_x = 240; sc.render.resolution_y = 190
NCOL = 6
shots = []
for name, (T, kind, frames) in BAKED.items():
    idx = [round(k * (len(frames) - 1) / (NCOL - 1)) for k in range(NCOL)]
    air = name in ('FlyIdle', 'Fly', 'TakeOff', 'Land')
    c = Vector((0, -0.05 * H, (0.62 if air else 0.5) * H))
    for yaw, el in ((0, 4), (40, 16)):
        for i in idx:
            show(name, i)
            shots.append(shoot(os.path.join(TMP, 's%04d.png' % len(shots)), yaw, el, 1.75 if air else 1.6, c))
# reordena: cada linha = clipe, 6 de lado + 6 de 3/4
order = []
for r in range(len(BAKED)):
    base = r * 2 * NCOL; order += shots[base:base + 2 * NCOL]
sheet(order, 2 * NCOL, os.path.join(PROOFS, NID + '-clips.png'))
sc.render.resolution_x = 420; sc.render.resolution_y = 330
cl = []
for name in ('Walk', 'Run', 'Fly', 'Bite', 'TailSwipe', 'WingBuffet', 'Breath', 'Death'):
    T, kind, frames = BAKED[name]
    idx = [round(k * (len(frames) - 1) / 5) for k in range(5)]
    air = name in ('Fly',)
    c = Vector((0, -0.05 * H, (0.62 if air else 0.5) * H))
    for i in idx:
        show(name, i)
        cl.append(shoot(os.path.join(TMP, 'c%04d.png' % len(cl)), 35 if name != 'Walk' else 90, 14, 1.6, c))
sheet(cl, 5, os.path.join(PROOFS, NID + '-closes.png'))
for tr in arm.animation_data.nla_tracks: tr.mute = True
for b in NAMES: pb[b].rotation_quaternion = Quaternion(); pb[b].location = Vector()
sc.frame_set(0); bpy.context.view_layer.update()
sc.render.resolution_x = 520; sc.render.resolution_y = 420
fin = [shoot(os.path.join(TMP, 'f0.png'), 0, 4, 1.5), shoot(os.path.join(TMP, 'f1.png'), 40, 16, 1.5)]
sheet(COR0 + fin, 2, os.path.join(PROOFS, NID + '-cores.png'))
try: os.rmdir(TMP)
except OSError: pass
log('fim %.1fs' % (time.time() - T0))
