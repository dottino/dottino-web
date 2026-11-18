import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const SR = 44100;
const SAL_DIR = 'C:/Users/HCT/.gemini/antigravity/scratch/dottino-web/audio/sal';
const OUT_DIR = 'C:/Users/HCT/.gemini/antigravity/scratch/basso-video-studio/public/audio';
const FFMPEG = 'C:/Users/HCT/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';

const NM3 = ['C', 'Ds', 'Fs', 'A'];
const cache = new Map();
function getSample(midi, vel = 9) {
  const base = Math.max(36, Math.min(96, 36 + Math.round((midi - 36) / 3) * 3));
  const key = `${base}:${vel}`;
  if (!cache.has(key)) {
    const name = NM3[((base - 36) / 3) % 4] + (Math.floor(base / 12) - 1) + 'v' + vel + '.mp3';
    const pcm = execFileSync(FFMPEG, ['-v', 'error', '-i', path.join(SAL_DIR, name), '-f', 'f32le', '-ac', '2', '-ar', String(SR), 'pipe:1'], {maxBuffer: 32 * 1024 * 1024});
    cache.set(key, {base, data: new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4)});
  }
  return cache.get(key);
}

function renderPiano(notes, bpm, tail = 0.6) {
  const beat = 60 / bpm;
  const maxT = Math.max(...notes.map(([t, d]) => (t + d) * beat)) + tail;
  const len = Math.ceil(maxT * SR);
  const out = new Float32Array(len * 2);
  for (const [tBeat, dBeat, midi, vel = 88, rel = 0.28] of notes) {
    const samp = getSample(midi, vel < 60 ? 4 : vel < 105 ? 9 : 14);
    const rate = Math.pow(2, (midi - samp.base) / 12);
    const gain = (vel / 127) * 0.75;
    const startIdx = Math.floor(tBeat * beat * SR);
    const durSamples = Math.floor(dBeat * beat * SR);
    const relSamples = Math.floor(rel * SR);
    const total = durSamples + relSamples;
    const srcLen = samp.data.length / 2;
    for (let i = 0; i < total; i++) {
      const dst = startIdx + i;
      if (dst >= len) break;
      const srcPos = i * rate;
      const s0 = Math.floor(srcPos);
      if (s0 + 1 >= srcLen) break;
      const frac = srcPos - s0;
      const env = i < durSamples ? 1 : Math.max(0, 1 - (i - durSamples) / relSamples);
      out[dst * 2] += (samp.data[s0 * 2] * (1 - frac) + samp.data[(s0 + 1) * 2] * frac) * gain * env;
      out[dst * 2 + 1] += (samp.data[s0 * 2 + 1] * (1 - frac) + samp.data[(s0 + 1) * 2 + 1] * frac) * gain * env;
    }
  }
  return out;
}

function writeWav(filename, floatStereo) {
  let pk = 0;
  for (let i = 0; i < floatStereo.length; i++) pk = Math.max(pk, Math.abs(floatStereo[i]));
  const scale = pk > 0.92 ? 0.92 / pk : 1;
  const frames = floatStereo.length / 2;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0); header.writeUInt32LE(36 + frames * 4, 4);
  header.write('WAVE', 8); header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(2, 22);
  header.writeUInt32LE(SR, 24); header.writeUInt32LE(SR * 4, 28); header.writeUInt16LE(4, 32); header.writeUInt16LE(16, 34);
  header.write('data', 36); header.writeUInt32LE(frames * 4, 40);
  const pcm = Buffer.alloc(frames * 4);
  for (let i = 0; i < floatStereo.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, floatStereo[i] * scale)) * 32767), i * 2);
  fs.writeFileSync(path.join(OUT_DIR, filename), Buffer.concat([header, pcm]));
}

// same recipe as #8: 132 bpm, 4-click count-in, soft C-major chord under one bar of melody
const BPM = 116, BEAT = 60 / BPM;
function addClick(buf, tSec, freq, amp) {
  const n = Math.floor(0.09 * SR), start = Math.floor(tSec * SR);
  for (let i = 0; i < n && start + i < buf.length / 2; i++) {
    const t = i / SR;
    const v = (Math.sin(2 * Math.PI * freq * t) + 0.4 * Math.sin(2 * Math.PI * 2.7 * freq * t)) * Math.exp(-t / 0.018) * Math.min(1, t / 0.0008) * amp;
    buf[(start + i) * 2] += v; buf[(start + i) * 2 + 1] += v;
  }
}
const peak = (a) => { let p = 0; for (let i = 0; i < a.length; i++) p = Math.max(p, Math.abs(a[i])); return p; };
// legato: each note held 1.08 beats (overlaps the next); staccato: 0.32 beats
const bar = (pitches, t0, kind, ring) => {
  // R1 help says "one hand": melody only, no chord underneath
  return pitches.map((p, i) => [t0 + i, kind === 'legato' ? (i === pitches.length - 1 ? 1 + ring : 1.08) : 0.32, p, i === 0 ? 96 : 86, kind === 'legato' ? 0.2 : 0.06]);
};

