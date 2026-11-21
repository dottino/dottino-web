import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FFMPEG = process.env.FFMPEG ?? 'C:/Users/HCT/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const target = process.argv[2];
if (!target) { console.error('Usage: node loudnorm_mp4.mjs <input.mp4>'); process.exit(1); }

const abs = path.resolve(target);
const tmp = abs.replace(/\.mp4$/i, '.__loudtmp.mp4');

function measure(file) {
  const r = spawnSync(FFMPEG, [
    '-hide_banner', '-i', file, '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-',
  ], {encoding: 'utf8'});
  const m = (r.stderr || '').match(/\{[\s\S]*?"input_i"[\s\S]*?\}/);
  if (!m) throw new Error('Could not parse loudnorm JSON:\n' + r.stderr);
  return JSON.parse(m[0]);
}

const before = measure(abs);
console.log('Before:', {I: before.input_i, TP: before.input_tp, LRA: before.input_lra, thresh: before.input_thresh});

const af = `loudnorm=I=-15:TP=-1.5:LRA=11:measured_I=${before.input_i}:measured_TP=${before.input_tp}:measured_LRA=${before.input_lra}:measured_thresh=${before.input_thresh}:offset=${before.target_offset}:linear=true:print_format=summary`;
const p2 = spawnSync(FFMPEG, [
  '-y', '-hide_banner', '-v', 'error', '-i', abs,
  '-c:v', 'copy', '-af', af, '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
  '-movflags', '+faststart', tmp,
], {encoding: 'utf8'});
if (p2.status !== 0) { console.error(p2.stderr); process.exit(p2.status || 1); }

fs.renameSync(tmp, abs);
const after = measure(abs);
console.log('After: ', {I: after.input_i, TP: after.input_tp, LRA: after.input_lra});
