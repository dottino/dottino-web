import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const SR = 44100;
const SAL_DIR = process.env.SAL_DIR ?? 'C:/Users/HCT/.gemini/antigravity/scratch/dottino-web/audio/sal';
const OUT_DIR = process.env.OUT_DIR ?? 'C:/Users/HCT/.gemini/antigravity/scratch/basso-video-studio/public/audio';
const FFMPEG = process.env.FFMPEG ?? 'C:/Users/HCT/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const EP_JSON = process.env.EP_JSON ?? 'C:/Users/HCT/.gemini/antigravity/scratch/basso-video-studio/src/ep11.json';
const DRY = !!process.env.DRY;
const FPS = 30;

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

function renderSec(notes, tail = 0.5) {
  if (DRY) return new Float32Array(2);
  const maxT = Math.max(...notes.map(([t, d]) => t + d)) + tail;
  const len = Math.ceil(maxT * SR);
  const out = new Float32Array(len * 2);
  for (const [startSec, durSec, midi, vel = 88, relSec = 0.22] of notes) {
    const samp = getSample(midi, vel < 60 ? 4 : vel < 105 ? 9 : 14);
    const rate = Math.pow(2, (midi - samp.base) / 12);
    const gain = (vel / 127) * 0.72;
    const startIdx = Math.floor(startSec * SR);
    const durSamples = Math.floor(durSec * SR);
    const relSamples = Math.floor(relSec * SR);
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
  if (DRY) return;
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

const toFrames = (sec) => Math.round(sec * FPS);
const compileBeats = (events, bpm) => {
  const spb = 60 / bpm;
  return events.map(([b, db, p, vel, rel = 0.22]) => [b * spb, Math.max(0.08, db * spb), p, vel, rel]);
};

const RH_MIN = 65;
function balanceLH(events) {
  const lowest = new Map();
  for (const [b, , p] of events) if (p < RH_MIN) lowest.set(b, Math.min(lowest.get(b) ?? 999, p));
  return events.map(([b, db, p, vel, rel]) => (p < RH_MIN ? [b, db, p, (p === lowest.get(b) ? 68 : 61) + (b % 4 === 0 ? 5 : 0), rel] : [b, db, p, vel, rel]));
}

function makeReplay(name, events, bpm, fromBeat, totalBeats, triadBeats, tail = 0.5) {
  const spb = 60 / bpm;
  const ev = events
    .filter(([b]) => b >= fromBeat && b < fromBeat + totalBeats)
    .map(([b, db, p, vel, rel]) => [b - fromBeat, db, p, p < RH_MIN ? Math.max(60, vel - 4) : Math.min(115, vel + 6), rel]);
  writeWav(name, renderSec(compileBeats(ev, bpm), tail));
  return {
    repTriad: triadBeats.map((b) => toFrames(b * spb)),
  };
}

const TIMING = {};

// ============================================================================
// R1 (Grade 3 · C major, 90 BPM · 4 beats = 2.67s + 0.5s tail = 3.17s)
// Single C-major chord voicing -> 1 (C5) - 3 (E5) - 5 (G5) - 1 (C5)
// ============================================================================
const r1Bpm = 90;
const r1Events = [
  [0, 1.0, 72, 92], [1, 1.0, 76, 98], [2, 1.0, 79, 96], [3, 1.2, 72, 94],
  [0, 1.8, 48, 70], [0, 1.8, 55, 62], [0, 1.8, 60, 62],
  [1, 0.9, 64, 62],
  [2, 0.9, 55, 64], [2, 0.9, 60, 62],
  [3, 1.2, 48, 72], [3, 1.2, 55, 64], [3, 1.2, 64, 64],
];
const r1Bal = balanceLH(r1Events);
writeWav('ep11_r1.wav', renderSec(compileBeats(r1Bal, r1Bpm), 0.5));
TIMING[1] = makeReplay('ep11_r1_replay.wav', r1Bal, r1Bpm, 0, 4, [0, 1, 2, 3], 0.5);

// ============================================================================
// R2 (Grade 4 · F major, 72 BPM · 4 beats = 3.33s + 0.5s tail)
// QUESTION = a slow descending "sigh" (5 - 4 - 3 over F: C5 - Bb4 - A4) so the slow, soft, falling shape really pulls the ear toward "sad".
// The open F-C fifth in the left hand has NO third until beat 2, where A3 + A4 arrive together: the major 3rd lands on the strong beat, after the lure.
// REPLAY = the plain F-A-C-F arpeggio (r2Demo), so the ladder shows the 3rd on its own. Same beats, same tempo -> repTriad is unchanged.
// Tender, slow cantabile phrase locked on F MAJOR tonic triad (F - A - C) in LH,
// with the Major 3rd (A4, midi 69) prominently placed on strong beats so it is 100% fair and unmistakable.
// ============================================================================
const r2Bpm = 72;
const r2Events = [
  [0, 1.0, 72, 78, 0.3], [1, 1.0, 70, 76, 0.3], [2, 1.9, 69, 94, 0.45],
  [0, 1.95, 53, 68, 0.4], [0, 1.95, 60, 62, 0.4],
  [2, 1.9, 53, 66, 0.45], [2, 1.9, 57, 62, 0.45], [2, 1.9, 60, 62, 0.45],
];
const r2Demo = [
  // Melody: 1 (F4) -> 3 (A4) -> 5 (C5) -> 1 (F4)
  [0, 0.9, 65, 86], [1, 1.0, 69, 98], [2, 0.7, 72, 94], [2.75, 0.25, 69, 82], [3, 1.2, 65, 90],
  // Warm, unbroken F-major triad foundation in LH (F3 + A3 + C4): locks F Major clearly!
  [0, 1.9, 53, 68], [0, 1.9, 57, 62], [0, 1.9, 60, 62],
  [1, 0.9, 57, 64],
  [2, 0.9, 53, 66], [2, 0.9, 60, 62],
  [3, 1.2, 53, 70], [3, 1.2, 57, 64], [3, 1.2, 60, 64],
];
const r2Bal = balanceLH(r2Events);
writeWav('ep11_r2.wav', renderSec(compileBeats(r2Bal, r2Bpm), 0.55));
TIMING[2] = makeReplay('ep11_r2_replay.wav', balanceLH(r2Demo), r2Bpm, 0, 4, [0, 1, 2, 3], 0.5);

// ============================================================================
// R3 (Grade 5 · A natural minor, 132 BPM · 8 beats = 3.64s + 0.5s tail)
// Fast, fiery Aeolian A-minor phrase (ZERO G# harmonic leading tone, pure Am/Dm chords in LH!)
// ============================================================================
const r3Bpm = 132;
const r3Events = [
  // Bar 1 RH: fast driving eighth notes strictly in A natural minor (C natural prominent!)
  // crisper (0.38 beat, short release) with accents on beats 1 and 3 = dance lilt; last four notes D-C-A-F spell the Dm7 chord in the left hand
  // (before: D-C-B-G, which outlined a G major triad over Dm and muddied the 'pure minor' claim)
  [0, 0.38, 69, 98, 0.09], [0.5, 0.38, 72, 90, 0.09], [1, 0.38, 76, 96, 0.09], [1.5, 0.38, 72, 90, 0.09],
  [2, 0.38, 74, 98, 0.09], [2.5, 0.38, 72, 90, 0.09], [3, 0.38, 69, 90, 0.09], [3.5, 0.38, 65, 88, 0.09],
  // Bar 1 LH: firm A-minor and D-minor chords (NO E major / NO G#!)
  [0, 1.4, 45, 72], [0, 1.4, 52, 62], [0, 1.4, 60, 64],
  [2, 1.4, 50, 68], [2, 1.4, 57, 62], [2, 1.4, 60, 62],
  // Bar 2 RH (Replay): crisp A4 (1) -> C5 (b3) -> E5 (5) -> A4 (1) minor triad
  [4, 1.0, 69, 94], [5, 1.0, 72, 98], [6, 1.0, 76, 96], [7, 1.2, 69, 96],
  // Bar 2 LH: pure A-minor tonic harmony throughout
  [4, 1.8, 45, 72], [4, 1.8, 52, 62], [4, 1.8, 60, 64],
  [6, 0.9, 52, 66], [6, 0.9, 60, 62],
  [7, 1.2, 45, 72], [7, 1.2, 52, 64], [7, 1.2, 60, 64],
];
const r3Bal = balanceLH(r3Events);
writeWav('ep11_r3.wav', renderSec(compileBeats(r3Bal, r3Bpm), 0.55));
TIMING[3] = makeReplay('ep11_r3_replay.wav', r3Bal, r3Bpm, 4, 4, [0, 1, 2, 3], 0.55);

console.log('question audio length (s):', [4 * 60 / r1Bpm, 4 * 60 / r2Bpm, 8 * 60 / r3Bpm].map((x) => x.toFixed(2)).join(' / '));
try {
  const ep = JSON.parse(fs.readFileSync(EP_JSON, 'utf8'));
  let bad = 0;
  for (const r of ep.rounds) {
    const a = JSON.stringify(r.repTriad), b = JSON.stringify(TIMING[r.n].repTriad);
    if (a !== b) { bad++; console.log(`MISMATCH round ${r.n} repTriad: json=${a}  audio=${b}`); }
  }
  console.log(bad ? `-> ${bad} mismatch(es): copy into ep11.json` : 'replay timing in ep11.json matches the audio: OK');
} catch (e) {
  console.log('paste into ep11.json:', JSON.stringify(TIMING));
}
