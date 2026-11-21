import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const SR = 44100;
const SAL_DIR = process.env.SAL_DIR ?? 'C:/Users/HCT/.gemini/antigravity/scratch/dottino-web/audio/sal';
const OUT_DIR = process.env.OUT_DIR ?? 'C:/Users/HCT/.gemini/antigravity/scratch/basso-video-studio/public/audio';
const FFMPEG = process.env.FFMPEG ?? 'C:/Users/HCT/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const EP_JSON = process.env.EP_JSON ?? 'C:/Users/HCT/.gemini/antigravity/scratch/basso-video-studio/src/ep12.json';
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

// Music-theory sanity gate: prevent accidental non-musical subdivisions (e.g., 0.8 beat quintuplet polyrhythm)
const VALID_GRID = [0, 0.25, 1 / 3, 0.5, 2 / 3, 0.75];
function assertMusicalGrid(label, events) {
  for (const [b] of events) {
    const frac = b - Math.floor(b);
    const ok = VALID_GRID.some((g) => Math.abs(frac - g) < 0.015);
    if (!ok) throw new Error(`[MusicTheoryGate] Non-musical beat position ${b} in ${label}!`);
  }
}

function renderSec(notes, tail = 0.72) {
  if (DRY) return new Float32Array(2);
  const maxT = Math.max(...notes.map(([t, d]) => t + d)) + tail;
  const len = Math.ceil(maxT * SR);
  const out = new Float32Array(len * 2);
  const SQRT2 = Math.SQRT2;
  for (const [startSec, durSec, midi, vel = 90, relSec = 0.42] of notes) {
    const samp = getSample(midi, vel < 60 ? 4 : vel < 105 ? 9 : 14);
    const rate = Math.pow(2, (midi - samp.base) / 12);
    const gain = (vel / 127) * 0.72;
    // Pianist-perspective stereo imaging: bass gently left, treble gently right (±22% max)
    const pan = Math.max(-1, Math.min(1, (midi - 62) / 34)) * 0.22;
    const angle = (pan + 1) * (Math.PI / 4);
    const gainL = Math.cos(angle) * SQRT2 * gain;
    const gainR = Math.sin(angle) * SQRT2 * gain;
    const startIdx = Math.max(0, Math.floor(startSec * SR));
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
      // Smooth exponential damper-pedal decay curve instead of abrupt linear cutoff
      const env = i < durSamples ? 1 : Math.pow(Math.max(0, 1 - (i - durSamples) / relSamples), 1.65);
      out[dst * 2] += (samp.data[s0 * 2] * (1 - frac) + samp.data[(s0 + 1) * 2] * frac) * gainL * env;
      out[dst * 2 + 1] += (samp.data[s0 * 2 + 1] * (1 - frac) + samp.data[(s0 + 1) * 2 + 1] * frac) * gainR * env;
    }
  }
  return out;
}

function rmsDb(floatStereo) {
  if (DRY || floatStereo.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < floatStereo.length; i++) sum += floatStereo[i] * floatStereo[i];
  return 10 * Math.log10(sum / floatStereo.length + 1e-12);
}

// Write WAV + apply subtle warm studio/practice-room early reflections (no muddy hall wash)
function writeWavWithRoom(filename, floatStereo) {
  if (DRY) return;
  let pk = 0;
  for (let i = 0; i < floatStereo.length; i++) pk = Math.max(pk, Math.abs(floatStereo[i]));
  const scale = pk > 0.88 ? 0.88 / pk : 1;
  const frames = floatStereo.length / 2;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0); header.writeUInt32LE(36 + frames * 4, 4);
  header.write('WAVE', 8); header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(2, 22);
  header.writeUInt32LE(SR, 24); header.writeUInt32LE(SR * 4, 28); header.writeUInt16LE(4, 32); header.writeUInt16LE(16, 34);
  header.write('data', 36); header.writeUInt32LE(frames * 4, 40);
  const pcm = Buffer.alloc(frames * 4);
  for (let i = 0; i < floatStereo.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, floatStereo[i] * scale)) * 32767), i * 2);
  const outPath = path.join(OUT_DIR, filename);
  const dryPath = outPath.replace(/\.wav$/i, '.__dry.wav');
  fs.writeFileSync(dryPath, Buffer.concat([header, pcm]));
  // Stereo decorrelated wood practice-room early reflections (L: 21/39/61ms, R: 25/44/67ms) + gentle warmth EQ
  execFileSync(FFMPEG, [
    '-y', '-v', 'error', '-i', dryPath,
    '-filter_complex',
    '[0:a]channelsplit=channel_layout=stereo[l][r];[l]aecho=0.88:0.86:21|39|61:0.13|0.08|0.04[le];[r]aecho=0.88:0.86:25|44|67:0.13|0.08|0.04[re];[le][re]amerge=inputs=2,lowshelf=g=1.4:f=210,highshelf=g=-0.8:f=6800[out]',
    '-map', '[out]', '-ac', '2', '-c:a', 'pcm_s16le', '-ar', String(SR), outPath,
  ]);
  fs.unlinkSync(dryPath);
}

