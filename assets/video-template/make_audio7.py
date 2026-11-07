"""Episode 7 audio: 'Which shape is the tune?' — six notes in C major, 4/4, 120 bpm: C D E G E C (up, up, up… then home).
  A (Basso): straight up.  B (answer): up, then back down to where it started.  C: up, then down only halfway (C D E G E D).
The first three notes are the same in all three shapes; B and C only differ on the very last note.
Left hand: held chords only, so every onset you hear is the tune.
Outputs public/audio/ep7_question.wav, ep7_ending.wav (same tune, last note rings), ep7_question.mid
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_audio as m
m.BPM = 120; m.BEAT = 60 / m.BPM
C3, E3, G3 = 48, 52, 55
C5, D5, E5, G5 = 72, 74, 76, 79
MEL = [(0, 1, C5, 88), (1, 1, D5, 84), (2, 1, E5, 88), (3, 1, G5, 98), (4, 1, E5, 88), (5, 2, C5, 90)]

def build(ring):
    notes = []
    for k, (s, l, p, v) in enumerate(MEL):
        last = k == len(MEL) - 1
        notes.append((s, l * 0.92 if not last else l + ring, p, v))
    for p in (C3, E3, G3): notes.append((0, 3.9, p, 46))
    for p in (C3, E3, G3): notes.append((4, 3 + ring, p, 48))
    return notes

full = build(0.8); m.notes = full
m.write_wav("ep7_question.wav", m.render_piano(full, tail=0.6))
m.write_wav("ep7_ending.wav", m.render_piano(build(4.5), tail=0.6))
m.write_midi(); os.replace(os.path.join(m.OUT, "question.mid"), os.path.join(m.OUT, "ep7_question.mid"))
import importlib; importlib.reload(m); m.write_midi()
print("ok")
