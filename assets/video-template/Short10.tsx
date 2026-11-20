import React from 'react';
import {
  AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import ep from './ep10.json';

// Episode 10: three rounds of "More notes… is it faster?", Grade 3 → 4 → 5 level.
// Upgraded with #8's pacing: confident Basso intro hook, 3.0s in-card countdown ring (3-2-1) with half-beat SFX,
// horizon-locked Basso poses, dual-track NOTES vs BEAT-in-BPM reveal, and post-replay explanation.
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
  shy: {src: 'basso/16_hide_peek.webm', video: true, w: 720, h: 960, d: 308, cx: 359, baseY: 719},
  heart: {src: 'basso/17_heart.webm', video: true, w: 720, h: 960, d: 383, cx: 355, baseY: 740, from: 36},
};
const SURPRISE_BOTTOM = [750, 750, 753, 758, 763, 771, 777, 779, 784, 788, 795, 799, 800, 802, 803, 805, 806, 807, 809, 810, 813, 815, 815, 816, 817, 818, 819, 819, 820, 820, 821, 821, 821, 822, 822, 823, 823, 824, 824, 824, 825];

const D = 320, GROUND = 1460, CX = 540, STAND_Y = GROUND + 2;
const BUB_Y = 995, BUB_X = 665;

const BassoAsset: React.FC<{a: Asset}> = ({a}) => {
  const s = D / a.d;
  const style: React.CSSProperties = {position: 'absolute', left: CX - a.cx * s, top: STAND_Y - a.baseY * s, width: a.w * s, height: a.h * s};
  return a.video
    ? <OffthreadVideo src={staticFile(a.src)} transparent muted style={style} startFrom={a.from ?? 0} />
    : <Img src={staticFile(a.src)} style={style} />;
};

