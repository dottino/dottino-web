import React from 'react';
import {
  AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import ep from './ep3.json';

// 15-second format: sound on frame 0, conflict by second 1, reveal ~7 s, last frame = first frame (loops).
const C = {cream: '#F3EFE6', ground: '#E7E0D2', navy: '#1C1B2E', orange: '#EE6A45', card: '#FFFDF8', muted: '#8A8578', line: '#DED6C6'};
const FONT = 'Nunito, sans-serif';
const B = ep.beats;

type Asset = {src: string; video: boolean; w: number; h: number; d: number; cx: number; cy: number};
const A: Record<string, Asset> = {
  think: {src: 'basso/02_think.webm', video: true, w: 720, h: 804, d: 299, cx: 370, cy: 454},
  star: {src: 'basso/05_star.webm', video: true, w: 720, h: 960, d: 430, cx: 352, cy: 540},
  shy: {src: 'basso/06_shy.webm', video: true, w: 720, h: 960, d: 303, cx: 363, cy: 531},
  cheer: {src: 'basso/04_cheer.webm', video: true, w: 720, h: 960, d: 320, cx: 357, cy: 544},
  neutral: {src: 'basso/neutral.png', video: false, w: 720, h: 804, d: 299, cx: 370, cy: 454},
  listen: {src: 'basso/listen.png', video: false, w: 720, h: 804, d: 299, cx: 370, cy: 454},
  // "surprised, puffs up" (from the 3.8 s clip, keyed): body d≈347 px on frame 0, then he swells
  // 2026-11-01 new clips (not used in ep3 yet): listen hard (sound waves), wonder (thought bubble), aha (spark lines), ponder (hand to mouth)
  listenHard: {src: 'basso/12_listen_hard.webm', video: true, w: 720, h: 960, d: 311, cx: 361, cy: 521},
  wonder: {src: 'basso/13_wonder.webm', video: true, w: 720, h: 960, d: 299, cx: 360, cy: 551},
  aha: {src: 'basso/14_aha.webm', video: true, w: 720, h: 960, d: 305, cx: 360, cy: 540},
  ponder: {src: 'basso/15_ponder.webm', video: true, w: 720, h: 960, d: 310, cx: 360, cy: 526},
  surprise: {src: 'basso/11_surprise.webm', video: true, w: 720, h: 960, d: 347, cx: 357, cy: 576},
};
// bottom edge (px, asset scale) of the surprise clip per frame: used to keep his feet on the ground while he swells
const SURPRISE_BOTTOM = [750, 750, 753, 758, 763, 771, 777, 779, 784, 788, 795, 799, 800, 802, 803, 805, 806, 807, 809, 810, 813, 815, 815, 816, 817, 818, 819, 819, 820, 820, 821, 821, 821, 822, 822, 823, 823, 824, 824, 824, 825];

// ---------- rhythm cards ----------
const BEAT_W = 92, X0 = 34, ROW_H = 96, HEAD_Y = 70, STEM_TOP = 12;
const beatX = (b: number) => X0 + b * BEAT_W + (b >= 4 ? 26 : 0) + 16; // extra room after the bar line
const Rhythm: React.FC<{notes: number[][]; marks: number[]; markOn: boolean}> = ({notes, marks, markOn}) => {
  const els: React.ReactNode[] = [];
  const col = (b: number) => (markOn && marks.includes(b) ? C.orange : C.navy);
  notes.forEach(([b, len], i) => {
    const x = beatX(b), c = col(b);
    els.push(<ellipse key={'h' + i} cx={x} cy={HEAD_Y} rx={17} ry={12.5} transform={`rotate(-22 ${x} ${HEAD_Y})`}
      fill={len >= 2 ? C.card : c} stroke={c} strokeWidth={len >= 2 ? 5.5 : 0} />);
    els.push(<rect key={'s' + i} x={x + 12} y={STEM_TOP} width={5} height={HEAD_Y - STEM_TOP - 2} fill={c} />);
  });
  // beams for pairs of eighths
  notes.forEach(([b, len], i) => {
    const nx = notes[i + 1];
    if (len === 0.5 && nx && nx[1] === 0.5 && b % 1 === 0) {
      els.push(<rect key={'b' + i} x={beatX(b) + 12} y={STEM_TOP} width={beatX(nx[0]) - beatX(b) + 5} height={11} fill={col(b)} />);
    }
  });
  const barX = X0 + 4 * BEAT_W + 14, endX = beatX(8) - 6;
  return (
    <svg width={endX + 16} height={ROW_H} style={{display: 'block'}}>
      <line x1={X0 - 10} x2={endX} y1={HEAD_Y} y2={HEAD_Y} stroke={C.line} strokeWidth={3} />
      <rect x={barX} y={HEAD_Y - 40} width={4} height={80} fill={C.muted} />
      <rect x={endX - 12} y={HEAD_Y - 40} width={4} height={80} fill={C.muted} />
      <rect x={endX - 4} y={HEAD_Y - 40} width={9} height={80} fill={C.muted} />
      {els}
    </svg>
  );
};

const D = 330, GROUND = 1460, CX = 540, CY = GROUND - D / 2 - 36;
const BUB_Y = 960, BUB_X = 790, BUB_Y_REVEAL = 990;

const BassoAsset: React.FC<{a: Asset}> = ({a}) => {
  const s = D / a.d;
  const style: React.CSSProperties = {position: 'absolute', left: CX - a.cx * s, top: CY - a.cy * s, width: a.w * s, height: a.h * s};
  return a.video
    ? <OffthreadVideo src={staticFile(a.src)} transparent muted style={style} />
    : <Img src={staticFile(a.src)} style={style} />;
};

const Bubble: React.FC<{text: React.ReactNode; delay?: number; y?: number; x?: number}> = ({text, delay = 0, y = 800, x = 672}) => {
  const f = useCurrentFrame() - delay;
  const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 12, stiffness: 200}});
  return (
    <div style={{
      position: 'absolute', left: x, bottom: 1920 - y, maxWidth: 380, boxSizing: 'border-box',
      transform: `scale(${p})`, transformOrigin: '10% 100%',
      background: C.card, color: C.navy, fontFamily: FONT, fontWeight: 900, fontSize: 52, lineHeight: 1.05,
      padding: '22px 28px', borderRadius: 36, border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(28,27,46,0.12)',
    }}>
      {text}
      <svg width="56" height="48" viewBox="0 0 56 48" style={{position: 'absolute', left: -2, bottom: -43, overflow: 'visible'}}>
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

const Bars: React.FC<{src: string; frames: number}> = ({src, frames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const audio = useAudioData(staticFile(src));
  let vals = new Array(9).fill(0.05);
  if (audio && frame < frames) {
    const v = visualizeAudio({fps, frame, audioData: audio, numberOfSamples: 32});
    vals = vals.map((_, i) => Math.min(1, (v[i + 1] ?? 0) * 14 + 0.06));
  }
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, height: 90}}>
        {vals.map((x, i) => <div key={i} style={{width: 16, height: 14 + x * 76, borderRadius: 8, background: i % 3 === 0 ? C.orange : C.navy}} />)}
      </div>
      <div style={{flex: 1, height: 12, borderRadius: 6, background: C.line, overflow: 'hidden'}}>
        <div style={{width: `${Math.min(1, frame / frames) * 100}%`, height: '100%', background: C.navy}} />
      </div>
    </div>
  );
};

