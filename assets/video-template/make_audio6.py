"""Episode 6 audio: 'Where's beat ONE?' — an original tune in 3/4 (C major, 120 bpm) that starts with a one-beat pickup.
  melody:  G4 (pickup, beat 3) | C5 D5 E5 | G5 (dotted half)
  A = G4, B = C5, C = D5, D = E5. Beat ONE is B: that's where the left hand comes in (oom-pah-pah).
Basso hears the first note and shouts "A! The first note is beat ONE!".
Outputs public/audio/ep6_question.wav, ep6_ending.wav (same phrase with count clicks: soft on 2 and 3, strong on ONE), ep6_question.mid
"""
import os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_audio as m

m.BPM = 120; m.BEAT = 60 / m.BPM
C3, E3, G3 = 48, 52, 55
G4, C5, D5, E5, G5 = 67, 72, 74, 76, 79
MEL = [(0, 1, G4, 74), (1, 1, C5, 104), (2, 1, D5, 76), (3, 1, E5, 80), (4, 3, G5, 100)]

def build(ring):
    notes = []
    for k, (s, l, p, v) in enumerate(MEL):
        last = k == len(MEL) - 1
        notes.append((s, (l * 0.92) if not last else l + ring, p, v))
    # left hand only from beat ONE: a clear bass on the strong beat, light chords on 2 and 3; nothing under the pickup
    notes.append((1, 0.9, C3, 112))
    for b in (2, 3):
        for p in (E3, G3): notes.append((b, 0.55, p, 44))
    notes.append((4, 3 + ring, C3, 104))
    for p in (E3, G3): notes.append((4, 3 + ring, p, 50))
    return notes

full = build(0.9); m.notes = full
m.write_wav("ep6_question.wav", m.render_piano(full, tail=0.6))

# ending: the same phrase, with the count: the pickup is "3", then ONE two three | ONE
end = m.render_piano(build(4.5), tail=0.6)
def click(f, dur, amp):
    n = int(dur * m.SR); t = np.arange(n) / m.SR
    e = np.exp(-t / 0.018) * np.minimum(1, t / 0.0008)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2.7 * f * t)) * e * amp
peak = np.abs(end).max()
for b, strong in ((0, False), (1, True), (2, False), (3, False), (4, True)):
    c = click(1750 if strong else 1150, 0.09, peak * (0.55 if strong else 0.26))
    i = int(b * m.BEAT * m.SR); end[i:i + len(c)] += c[:, None]
m.write_wav("ep6_ending.wav", end)
m.write_midi(); os.replace(os.path.join(m.OUT, "question.mid"), os.path.join(m.OUT, "ep6_question.mid"))
import importlib; importlib.reload(m); m.write_midi()   # restore ep1 midi
print("ok", len(full))
