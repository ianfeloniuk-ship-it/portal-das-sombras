"""Two tactical choices per class; stable IDs and names preserve existing saves."""
def expand(catalog):
    def add(ci,name,effect,brief,**kw):
        rows=catalog[str(ci)]
        d=dict(n=name,effect=effect,brief260=brief,cd=12,mp=18,pow=0,col=rows[0]['col'],radius=4,range=12,duration=4,kit111=True,t='kit111',rare103=ci>=12,sourceClass=ci,skillId=f'{ci}:{len(rows)}',expansion260=True,unlock260=15 if len(rows)==8 else 60,research260=3 if len(rows)==8 else 5)
        d.update(kw);rows.append(d)
    add(0,'Corte Crescente','cone','Corta os inimigos à frente em um leque de 5 m.',pow=2.2,range=5,mp=20,cd=9)
    add(0,'Quebra-Passo','slow','Reduz a velocidade de um alvo por 3s.',single=True,range=4,duration=3,mp=12,cd=10)
    add(1,'Ferida Profunda','burn','Fere um alvo, causando dano ao longo de 4s.',pow=2.4,range=3,duration=4,mp=18,cd=10)
    add(1,'Faca de Interrupção','interrupt','Interrompe o ataque de um inimigo comum a até 10 m.',single=True,range=10,mp=16,cd=12)
    add(2,'Reserva de Guarda','ward','Ganha um escudo de 15% da vida máxima por 4s.',scope='self',amount=.15,duration=4,mp=22,cd=18)
    add(2,'Rompante','line','Golpeia em linha os inimigos a até 6 m.',pow=2,range=6,mp=18,cd=10)
    add(4,'Leque de Flechas','fan','Dispara três flechas que atravessam inimigos em leque.',pow=3,mp=20,cd=10)
    add(4,'Olho de Caçador','reveal','Marca no mapa os inimigos a até 24 m por 8s.',range=24,duration=8,mp=12,cd=18)
    add(5,'Censura','weaken','Reduz em 20% o dano de um alvo por 4s.',single=True,amount=.2,duration=4,mp=18,cd=12)
    add(5,'Lança Solar','line','Uma lança de luz atinge os inimigos em uma linha de 10 m.',pow=2.4,range=10,mp=20,cd=10)
    add(6,'Uivo Espiritual','cone','Uma onda espiritual atinge os inimigos à frente em 6 m.',pow=2,range=6,mp=16,cd=10)
    add(6,'Instinto de Matilha','guard','Suas invocações próximas recebem 25% menos dano por 5s.',scope='summons',amount=.25,radius=8,duration=5,mp=24,cd=18)
    add(7,'Jaula de Ossos','root','Prende um inimigo comum por 2s.',single=True,duration=2,mp=20,cd=14)
    add(7,'Maldição da Fraqueza','weaken','Reduz em 20% o dano dos inimigos em 4 m por 4s.',amount=.2,radius=4,ground=True,duration=4,mp=24,cd=16)
    add(8,'Brasa Latente','pulses','Após 1s, explode na área marcada de 3 m.',pow=2.8,pulses=1,delay=1,radius=3,ground=True,mp=20,cd=10)
    add(8,'Manto de Cinzas','ward','Ganha um escudo de 15% da vida máxima por 4s.',scope='self',amount=.15,duration=4,mp=24,cd=18)
    add(9,'Fratura Glacial','conditional260','Atinge um alvo; causa 50% mais dano se ele estiver lento ou preso.',single=True,pow=2,condition260='slow',mp=20,cd=10)
    add(9,'Névoa Fria','blind','Reduz em 25% o dano dos inimigos ao seu redor por 3s.',radius=4,duration=3,mp=22,cd=16)
    add(10,'Pedra Suspensa','pulses','Após 1,2s, uma rocha cai na área marcada de 3 m.',pow=3,pulses=1,delay=1.2,radius=3,ground=True,mp=22,cd=12)
    add(10,'Casca de Cristal','ward','Ganha um escudo de 20% da vida máxima por 4s.',scope='self',amount=.2,duration=4,mp=24,cd=20)
    add(11,'Agulha Elétrica','bolt','Lança um projétil elétrico na direção da mira.',pow=1.8,mp=12,cd=5)
    add(11,'Clarão','blind','Reduz em 25% o dano dos inimigos ao seu redor por 3s.',radius=4,duration=3,mp=22,cd=16)
    add(12,'Segundo Perdido','slowzone','Cria uma área de 3 m que desacelera inimigos comuns por 4s.',radius=3,duration=4,mp=22,cd=14)
    add(12,'Impacto Adiado','pulses','Após 1s, um pulso atinge a área marcada de 3 m.',pow=2.6,pulses=1,delay=1,radius=3,ground=True,mp=22,cd=12)
    add(13,'Agulha de Fenda','target','Uma pequena fenda atinge um alvo a até 10 m.',single=True,pow=2.2,range=10,mp=18,cd=8)
    add(13,'Colapso Local','pulses','Após 1,2s, uma fenda implode na área marcada de 3 m.',pow=2.8,pulses=1,delay=1.2,radius=3,ground=True,mp=24,cd=14)
    add(14,'Alívio Compartilhado','heal','Cura 20% da vida máxima de um aliado na mira.',scope='ally',amount=.2,mp=24,cd=18)
    add(14,'Círculo de Amparo','cleanse','Remove lentidão, atordoamento e sangramento do grupo próximo.',scope='group',radius=6,mp=22,cd=18)
    add(15,'Garras em Arco','cone','Golpeia os inimigos à frente em um leque de 4 m.',pow=2.2,range=4,mp=18,cd=9)
    add(15,'Muda de Pele','cleanse','Remove sua lentidão, atordoamento e sangramento.',scope='self',mp=20,cd=18)
    add(16,'Lança Rúnica','line','Dispara uma linha de energia que atinge inimigos em 10 m.',pow=2.2,range=10,mp=18,cd=10)
    add(16,'Placas de Emergência','guard','Recebe 25% menos dano por 4s.',scope='self',amount=.25,duration=4,mp=22,cd=18)
    add(17,'Meia-Lua Espectral','cone','Corta os inimigos à frente em um leque de 4 m.',pow=2.2,range=4,mp=18,cd=10)
    add(17,'Corpo Etéreo','evade','Fica invulnerável por 0,5s.',duration=.5,mp=20,cd=16)
    add(18,'Raio Retardado','pulses','Após 1s, um raio atinge a área marcada de 3 m.',pow=2.8,pulses=1,delay=1,radius=3,ground=True,mp=0,energy=2,cd=12)
    add(18,'Olho da Tempestade','guard','Recebe 25% menos dano por 4s.',scope='self',amount=.25,duration=4,mp=0,energy=2,cd=18)
    add(19,'Instante Fatal','conditional260','Atinge um alvo; causa 50% mais dano durante a preparação do ataque dele.',single=True,pow=2,condition260='windup',mp=20,cd=10)
    add(19,'Futuro Resguardado','ward','Concede ao grupo em 6 m um escudo de 10% da vida máxima por 4s.',scope='group',radius=6,amount=.1,duration=4,mp=28,cd=20)
    add(20,'Fome Silenciosa','weaken','Reduz em 20% o dano de um alvo por 4s.',single=True,amount=.2,duration=4,mp=18,cd=12)
    add(20,'Estrela Oca','pulses','Após 1s, o vazio explode na área marcada de 3 m.',pow=2.6,pulses=1,delay=1,radius=3,ground=True,mp=22,cd=12)
    # Fury is a cost now, not a second hidden payment or damage multiplier.
    for i in [1,2,5]: catalog['0'][i]['mp']=0
    catalog['0'][2].update(effect='rally260',cd=14,brief260='Ganha 35 de Fúria. Não causa dano.')
    for ci,rows in catalog.items():
        for s in rows:
            s['resource260']='fury' if ci=='0' else 'vigor' if ci in ('1','2','4') else 'mana'
    assert len(catalog)==20 and all(len(v)==10 for v in catalog.values())
    return catalog