const toFrames = (sec) => Math.round(sec * FPS);

// Humanize pianist articulation: gentle chord roll (LH bass anchors, upper LH +8ms, RH melody sings +3ms)
// + legato overlap (35-45ms natural finger connection) + subtle damper-pedal tail + 4-beat phrase contour
const RH_MIN = 64;
function humanizeEvents(events, bpm, offsetSec = 0) {
  const spb = 60 / bpm;
  const lowest = new Map();
  for (const [b, , p] of events) if (p < RH_MIN) lowest.set(b, Math.min(lowest.get(b) ?? 999, p));

  const phraseContour = [1.02, 0.96, 1.04, 0.94]; // natural 4-beat arch
  return events.map(([b, db, p, vel, rel = 0.28]) => {
    const beatIdx = Math.floor(b) % 4;
    const isLH = p < RH_MIN;
    const isBass = isLH && p === lowest.get(b);
    // Deterministic micro-timing (seconds): bass anchors beat, inner voice gently rolls +8ms, RH melody breathes +3ms
    const microShift = isBass ? 0 : isLH ? 0.008 : 0.003 + (beatIdx === 3 ? 0.006 : 0);
    const baseVel = isLH ? (isBass ? 68 : 61) + (b % 4 === 0 ? 4 : 0) : vel;
    const shapedVel = Math.max(48, Math.min(115, Math.round(baseVel * phraseContour[beatIdx])));
    // Natural legato connection for beats 0-2 (~40ms overlap into next note) + warm half-pedal release
    const legatoBonus = !isLH && beatIdx < 3 ? 0.045 : 0;
    const pedalRel = Math.min(0.48, rel + (beatIdx === 3 ? 0.06 : 0.14));
    return [offsetSec + b * spb + microShift, Math.max(0.08, db * spb + legatoBonus), p, shapedVel, pedalRel];
  });
}

function buildRound(n, bpm, ev1, ev2, changedBeat) {
  assertMusicalGrid(`R${n} play1`, ev1);
  assertMusicalGrid(`R${n} play2`, ev2);
  const spb = 60 / bpm;
  const gapBeats = 1.2;
  const play2StartSec = (4 + gapBeats) * spb;
  const q1 = humanizeEvents(ev1, bpm, 0);
  const q2 = humanizeEvents(ev2, bpm, play2StartSec);
  const qBuf = renderSec([...q1, ...q2], 0.6);
  writeWavWithRoom(`ep12_r${n}.wav`, qBuf);

  const repEv = ev2.map(([b, db, p, vel, rel]) => [
    b, db, p, p >= RH_MIN && Math.abs(b - changedBeat) < 0.01 ? Math.min(114, vel + 7) : vel, rel ?? 0.28,
  ]);
  const rBuf = renderSec(humanizeEvents(repEv, bpm, 0), 0.65);
  writeWavWithRoom(`ep12_r${n}_replay.wav`, rBuf);

  return {
    play2At: toFrames(play2StartSec),
    qDurSec: Number((play2StartSec + 4 * spb).toFixed(2)),
    repNotes: [0, 1, 2, 3].map((b) => toFrames(b * spb)),
    rmsDb: Number(rmsDb(qBuf).toFixed(1)),
  };
}

const TIMING = {};