export const Short3: React.FC<{url?: string}> = ({url = ep.url}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const answered = frame >= B.reveal && frame < B.reset;
  const m0 = ep.music[0], m1 = ep.music[1];

  // Basso motion
  const fidget = frame < B.jump ? Math.abs(Math.sin((frame / 9) * Math.PI)) : 0;
  const puffUp = spring({frame: frame - B.jump, fps, config: {damping: 9, stiffness: 230}});
  const puffDown = spring({frame: frame - B.doubt, fps, config: {damping: 14, stiffness: 90}});
  const puff = frame >= B.jump && frame < B.pause ? 1 + 0.16 * puffUp - 0.16 * (frame >= B.doubt ? puffDown : 0) : 1;
  const shrink = 1; // ep3: no shrink at the reveal, Basso puffs up in surprise instead
  const sIdx = frame - B.reveal;
  const inSurprise = frame >= B.reveal && frame < B.replay;
  const sGrow = inSurprise ? (SURPRISE_BOTTOM[Math.min(sIdx, SURPRISE_BOTTOM.length - 1)] - SURPRISE_BOTTOM[0]) : 0;
  // the clip swells ~1.8x; ease the overall scale down a little as he swells so he never covers the explanation
  const sScale = inSurprise ? 1 - 0.18 * (sGrow / (SURPRISE_BOTTOM[SURPRISE_BOTTOM.length - 1] - SURPRISE_BOTTOM[0])) : 1;
  const surpriseLift = sGrow * (D / A.surprise.d);
  // playhead (beats) while the music plays, so viewers can follow along on all three cards at once
  const spb = 60 / ep.bpm;
  const ph = (() => {
    for (const m of ep.music) {
      const t = (frame - m.at) / fps;
      const b = m.beat0 + t / spb;
      const endB = m.beat0 === 0 ? 8 : 8;
      if (frame >= m.at && b <= endB && (m.beat0 === 0 ? frame < B.pause : frame < B.win)) return b;
    }
    return null;
  })();
  // gentle sway that always starts from upright and eases in (no jump when it begins)
  const swayFrom = (start: number, end: number) => {
    if (frame < start || frame >= end) return 0;
    const t = frame - start;
    const ease = Math.min(1, t / 20) * Math.min(1, (end - frame) / 8);
    return Math.sin(t / 12) * 2.5 * ease;
  };
  const sway = swayFrom(B.thinkEnd, B.pause) + swayFrom(B.replay, B.win);
  // soft cross-fade from the head-scratch pose into the eyes-closed listening pose
  const XF = 7;
  const xf = frame >= B.thinkEnd - XF && frame < B.thinkEnd ? (frame - (B.thinkEnd - XF)) / XF : null;

  const pose = frame < B.jump ? A.neutral
    : frame < B.doubt ? A.cheer
    : frame < B.thinkEnd ? A.think
    : frame < B.pause ? A.listen
    : frame < B.reveal ? A.neutral
    : frame < B.replay ? A.surprise
    : frame < B.win ? A.listen
    : frame < B.reset ? A.star
    : A.neutral;
  const poseStart = frame < B.jump ? 0 : frame < B.doubt ? B.jump : frame < B.thinkEnd ? B.doubt : frame < B.pause ? B.thinkEnd
    : frame < B.reveal ? B.pause : frame < B.replay ? B.reveal : frame < B.win ? B.replay : frame < B.reset ? B.win : B.reset;

  const ground = (() => {
    if (frame >= B.listenCap && frame < B.commentCap) return <Pop delay={B.listenCap} style={{color: C.navy}}>Listen to the end…</Pop>;
    if (frame >= B.commentCap && frame < B.reveal) return (
      <Pop delay={B.commentCap} style={{fontSize: 64, color: C.orange}}>Comment A, B or C<br />before the reveal 👇</Pop>
    );
    if (frame >= B.replay && frame < B.win) return (
      <div style={{display: 'flex', gap: 26, fontSize: 64}}>
        <Pop delay={B.replay + 2}>Pause.</Pop>
        <Pop delay={B.replay + 14} style={{color: C.orange}}>Listen.</Pop>
        <Pop delay={B.replay + 26}>Check.</Pop>
      </div>
    );
    if (frame >= B.win && frame < B.reset) return (
      <Pop delay={B.win + 4} style={{fontSize: 60, whiteSpace: 'pre-line'}}>
        {ep.outro}
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
        padding: '36px 46px 40px', boxShadow: '0 10px 0 rgba(28,27,46,0.07)', border: `3px solid ${C.line}`,
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{color: C.orange, fontWeight: 900, fontSize: 32, letterSpacing: 3}}>{answered ? 'ANSWER' : 'LISTEN'}</div>
          <Speaker />
        </div>
        <div style={{fontWeight: 900, fontSize: 96, color: C.navy, lineHeight: 1.02, marginTop: 8, display: 'flex', alignItems: 'center', gap: 22}}>
          {answered ? <><Check size={86} />Rhythm {ep.answer}</> : ep.question}
        </div>
        {/* three rhythm cards; the playhead moves across all three at once */}
        <div style={{marginTop: 14, position: 'relative'}}>
          {(['A', 'B', 'C'] as const).map((k) => {
            const right = answered && k === ep.answer;
            const dim = answered && !right;
            return (
              <div key={k} style={{
                display: 'flex', alignItems: 'center', gap: 14, height: ROW_H + 8, padding: '0 10px', borderRadius: 26,
                background: right ? '#FDEBE3' : 'transparent', border: `4px solid ${right ? C.orange : 'transparent'}`,
                opacity: dim ? 0.55 : 1,
              }}>
                <div style={{
                  width: 66, height: 66, borderRadius: 33, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: right ? C.orange : C.navy, color: C.cream, fontWeight: 900, fontSize: 42,
                }}>{k}</div>
                <Rhythm notes={ep.rhythms[k]} marks={(ep.marks as Record<string, number[]>)[k]} markOn={answered} />
              </div>
            );
          })}
          {ph !== null && (
            <div style={{position: 'absolute', top: 6, bottom: 6, left: 24 + 66 + 14 + beatX(Math.min(ph, 8)) - 2, width: 6, borderRadius: 3, background: C.orange, opacity: 0.85}} />
          )}
        </div>
        <div style={{marginTop: 12, minHeight: 56, display: 'flex', alignItems: 'center'}}>
          <div style={{flex: 1}}>
            {frame >= B.pause && frame < B.reveal &&
              <div style={{fontWeight: 800, fontSize: 42, color: C.muted}}>{ep.pauseLine}</div>}
            {answered &&
              <Pop delay={B.reveal + 4} style={{fontWeight: 900, fontSize: 40, lineHeight: 1.12, color: C.navy, whiteSpace: 'pre-line'}}>{ep.explain}</Pop>}
          </div>
        </div>
      </div>

      {/* ground */}
      <div style={{position: 'absolute', top: GROUND, left: 0, right: 0, bottom: 0, background: C.ground, borderTop: `6px solid ${C.line}`}} />

      {/* Basso */}
      <AbsoluteFill style={{
        transformOrigin: `${CX}px ${CY + D / 2}px`,
        transform: `translateY(${-fidget * 22 - surpriseLift * sScale}px) rotate(${sway}deg) scale(${puff * shrink * sScale})`,
      }}>
        {xf !== null && <AbsoluteFill style={{opacity: Math.min(1, (xf + 1 / XF) * 3)}}><BassoAsset a={A.listen} /></AbsoluteFill>}
        <Sequence from={poseStart} layout="none" key={poseStart}>
          <AbsoluteFill style={{opacity: xf === null ? 1 : 1 - xf}}>
            {pose === A.cheer ? <Loop durationInFrames={44} layout="none"><BassoAsset a={pose} /></Loop> : <BassoAsset a={pose} />}
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>

      {/* bubbles */}
      <Sequence from={B.jump} durationInFrames={B.doubt - B.jump} layout="none"><Bubble text={ep.bassoGuess} y={BUB_Y} x={BUB_X} /></Sequence>
      <Sequence from={B.doubt} durationInFrames={B.listen - B.doubt} layout="none"><Bubble text="…wait, do I?" y={BUB_Y} x={BUB_X} /></Sequence>
      <Sequence from={B.reveal + 8} durationInFrames={B.replay - B.reveal - 8} layout="none"><Bubble text={ep.surprise} y={BUB_Y_REVEAL} x={770} /></Sequence>
      <Sequence from={B.win + 6} durationInFrames={B.reset - B.win - 6} layout="none"><Bubble text={<>{ep.winLine}<br /><span style={{color: C.orange}}>It's {ep.answer}.</span></>} y={BUB_Y_REVEAL} x={730} /></Sequence>

      {/* ground caption */}
      <div style={{position: 'absolute', top: GROUND + 40, left: 64, right: 64, fontWeight: 900, fontSize: 56, color: C.navy, lineHeight: 1.1}}>
        {ground}
      </div>

      {/* audio */}
      {ep.music.map((m) => (
        <Sequence key={m.src} from={m.at} durationInFrames={m.frames} layout="none">
          <Audio src={staticFile(m.src)} volume={(f) => (f < m.fadeFrom ? 1 : Math.max(0, 1 - (f - m.fadeFrom) / (m.frames - m.fadeFrom)))} />
        </Sequence>
      ))}
      {ep.sfx.map((s, i) => (
        <Sequence key={i} from={s.at} layout="none"><Audio src={staticFile(`audio/sfx_${s.name}.wav`)} volume={s.gain} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
