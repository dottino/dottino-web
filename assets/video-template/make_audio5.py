"""Episode 5 audio: 'Loud, soft, or getting softer?' — 2 bars of 4/4 at 132 bpm (3.6 s), broken chords I–IV–V–I in quavers,
starting forte and fading steadily to pianissimo (a diminuendo). Same notes all the way: only the volume changes.
Outputs public/audio/ep5_question.wav, ep5_ending.wav (same phrase again, last chord rings), ep5_question.mid,
and src/ep5_env.json (loudness per video frame of the ending, for the volume line drawn during the replay).
"""
import os, sys, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_audio as m
m.BPM = 132; m.BEAT = 60 / m.BPM
C3, F3, G2, C4 = 48, 53, 43, 60
PAT = {'I': [72, 76, 79, 76], 'IV': [72, 77, 81, 77], 'V': [71, 74, 79, 74]}
BASS = {'I': (C3,), 'IV': (F3,), 'V': (G2,)}
CHORDS = ['I', 'IV', 'V']   # half a bar each (bar 1 + half of bar 2), then the final chord

def build(ring):
    notes, n, total = [], 0, len(CHORDS) * 4 - 1
    for k, ch in enumerate(CHORDS):
        for j, p in enumerate(PAT[ch]):
            t = k * 2 + j * 0.5
            v = int(round(118 - (118 - 26) * (n / total)))   # steady fade from forte to pianissimo
            notes.append((t, 0.45, p, v)); n += 1
        for b in BASS[ch]: notes.append((k * 2, 1.9, b, int(round(100 - 70 * (k / (len(CHORDS) - 1))))))
    for p in (60, 64, 67, 72): notes.append((6, 2 + ring, p, 24))   # final C chord, very soft
    notes.append((6, 2 + ring, C3, 26))
    return notes

full = build(0.8); m.notes = full
m.write_wav("ep5_question.wav", m.render_piano(full, tail=0.6))
end = build(5.0); a = m.render_piano(end, tail=0.6); m.write_wav("ep5_ending.wav", a)
# loudness envelope per frame (30 fps), normalised to the loudest frame
mono = a.mean(1) if a.ndim == 2 else a; hop = m.SR // 30
env = [float(np.sqrt(np.mean(mono[i:i + hop] ** 2))) for i in range(0, len(mono) - hop, hop)]
mx = max(env); env = [round(e / mx, 3) for e in env]
json.dump(env, open(os.path.join(os.path.dirname(__file__), 'src', 'ep5_env.json'), 'w'))
m.write_midi(); os.replace(os.path.join(m.OUT, "question.mid"), os.path.join(m.OUT, "ep5_question.mid"))
import importlib; importlib.reload(m); m.write_midi()
print("ok", len(env), [env[i] for i in range(0, 110, 10)])
