import React from 'react';
import {
  AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import ep from './ep7.json';

// Episode 7, "Which shape is the tune?": three shape cards (A straight up, B up and home, C up and halfway down).
// Basso hears three rising notes and shouts "A!". Same frame as #6 (countdown tick-tock, ✅ or ❌ at the end);
// the listening tool is the shape line: during the replay it is drawn note by note on card B.
const C = {cream: '#F3EFE6', ground: '#E7E0D2', navy: '#1C1B2E', orange: '#EE6A45', card: '#FFFDF8', muted: '#8A8578', line: '#DED6C6', soft: '#F6C9B8'};
const FONT = 'Nunito, sans-serif';
const B = ep.beats;
const FPB = (60 / ep.bpm) * ep.fps; // frames per beat (15 at 120 bpm)

type Asset = {src: string; video: boolean; w: number; h: number; d: number; cx: number; cy: number; from?: number};
const A: Record<string, Asset> = {
  think: {src: 'basso/02_think.webm', video: true, w: 720, h: 804, d: 299, cx: 370, cy: 454},
  cheer: {src: 'basso/04_cheer.webm', video: true, w: 720, h: 960, d: 320, cx: 357, cy: 544},
  neutral: {src: 'basso/neutral.png', video: false, w: 720, h: 804, d: 299, cx: 370, cy: 454},
  listen: {src: 'basso/listen.png', video: false, w: 720, h: 804, d: 299, cx: 370, cy: 454},
  surprise: {src: 'basso/11_surprise.webm', video: true, w: 720, h: 960, d: 347, cx: 357, cy: 576},
  listenHard: {src: 'basso/12_listen_hard.webm', video: true, w: 720, h: 960, d: 311, cx: 361, cy: 521},
  wonder: {src: 'basso/13_wonder.webm', video: true, w: 720, h: 960, d: 299, cx: 360, cy: 551},
  aha: {src: 'basso/14_aha.webm', video: true, w: 720, h: 960, d: 305, cx: 360, cy: 540, from: 42},
  shy: {src: 'basso/06_shy.webm', video: true, w: 720, h: 960, d: 303, cx: 363, cy: 531},
  hum: {src: 'basso/19_hum.webm', video: true, w: 720, h: 960, d: 337, cx: 339, cy: 592},
  compose: {src: 'basso/18_compose.webm', video: true, w: 720, h: 960, d: 380, cx: 367, cy: 450},
  hidePeek: {src: 'basso/16_hide_peek.webm', video: true, w: 720, h: 960, d: 304, cx: 359, cy: 536, from: 40},
};
// bottom edge (px, asset scale) of the surprise clip per frame: keeps his feet on the ground while he swells
const SURPRISE_BOTTOM = [750, 750, 753, 758, 763, 771, 777, 779, 784, 788, 795, 799, 800, 802, 803, 805, 806, 807, 809, 810, 813, 815, 815, 816, 817, 818, 819, 819, 820, 820, 821, 821, 821, 822, 822, 823, 823, 824, 824, 824, 825];

const D = 330, GROUND = 1460, CX = 540, CY = GROUND - D / 2 - 36;
const BUB_Y = 960, BUB_X = 650, BUB_Y_REVEAL = 1000;

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

const Speaker: React.FC<{size?: number}> = ({size = 40}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9v6h4l5 4V5L8 9H4z" fill={C.muted} /><path d="M16.5 8.5a5 5 0 0 1 0 7" /><path d="M19 6a8.5 8.5 0 0 1 0 12" />
  </svg>
);

const Check: React.FC<{size?: number}> = ({size = 64}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill={C.orange} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------- the shape cards: before the reveal, dot k lights on all three cards as note k sounds (a playhead, no hint);
// after the reveal card B is the answer, and during the replay its line is drawn note by note (the listening tool) ----------
const CW = 276, CH = 214, SW = 236, SH = 132;
const Shapes: React.FC<{answered: boolean}> = ({answered}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const m0 = ep.music[0], m1 = ep.music[1];
  const g = spring({frame: frame - B.reveal - 2, fps, config: {damping: 14, stiffness: 120}});
  const qNote = (frame - m0.at) / FPB;            // note index while the question plays
  const rNote = (frame - m1.at) / FPB;            // note index during the replay
  const replaying = answered && frame >= m1.at && frame < B.win;
  const all = Object.values(ep.shapes).flat(), lo = Math.min(...all), hi = Math.max(...all);
  const pt = (d: number, i: number, n: number) => [14 + (i * (SW - 28)) / (n - 1), SH - 14 - ((d - lo) / (hi - lo)) * (SH - 28)];
  return (
    <div style={{display: 'flex', gap: 30}}>
      {Object.entries(ep.shapes).map(([k, ds]) => {
        const right = k === ep.answerKey, dim = answered && !right;
        const pts = ds.map((d, i) => pt(d, i, ds.length));
        // the line: faint before the reveal; on B during the replay it is drawn up to the current note
        let line = pts.map((p) => p.join(',')).join(' ');
        let drawn: string | null = null;
        if (right && answered) {
          const p = replaying ? Math.min(ds.length - 1, Math.max(0, rNote)) : frame >= B.win ? ds.length - 1 : ds.length - 1;
          const i0 = Math.floor(p), f = p - i0, seg = pts.slice(0, i0 + 1);
          if (i0 < ds.length - 1) seg.push([pts[i0][0] + (pts[i0 + 1][0] - pts[i0][0]) * f, pts[i0][1] + (pts[i0 + 1][1] - pts[i0][1]) * f]);
          drawn = seg.map((q) => q.join(',')).join(' ');
        }
        const litQ = (i: number) => !answered && qNote >= i;
        const nowR = (i: number) => replaying && rNote >= i && rNote < i + 1;
        return (
          <div key={k} style={{width: CW, height: CH, boxSizing: 'border-box', borderRadius: 30, background: right && answered ? C.card : '#F7F3EB',
            border: `${right && answered ? 6 : 3}px solid ${right && answered ? C.orange : C.line}`, opacity: dim ? 0.38 + 0.62 * (1 - g) : 1,
            padding: '12px 14px', position: 'relative'}}>
            <div style={{fontWeight: 900, fontSize: 46, color: right && answered ? C.orange : C.navy, lineHeight: 1}}>{k}</div>
            <svg width={SW} height={SH} style={{position: 'absolute', left: 18, bottom: 14, overflow: 'visible'}}>
              <polyline points={line} fill="none" stroke={right && answered ? C.soft : '#C9C1B2'} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
              {drawn && <polyline points={drawn} fill="none" stroke={C.orange} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />}
              {pts.map(([x, y], i) => {
                const on = litQ(i) || nowR(i);
                const r = nowR(i) ? 15 : 11;
                const fill = right && answered ? (replaying && rNote < i ? C.soft : C.orange) : on ? C.navy : '#D7CFC0';
                return <circle key={i} cx={x} cy={y} r={r} fill={fill} />;
              })}
            </svg>
          </div>
        );
      })}
    </div>
  );
};
function interpolateColor(a: string, b: string, t: number) {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = h(a), y = h(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, '0')).join('');
}

// ---------- 3-second countdown ring before the reveal ----------
const Countdown: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - B.pause, total = B.reveal - B.pause;
  const left = Math.max(0, 1 - t / total);
  const n = Math.max(1, 3 - Math.floor(t / 30));
  const R = 50, L = 2 * Math.PI * R;
  const beat = spring({frame: t % 15, fps: 30, config: {damping: 10, stiffness: 240}}); // pulses twice a second, with the tick-tock
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
      <svg width={124} height={124} viewBox="0 0 124 124" style={{transform: `scale(${1.06 - 0.06 * beat})`}}>
        <circle cx={62} cy={62} r={R} fill="none" stroke={C.line} strokeWidth={12} />
        <circle cx={62} cy={62} r={R} fill="none" stroke={C.orange} strokeWidth={12} strokeLinecap="round"
          strokeDasharray={L} strokeDashoffset={L * (1 - left)} transform="rotate(-90 62 62)" />
        <text x={62} y={80} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill={C.navy}
          style={{transform: `scale(${0.8 + 0.2 * beat})`, transformOrigin: '62px 62px'}}>{n}</text>
      </svg>
      <div style={{fontWeight: 900, fontSize: 44, lineHeight: 1.1, color: C.navy}}>
        {ep.commentLine}<br /><span style={{color: C.orange}}>{ep.choicesLine}</span>
      </div>
    </div>
  );
};