// ============================================================================
// R1 (Grade 3 · C major, 120 BPM · 4 notes twice = 4.60s)
// Play 1: C5 - E5 - G5 - E5   |   Play 2: C5 - E5 - A5 - E5 (Note 3 jumps UP!)
// ============================================================================
const r1LH = [
  [0, 1.85, 48, 68, 0.32], [0, 1.85, 60, 62, 0.30],
  [2, 1.85, 48, 66, 0.32], [2, 1.85, 60, 62, 0.30],
];
TIMING[1] = buildRound(
  1, 120,
  [[0, 0.94, 72, 92, 0.26], [1, 0.94, 76, 92, 0.26], [2, 0.94, 79, 94, 0.28], [3, 1.05, 76, 90, 0.32], ...r1LH],
  [[0, 0.94, 72, 92, 0.26], [1, 0.94, 76, 92, 0.26], [2, 0.94, 81, 96, 0.28], [3, 1.05, 76, 90, 0.32], ...r1LH],
  2
);

// ============================================================================
// R2 (Grade 4 · G major, 118 BPM · 4 notes twice = 4.68s)
// Play 1: G4 - B4 - D5 - G5   |   Play 2: G4 - Bb4 - D5 - G5 (Note 2 drops 1 half-step to BLACK KEY Bb4!)
// ============================================================================
const r2LH = [
  [0, 1.85, 55, 68, 0.32], [0, 1.85, 62, 62, 0.30],
  [2, 1.85, 55, 68, 0.32], [2, 1.85, 62, 62, 0.30],
];
TIMING[2] = buildRound(
  2, 118,
  [[0, 0.94, 67, 92, 0.26], [1, 0.94, 71, 94, 0.28], [2, 0.94, 74, 94, 0.26], [3, 1.05, 79, 94, 0.32], ...r2LH],
  [[0, 0.94, 67, 92, 0.26], [1, 0.94, 70, 96, 0.28], [2, 0.94, 74, 94, 0.26], [3, 1.05, 79, 94, 0.32], ...r2LH],
  1
);

// ============================================================================
// R3 (Grade 5 · D minor, 116 BPM · two hands with flowing accompaniment = 4.76s)
// Play 1: A4 - D5 - F5 - E5   |   Play 2: A4 - D5 - F5 - D5 (Note 4 slips down 1 step — fools Basso!)
// ============================================================================
const r3LH = [
  [0, 0.92, 50, 70, 0.26], [0.5, 0.46, 57, 62, 0.22],
  [1, 0.92, 53, 66, 0.26], [1.5, 0.46, 57, 62, 0.22],
  [2, 0.92, 50, 68, 0.26], [2.5, 0.46, 57, 62, 0.22],
  [3, 1.05, 45, 70, 0.32], [3, 1.05, 57, 62, 0.30],
];
TIMING[3] = buildRound(
  3, 116,
  [[0, 0.94, 69, 92, 0.26], [1, 0.94, 74, 94, 0.26], [2, 0.94, 77, 96, 0.28], [3, 1.05, 76, 94, 0.32], ...r3LH],
  [[0, 0.94, 69, 92, 0.26], [1, 0.94, 74, 94, 0.26], [2, 0.94, 77, 96, 0.28], [3, 1.05, 74, 94, 0.32], ...r3LH],
  3
);

console.log('MusicTheoryGate: PASS');
console.log('round durations (s):', [1, 2, 3].map((k) => TIMING[k].qDurSec).join(' / '));
console.log('round RMS (dBFS):   ', [1, 2, 3].map((k) => TIMING[k].rmsDb).join(' / '));
try {
  const ep = JSON.parse(fs.readFileSync(EP_JSON, 'utf8'));
  let bad = 0;
  for (const r of ep.rounds) {
    for (const key of ['play2At', 'repNotes']) {
      const a = JSON.stringify(r[key]), b = JSON.stringify(TIMING[r.n][key]);
      if (a !== b) { bad++; console.log(`MISMATCH round ${r.n} ${key}: json=${a}  audio=${b}`); }
    }
  }
  console.log(bad ? `-> ${bad} mismatch(es): copy into ep12.json` : 'timing in ep12.json matches the audio: OK');
} catch (e) {
  console.log('paste into ep12.json:', JSON.stringify(TIMING));
}
