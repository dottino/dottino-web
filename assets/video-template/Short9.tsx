import React from 'react';
import {
  AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import ep from './ep9.json';

// Episode 9: three rounds of "Legato or staccato?", Grade 3 → 4 → 5 level. Built on the Short8 template
// (same header, card, Basso poses, bubbles, think ring, ground caption, address-bar ending).
// The rhythm grid of #8 is replaced by an articulation strip: note heads with a slur (A, legato)
// or staccato dots (B). At the reveal the right strip lights note by note as the replay plays.
const C = {cream: '#F3EFE6', ground: '#E7E0D2', navy: '#1C1B2E', orange: '#EE6A45', card: '#FFFDF8', muted: '#8A8578', line: '#DED6C6', soft: '#F6C9B8'};
const FONT = 'Nunito, sans-serif';
const FPB = (60 / ep.bpm) * ep.fps;

type Asset = {src: string; video: boolean; w: number; h: number; d: number; cx: number; cy: number; from?: number};
const A: Record<string, Asset> = {
  think: {src: 'basso/15_ponder.webm', video: true, w: 720, h: 960, d: 310, cx: 360, cy: 526},
  neutral: {src: 'basso/20_idle.webm', video: true, w: 720, h: 960, d: 309, cx: 363, cy: 529},
  listen: {src: 'basso/12_listen_hard.webm', video: true, w: 720, h: 960, d: 311, cx: 361, cy: 521},
  listenHard: {src: 'basso/19_hum.webm', video: true, w: 720, h: 960, d: 337, cx: 339, cy: 592},
  ponder: {src: 'basso/15_ponder.webm', video: true, w: 720, h: 960, d: 310, cx: 360, cy: 526},
  cheer: {src: 'basso/21_bounce.webm', video: true, w: 720, h: 960, d: 373, cx: 360, cy: 520},
  surprise: {src: 'basso/11_surprise.webm', video: true, w: 720, h: 960, d: 347, cx: 357, cy: 576},
  wonder: {src: 'basso/13_wonder.webm', video: true, w: 720, h: 960, d: 299, cx: 360, cy: 551},
  aha: {src: 'basso/14_aha.webm', video: true, w: 720, h: 960, d: 305, cx: 360, cy: 540, from: 42},
  shy: {src: 'basso/16_hide_peek.webm', video: true, w: 720, h: 960, d: 304, cx: 359, cy: 536},
  heart: {src: 'basso/17_heart.webm', video: true, w: 720, h: 960, d: 395, cx: 355, cy: 543, from: 36},
};
// bottom edge (px, asset scale) of the surprise clip per frame: keeps his feet on the ground while he swells
const SURPRISE_BOTTOM = [750, 750, 753, 758, 763, 771, 777, 779, 784, 788, 795, 799, 800, 802, 803, 805, 806, 807, 809, 810, 813, 815, 815, 816, 817, 818, 819, 819, 820, 820, 821, 821, 821, 822, 822, 823, 823, 824, 824, 824, 825];

const D = 330, GROUND = 1460, CX = 540, CY = GROUND - D / 2 - 72;
const BUB_Y = 960, BUB_Y_REVEAL = 1000;

const BassoAsset: React.FC<{a: Asset}> = ({a}) => {
  const s = D / a.d;
  const style: React.CSSProperties = {position: 'absolute', left: CX - a.cx * s, top: CY - a.cy * s, width: a.w * s, height: a.h * s};
  return a.video
    ? <OffthreadVideo src={staticFile(a.src)} transparent muted style={style} startFrom={a.from ?? 0} />
    : <Img src={staticFile(a.src)} style={style} />;
};

const Bubble: React.FC<{text: React.ReactNode; delay?: number; y?: number; x?: number; flip?: boolean}> = ({text, delay = 0, y = 800, x = 672, flip = false}) => {
  const f = useCurrentFrame() - delay;
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 12, stiffness: 200}});
  return (
    <div style={{
      position: 'absolute', left: x, bottom: 1920 - y, maxWidth: 400, boxSizing: 'border-box',
      transform: `scale(${p})`, transformOrigin: flip ? '90% 100%' : '10% 100%',
      background: C.card, color: C.navy, fontFamily: FONT, fontWeight: 900, fontSize: 50, lineHeight: 1.05,
      padding: '22px 28px', borderRadius: 36, border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(28,27,46,0.12)',
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

type Round = {n: number; grade: number; help: string; notes: number[]; ans: 'A' | 'B'; basso: 'A' | 'B'; say: string; explain: string;
  start: number; audioDelay?: number; audio: string; countIn: boolean; clicks: boolean; bassoAt: number; think: number; reveal: number; end: number};
const RS = ep.rounds as Round[];
const roundAt = (f: number) => RS.find((r) => f >= r.start && f < r.end) ?? null;

// articulation strip: same footprint as the #8 rhythm grid (820 × 74)
const GW = 820, GH = 74;
const Strip: React.FC<{n: number; kind: 'legato' | 'staccato'; fillFrom?: number | null; dim: boolean}> = ({n, kind, fillFrom, dim}) => {
  const frame = useCurrentFrame();
  const x0 = 70, x1 = GW - 70, step = (x1 - x0) / (n - 1), cy = 46, r = 15;
  // note spacing must match the audio: 4 notes = 1 beat apart (R1); 5 notes across 4 beats = 0.8 beat apart (R2, R3)
  const gap = (n === 4 ? 1 : 4 / n) * FPB;
  const lit = (i: number) => fillFrom != null && frame >= fillFrom + i * gap;
  const pop = (i: number) => { const a = fillFrom != null ? frame - (fillFrom + i * gap) : -1; return a >= 0 && a < 7 ? 1 + 0.3 * Math.sin((a / 7) * Math.PI) : 1; };
  const prog = fillFrom != null ? Math.max(0, Math.min(1, (frame - fillFrom) / ((n - 1) * gap))) : 0;
  const slur = `M${x0} ${cy - 24} Q${GW / 2} ${cy - 62} ${x1} ${cy - 24}`;
  const slurLen = (x1 - x0) * 1.08;
  const els: React.ReactNode[] = [];
  if (kind === 'legato') {
    els.push(<path key="s" d={slur} fill="none" stroke={C.navy} strokeWidth={6} strokeLinecap="round" opacity={dim ? 0.35 : 1} />);
    if (fillFrom != null && prog > 0) els.push(<path key="sf" d={slur} fill="none" stroke={C.orange} strokeWidth={6} strokeLinecap="round" strokeDasharray={slurLen} strokeDashoffset={slurLen * (1 - prog)} />);
  }
  for (let i = 0; i < n; i++) {
    const x = x0 + i * step, col = lit(i) ? C.orange : C.navy;
    els.push(<ellipse key={'h' + i} cx={x} cy={cy} rx={r * 1.25 * pop(i)} ry={r * pop(i)} transform={`rotate(-20 ${x} ${cy})`} fill={col} opacity={dim ? 0.35 : 1} />);
    if (kind === 'staccato') els.push(<circle key={'d' + i} cx={x} cy={cy - 30} r={6.5 * pop(i)} fill={col} opacity={dim ? 0.35 : 1} />);
  }
  return <svg width={GW} height={GH} style={{display: 'block', overflow: 'visible'}}>{els}</svg>;
};

const Pulse: React.FC<{rd: Round}> = ({rd}) => {
  const frame = useCurrentFrame();
  const t = (frame - rd.start - (rd.audioDelay ?? 6)) / FPB;
  const helpBeats = (rd.countIn ? 4 : 0) + (rd.clicks ? 4 : 0);
  const active = rd.countIn || rd.clicks;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{fontWeight: 900, fontSize: 30, color: C.muted, letterSpacing: 2}}>HELP</div>
      <div style={{fontWeight: 900, fontSize: 34, color: active ? C.navy : C.orange}}>{rd.help}</div>
      <div style={{display: 'flex', gap: 14, marginLeft: 'auto'}}>
        {[0, 1, 2, 3].map((b) => {
          const lit = active && t >= 0 && t < helpBeats && Math.floor(t) % 4 === b;
          return <div key={b} style={{width: b === 0 ? 30 : 22, height: b === 0 ? 30 : 22, borderRadius: 20, background: lit ? C.orange : active ? C.line : 'transparent', border: active ? 'none' : `3px dashed ${C.line}`}} />;
        })}
      </div>
    </div>
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

export const Short9: React.FC<{url?: string; coverPose?: string}> = ({url = ep.url, coverPose}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const E = ep.ending;
  const rd = roundAt(frame);
  const ending = frame >= E.start;
  const shown = rd ?? RS[RS.length - 1];
  const revealed = !!rd && frame >= rd.reveal;
  const bassoRight = (r: Round) => r.basso === r.ans;

  const pose = (() => {
    if (coverPose) return A[coverPose];
    if (ending) return A.shy;
    if (!rd) return A.neutral;
    if (frame < rd.bassoAt) return rd.n === 1 ? A.listen : rd.n === 2 ? A.listenHard : A.ponder;
    if (frame < rd.reveal) return A.cheer;
    return bassoRight(rd) ? A.heart : A.surprise;
  })();
  const poseStart = coverPose ? frame - 60 : ending ? E.start : !rd ? 0 : frame < rd.bassoAt ? rd.start : frame < rd.reveal ? rd.bassoAt : rd.reveal;
  const fidget = rd && frame >= rd.bassoAt && frame < rd.bassoAt + 12 ? Math.sin(((frame - rd.bassoAt) / 12) * Math.PI) : 0;
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

  return (
    <AbsoluteFill style={{background: C.cream, fontFamily: FONT}}>
      {/* header */}
      <div style={{position: 'absolute', top: 108, left: 60, right: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{background: C.navy, color: C.cream, fontWeight: 900, fontSize: 34, letterSpacing: 2, padding: '12px 28px', borderRadius: 40}}>
          BASSO CHALLENGE <span style={{color: C.orange}}>#{ep.episode}</span>
        </div>
        <div style={{fontWeight: 900, fontSize: 40, color: C.navy}}>dottino<span style={{color: C.orange}}>.app</span></div>
      </div>

      {/* card */}
      <div style={{position: 'absolute', top: 214, left: 50, right: 50, background: C.card, borderRadius: 44, padding: '30px 40px 30px', boxShadow: '0 10px 0 rgba(28,27,46,0.07)', border: `3px solid ${C.line}`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{transform: `scale(${0.9 + 0.1 * bannerPop})`, transformOrigin: 'left center', color: C.orange, fontWeight: 900, fontSize: 32, letterSpacing: 2}}>
            ROUND {shown.n} OF 3 · GRADE {shown.grade} LEVEL
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: 28, color: C.muted}}>
            BASSO {marks.map((mk, i) => <span key={i} style={{width: 40, height: 40, borderRadius: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: mk === '✓' ? C.navy : mk === '✗' ? C.orange : C.line, color: C.card, fontSize: 26}}>{mk === '·' ? '' : mk}</span>)}
          </div>
        </div>
        <div style={{fontWeight: 900, fontSize: 72, color: C.navy, lineHeight: 1.05, marginTop: 10}}>{ep.question}</div>
        <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14}}>
          {(['A', 'B'] as const).map((k) => {
            const right = revealed && k === shown.ans, dim = revealed && !right;
            return (
              <div key={k} style={{display: 'flex', alignItems: 'center', gap: 18, borderRadius: 26, padding: '14px 12px 6px 18px',
                border: `${right ? 6 : 3}px solid ${right ? C.orange : C.line}`, background: right ? C.card : '#F7F3EB'}}>
                <div style={{fontWeight: 900, fontSize: 52, width: 40, color: right ? C.orange : dim ? C.muted : C.navy}}>{k}</div>
                <Strip n={shown.notes.length} kind={k === 'A' ? 'legato' : 'staccato'} dim={dim} fillFrom={right ? shown.reveal + 2 : null} />
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 20, minHeight: 92, display: 'flex', alignItems: 'center'}}>
          {rd && !revealed && <div style={{width: '100%'}}><Pulse rd={rd} /></div>}
          {rd && revealed && <Pop delay={rd.reveal + 4} style={{fontWeight: 900, fontSize: 40, lineHeight: 1.12, color: C.navy}}><span style={{color: C.orange}}>{rd.ans === 'A' ? 'Legato.' : 'Staccato.'}</span> {rd.explain}</Pop>}
          {ending && <div style={{fontWeight: 900, fontSize: 40, color: C.navy}}>Basso got <span style={{color: C.orange}}>2/3</span>. Round 3 got him.</div>}
        </div>
      </div>

      {/* ground */}
      <div style={{position: 'absolute', top: GROUND, left: 0, right: 0, bottom: 0, background: C.ground, borderTop: `6px solid ${C.line}`}} />

      {/* Basso */}
      <AbsoluteFill style={{transformOrigin: `${CX}px ${CY + D / 2}px`, transform: `translateY(${-fidget * 26 - surpriseLift * sScale}px) scale(${sScale})`}}>
        <Sequence from={poseStart} layout="none" key={poseStart + (pose?.src ?? '')}>
          {pose === A.cheer ? <Loop durationInFrames={44} layout="none"><BassoAsset a={pose} /></Loop> : <BassoAsset a={pose} />}
        </Sequence>
      </AbsoluteFill>

      {/* bubbles */}
      {RS.map((r) => (
        <React.Fragment key={r.n}>
          <Sequence from={r.bassoAt} durationInFrames={r.reveal - r.bassoAt} layout="none"><Bubble text={r.say} y={coverPose ? BUB_Y - 40 : BUB_Y} x={640} /></Sequence>
          {!bassoRight(r) && <Sequence from={r.reveal + 8} durationInFrames={r.end - r.reveal - 8} layout="none"><Bubble text={ep.oops} y={BUB_Y_REVEAL} x={640} /></Sequence>}
        </React.Fragment>
      ))}

      {/* think time ring */}
      {rd && frame >= rd.think && frame < rd.reveal && (() => {
        const p = (frame - rd.think) / (rd.reveal - rd.think), R0 = 34, L = 2 * Math.PI * R0;
        return (
          <div style={{position: 'absolute', top: 1015, left: 80, display: 'flex', alignItems: 'center', gap: 18}}>
            <svg width={84} height={84}><circle cx={42} cy={42} r={R0} fill="none" stroke={C.line} strokeWidth={10} />
              <circle cx={42} cy={42} r={R0} fill="none" stroke={C.orange} strokeWidth={10} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * p} transform="rotate(-90 42 42)" /></svg>
            <div style={{fontWeight: 900, fontSize: 46, color: C.navy}}>A or B?</div>
          </div>
        );
      })()}

      {/* ground caption */}
      <div style={{position: 'absolute', top: GROUND + 64, left: 64, right: 64, fontWeight: 900, fontSize: 52, color: C.navy, lineHeight: 1.12}}>
        {!coverPose && frame < RS[0].reveal && <Pop delay={8}>Keep score: 1 point a round.</Pop>}
        {!coverPose && rd && rd.n === 3 && frame < rd.reveal && <Pop delay={rd.start + 4} style={{color: C.orange}}>Follow the tune on top.</Pop>}
        {!coverPose && ending && (
          <Pop delay={E.start + 4}>
            <div>Did you get 3/3?</div><div style={{color: C.orange}}>Comment your score 👇</div>
            <div style={{marginTop: 22}}><AddressBar url={url} /></div>
          </Pop>
        )}
      </div>

      {/* audio */}
      {!coverPose && RS.map((r) => {
        const d0 = r.audioDelay ?? 6;
        return (
          <React.Fragment key={'a' + r.n}>
            <Sequence from={r.start + d0} durationInFrames={r.think - r.start - d0} layout="none"><Audio src={staticFile(r.audio)} volume={(f) => interpolate(f, [r.think - r.start - d0 - 14, r.think - r.start - d0 - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} /></Sequence>
            <Sequence from={r.reveal + 2} durationInFrames={r.n === 3 ? 999 : r.end - r.reveal} layout="none"><Audio src={staticFile(r.audio.replace('.wav', '_replay.wav'))} /></Sequence>
          </React.Fragment>
        );
      })}
      {!coverPose && ep.sfx.map((s, i) => (
        <Sequence key={i} from={s.at} layout="none"><Audio src={staticFile(`audio/sfx_${s.name}.wav`)} volume={s.gain} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
