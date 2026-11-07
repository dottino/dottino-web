"""Episode 8 audio: three rounds of 'Which rhythm: A or B?' (4/4, one bar each, 132 bpm), getting harder.
  Round 1 (Grade 3 level): clicks all the way through.   A = q q h          B (answer) = q q q q
  Round 2 (Grade 4 level): count-in only.                A (answer) = q q e e q    B = q e e q q
  Round 3 (Grade 5 level): no help at all.               A = q q q e e      B (answer) = q q q. e   (dotted crotchet + quaver at the end)
Each round: rN.wav (as played in the question) and rN_replay.wav (the answer again, no clicks, for the reveal).
"""
import os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_audio as m
m.BPM = 132; m.BEAT = 60 / m.BPM
C3, E3, G3 = 48, 52, 55
TUNE = [72, 74, 76, 74, 72, 79]  # C D E D C G, used in order for the notes of each rhythm
R = {1: [1, 1, 1, 1], 2: [1, 1, 0.5, 0.5, 1], 3: [1, 1, 1.5, 0.5]}
COUNT_IN = {1: True, 2: True, 3: False}
CLICKS_DURING = {1: True, 2: False, 3: False}

def bar(durs, t0, ring):
    notes, t = [], t0
    for i, d in enumerate(durs):
        last = i == len(durs) - 1
        notes.append((t, d * 0.9 if not last else d + ring, TUNE[i % len(TUNE)], 100 if t % 1 == 0 and (t - t0) % 2 == 0 else 86))
        t += d
    for p in (C3, E3, G3): notes.append((t0, 4 + ring, p, 44))
    return notes

def click(f, amp):
    n = int(0.09 * m.SR); t = np.arange(n) / m.SR
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2.7 * f * t)) * np.exp(-t / 0.018) * np.minimum(1, t / 0.0008) * amp

for r in (1, 2, 3):
    t0 = 4 if COUNT_IN[r] else 0
    notes = bar(R[r], t0, 0.6)
    a = m.render_piano(notes, tail=0.5)
    pk = np.abs(a).max()
    beats = (list(range(4)) if COUNT_IN[r] else []) + ([t0 + b for b in range(4)] if CLICKS_DURING[r] else [])
    for b in beats:
        c = click(1750 if b % 4 == 0 else 1150, pk * (0.5 if b % 4 == 0 else 0.3))
        i = int(b * m.BEAT * m.SR)
        if i + len(c) > len(a): a = np.concatenate([a, np.zeros((i + len(c) - len(a), 2))])
        a[i:i + len(c)] += c[:, None]
    m.write_wav(f"ep8_r{r}.wav", a)
    m.write_wav(f"ep8_r{r}_replay.wav", m.render_piano(bar(R[r], 0, 0.8 if r < 3 else 2.6), tail=0.5))
print("ok")
