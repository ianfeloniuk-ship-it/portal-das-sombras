# v669 — rig firme (pose A -> T, limpeza do Trellis, peso por osso). Base: v482 rig humanoide no Blender (regra do Ian: rig SEMPRE no Blender, nunca pago no Tripo).
# Uso:
#   blender -b --python tools/blender482/rig_humanoid.py -- --in X.glb --out models/povo482/ID.glb --id ID
#           --race human|dwarf|elf --sex m|f --role civil|hunter [--proofs DIR] [--family F] [--tris 9000]
#           [--force-proxy] [--no-anim-proof] [--ref models/anim-viajante155.glb] [--legs auto|pants|skirt] [--hood auto|yes]
# Faz: importa o GLB (descarta rig/pesos antigos), junta e limpa a malha, detecta marcos por fatias,
# monta o esqueleto Mixamo do contrato em pose T com a orientação dos ossos do rig do Viajante
# (models/anim-viajante155.glb), pesa (heat; se falhar, proxy voxel fechado + Data Transfer), suaviza e
# limita a 4 influências, decima, reduz a textura para JPEG 1024, calcula _NPC_MASK, exporta GLB + JSON
# e renderiza provas (pose T, 3 poses de teste, clipes reais idle/correr/golpe1 com o retarget do jogo).
import bpy, bmesh, sys, os, json, struct, math, time
import numpy as np
from mathutils import Matrix, Vector, Quaternion
from mathutils.geometry import intersect_point_line

T0 = time.time()
def log(*a):
    print('R482:', *a, flush=True)

# ---------------------------------------------------------------- argumentos
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def arg(name, default=None, flag=False):
    if flag:
        return ('--' + name) in argv
    if ('--' + name) in argv:
        return argv[argv.index('--' + name) + 1]
    return default
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC = arg('in'); OUT = arg('out'); NID = arg('id')
RACE = arg('race', 'human'); SEX = arg('sex', 'm'); ROLE = arg('role', 'civil')
REF = arg('ref', os.path.join(REPO, 'models', 'anim-viajante155.glb'))
TRIS = int(arg('tris', '9000'))
PROOFS = arg('proofs', os.path.join(os.path.dirname(os.path.abspath(OUT)), 'proofs'))
FAMILY = arg('family', None)
FORCE_PROXY = arg('force-proxy', flag=True)
LEGS = arg('legs', 'auto')  # auto|pants|skirt
HOODARG = arg('hood', 'auto')  # auto|yes: capuz no topo da cabeça (topo = roupa, cabelo só o que aparece por baixo)
ANIM_PROOF = not arg('no-anim-proof', flag=True)
DIGI = arg('digitigrade', flag=True)  # v673: pé de bicho (lobisomem): calcanhar alto, pé longo inteiro no osso do pé
assert SRC and OUT and NID, 'faltou --in/--out/--id'
assert RACE in ('human', 'dwarf', 'elf') and SEX in ('m', 'f') and ROLE in ('civil', 'hunter')
os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
os.makedirs(PROOFS, exist_ok=True)

# Esqueleto do contrato (nome sem prefixo -> pai)
P = 'mixamorig:'
BONES = [('Hips', None), ('Spine', 'Hips'), ('Spine1', 'Spine'), ('Spine2', 'Spine1'), ('Neck', 'Spine2'),
         ('Head', 'Neck'), ('HeadTop_End', 'Head'),
         ('LeftShoulder', 'Spine2'), ('LeftArm', 'LeftShoulder'), ('LeftForeArm', 'LeftArm'), ('LeftHand', 'LeftForeArm'),
         ('RightShoulder', 'Spine2'), ('RightArm', 'RightShoulder'), ('RightForeArm', 'RightArm'), ('RightHand', 'RightForeArm'),
         ('LeftUpLeg', 'Hips'), ('LeftLeg', 'LeftUpLeg'), ('LeftFoot', 'LeftLeg'), ('LeftToeBase', 'LeftFoot'),
         ('RightUpLeg', 'Hips'), ('RightLeg', 'RightUpLeg'), ('RightFoot', 'RightLeg'), ('RightToeBase', 'RightFoot')]
PARENT = dict(BONES)
NAMES = [b for b, _ in BONES]
# Ossos que o jogo anima (MIX153/MIXG155 em tools/warrior-player127.js); os outros ficam na pose de repouso.
DRIVEN = ['Hips', 'Spine', 'Spine2', 'Neck', 'Head', 'RightArm', 'RightForeArm', 'RightHand', 'LeftArm', 'LeftForeArm',
          'LeftHand', 'RightUpLeg', 'RightLeg', 'RightFoot', 'LeftUpLeg', 'LeftLeg', 'LeftFoot']
DEFORM = [b for b in NAMES if b != 'HeadTop_End']

# glTF (Y para cima) <-> Blender (Z para cima). Exportador: R_gltf = C @ R_blender (medido).
C = Matrix(((1, 0, 0), (0, 0, 1), (0, -1, 0)))
Ci = C.inverted()

# ---------------------------------------------------------------- leitura de GLB (JSON + binário)
def read_glb(path):
    d = open(path, 'rb').read()
    assert d[:4] == b'glTF', path
    off = 12; js = None; bin_ = None
    while off < len(d):
        ln, typ = struct.unpack('<II', d[off:off + 8])
        chunk = d[off + 8:off + 8 + ln]
        if typ == 0x4E4F534A: js = json.loads(chunk)
        elif typ == 0x004E4942: bin_ = chunk
        off += 8 + ln
    return js, bin_

def accessor(js, bin_, i):
    a = js['accessors'][i]; bv = js['bufferViews'][a['bufferView']]
    comp = {5126: ('<f', 4), 5123: ('<H', 2), 5121: ('<B', 1), 5122: ('<h', 2), 5120: ('<b', 1), 5125: ('<I', 4)}[a['componentType']]
    n = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}[a['type']]
    dt = np.dtype(comp[0])
    start = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    stride = bv.get('byteStride', 0) or comp[1] * n
    raw = np.frombuffer(bin_, dtype=np.uint8, count=stride * (a['count'] - 1) + comp[1] * n, offset=start)
    out = np.empty((a['count'], n), dtype=np.float64)
    for k in range(n):
        out[:, k] = np.ndarray((a['count'],), dtype=dt, buffer=raw.tobytes(), offset=k * comp[1], strides=(stride,))
    if a.get('normalized'):
        out /= {5123: 65535., 5121: 255., 5122: 32767., 5120: 127.}[a['componentType']]
    return out

class GLTFRig:
    """Esqueleto do GLB de referência avaliado como o three.js faz (TRS por nó, LINEAR/slerp)."""
    def __init__(self, path):
        self.js, self.bin = read_glb(path)
        self.nodes = self.js['nodes']
        self.par = {}
        for i, n in enumerate(self.nodes):
            for c in n.get('children', []): self.par[c] = i
        self.byname = {n.get('name', str(i)): i for i, n in enumerate(self.nodes)}
        self.anims = {a['name']: a for a in self.js.get('animations', [])}
        self._cache = {}
    def rest_trs(self, i):
        n = self.nodes[i]
        if 'matrix' in n:
            m = n['matrix']; M = Matrix([m[0:4], m[4:8], m[8:12], m[12:16]]).transposed()
            t, q, s = M.decompose(); return [Vector(t), q, Vector(s)]
        r = n.get('rotation', [0, 0, 0, 1])
        return [Vector(n.get('translation', [0, 0, 0])), Quaternion((r[3], r[0], r[1], r[2])), Vector(n.get('scale', [1, 1, 1]))]
    def channels(self, name):
        if name in self._cache: return self._cache[name]
        A = self.anims[name]; ch = []
        for c in A['channels']:
            s = A['samplers'][c['sampler']]
            ti = accessor(self.js, self.bin, s['input'])[:, 0]
            vo = accessor(self.js, self.bin, s['output'])
            ch.append((c['target'].get('node'), c['target']['path'], ti, vo, s.get('interpolation', 'LINEAR')))
        dur = max(c[2][-1] for c in ch)
        self._cache[name] = (ch, dur); return ch, dur
    def duration(self, name): return self.channels(name)[1]
    def world(self, anim=None, t=0.0):
        trs = {i: self.rest_trs(i) for i in range(len(self.nodes))}
        if anim:
            ch, _ = self.channels(anim)
            for node, path, ti, vo, interp in ch:
                if node is None or path not in ('translation', 'rotation', 'scale'): continue
                if interp == 'CUBICSPLINE': vo = vo.reshape(len(ti), 3, -1)[:, 1, :]
                k = int(np.searchsorted(ti, t, side='right')) - 1
                k = max(0, min(k, len(ti) - 1)); k2 = min(k + 1, len(ti) - 1)
                f = 0.0 if k2 == k or interp == 'STEP' else float((t - ti[k]) / (ti[k2] - ti[k]))
                f = max(0.0, min(1.0, f))
                a, b = vo[k], vo[k2]
                if path == 'rotation':
                    qa = Quaternion((a[3], a[0], a[1], a[2])); qb = Quaternion((b[3], b[0], b[1], b[2]))
                    trs[node][1] = qa.slerp(qb, f)
                else:
                    v = Vector(a * (1 - f) + b * f)
                    trs[node][0 if path == 'translation' else 2] = v
        W = {}
        def w(i):
            if i in W: return W[i]
            t_, q_, s_ = trs[i]; m = Matrix.LocRotScale(t_, q_, s_)
            if i in self.par: m = w(self.par[i]) @ m
            W[i] = m; return m
        return {n.get('name', str(i)): w(i) for i, n in enumerate(self.nodes)}

# ---------------------------------------------------------------- referência (rig do Viajante)
ref = GLTFRig(REF)
RW = ref.world()
REFROT = {}; REFPOS = {}
for b in NAMES:
    m = RW[P + b]; t, q, s = m.decompose()
    REFROT[b] = Ci @ q.to_matrix()          # rotação do osso em espaço Blender
    REFPOS[b] = Ci @ Vector(t)
log('ref', REF, 'clips', len(ref.anims))

# ---------------------------------------------------------------- importar e limpar
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
bpy.ops.import_scene.gltf(filepath=SRC)
for o in list(sc.objects):
    if o.animation_data: o.animation_data_clear()
for a in list(bpy.data.actions): bpy.data.actions.remove(a)
meshes = []
for o in list(sc.objects):
    if o.type == 'MESH' and len(o.data.polygons) and not o.name.lower().startswith('icosphere'):
        meshes.append(o)
for o in meshes:
    mw = o.matrix_world.copy()
    for md in list(o.modifiers): o.modifiers.remove(md)
    o.parent = None; o.matrix_world = mw
    o.vertex_groups.clear()
    if o.data.shape_keys:
        o.shape_key_clear()
for o in list(sc.objects):
    if o not in meshes: bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.object.select_all(action='DESELECT')
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1: bpy.ops.object.join()
ob = bpy.context.view_layer.objects.active; ob.name = NID; ob.data.name = NID
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
me = ob.data
log('import', len(meshes), 'malhas', len(me.vertices), 'verts', len(me.polygons), 'faces')

