import React from 'react';
import {Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Shared Craft v2 Design System & Reusable Components for Basso Challenge (#13+)
export const C = {
  cream: '#F3EFE6',
  ground: '#E7E0D2',
  navy: '#1C1B2E',
  orange: '#EE6A45',
  card: '#FFFDF8',
  muted: '#8A8578',
  line: '#DED6C6',
  soft: '#F6C9B8',
};
export const FONT = 'Nunito, sans-serif';
export const D = 320;
export const GROUND = 1460;
export const CX = 540;
export const STAND_Y = GROUND + 2;
export const BUB_X = 635;
export const BUB_Y_2OPT = 945;
export const BUB_Y_3OPT = 995;

export type Asset = {src: string; video: boolean; w: number; h: number; d: number; cx: number; baseY: number; from?: number};
export const BASSO_ASSETS: Record<string, Asset> = {
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

export const SURPRISE_BOTTOM = [750, 750, 753, 758, 763, 771, 777, 779, 784, 788, 795, 799, 800, 802, 803, 805, 806, 807, 809, 810, 813, 815, 815, 816, 817, 818, 819, 819, 820, 820, 821, 821, 821, 822, 822, 823, 823, 824, 824, 824, 825];

export const PaperGrain: React.FC = () => (
  <Img src={staticFile('paper_grain.png')} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, pointerEvents: 'none', opacity: 0.045, mixBlendMode: 'overlay'}} />
);

const AMBIENT_NOTES: Array<{x: number; y: number; size: number; speed: number; phase: number; color: string; double?: boolean}> = [
  {x: 112, y: 1140, size: 1.05, speed: 0.22, phase: 0.4, color: C.navy},
  {x: 224, y: 1290, size: 0.85, speed: 0.18, phase: 1.9, color: C.orange, double: true},
  {x: 148, y: 1390, size: 0.78, speed: 0.15, phase: 3.1, color: C.navy},
  {x: 924, y: 1120, size: 0.95, speed: 0.20, phase: 2.3, color: C.orange},
  {x: 846, y: 1270, size: 0.88, speed: 0.17, phase: 0.9, color: C.navy, double: true},
  {x: 958, y: 1380, size: 0.80, speed: 0.16, phase: 4.2, color: C.navy},
];

// Eye-safe storybook floating stave wisps & hand-drawn notes (masked cleanly across x=335..778 so lines never bleed through Basso's hollow eyes)
export const AmbientStorybook: React.FC<{pulse?: number}> = ({pulse = 0}) => {
  const frame = useCurrentFrame();
  const waveShift = Math.sin(frame * 0.03) * 8;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <defs>
        <linearGradient id="bkStaveCenterFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity={1} />
          <stop offset="22%" stopColor="white" stopOpacity={1} />
          <stop offset="31%" stopColor="black" stopOpacity={0} />
          <stop offset="72%" stopColor="black" stopOpacity={0} />
          <stop offset="81%" stopColor="white" stopOpacity={1} />
          <stop offset="100%" stopColor="white" stopOpacity={1} />
        </linearGradient>
        <mask id="bkStaveMask">
          <rect x={0} y={1140} width={1080} height={220} fill="url(#bkStaveCenterFade)" />
        </mask>
      </defs>
      <g opacity={0.055} stroke={C.navy} strokeWidth={2.5} fill="none" strokeLinecap="round" mask="url(#bkStaveMask)">
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

export const ContactShadow: React.FC<{fidget: number; lift: number; offsetX?: number}> = ({fidget, lift, offsetX = 0}) => {
  const sx = Math.max(0.58, 1 - fidget * 0.22 - Math.min(0.24, lift / 220));
  const op = Math.max(0.35, 1 - fidget * 0.35 - Math.min(0.3, lift / 240));
  return (
    <svg width={280} height={42} style={{position: 'absolute', left: CX - 140 + offsetX, top: STAND_Y - 19, pointerEvents: 'none', transform: `scaleX(${sx})`, opacity: op}}>
      <defs>
        <radialGradient id="bkBassoShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.navy} stopOpacity={0.22} />
          <stop offset="65%" stopColor={C.navy} stopOpacity={0.09} />
          <stop offset="100%" stopColor={C.navy} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={140} cy={21} rx={126} ry={16} fill="url(#bkBassoShadow)" />
    </svg>
  );
};

export const BassoSticker: React.FC<{kind: 'shock' | 'win' | 'crown'; delay: number}> = ({kind, delay}) => {
  const f = useCurrentFrame() - delay;
  const {fps} = useVideoConfig();
  if (f < 0) return null;
  const p = spring({frame: f, fps, config: {damping: 10, stiffness: 210}});
  const bob = Math.sin(f * 0.25) * 3;
  if (kind === 'shock') {
    return (
      <svg width={110} height={110} viewBox="0 0 110 110" style={{position: 'absolute', left: CX - 262, top: STAND_Y - 396 + bob, transform: `scale(${p}) rotate(-10deg)`, transformOrigin: '80% 80%', pointerEvents: 'none', overflow: 'visible'}}>
        <path d="M 30 34 C 30 16 62 14 62 32 C 62 45 45 48 45 60" fill="none" stroke={C.orange} strokeWidth={9} strokeLinecap="round" />
        <circle cx={45} cy={76} r={5.5} fill={C.orange} />
        <path d="M 84 42 C 92 54 94 64 84 68 C 74 64 76 54 84 42 Z" fill={C.card} stroke={C.navy} strokeWidth={4} strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'crown') {
    return (
      <svg width={110} height={84} viewBox="0 0 110 84" style={{position: 'absolute', left: CX - 255, top: STAND_Y - 390 + bob, transform: `scale(${p}) rotate(-14deg)`, transformOrigin: '70% 85%', pointerEvents: 'none', overflow: 'visible'}}>
        <path d="M 16 64 L 12 24 L 38 42 L 55 14 L 72 42 L 98 24 L 94 64 Z" fill="#F4B942" stroke={C.navy} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={12} cy={20} r={5} fill={C.orange} />
        <circle cx={55} cy={10} r={5.5} fill={C.orange} />
        <circle cx={98} cy={20} r={5} fill={C.orange} />
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

export const BassoAsset: React.FC<{a: Asset}> = ({a}) => {
  const s = D / a.d;
  const style: React.CSSProperties = {position: 'absolute', left: CX - a.cx * s, top: STAND_Y - a.baseY * s, width: a.w * s, height: a.h * s};
  return a.video
    ? <OffthreadVideo src={staticFile(a.src)} transparent muted style={style} startFrom={a.from ?? 0} />
    : <Img src={staticFile(a.src)} style={style} />;
};

export const Bubble: React.FC<{text: React.ReactNode; delay?: number; y?: number; x?: number; flip?: boolean; still?: boolean; mood?: 'normal' | 'proud' | 'shock'}> = ({
  text, delay = 0, y = BUB_Y_3OPT, x = BUB_X, flip = false, still = false, mood = 'normal',
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

export const Pop: React.FC<{children: React.ReactNode; delay?: number; style?: React.CSSProperties}> = ({children, delay = 0, style}) => {
  const f = useCurrentFrame() - delay;
  const {fps} = useVideoConfig();
  if (f < 0) return null;
  const p = spring({frame: f, fps, config: {damping: 11, stiffness: 170}});
  return <div style={{transform: `scale(${p})`, transformOrigin: 'left center', opacity: Math.min(1, p * 1.5), ...style}}>{children}</div>;
};

const IS_BLACK = (m: number) => [1, 3, 6, 8, 10].includes(m % 12);
export const MiniPiano: React.FC<{range: [number, number]; activeMidi: number | null; origMidi?: number; highlightMidi?: number; highlightLit?: boolean; x: number; y: number; w: number; h: number}> = ({
  range, activeMidi, origMidi, highlightMidi, highlightLit = false, x, y, w, h,
}) => {
  const whites: number[] = [];
  const blacks: Array<{m: number; afterWhiteIdx: number}> = [];
  for (let m = range[0]; m <= range[1]; m++) {
    if (IS_BLACK(m)) blacks.push({m, afterWhiteIdx: whites.length - 1});
    else whites.push(m);
  }
  const kw = w / whites.length;
  const bw = kw * 0.64, bh = h * 0.62;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-3} y={-3} width={w + 6} height={h + 6} rx={12} fill={C.line} />
      {whites.map((m, i) => {
        const isHi = highlightLit && m === highlightMidi;
        const isOrig = origMidi !== undefined && m === origMidi;
        const isNow = activeMidi === m;
        const fill = isHi ? C.orange : isNow ? '#42405C' : isOrig ? C.soft : C.card;
        return (
          <g key={m}>
            <rect x={i * kw + 1} y={1} width={kw - 2} height={h - 2} rx={6} fill={fill} stroke={isOrig && !isHi ? C.orange : C.line} strokeWidth={isOrig && !isHi ? 2.5 : 1.5} strokeDasharray={isOrig && !isHi ? '4 3' : undefined} />
            {isHi && <circle cx={i * kw + kw / 2} cy={h - 15} r={5.5} fill={C.card} />}
          </g>
        );
      })}
      {blacks.map(({m, afterWhiteIdx}) => {
        if (afterWhiteIdx < 0 || afterWhiteIdx >= whites.length - 1) return null;
        const bx = (afterWhiteIdx + 1) * kw - bw / 2;
        const isHi = highlightLit && m === highlightMidi;
        const isNow = activeMidi === m;
        const fill = isHi ? C.orange : isNow ? '#555375' : C.navy;
        return (
          <g key={m}>
            <rect x={bx} y={0} width={bw} height={bh} rx={5} fill={fill} stroke={isHi ? C.card : C.navy} strokeWidth={isHi ? 2 : 1} />
            {isHi && <circle cx={bx + bw / 2} cy={bh - 12} r={4.5} fill={C.card} />}
          </g>
        );
      })}
    </g>
  );
};

export const AddressBar: React.FC<{url: string}> = ({url}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, background: C.card, border: `4px solid ${C.navy}`, borderRadius: 999, padding: '14px 30px 14px 24px', boxShadow: '0 6px 0 rgba(28,27,46,0.12)'}}>
      <svg width="34" height="34" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2.5" fill={C.navy} /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke={C.navy} strokeWidth="2.6" /></svg>
      <span style={{fontWeight: 900, fontSize: 52, color: C.navy, letterSpacing: 0.5}}>{url.split('.app')[0]}<span style={{color: C.orange}}>.app</span>{url.split('.app')[1] ?? ''}</span>
    </div>
    <div style={{fontWeight: 800, fontSize: 34, color: C.muted, paddingLeft: 10}}>Free · in your browser · no download</div>
  </div>
);
