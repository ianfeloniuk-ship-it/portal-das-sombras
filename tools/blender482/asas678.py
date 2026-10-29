# v678 (Ian: asas do vampiro com ossos próprios): o rig automático (rig_humanoid669.py) tomou a asa pelo braço — o
# antebraço e a mão ficaram dentro da asa e o braço de verdade seguia de longe. Este passo corrige um GLB já rigado:
#  1. separa os vértices do braço (para a frente) dos da asa (para trás e para fora), lado a lado;
#  2. muda o cotovelo e o pulso para o braço de verdade (a rotação dos ossos fica a mesma: o banco do Mixamo continua valendo);
#  3. cria 4 ossos por asa (asa_l_0..3 / asa_r_0..3) presos no peito (Spine2), pesados ao longo da asa.
# Uso: blender -b --python asas678.py -- in.glb out.glb [provas.png]
import bpy, sys, numpy as np
from mathutils import Vector, Matrix
a = sys.argv[sys.argv.index('--') + 1:]
SRC, OUT = a[0], a[1]; PROOF = a[2] if len(a) > 2 else None
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
for o in [o for o in bpy.data.objects if o.type == 'MESH' and o.name.startswith('Icosphere')]: bpy.data.objects.remove(o)
arm = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]
ob = [o for o in bpy.data.objects if o.type == 'MESH'][0]
me = ob.data; n = len(me.vertices)
P = 'mixamorig:'
co = np.array([ob.matrix_world @ v.co for v in me.vertices])
X, Y, Z = co[:, 0], co[:, 1], co[:, 2]
gi = {g.name: g.index for g in ob.vertex_groups}
W = np.zeros((n, len(gi)))
for v in me.vertices:
    for g in v.groups: W[v.index, g.group] = g.weight
dom = W.argmax(1)
E = np.array([e.vertices[:] for e in me.edges])
inv = arm.matrix_world.inverted()
def head(b): return np.array(arm.matrix_world @ arm.data.bones[P + b].head_local)
H = float(Z.max() - Z.min())
NEW = {}
for side, sx, S in (('l', 1, 'Left'), ('r', -1, 'Right')):
    J = head(S + 'Arm'); ax = sx * X
    limb = {gi[P + S + k] for k in ('Arm', 'ForeArm', 'Hand', 'Shoulder') if P + S + k in gi}
    cand = (ax > abs(J[0]) + 0.02 * H) & (np.isin(dom, list(limb)) | ((ax > abs(J[0]) + 0.08 * H) & (Z > head('Hips')[2])))  # a ponta de baixo da asa desce abaixo do quadril e era do antebraço
    # o braço vai para a frente (Y menor); a asa fica atrás e se abre para o lado
    yline = J[1] - 0.02 * H - 0.25 * (ax - abs(J[0]))
    armv = cand & (Y < yline)
    # vizinhança: cada ponto segue a maioria dos vizinhos (tira pontas soltas que esticavam em riscos)
    for _ in range(6):
        cnt = np.zeros(n); tot = np.zeros(n)
        np.add.at(cnt, E[:, 0], armv[E[:, 1]]); np.add.at(cnt, E[:, 1], armv[E[:, 0]])
        np.add.at(tot, E[:, 0], cand[E[:, 1]]); np.add.at(tot, E[:, 1], cand[E[:, 0]])
        frac = np.where(tot > 0, cnt / np.maximum(tot, 1), armv)
        armv = cand & np.where(tot > 0, frac > .5, armv)
    wing = cand & ~armv
    # braço de verdade: distância ao ombro -> cotovelo e pulso
    d = np.linalg.norm(co - J, axis=1); Lm = float(np.percentile(d[armv], 98))
    def mean_at(m, lo, hi): s_ = m & (d >= lo * Lm) & (d <= hi * Lm); return co[s_].mean(0)
    elbow = mean_at(armv, .42, .52); wrist = mean_at(armv, .80, .88)
    # longe da linha ombro-cotovelo-pulso não é braço (pontas da asa que descem para a frente viravam riscos até o chão)
    def pdist(p, A):
        best = np.full(len(p), 1e9)
        for i in range(len(A) - 1):
            ab = A[i + 1] - A[i]; t = np.clip(((p - A[i]) @ ab) / (ab @ ab), 0, 1); best = np.minimum(best, np.linalg.norm(p - (A[i] + t[:, None] * ab), axis=1))
        return best
    far = pdist(co, [J, elbow, wrist, wrist + (wrist - elbow) * .6]) > 0.075 * H
    print('lado', side, 'tirados do braço (longe da linha):', int((armv & far).sum()))
    armv = armv & ~far
    wing = cand & ~armv
    # asa: raiz nas costas, linha pelo alto da asa (o "osso" da asa de morcego)
    root = np.array([J[0] * 0.6, float(np.percentile(Y[wing], 70)), J[2] + 0.01 * H])
    dw = np.linalg.norm(co - root, axis=1); Lw = float(np.percentile(dw[wing], 99))
    pts = [root]
    for k in range(1, 5):
        s_ = wing & (dw >= (k - .5) / 4 * Lw) & (dw <= (k + .5) / 4 * Lw) if k < 4 else wing & (dw >= .9 * Lw)
        zz = Z[s_]; top = s_ & (Z >= np.percentile(zz, 60))
        pts.append(co[top].mean(0))
    NEW[side] = dict(armv=armv, wing=wing, J=J, elbow=elbow, wrist=wrist, Lm=Lm, d=d, pts=pts, S=S)
    print('lado', side, 'braço', int(armv.sum()), 'asa', int(wing.sum()), 'cotovelo', elbow.round(3), 'pulso', wrist.round(3))