# ---------------------------------------------------------------- v669: cartão de fundo e placa de chão do Trellis
def _islands(bm):
    bm.verts.ensure_lookup_table(); seen = np.zeros(len(bm.verts), bool); out = []
    for v in bm.verts:
        if seen[v.index]: continue
        st = [v]; seen[v.index] = True; isl = []
        while st:
            x = st.pop(); isl.append(x.index)
            for e in x.link_edges:
                y = e.other_vert(x)
                if not seen[y.index]: seen[y.index] = True; st.append(y)
        out.append(isl)
    return out
bm = bmesh.new(); bm.from_mesh(me)
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
bm.verts.ensure_lookup_table()
pts = np.array([v.co[:] for v in bm.verts]); Hh = pts[:, 2].max() - pts[:, 2].min()
isl = _islands(bm); big = max(isl, key=len); kill = []
for I in isl:
    if I is big: continue
    d = np.sort(pts[I].max(0) - pts[I].min(0))
    if (d[0] < 0.035 * d[2] and d[2] > 0.3 * Hh) or len(I) < 0.002 * len(pts): kill += I
if kill:
    bm.verts.ensure_lookup_table(); bmesh.ops.delete(bm, geom=[bm.verts[i] for i in kill], context='VERTS')
log('v669 cartão/farelos removidos:', len(kill), 'verts de', len(isl), 'ilhas')
def _spread(a):
    return max(np.ptp(a[:, 0]), np.ptp(a[:, 1])) if len(a) else 0.0
for frac in (0.03, 0.06, 0.09):
    bm.verts.ensure_lookup_table()
    pts = np.array([v.co[:] for v in bm.verts]); z0 = pts[:, 2].min(); hh = pts[:, 2].max() - z0
    band = z0 + frac * hh
    low = pts[pts[:, 2] <= band]; mid = pts[(pts[:, 2] > band) & (pts[:, 2] < z0 + 0.3 * hh)]
    if not len(low) or _spread(low) <= 1.35 * _spread(mid): break
    dead = [f for f in bm.faces if all(v.co.z <= band for v in f.verts)]
    bmesh.ops.delete(bm, geom=dead, context='FACES')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    log('v669 placa de chão cortada na faixa %.2f: %d faces' % (frac, len(dead)))
bm.to_mesh(me); bm.free(); me.update()

def V():
    a = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', a); return a.reshape(-1, 3)
def setV(a):
    me.vertices.foreach_set('co', a.reshape(-1)); me.update()

# frente para -Y (glTF +Z): o pé avança para a frente
co = V(); zmin, zmax = co[:, 2].min(), co[:, 2].max(); H0 = zmax - zmin
low = co[co[:, 2] < zmin + 0.035 * H0]; ank = co[(co[:, 2] > zmin + 0.09 * H0) & (co[:, 2] < zmin + 0.16 * H0)]
if len(low) and len(ank):
    # a ponta do pé fica mais longe do eixo da canela do que o calcanhar
    front_d = ank[:, 1].mean() - low[:, 1].min(); back_d = low[:, 1].max() - ank[:, 1].mean()
    if back_d > front_d * 1.15:
        log('virando 180 graus (frente estava em +Y)')
        co[:, 0] *= -1; co[:, 1] *= -1; setV(co)

# normalizar: pés no chão, centro em x/y, altura igual à do Viajante de referência
co = V(); zmin, zmax = co[:, 2].min(), co[:, 2].max()
HREF = 0.97
s = HREF / (zmax - zmin)
mid = co[(co[:, 2] > zmin + 0.3 * (zmax - zmin)) & (co[:, 2] < zmin + 0.6 * (zmax - zmin))]
cx = 0.5 * (co[:, 0].min() + co[:, 0].max()); cy = 0.5 * (mid[:, 1].min() + mid[:, 1].max())
co[:, 0] -= cx; co[:, 1] -= cy; co[:, 2] -= zmin; co *= s; setV(co)
H = HREF

bm = bmesh.new(); bm.from_mesh(me)
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4 * H)
loose = [v for v in bm.verts if not v.link_faces]
bmesh.ops.delete(bm, geom=loose, context='VERTS')
loose_e = [e for e in bm.edges if not e.link_faces]
bmesh.ops.delete(bm, geom=loose_e, context='EDGES')
# ilhas minúsculas (lixo de geração); olhos e botões ficam (>= 12 vértices ou > 0,5% da altura)
bm.verts.ensure_lookup_table()
seen = set(); small = []
for v in bm.verts:
    if v.index in seen: continue
    stack = [v]; isl = []; seen.add(v.index)
    while stack:
        x = stack.pop(); isl.append(x)
        for e in x.link_edges:
            y = e.other_vert(x)
            if y.index not in seen: seen.add(y.index); stack.append(y)
    if len(isl) < 12:
        pts = np.array([p.co[:] for p in isl])
        if np.linalg.norm(pts.max(0) - pts.min(0)) < 0.005 * H: small += isl
if small: bmesh.ops.delete(bm, geom=small, context='VERTS')
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
bm.to_mesh(me); bm.free(); me.update()
log('limpo', len(me.vertices), 'verts; ilhas pequenas removidas:', len(small))

# decimar para ~TRIS triângulos
tris = sum(len(p.vertices) - 2 for p in me.polygons)
if tris > TRIS * 1.05:
    md = ob.modifiers.new('dec', 'DECIMATE'); md.decimate_type = 'COLLAPSE'; md.ratio = TRIS / tris
    md.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=md.name)
tris = sum(len(p.vertices) - 2 for p in me.polygons)
try:
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.customdata_custom_splitnormals_clear()
except Exception: pass
bpy.ops.object.mode_set(mode='OBJECT')
for p in me.polygons: p.use_smooth = True
while len(me.uv_layers) > 1: me.uv_layers.remove(me.uv_layers[-1])
for ca in list(me.color_attributes): me.color_attributes.remove(ca)
log('tris', tris, 'verts', len(me.vertices))


# ---------------------------------------------------------------- v669: pose A -> pose T (gira o braço em volta do ombro)
co = V(); X, Y, Z = co[:, 0], co[:, 1], co[:, 2]
def _iv(xs, gap):
    xs = np.sort(xs); c = np.where(np.diff(xs) > gap)[0]
    return list(zip(np.r_[xs[0], xs[c + 1]], np.r_[xs[c], xs[-1]]))
POSE669 = {}
for sg in ((1, -1) if arg('apose', flag=True) else ()):  # só com --apose (a detecção por fatias erra em pose T)
    rows = []
    for z0 in np.arange(0.30 * H, 0.84 * H, 0.01 * H):
        sel = (Z >= z0) & (Z < z0 + 0.01 * H)
        if sel.sum() < 6: continue
        iv = _iv(X[sel], 0.010 * H)
        tor = min(iv, key=lambda a: 0 if a[0] <= 0 <= a[1] else min(abs(a[0]), abs(a[1])))
        outs = [a for a in iv if (a[0] > tor[1] if sg > 0 else a[1] < tor[0])]
        if outs:
            a = min(outs, key=lambda a: abs(a[0] if sg > 0 else a[1]))   # o vizinho do tronco (não asa/escudo de fora)
            rows.append((z0, a, tor))
    # maior trecho contínuo que chega mais alto = braço solto do tronco
    runs = []; cur = []
    for r in rows:
        if cur and r[0] - cur[-1][0] > 0.0151 * H: runs.append(cur); cur = []
        cur.append(r)
    if cur: runs.append(cur)
    runs = [r for r in runs if r[-1][0] - r[0][0] >= 0.12 * H]
    if not runs:
        log('v669 braço', sg, 'colado ao corpo: não endireitado'); continue
    run = max(runs, key=lambda r: r[-1][0])
    top_z = run[-1][0] + 0.01 * H; bot_z = run[0][0]
    edge = abs(run[-1][2][1] if sg > 0 else run[-1][2][0])          # borda do tronco na axila
    armv = np.zeros(len(co), bool)
    for z0, a, tor in run:
        armv |= (Z >= z0) & (Z < z0 + 0.01 * H) & (X >= a[0] - 1e-6) & (X <= a[1] + 1e-6)
    cap = (Z >= top_z) & (Z < top_z + 0.09 * H) & (X * sg > edge - 0.01 * H)
    sp = co[armv & (Z > top_z - 0.04 * H)]
    S = Vector((sg * edge, float(sp[:, 1].mean()) if len(sp) else 0.0, top_z + 0.045 * H))
    lowv = co[armv & (Z < bot_z + 0.03 * H)]
    E = Vector(lowv.mean(0)) if len(lowv) else Vector((sg * (edge + 0.1 * H), S.y, bot_z))
    d = (E - S); ang = math.degrees(Vector((d.x, d.z)).angle(Vector((sg, 0))))
    if ang < 20:
        log('v669 braço', sg, 'já está aberto (%.0f graus)' % ang); continue
    q = d.normalized().rotation_difference(Vector((sg, 0, 0)))
    dn = d.normalized(); idx = np.nonzero(armv | cap)[0]
    for i in idx:
        P_ = Vector(co[i]); w = max(0.0, min(1.0, ((P_ - S).dot(dn) + 0.03 * H) / (0.07 * H)))
        if w <= 0: continue
        qq = Quaternion().slerp(q, w); co[i] = S + qq @ (P_ - S)
    POSE669[sg] = dict(ang=round(ang), verts=int(len(idx)), top=round(top_z / H, 3), bot=round(bot_z / H, 3))
    log('v669 braço', sg, 'endireitado %.0f graus, %d verts, axila %.2fH, ponta %.2fH' % (ang, len(idx), top_z / H, bot_z / H))
setV(co)
# ---------------------------------------------------------------- marcos por fatias
co = V(); X, Y, Z = co[:, 0], co[:, 1], co[:, 2]
H = Z.max()
def clamp(v, a, b): return max(a, min(b, v))
def rng(a): return float(a.max() - a.min()) if len(a) else 0.0
def mid_(a): return float(0.5 * (a.max() + a.min())) if len(a) else 0.0
L = {}  # marcos (Vector) em espaço Blender, lado esquerdo do personagem = +X

