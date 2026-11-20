import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const SR = 44100;
const SAL_DIR = process.env.SAL_DIR ?? 'C:/Users/HCT/.gemini/antigravity/scratch/dottino-web/audio/sal';
const OUT_DIR = process.env.OUT_DIR ?? 'C:/Users/HCT/.gemini/antigravity/scratch/basso-video-studio/public/audio';
const FFMPEG = process.env.FFMPEG ?? 'C:/Users/HCT/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const EP_JSON = process.env.EP_JSON ?? 'C:/Users/HCT/.gemini/antigravity/scratch/basso-video-studio/src/ep10.json';
const DRY = !!process.env.DRY; // DRY=1 node generate_ep10_audio.mjs  -> no audio, only prints/validates the replay timing
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

// notes: [startSec, durSec, midi, vel, relSec]
function renderSec(notes, tail = 0.65) {
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

// level 2 = bar line (beat 1), 1 = beat 3, 0 = other beats
function addPulseClick(buf, tSec, level) {
  const freq = [1100, 1250, 1550][level];
  const amp = [0.13, 0.17, 0.23][level];
  const n = Math.floor(0.07 * SR);
  const start = Math.floor(tSec * SR);
  for (let i = 0; i < n && start + i < buf.length / 2; i++) {
    const t = i / SR;
    const v = (Math.sin(2 * Math.PI * freq * t) + 0.35 * Math.sin(2 * Math.PI * 2.5 * freq * t)) * Math.exp(-t / 0.015) * Math.min(1, t / 0.0008) * amp;
    buf[(start + i) * 2] += v;
    buf[(start + i) * 2 + 1] += v;
  }
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

function buildBeatTimes(bpms) {
  const t = [0];
  for (let i = 0; i < bpms.length; i++) t.push(t[t.length - 1] + 60 / bpms[i]);
  return t;
}
const secAt = (times, beat) => {
  const b0 = Math.floor(beat), frac = beat - b0;
  if (b0 >= times.length - 1) return times[times.length - 1];
  return times[b0] + frac * (times[b0 + 1] - times[b0]);
};
function compileScore(events, times) {
  return events.map(([b, db, p, vel, rel = 0.22]) => {
    const t0 = secAt(times, b);
    const t1 = secAt(times, Math.min(times.length - 1, b + db));
    return [t0, Math.max(0.08, t1 - t0), p, vel, rel];
  });
}

// Left hand: every beat group gets the same recipe (bass 72, upper voice 62, bar-line +6). Before, the upper voices sat at vel 54-58
// (the soft sample layer) while the bass was in the normal layer, so one chord had two different attacks and the pulse was mushy.
const RH_MIN = 68; // anything below this pitch is left hand
function balanceLH(events) {
  const lowest = new Map();
  for (const [b, , p] of events) if (p < RH_MIN) lowest.set(b, Math.min(lowest.get(b) ?? 999, p));
  return events.map(([b, db, p, vel, rel]) => (p < RH_MIN ? [b, db, p, (p === lowest.get(b) ? 72 : 62) + (b % 4 === 0 ? 6 : 0), rel] : [b, db, p, vel, rel]));
}
const toFrames = (sec) => Math.round(sec * FPS);
// replay window = the original music from beat `from`, 4 beats, at the ORIGINAL tempos (no exaggeration), left hand +8, clicks on every beat
function makeReplay(name, events, bpms, from, times, tail) {
  const repBpms = bpms.slice(from, from + 4);
  const repTimes = buildBeatTimes(repBpms);
  const ev = events.filter(([b]) => b >= from && b < from + 4).map(([b, db, p, vel, rel]) => [b - from, db, p, p < RH_MIN ? vel + 8 : vel, rel]);
  const buf = renderSec(compileScore(ev, repTimes), tail);
  for (let i = 0; i < 4; i++) { const k = (from + i) % 4; addPulseClick(buf, repTimes[i], k === 0 ? 2 : k === 2 ? 1 : 0); }
  writeWav(name, buf);
  const timing = {
    repBeats: [0, 1, 2, 3].map((i) => toFrames(repTimes[i])),
    repNotes: ev.filter(([, , p]) => p >= RH_MIN).map(([b]) => toFrames(secAt(repTimes, b))),
    repBpms: repBpms.map(Math.round),
    bar: [0, 1, 2, 3].find((i) => (from + i) % 4 === 0),
  };
  return timing;
}
const TIMING = {};

// ============================================================================
// R1 (Grade 3): Two-bar C-major classical phrase (Burgmüller style, I - V6 - vi - IV - V7 - I)
// Same melodic figure sequenced upwards while the beat genuinely accelerates (78 -> 124 BPM)
// ============================================================================
const r1Bpms = [78, 82, 88, 95, 103, 111, 119, 126];
const r1Times = buildBeatTimes(r1Bpms);
const r1Events = [
  // Bar 1 (beats 0..4): graceful motif E5 - G5 F5 - E5 - D5, with left-hand harmonic pulse every beat
  [0, 1.0, 76, 92], [1, 0.5, 79, 88], [1.5, 0.5, 77, 84], [2, 1.0, 76, 90], [3, 1.0, 74, 86],
  [0, 0.9, 48, 62], [0, 0.9, 60, 56],
  [1, 0.9, 55, 58], [1, 0.9, 62, 54],
  [2, 0.9, 57, 62], [2, 0.9, 60, 56],
  [3, 0.9, 55, 58], [3, 0.9, 59, 54],
  // Bar 2 (beats 4..8): sequenced up F5 - A5 G5 - F5 - E5 - D5 -> C6 cadence, accelerating
  [4, 1.0, 77, 94], [5, 0.5, 81, 92], [5.5, 0.5, 79, 88], [6, 0.5, 77, 92], [6.5, 0.5, 76, 90], [7, 1.0, 84, 98],
  [4, 0.9, 53, 66], [4, 0.9, 60, 58],
  [5, 0.9, 50, 62], [5, 0.9, 62, 56],
  [6, 0.9, 55, 66], [6, 0.9, 59, 60],
  [7, 1.1, 48, 72], [7, 1.1, 55, 64], [7, 1.1, 64, 64],
];
// NOTE (deliberate, keep): R1 also gets busier in bar 2, so "more notes = faster" is TRUE here. That is the habit R2 then breaks.
const r1Bal = balanceLH(r1Events);
writeWav('ep10_r1.wav', renderSec(compileScore(r1Bal, r1Times), 0.65));
// R1 replay: beats 2..5 (across the bar line, tempo picks up 88 -> 111), real tempos
TIMING[1] = makeReplay('ep10_r1_replay.wav', r1Bal, r1Bpms, 2, r1Times, 0.6);

// ============================================================================
// R2 (Grade 4): Classical variation phrase in G major (Mozart/Clementi style), ROCK-STEADY 82 BPM!
// Bar 1: lyrical quarter-note phrase (B4 - D5 - G5 - F#5) over steady quarter-note bass chords
// Bar 2: sparkling eighth-note variation (G5 F#5 E5 D5 C5 B4 A4 F#4 -> G4) over the EXACT same 82 BPM bass!
// ============================================================================
const r2Bpms = Array(8).fill(82);
const r2Times = buildBeatTimes(r2Bpms);
const r2Events = [
  // Bar 1 RH (quarter-note singing phrase)
  [0, 1.02, 71, 92], [1, 1.02, 74, 90], [2, 1.02, 79, 96], [3, 0.95, 78, 88],
  // Bar 1 LH (steady quarter-note pulse)
  [0, 0.65, 55, 68, 0.14], [0, 0.65, 59, 58, 0.14],
  [1, 0.65, 62, 62, 0.14], [1, 0.65, 67, 56, 0.14],
  [2, 0.65, 55, 66, 0.14], [2, 0.65, 62, 58, 0.14],
  [3, 0.65, 50, 64, 0.14], [3, 0.65, 60, 58, 0.14],
  // Bar 2 RH (suddenly twice as many notes — flowing eighth-note variation, same beat!)
  [4.0, 0.48, 79, 94, 0.14], [4.5, 0.48, 78, 86, 0.14],
  [5.0, 0.48, 76, 92, 0.14], [5.5, 0.48, 74, 86, 0.14],
  [6.0, 0.48, 72, 92, 0.14], [6.5, 0.48, 71, 86, 0.14],
  [7.0, 0.48, 69, 88, 0.14], [7.5, 0.48, 78, 86, 0.14],
  // Bar 2 LH (rock-steady quarter-note pulse continues unchanged)
  [4, 0.65, 52, 68, 0.14], [4, 0.65, 59, 60, 0.14],
  [5, 0.65, 54, 64, 0.14], [5, 0.65, 62, 58, 0.14],
  [6, 0.65, 55, 68, 0.14], [6, 0.65, 64, 58, 0.14],
  [7, 0.65, 50, 66, 0.14], [7, 0.65, 60, 58, 0.14],
];
const r2Bal = balanceLH(r2Events);
writeWav('ep10_r2.wav', renderSec(compileScore(r2Bal, r2Times), 0.65));
// R2 replay: beats 2..5 (2 beats of quarter notes -> 2 beats of eighths across the bar line, beat stays 82)
TIMING[2] = makeReplay('ep10_r2_replay.wav', r2Bal, r2Bpms, 2, r2Times, 0.6);

// ============================================================================
// R3 (Grade 5): Expressive A-minor phrase (Schumann style)
// Bar 1 (88 -> 84 BPM): sparse, poised melody (E5 - F5 - E5 - C5)
// Bar 2 (78 -> 62 BPM): right hand turns into busy continuous eighth notes WHILE the beat slows down!
// ============================================================================
const r3Bpms = [88, 87, 85, 82, 77, 71, 65, 60];
const r3Times = buildBeatTimes(r3Bpms);
const r3Events = [
  // Bar 1 RH (poised, spacious motif)
  [0, 1.5, 76, 92], [1.5, 0.5, 77, 86], [2, 1.0, 76, 90], [3, 1.0, 72, 86],
  // Bar 1 LH (clear quarter-note harmonic steps: Am - Am/G - F - E)
  [0, 0.75, 45, 68, 0.16], [0, 0.75, 57, 60, 0.16],
  [1, 0.75, 52, 64, 0.16], [1, 0.75, 60, 58, 0.16],
  [2, 0.75, 53, 68, 0.16], [2, 0.75, 60, 60, 0.16],
  [3, 0.75, 52, 66, 0.16], [3, 0.75, 59, 58, 0.16],
  // Bar 2 RH (busier continuous eighth notes while the beat stretches out slower and slower)
  [4.0, 0.48, 74, 92, 0.16], [4.5, 0.48, 77, 88, 0.16],
  [5.0, 0.48, 76, 92, 0.16], [5.5, 0.48, 74, 86, 0.16],
  [6.0, 0.48, 72, 90, 0.16], [6.5, 0.48, 71, 86, 0.16],
  [7.0, 0.48, 68, 88, 0.16], [7.5, 0.52, 69, 92, 0.24],
  // Bar 2 LH (deliberate, slowing quarter-note bass steps: Dm - E7 - Am - E -> A)
  [4, 0.75, 50, 70, 0.18], [4, 0.75, 57, 62, 0.18],
  [5, 0.75, 52, 70, 0.18], [5, 0.75, 56, 62, 0.18],
  [6, 0.75, 45, 72, 0.18], [6, 0.75, 57, 64, 0.18],
  [7, 0.85, 52, 72, 0.22], [7, 0.85, 56, 64, 0.22],
];
const r3Bal = balanceLH(r3Events);
writeWav('ep10_r3.wav', renderSec(compileScore(r3Bal, r3Times), 0.75));
// R3 replay: beats 3..6 (1 beat of quarter note -> 3 beats of eighths while the beat slows 82 -> 65), real tempos
TIMING[3] = makeReplay('ep10_r3_replay.wav', r3Bal, r3Bpms, 3, r3Times, 0.7);

console.log('question audio length (s):', [r1Times, r2Times, r3Times].map((t) => t[8].toFixed(2)).join(' / '));
// the video reads repBeats / repNotes / repBpms / bar from ep10.json: make sure they match what was just rendered
try {
  const ep = JSON.parse(fs.readFileSync(EP_JSON, 'utf8'));
  let bad = 0;
  for (const r of ep.rounds) {
    for (const key of ['repBeats', 'repNotes', 'repBpms', 'bar']) {
      const a = JSON.stringify(r[key]), b = JSON.stringify(TIMING[r.n][key]);
      if (a !== b) { bad++; console.log(`MISMATCH round ${r.n} ${key}: json=${a}  audio=${b}`); }
    }
  }
  console.log(bad ? `-> ${bad} mismatch(es): copy the audio values into ep10.json` : 'replay timing in ep10.json matches the audio: OK');
} catch (e) {
  console.log('could not read', EP_JSON, '- paste this into ep10.json:', JSON.stringify(TIMING));
}
