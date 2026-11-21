import React from 'react';
import {
  AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import ep from './ep12.json';

// Episode 12: three rounds of "Which note changed?", Grade 3 → 4 → 5 level (~41.8s).
// Upgraded craft edition: storybook paper grain, humanized Salamander piano + room warmth,
// live mini piano keyboard inside RevealChange (showing Bb4 black-key drop in R2!), and micro-motion.
const C = {cream: '#F3EFE6', ground: '#E7E0D2', navy: '#1C1B2E', orange: '#EE6A45', card: '#FFFDF8', muted: '#8A8578', line: '#DED6C6', soft: '#F6C9B8'};
const FONT = 'Nunito, sans-serif';

type Asset = {src: string; video: boolean; w: number; h: number; d: number; cx: number; baseY: number; from?: number};
const A: Record<string, Asset> = {
  think: {src: 'basso/15_ponder.webm', video: true, w: 720, h: 960, d: 313, cx: 360, baseY: 681},
  neutral: {src: 'basso/20_idle.webm', video: true, w: 720, h: 960, d: 312, cx: 363, baseY: 683},
  listen: {src: 'basso/12_listen_hard.webm', video: true, w: 720, h: 960, d: 313, cx: 361, baseY: 729},
  listenHard: {src: 'basso/19_hum.webm', video: true, w: 720, h: 960, d: 337, cx: 339, baseY: 767},
  ponder: {src: 'basso/15_ponder.webm', video: true, w: 720, h: 960, d: 313, cx: 360, baseY: 681},
  compose: {src: 'basso/18_compose.webm', video: true, w: 720, h: 960, d: 313, cx: 360, baseY: 692},
  cheer: {src: 'basso/21_bounce.webm', video: true, w: 720, h: 960, d: 361, cx: 360, baseY: 842},
  surprise: {src: 'basso/11_surprise.webm', video: true, w: 720, h: 960, d: 345, cx: 358, baseY: 750},
  wonder: {src: 'basso/13_wonder.webm', video: true, w: 720, h: 960, d: 342, cx: 356, baseY: 837, from: 36},
  aha: {src: 'basso/14_aha.webm', video: true, w: 720, h: 960, d: 307, cx: 359, baseY: 691, from: 42},
  shy: {src: 'basso/16_hide_peek.webm', video: true, w: 720, h: 960, d: 308, cx: 359, baseY: 704},
  heart: {src: 'basso/17_heart.webm', video: true, w: 720, h: 960, d: 383, cx: 355, baseY: 758, from: 36},
};
const SURPRISE_BOTTOM = [750, 750, 753, 758, 763, 771, 777, 779, 784, 788, 795, 799, 800, 802, 803, 805, 806, 807, 809, 810, 813, 815, 815, 816, 817, 818, 819, 819, 820, 820, 821, 821, 821, 822, 822, 823, 823, 824, 824, 824, 825];

const D = 320, GROUND = 1460, CX = 540, STAND_Y = GROUND + 2;
const BUB_Y = 995, BUB_X = 635;

// Lightweight static storybook paper grain texture (fast render, zero compositor stall)
const PaperGrain: React.FC = () => (
  <Img src={staticFile('paper_grain.png')} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, pointerEvents: 'none', opacity: 0.045, mixBlendMode: 'overlay'}} />
);