# --- braços (pose T ao longo de X)
zfloor = 0.58 * H
up = Z > zfloor
bw = 0.01 * H
def arm_side(sg):
    xs = X * sg
    tip = float(xs[up].max())
    bins = np.arange(0.0, tip, bw)
    info = []
    for b0 in bins:
        sel = up & (xs >= b0) & (xs < b0 + bw)
        if sel.sum() < 3: info.append(None); continue
        info.append((b0 + bw / 2, float(Z[sel].min()), mid_(Y[sel]), mid_(Z[sel]), rng(Y[sel]), rng(Z[sel])))
    # axila: menor x a partir do qual tudo para fora tem a parte de baixo acima do piso (vão sob o braço)
    xa = None
    for i in range(len(info) - 1, -1, -1):
        if info[i] is None: continue
        if info[i][1] > zfloor + 0.04 * H: xa = info[i][0]
        else: break
    if xa is None: xa = 0.17 * H
    arm = [r for r in info if r and r[0] >= xa]
    armz = float(np.median([r[3] for r in arm])) if arm else 0.755 * H
    armpit_z = min([r[1] for r in arm if r[0] < xa + 0.05 * H] or [armz - 0.04 * H])
    # ombro (cabeça do LeftArm) um pouco para dentro da axila, limitado à faixa humana
    xsh = clamp(xa - 0.03 * H, 0.10 * H, 0.16 * H)
    near = [r for r in arm if r[0] < xa + 0.06 * H] or arm
    ysh = float(np.median([r[2] for r in near])) if near else 0.0
    # punho: menor largura (eixo Y) entre 55% e 78% do ombro até a ponta dos dedos
    span = tip - xsh
    def thick(lo, hi):
        cand = [r for r in arm if xsh + lo * span <= r[0] <= xsh + hi * span]
        if not cand: return None
        return min(cand, key=lambda r: r[4])
    w = thick(0.55, 0.78)
    xw = w[0] if w else xsh + 0.63 * span
    # cotovelo: mínimo de espessura perto de 52% ombro→punho, misturado com a proporção (mangas enganam)
    sw = xw - xsh
    cand = [r for r in arm if xsh + 0.42 * sw <= r[0] <= xsh + 0.62 * sw]
    xe_det = min(cand, key=lambda r: r[4] + r[5])[0] if cand else xsh + 0.52 * sw
    xe = 0.5 * xe_det + 0.5 * (xsh + 0.52 * sw)
    def at(x):
        r = min(arm, key=lambda r: abs(r[0] - x)) if arm else None
        return (r[2], r[3]) if r else (0.0, armz)
    ye, ze = at(xe); yw, zw = at(xw); _, zsh = at(xa + 0.02 * H)
    return dict(tip=tip, xa=xa, armpit_z=armpit_z, xsh=xsh, ysh=ysh, zsh=zsh, xe=xe, ye=ye, ze=ze, xw=xw, yw=yw, zw=zw,
                hand_w=(w[4] if w else 0.05 * H))
AR = {1: arm_side(1), -1: arm_side(-1)}
for sg, nm in ((1, 'Left'), (-1, 'Right')):
    a = AR[sg]
    L[nm + 'Arm'] = Vector((sg * a['xsh'], a['ysh'], a['zsh']))
    L[nm + 'ForeArm'] = Vector((sg * a['xe'], a['ye'], a['ze']))
    L[nm + 'Hand'] = Vector((sg * a['xw'], a['yw'], a['zw']))
    L[nm + 'HandTip'] = Vector((sg * (a['xw'] + 0.45 * (a['tip'] - a['xw'])), a['yw'], a['zw']))
arm_z = 0.5 * (AR[1]['zsh'] + AR[-1]['zsh'])
armpit_z = min(AR[1]['armpit_z'], AR[-1]['armpit_z'])
xsh = 0.5 * (AR[1]['xsh'] + AR[-1]['xsh'])

# --- pernas: separação no centro (calça) ou saia
def separated(z0, z1):
    sel = (Z >= z0) & (Z < z1)
    if sel.sum() < 4: return None
    # só a metade da frente: capa nas costas não conta como saia
    fr = sel & (Y < np.median(Y[sel]))
    return not np.any(np.abs(X[fr]) < 0.012 * H)
sep_top = None
zz = 0.05 * H
while zz < 0.6 * H:
    s_ = separated(zz, zz + 0.01 * H)
    if s_ is False: break
    sep_top = zz + 0.01 * H; zz += 0.01 * H
SKIRT = sep_top is None or sep_top < 0.38 * H
# --legs pants: perna blindada/calça sob tabardo aberto dos lados (o painel do meio engana a fatia). Ver licoes-rig.md.
if LEGS == 'pants' and SKIRT:
    sep_top = max(sep_top or 0.0, 0.30 * H); SKIRT = False
elif LEGS == 'skirt':
    SKIRT = True
hem_z = sep_top if sep_top else 0.04 * H
# Anão (v482 rodada 5): pernas curtas, virilha ~0,36H (humano 0,50-0,56H). Ver licoes-rig.md.
HIPK = 0.70 if RACE == 'dwarf' else 1.0
if SKIRT:
    hip_jz = 0.52 * H * HIPK
else:
    hip_jz = clamp(sep_top + 0.045 * H, 0.50 * H * HIPK, 0.56 * H * HIPK)  # túnica cobre a virilha: piso 0,50H
log('pernas', 'SAIA' if SKIRT else 'calça', 'sep_top', round(sep_top or -1, 3), 'quadril z', round(hip_jz, 3))
for sg, nm in ((1, 'Left'), (-1, 'Right')):
    side = (X * sg) > 0.004 * H
    sole = side & (Z < 0.035 * H)
    if sole.sum() < 4: sole = side & (Z < 0.06 * H)
    fx = float(np.median(np.abs(X[sole])))
    yh, yt = float(Y[sole].max()), float(Y[sole].min())     # calcanhar (+Y, atrás), ponta (-Y)
    # tornozelo: primeira fatia (de baixo para cima) em que a profundidade cai para menos de 60% do pé
    flen = yh - yt; az = 0.068 * H
    for z0 in np.arange(0.02 * H, 0.14 * H, 0.005 * H):
        sel = side & (Z >= z0) & (Z < z0 + 0.008 * H) & (np.abs(X * sg - fx) < 0.06 * H)
        if sel.sum() >= 3 and rng(Y[sel]) < 0.6 * flen:
            az = z0 + 0.012 * H; break
    az = clamp(az, 0.045 * H, 0.095 * H)
    if DIGI: az = 0.15 * H
    ya = yh + 0.25 * (yt - yh)
    if DIGI: ya = yh + 0.08 * (yt - yh)  # calcanhar alto fica atrás
    if not SKIRT:
        sl = side & (Z > sep_top - 0.06 * H) & (Z < sep_top - 0.02 * H)
        hx = mid_(X[sl] * sg) if sl.sum() > 3 else 0.055 * H
        hx = clamp(hx, 0.035 * H, 0.08 * H)
        hy = mid_(Y[sl]) if sl.sum() > 3 else 0.0
    else:
        hx = clamp(0.5 * fx + 0.5 * 0.055 * H, 0.04 * H, 0.07 * H)
        sl = (Z > hip_jz - 0.03 * H) & (Z < hip_jz + 0.03 * H)
        hy = mid_(Y[sl])
    kz = az + 0.492 * (hip_jz - az)
    ksel = side & (Z > kz - 0.01 * H) & (Z < kz + 0.01 * H) & (np.abs(X * sg - 0.5 * (hx + fx)) < 0.06 * H)
    kx = 0.5 * (hx + fx)
    ky = mid_(Y[ksel]) if (ksel.sum() > 3 and not SKIRT) else 0.5 * (hy + ya)
    L[nm + 'UpLeg'] = Vector((sg * hx, hy, hip_jz))
    L[nm + 'Leg'] = Vector((sg * kx, ky, kz))
    L[nm + 'Foot'] = Vector((sg * fx, ya, az))
    L[nm + 'ToeBase'] = Vector((sg * fx, yh + 0.74 * (yt - yh), 0.022 * H))
    L[nm + 'ToeTip'] = Vector((sg * fx, yt, 0.02 * H))

# --- pescoço e cabeça: fatia mais estreita acima dos ombros
best = None
for z0 in np.arange(arm_z + 0.02 * H, H - 0.08 * H, 0.005 * H):
    sel = (Z >= z0) & (Z < z0 + 0.008 * H) & (np.abs(X) < xsh)
    if sel.sum() < 4: continue
    wdt = rng(X[sel]) + 0.5 * rng(Y[sel])
    if best is None or wdt < best[1]: best = (z0, wdt)
neck_min = best[0] if best else 0.84 * H
head_z = clamp(neck_min + 0.015 * H, 0.81 * H, 0.885 * H)
neck_z = clamp(arm_z + 0.03 * H, 0.75 * H, head_z - 0.035 * H)
hsel = Z > head_z + 0.02 * H
head_y = mid_(Y[hsel]); head_hw = 0.5 * rng(X[hsel & (np.abs(X) < xsh)])
nsel = (Z > neck_z - 0.01 * H) & (Z < head_z) & (np.abs(X) < 0.06 * H)
neck_y = mid_(Y[nsel]) if nsel.sum() > 3 else head_y
L['Neck'] = Vector((0, neck_y, neck_z))
L['Head'] = Vector((0, 0.5 * (neck_y + head_y), head_z))
L['HeadTop_End'] = Vector((0, head_y, H))
# --- coluna
hips_z = hip_jz + 0.036 * H
def torso_y(z):
    sel = (Z > z - 0.015 * H) & (Z < z + 0.015 * H) & (np.abs(X) < 0.12 * H)
    return mid_(Y[sel]) if sel.sum() > 3 else 0.0
L['Hips'] = Vector((0, torso_y(hips_z), hips_z))
for nm, f in (('Spine', 0.19), ('Spine1', 0.42), ('Spine2', 0.656)):
    z = hips_z + f * (neck_z - hips_z); L[nm] = Vector((0, torso_y(z), z))
for sg, nm in ((1, 'Left'), (-1, 'Right')):
    L[nm + 'Shoulder'] = Vector((sg * 0.034 * H, L['Spine2'].y, arm_z))
for k in NAMES:
    log('marco', k, tuple(round(c, 3) for c in L[k]))

# ---------------------------------------------------------------- esqueleto
ad = bpy.data.armatures.new('Armature'); arm = bpy.data.objects.new('Armature', ad)
sc.collection.objects.link(arm)
bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active = arm; arm.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
CHILD = {'Hips': 'Spine', 'Spine': 'Spine1', 'Spine1': 'Spine2', 'Spine2': 'Neck', 'Neck': 'Head', 'Head': 'HeadTop_End',
         'LeftShoulder': 'LeftArm', 'LeftArm': 'LeftForeArm', 'LeftForeArm': 'LeftHand', 'LeftHand': 'LeftHandTip',
         'RightShoulder': 'RightArm', 'RightArm': 'RightForeArm', 'RightForeArm': 'RightHand', 'RightHand': 'RightHandTip',
         'LeftUpLeg': 'LeftLeg', 'LeftLeg': 'LeftFoot', 'LeftFoot': 'LeftToeBase', 'LeftToeBase': 'LeftToeTip',
         'RightUpLeg': 'RightLeg', 'RightLeg': 'RightFoot', 'RightFoot': 'RightToeBase', 'RightToeBase': 'RightToeTip'}