export const Short7: React.FC<{url?: string; coverPose?: string}> = ({url = ep.url, coverPose}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const answered = frame >= B.reveal && frame < B.reset;

  // Basso motion
  const fidget = frame < B.jump ? Math.abs(Math.sin((frame / 9) * Math.PI)) : 0;
  const puffUp = spring({frame: frame - B.jump, fps, config: {damping: 9, stiffness: 230}});
  const puffDown = spring({frame: frame - B.doubt, fps, config: {damping: 14, stiffness: 90}});
  const puff = frame >= B.jump && frame < B.pause ? 1 + 0.16 * puffUp - 0.16 * (frame >= B.doubt ? puffDown : 0) : 1;
  const sIdx = frame - B.reveal;
  const inSurprise = false; // #7 uses the shy pose at the reveal (no swelling)
  const sGrow = inSurprise ? (SURPRISE_BOTTOM[Math.min(sIdx, SURPRISE_BOTTOM.length - 1)] - SURPRISE_BOTTOM[0]) : 0;
  const sScale = inSurprise ? 1 - 0.18 * (sGrow / (SURPRISE_BOTTOM[SURPRISE_BOTTOM.length - 1] - SURPRISE_BOTTOM[0])) : 1;
  const surpriseLift = sGrow * (D / A.surprise.d);
  const swayFrom = (start: number, end: number) => {
    if (frame < start || frame >= end) return 0;
    const t = frame - start;
    const ease = Math.min(1, t / 20) * Math.min(1, (end - frame) / 8);
    return Math.sin(t / 12) * 2.5 * ease;
  };
  const sway = swayFrom(B.thinkEnd, B.pause) + swayFrom(B.replay, B.win);
  const XF = 7;
  const xf = frame >= B.thinkEnd - XF && frame < B.thinkEnd ? (frame - (B.thinkEnd - XF)) / XF : null;

  const pose = frame < B.jump ? A.neutral
    : frame < B.doubt ? A.cheer
    : frame < B.thinkEnd ? A.think
    : frame < B.pause ? A.listen
    : frame < B.reveal ? A.neutral
    : frame < B.replay ? A.shy
    : frame < B.win ? A.hum
    : frame < B.reset ? A.compose
    : A.neutral;
  const shownPose = coverPose ? A[coverPose] : pose;
  const poseStart0 = frame < B.jump ? 0 : frame < B.doubt ? B.jump : frame < B.thinkEnd ? B.doubt : frame < B.pause ? B.thinkEnd
    : frame < B.reveal ? B.pause : frame < B.replay ? B.reveal : frame < B.win ? B.replay : frame < B.reset ? B.win : B.reset;
  const poseStart = coverPose ? frame - 70 : poseStart0;

  // the shape in words, lighting up note by note with the replay
  const countWords = (() => {
    const t = (frame - ep.music[1].at) / FPB;
    return (
      <div style={{display: 'flex', gap: 18, alignItems: 'baseline', fontSize: 58, flexWrap: 'nowrap'}}>
        {ep.words.map((w, i) => {
          const on = t >= i && t < i + 1, seen = t >= i;
          return <span key={i} style={{color: on ? C.orange : seen ? C.navy : C.line, transform: `scale(${on ? 1.12 : 1})`, display: 'inline-block',
            fontSize: w === 'home' ? 66 : 54}}>{w}</span>;
        })}
      </div>
    );
  })();

  const ground = (() => {
    if (frame >= B.listenCap && frame < B.commentCap) return <Pop delay={B.listenCap} style={{color: C.navy}}>Draw it in your head…</Pop>;
    if (frame >= B.commentCap && frame < B.reveal) return (
      <Pop delay={B.commentCap} style={{fontSize: 56, color: C.orange}}>Which shape is it?<br />Comment before the reveal 👇</Pop>
    );
    if (frame >= B.replay && frame < B.win) return <Pop delay={B.replay + 2}>{countWords}</Pop>;
    if (frame >= B.win && frame < B.reset) return (
      <Pop delay={B.win + 4} style={{fontSize: 62}}>
        {ep.outro} <span style={{whiteSpace: 'nowrap'}}>✅ or ❌</span>
        <div style={{marginTop: 18, fontSize: 40, fontWeight: 800, color: C.navy, whiteSpace: 'nowrap'}}>
          {ep.rematch} <span style={{color: C.orange, fontWeight: 900}}>{url}</span>
        </div>
      </Pop>
    );
    return null;
  })();

  return (
    <AbsoluteFill style={{background: C.cream, fontFamily: FONT}}>
      {/* header */}
      <div style={{position: 'absolute', top: 108, left: 60, right: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{background: C.navy, color: C.cream, fontWeight: 900, fontSize: 34, letterSpacing: 2, padding: '12px 28px', borderRadius: 40}}>
          BASSO CHALLENGE <span style={{color: C.orange}}>#{ep.episode}</span>
        </div>
        <div style={{fontWeight: 900, fontSize: 40, color: C.navy}}>dottino<span style={{color: C.orange}}>.app</span></div>
      </div>

      {/* question card: visible from frame 0 */}
      <div style={{
        position: 'absolute', top: 214, left: 50, right: 50, background: C.card, borderRadius: 44,
        padding: '36px 46px 36px', boxShadow: '0 10px 0 rgba(28,27,46,0.07)', border: `3px solid ${C.line}`,
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{color: C.orange, fontWeight: 900, fontSize: 32, letterSpacing: 3}}>{answered ? 'ANSWER' : 'LISTEN'}</div>
          <Speaker />
        </div>
        <div style={{fontWeight: 900, fontSize: answered ? 82 : 68, color: C.navy, lineHeight: 1.02, marginTop: 8, display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap'}}>
          {answered ? <><Check size={78} />{ep.answer}</> : ep.question}
        </div>
        <div style={{marginTop: 20}}><Shapes answered={answered} /></div>
        <div style={{marginTop: 6, minHeight: 124, display: 'flex', alignItems: 'center'}}>
          {!answered && frame < B.pause && (
            <div style={{width: '100%', height: 12, borderRadius: 6, background: C.line, overflow: 'hidden'}}>
              <div style={{width: `${Math.min(1, frame / ep.music[0].frames) * 100}%`, height: '100%', background: C.navy}} />
            </div>
          )}
          {!answered && frame >= B.pause && <Countdown />}
          {answered && <Pop delay={B.reveal + 6} style={{fontWeight: 900, fontSize: 40, lineHeight: 1.14, color: C.navy, whiteSpace: 'pre-line'}}>{ep.explain}</Pop>}
        </div>
      </div>

      {/* ground */}
      <div style={{position: 'absolute', top: GROUND, left: 0, right: 0, bottom: 0, background: C.ground, borderTop: `6px solid ${C.line}`}} />

      {/* Basso */}
      <AbsoluteFill style={{
        transformOrigin: `${CX}px ${CY + D / 2}px`,
        transform: `translateY(${-fidget * 22 - surpriseLift * sScale}px) rotate(${sway}deg) scale(${puff * sScale})`,
      }}>
        {xf !== null && <AbsoluteFill style={{opacity: Math.min(1, (xf + 1 / XF) * 3)}}><BassoAsset a={A.listen} /></AbsoluteFill>}
        <Sequence from={poseStart} layout="none" key={poseStart}>
          <AbsoluteFill style={{opacity: xf === null ? 1 : 1 - xf}}>
            {shownPose === A.cheer ? <Loop durationInFrames={44} layout="none"><BassoAsset a={shownPose} /></Loop> : <BassoAsset a={shownPose} />}
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>

      {/* bubbles */}
      <Sequence from={B.jump} durationInFrames={B.doubt - B.jump} layout="none"><Bubble text={ep.bassoGuess} y={BUB_Y} x={720} /></Sequence>
      <Sequence from={B.doubt} durationInFrames={B.pause - B.doubt} layout="none"><Bubble text="…wait, do I?" y={coverPose ? 900 : BUB_Y} x={coverPose ? 700 : BUB_X} /></Sequence>
      <Sequence from={B.reveal + 10} durationInFrames={B.replay - B.reveal - 10} layout="none"><Bubble text={ep.oops} y={BUB_Y_REVEAL} x={740} /></Sequence>
      <Sequence from={B.win + 6} durationInFrames={B.reset - B.win - 6} layout="none"><Bubble text={<>{ep.winLine}<br /><span style={{color: C.orange}}>Back home.</span></>} y={1045} x={90} flip /></Sequence>

      {/* ground caption */}
      <div style={{position: 'absolute', top: GROUND + 40, left: 64, right: 64, fontWeight: 900, fontSize: 56, color: C.navy, lineHeight: 1.1}}>
        {coverPose ? null : ground}
      </div>

      {/* audio */}
      {!coverPose && ep.music.map((m) => (
        <Sequence key={m.src} from={m.at} durationInFrames={m.frames} layout="none">
          <Audio src={staticFile(m.src)} volume={(f) => (f < m.fadeFrom ? 1 : Math.max(0, 1 - (f - m.fadeFrom) / (m.frames - m.fadeFrom)))} />
        </Sequence>
      ))}
      {!coverPose && ep.sfx.map((s, i) => (
        <Sequence key={i} from={s.at} layout="none"><Audio src={staticFile(`audio/sfx_${s.name}.wav`)} volume={s.gain} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