const Bubble: React.FC<{text: React.ReactNode; delay?: number; y?: number; x?: number; flip?: boolean; still?: boolean}> = ({text, delay = 0, y = 800, x = 672, flip = false, still = false}) => {
  const f = useCurrentFrame() - delay;
  const {fps} = useVideoConfig();
  const p = still ? 1 : spring({frame: f, fps, config: {damping: 12, stiffness: 200}});
  return (
    <div style={{
      position: 'absolute', left: x, bottom: 1920 - y, maxWidth: 380, boxSizing: 'border-box',
      transform: `scale(${p})`, transformOrigin: flip ? '90% 100%' : '10% 100%',
      background: C.card, color: C.navy, fontFamily: FONT, fontWeight: 900, fontSize: 48, lineHeight: 1.05,
      padding: '20px 26px', borderRadius: 34, border: `5px solid ${C.navy}`, boxShadow: '0 8px 0 rgba(28,27,46,0.12)',
      whiteSpace: 'pre-line',
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

type Round = {n: number; grade: number; help: string; ans: 'A' | 'B' | 'C'; basso: 'A' | 'B' | 'C'; say: string; explain: string;
  start: number; audioDelay?: number; audio2Delay?: number; audio: string; bassoAt: number; think: number; reveal: number; repBeats: number[]; repNotes: number[]; repBpms: number[]; bar: number; end: number};
const RS = ep.rounds as Round[];
const REP_LEAD = ep.repLead;
const roundAt = (f: number) => RS.find((r) => f >= r.start && f < r.end) ?? null;

const OPTS: Array<{k: 'A' | 'B' | 'C'; label: string; xs: number[]}> = [
  {k: 'A', label: 'Getting faster', xs: [16, 98, 138, 168, 198]},
  {k: 'B', label: 'Staying the same', xs: [16, 62, 107, 153, 198]},
  {k: 'C', label: 'Getting slower', xs: [16, 46, 76, 116, 198]},
];

const TempoDots: React.FC<{xs: number[]; active: boolean; dim: boolean}> = ({xs, active, dim}) => (
  <svg width={220} height={44} style={{display: 'block', marginLeft: 'auto'}}>
    {xs.map((x, i) => (
      <circle key={i} cx={x} cy={22} r={i === 0 ? 12 : 9} fill={active ? C.orange : C.navy} opacity={dim ? 0.35 : 1} />
    ))}
  </svg>
);

const RevealTracks: React.FC<{rd: Round}> = ({rd}) => {
  const frame = useCurrentFrame();
  const fRel = frame - (rd.reveal + REP_LEAD);
  const fade = interpolate(frame - rd.reveal, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const beats = rd.repBeats;
  const notes = rd.repNotes;
  const maxF = Math.max(beats[beats.length - 1], notes[notes.length - 1]) + 16;
  const x0 = 190, x1 = 870, toX = (f: number) => x0 + (f / maxF) * (x1 - x0);
  const barX = toX(beats[rd.bar]);
  return (
    <svg width={900} height={100} style={{display: 'block', opacity: fade}}>
      <text x={0} y={24} fontFamily={FONT} fontSize={23} fontWeight={900} fill={C.muted} letterSpacing={1.5}>NOTES</text>
      <text x={0} y={64} fontFamily={FONT} fontSize={23} fontWeight={900} fill={C.muted} letterSpacing={1.5}>BEAT</text>
      <text x={0} y={88} fontFamily={FONT} fontSize={19} fontWeight={800} fill={C.muted}>in BPM</text>
      <line x1={barX} y1={4} x2={barX} y2={94} stroke={C.line} strokeWidth={3} strokeDasharray="6 5" />
      {notes.map((nf, i) => {
        const lit = fRel >= nf;
        const pop = fRel >= nf && fRel < nf + 8 ? 1.3 : 1;
        return <circle key={'n' + i} cx={toX(nf)} cy={18} r={9 * pop} fill={lit ? C.orange : C.line} />;
      })}
      {beats.map((bf, i) => {
        const lit = fRel >= bf;
        const pop = fRel >= bf && fRel < bf + 10 ? 1.12 : 1;
        const r = 26 * pop, cx = toX(bf), cy = 66;
        return (
          <g key={'b' + i}>
            <circle cx={cx} cy={cy} r={r} fill={lit ? C.orange : C.line} />
            {lit && (
              <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={FONT} fontSize={23} fontWeight={900} fill={C.card}>
                {rd.repBpms[i]}
              </text>
            )}
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

export const Short10: React.FC<{url?: string; coverPose?: string}> = ({url = ep.url, coverPose}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const I = ep.intro, E = ep.ending;
  const inIntro = !coverPose && frame >= I.start && frame < I.end;
  const rd = roundAt(frame);
  const ending = frame >= E.start;
  const shown = rd ?? (inIntro ? RS[0] : RS[RS.length - 1]);
  const revealed = !!rd && frame >= rd.reveal;
  const inThink = !coverPose && !!rd && frame >= rd.think && frame < rd.reveal;
  const bassoRight = (r: Round) => r.basso === r.ans;

  const pose = (() => {
    if (coverPose) return A[coverPose];
    if (inIntro) return A.cheer;
    if (ending) return A.neutral;
    if (!rd) return A.neutral;
    if (frame < rd.bassoAt) return rd.n === 1 ? A.ponder : rd.n === 2 ? A.compose : A.listen;
    if (frame < rd.reveal) return A.cheer;
    return bassoRight(rd) ? (rd.n === 1 ? A.aha : A.heart) : A.surprise;
  })();
  const poseStart = coverPose ? frame - 60 : inIntro ? 0 : ending ? E.start : !rd ? 0 : frame < rd.bassoAt ? rd.start : frame < rd.reveal ? rd.bassoAt : rd.reveal;
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
  const loopDur = pose === A.cheer ? 44 : (pose === A.ponder || pose === A.compose || pose === A.listen || pose === A.listenHard || pose === A.neutral || pose === A.wonder) ? 120 : 0;

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
      <div style={{position: 'absolute', top: 214, left: 50, right: 50, background: C.card, borderRadius: 44, padding: '30px 40px 26px', boxShadow: '0 10px 0 rgba(28,27,46,0.07)', border: `3px solid ${C.line}`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{transform: `scale(${0.9 + 0.1 * bannerPop})`, transformOrigin: 'left center', color: C.orange, fontWeight: 900, fontSize: 32, letterSpacing: 2}}>
            ROUND {shown.n} OF 3 · GRADE {shown.grade} LEVEL
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: 28, color: C.muted}}>
            BASSO {marks.map((mk, i) => <span key={i} style={{width: 40, height: 40, borderRadius: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: mk === '✓' ? C.navy : mk === '✗' ? C.orange : C.line, color: C.card, fontSize: 26}}>{mk === '·' ? '' : mk}</span>)}
          </div>
        </div>
        <div style={{fontWeight: 900, fontSize: 64, color: C.navy, lineHeight: 1.06, marginTop: 10}}>{ep.question}</div>
        <div style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
          {OPTS.map((o) => {
            const right = revealed && o.k === shown.ans, dim = revealed && !right;
            return (
              <div key={o.k} style={{display: 'flex', alignItems: 'center', gap: 18, borderRadius: 24, padding: '8px 22px 8px 18px',
                border: `${right ? 6 : 3}px solid ${right ? C.orange : C.line}`, background: right ? C.card : '#F7F3EB'}}>
                <div style={{fontWeight: 900, fontSize: 44, width: 38, color: right ? C.orange : dim ? C.muted : C.navy}}>{o.k}</div>
                <div style={{fontWeight: 900, fontSize: 36, color: right ? C.orange : dim ? C.muted : C.navy}}>{o.label}</div>
                <TempoDots xs={o.xs} active={right} dim={dim} />
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 16, minHeight: 100, display: 'flex', alignItems: 'center'}}>
          {inIntro && (
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{fontWeight: 900, fontSize: 30, color: C.muted, letterSpacing: 2}}>HELP</div>
              <div style={{fontWeight: 900, fontSize: 34, color: C.navy}}>{RS[0].help}</div>
            </div>
          )}
          {rd && !revealed && !inThink && (
            <div style={{display: 'flex', alignItems: 'center', gap: 22, width: '100%'}}>
              <div style={{fontWeight: 900, fontSize: 30, color: C.muted, letterSpacing: 2}}>HELP</div>
              <div style={{fontWeight: 900, fontSize: 34, color: rd.n === 3 ? C.orange : C.navy}}>{rd.help}</div>
            </div>
          )}
          {inThink && (() => {
            const total = rd.reveal - rd.think, t = frame - rd.think;
            const p = t / total, sec = Math.max(1, Math.ceil((total - t) / 30));
            const R0 = 32, L = 2 * Math.PI * R0;
            return (
              <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
                <svg width={80} height={80}>
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
          {rd && revealed && <RevealTracks rd={rd} />}
          {ending && <div style={{fontWeight: 900, fontSize: 40, color: C.navy}}>Basso got <span style={{color: C.orange}}>2/3</span>. Round 2 fooled him.</div>}
        </div>
      </div>

      {/* ground */}
      <div style={{position: 'absolute', top: GROUND, left: 0, right: 0, bottom: 0, background: C.ground, borderTop: `6px solid ${C.line}`}} />

      {/* Basso */}
      <AbsoluteFill style={{transformOrigin: `${CX}px ${STAND_Y}px`, transform: `translateY(${-fidget * 26 - surpriseLift * sScale}px) scale(${sScale})`}}>
        <Sequence from={poseStart} layout="none" key={poseStart + (pose?.src ?? '')}>
          {loopDur > 0 ? <Loop durationInFrames={loopDur} layout="none"><BassoAsset a={pose} /></Loop> : <BassoAsset a={pose} />}
        </Sequence>
      </AbsoluteFill>

      {/* bubbles */}
      <Sequence from={I.start + 4} durationInFrames={I.end - I.start - 4} layout="none">
        <Bubble text={ep.introSay} delay={I.start + 4} y={BUB_Y} x={BUB_X} />
      </Sequence>
      {RS.map((r) => (
        <React.Fragment key={r.n}>
          <Sequence from={r.bassoAt} durationInFrames={r.reveal - r.bassoAt} layout="none"><Bubble text={r.say} y={coverPose ? BUB_Y - 30 : BUB_Y} x={BUB_X} still={!!coverPose} /></Sequence>
          {!bassoRight(r) && <Sequence from={r.reveal + 8} durationInFrames={r.end - r.reveal - 8} layout="none"><Bubble text={ep.oops} y={BUB_Y} x={BUB_X} still={!!coverPose} /></Sequence>}
        </React.Fragment>
      ))}

      {/* ground caption */}
      <div style={{position: 'absolute', top: GROUND + 68, left: 64, right: 64, fontWeight: 900, fontSize: 52, color: C.navy, lineHeight: 1.12}}>
        {!coverPose && frame < RS[0].reveal && <Pop delay={6}>Keep score: 1 point a round.</Pop>}
        {!coverPose && rd && rd.n === 3 && frame < rd.reveal && <Pop delay={rd.start + 4} style={{color: C.orange}}>No help now. Find the beat.</Pop>}
        {!coverPose && rd && revealed && frame < rd.reveal + REP_LEAD + rd.repBeats[rd.repBeats.length - 1] + 2 && <Pop delay={rd.reveal + 4}>Listen again. Watch the beat.</Pop>}
        {!coverPose && rd && frame >= rd.reveal + REP_LEAD + rd.repBeats[rd.repBeats.length - 1] + 2 && (
          <Pop delay={rd.reveal + REP_LEAD + rd.repBeats[rd.repBeats.length - 1] + 2}><span style={{color: C.orange}}>{rd.ans}.</span> {rd.explain}</Pop>
        )}
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
            <Sequence from={r.start + d0} durationInFrames={r.think - r.start - d0} layout="none">
              <Audio src={staticFile(r.audio)} volume={(f) => {
                const dur = r.think - r.start - d0;
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