// Subtle storybook floating stave wisps & hand-drawn notes in the lower sky behind Basso (zero card interference)
const AMBIENT_NOTES: Array<{x: number; y: number; size: number; speed: number; phase: number; color: string; double?: boolean}> = [
  {x: 112, y: 1140, size: 1.05, speed: 0.22, phase: 0.4, color: C.navy},
  {x: 224, y: 1290, size: 0.85, speed: 0.18, phase: 1.9, color: C.orange, double: true},
  {x: 148, y: 1390, size: 0.78, speed: 0.15, phase: 3.1, color: C.navy},
  {x: 924, y: 1120, size: 0.95, speed: 0.20, phase: 2.3, color: C.orange},
  {x: 846, y: 1270, size: 0.88, speed: 0.17, phase: 0.9, color: C.navy, double: true},
  {x: 958, y: 1380, size: 0.80, speed: 0.16, phase: 4.2, color: C.navy},
];
const AmbientStorybook: React.FC<{pulse: number}> = ({pulse}) => {
  const frame = useCurrentFrame();
  const waveShift = Math.sin(frame * 0.03) * 8;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <defs>
        {/* Softly fade stave lines to 0 across Basso's silhouette zone (x=335..778) so lines never show through Basso's hollow eyes */}
        <linearGradient id="staveCenterFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity={1} />
          <stop offset="22%" stopColor="white" stopOpacity={1} />
          <stop offset="31%" stopColor="black" stopOpacity={0} />
          <stop offset="72%" stopColor="black" stopOpacity={0} />
          <stop offset="81%" stopColor="white" stopOpacity={1} />
          <stop offset="100%" stopColor="white" stopOpacity={1} />
        </linearGradient>
        <mask id="staveMask">
          <rect x={0} y={1140} width={1080} height={220} fill="url(#staveCenterFade)" />
        </mask>
      </defs>
      {/* Faint hand-drawn double stave ribbon softly framing the left & right horizon sky */}
      <g opacity={0.055} stroke={C.navy} strokeWidth={2.5} fill="none" strokeLinecap="round" mask="url(#staveMask)">
        <path d={`M -20 ${1230 + waveShift} Q 270 ${1195 - waveShift} 540 ${1235 + waveShift * 0.6} T 1100 ${1220 - waveShift}`} />
        <path d={`M -20 ${1252 + waveShift} Q 270 ${1217 - waveShift} 540 ${1257 + waveShift * 0.6} T 1100 ${1242 - waveShift}`} />
        <path d={`M -20 ${1274 + waveShift} Q 270 ${1239 - waveShift} 540 ${1279 + waveShift * 0.6} T 1100 ${1264 - waveShift}`} />
      </g>
      {AMBIENT_NOTES.map((n, i) => {
        const dy = Math.sin(frame * 0.04 + n.phase) * 10 - ((frame * n.speed) % 46);
        const rot = Math.sin(frame * 0.035 + n.phase) * 7;
        const sc = n.size * (1 + pulse * 0.13);
        const op = 0.075 + pulse * 0.045;
        return (
          <g key={i} transform={`translate(${n.x}, ${n.y + dy}) rotate(${rot}) scale(${sc})`} opacity={op} fill={n.color} stroke={n.color}>
            {n.double ? (
              <>
                <ellipse cx={-10} cy={14} rx={7} ry={5} transform="rotate(-18 -10 14)" stroke="none" />
                <ellipse cx={12} cy={10} rx={7} ry={5} transform="rotate(-18 12 10)" stroke="none" />
                <path d="M -4 13 L -4 -14 L 18 -18 L 18 9" fill="none" strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx={0} cy={12} rx={7.5} ry={5.5} transform="rotate(-18 0 12)" stroke="none" />
                <path d="M 6 10 L 6 -16 Q 16 -12 14 -2" fill="none" strokeWidth={3.2} strokeLinecap="round" />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// Dynamic soft contact shadow grounding Basso physically onto the horizon line
const ContactShadow: React.FC<{fidget: number; lift: number; offsetX?: number}> = ({fidget, lift, offsetX = 0}) => {
  const sx = Math.max(0.58, 1 - fidget * 0.22 - Math.min(0.24, lift / 220));
  const op = Math.max(0.35, 1 - fidget * 0.35 - Math.min(0.3, lift / 240));
  return (
    <svg width={280} height={42} style={{position: 'absolute', left: CX - 140 + offsetX, top: STAND_Y - 19, pointerEvents: 'none', transform: `scaleX(${sx})`, opacity: op}}>
      <defs>
        <radialGradient id="bassoShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.navy} stopOpacity={0.22} />
          <stop offset="65%" stopColor={C.navy} stopOpacity={0.09} />
          <stop offset="100%" stopColor={C.navy} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={140} cy={21} rx={126} ry={16} fill="url(#bassoShadow)" />
    </svg>
  );
};

// Hand-drawn comic emotion stickers next to Basso's upper-left head (shock "? + sweat" on R3 flip, warm sparkles on win)
const BassoSticker: React.FC<{kind: 'shock' | 'win'; delay: number}> = ({kind, delay}) => {
  const f = useCurrentFrame() - delay;
  const {fps} = useVideoConfig();
  if (f < 0) return null;
  const p = spring({frame: f, fps, config: {damping: 10, stiffness: 210}});
  const bob = Math.sin(f * 0.25) * 3;
  if (kind === 'shock') {
    return (
      <svg width={110} height={110} viewBox="0 0 110 110" style={{position: 'absolute', left: CX - 262, top: STAND_Y - 396 + bob, transform: `scale(${p}) rotate(-10deg)`, transformOrigin: '80% 80%', pointerEvents: 'none', overflow: 'visible'}}>
        {/* Hand-drawn question mark */}
        <path d="M 30 34 C 30 16 62 14 62 32 C 62 45 45 48 45 60" fill="none" stroke={C.orange} strokeWidth={9} strokeLinecap="round" />
        <circle cx={45} cy={76} r={5.5} fill={C.orange} />
        {/* Tiny comic sweat drop */}
        <path d="M 84 42 C 92 54 94 64 84 68 C 74 64 76 54 84 42 Z" fill={C.card} stroke={C.navy} strokeWidth={4} strokeLinejoin="round" />
      </svg>
    );
  }
  const fade = interpolate(f, [0, 6, 36, 54], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg width={96} height={96} viewBox="0 0 96 96" style={{position: 'absolute', left: CX - 242, top: STAND_Y - 378 + bob, transform: `scale(${p})`, opacity: fade, pointerEvents: 'none', overflow: 'visible'}}>
      <path d="M 42 12 L 47 32 L 66 37 L 47 42 L 42 62 L 37 42 L 18 37 L 37 32 Z" fill={C.orange} />
      <path d="M 74 56 L 77 66 L 87 69 L 77 72 L 74 82 L 71 72 L 61 69 L 71 66 Z" fill={C.navy} opacity={0.75} />
    </svg>
  );
};

const BassoAsset: React.FC<{a: Asset}> = ({a}) => {
  const s = D / a.d;
  const style: React.CSSProperties = {position: 'absolute', left: CX - a.cx * s, top: STAND_Y - a.baseY * s, width: a.w * s, height: a.h * s};
  return a.video
    ? <OffthreadVideo src={staticFile(a.src)} transparent muted style={style} startFrom={a.from ?? 0} />
    : <Img src={staticFile(a.src)} style={style} />;
};

const Bubble: React.FC<{text: React.ReactNode; delay?: number; y?: number; x?: number; flip?: boolean; still?: boolean; mood?: 'normal' | 'proud' | 'shock'}> = ({
  text, delay = 0, y = 800, x = 672, flip = false, still = false, mood = 'normal',
}) => {
  const f = useCurrentFrame() - delay;
  const {fps} = useVideoConfig();
  const p = still ? 1 : spring({frame: f, fps, config: {damping: 12, stiffness: 200}});
  const shakeX = !still && mood === 'shock' && f >= 0 && f < 16 ? Math.sin(f * 1.9) * Math.exp(-f * 0.22) * 8 : 0;
  const proudRot = !still && mood === 'proud' && f >= 0 && f < 22 ? Math.sin(f * 0.45) * Math.exp(-f * 0.14) * 3.2 : 0;
  return (
    <div style={{
      position: 'absolute', left: x, bottom: 1920 - y, maxWidth: 360, boxSizing: 'border-box',
      transform: `translateX(${shakeX}px) rotate(${proudRot}deg) scale(${p})`, transformOrigin: flip ? '90% 100%' : '10% 100%',
      background: C.card, color: C.navy, fontFamily: FONT, fontWeight: 900, fontSize: 46, lineHeight: 1.05,
      padding: '18px 24px', borderRadius: 34, border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(28,27,46,0.12)',
      whiteSpace: 'pre-line', textWrap: 'balance',
    }}>
      {text}
      <svg width="56" height="48" viewBox="0 0 56 48" style={{position: 'absolute', ...(flip ? {right: -2, transform: 'scaleX(-1)'} : {left: -2}), bottom: -43, overflow: 'visible'}}>
        <path d="M2 0 L50 0 L10 44 Z" fill={C.card} />
        <path d="M4 0 L10 44 L48 0" fill="none" stroke={C.navy} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const Pop: React.FC<{children: React.ReactNode; delay?: number; style?: React.CSSProperties}> = ({children, delay = 0, style}) => {
  const f = useCurrentFrame() - delay;
  const {fps} = useVideoConfig();
  if (f < 0) return null;
  const p = spring({frame: f, fps, config: {damping: 11, stiffness: 170}});
  return <div style={{transform: `scale(${p})`, transformOrigin: 'left center', opacity: Math.min(1, p * 1.5), ...style}}>{children}</div>;
};

type Round = {n: number; grade: number; help: string; ans: 'A' | 'B' | 'C'; basso: 'A' | 'B' | 'C'; say: string; oops?: string; explain: string;
  start: number; audioDelay?: number; play2At: number; audio: string; bassoAt: number; think: number; reveal: number;
  changedIdx: number; dir: 'up' | 'down'; origMidis: number[]; newMidis: number[]; keyRange: [number, number]; repNotes: number[]; end: number};
const RS = ep.rounds as Round[];
const REP_LEAD = ep.repLead;
const roundAt = (f: number) => RS.find((r) => f >= r.start && f < r.end) ?? null;

const OPTS: Array<{k: 'A' | 'B' | 'C'; label: string; idx: number}> = [
  {k: 'A', label: 'Note 2', idx: 1},
  {k: 'B', label: 'Note 3', idx: 2},
  {k: 'C', label: 'Note 4', idx: 3},
];

const NoteStrip: React.FC<{idx: number; active: boolean; dim: boolean}> = ({idx, active, dim}) => {
  const xs = [26, 82, 138, 194];
  return (
    <svg width={220} height={44} style={{display: 'block', marginLeft: 'auto', opacity: dim ? 0.35 : 1}}>
      <line x1={26} y1={22} x2={194} y2={22} stroke={C.line} strokeWidth={3} />
      {xs.map((x, i) => {
        const hit = i === idx;
        return (
          <g key={i}>
            {hit && <circle cx={x} cy={22} r={16} fill="none" stroke={active ? C.orange : C.navy} strokeWidth={3} opacity={0.35} />}
            <circle cx={x} cy={22} r={hit ? 11 : 7} fill={hit ? (active ? C.orange : C.navy) : C.muted} opacity={hit ? 1 : 0.45} />
          </g>
        );
      })}
    </svg>
  );
};

// Crisp illustrated mini piano keyboard inside RevealChange: shows 1st-time key tint + live key presses + bright orange changed key!
const IS_BLACK = (m: number) => [1, 3, 6, 8, 10].includes(m % 12);

// Reveal tool: ONE full-width keyboard (the old 4-dot row said the same thing in a second, smaller way).
//  - navy outline  = the key sounding right now in the replay
//  - dashed orange = where the note was the 1st time ("was")
//  - solid orange  = the changed note, as soon as it sounds
//  - numbers under the keys = which note of the tune sounds on that key (2·4 = notes 2 and 4 share a key)
const KB_X = 250, KB_W = 650, KB_Y = 2, KB_H = 64;
const RevealChange: React.FC<{rd: Round}> = ({rd}) => {
  const frame = useCurrentFrame();
  const fRel = frame - (rd.reveal + REP_LEAD);
  const fade = interpolate(frame - rd.reveal, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lit = (i: number) => fRel >= rd.repNotes[i];
  let playing = -1;
  for (let i = 0; i < rd.repNotes.length; i++) {
    const st = rd.repNotes[i], nx = rd.repNotes[i + 1] ?? st + 18;
    if (fRel >= st && fRel < nx) playing = i;
  }
  const [lo, hi] = rd.keyRange;
  const whites: number[] = [];
  for (let m = lo; m <= hi; m++) if (!IS_BLACK(m)) whites.push(m);
  const kw = KB_W / whites.length, bw = kw * 0.58, bh = KB_H * 0.62;
  const centerX = (m: number) => KB_X + (IS_BLACK(m) ? whites.filter((w) => w < m).length * kw : (whites.indexOf(m) + 0.5) * kw);
  const chgMidi = rd.newMidis[rd.changedIdx], origMidi = rd.origMidis[rd.changedIdx];
  const chgOn = lit(rd.changedIdx);
  const playingMidi = playing >= 0 ? rd.newMidis[playing] : null;
  const keyFill = (m: number, black: boolean) => {
    if (chgOn && m === chgMidi) return C.orange;
    if (m === origMidi && m !== chgMidi) return C.soft;
    if (playingMidi === m) return black ? '#5B5980' : '#E9E4D6';
    return black ? C.navy : C.card;
  };
  const keyStroke = (m: number) => (m === origMidi && m !== chgMidi ? C.orange : playingMidi === m && !(chgOn && m === chgMidi) ? C.navy : C.line);
  const keyStrokeW = (m: number) => (playingMidi === m ? 5 : m === origMidi && m !== chgMidi ? 3 : 2);
  // number badges, one per distinct sounding key
  const badges = new Map<number, number[]>();
  rd.newMidis.forEach((m, i) => badges.set(m, [...(badges.get(m) ?? []), i + 1]));
  return (
    <svg width={900} height={104} style={{display: 'block', opacity: fade, overflow: 'visible'}}>
      <text x={0} y={40} fontFamily={FONT} fontSize={28} fontWeight={900} fill={C.muted} letterSpacing={1.4}>CHANGED</text>
      <text x={0} y={74} fontFamily={FONT} fontSize={25} fontWeight={800} fill={C.orange}>Note {rd.changedIdx + 1} · {rd.dir === 'up' ? 'higher ↑' : 'lower ↓'}</text>
      <rect x={KB_X - 4} y={KB_Y - 4} width={KB_W + 8} height={KB_H + 8} rx={14} fill={C.line} />
      {whites.map((m, i) => {
        const press = playingMidi === m ? 3 : 0;
        return <rect key={m} x={KB_X + i * kw + 2} y={KB_Y + press} width={kw - 4} height={KB_H - press} rx={7} fill={keyFill(m, false)}
          stroke={keyStroke(m)} strokeWidth={keyStrokeW(m)} strokeDasharray={m === origMidi && m !== chgMidi ? '5 4' : undefined} />;
      })}
      {Array.from({length: hi - lo + 1}, (_, k) => lo + k).filter(IS_BLACK).map((m) => {
        const cnt = whites.filter((w) => w < m).length;
        if (cnt <= 0 || cnt >= whites.length) return null;
        return <rect key={m} x={KB_X + cnt * kw - bw / 2} y={KB_Y} width={bw} height={bh} rx={6} fill={keyFill(m, true)}
          stroke={m === chgMidi && chgOn ? C.card : m === origMidi && m !== chgMidi ? C.orange : C.navy} strokeWidth={m === chgMidi && chgOn ? 3 : 2}
          strokeDasharray={m === origMidi && m !== chgMidi ? '5 4' : undefined} />;
      })}
      {origMidi !== chgMidi && !badges.has(origMidi) && (
        <text x={centerX(origMidi)} y={IS_BLACK(origMidi) ? KB_H + 32 : KB_Y + KB_H - 10} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={900} fill={C.orange}>was</text>
      )}
      {[...badges.entries()].map(([m, idxs]) => {
        const on = idxs.some((n) => playing === n - 1), done = idxs.some((n) => lit(n - 1));
        const isChg = m === chgMidi && chgOn;
        const label = idxs.join('·'), w = 30 + (label.length - 1) * 13;
        return (
          <g key={m}>
            <rect x={centerX(m) - w / 2} y={KB_H + 14} width={w} height={28} rx={14} fill={isChg ? C.orange : on ? C.navy : C.line} />
            <text x={centerX(m)} y={KB_H + 35} textAnchor="middle" fontFamily={FONT} fontSize={21} fontWeight={900} fill={isChg || on ? C.card : done ? C.navy : C.muted}>{label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const AddressBar: React.FC<{url: string}> = ({url}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, background: C.card, border: `4px solid ${C.navy}`, borderRadius: 999, padding: '14px 30px 14px 24px', boxShadow: '0 6px 0 rgba(28,27,46,0.12)'}}>
      <svg width="34" height="34" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2.5" fill={C.navy} /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke={C.navy} strokeWidth="2.6" /></svg>
      <span style={{fontWeight: 900, fontSize: 52, color: C.navy, letterSpacing: 0.5}}>{url.split('.app')[0]}<span style={{color: C.orange}}>.app</span>{url.split('.app')[1] ?? ''}</span>
    </div>
    <div style={{fontWeight: 800, fontSize: 34, color: C.muted, paddingLeft: 10}}>Free · in your browser · no download</div>
  </div>
);

export const Short12: React.FC<{url?: string; coverPose?: string}> = ({url = ep.url, coverPose}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const I = ep.intro, E = ep.ending;
  const rd = roundAt(frame);
  const ending = frame >= E.start;
  const shown = rd ?? RS[RS.length - 1];
  const revealed = !!rd && frame >= rd.reveal;
  const inThink = !coverPose && !!rd && frame >= rd.think && frame < rd.reveal;
  const bassoRight = (r: Round) => r.basso === r.ans;

  const pose = (() => {
    if (coverPose) return A[coverPose];
    if (ending) return A.neutral;
    if (!rd) return A.neutral;
    if (frame < rd.bassoAt) return rd.n === 1 ? A.compose : rd.n === 2 ? A.listen : A.listenHard;
    if (frame < rd.reveal) return rd.n === 2 ? A.neutral : A.ponder;
    return bassoRight(rd) ? (rd.n === 1 ? A.aha : A.heart) : A.surprise;
  })();
  const poseStart = coverPose ? frame - 75 : ending ? E.start : !rd ? 0
    : frame < rd.bassoAt ? rd.start
    : frame < rd.reveal ? rd.bassoAt
    : rd.reveal;
  const introFidget = !coverPose && frame >= 2 && frame < 14 ? Math.sin(((frame - 2) / 12) * Math.PI) * 0.75 : 0;
  const fidget = introFidget || (rd && frame >= rd.bassoAt && frame < rd.bassoAt + 12 ? Math.sin(((frame - rd.bassoAt) / 12) * Math.PI) : 0);
  const inSurprise = !coverPose && rd && !bassoRight(rd) && frame >= rd.reveal;
  const sIdx = rd ? frame - rd.reveal : 0;
  const sGrow = inSurprise ? (SURPRISE_BOTTOM[Math.min(sIdx, SURPRISE_BOTTOM.length - 1)] - SURPRISE_BOTTOM[0]) : 0;
  const sScale = inSurprise ? 1 - 0.18 * (sGrow / (SURPRISE_BOTTOM[SURPRISE_BOTTOM.length - 1] - SURPRISE_BOTTOM[0])) : 1;
  const surpriseLift = sGrow * (D / A.surprise.d);

  const marks = [0, 1, 2].map((i) => {
    const r = RS[i];
    return r && frame >= r.reveal ? (bassoRight(r) ? '✓' : '✗') : '·';
  });
  const bannerPop = rd ? spring({frame: frame - rd.start, fps, config: {damping: 12, stiffness: 180}}) : 1;
  const cardSlide = rd && !coverPose && rd.n > 1 ? interpolate(frame - rd.start, [0, 8], [8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const loopDur = pose === A.cheer ? 44 : (pose === A.ponder || pose === A.compose || pose === A.listen || pose === A.listenHard || pose === A.neutral || pose === A.wonder) ? 120 : 0;
  const d0 = rd?.audioDelay ?? 10;
  const inPlay2 = !!rd && !coverPose && frame >= rd.start + d0 + rd.play2At;

  // Live audio-synced note pulse (drives faint ambient notes + listening 4-dot beat strip)
  let notePulse = 0;
  let listenLit = -1;
  if (rd && !coverPose) {
    const p1 = rd.start + d0;
    const p2 = p1 + rd.play2At;
    const rep = rd.reveal + REP_LEAD;
    const bases = revealed ? [rep] : [p1, p2];
    for (const base of bases) {
      for (const off of rd.repNotes) {
        const dt = frame - (base + off);
        if (dt >= 0 && dt < 10) notePulse = Math.max(notePulse, Math.sin((dt / 10) * Math.PI));
      }
    }
    if (!revealed && !inThink) {
      const activeBase = inPlay2 ? p2 : p1;
      for (let i = 0; i < rd.repNotes.length; i++) {
        if (frame >= activeBase + rd.repNotes[i]) listenLit = i;
      }
    }
  }

  // Subtle director micro-camera push on reveal (slightly stronger on R3 plot-twist)
  const camTarget = !coverPose && revealed ? (inSurprise ? 1.02 : 1.013) : 1;
  const camP = !coverPose && rd && revealed
    ? interpolate(frame - rd.reveal, [0, 14, Math.max(20, rd.end - rd.reveal - 10), Math.max(22, rd.end - rd.reveal)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;
  const camScale = 1 + (camTarget - 1) * camP;

  return (
    <AbsoluteFill style={{background: coverPose ? C.cream : 'radial-gradient(circle at 50% 30%, #FAF7F0 0%, #F3EFE6 75%, #EDE6D9 100%)', fontFamily: FONT}}>
      <AbsoluteFill style={{transform: `scale(${camScale})`, transformOrigin: '50% 58%'}}>
        {/* Subtle storybook floating stave & notes in the lower sky */}
        {!coverPose && <AmbientStorybook pulse={notePulse} />}

        {/* header */}
        <div style={{position: 'absolute', top: 108, left: 60, right: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{background: C.navy, color: C.cream, fontWeight: 900, fontSize: 34, letterSpacing: 2, padding: '12px 28px', borderRadius: 40}}>
            BASSO CHALLENGE <span style={{color: C.orange}}>#{ep.episode}</span>
          </div>
          <div style={{fontWeight: 900, fontSize: 40, color: C.navy}}>dottino<span style={{color: C.orange}}>.app</span></div>
        </div>

        {/* card */}
        <div style={{position: 'absolute', top: 214, left: 50, right: 50, background: C.card, borderRadius: 44, padding: '30px 40px 26px', boxShadow: '0 10px 0 rgba(28,27,46,0.07)', border: `3px solid ${C.line}`}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{transform: `scale(${0.9 + 0.1 * bannerPop})`, transformOrigin: 'left center', color: C.orange, fontWeight: 900, fontSize: 32, letterSpacing: 2}}>
              ROUND {shown.n} OF 3 · GRADE {shown.grade} LEVEL
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: 28, color: C.muted}}>
              BASSO {marks.map((mk, i) => {
                const r = RS[i];
                const popSc = !coverPose && r && frame >= r.reveal
                  ? 0.72 + 0.28 * spring({frame: frame - r.reveal, fps, config: {damping: 9, stiffness: 230}})
                  : 1;
                return (
                  <span key={i} style={{
                    width: 40, height: 40, borderRadius: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: mk === '✓' ? C.navy : mk === '✗' ? C.orange : C.line, color: C.card, fontSize: 26,
                    transform: `scale(${popSc})`,
                  }}>{mk === '·' ? '' : mk}</span>
                );
              })}
            </div>
          </div>
          <div style={{fontWeight: 900, fontSize: 66, color: C.navy, lineHeight: 1.06, marginTop: 10}}>{ep.question}</div>
          <div style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10, transform: `translateY(${cardSlide}px)`}}>
            {OPTS.map((o) => {
              const right = revealed && o.k === shown.ans, dim = revealed && !right;
              return (
                <div key={o.k} style={{display: 'flex', alignItems: 'center', gap: 18, borderRadius: 24, padding: '8px 22px 8px 18px',
                  border: `${right ? 6 : 3}px solid ${right ? C.orange : C.line}`, background: right ? C.card : '#F7F3EB'}}>
                  <div style={{fontWeight: 900, fontSize: 44, width: 38, color: right ? C.orange : dim ? C.muted : C.navy}}>{o.k}</div>
                  <div style={{fontWeight: 900, fontSize: 38, color: right ? C.orange : dim ? C.muted : C.navy}}>{o.label}</div>
                  <NoteStrip idx={o.idx} active={right} dim={dim} />
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 16, minHeight: 104, display: 'flex', alignItems: 'center'}}>
            {rd && !revealed && !inThink && (
              <div style={{display: 'flex', alignItems: 'center', gap: 20, width: '100%'}}>
                <div style={{fontWeight: 900, fontSize: 30, color: C.muted, letterSpacing: 2}}>HELP</div>
                <div style={{fontWeight: 900, fontSize: 34, color: rd.n === 3 ? C.orange : C.navy}}>{rd.help}</div>
                {!coverPose && (
                  <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14}}>
                    {/* Live 4-beat audio-synced listening dots (no spoiler) */}
                    <div style={{display: 'flex', alignItems: 'center', gap: 8, paddingRight: 4}}>
                      {[0, 1, 2, 3].map((i) => {
                        const on = i <= listenLit;
                        const activeNow = i === listenLit;
                        return (
                          <span key={i} style={{
                            width: 13, height: 13, borderRadius: 99, display: 'inline-block',
                            background: on ? (inPlay2 ? C.orange : C.navy) : C.line,
                            transform: `scale(${activeNow ? 1 + notePulse * 0.35 : 1})`,
                          }} />
                        );
                      })}
                    </div>
                    <span style={{padding: '6px 16px', borderRadius: 999, fontWeight: 900, fontSize: 26,
                      background: !inPlay2 ? C.navy : C.line, color: !inPlay2 ? C.card : C.muted}}>1st</span>
                    <span style={{padding: '6px 16px', borderRadius: 999, fontWeight: 900, fontSize: 26,
                      background: inPlay2 ? C.orange : C.line, color: inPlay2 ? C.card : C.muted}}>2nd</span>
                  </div>
                )}
              </div>
            )}
            {inThink && (() => {
              const total = rd.reveal - rd.think, t = frame - rd.think;
              const p = t / total, sec = Math.max(1, Math.ceil((total - t) / 30));
              const pulse = t % 30 < 6 ? 1 + 0.08 * Math.sin(((t % 30) / 6) * Math.PI) : 1;
              const R0 = 32, L = 2 * Math.PI * R0;
              return (
                <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
                  <svg width={80} height={80} style={{transform: `scale(${pulse})`}}>
                    <circle cx={40} cy={40} r={R0} fill="none" stroke={C.line} strokeWidth={9} />
                    <circle cx={40} cy={40} r={R0} fill="none" stroke={C.orange} strokeWidth={9} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * p} transform="rotate(-90 40 40)" />
                    <text x={40} y={50} textAnchor="middle" fontFamily={FONT} fontSize={32} fontWeight={900} fill={C.navy}>{sec}</text>
                  </svg>
                  <div style={{lineHeight: 1.15}}>
                    <div style={{fontWeight: 900, fontSize: 36, color: C.navy}}>A, B or C?</div>
                    <div style={{fontWeight: 900, fontSize: 32, color: C.orange}}>Lock in your answer.</div>
                  </div>
                </div>
              );
            })()}
            {rd && revealed && <RevealChange rd={rd} />}
            {ending && <div style={{fontWeight: 900, fontSize: 40, color: C.navy}}>Basso got <span style={{color: C.orange}}>2/3</span>. Round 3 got him.</div>}
          </div>
        </div>

        {/* ground */}
        <div style={{position: 'absolute', top: GROUND, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, #E7E0D2 0%, #E0D7C5 100%)', borderTop: `6px solid ${C.line}`}} />

        {/* Dynamic contact shadow beneath Basso */}
        <ContactShadow fidget={fidget} lift={surpriseLift} offsetX={pose === A.shy ? 130 : 0} />

        {/* Basso */}
        <AbsoluteFill style={{transformOrigin: `${CX}px ${STAND_Y}px`, transform: `translateY(${-fidget * 26 - surpriseLift * sScale}px) scale(${sScale})`}}>
          <Sequence from={poseStart} layout="none" key={poseStart + (pose?.src ?? '')}>
            {loopDur > 0 ? <Loop durationInFrames={loopDur} layout="none"><BassoAsset a={pose} /></Loop> : <BassoAsset a={pose} />}
          </Sequence>
        </AbsoluteFill>

        {/* Comic emotion stickers next to Basso's head (skip win sparkle on aha which already has built-in rays) */}
        {!coverPose && rd && revealed && (!bassoRight(rd) || pose !== A.aha) && (
          <BassoSticker kind={bassoRight(rd) ? 'win' : 'shock'} delay={rd.reveal + (bassoRight(rd) ? 4 : 8)} />
        )}

        {/* bubbles */}
        <Sequence from={I.start + 2} durationInFrames={I.end - I.start - 2} layout="none">
          <Bubble text={ep.introSay} delay={0} y={BUB_Y} x={BUB_X} still={!!coverPose} mood="proud" />
        </Sequence>
        {RS.map((r) => (
          <React.Fragment key={r.n}>
            <Sequence from={r.bassoAt} durationInFrames={r.reveal - r.bassoAt} layout="none">
              <Bubble text={r.say} y={BUB_Y} x={coverPose ? BUB_X + 70 : BUB_X} still={!!coverPose} mood="proud" />
            </Sequence>
            {!bassoRight(r) && <Sequence from={r.reveal + 8} durationInFrames={r.end - r.reveal - 8} layout="none"><Bubble text={r.oops ?? ep.oops} y={BUB_Y} x={BUB_X} still={!!coverPose} mood="shock" /></Sequence>}
          </React.Fragment>
        ))}
        {!coverPose && (
          <Sequence from={E.start + 8} durationInFrames={ep.durationInFrames - E.start - 8} layout="none">
            <Bubble text="Beat my 2/3?" y={BUB_Y} x={BUB_X} mood="proud" />
          </Sequence>
        )}

        {/* ground caption */}
        <div style={{position: 'absolute', top: GROUND + 68, left: 64, right: 64, fontWeight: 900, fontSize: 52, color: C.navy, lineHeight: 1.12, textWrap: 'balance'}}>
          {!coverPose && frame < RS[0].reveal && <Pop delay={4}>Keep score: 1 point a round.</Pop>}
          {!coverPose && rd && rd.n === 3 && frame < rd.reveal && <Pop delay={rd.start + 4} style={{color: C.orange}}>No help now. Trust your ear.</Pop>}
          {!coverPose && rd && revealed && frame < rd.reveal + REP_LEAD + rd.repNotes[rd.repNotes.length - 1] + 2 && <Pop delay={rd.reveal + 4}>Listen again. Watch the change.</Pop>}
          {!coverPose && rd && frame >= rd.reveal + REP_LEAD + rd.repNotes[rd.repNotes.length - 1] + 2 && (
            <Pop delay={rd.reveal + REP_LEAD + rd.repNotes[rd.repNotes.length - 1] + 2}><span style={{color: C.orange}}>{rd.ans}.</span> {rd.explain}</Pop>
          )}
          {!coverPose && ending && (
            <Pop delay={E.start + 4}>
              <div>Did you get 3/3?</div><div style={{color: C.orange}}>Comment your score 👇</div>
              <div style={{marginTop: 22}}><AddressBar url={url} /></div>
            </Pop>
          )}
        </div>
      </AbsoluteFill>

      {/* Subtle warm storybook paper grain over the scene (omitted on cover so feed cream matches #8-#11) */}
      {!coverPose && <PaperGrain />}

      {/* audio */}
      {!coverPose && RS.map((r) => {
        const delay0 = r.audioDelay ?? 10;
        return (
          <React.Fragment key={'a' + r.n}>
            <Sequence from={r.start + delay0} durationInFrames={r.think - r.start - delay0} layout="none">
              <Audio src={staticFile(r.audio)} volume={(f) => {
                const dur = r.think - r.start - delay0;
                return interpolate(f, [dur - 14, dur - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              }} />
            </Sequence>
            <Sequence from={r.reveal + REP_LEAD} durationInFrames={r.end - r.reveal - REP_LEAD} layout="none">
              <Audio src={staticFile(r.audio.replace('.wav', '_replay.wav'))} volume={(f) => interpolate(f, [r.end - r.reveal - REP_LEAD - 12, r.end - r.reveal - REP_LEAD - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
            </Sequence>
          </React.Fragment>
        );
      })}
      {!coverPose && ep.sfx.map((s, i) => (
        <Sequence key={i} from={s.at} layout="none"><Audio src={staticFile(`audio/sfx_${s.name}.wav`)} volume={s.gain} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
