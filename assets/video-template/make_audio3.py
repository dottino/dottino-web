"""Episode 3 audio: 'Which rhythm: A, B or C?' — 2 bars in 4/4 (C major, 104 bpm), played with rhythm C.
  A: | q q e e q | q q h |      B: | q e e q q | q q h |      C (answer): | q q e e q | q q q q |
Basso hears the first two beats (A and C still match, B already differs) and shouts "It's A!".
The only difference between A and C is the end of bar 2: C has one more note (beat 4).
Outputs public/audio/ep3_question.wav (both bars), ep3_ending.wav (bar 2 again, last note rings), ep3_question.mid
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_audio as m

m.BPM = 104; m.BEAT = 60 / m.BPM
C3, E3, G3, G2, F3, B3, C4, E4 = 48, 52, 55, 43, 53, 59, 60, 64
C5, D5, E5, F5, G5 = 72, 74, 76, 77, 79
# rhythm C with a simple tune: bar 1 C E G-F E, bar 2 D F E C
BAR1 = [(0, 1, C5), (1, 1, E5), (2, .5, G5), (2.5, .5, F5), (3, 1, E5)]
BAR2 = [(0, 1, D5), (1, 1, F5), (2, 1, E5), (3, 1, C5)]

def build(bars, ring=0.0):
    notes = []
    for i, bar in enumerate(bars):
        b0 = i * 4
        mel = BAR1 if bar == 1 else BAR2
        for k, (s, l, p) in enumerate(mel):
            last = bar == 2 and k == len(mel) - 1
            notes.append((b0 + s, (l * 0.9) if not last else l + ring, p, 100 if s in (0, 2) else 88))
        # left hand: held chords only, so every onset you hear belongs to the melody rhythm
        if bar == 1:
            for p in (C3, E3, G3): notes.append((b0, 3.9, p, 50))
        else:
            for p in (G2, F3, B3): notes.append((b0, 2.9, p, 50))
            for p in (C3, E3, G3): notes.append((b0 + 3, 1 + ring, p, 54))
    return notes

full = build([1, 2], ring=1.2); m.notes = full
m.write_wav("ep3_question.wav", m.render_piano(full, tail=0.8))
end = build([2], ring=5.0)   # bar 2 again for "Pause. Listen. Check."; the last C rings into the outro (no silence)
m.write_wav("ep3_ending.wav", m.render_piano(end, tail=0.6))
m.write_midi(); os.replace(os.path.join(m.OUT, "question.mid"), os.path.join(m.OUT, "ep3_question.mid"))
import importlib; importlib.reload(m); m.write_midi()   # restore ep1 midi
# "correct!" chime for the win moment: two quick bright bell notes in C major (G6 then C7), replaces win3m
import numpy as np
def bell(f, dur=0.55):
    n = int(dur * m.SR); t = np.arange(n) / m.SR
    e = np.exp(-t / 0.16) * np.minimum(1, t / 0.003)
    return (np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*2*f*t) * np.exp(-t/0.06) + 0.15*np.sin(2*np.pi*3.01*f*t) * np.exp(-t/0.04)) * e
g6, c7 = bell(1567.98), bell(2093.0, 0.8)
off = int(0.11 * m.SR); out = np.zeros(off + len(c7)); out[:len(g6)] += g6 * 0.8; out[off:off+len(c7)] += c7
m.write_wav("sfx_correct.wav", out / np.abs(out).max() * 32767 * 0.7)
print("ok")