// Round 1 (Grade 3): one hand, E F G A, legato. Answer A.
const R1 = [64, 65, 67, 69];
const q1 = renderPiano(bar(R1, 4, 'legato', 0.6), BPM, 0.5);
const pk1 = peak(q1);
for (const b of [0, 1, 2, 3]) addClick(q1, b * BEAT, b === 0 ? 1750 : 1150, pk1 * (b === 0 ? 0.5 : 0.3));
writeWav('ep9_r1.wav', q1);
writeWav('ep9_r1_replay.wav', renderPiano(bar(R1, 0, 'legato', 0.8), BPM, 0.5));

// Round 2 (Grade 4): G A G E C staccato melody (5 notes across 4 beats: 0.8 beat spacing) over sustained bass
const R2 = [67, 69, 67, 64, 60];
const bar2 = (t0, ring) => {
  const step = 4 / R2.length;
  const notes = R2.map((p, i) => [t0 + i * step, 0.28, p, i === 0 ? 98 : 88, 0.06]);
  for (const p of [48, 52, 55]) notes.push([t0, 1.6, p, 36, 0.4]);
  return notes;
};
const q2 = renderPiano(bar2(4, 0.6), BPM, 0.5);
const pk2 = peak(q2);
for (const b of [0, 1, 2, 3]) addClick(q2, b * BEAT, b === 0 ? 1750 : 1150, pk2 * (b === 0 ? 0.5 : 0.3));
writeWav('ep9_r2.wav', q2);
writeWav('ep9_r2_replay.wav', renderPiano(bar2(0, 0.8), BPM, 0.5));

// Round 3 (Grade 5): no count-in; bouncy staccato left-hand bass (C3 G3 C3 G3) while top tune (E5 D5 C5 D5 E5) is smooth legato
const R3 = [76, 74, 72, 74, 76];
const bar3 = (t0, ring, lhVel = 70, rhBoost = 0) => {
  const step = 4 / R3.length;
  const notes = R3.map((p, i) => [t0 + i * step, i === R3.length - 1 ? step + ring : step * 1.12, p, (i === 0 ? 96 : 88) + rhBoost, 0.2]);
  [48, 55, 48, 55].forEach((p, b) => notes.push([t0 + b, 0.22, p, lhVel, 0.05]));
  return notes;
};
writeWav('ep9_r3.wav', renderPiano(bar3(0, 0.6), BPM, 0.5));
// replay: left hand pushed down to the soft layer (vel < 60), right hand +6, so the smooth tune is what you hear
writeWav('ep9_r3_replay.wav', renderPiano(bar3(0, 2.2, 42, 6), BPM, 0.5));

// sfx: boing, tap, deflate, pop
const boing = new Float32Array(Math.floor(0.35 * SR) * 2);
for (let i = 0; i < boing.length / 2; i++) {
  const t = i / SR, f = 220 + 260 * Math.exp(-t / 0.06) + 40 * Math.sin(2 * Math.PI * 14 * t);
  const v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.12) * 0.5;
  boing[i * 2] = v; boing[i * 2 + 1] = v;
}
writeWav('sfx_boing.wav', boing);
const tap = new Float32Array(Math.floor(0.12 * SR) * 2);
addClick(tap, 0, 900, 0.4);
writeWav('sfx_tap.wav', tap);
const deflate = new Float32Array(Math.floor(0.55 * SR) * 2);
for (let i = 0; i < deflate.length / 2; i++) {
  const t = i / SR, f = 340 * Math.exp(-t / 0.28);
  const v = (Math.sin(2 * Math.PI * f * t) + 0.25 * (Math.random() * 2 - 1)) * Math.exp(-t / 0.22) * 0.42;
  deflate[i * 2] = v; deflate[i * 2 + 1] = v;
}
writeWav('sfx_deflate.wav', deflate);
const pop = new Float32Array(Math.floor(0.1 * SR) * 2);
addClick(pop, 0, 1250, 0.5);
writeWav('sfx_pop.wav', pop);
console.log('Generated all ep9 WAVs + sfx');