# ---- ossos
bpy.context.view_layer.objects.active = arm; bpy.ops.object.mode_set(mode='EDIT'); eb = arm.data.edit_bones
def move(name, wpos):
    b = eb[P + name]; h = inv @ Vector(wpos); t = b.tail - b.head; b.head = h; b.tail = h + t
for side, D in NEW.items():
    S = D['S']; move(S + 'ForeArm', D['elbow']); move(S + 'Hand', D['wrist'])
    prev = eb[P + 'Spine2']
    for i in range(4):
        b = eb.new('asa_%s_%d' % (side, i)); b.head = inv @ Vector(D['pts'][i]); b.tail = inv @ Vector(D['pts'][i + 1])
        b.parent = prev; b.use_connect = i > 0; b.use_deform = True; b.roll = 0; prev = b
bpy.ops.object.mode_set(mode='OBJECT')
# ---- pesos
def seg_w(p, A):
    """peso por segmento de uma corrente de pontos: projeção ao longo da corrente, mistura suave entre vizinhos"""
    A = [np.array(x) for x in A]; m = len(A) - 1; best = np.full(len(p), 1e9); par = np.zeros(len(p))
    for i in range(m):
        ab = A[i + 1] - A[i]; t = np.clip(((p - A[i]) @ ab) / (ab @ ab), 0, 1); q = A[i] + t[:, None] * ab
        dd = np.linalg.norm(p - q, axis=1); c = dd < best; best[c] = dd[c]; par[c] = i + t[c]
    w = np.zeros((len(p), m)); u = np.clip(par - 0.5, 0, m - 1); i0 = np.floor(u).astype(int); i1 = np.minimum(i0 + 1, m - 1); f = u - i0
    np.add.at(w, (np.arange(len(p)), i0), 1 - f); np.add.at(w, (np.arange(len(p)), i1), f); return w
for side, D in NEW.items():
    S = D['S']
    names = [P + S + 'Arm', P + S + 'ForeArm', P + S + 'Hand']
    ia = np.where(D['armv'])[0]; wa = seg_w(co[ia], [D['J'], D['elbow'], D['wrist'], D['wrist'] + (D['wrist'] - D['elbow']) * .5])
    iw = np.where(D['wing'])[0]; ww = seg_w(co[iw], D['pts'])
    # raiz da asa divide um pouco com o peito (não descola das costas)
    rootk = np.clip(1 - np.linalg.norm(co[iw] - D['pts'][0], axis=1) / (0.12 * H), 0, 1) * .6
    for idx in np.concatenate([ia, iw]):
        for g in list(me.vertices[idx].groups): ob.vertex_groups[g.group].remove([int(idx)])
    for j, nm in enumerate(names):
        g = ob.vertex_groups.get(nm) or ob.vertex_groups.new(name=nm)
        for k, idx in enumerate(ia):
            if wa[k, j] > .01: g.add([int(idx)], float(wa[k, j]), 'REPLACE')
    sp = ob.vertex_groups.get(P + 'Spine2')
    for j in range(4):
        g = ob.vertex_groups.new(name='asa_%s_%d' % (side, j))
        for k, idx in enumerate(iw):
            v = ww[k, j] * (1 - rootk[k])
            if v > .01: g.add([int(idx)], float(v), 'REPLACE')
    for k, idx in enumerate(iw):
        if rootk[k] > .01: sp.add([int(idx)], float(rootk[k]), 'ADD')
    D['ww'] = ww
# ---- prova: vista de cima e de trás (braço vermelho, asa azul, pontos amarelos)
if PROOF:
    S_ = 600; img = bpy.data.images.new('p', S_ * 2, S_); px = np.zeros((S_, S_ * 2, 4), np.float32); px[..., 3] = 1; px[..., :3] = .1
    def put(a_, b_, off, m, c):
        x = ((co[m, a_] + .7 * H) / (1.4 * H) * S_).astype(int) + off; y = ((co[m, b_] - (co[:, b_].min() if b_ == 2 else -.7 * H)) / (1.4 * H) * S_).astype(int)
        ok = (x >= off) & (x < off + S_) & (y >= 0) & (y < S_); px[y[ok], x[ok], :3] = c
    allm = np.ones(n, bool)
    for off, b_ in ((0, 1), (S_, 2)):
        put(0, b_, off, allm, (.45, .45, .45))
        for D in NEW.values(): put(0, b_, off, D['armv'], (1, .2, .2)); put(0, b_, off, D['wing'], (.3, .5, 1))
    img.pixels = px.ravel(); img.filepath_raw = PROOF; img.file_format = 'PNG'; img.save()
# ---- exportar
bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True); arm.select_set(True); bpy.context.view_layer.objects.active = arm
for p_ in arm.pose.bones: p_.matrix_basis = Matrix()
exp = dict(filepath=OUT, export_format='GLB', use_selection=True, export_animations=False, export_skins=True,
           export_attributes=True, export_image_format='JPEG', export_jpeg_quality=86, export_yup=True,
           export_def_bones=False, export_morph=False, export_extras=False, export_cameras=False, export_lights=False)
bpy.ops.export_scene.gltf(**exp)
print('ok', OUT)
