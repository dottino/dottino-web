// Reusable Pre-Release Audio, Timing & Loudness Gate for Basso Challenge (#12+)
// Usage: node audit_ep.mjs 12
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';

const epNum = process.argv[2];
if (!epNum) {
  console.error('Usage: node audit_ep.mjs <episodeNumber>');
  process.exit(1);
}

const FFMPEG = process.env.FFMPEG ?? 'C:/Users/HCT/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const FFPROBE = FFMPEG.replace(/ffmpeg\.exe$/i, 'ffprobe.exe');
const ROOT = path.resolve('.');
const epPath = path.join(ROOT, 'src', `ep${epNum}.json`);
const ep = JSON.parse(fs.readFileSync(epPath, 'utf8'));

function wavRmsDb(filePath) {
  const buf = execFileSync(FFMPEG, ['-v', 'error', '-i', filePath, '-f', 'f32le', '-ac', '2', '-ar', '44100', 'pipe:1'], {maxBuffer: 64 * 1024 * 1024});
  const f32 = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  let sum = 0;
  let active = 0;
  for (let i = 0; i < f32.length; i++) {
    const v = f32[i];
    if (Math.abs(v) > 0.002) {
      sum += v * v;
      active++;
    }
  }
  return 10 * Math.log10(sum / Math.max(1, active) + 1e-12);
}

let warns = 0;
let fails = 0;
const ok = (msg) => console.log(`  [PASS] ${msg}`);
const warn = (msg) => { warns++; console.log(`  [WARN] ${msg}`); };
const fail = (msg) => { fails++; console.log(`  [FAIL] ${msg}`); };

console.log(`\n=== Basso Challenge #${epNum} Pre-Release Audit ===`);

// 1. Round music RMS balance
const roundRms = [];
for (const r of ep.rounds) {
  const qPath = path.join(ROOT, 'public', r.audio);
  const repPath = path.join(ROOT, 'public', r.audio.replace('.wav', '_replay.wav'));
  if (!fs.existsSync(qPath)) { fail(`Missing question audio: ${r.audio}`); continue; }
  if (!fs.existsSync(repPath)) { fail(`Missing replay audio: ${repPath}`); continue; }
  const rms = wavRmsDb(qPath);
  roundRms.push({n: r.n, rms});
}
if (roundRms.length) {
  const vals = roundRms.map((x) => x.rms);
  const spread = Math.max(...vals) - Math.min(...vals);
  const avgMusicRms = vals.reduce((a, b) => a + b, 0) / vals.length;
  const summary = roundRms.map((x) => `R${x.n} ${x.rms.toFixed(1)} dB`).join(' | ');
  if (spread <= 3.0) ok(`Round RMS balance: ${summary} (spread ${spread.toFixed(1)} dB <= 3.0 dB)`);
  else warn(`Round RMS spread ${spread.toFixed(1)} dB > 3.0 dB (${summary})`);

  // 2. SFX-to-music loudness balance
  const sfxMap = new Map();
  for (const s of ep.sfx ?? []) {
    const prev = sfxMap.get(s.name) ?? 0;
    if (s.gain > prev) sfxMap.set(s.name, s.gain);
  }
  for (const [name, gain] of sfxMap.entries()) {
    const p = path.join(ROOT, 'public', 'audio', `sfx_${name}.wav`);
    if (!fs.existsSync(p)) { fail(`Missing SFX: sfx_${name}.wav`); continue; }
    const effRms = wavRmsDb(p) + 20 * Math.log10(gain);
    const delta = effRms - avgMusicRms;
    if (name === 'boing' && gain > 0.25) {
      warn(`boing gain=${gain} (> 0.25 recommended; eff ${effRms.toFixed(1)} dB vs music ${avgMusicRms.toFixed(1)} dB)`);
    } else if (delta > 3.0) {
      warn(`SFX "${name}" (gain ${gain}) is +${delta.toFixed(1)} dB louder than music (${effRms.toFixed(1)} vs ${avgMusicRms.toFixed(1)} dB)`);
    } else {
      ok(`SFX "${name}" (gain ${gain}): eff ${effRms.toFixed(1)} dB (${delta >= 0 ? '+' : ''}${delta.toFixed(1)} dB vs music)`);
    }
  }
}

// 3. Structural timing & anti-collision checks
const r1Delay = ep.rounds[0]?.audioDelay ?? 0;
if (r1Delay >= 10) ok(`R1 audioDelay = ${r1Delay}f (clears intro boing)`);
else warn(`R1 audioDelay = ${r1Delay}f (< 10f may clash with intro boing)`);

const repLead = ep.repLead ?? 0;
if (repLead >= 12) ok(`repLead = ${repLead}f (clears reveal SFX before replay beat 1)`);
else warn(`repLead = ${repLead}f (< 12f may clash with reveal SFX)`);

// Check typography traps in explain strings
for (const r of ep.rounds) {
  if (/ — /.test(r.explain)) warn(`R${r.n} explain contains " — " which may wrap onto line 2 starting with a dash`);
  else if (/[a-z]-[a-z]/i.test(r.explain)) warn(`R${r.n} explain contains breakable hyphen "${r.explain}" — consider non-breaking hyphen (\\u2011)`);
  else ok(`R${r.n} explain typography clean: "${r.explain}"`);
}

// 4. Rendered MP4 loudness & duration check (if already rendered)
const mp4Path = path.join(ROOT, 'out', `basso_challenge_${epNum}.mp4`);
if (fs.existsSync(mp4Path)) {
  const probe = JSON.parse(execFileSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration:stream=nb_frames', '-of', 'json', mp4Path], {encoding: 'utf8'}));
  const dur = Number(probe.format.duration);
  const res = spawnSync(FFMPEG, ['-i', mp4Path, '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], {encoding: 'utf8'});
  const combined = (res.stdout ?? '') + (res.stderr ?? '');
  const m = combined.match(/\{[\s\S]*"input_i"[\s\S]*\}/);
  if (m) {
    const j = JSON.parse(m[0]);
    const lufs = Number(j.input_i), tp = Number(j.input_tp);
    if (lufs >= -16.0 && lufs <= -14.0 && tp <= -1.0) ok(`MP4 loudness: ${lufs} LUFS, TP ${tp} dBTP, duration ${dur.toFixed(2)}s`);
    else warn(`MP4 loudness out of target (-15 LUFS / -1.5 dBTP): got ${lufs} LUFS, TP ${tp} dBTP`);
  } else {
    ok(`MP4 exists (${dur.toFixed(2)}s) — run loudnorm_mp4.mjs to verify LUFS`);
  }
} else {
  console.log(`  [INFO] No rendered MP4 yet at out/basso_challenge_${epNum}.mp4`);
}

console.log(`\nSummary: ${fails} fail(s), ${warns} warning(s).`);
if (fails > 0) process.exit(1);