for b in NAMES:
    eb = ad.edit_bones.new(P + b)
    eb.head = L[b]
    if b == 'HeadTop_End':
        eb.tail = L[b] + Vector((0, 0, 0.04 * H))
    else:
        t = L[CHILD[b]]
        if (t - L[b]).length < 0.01 * H: t = L[b] + Vector((0, 0, 0.02 * H))
        eb.tail = t
    eb.roll = 0
    eb.use_deform = b in DEFORM
for b in NAMES:
    if PARENT[b]: ad.edit_bones[P + b].parent = ad.edit_bones[P + PARENT[b]]; ad.edit_bones[P + b].use_connect = False
bpy.ops.object.mode_set(mode='OBJECT')

# ---------------------------------------------------------------- pesos
def bind(target, src_obj=None):
    bpy.ops.object.select_all(action='DESELECT')
    target.select_set(True); arm.select_set(True); bpy.context.view_layer.objects.active = arm
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
def weight_matrix(o):
    n = len(o.data.vertices); W = np.zeros((n, len(NAMES)))
    gi = {g.index: NAMES.index(g.name[len(P):]) for g in o.vertex_groups if g.name.startswith(P) and g.name[len(P):] in NAMES}
    for v in o.data.vertices:
        for g in v.groups:
            if g.group in gi: W[v.index, gi[g.group]] = g.weight
    return W
def weights_ok(W):
    zero = (W.sum(1) < 1e-4).mean()
    dead = [NAMES[j] for j in range(len(NAMES)) if NAMES[j] in DEFORM and W[:, j].max() < 0.05 and NAMES[j] not in ('LeftShoulder', 'RightShoulder', 'Spine1')]
    return zero, dead

method = 'rigid669'
# v669: peso firme como num rig de jogo: cada vértice segue o osso mais perto; mistura curta só nas juntas
_co = V(); _n = len(_co); W = np.zeros((_n, len(NAMES)))
for j, b in enumerate(NAMES):
    if b not in DEFORM: continue
    h_ = np.array(L[b][:]); t_ = np.array((L[CHILD[b]] if b in CHILD else L[b] + Vector((0, 0, .02)))[:])
    d_ = t_ - h_; ll = max(1e-9, d_ @ d_); u_ = np.clip(((_co - h_) @ d_) / ll, 0, 1)
    dist = np.linalg.norm(_co - (h_ + u_[:, None] * d_[None, :]), axis=1)
    W[:, j] = np.exp(-(dist / (0.028 * H)) ** 2) + 1e-12 * np.exp(-dist / H)
W = W / W.sum(1, keepdims=True)
log('v669 pesos por distância ao osso (sigma 0.028H)')

