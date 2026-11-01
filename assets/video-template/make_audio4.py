"""Episode 4 audio: 'Same or different?' — a 4-note tune played twice (C major, 4/4, 120 bpm).
  1st: G5 E5 D5 C5      2nd: G5 E5 D5 E5   (only the last note changes: it goes UP a third)
Left hand: a soft held C chord under both, so the harmony gives nothing away.
Outputs public/audio/ep4_question.wav (both), ep4_ending.wav (the 2nd tune again, last note rings), ep4_question.mid
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_audio as m
m.BPM = 120; m.BEAT = 60 / m.BPM
C3, E3, G3, C5, D5, E5, G5 = 48, 52, 55, 72, 74, 76, 79
T1, T2 = [G5, E5, D5, C5], [G5, E5, D5, E5]

def tune(t, b0, ring):
    out = []
    for i, p in enumerate(t):
        last = i == len(t) - 1
        out.append((b0 + i, 0.9 if not last else 1 + ring, p, 98 if i == 0 else 90))
    for p in (C3, E3, G3): out.append((b0, 4 + ring, p, 46))
    return out

full = tune(T1, 0, 0.6) + tune(T2, 5, 1.4); m.notes = full
m.write_wav("ep4_question.wav", m.render_piano(full, tail=0.8))
m.write_wav("ep4_ending.wav", m.render_piano(tune(T2, 0, 5.0), tail=0.6))
m.write_midi(); os.replace(os.path.join(m.OUT, "question.mid"), os.path.join(m.OUT, "ep4_question.mid"))
import importlib; importlib.reload(m); m.write_midi()
print("ok")
