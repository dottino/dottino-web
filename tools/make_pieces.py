# Builds pieces.js (repertoire excerpts) from Mutopia Project MIDI files.  python3 tools/make_pieces.py <midi dir>
import mido, json, glob, sys, os
D = sys.argv[1] if len(sys.argv) > 1 else '.'
META = {
 'b02': ('Burgmüller', 'Arabesque', 'Op.100 No.2', 'energetic', ['fast','minor','detached'], 'staccato', 'f'),
 'b03': ('Burgmüller', 'Pastorale', 'Op.100 No.3', 'calm', ['smooth','quiet','major'], 'legato', 'p'),
 'b05': ('Burgmüller', 'Innocence', 'Op.100 No.5', 'dance', ['lilt','smooth','major'], 'legato', 'mf'),
 'b07': ('Burgmüller', 'Le Courant limpide', 'Op.100 No.7', 'flowing', ['fast','smooth','quiet'], 'legato', 'p'),
 'b09': ('Burgmüller', 'La Chasse', 'Op.100 No.9', 'bold', ['fast','loud','major'], 'staccato', 'f'),
 'b12': ('Burgmüller', "L'Adieu", 'Op.100 No.12', 'sad', ['minor','smooth','quiet'], 'legato', 'p'),
 'b16': ('Burgmüller', 'Douce Plainte', 'Op.100 No.16', 'sad', ['minor','slow','smooth'], 'legato', 'p'),
 'b17': ('Burgmüller', 'La Babillarde', 'Op.100 No.17', 'cheerful', ['fast','major','detached'], 'staccato', 'mf'),
 's01': ('Schumann', 'Melodie', 'Op.68 No.1', 'calm', ['slow','smooth','quiet'], 'legato', 'p'),
 's02': ('Schumann', 'Soldatenmarsch', 'Op.68 No.2', 'march', ['loud','steady','detached'], 'staccato', 'f'),
 's03': ('Schumann', 'Trällerliedchen (Humming Song)', 'Op.68 No.3', 'calm', ['smooth','quiet','major'], 'legato', 'p'),
 's04': ('Schumann', 'Choral', 'Op.68 No.4', 'solemn', ['slow','smooth','major'], 'legato', 'mf'),
 's05': ('Schumann', 'Stückchen', 'Op.68 No.5', 'cheerful', ['major','detached','quiet'], 'staccato', 'mf'),
 's06': ('Schumann', 'Armes Waisenkind', 'Op.68 No.6', 'sad', ['minor','slow','smooth'], 'legato', 'p'),
 's08': ('Schumann', 'Wilder Reiter', 'Op.68 No.8', 'wild', ['fast','minor','loud'], 'staccato', 'f'),
 's10': ('Schumann', 'Fröhlicher Landmann', 'Op.68 No.10', 'cheerful', ['major','loud','fast'], 'legato', 'f'),
 's14': ('Schumann', 'Kleine Studie', 'Op.68 No.14', 'flowing', ['smooth','quiet','major'], 'legato', 'p'),
 't01': ('Tchaikovsky', 'Morning Prayer', 'Op.39 No.1', 'solemn', ['slow','smooth','quiet'], 'legato', 'p'),
 't05': ('Tchaikovsky', 'March of the Wooden Soldiers', 'Op.39 No.5', 'march', ['steady','detached','major'], 'staccato', 'mf'),
 't16': ('Tchaikovsky', 'Old French Song', 'Op.39 No.16', 'sad', ['minor','slow','smooth'], 'legato', 'p'),
}
MINOR = {'b02','b12','b16','s06','s08','t16'}
out = []
for f in sorted(glob.glob(os.path.join(D, '*.mid'))):
    pid = os.path.basename(f)[:-4]; m = mido.MidiFile(f); tpb = m.ticks_per_beat
    ts = (4, 4); tempo = 500000
    for tr in m.tracks:
        for msg in tr:
            if msg.type == 'time_signature': ts = (msg.numerator, msg.denominator); break
    for tr in m.tracks:
        for msg in tr:
            if msg.type == 'set_tempo': tempo = msg.tempo; break
    trs = []
    for tr in m.tracks:
        t = 0; on = {}; notes = []
        for msg in tr:
            t += msg.time
            if msg.type == 'note_on' and msg.velocity > 0: on.setdefault(msg.note, []).append((t, msg.velocity))
            elif msg.type in ('note_off', 'note_on') and on.get(msg.note):
                s, v = on[msg.note].pop(0); notes.append((s / tpb, (t - s) / tpb, msg.note, v))
        if notes: trs.append(notes)
    rh, lh = trs[0], (trs[1] if len(trs) > 1 else [])
    num, den = ts
    compound = den == 8 and num in (6, 9, 12)
    unit = 1.5 if compound else (0.5 if den == 8 else 4 / den)
    k = num // 3 if compound else num
    barq = num * 4 / den
    B = 60 / (60e6 / tempo) * unit
    nb = 16 if barq <= 1.5 else 8 if barq >= 3 else 12
    while nb > 4 and nb * barq / unit * B > 16.5: nb -= 1
    if nb % 2 and nb > 4: nb -= 1
    endq = nb * barq
    ev = []
    for notes, mel in ((rh, 1), (lh, 0)):
        for s, d, n, v in notes:
            if s >= endq - 1e-6: continue
            ev.append({'t': round(s / unit, 4), 'd': round(min(d, endq - s) / unit, 4), 'm': n, 'v': round(v / 80, 2), 'mel': mel})
    ev.sort(key=lambda e: (e['t'], -e['m']))
    mel = [e for e in ev if e['mel'] and e['t'] < 2 * k]
    ons = sorted(set(e['t'] for e in mel)); iois = [b - a for a, b in zip(ons, ons[1:])]
    cii = (not compound) and den == 4 and k in (2, 3, 4) and 4 <= len(ons) <= 11 and (min(iois) if iois else 0) >= 0.5 - 1e-6
    mt = META[pid]
    out.append({'id': pid, 'composer': mt[0], 'title': mt[1], 'work': mt[2], 'char': mt[3], 'why': mt[4], 'art': mt[5], 'dyn': mt[6],
                'minor': pid in MINOR, 'k': k, 'B': round(B, 4), 'T': round(endq / unit, 4), 'compound': compound, 'cii': cii, 'ts': f'{num}/{den}', 'ev': ev})
    print(pid, mt[1], f'{num}/{den}', 'bars', nb, 'notes', len(ev), 'cii', cii, 'dur %.1fs' % (endq / unit * B))
js = ('/* Dottino repertoire excerpts. Note data from Mutopia Project editions (https://www.mutopiaproject.org).\n'
      '   Burgmüller Op.100 and Tchaikovsky Op.39: Public Domain. Schumann Op.68: CC BY-SA 2.5 / 3.0 (Mutopia Project contributors);\n'
      '   this data file is shared under CC BY-SA 3.0. Built by tools/make_pieces.py. */\n'
      'window.PIECES = ' + json.dumps(out, separators=(',', ':'), ensure_ascii=False) + ';\n')
open(os.path.join(os.path.dirname(__file__), '..', 'pieces.js'), 'w').write(js)
print(len(js), 'bytes')