# --- regras: cada osso só pode pesar onde faz sentido (mão/cabeça não vazam para o tronco)
co = V(); X, Y, Z = co[:, 0], co[:, 1], co[:, 2]
n = len(co); A = np.ones((n, len(NAMES)))
def J(b): return NAMES.index(b)
def soft(v, a, b):  # 0 em a, 1 em b (suave)
    t = np.clip((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
ankle_z = 0.5 * (L['LeftFoot'].z + L['RightFoot'].z); knee_z = 0.5 * (L['LeftLeg'].z + L['RightLeg'].z)
for sg, nm in ((1, 'Left'), (-1, 'Right')):
    xs = X * sg; a = AR[sg]
    side = soft(xs, -0.03 * H if SKIRT else -0.012 * H, 0.004 * H)
    for b in ('Shoulder', 'Arm', 'ForeArm', 'Hand', 'UpLeg', 'Leg', 'Foot', 'ToeBase'): A[:, J(nm + b)] *= side
    A[:, J(nm + 'Hand')] *= soft(xs, a['xw'] - 0.035 * H, a['xw'] - 0.012 * H)
    A[:, J(nm + 'ForeArm')] *= soft(xs, a['xe'] - 0.06 * H, a['xe'] - 0.03 * H)
    A[:, J(nm + 'Arm')] *= soft(xs, a['xsh'] - 0.07 * H, a['xsh'] - 0.035 * H) * soft(Z, armpit_z - 0.1 * H, armpit_z - 0.05 * H)
    A[:, J(nm + 'Shoulder')] *= soft(Z, armpit_z - 0.08 * H, armpit_z - 0.03 * H) * (1 - soft(xs, a['xsh'] + 0.06 * H, a['xsh'] + 0.1 * H))
    A[:, J(nm + 'UpLeg')] *= 1 - soft(Z, hips_z, hips_z + 0.04 * H)
    A[:, J(nm + 'Leg')] *= 1 - soft(Z, knee_z + 0.45 * (hip_jz - knee_z), knee_z + 0.7 * (hip_jz - knee_z))
    A[:, J(nm + 'Foot')] *= 1 - soft(Z, ankle_z + 0.35 * (knee_z - ankle_z), ankle_z + 0.55 * (knee_z - ankle_z))
    yfront = L[nm + 'Foot'].y + 0.45 * (L[nm + 'ToeBase'].y - L[nm + 'Foot'].y)
    A[:, J(nm + 'ToeBase')] *= soft(-Y, -yfront - 0.01 * H, -yfront + 0.01 * H) * (1 - soft(Z, 0.07 * H, 0.1 * H))
    # nada de braço ou mão no quadril/cintura, perna nenhuma no braço
    for b in ('UpLeg', 'Leg', 'Foot', 'ToeBase'): A[:, J(nm + b)] *= 1 - soft(np.abs(X), a['xa'] + 0.0 * H, a['xa'] + 0.04 * H) * soft(Z, armpit_z - 0.1 * H, armpit_z)
head_lo = neck_z + 0.35 * (head_z - neck_z)
A[:, J('Head')] *= soft(Z, head_lo - 0.01 * H, head_lo + 0.01 * H) * (1 - soft(np.abs(X), xsh - 0.01 * H, xsh + 0.02 * H))
A[:, J('Neck')] *= soft(Z, L['Spine2'].z, L['Spine2'].z + 0.03 * H) * (1 - soft(np.abs(X), xsh, xsh + 0.04 * H))
A[:, J('HeadTop_End')] = 0
xa_m = 0.5 * (AR[1]['xa'] + AR[-1]['xa'])
for b in ('Hips', 'Spine', 'Spine1', 'Spine2'):
    A[:, J(b)] *= 1 - soft(np.abs(X), xa_m + 0.01 * H, xa_m + 0.05 * H)
    A[:, J(b)] *= 1 - soft(Z, head_lo, head_lo + 0.03 * H)
A[:, J('Hips')] *= 1 - soft(Z, L['Spine1'].z, L['Spine2'].z)
for b in ('Spine', 'Spine1', 'Spine2'):
    A[:, J(b)] *= soft(Z, hip_jz - 0.02 * H, hip_jz + 0.03 * H)

# adjacência para suavizar
ev = np.empty(len(me.edges) * 2, dtype=np.int64); me.edges.foreach_get('vertices', ev); ev = ev.reshape(-1, 2)
deg = np.bincount(ev.ravel(), minlength=n).astype(float); deg[deg == 0] = 1
def smooth(M, it, f):
    for _ in range(it):
        acc = np.zeros_like(M)
        np.add.at(acc, ev[:, 0], M[ev[:, 1]]); np.add.at(acc, ev[:, 1], M[ev[:, 0]])
        M = (1 - f) * M + f * acc / deg[:, None]
    return M
def seg_dist(b):
    h = np.array(L[b][:]); t = np.array((L[CHILD[b]] if b in CHILD else L[b] + Vector((0, 0, .02)))[:])
    d = t - h; ll = max(1e-9, d @ d)
    u = np.clip(((co - h) @ d) / ll, 0, 1)
    return np.linalg.norm(co - (h + u[:, None] * d[None, :]), axis=1)
def apply_rules(W):
    W = W * A
    s_ = W.sum(1)
    bad = s_ < 1e-3
    if bad.any():  # sem peso válido: osso permitido mais próximo
        D = np.stack([seg_dist(b) if b in DEFORM else np.full(n, 1e9) for b in NAMES], 1)
        D = np.where(A > 0.2, D, 1e9)
        k = D[bad].argmin(1); W[bad] = 0; W[np.where(bad)[0], k] = 1
    return W / W.sum(1, keepdims=True)
W = apply_rules(W)

# pano solto abaixo do quadril (saia, capa, aba de casaco): longe dos ossos da perna -> mistura quadril/coxas
# por x, para a barra acompanhar as pernas sem rasgar no meio e a capa não enrolar na perna de trás.
def leg_gap():
    g = np.full(n, 1e9)
    for nm in ('Left', 'Right'):
        # coxa mais grossa perto do quadril: raio 0,05H no joelho -> 0,075H na virilha (calça não vira pano)
        hh_ = np.array(L[nm + 'UpLeg'][:]); kk_ = np.array(L[nm + 'Leg'][:]); dd_ = hh_ - kk_
        u_ = np.clip(((co - kk_) @ dd_) / (dd_ @ dd_), 0, 1)
        g = np.minimum(g, seg_dist(nm + 'UpLeg') - (0.05 + 0.025 * u_) * H)
        g = np.minimum(g, seg_dist(nm + 'Leg') - 0.045 * H)
        g = np.minimum(g, seg_dist(nm + 'Foot') - 0.045 * H)       # pé e ponta não são pano
        g = np.minimum(g, seg_dist(nm + 'ToeBase') - 0.04 * H)
    return g
lg = leg_gap()
def vertex_colors():
    """Cor média da textura base por vértice (mesma amostragem da _NPC_MASK)."""
    im = None
    for m in me.materials:
        if m and m.node_tree:
            for nd in m.node_tree.nodes:   # só a textura ligada à Base Color (a última TEX_IMAGE é o normal map)
                if nd.type == 'BSDF_PRINCIPLED':
                    lk = nd.inputs['Base Color'].links
                    if lk and lk[0].from_node.type == 'TEX_IMAGE' and lk[0].from_node.image: im = lk[0].from_node.image
    if im is None or im.size[0] == 0: return None
    w_, h_ = im.size; px = np.empty(w_ * h_ * 4, dtype=np.float32); im.pixels.foreach_get(px); px = px.reshape(h_, w_, 4)[:, :, :3]
    uv = np.empty(len(me.loops) * 2); me.uv_layers[0].data.foreach_get('uv', uv); uv = uv.reshape(-1, 2)
    lv = np.empty(len(me.loops), dtype=np.int64); me.loops.foreach_get('vertex_index', lv)
    lc = px[np.clip((uv[:, 1] % 1.0) * h_, 0, h_ - 1).astype(int), np.clip((uv[:, 0] % 1.0) * w_, 0, w_ - 1).astype(int)]
    cs = np.zeros((n, 3)); cnt = np.zeros(n); np.add.at(cs, lv, lc); np.add.at(cnt, lv, 1)
    return cs / np.maximum(cnt, 1)[:, None]
def leg_skin_like():
    c = vertex_colors()
    if c is None: return np.zeros(n, dtype=bool)
    face = (Z > head_z + 0.02 * H) & (Z < head_z + 0.5 * (H - head_z)) & (Y < head_y - 0.01 * H) & (np.abs(X) < 0.6 * head_hw)
    if face.sum() < 8: return np.zeros(n, dtype=bool)
    ref_ = np.median(c[face], 0)
    ch = c / np.maximum(c.sum(1, keepdims=True), 1e-6); chr_ = ref_ / max(ref_.sum(), 1e-6)
    d_ = np.linalg.norm(ch[:, :2] - chr_[None, :2], axis=1); lm = c.mean(1) / max(1e-6, ref_.mean())
    mx = c.max(1); sat = (mx - c.min(1)) / np.maximum(mx, 1e-6)
    return (d_ < 0.04) & (lm > 0.45) & (lm < 1.8) & (sat < 0.6) & (sat > 0.2) & (mx > 0.25)
below = (Z < hip_jz + 0.02 * H) & (Z > 0.03 * H) & (np.abs(X) < xa_m)
cfac = soft(lg, 0.0, 0.03 * H) * below
if SKIRT:  # vestido fechado: toda a casca entre quadril e barra é pano
    # ...menos a própria perna: coxa à mostra sob saia curta (soldado_f v482) virava pano e esticava como espaguete.
    # Distância não separa (saia justa fica a 1 cm da coxa); a cor separa: pele perto do osso da perna = perna.
    legskin = leg_skin_like() * (lg < 0.01 * H)
    legskin = np.clip(smooth(legskin[:, None].astype(float), 1, 0.5)[:, 0] * 1.2, 0, 1)
    # Perna blindada dentro de tabardo aberto (pesado_f v482: o painel da frente desce até 0,24H e vira "saia"):
    # o que está dentro do raio da coxa/canela é perna, não pano.
    legcore = soft(-lg, 0.0, 0.012 * H)
    # vestido longo (barra abaixo de 0,22H, sobrevivente_f): a barra encosta na canela e o avental bege parece pele;
    # aí vale a regra antiga (toda a casca é pano), senão a saia rasga do lado na corrida.
    if hem_z < 0.22 * H:
        legskin = np.zeros(n); legcore = np.zeros(n)
    log('saia: %d verts de coxa à mostra ficam na perna, %d de perna sob o pano' % (int((legskin > 0.5).sum()), int((legcore > 0.5).sum())))
    cfac = np.maximum(cfac, ((Z < hip_jz + 0.02 * H) & (Z > hem_z)).astype(float) * 0.9 * (1 - legskin) * (1 - legcore))
t = np.clip((hip_jz - Z) / max(1e-6, hip_jz - 0.1 * H), 0, 1)
lx = 0.5 * (L['LeftUpLeg'].x - L['RightUpLeg'].x)
sx = soft(X, -0.9 * lx, 0.9 * lx)
back = soft(Y, L['Hips'].y + 0.04 * H, L['Hips'].y + 0.08 * H)   # capa atrás: segue menos as pernas
# vestido segue bem as pernas; capa/aba de casaco sobre calça segue mais o quadril (não estica entre as pernas)
ls = ((0.85 - 0.35 * back) if SKIRT else (0.5 - 0.22 * back)) * (t * t * (3 - 2 * t))
k = 0.35 * t ** 2 * (1 - back)
Wn = np.zeros_like(W)
Wn[:, J('Hips')] = 1 - ls
Wn[:, J('LeftUpLeg')] = ls * sx * (1 - k); Wn[:, J('LeftLeg')] = ls * sx * k
Wn[:, J('RightUpLeg')] = ls * (1 - sx) * (1 - k); Wn[:, J('RightLeg')] = ls * (1 - sx) * k
W = (1 - cfac[:, None]) * W + cfac[:, None] * Wn
log('pano solto: %d verts (saia=%s, barra z=%.3f)' % (int((cfac > 0.5).sum()), SKIRT, hem_z))

W = smooth(W, 1, 0.3)  # v669: uma passada leve (antes 4x0,5 = boneco de posto)
W = apply_rules(W)
# limita a 4 influências e corta resto < 0,02
idx = np.argsort(-W, 1)
keep = np.zeros_like(W, dtype=bool)
np.put_along_axis(keep, idx[:, :4], True, 1)
W = np.where(keep & (W >= 0.02), W, 0)
W = W / W.sum(1, keepdims=True)
for g in list(ob.vertex_groups): ob.vertex_groups.remove(g)
VG = [ob.vertex_groups.new(name=P + b) for b in NAMES]
for j, b in enumerate(NAMES):
    nz = np.nonzero(W[:, j])[0]
    for i in nz: VG[j].add([int(i)], float(W[i, j]), 'REPLACE')
for md in list(ob.modifiers): ob.modifiers.remove(md)
ob.parent = arm
amod = ob.modifiers.new('Armature', 'ARMATURE'); amod.object = arm
log('pesos ok (%s); influências máx %d' % (method, int((W > 0).sum(1).max())))

# ---------------------------------------------------------------- orientação dos ossos = rig do Viajante
bpy.ops.object.select_all(action='DESELECT'); bpy.context.view_layer.objects.active = arm; arm.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
for b in NAMES:
    eb = ad.edit_bones[P + b]
    ln = (L[CHILD[b]] - L[b]).length if b in CHILD else 0.04 * H
    ln = max(ln, 0.015 * H)
    M = REFROT[b].to_4x4(); M.translation = L[b]
    eb.matrix = M; eb.length = ln
bpy.ops.object.mode_set(mode='OBJECT')

# ---------------------------------------------------------------- v673: membrana entre as pernas (Trellis liga um pé ao outro)
_kz = 0.5 * (L['LeftLeg'].z + L['RightLeg'].z)
_dom = W.argmax(1)
_LL = {NAMES.index(b) for b in ('LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase')}
_RR = {NAMES.index(b) for b in ('RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase')}
_bm = bmesh.new(); _bm.from_mesh(me); _bm.verts.ensure_lookup_table()
_web = [f for f in _bm.faces if max(v.co.z for v in f.verts) < _kz and any(_dom[v.index] in _LL for v in f.verts) and any(_dom[v.index] in _RR for v in f.verts) and all(cfac[v.index] < 0.35 for v in f.verts)]
if _web:
    bmesh.ops.delete(_bm, geom=_web, context='FACES_ONLY'); _bm.to_mesh(me); me.update()
    log('v673 membrana entre as pernas: %d faces apagadas' % len(_web))
elif _web:
    log('v673 membrana: %d faces ligam as pernas, mantidas (saia/vestido)' % len(_web))
_bm.free()
# ---------------------------------------------------------------- v672: correntes de pano (física no jogo: tools/pano672.js)
# Saia/vestido/túnica abaixo do quadril: 8 correntes de 4 ossos em volta da cintura, presas no Hips. O pano (cfac) passa
# para as correntes vizinhas (ângulo e altura), guardando parte do peso antigo (pernas) para não atravessar a coxa.
PANO = []
clo = cfac > 0.35
# v673: RABO (lobisomem etc.): pedaço atrás do quadril, para fora do corpo, abaixo da cintura -> corrente própria
back_y = L['Hips'].y + 0.09 * H
tail = (Y > back_y) & (Z < hip_jz + 0.02 * H) & (Z > 0.02 * H) & (lg > 0.02 * H)
TAIL = []
if tail.sum() > 0.01 * n and float(np.ptp(Y[tail])) > 0.08 * H:
    clo = clo & ~tail
    tz = Z[tail]; ty = Y[tail]; tx = X[tail]
    # linha central do rabo: da base (perto do quadril) até a ponta (mais longe do quadril)
    dist = np.hypot(ty - L['Hips'].y, tz - hip_jz)
    order_ = np.argsort(dist); NT = 5
    seg = np.array_split(order_, NT)
    pts = [Vector((L['Hips'].x, back_y - 0.03 * H, hip_jz - 0.02 * H))] + [Vector((float(tx[s_].mean()), float(ty[s_].mean()), float(tz[s_].mean()))) for s_ in seg]
    bpy.ops.object.select_all(action='DESELECT'); bpy.context.view_layer.objects.active = arm; arm.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT'); prev = ad.edit_bones[P + 'Hips']
    for i in range(NT):
        nm = 'pano_9_%d' % i; eb = ad.edit_bones.new(nm); eb.head = pts[i]; eb.tail = pts[i + 1]
        if (eb.tail - eb.head).length < 0.01 * H: eb.tail = eb.head + Vector((0, 0.02 * H, -0.01 * H))
        eb.parent = prev; eb.use_connect = i > 0; eb.use_deform = True; eb.roll = 0; prev = eb; TAIL.append(nm)
    bpy.ops.object.mode_set(mode='OBJECT')
    tw = np.zeros((n, NT)); ti = np.where(tail)[0]
    for rank, s_ in enumerate(seg):
        tw[ti[s_], rank] = 1.0
    log('v673 rabo: %d verts, corrente de %d ossos' % (int(tail.sum()), NT))
if clo.sum() > 0.02 * n:
    cx_, cy_ = L['Hips'].x, L['Hips'].y
    rmed = float(np.median(np.hypot(X[clo] - cx_, Y[clo] - cy_)))
    tight = rmed <= 0.11 * H
    K, NB = (12, 4) if tight else (8, 4)   # v673: vestido justo/longo = mais correntes (perna não passa entre elas)
    top = hip_jz - 0.01 * H
    bot = max(0.03 * H, min(float(Z[clo].min()) + 0.01 * H, hip_jz - 0.15 * H))
    ang = np.arctan2(Y - cy_, X - cx_)
    def rad(sec, z):
        b_ = sec & (np.abs(Z - z) < 0.03 * H)
        return float(np.median(np.hypot(X[b_] - cx_, Y[b_] - cy_))) if b_.sum() > 3 else None
    bpy.ops.object.select_all(action='DESELECT'); bpy.context.view_layer.objects.active = arm; arm.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    for kk in range(K):
        a0 = -math.pi + (kk + .5) * 2 * math.pi / K
        sec = clo & (np.abs(((ang - a0 + math.pi) % (2 * math.pi)) - math.pi) < math.pi / K)
        prev = ad.edit_bones[P + 'Hips']; rlast = 0.09 * H
        for i in range(NB):
            z0 = top + (bot - top) * i / NB; z1 = top + (bot - top) * (i + 1) / NB
            r0 = rad(sec, z0) or rlast; r1 = rad(sec, z1) or r0; rlast = r1
            nm = 'pano_%d_%d' % (kk, i)
            eb = ad.edit_bones.new(nm)
            eb.head = Vector((cx_ + r0 * math.cos(a0), cy_ + r0 * math.sin(a0), z0))
            eb.tail = Vector((cx_ + r1 * math.cos(a0), cy_ + r1 * math.sin(a0), z1))
            eb.parent = prev; eb.use_connect = i > 0; eb.use_deform = True; eb.roll = 0
            prev = eb; PANO.append(nm)
    bpy.ops.object.mode_set(mode='OBJECT')
    u = (ang + math.pi) / (2 * math.pi) * K - 0.5
    k0 = np.floor(u).astype(int) % K; k1 = (k0 + 1) % K; fa = u - np.floor(u)
    v = np.clip((top - Z) / max(1e-6, top - bot) * NB - 0.5, 0, NB - 1)
    i0 = np.floor(v).astype(int); i1 = np.minimum(i0 + 1, NB - 1); fb = v - i0
    WP = np.zeros((n, len(PANO)))
    for kc, wa in ((k0, 1 - fa), (k1, fa)):
        for ic, wb in ((i0, 1 - fb), (i1, fb)):
            np.add.at(WP, (np.arange(n), kc * NB + ic), wa * wb)
    share = 0.6 if tight else 0.75   # v673: vestido justo divide entre pernas e correntes (só correntes espalhava a barra no chão)
    c = np.clip(cfac, 0, 1)[:, None] * share * clo[:, None]
    WA = np.concatenate([W * (1 - c), WP * c], 1)
    log('v673 pano: raio %.3fH, %d%% nas correntes' % (rmed / H, int(share * 100)))
    idx = np.argsort(-WA, 1); keep = np.zeros_like(WA, dtype=bool); np.put_along_axis(keep, idx[:, :4], True, 1)
    WA = np.where(keep & (WA >= 0.02), WA, 0); WA = WA / WA.sum(1, keepdims=True)
    if TAIL:
        WT = np.zeros((n, len(TAIL))); WT[tail] = tw[tail]
        WA = np.concatenate([np.where(tail[:, None], 0, WA), WT * 0.9], 1)
        WA[tail, NAMES.index('Hips')] += 0.1
        WA = WA / WA.sum(1, keepdims=True); PANO = PANO + TAIL
    for g in list(ob.vertex_groups): ob.vertex_groups.remove(g)
    allnames = [P + b for b in NAMES] + PANO
    VG = [ob.vertex_groups.new(name=nm) for nm in allnames]
    for j in range(WA.shape[1]):
        for i in np.nonzero(WA[:, j])[0]: VG[j].add([int(i)], float(WA[i, j]), 'REPLACE')
    log('v672 pano: %d correntes x %d ossos, %d verts de pano, barra z=%.2fH' % (K, NB, int(clo.sum()), bot / H))
else:
    log('v672 pano: sem pano solto abaixo do quadril')

# ---------------------------------------------------------------- textura 1024 JPEG + material PBR fosco
img = None
for m in me.materials:
    if m and m.node_tree:
        for nd in m.node_tree.nodes:
            if nd.type == 'BSDF_PRINCIPLED':
                lk = nd.inputs['Base Color'].links
                if lk and lk[0].from_node.type == 'TEX_IMAGE': img = lk[0].from_node.image
if img is None:
    imgs = [i for i in bpy.data.images if i.size[0] > 0]
    img = max(imgs, key=lambda i: i.size[0]) if imgs else None
if len(me.materials) > 1: log('AVISO: %d materiais; mantendo só a textura base %s' % (len(me.materials), img.name if img else None))
mat = bpy.data.materials.new('npc482_' + NID); mat.use_nodes = True
nt = mat.node_tree; bsdf = [nd for nd in nt.nodes if nd.type == 'BSDF_PRINCIPLED'][0]
bsdf.inputs['Metallic'].default_value = 0.0; bsdf.inputs['Roughness'].default_value = 0.8
TEXPX = None
if img:
    if img.size[0] > 1024 or img.size[1] > 1024: img.scale(1024, 1024)
    img.name = NID + '_basecolor'
    tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = img
    nt.links.new(tx.outputs['Color'], bsdf.inputs['Base Color'])
    w_, h_ = img.size
    TEXPX = np.empty(w_ * h_ * 4, dtype=np.float32); img.pixels.foreach_get(TEXPX); TEXPX = TEXPX.reshape(h_, w_, 4)[:, :, :3]
me.materials.clear(); me.materials.append(mat)
for i in list(bpy.data.images):
    if i is not img: bpy.data.images.remove(i)

# ---------------------------------------------------------------- _NPC_MASK
def rgb2hsv(c):
    mx = c.max(1); mn = c.min(1); d = mx - mn
    s_ = np.where(mx > 1e-6, d / np.maximum(mx, 1e-6), 0)
    h = np.zeros(len(c))
    r, g, b = c[:, 0], c[:, 1], c[:, 2]
    m_ = d > 1e-6
    hr = (mx == r) & m_; hg = (mx == g) & m_ & ~hr; hb = m_ & ~hr & ~hg
    h[hr] = ((g - b)[hr] / d[hr]) % 6; h[hg] = (b - r)[hg] / d[hg] + 2; h[hb] = (r - g)[hb] / d[hb] + 4
    return h * 60, s_, mx
MASK = np.zeros((n, 4)); col = np.full((n, 3), 0.5)
if TEXPX is not None:
    hh, ww = TEXPX.shape[:2]
    # leve desfoque 3x3 para não pegar costura/ruído
    tp = TEXPX.copy()
    acc = np.zeros_like(tp)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1): acc += np.roll(np.roll(tp, dy, 0), dx, 1)
    tp = acc / 9
    uv = np.empty(len(me.loops) * 2); me.uv_layers[0].data.foreach_get('uv', uv); uv = uv.reshape(-1, 2)
    lv = np.empty(len(me.loops), dtype=np.int64); me.loops.foreach_get('vertex_index', lv)
    px_ = np.clip((uv[:, 0] % 1.0) * ww, 0, ww - 1).astype(int); py_ = np.clip((uv[:, 1] % 1.0) * hh, 0, hh - 1).astype(int)
    lc = tp[py_, px_]
    cs = np.zeros((n, 3)); cnt = np.zeros(n)
    np.add.at(cs, lv, lc); np.add.at(cnt, lv, 1)
    col = cs / np.maximum(cnt, 1)[:, None]
    hue, sat, val = rgb2hsv(col)
    R_, G_, B_ = col[:, 0] * 255, col[:, 1] * 255, col[:, 2] * 255
    Yc = 0.299 * R_ + 0.587 * G_ + 0.114 * B_
    Cb = 128 - 0.168736 * R_ - 0.331264 * G_ + 0.5 * B_; Cr = 128 + 0.5 * R_ - 0.418688 * G_ - 0.081312 * B_
    ycc = (Cb > 77) & (Cb < 130) & (Cr > 133) & (Cr < 180) & (Yc > 45)
    # tom de pele de referência: rosto (frente da cabeça, abaixo da testa) ou mãos
    face = (Z > head_z + 0.02 * H) & (Z < head_z + 0.5 * (H - head_z)) & (Y < head_y - 0.01 * H) & (np.abs(X) < 0.6 * head_hw) & ycc
    hands = (np.abs(X) > 0.5 * (AR[1]['xw'] + AR[-1]['xw']) + 0.01 * H) & ycc
    # mecha de cabelo na frente do rosto (pesado_f v482: ruiva, o tom de "pele" saiu castanho-avermelhado = cabelo):
    # tira do rosto o que tem a cor do topo da cabeça
    top0 = Z > H - 0.035 * H
    if top0.sum() >= 5:
        hcol0 = np.median(col[top0], 0)
        notHair = np.linalg.norm(col - hcol0[None], axis=1) > 0.09
        if (face & notHair).sum() >= 8: face = face & notHair
        if (hands & notHair).sum() >= 8: hands = hands & notHair
    src = face if face.sum() >= 8 else hands
    if src.sum() >= 8:
        skin_ref = np.median(col[src], 0)
        def chroma(c): return c / np.maximum(c.sum(1, keepdims=True), 1e-6)
        dist = np.linalg.norm(chroma(col)[:, :2] - chroma(skin_ref[None])[:, :2], axis=1)
        lum = col.mean(1) / max(1e-6, skin_ref.mean())
        sk = np.clip(1 - (dist - 0.02) / 0.02, 0, 1) * ((lum > 0.45) & (lum < 1.7)) * ycc
        # fora de cabeça/pescoço/mãos/antebraço exige cor bem perto (roupa marrom parece pele)
        body_ok = (Z > neck_z - 0.02 * H) | (np.abs(X) > 0.5 * (AR[1]['xe'] + AR[-1]['xe']))
        sk = np.where(body_ok, sk, sk * (dist < 0.012))
        # rosto (abaixo do cabelo, frente da cabeça): sombra assada, boca e barba rala continuam pele
        facez = (Z > neck_z) & (Z < head_z + 0.55 * (H - head_z)) & (Y < head_y) & (np.abs(X) < head_hw)
        skf = np.clip(1 - (dist - 0.05) / 0.03, 0, 1) * ((lum > 0.3) & (lum < 1.8))
        sk = np.where(facez, np.maximum(sk, skf), sk)
        # braços e pernas à mostra: tolerância maior, comparando com o rosto e com as mãos (a luz assada muda o tom)
        limb = (np.abs(X) > xa_m) | ((Z < knee_z) & (lg < 0.004 * H)) | ((Z < hip_jz) & (lg < 0.0))  # perna à mostra (coxa sob saia curta), não a barra do avental
        refs = [skin_ref]
        if hands.sum() >= 8: refs.append(np.median(col[hands], 0))
        for r_ in refs:
            d_ = np.linalg.norm(chroma(col)[:, :2] - chroma(r_[None])[:, :2], axis=1)
            lm = col.mean(1) / max(1e-6, r_.mean())
            sl_ = np.clip(1 - (d_ - 0.035) / 0.02, 0, 1) * ((lm > 0.4) & (lm < 1.8)) * ycc
            sl_ = sl_ * (sat < 0.56) * (val > 0.42)          # bota/couro marrom escuro não é pele
            sl_ = np.where(Z < 0.1 * H, sl_ * (d_ < 0.012) * (val > 0.5), sl_)
            sk = np.where(limb, np.maximum(sk, sl_), sk)
        # couro marrom (bolsas no cinto, braçadeiras) tem o MESMO croma da pele, só é mais escuro (mago_m v482:
        # bolsas e braçadeiras viraram pele). Fora do rosto e das mãos a pele precisa ter brilho perto do rosto.
        handz = np.abs(X) > 0.5 * (AR[1]['xw'] + AR[-1]['xw'])
        lum0 = col.mean(1) / max(1e-6, skin_ref.mean())
        sk = np.where(facez | handz, sk, sk * np.clip((lum0 - 0.62) / 0.12, 0, 1))
        log('pele ref', np.round(skin_ref, 3), 'de', 'rosto' if src is face else 'mãos')
    else:
        sk = np.zeros(n); log('sem pele visível detectada')
    hair_reg = (np.abs(X) < max(head_hw * 1.35, 0.06 * H)) & (
        (Z > head_z + 0.55 * (H - head_z)) | ((Z > head_z - 0.02 * H) & (Y > head_y + 0.005 * H)) |
        ((Z > head_z + 0.3 * (H - head_z)) & (np.abs(X) > 0.75 * head_hw)))
    hr_ = hair_reg * (1 - sk)
    # cabelo pela cor do topo da cabeça (sempre cabelo/chapéu): franja clara parecida com pele vai para cabelo
    top = (Z > H - 0.035 * H)
    HOOD = False
    if top.sum() >= 5 and 'skin_ref' in dir():
        href = np.median(col[top], 0)
        dh_ = np.linalg.norm(col - href[None], axis=1)
        # capuz (v482 mago_f/sombra_m/f): o topo tem a cor da ROUPA do tronco, não é cabelo. Sinal: boa parte do
        # tronco (entre quadril e axila, dentro dos ombros) tem a mesma cor do topo da cabeça.
        torso_ = (Z > hip_jz) & (Z < armpit_z) & (np.abs(X) < xa_m)
        # comparar por croma + brilho (luz assada deixa o capuz mais claro que o manto: mago_f v482)
        def _chr(c): return c / np.maximum(c.sum(1, keepdims=True), 1e-6)
        dch_ = np.linalg.norm(_chr(col)[:, :2] - _chr(href[None])[:, :2], axis=1)
        lmh_ = col.mean(1) / max(1e-6, href.mean())
        same_ = (dch_ < 0.035) & (lmh_ > 0.5) & (lmh_ < 1.8)
        fr_ = float(same_[torso_].mean()) if torso_.sum() else 0.0
        log('capuz? topo', np.round(href, 3), 'tronco com a cor do topo', round(fr_, 3))
        # só liga com --hood yes: o teste automático confundiu cabelo castanho com couro castanho (soldado_m) e
        # não pegou o capuz azul claro sobre manto escuro com faixa branca (mago_f). Fica só como aviso.
        if HOODARG == 'auto' and fr_ > 0.25: log('AVISO: topo da cabeça com a cor do tronco; se for capuz use --hood yes')
        if HOODARG == 'yes':
            HOOD = True
            hood_ = same_ | (dh_ < 0.10)
            hr_ = hr_ * (~hood_)
            # cabelo de verdade = o que sobra na região da cabeça/lados do rosto com cor longe do capuz e da pele
            inner = hair_reg & ~hood_ & (sk < 0.5) & (dh_ > 0.15)
            if inner.sum() >= 8:
                href = np.median(col[inner], 0)
                dh_ = np.linalg.norm(col - href[None], axis=1)
                hr_ = np.where(hair_reg & ~hood_ & (dh_ < 0.10) & (sk < 0.5), 1.0, 0.0)
            else:
                hr_ = np.zeros(n)
            log('capuz detectado: topo = roupa; cabelo', int((hr_ > 0.5).sum()), 'verts')
        ds_ = np.linalg.norm(col - skin_ref[None], axis=1)
    if top.sum() >= 5 and 'skin_ref' in dir() and not HOOD:
        headz = (Z > head_z + 0.3 * (H - head_z)) & (np.abs(X) < head_hw * 1.35)
        eyes = (Y < head_y) & (np.abs(X) < 0.6 * head_hw) & (Z < head_z + 0.6 * (H - head_z))
        flip = headz & (dh_ < 0.8 * ds_) & ~eyes
        hr_ = np.where(flip, 1.0, hr_); sk = np.where(flip, 0.0, sk)
        # nuca/gola/ombreira atrás do pescoço: só é cabelo se tiver a cor do topo (pesado_m v482: gola de metal virou cabelo)
        lowback = (Z < head_z + 0.3 * (H - head_z)) & ~flip
        hr_ = np.where(lowback & (dh_ > 0.12) & (sat < 0.2), 0.0, hr_)   # metal/couro cinza; mecha clara na nuca continua cabelo
    # trança/rabo de cavalo descendo do cabelo: mesma cor do cabelo, perto da cabeça e acima das axilas
    hm = (hr_ > 0.5) & (Z > head_z + (0.0 if HOOD else 0.4) * (H - head_z))
    if hm.sum() >= 8:
        hair_ref = np.median(col[hm], 0)
        dh = np.linalg.norm(col - hair_ref[None], axis=1)
        near_h = (Z > armpit_z - 0.05 * H) & (np.abs(X) < max(head_hw * 1.6, 0.08 * H))
        cand = near_h & (np.clip(1 - (dh - 0.10) / 0.05, 0, 1) * (1 - sk) > 0.5)  # ligado pela malha: pode ser mais tolerante
        if HOOD:
            # cabelo longo saindo do capuz (mago_f v482: cabelo branco até a cintura; as mechas ao lado do rosto
            # tinham virado pele): desce até o quadril e vence a pele quando está bem mais perto da cor do cabelo
            near_h = (Z > hip_jz - 0.10 * H) & (np.abs(X) < max(head_hw * 2.2, xa_m))
            def _chr2(c): return c / np.maximum(c.sum(1, keepdims=True), 1e-6)
            dhc = np.linalg.norm(_chr2(col)[:, :2] - _chr2(hair_ref[None])[:, :2], axis=1)
            lmr = col.mean(1) / max(1e-6, hair_ref.mean())
            hcol = (dhc < 0.025) & (lmr > 0.6) & (lmr < 1.7)   # mecha clara/escura pela luz assada: croma + brilho
            cand = near_h & hcol & ((sk < 0.5) | (dhc < 0.4 * np.linalg.norm(_chr2(col)[:, :2] - _chr2(skin_ref[None])[:, :2], axis=1)))
        # só o que se liga ao cabelo pela malha (trança): couro marrom escuro do peito tem a cor do cabelo,
        # mas fica separado pela gola/pescoço (v482 soldado_m: o peitoral virou "cabelo")
        reach = hm.copy()
        for _ in range(400):
            nb = np.zeros(n, dtype=bool)
            nb[ev[:, 0][reach[ev[:, 1]]]] = True; nb[ev[:, 1][reach[ev[:, 0]]]] = True
            new_ = reach | (nb & cand)
            if (new_ == reach).all(): break
            reach = new_
        hr_ = np.maximum(hr_, (reach & cand).astype(float))
        if HOOD:
            # mechas compridas que somem sob o manto e reaparecem soltas (sem ligação na malha): pedaço com a cor do
            # cabelo cujo ponto mais alto passa da axila = cabelo; a faixa da cintura (mesma cor) fica abaixo
            lab_ = np.where(cand, np.arange(n), n)
            for _ in range(600):
                a_, b_ = ev[:, 0], ev[:, 1]
                ok_ = cand[a_] & cand[b_]
                m_ = np.minimum(lab_[a_], lab_[b_])
                new_ = lab_.copy()
                np.minimum.at(new_, a_[ok_], m_[ok_]); np.minimum.at(new_, b_[ok_], m_[ok_])
                if (new_ == lab_).all(): break
                lab_ = new_
            ztop = np.full(n + 1, -1.0)
            np.maximum.at(ztop, lab_[cand], Z[cand])
            loose = cand & (ztop[lab_] > armpit_z - 0.02 * H)
            hr_ = np.maximum(hr_, loose.astype(float))
            sk = np.where((reach & cand) | loose, 0.0, sk)
    # couro: marrom/vermelho escuro (armadura de couro do caçador tem saturação 0,25-0,4 e valor < 0,3)
    # (a faixa larga s>0,2/v<0,3 só para caçador: no civil o mesmo marrom escuro é capa de pano que pode mudar de cor)
    leather = (((hue > 5) & (hue < 40)) | (hue > 350)) & (((val < 0.38) & (sat > 0.4)) | (((val < 0.30) & (sat > 0.2)) & (ROLE == 'hunter')))
    det = ((sat < 0.2) | (val < 0.12) | leather).astype(float) * (1 - sk) * (1 - hr_)
    cl = np.clip(1 - sk - hr_ - det, 0, 1)
    S = np.stack([cl, hr_, sk, det], 1)
    S = smooth(S, 1, 0.5)
    lab = S.argmax(1)
    # voto da vizinhança (2 passadas): reflexo/sombra assada solta pontinhos de roupa no couro e de pele no cinto
    for _ in range(2):
        O = np.zeros((n, 4)); O[np.arange(n), lab] = 1
        acc = O.copy() * 1.5
        np.add.at(acc, ev[:, 0], O[ev[:, 1]]); np.add.at(acc, ev[:, 1], O[ev[:, 0]])
        lab = acc.argmax(1)
    MASK[np.arange(n), lab] = 1
cnts = MASK.sum(0).astype(int)
log('mask roupa/cabelo/pele/detalhe', cnts.tolist())
if os.environ.get('R482_DUMP'):
    np.savez(os.environ['R482_DUMP'], co=co, col=col, mask=MASK, lg=lg)
att = me.attributes.new('_NPC_MASK', 'FLOAT_COLOR', 'POINT')
att.data.foreach_set('color', np.c_[MASK].astype(np.float32).ravel())

# ---------------------------------------------------------------- exportar GLB + JSON
bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True); arm.select_set(True)
bpy.context.view_layer.objects.active = arm
for p_ in arm.pose.bones: p_.matrix_basis = Matrix()
exp = dict(filepath=OUT, export_format='GLB', use_selection=True, export_animations=False, export_skins=True,
           export_attributes=True, export_image_format='JPEG', export_jpeg_quality=86, export_yup=True,
           export_vertex_color='NONE', export_active_vertex_color_when_no_material=False, export_def_bones=False,
           export_morph=False, export_extras=False, export_cameras=False, export_lights=False)
try:
    bpy.ops.export_scene.gltf(**exp)
except TypeError:
    exp.pop('export_vertex_color'); exp.pop('export_active_vertex_color_when_no_material')
    bpy.ops.export_scene.gltf(**exp)
HS = {'human': 1.0, 'elf': 1.04, 'dwarf': 0.70}[RACE] * (0.95 if SEX == 'f' else 1.0)
meta = dict(id=NID, race=RACE, sex=SEX, role=ROLE, heightScale=round(HS, 3),
            family=FAMILY or NID.rsplit('_', 1)[0], rig='mixamo23-v482', weights=method, pano=len(PANO), skirt=bool(SKIRT), legs=LEGS, hood=(HOODARG == 'yes'),
            tris=int(tris), source=os.path.basename(SRC))
json.dump(meta, open(os.path.splitext(OUT)[0] + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# verificação do arquivo
js, _ = read_glb(OUT)
names = [nd.get('name') for nd in js['nodes']]
missing = [b for b in NAMES if P + b not in names]
prim = js['meshes'][0]['primitives'][0]
kb = os.path.getsize(OUT) / 1024
ow = GLTFRig(OUT).world()
maxang = 0
for b in NAMES:
    q1 = ow[P + b].to_quaternion(); q2 = RW[P + b].to_quaternion()
    maxang = max(maxang, math.degrees(q1.rotation_difference(q2).angle))
log('GLB', OUT, '%.0f KB' % kb, 'faltando', missing, 'atributos', sorted(prim['attributes'].keys()),
    'anims', len(js.get('animations', [])), 'imagens', [im.get('mimeType') for im in js.get('images', [])],
    'desvio max orientacao %.2f graus' % maxang, 'skins', len(js.get('skins', [])), 'juntas', len(js['skins'][0]['joints']) if js.get('skins') else 0)
CHECK = dict(kb=round(kb), missing=missing, attrs=sorted(prim['attributes'].keys()), anims=len(js.get('animations', [])),
             orient_dev_deg=round(maxang, 2), tris=int(tris), method=method, skirt=bool(SKIRT))

# ---------------------------------------------------------------- provas
REST = {b: arm.data.bones[P + b].matrix_local.copy() for b in NAMES}
def set_pose(D, hip_off=0.0):
    """D[b]: rotação delta em espaço do mundo (Blender) aplicada sobre a pose T, como retarget153/setup155 do jogo."""
    Mp = {}
    for b in NAMES:
        R = REST[b]; pb = arm.pose.bones[P + b]
        if PARENT[b] is None:
            head = R.translation + Vector((0, 0, hip_off))
        else:
            head = (Mp[PARENT[b]] @ REST[PARENT[b]].inverted() @ R).translation
        if b in D:
            rot = (D[b] @ R.to_quaternion()).to_matrix().to_4x4()
        else:
            rel = Mp[PARENT[b]] @ REST[PARENT[b]].inverted() @ R if PARENT[b] else R
            rot = rel.to_quaternion().to_matrix().to_4x4()
        M = rot.copy(); M.translation = head; Mp[b] = M
        if PARENT[b] is None: base = R
        else: base = Mp[PARENT[b]] @ REST[PARENT[b]].inverted() @ R
        pb.matrix_basis = base.inverted() @ M
    bpy.context.view_layer.update()
def clear_pose():
    for pb in arm.pose.bones: pb.matrix_basis = Matrix()
    bpy.context.view_layer.update()

def Rx(d): return Quaternion((1, 0, 0), math.radians(d))
def Ry(d): return Quaternion((0, 1, 0), math.radians(d))
def Rz(d): return Quaternion((0, 0, 1), math.radians(d))
def chain(L_):
    """L_[b] = rotação local expressa nos eixos da pose T; D(filho) = D(pai) @ L(filho)."""
    D = {}
    for b in NAMES:
        d = D[PARENT[b]] if PARENT[b] else Quaternion()
        D[b] = d @ L_.get(b, Quaternion())
    return D
POSES = {
    'braco70': chain({'LeftArm': Ry(70), 'LeftForeArm': Rz(-60), 'RightArm': Ry(-70), 'RightForeArm': Rz(60)}),
    'corrida': chain({'LeftUpLeg': Rx(-38), 'LeftLeg': Rx(65), 'LeftFoot': Rx(-15), 'RightUpLeg': Rx(28), 'RightLeg': Rx(55),
                      'Spine': Rx(-6), 'LeftArm': Rx(25) @ Ry(78), 'LeftForeArm': Rz(-50), 'RightArm': Rx(-35) @ Ry(-78), 'RightForeArm': Rz(70)}),
    'torcao': chain({'Spine': Rz(12) @ Rx(-5), 'Spine1': Rz(12), 'Spine2': Rz(12), 'Neck': Rz(-10), 'Head': Rz(-10),
                     'RightArm': Ry(65), 'RightForeArm': Rz(30), 'LeftArm': Ry(70), 'LeftForeArm': Rz(-40)}),
}

# cena de render (Workbench: rápido e fiel à malha)
sc.render.engine = 'BLENDER_WORKBENCH'
sh = sc.display.shading
sh.light = 'STUDIO'; sh.color_type = 'TEXTURE'; sh.show_cavity = False; sh.show_backface_culling = False
sc.display.render_aa = '8'
sc.world = bpy.data.worlds.new('w'); sc.world.color = (0.32, 0.33, 0.36)
sc.view_settings.view_transform = 'Standard'
sc.render.resolution_x = 420; sc.render.resolution_y = 600; sc.render.film_transparent = False
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = 'ORTHO'
def shoot(path, yaw=0.0, scale=1.12, cz=None):
    cam.data.ortho_scale = scale * H
    a = math.radians(yaw); d = 4 * H
    cz = 0.5 * H if cz is None else cz
    cam.location = (math.sin(a) * d, -math.cos(a) * d, cz)
    cam.rotation_euler = (math.radians(90), 0, a)
    sc.render.filepath = path; bpy.ops.render.render(write_still=True)
    return path
def sheet(paths, cols, out):
    ims = [bpy.data.images.load(p) for p in paths]
    w_, h_ = ims[0].size; rows = (len(ims) + cols - 1) // cols
    big = np.full((rows * h_, cols * w_, 4), 1.0, dtype=np.float32); big[:, :, :3] = 0.2
    for k, im in enumerate(ims):
        a = np.empty(w_ * h_ * 4, dtype=np.float32); im.pixels.foreach_get(a); a = a.reshape(h_, w_, 4)
        r, c = k // cols, k % cols
        big[(rows - 1 - r) * h_:(rows - r) * h_, c * w_:(c + 1) * w_] = a
    o = bpy.data.images.new('sheet', cols * w_, rows * h_); o.pixels.foreach_set(big.ravel())
    o.filepath_raw = out; o.file_format = 'PNG'; o.save()
    for im in ims: bpy.data.images.remove(im)
    bpy.data.images.remove(o)
    for p in paths:
        try: os.remove(p)
        except OSError: pass
    return out
TMP = os.path.join(PROOFS, '_tmp_' + NID); os.makedirs(TMP, exist_ok=True)
clear_pose()
shots = [shoot(os.path.join(TMP, 't0.png'), 0), shoot(os.path.join(TMP, 't1.png'), 90), shoot(os.path.join(TMP, 't2.png'), 180)]
for k, D in POSES.items():
    set_pose(D)
    shots.append(shoot(os.path.join(TMP, k + '_a.png'), 0)); shots.append(shoot(os.path.join(TMP, k + '_b.png'), 55))
    shots.append(shoot(os.path.join(TMP, k + '_c.png'), 90))
clear_pose()
proof1 = sheet(shots, 3, os.path.join(PROOFS, NID + '_poses.png'))
log('prova', proof1, '(linha 1: pose T frente/lado/costas; 2: braço 70°+cotovelo; 3: corrida; 4: torção+braço erguido)')
# closes de mão/ombro na pose de braço abaixado e de cabeça na torção
set_pose(POSES['braco70']); c1 = shoot(os.path.join(TMP, 'z1.png'), 20, 0.55, 0.55 * H)
set_pose(POSES['torcao']); c2 = shoot(os.path.join(TMP, 'z2.png'), 30, 0.45, 0.8 * H)
set_pose(POSES['corrida']); c3 = shoot(os.path.join(TMP, 'z3.png'), 70, 0.55, 0.3 * H)
clear_pose()
proofz = sheet([c1, c2, c3], 3, os.path.join(PROOFS, NID + '_closes.png'))
# máscara
mc = me.color_attributes.new('maskview', 'BYTE_COLOR', 'POINT')
pal = np.array([[0.2, 0.45, 1.0], [0.1, 0.85, 0.15], [1.0, 0.62, 0.48], [0.55, 0.55, 0.55]])
vc = MASK @ pal
if os.environ.get('R482_DEBUG_LEGSKIN') and SKIRT: vc = np.where(legskin[:, None] > 0.5, [[1, 0, 0]], vc)
mc.data.foreach_set('color', np.c_[vc, np.ones(n)].astype(np.float32).ravel())
me.color_attributes.active_color = mc
sh.color_type = 'VERTEX'
m1 = [shoot(os.path.join(TMP, 'm0.png'), 0), shoot(os.path.join(TMP, 'm1.png'), 90), shoot(os.path.join(TMP, 'm2.png'), 180)]
proofm = sheet(m1, 3, os.path.join(PROOFS, NID + '_mascara.png'))
sh.color_type = 'TEXTURE'
me.color_attributes.remove(mc)
log('prova máscara (azul roupa, verde cabelo, salmão pele, cinza detalhe)', proofm)

# clipes reais do banco (retarget por delta de pose T, igual a setup155/animate do jogo)
if ANIM_PROOF:
    restK = {b: RW[P + b].to_quaternion() for b in DRIVEN}
    kayH = RW[P + 'Hips'].translation.y
    hipH = REST['Hips'].translation.z
    ratio = hipH / kayH
    frames = []
    WIN = {'golpe1': (0, 0.7)}
    for clip, fr in (('idle', (0.0, 0.33, 0.66)), ('correr', (0.0, 0.25, 0.5, 0.75)), ('golpe1', (0.0, 0.3, 0.6, 1.0))):
        if clip not in ref.anims: log('clipe ausente', clip); continue
        dur = ref.duration(clip); w0, w1 = WIN.get(clip, (0, 1))
        for f in fr:
            t = dur * (w0 + (w1 - w0) * f)
            KW = ref.world(clip, t)
            D = {}
            for b in DRIVEN:
                dg = KW[P + b].to_quaternion() @ restK[b].inverted()
                D[b] = (Ci @ dg.to_matrix() @ C).to_quaternion()
            hp = (KW[P + 'Hips'].translation.y - RW[P + 'Hips'].translation.y) * ratio
            set_pose(D, hp)
            frames.append(shoot(os.path.join(TMP, '%s_%02d.png' % (clip, len(frames))), 35))
    def clip_pose(clip, f):
        KW = ref.world(clip, ref.duration(clip) * f); D = {}
        for b in DRIVEN:
            D[b] = (Ci @ (KW[P + b].to_quaternion() @ restK[b].inverted()).to_matrix() @ C).to_quaternion()
        set_pose(D, (KW[P + 'Hips'].translation.y - RW[P + 'Hips'].translation.y) * ratio)
    cl = []
    for f, yaw in ((0.25, 0), (0.25, 40), (0.75, 0), (0.75, -40)):
        clip_pose('correr', f); cl.append(shoot(os.path.join(TMP, 'cc%d.png' % len(cl)), yaw, 0.6, 0.32 * H))
    clip_pose('golpe1', 0.42); cl.append(shoot(os.path.join(TMP, 'cc%d.png' % len(cl)), 35, 0.6, 0.62 * H))
    clip_pose('golpe1', 0.42); cl.append(shoot(os.path.join(TMP, 'cc%d.png' % len(cl)), 35, 0.6, 0.3 * H))
    clear_pose()
    sheet(cl, 3, os.path.join(PROOFS, NID + '_clipes_closes.png'))
    proofa = sheet(frames, 4, os.path.join(PROOFS, NID + '_clipes.png'))
    log('prova clipes (linhas: idle x3, correr x4, golpe1 x4, vista 3/4)', proofa)
try: os.rmdir(TMP)
except OSError: pass
json.dump(dict(CHECK, landmarks={k: [round(c, 4) for c in L[k]] for k in NAMES}),
          open(os.path.join(PROOFS, NID + '_check.json'), 'w'), indent=1)
log('fim em %.1fs' % (time.time() - T0))
