/* Dottino Piece Pre-Flight: 4-minute music-cognition warm-up before playing a new piano piece.
   Supports 3 music-stand input modes: Screen/Keyboard, Real Acoustic Piano (Web Audio Mic YIN pitch + onset), and Web MIDI.
   All repertoire is 100% public domain (composers deceased 70+ years) with original pedagogical warm-ups. */
(function () {
  const $ = id => document.getElementById(id);
  const Q = new URLSearchParams(location.search);
  const REF = (Q.get('ref') || '').replace(/[^\w-]/g, '').slice(0, 32);
  let lang = (localStorage.getItem('dottino:lang') === 'zh' || Q.get('lang') === 'zh') ? 'zh' : 'en';
  const track = (p, t) => { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'event/pieces/' + p, title: t || p, event: true }); } catch (e) {} };

  const NOTE_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const NOTE_FLAT  = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
  const IS_BLK = m => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);
  const noteName = (m, flats) => (flats ? NOTE_FLAT : NOTE_SHARP)[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
  const pcName = (m, flats) => (flats ? NOTE_FLAT : NOTE_SHARP)[((m % 12) + 12) % 12];

  // ---------- 6 Curated Public-Domain Pieces (including full 2027-2028 ABRSM Grade 4 List A!) ----------
  const CATALOG = [
    {
      id: 'scarlatti-kp83',
      abrsm: 'ABRSM 2027–28 · Grade 4 A:1',
      abrsmZh: '英皇 2027–28 · 四级 A:1',
      title: 'Minuet (Sonata in A, Kp. 83)',
      titleZh: '小步舞曲（A 大调奏鸣曲 Kp. 83）',
      composer: 'Domenico Scarlatti (1685–1757)',
      keyEn: 'A major · 3 sharps (F♯, C♯, G♯)',
      keyZh: 'A 大调 · 3 个升号（F♯、C♯、G♯）',
      time: '3/8', beatsPerBar: 3, bpm: 132, flats: false,
      homeMidi: 69, keyRange: [64, 81],
      sigPcs: [1, 6, 8], // C#, F#, G#
      trapPcs: [3],      // D# modulation to E major
      focusEn: '3-sharp key terrain, D♯ modulation trap & crisp 3/8 dance rhythm',
      focusZh: '三升号地形、D♯ 转调陷阱与 3/8 舞曲律动',
      // 5 real sight-reaction targets (treble staff): [midi, stepFromC4, accDisplay ('', '♯', '♭', '♮'), hintEn, hintZh]
      drills: [
        { m: 73, st: 7, acc: '',  en: 'C♯5 — part of A major’s 3-sharp terrain', zh: 'C♯5 — A 大调常驻升号地形' },
        { m: 78, st: 10, acc: '', en: 'F♯5 — keep F♯ automatic on the black key', zh: 'F♯5 — 把 F♯ 变成自动黑键地形' },
        { m: 68, st: 4, acc: '',  en: 'G♯4 — leading tone of A major', zh: 'G♯4 — A 大调导音，别弹成白键 G' },
        { m: 75, st: 8, acc: '♯', en: 'D♯5 — bar 10 modulation trap into E major!', zh: 'D♯5 — 第 10 小节转入 E 大调的临时升号陷阱！' },
        { m: 69, st: 5, acc: '',  en: 'A4 — tonic home anchor', zh: 'A4 — 回到主音 A 锚点' }
      ],
      // Core 2-bar 3/8 rhythm (in eighth-note beats): ♪ ♪ ♪ | ♬ ♬ ♪
      rhythm: { durs: [1, 1, 1, 0.5, 0.5, 0.5, 0.5, 1], barLen: 3, beatSec: 0.46,
        en: 'Two bars of 3/8: three steady quavers, then four nimble semiquavers landing on beat 3.',
        zh: '两小节 3/8 拍：先三拍轻盈八分音符，再四颗流畅十六分音符稳落在第 3 拍。' },
      // Public-domain opening theme (bars 1-4, A major)
      theme: [
        [0, 0.9, 73, 0.78], [0, 2.8, 57, 0.52], [1, 0.9, 76, 0.8], [2, 0.9, 81, 0.85],
        [3, 0.9, 76, 0.78], [3, 2.8, 56, 0.52], [4, 0.45, 74, 0.72], [4.5, 0.45, 73, 0.72], [5, 0.45, 71, 0.72], [5.5, 0.45, 69, 0.74],
        [6, 0.9, 73, 0.76], [6, 2.8, 57, 0.52], [7, 0.9, 71, 0.72], [8, 0.9, 69, 0.78]
      ],
      themeBeat: 0.44,
      earQs: [
        {
          qEn: 'Listen to the opening motif: does the first bar leap UP an A-major chord, or step smoothly down?',
          qZh: '听开篇主题：第一小节是沿着 A 大三和弦向上跳进，还是级进下行？',
          play: 'theme',
          optsEn: ['Leaps UP an A-major arpeggio', 'Steps smoothly down'],
          optsZh: ['沿 A 大三和弦向上跳进', '平稳级进下行'],
          ans: 0,
          expEn: 'Bar 1 outlines C♯–E–A upwards — chunk those three notes as one A-major hand shape!',
          expZh: '第一小节勾勒出 C♯–E–A 上行分解和弦，把这三个音打包成一个手位组块就能一眼看穿！'
        },
        {
          qEn: 'In bar 10, Scarlatti introduces D♯ to shift brighter into E major. Hear these two endings — which one has the bright D♯?',
          qZh: '第 10 小节斯卡拉蒂用 D♯ 转向明亮的 E 大调。听这两遍结尾，哪一遍有明亮的 D♯？',
          play: 'compare',
          a: [[0, 0.85, 76, 0.78], [1, 0.85, 74, 0.78], [2, 1.4, 76, 0.8]],
          b: [[0, 0.85, 76, 0.78], [1, 0.85, 75, 0.82], [2, 1.4, 76, 0.82]],
          optsEn: ['1st time (stays on D♮)', '2nd time (bright D♯ leading into E)'],
          optsZh: ['第 1 遍（留在白键 D♮）', '第 2 遍（明亮的 D♯ 倾向 E）'],
          ans: 1,
          expEn: 'That raised D♯ pulls strongly upward into E — your ear will now flag it automatically before your finger slips onto D♮.',
          expZh: '升高的 D♯ 带有强烈的向上导音倾向，耳朵记住这个色彩，手就不会再误落回白键 D。'
        }
      ],
      checksEn: [
        'Lock F♯, C♯ and G♯ into your hand shape BEFORE bar 1 — never treat sharps as last-second patches.',
        'Watch bars 10–16: D♯ arrives as the piece brightens into E major.',
        'Feel 3/8 with one graceful dance pulse per bar, keeping the semiquaver cascades light and unhurried.'
      ],
      checksZh: [
        '上琴前先把 F♯、C♯、G♯ 设为默认手位地形，不要弹到半路才临时补丁。',
        '重点留意第 10–16 小节：进入 E 大调后频繁出现临时 D♯ 导音。',
        '3/8 拍以一小节一大拍的优雅舞曲律动来感受，十六分音符轻巧跑过、不赶拍。'
      ]
    },
    {
      id: 'jcfbach-scherzo',
      abrsm: 'ABRSM 2027–28 · Grade 4 A:2',
      abrsmZh: '英皇 2027–28 · 四级 A:2',
      title: 'Scherzo (Musikalische Nebenstunden)',
      titleZh: '谐谑曲（音乐闲暇集）',
      composer: 'J. C. F. Bach (1732–1795)',
      keyEn: 'D minor · 1 flat (B♭) + C♯ leading tone',
      keyZh: 'D 小调 · 1 个降号（B♭）+ 导音 C♯',
      time: '2/4', beatsPerBar: 2, bpm: 92, flats: true,
      homeMidi: 62, keyRange: [60, 77],
      sigPcs: [10],      // Bb
      trapPcs: [1, 3],   // C# leading tone + Eb in bar 13
      focusEn: 'Pickup entry, B♭ key terrain, C♯ leading tone & brisk 16th turns',
      focusZh: '弱起进拍、B♭ 地形、C♯ 导音与轻快十六分音型',
      drills: [
        { m: 70, st: 6, acc: '',  en: 'B♭4 — D minor’s permanent flat key', zh: 'B♭4 — D 小调常驻降号键' },
        { m: 61, st: 0, acc: '♯', en: 'C♯4 — D minor’s harmonic leading tone (bars 3, 7, 10!)', zh: 'C♯4 — D 小调和声导音，第 3、7、10 小节高频出现！' },
        { m: 62, st: 1, acc: '',  en: 'D4 — home anchor of D minor', zh: 'D4 — D 小调主音锚点' },
        { m: 73, st: 7, acc: '♯', en: 'C♯5 — upper-octave leading tone trap', zh: 'C♯5 — 高八度 C♯ 导音陷阱' },
        { m: 63, st: 2, acc: '♭', en: 'E♭4 — sudden chromatic twist in section B (bar 13)!', zh: 'E♭4 — B 段第 13 小节的突然降 E 色彩变化！' }
      ],
      // 2/4 rhythm: pickup + 4 eighths + 4 sixteenths + 2 eighths (in quarter-note beats, 2 bars)
      rhythm: { durs: [0.5, 0.5, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.5, 0.5], barLen: 2, beatSec: 0.62,
        en: 'Two bars of 2/4: four crisp quavers stepping up, then a quick four-semiquaver flourish into beat 2.',
        zh: '两小节 2/4 拍：四颗干脆的八分音符上行，紧接一组灵巧的十六分音符落到第 2 拍。' },
      theme: [
        [0, 0.42, 69, 0.72],
        [0.5, 0.42, 62, 0.78], [1.0, 0.42, 64, 0.76], [1.5, 0.42, 65, 0.78], [2.0, 0.42, 67, 0.8],
        [2.5, 0.22, 69, 0.82], [2.75, 0.22, 67, 0.74], [3.0, 0.22, 65, 0.74], [3.25, 0.22, 64, 0.76],
        [3.5, 0.45, 69, 0.8], [4.0, 0.8, 62, 0.78], [4.0, 0.8, 57, 0.55], [4.8, 0.7, 61, 0.76], [4.8, 0.7, 57, 0.52]
      ],
      themeBeat: 0.58,
      earQs: [
        {
          qEn: 'Listen to the opening: does the very first note land ON strong beat 1, or is it a light pickup BEFORE beat 1?',
          qZh: '听开篇：第一个音是落在重音第 1 拍上，还是第 1 拍之前的轻巧弱起？',
          play: 'theme',
          optsEn: ['Light pickup before beat 1', 'Heavy downbeat on beat 1'],
          optsZh: ['第 1 拍之前的轻巧弱起', '直接落在第 1 拍重音上'],
          ans: 0,
          expEn: 'It begins on an upbeat A — think “and-ONE two” so the downbeat lands cleanly on D!',
          expZh: '它从弱拍的 A 轻巧进入——心里默念“弱-强 二”，把真正的重拍落在 D 上！'
        },
        {
          qEn: 'D minor relies on raised C♯ to pull back home. Hear these two cadences — which one has the authentic C♯?',
          qZh: 'D 小调用升高的 C♯ 牵引回主音。听这两遍终止，哪一遍弹出了正确的导音 C♯？',
          play: 'compare',
          a: [[0, 0.5, 65, 0.76], [0.5, 0.5, 64, 0.76], [1.0, 0.6, 60, 0.76], [1.6, 1.0, 62, 0.8]],
          b: [[0, 0.5, 65, 0.76], [0.5, 0.5, 64, 0.76], [1.0, 0.6, 61, 0.82], [1.6, 1.0, 62, 0.82]],
          optsEn: ['1st time (natural C♮)', '2nd time (sharp C♯ pulling to D)'],
          optsZh: ['第 1 遍（白键 C♮）', '第 2 遍（升 C♯ 强烈拉回 D）'],
          ans: 1,
          expEn: 'C♯ creates the Baroque bite of D minor — expect it at every cadence!',
          expZh: 'C♯ 是巴洛克小调终止的灵魂张力，每个乐句收尾前耳朵都要提前等它出现。'
        }
      ],
      checksEn: [
        'Count in with an upbeat: “and-ONE, two” so the pickup A flows straight into D.',
        'Keep B♭ automatic and expect C♯ at the end of nearly every phrase (plus E♭ in bar 13).',
        'Play unslurred quavers lightly detached so the playful Scherzo character pops.'
      ],
      checksZh: [
        '进拍前默念弱起“弱-强、二”，让第一个 A 自然推向主音 D。',
        '把 B♭ 设为常驻黑键，并提前预警每句收尾的 C♯（以及第 13 小节的 E♭）。',
        '没有连线的八分音符保持轻巧微断奏，才能弹出谐谑曲的俏皮感。'
      ]
    },
    {
      id: 'schytte-hide',
      abrsm: 'ABRSM 2027–28 · Grade 4 A:3',
      abrsmZh: '英皇 2027–28 · 四级 A:3',
      title: 'Hide and Seek (Op. 66 No. 6)',
      titleZh: '捉迷藏（Op. 66 No. 6）',
      composer: 'Ludvig Schytte (1848–1909)',
      keyEn: 'A major · 3 sharps (F♯, C♯, G♯)',
      keyZh: 'A 大调 · 3 个升号（F♯、C♯、G♯）',
      time: '2/4', beatsPerBar: 2, bpm: 84, flats: false,
      homeMidi: 69, keyRange: [64, 81],
      sigPcs: [1, 6, 8],
      trapPcs: [3], // D# lower neighbour trap
      focusEn: 'Agile A-major arpeggio chunks, D♯ neighbour notes & playful 16th-note bursts',
      focusZh: 'A 大调敏捷分解和弦组块、D♯ 邻音与俏皮十六分音跑动',
      drills: [
        { m: 73, st: 7, acc: '',  en: 'C♯5 — starting note of the opening A-major dart!', zh: 'C♯5 — 开篇 A 大调敏捷跑动的起点！' },
        { m: 80, st: 11, acc: '', en: 'G♯5 — high leading tone in the bright E7 shape', zh: 'G♯5 — 属七和弦里明亮的高音 G♯' },
        { m: 78, st: 10, acc: '', en: 'F♯5 — keep F♯ under your 4th/5th finger', zh: 'F♯5 — 把 F♯ 牢牢放在右手高音区地形里' },
        { m: 75, st: 8, acc: '♯', en: 'D♯5 — sneaky chromatic neighbour in bar 5 & 44!', zh: 'D♯5 — 第 5、44 小节频繁“捉迷藏”的临时升 D！' },
        { m: 68, st: 4, acc: '',  en: 'G♯4 — mid-register sharp in broken chords', zh: 'G♯4 — 中音区分解和弦里的升 G' }
      ],
      rhythm: { durs: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 1], barLen: 2, beatSec: 0.68,
        en: 'Two bars of 2/4: eight rapid tiptoeing semiquavers, then two crisp staccato leaps and a pause.',
        zh: '两小节 2/4 拍：八颗轻快踮脚跑动的十六分音符，紧接两下利落跳跃停顿。' },
      theme: [
        [0, 0.22, 73, 0.78], [0, 0.45, 57, 0.55], [0.25, 0.22, 76, 0.75], [0.5, 0.22, 81, 0.82], [0.75, 0.22, 76, 0.74],
        [1.0, 0.22, 71, 0.76], [1.0, 0.45, 52, 0.55], [1.25, 0.22, 76, 0.74], [1.5, 0.22, 80, 0.82], [1.75, 0.22, 76, 0.74],
        [2.0, 0.42, 69, 0.82], [2.0, 0.45, 57, 0.58], [2.5, 0.42, 73, 0.78], [3.0, 0.8, 76, 0.82]
      ],
      themeBeat: 0.64,
      earQs: [
        {
          qEn: 'Listen to the opening 16th-note bursts: what chord shape is the right hand outlining in beat 1?',
          qZh: '听开篇第一拍的十六分音符：右手勾勒的是哪一种音型？',
          play: 'theme',
          optsEn: ['Broken A-major chord (C♯–E–A–E)', 'Chromatic scale stepping half-steps'],
          optsZh: ['A 大三和弦分解（C♯–E–A–E）', '半音阶逐个移动'],
          ans: 0,
          expEn: 'Seeing C♯–E–A–E as ONE broken A-major triad lets you play it at Vivace speed without reading 4 separate notes!',
          expZh: '把 C♯–E–A–E 看成一个 A 大三和弦手位组块，就能以 Vivace 速度轻松跑起，不用逐个拼读音符！'
        },
        {
          qEn: 'Listen to the playful contrast: does the melody stay continuous, or alternate quick darts with crisp staccato pauses?',
          qZh: '听一听性格反差：旋律是一直连绵不断，还是“急促跑动 + 利落停顿”交替？',
          play: 'theme',
          optsEn: ['Quick darts + crisp staccato pauses', 'Continuous slow legato line'],
          optsZh: ['急促跑动 + 利落停顿交替', '一直连绵缓慢的连奏'],
          ans: 0,
          expEn: 'Those sudden rests are the “hide” in Hide and Seek — lift cleanly off the staccato notes to let the silence speak!',
          expZh: '突然的休止和断奏正是“捉迷藏”里的“躲起来”——手腕利落提起，让休止符真正呼吸！'
        }
      ],
      checksEn: [
        'Group the opening semiquavers into whole-hand A-major and E7 chord shapes rather than note-by-note reading.',
        'Expect D♯ lower-neighbour twists (bar 5 & bar 44) — keep the wrist light so fingers don’t tense up.',
        'Treat every staccato rest like a playful peek: crisp lift, steady 2/4 left-hand bounce.'
      ],
      checksZh: [
        '把开篇十六分音符按 A 大调与 E7 和弦整体手位打包看谱，绝不逐个单音拼读。',
        '提前预警第 5、44 小节的 D♯ 临时邻音，手腕放松不僵硬。',
        '把每个断奏和休止符弹得像“探头躲藏”，左手保持轻巧稳定的 2/4 弹性。'
      ]
    },
    {
      id: 'burgmuller-b16',
      pieceId: 'b16',
      abrsm: 'ABRSM 2027–28 · Grade 3 A:2',
      abrsmZh: '英皇 2027–28 · 三级 A:2',
      title: 'Douce Plainte (Op. 100 No. 16)',
      titleZh: '温柔的倾诉（Op. 100 No. 16）',
      composer: 'J. F. F. Burgmüller (1806–1874)',
      keyEn: 'G minor · 2 flats (B♭, E♭) + F♯ leading tone',
      keyZh: 'G 小调 · 2 个降号（B♭、E♭）+ 导音 F♯',
      time: '4/4', beatsPerBar: 4, bpm: 84, flats: true,
      homeMidi: 67, keyRange: [62, 79],
      sigPcs: [10, 3], // Bb, Eb
      trapPcs: [6],    // F# leading tone
      focusEn: 'Two-flat G-minor terrain, F♯ leading tone & expressive sighing phrases',
      focusZh: '双降号 G 小调地形、F♯ 导音与叹息式歌唱分句',
      drills: [
        { m: 70, st: 6, acc: '',  en: 'B♭4 — defines the gentle G-minor mood', zh: 'B♭4 — 决定 G 小调温柔悲伤色彩的三度音' },
        { m: 75, st: 9, acc: '',  en: 'E♭5 — second permanent flat of G minor', zh: 'E♭5 — G 小调第二个常驻降号' },
        { m: 66, st: 3, acc: '♯', en: 'F♯4 — G minor’s raised leading tone trap!', zh: 'F♯4 — G 小调临时升 F 导音陷阱！' },
        { m: 67, st: 4, acc: '',  en: 'G4 — tonic home note', zh: 'G4 — G 小调主音锚点' },
        { m: 78, st: 10, acc: '♯', en: 'F♯5 — upper-register leading tone', zh: 'F♯5 — 高音区临时升 F' }
      ],
      rhythm: { durs: [1.5, 0.5, 1, 1, 1, 1, 2], barLen: 4, beatSec: 0.68,
        en: 'Two bars of 4/4: a gentle dotted-crotchet sigh followed by calm stepwise movement to a long minim.',
        zh: '两小节 4/4 拍：柔和的附点四分音符叹息起步，平稳级进收束到两拍长音。' },
      theme: [
        [0, 1.4, 70, 0.72], [0, 3.8, 55, 0.48], [1.5, 0.45, 69, 0.66], [2, 0.9, 67, 0.72], [3, 0.9, 66, 0.7],
        [4, 1.9, 67, 0.76], [4, 3.8, 55, 0.48], [6, 1.8, 74, 0.72]
      ],
      themeBeat: 0.64,
      earQs: [
        {
          qEn: 'Listen to the opening melody: is it in a bright major key or a tender minor key?',
          qZh: '听这首曲子的开篇：它是明亮的大调，还是温柔忧伤的小调？',
          play: 'theme',
          optsEn: ['Tender minor key (G minor)', 'Bright major key (G major)'],
          optsZh: ['温柔忧伤的小调（G 小调）', '明亮的大调（G 大调）'],
          ans: 0,
          expEn: 'B♭ sits a half-step lower than B♮, immediately creating the “sweet complaint” (Douce Plainte) mood.',
          expZh: 'B♭ 比白键 B 低半音，瞬间营造出《温柔的倾诉》那种细腻的小调叹息感。'
        },
        {
          qEn: 'Hear the note just before it resolves back to G: does it dip to natural F♮ or raised F♯?',
          qZh: '听解决回主音 G 之前的那个音：它是白键 F♮，还是更贴近 G 的半音导音 F♯？',
          play: 'compare',
          a: [[0, 0.9, 70, 0.72], [1, 0.9, 69, 0.7], [2, 0.9, 65, 0.7], [3, 1.3, 67, 0.74]],
          b: [[0, 0.9, 70, 0.72], [1, 0.9, 69, 0.7], [2, 0.9, 66, 0.76], [3, 1.3, 67, 0.78]],
          optsEn: ['1st time (F♮)', '2nd time (raised F♯ leaning into G)'],
          optsZh: ['第 1 遍（F♮）', '第 2 遍（升 F♯ 紧贴 G 解决）'],
          ans: 1,
          expEn: 'F♯ sits just one semitone below G — listen for that gentle pull home.',
          expZh: 'F♯ 紧贴在 G 下方半音，听出这个“想回家”的牵引力，识谱时绝不会漏掉临时升号。'
        }
      ],
      checksEn: [
        'Anchor B♭ and E♭ in your hands before starting — G minor uses two black keys by default.',
        'Expect F♯ whenever the melody turns right below G.',
        'Shape the dotted-crotchet phrases softly like a vocal sigh, keeping the accompaniment quieter than the tune.'
      ],
      checksZh: [
        '开弹前先记住 B♭ 和 E♭ 两颗常驻黑键，不要临时找降号。',
        '每当旋律绕到 G 下方时，提前准备好临时升号 F♯。',
        '把附点乐句像叹息一样柔和连奏，左手伴奏始终轻于右手歌唱声部。'
      ]
    },
    {
      id: 'burgmuller-b02',
      pieceId: 'b02',
      abrsm: 'Classic · Grade 2–3',
      abrsmZh: '经典必弹 · 2–3 级',
      title: 'Arabesque (Op. 100 No. 2)',
      titleZh: '阿拉伯风格曲（Op. 100 No. 2）',
      composer: 'J. F. F. Burgmüller (1806–1874)',
      keyEn: 'A minor · No sharps/flats + G♯ leading tone',
      keyZh: 'A 小调 · 无升降调号 + 临时导音 G♯',
      time: '2/4', beatsPerBar: 2, bpm: 108, flats: false,
      homeMidi: 69, keyRange: [64, 81],
      sigPcs: [],
      trapPcs: [8], // G# leading tone
      focusEn: 'Rapid 5-finger semiquaver dash, G♯ trap & steady staccato chords',
      focusZh: '五指十六分音急跑、G♯ 导音陷阱与稳定断奏和弦',
      drills: [
        { m: 69, st: 5, acc: '',  en: 'A4 — 5-finger anchor for the rapid dash', zh: 'A4 — 五指快跑的起始锚点' },
        { m: 76, st: 9, acc: '',  en: 'E5 — top peak of the A–B–C–D–E wave', zh: 'E5 — A–B–C–D–E 五指波浪的顶点' },
        { m: 68, st: 4, acc: '♯', en: 'G♯4 — A minor’s dominant leading tone trap!', zh: 'G♯4 — A 小调属和弦的临时升 G 陷阱！' },
        { m: 72, st: 7, acc: '',  en: 'C5 — minor 3rd giving Arabesque its dramatic energy', zh: 'C5 — 赋予乐曲戏剧张力的小三度音' },
        { m: 80, st: 11, acc: '♯', en: 'G♯5 — high octave G♯ before the final flourish', zh: 'G♯5 — 高音区临时升 G' }
      ],
      rhythm: { durs: [0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 0.5, 0.5, 1], barLen: 2, beatSec: 0.56,
        en: 'Two bars of 2/4: a crisp 4-semiquaver dash landing cleanly on beat 2, answered by steady staccato quavers.',
        zh: '两小节 2/4 拍：四颗利落十六分音符稳扎第 2 拍，接着两下整齐的断奏回应。' },
      theme: [
        [0, 0.4, 57, 0.55], [0, 0.4, 60, 0.52], [0, 0.4, 64, 0.52], [1, 0.4, 57, 0.52], [1, 0.4, 60, 0.5], [1, 0.4, 64, 0.5],
        [2, 0.22, 69, 0.78], [2.25, 0.22, 71, 0.76], [2.5, 0.22, 72, 0.78], [2.75, 0.22, 74, 0.8], [3.0, 0.35, 76, 0.84], [3.5, 0.35, 72, 0.76],
        [4.0, 0.35, 71, 0.78], [4.5, 0.35, 68, 0.8], [5.0, 0.8, 69, 0.84]
      ],
      themeBeat: 0.52,
      earQs: [
        {
          qEn: 'Listen to the opening two bars before the melody enters: what is the left hand setting up?',
          qZh: '听旋律进来前的头两小节：左手在建立什么感觉？',
          play: 'theme',
          optsEn: ['A crisp, steady staccato A-minor pulse', 'A slow, dreamy sustained chord'],
          optsZh: ['干脆稳定的 A 小调断奏拍点', '缓慢延绵的抒情长和弦'],
          ans: 0,
          expEn: 'Those opening staccato chords are your built-in metronome — never let the quick right-hand semiquavers speed up the left hand!',
          expZh: '开头的断奏和弦就是你的“内置节拍器”——右手十六分音符再快，左手拍子也绝不能被带跑！'
        },
        {
          qEn: 'The famous 5-note dash runs A–B–C–D–E. Listen to these two versions — which one stays true to A minor (C♮)?',
          qZh: '经典的五音快跑是 A–B–C–D–E。听这两遍，哪一遍保持了原汁原味的 A 小调（白键 C）？',
          play: 'compare',
          a: [[0, 0.22, 69, 0.78], [0.25, 0.22, 71, 0.78], [0.5, 0.22, 72, 0.82], [0.75, 0.22, 74, 0.8], [1.0, 0.8, 76, 0.84]],
          b: [[0, 0.22, 69, 0.78], [0.25, 0.22, 71, 0.78], [0.5, 0.22, 73, 0.82], [0.75, 0.22, 74, 0.8], [1.0, 0.8, 76, 0.84]],
          optsEn: ['1st time (minor · white key C)', '2nd time (major · black key C♯)'],
          optsZh: ['第 1 遍（小调 · 白键 C）', '第 2 遍（大调 · 黑键 C♯）'],
          ans: 0,
          expEn: 'All five notes of the dash sit cleanly on white keys (A–B–C–D–E) — only watch for G♯ on the dominant chord!',
          expZh: '这五个音全部稳稳落在白键上，唯一要盯紧的黑键是属和弦里的 G♯！'
        }
      ],
      checksEn: [
        'Keep the left-hand staccato pulse rock-steady — don’t rush when the right-hand 16ths arrive.',
        'Read A–B–C–D–E as one smooth 5-finger burst aimed cleanly at E on beat 2.',
        'Spot G♯ in advance whenever the harmony shifts to E major.'
      ],
      checksZh: [
        '左手断奏和弦稳如节拍器，右手十六分音符进来时千万别抢拍。',
        '把 A–B–C–D–E 打包成一个五指冲刺组块，重心稳落在第 2 拍的 E 上。',
        '和声转向属和弦时提前预警临时升 G♯。'
      ]
    },
    {
      id: 'schumann-s10',
      pieceId: 's10',
      abrsm: 'Classic · Grade 3–4',
      abrsmZh: '经典必弹 · 3–4 级',
      title: 'The Happy Farmer (Op. 68 No. 10)',
      titleZh: '快乐的农夫（Op. 68 No. 10）',
      composer: 'Robert Schumann (1810–1856)',
      keyEn: 'F major · 1 flat (B♭)',
      keyZh: 'F 大调 · 1 个降号（B♭）',
      time: '4/4', beatsPerBar: 4, bpm: 104, flats: true,
      homeMidi: 65, keyRange: [53, 72],
      sigPcs: [10], // Bb
      trapPcs: [11], // B natural modulation to C major
      focusEn: 'Left-hand singing melody inversion, B♭ terrain & upbeat dotted bounce',
      focusZh: '左手主旋律认知反转、B♭ 地形与弱起附点律动',
      drills: [
        { m: 58, st: -1, acc: '', clef: 'bass', en: 'B♭3 (bass clef) — F major’s permanent flat in the LEFT hand!', zh: 'B♭3（低音谱号）— 左手歌唱旋律里的常驻降 B！' },
        { m: 53, st: -4, acc: '', clef: 'bass', en: 'F3 (bass clef) — strong tonic anchor of the left-hand tune', zh: 'F3（低音谱号）— 左手旋律的主音锚点' },
        { m: 60, st: 0,  acc: '', clef: 'bass', en: 'C4 (middle C in bass clef) — pickup note that launches the song!', zh: '中央 C（低音谱号上加一线）— 整首曲子的弱起音！' },
        { m: 70, st: 6,  acc: '', clef: 'treble', en: 'B♭4 (treble) — B♭ also lives inside the right-hand off-beat chords', zh: 'B♭4（高音谱号）— 右手后半拍和弦里也有常驻 B♭' },
        { m: 59, st: -1, acc: '♮', clef: 'bass', en: 'B♮3 (bass) — brief bright lift toward C major mid-piece!', zh: 'B♮3（低音谱号）— 中段转向 C 大调时的还原 B！' }
      ],
      rhythm: { durs: [0.5, 1.5, 0.5, 1, 1, 1.5, 0.5, 1.5], barLen: 4, beatSec: 0.56,
        en: 'Start with a cheerful upbeat quaver, then feel the hearty dotted-crotchet stride of the farmer walking home.',
        zh: '轻快的弱起八分音符进拍，感受农夫迈着大步回家的附点律动！' },
      theme: [
        [0, 0.45, 48, 0.78],
        [0.5, 1.35, 53, 0.84], [1.0, 0.4, 65, 0.48], [1.0, 0.4, 69, 0.48],
        [2.0, 0.45, 57, 0.8], [2.5, 0.9, 60, 0.84], [3.0, 0.4, 65, 0.48], [3.0, 0.4, 69, 0.48],
        [3.5, 0.45, 57, 0.8], [4.0, 0.9, 62, 0.86], [4.5, 0.4, 65, 0.48], [4.5, 0.4, 70, 0.48],
        [5.0, 0.9, 60, 0.82], [6.0, 1.4, 57, 0.8]
      ],
      themeBeat: 0.54,
      earQs: [
        {
          qEn: 'Listen closely to the texture: WHICH hand carries the cheerful singing melody here?',
          qZh: '仔细听声部织体：这首曲子里是哪只手在唱欢快的主旋律？',
          play: 'theme',
          optsEn: ['The LEFT hand (deep singing tune!)', 'The RIGHT hand (high melody)'],
          optsZh: ['左手（浑厚歌唱的主旋律！）', '右手（高音旋律）'],
          ans: 0,
          expEn: 'Classic Schumann twist! Most beginners play the right-hand chords too loudly by habit — let your LEFT hand sing boldly while the right hand bounces softly.',
          expZh: '舒曼经典的声部反转！初学者习惯右手弹太响，这里要大胆让左手歌唱、右手轻巧点缀后半拍。'
        },
        {
          qEn: 'In bar 2 the right-hand chord colours the tune with B♭ (F major’s IV chord). Hear both versions — which uses the true B♭?',
          qZh: '第 2 小节右手和弦带出 F 大调的下属和弦 B♭。听两遍对比，哪一遍是原版 B♭？',
          play: 'compare',
          a: [[0, 0.9, 62, 0.76], [0, 0.9, 65, 0.62], [0, 0.9, 71, 0.62], [1, 1.2, 60, 0.8]],
          b: [[0, 0.9, 62, 0.76], [0, 0.9, 65, 0.62], [0, 0.9, 70, 0.65], [1, 1.2, 60, 0.8]],
          optsEn: ['1st time (B♮ — sounds sharp/jarring)', '2nd time (warm B♭ — true F major)'],
          optsZh: ['第 1 遍（白键 B♮ — 发尖违和）', '第 2 遍（温暖的 B♭ — 纯正 F 大调）'],
          ans: 1,
          expEn: 'B♭ keeps the IV chord (B♭ major) warm and folksy — lock B♭ in both hands!',
          expZh: 'B♭ 让下属和弦温暖醇厚，左右手都要把 B♭ 设为默认黑键地形！'
        }
      ],
      checksEn: [
        'Flip your balance habit: LEFT hand sings the melody proudly, RIGHT hand plays light off-beat chords.',
        'Lock B♭ into both hands before starting (F major key signature).',
        'Breathe in on the upbeat C4 so the downbeat F3 arrives with a joyful stride.'
      ],
      checksZh: [
        '打破右手大声的习惯：左手大胆歌唱主旋律，右手轻巧弹后半拍伴奏和弦。',
        '开弹前双手同时锁定 F 大调常驻黑键 B♭。',
        '用弱起音 C 轻轻呼吸带入，让第 1 拍的 F 迈出欢快的步伐。'
      ]
    }
  ];

  // ---------- Stereo Salamander Piano Audio Engine ----------
  let ctx = null, bus = null, roomIR = null, timers = [], audioGen = 0;
  const buf = {}, loads = {}, NM3 = ['C', 'Ds', 'Fs', 'A'];
  const baseOf = m => Math.max(36, Math.min(96, 36 + Math.round((m - 36) / 3) * 3));
  const salName = m => NM3[((m - 36) / 3) % 4] + (Math.floor(m / 12) - 1) + 'v9';
  function ensureCtx() { if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } } return ctx; }
  function unlock() {
    if (!ensureCtx()) return;
    if (ctx.state === 'suspended') ctx.resume();
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  }
  ['pointerdown', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, unlock, { passive: true }));

  function outBus() {
    if (bus && bus.context === ctx) return bus;
    bus = ctx.createGain();
    let tail = bus;
    if (typeof ctx.createBiquadFilter === 'function') {
      const low = ctx.createBiquadFilter(); low.type = 'lowshelf'; low.frequency.value = 210; low.gain.value = 1.6;
      const hi = ctx.createBiquadFilter(); hi.type = 'highshelf'; hi.frequency.value = 6500; hi.gain.value = -1.2;
      tail.connect(low); low.connect(hi); tail = hi; bus.eq = [low, hi];
    }
    if (typeof ctx.createDynamicsCompressor === 'function') {
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -8; comp.knee.value = 12; comp.ratio.value = 2.5; comp.attack.value = 0.005; comp.release.value = 0.18;
      tail.connect(comp); comp.connect(ctx.destination); bus.comp = comp;
    } else tail.connect(ctx.destination);
    if (!roomIR || roomIR.sampleRate !== ctx.sampleRate) {
      const sr = ctx.sampleRate, len = Math.floor(sr * 0.65);
      roomIR = ctx.createBuffer(2, len, sr);
      const taps = [[[0.021, 0.24], [0.039, 0.14], [0.061, 0.08], [0.089, 0.04]], [[0.025, 0.24], [0.044, 0.14], [0.067, 0.08], [0.095, 0.04]]];
      for (let c = 0; c < 2; c++) {
        const d = roomIR.getChannelData(c);
        taps[c].forEach(([sec, amp]) => { const idx = Math.floor(sec * sr); for (let k = -3; k <= 3; k++) if (idx + k >= 0 && idx + k < len) d[idx + k] += amp * Math.exp(-(k * k) / 4); });
        let lp = 0;
        for (let i = Math.floor(0.03 * sr); i < len; i++) { lp = lp * 0.86 + (Math.random() * 2 - 1) * 0.14; d[i] += lp * Math.pow(1 - i / len, 3.6) * 0.065; }
      }
    }
    const cv = ctx.createConvolver(); cv.buffer = roomIR;
    const wet = ctx.createGain(); wet.gain.value = 0.22;
    cv.connect(wet); wet.connect(bus); bus.verb = cv;
    return bus;
  }
  function stopAudio() {
    audioGen++; timers.forEach(clearTimeout); timers = [];
    if (bus && ctx) { const b = bus; try { b.gain.setTargetAtTime(0, ctx.currentTime, 0.015); } catch (e) {} setTimeout(() => { try { b.disconnect(); if (b.eq) b.eq.forEach(n => n.disconnect()); if (b.comp) b.comp.disconnect(); } catch (e) {} }, 150); }
    bus = null;
  }
  function later(fn, ms) { const g = audioGen; const t = setTimeout(() => { if (g === audioGen) fn(); }, ms); timers.push(t); }
  function loadSample(base) {
    if (!ensureCtx()) return Promise.resolve(null);
    if (!loads[base]) loads[base] = fetch('/audio/sal/' + salName(base) + '.mp3').then(r => r.arrayBuffer()).then(a => new Promise((ok, no) => ctx.decodeAudioData(a, ok, no))).then(b => { buf[base] = b; return b; }).catch(() => null);
    return loads[base];
  }
  function preloadMidis(midis) { return Promise.all([...new Set(midis.map(baseOf))].map(loadSample)); }
  function playNote(m, at = 0, vel = 0.72, len = 0.75, waited = false) {
    if (!ensureCtx()) return;
    const gen = audioGen;
    if (ctx.state === 'suspended') ctx.resume();
    const base = baseOf(m), b = buf[base];
    if (!b && !waited) {
      const p = loadSample(base), startMs = performance.now();
      let done = false;
      const go = () => { if (done || gen !== audioGen) return; done = true; playNote(m, Math.max(0, at - (performance.now() - startMs) / 1000), vel, len, true); };
      p.then(go); setTimeout(go, 3500);
      return;
    }
    const t0 = ctx.currentTime + at;
    const g = ctx.createGain(); g.gain.value = (0.48 + 0.56 * vel) * 0.9;
    let outNode = g;
    if (typeof ctx.createStereoPanner === 'function') {
      const pan = ctx.createStereoPanner(); pan.pan.value = Math.max(-1, Math.min(1, (m - 62) / 34)) * 0.22;
      g.connect(pan); outNode = pan;
    }
    outNode.connect(outBus());
    if (b) {
      const s = ctx.createBufferSource(); s.buffer = b; s.playbackRate.value = Math.pow(2, (m - base) / 12);
      s.connect(g); outNode.connect(outBus().verb); s.start(t0); g.gain.setTargetAtTime(0, t0 + len, len < 0.28 ? 0.09 : 0.24); s.stop(t0 + len + 1.6);
    } else {
      const o = ctx.createOscillator(), f = ctx.createBiquadFilter();
      o.type = 'triangle'; o.frequency.value = 440 * Math.pow(2, (m - 69) / 12);
      f.type = 'lowpass'; f.frequency.value = 1400;
      o.connect(f); f.connect(g); g.gain.setValueAtTime(0.24, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + len); o.start(t0); o.stop(t0 + len + 0.05);
    }
  }
  function wood(at, strong) {
    if (!ensureCtx()) return;
    const t0 = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.setValueAtTime(strong ? 1480 : 1080, t0); o.frequency.exponentialRampToValueAtTime(strong ? 880 : 680, t0 + 0.05);
    f.type = 'bandpass'; f.frequency.value = strong ? 1380 : 980;
    g.gain.setValueAtTime(strong ? 0.26 : 0.17, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.08);
    o.connect(f); f.connect(g); g.connect(outBus()); o.start(t0); o.stop(t0 + 0.09);
  }
  function playEvents(evList, beatSec, startSec = 0.08) {
    let maxEnd = startSec;
    const byBeat = {};
    evList.forEach(ev => { const k = Math.round(ev[0] * 100); (byBeat[k] = byBeat[k] || []).push(ev); });
    Object.values(byBeat).forEach(grp => grp.sort((a, b) => a[2] - b[2]));
    evList.forEach(ev => {
      const [b, d, m, v] = ev;
      const grp = byBeat[Math.round(b * 100)] || [ev];
      const roll = grp.length > 1 ? grp.indexOf(ev) * 0.008 : 0;
      const arch = 1 + 0.07 * Math.sin(Math.PI * ((b % 4) / 4));
      const t = startSec + b * beatSec + roll + (Math.random() - 0.5) * 0.006;
      const dur = Math.max(0.14, d * beatSec);
      playNote(m, t, Math.min(0.86, (v || 0.72) * arch * (0.97 + Math.random() * 0.06)), dur + 0.08);
      maxEnd = Math.max(maxEnd, t + dur);
    });
    return (maxEnd - startSec) * 1000;
  }
  function playRealPieceIfAvailable(p) {
    const src = p.pieceId && window.PIECES && window.PIECES.find(x => x.id === p.pieceId);
    if (!src) {
      const midis = p.theme.map(x => x[2]);
      preloadMidis(midis).then(() => playEvents(p.theme, p.themeBeat, 0.08));
      return;
    }
    const maxB = Math.min(src.T, src.k * 4 + (src.up || 0));
    const evs = src.ev.filter(e => e.t < maxB - 0.01);
    preloadMidis(evs.map(e => e.m)).then(() => {
      evs.forEach(e => playNote(e.m, 0.1 + e.t * src.B, e.mel ? 0.8 : 0.52, e.d * src.B + 0.05));
    });
  }

  // ---------- 3-Mode Input Engine: Screen / Real Acoustic Piano (Mic YIN + Onset) / Web MIDI ----------
  let inputMode = 'screen';
  let micStream = null, micAnalyser = null, micBuf = null, micRaf = 0;
  let lastPc = -1, pcStreak = 0, lastMicFire = 0, prevRms = 0, lastOnset = 0;
  let midiAccess = null, midiCount = 0;
  let activePitchHandler = null, activeTapHandler = null;

  // YIN pitch detector tuned for acoustic piano (65–1400 Hz)
  function detectYinMidi(bufArr, sr) {
    let rms = 0;
    for (let i = 0; i < bufArr.length; i++) rms += bufArr[i] * bufArr[i];
    rms = Math.sqrt(rms / bufArr.length);
    if (rms < 0.014) return { midi: null, rms };
    const half = Math.floor(bufArr.length / 2);
    const minTau = Math.max(16, Math.floor(sr / 1400)), maxTau = Math.min(half - 1, Math.floor(sr / 65));
    const d = new Float32Array(maxTau + 1);
    let run = 0, bestTau = -1;
    for (let tau = 1; tau <= maxTau; tau++) {
      let s = 0;
      for (let i = 0; i < half; i++) { const diff = bufArr[i] - bufArr[i + tau]; s += diff * diff; }
      run += s;
      d[tau] = run ? (s * tau) / run : 1;
      if (tau >= minTau && d[tau] < 0.14) {
        while (tau + 1 <= maxTau && d[tau + 1] < d[tau]) tau++;
        bestTau = tau;
        break;
      }
    }
    if (bestTau < 0) return { midi: null, rms };
    const hz = sr / bestTau;
    const midi = Math.round(69 + 12 * Math.log2(hz / 440));
    return { midi: (midi >= 36 && midi <= 96) ? midi : null, rms };
  }

  function stopMic() {
    if (micRaf) { cancelAnimationFrame(micRaf); micRaf = 0; }
    if (micStream) { micStream.getTracks().forEach(t => t.stop()); micStream = null; }
    micAnalyser = null;
  }
  async function startMic() {
    unlock();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      updateInputStatus(lang === 'zh' ? '当前浏览器不支持麦克风，已切换回屏幕琴键。' : 'Microphone not supported in this browser — using Screen mode.');
      setInputMode('screen');
      return;
    }
    try {
      stopMic();
      micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const src = ctx.createMediaStreamSource(micStream);
      micAnalyser = ctx.createAnalyser(); micAnalyser.fftSize = 2048;
      src.connect(micAnalyser);
      micBuf = new Float32Array(micAnalyser.fftSize);
      lastPc = -1; pcStreak = 0; prevRms = 0;
      updateInputStatus(null);
      const loop = () => {
        if (!micAnalyser || inputMode !== 'mic') return;
        micAnalyser.getFloatTimeDomainData(micBuf);
        const now = performance.now();
        const { midi, rms } = detectYinMidi(micBuf, ctx.sampleRate);
        // Rhythm onset detection (piano key strike or clap)
        if (activeTapHandler && rms > 0.032 && rms > prevRms * 1.9 && now - lastOnset > 165) {
          lastOnset = now;
          activeTapHandler('mic');
        }
        prevRms = prevRms * 0.7 + rms * 0.3;
        // Stable single-note pitch detection for Stage 1 Key Radar
        if (activePitchHandler && midi != null) {
          const pc = ((midi % 12) + 12) % 12;
          if (pc === lastPc) pcStreak++; else { lastPc = pc; pcStreak = 1; }
          const pill = $('heard-pill');
          if (pill && S.piece) pill.textContent = (lang === 'zh' ? '听到：' : 'Heard: ') + noteName(midi, S.piece.flats);
          if (pcStreak === 3 && now - lastMicFire > 420) {
            lastMicFire = now;
            activePitchHandler(midi, true);
          }
        }
        micRaf = requestAnimationFrame(loop);
      };
      micRaf = requestAnimationFrame(loop);
    } catch (e) {
      updateInputStatus(lang === 'zh' ? '未开启麦克风权限，可继续用屏幕琴键或刷新授权。' : 'Microphone permission declined — you can continue with Screen keys.');
      setInputMode('screen');
    }
  }

  async function startMidi() {
    unlock();
    if (!navigator.requestMIDIAccess) {
      updateInputStatus(lang === 'zh' ? '当前浏览器不支持 Web MIDI（推荐 Chrome / Edge 连电钢），先用屏幕琴键。' : 'Web MIDI requires Chrome or Edge — using Screen mode for now.');
      setInputMode('screen');
      return;
    }
    try {
      midiAccess = await navigator.requestMIDIAccess();
      const bind = () => {
        midiCount = 0;
        for (const inp of midiAccess.inputs.values()) {
          midiCount++;
          inp.onmidimessage = ev => {
            const [st, note, vel] = ev.data;
            if ((st & 0xf0) === 0x90 && vel > 0 && inputMode === 'midi') {
              playNote(note, 0, Math.min(1, vel / 110), 0.55);
              const pill = $('heard-pill');
              if (pill && S.piece) pill.textContent = 'MIDI: ' + noteName(note, S.piece.flats);
              if (activePitchHandler) activePitchHandler(note, false);
              if (activeTapHandler) activeTapHandler('midi');
            }
          };
        }
        updateInputStatus(null);
      };
      midiAccess.onstatechange = bind;
      bind();
    } catch (e) {
      updateInputStatus(lang === 'zh' ? '无法连接 MIDI 电钢，先切回屏幕琴键。' : 'Could not access MIDI device — switched to Screen mode.');
      setInputMode('screen');
    }
  }

  function setInputMode(m) {
    inputMode = m;
    document.querySelectorAll('.inbtn').forEach(b => b.classList.toggle('on', b.dataset.in === m));
    if (m !== 'mic') stopMic();
    if (m === 'mic') startMic();
    else if (m === 'midi') startMidi();
    else updateInputStatus(null);
    track('input-' + m);
  }
  function updateInputStatus(errMsg) {
    const st = $('in-status'); if (!st) return;
    if (errMsg) { st.hidden = false; st.innerHTML = `<span style="color:var(--bad);font-weight:700">${errMsg}</span>`; return; }
    if (inputMode === 'mic') {
      st.hidden = false;
      st.innerHTML = `<span class="mic-dot"></span><span>${lang === 'zh' ? '真钢琴监听中：把 iPad/手机放上谱架，直接弹真钢琴即可！' : 'Listening for your real piano: set your device on the music stand and play!'}</span><span class="heard-pill" id="heard-pill">—</span>`;
    } else if (inputMode === 'midi') {
      st.hidden = false;
      const msg = midiCount
        ? (lang === 'zh' ? `已连接 ${midiCount} 台 MIDI 电钢琴，直接弹琴即可！` : `Connected to ${midiCount} MIDI piano — play directly on your keys!`)
        : (lang === 'zh' ? '未检测到 MIDI 电钢：请用 USB/蓝牙连接电钢，或先点屏幕琴键。' : 'No MIDI piano detected yet — connect via USB/Bluetooth or tap Screen keys.');
      st.innerHTML = `<span class="mic-dot" style="background:${midiCount ? 'var(--good)' : 'var(--coral)'}"></span><span>${msg}</span><span class="heard-pill" id="heard-pill">—</span>`;
    } else {
      st.hidden = true;
    }
  }

  // ---------- SVG Staff & Full-Width Interactive Piano Renderers ----------
  function staffSvg(piece, drill) {
    const clef = drill.clef || 'treble';
    const W = 440, H = 128, topY = 30, sp = 12; // 5 lines at topY + 0..4*sp
    // step 0 = C4. Treble bottom line (E4) = step 2 -> y = topY + 4*sp. Bass top line (A3) = step -2 -> y = topY.
    const yOf = st => clef === 'bass' ? (topY + ((-2 - st) * sp / 2)) : (topY + 4 * sp - ((st - 2) * sp / 2));
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Staff note">`;
    for (let i = 0; i < 5; i++) s += `<line x1="20" y1="${topY + i * sp}" x2="${W - 20}" y2="${topY + i * sp}" stroke="var(--ink)" stroke-width="1.4" opacity=".65"/>`;
    // Clef glyph
    s += `<text x="32" y="${clef === 'bass' ? topY + 34 : topY + 44}" font-size="${clef === 'bass' ? 42 : 58}" fill="var(--ink)" font-family="serif">${clef === 'bass' ? '𝄢' : '𝄞'}</text>`;
    // Key signature display
    const sigSharpTreble = [10, 7, 11], sigFlatTreble = [6, 9];
    const sigSharpBass = [-4, -7, -3], sigFlatBass = [-8, -5];
    const nSharps = piece.flats ? 0 : piece.sigPcs.length;
    const nFlats = piece.flats ? piece.sigPcs.length : 0;
    for (let i = 0; i < nSharps; i++) {
      const st = (clef === 'bass' ? sigSharpBass : sigSharpTreble)[i];
      s += `<text x="${82 + i * 16}" y="${yOf(st) + 7}" font-size="22" font-weight="700" fill="var(--coral)">♯</text>`;
    }
    for (let i = 0; i < nFlats; i++) {
      const st = (clef === 'bass' ? sigFlatBass : sigFlatTreble)[i];
      s += `<text x="${82 + i * 16}" y="${yOf(st) + 6}" font-size="22" font-weight="700" fill="var(--coral)">♭</text>`;
    }
    // Target note
    const nx = 252, ny = yOf(drill.st);
    // Ledger lines
    if (clef === 'treble') {
      for (let st = 0; st >= drill.st; st -= 2) s += `<line x1="${nx - 18}" y1="${yOf(st)}" x2="${nx + 18}" y2="${yOf(st)}" stroke="var(--ink)" stroke-width="1.5"/>`;
      for (let st = 12; st <= drill.st; st += 2) s += `<line x1="${nx - 18}" y1="${yOf(st)}" x2="${nx + 18}" y2="${yOf(st)}" stroke="var(--ink)" stroke-width="1.5"/>`;
    } else {
      for (let st = 0; st <= drill.st; st += 2) s += `<line x1="${nx - 18}" y1="${yOf(st)}" x2="${nx + 18}" y2="${yOf(st)}" stroke="var(--ink)" stroke-width="1.5"/>`;
    }
    if (drill.acc) s += `<text x="${nx - 32}" y="${ny + 8}" font-size="26" font-weight="900" fill="var(--coral)">${drill.acc}</text>`;
    s += `<ellipse cx="${nx}" cy="${ny}" rx="10.5" ry="7.5" transform="rotate(-18 ${nx} ${ny})" fill="var(--ink)"/>`;
    const stemUp = ny > topY + 2 * sp;
    s += `<line x1="${stemUp ? nx + 9.5 : nx - 9.5}" y1="${ny}" x2="${stemUp ? nx + 9.5 : nx - 9.5}" y2="${stemUp ? ny - 36 : ny + 36}" stroke="var(--ink)" stroke-width="2.2"/>`;
    s += `</svg>`;
    return s;
  }

  function interactiveKbSvg(piece, showTerrain) {
    const [lo0, hi0] = piece.keyRange;
    let lo = lo0, hi = hi0;
    while (IS_BLK(lo)) lo--;
    while (IS_BLK(hi)) hi++;
    const whites = []; for (let m = lo; m <= hi; m++) if (!IS_BLK(m)) whites.push(m);
    const W = 680, H = 112, kw = (W - 12) / whites.length, bw = kw * 0.6, bh = H * 0.62;
    let s = `<svg class="kb-svg" id="pf-kb" viewBox="0 0 ${W} ${H + 8}" role="group" aria-label="Piano keyboard">`;
    s += `<rect x="2" y="2" width="${W - 4}" height="${H + 4}" rx="12" fill="var(--line)"/>`;
    whites.forEach((m, i) => {
      const pc = ((m % 12) + 12) % 12;
      const cls = ['kw'];
      if (showTerrain && pc === ((piece.homeMidi % 12) + 12) % 12) cls.push('k-home');
      else if (showTerrain && piece.sigPcs.includes(pc)) cls.push('k-sig');
      else if (showTerrain && piece.trapPcs.includes(pc)) cls.push('k-trap');
      const x = 6 + i * kw;
      s += `<rect class="${cls.join(' ')}" data-m="${m}" x="${(x + 1.5).toFixed(1)}" y="4" width="${(kw - 3).toFixed(1)}" height="${H}" rx="6"/>`;
      if (pc === 0 || (showTerrain && pc === ((piece.homeMidi % 12) + 12) % 12)) {
        s += `<text x="${(x + kw / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--muted)" pointer-events="none">${pcName(m, piece.flats)}</text>`;
      }
    });
    for (let m = lo; m <= hi; m++) {
      if (!IS_BLK(m)) continue;
      const cnt = whites.filter(w => w < m).length;
      if (cnt <= 0 || cnt >= whites.length) continue;
      const pc = ((m % 12) + 12) % 12;
      const cls = ['kb'];
      if (showTerrain && piece.sigPcs.includes(pc)) cls.push('k-sig');
      else if (showTerrain && piece.trapPcs.includes(pc)) cls.push('k-trap');
      const bx = 6 + cnt * kw - bw / 2;
      s += `<rect class="${cls.join(' ')}" data-m="${m}" x="${bx.toFixed(1)}" y="4" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="5"/>`;
      if (showTerrain && (piece.sigPcs.includes(pc) || piece.trapPcs.includes(pc))) {
        s += `<text x="${(bx + bw / 2).toFixed(1)}" y="${(bh - 7).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="900" fill="#fff" pointer-events="none">${pcName(m, piece.flats)}</text>`;
      }
    }
    return s + `</svg>`;
  }

  function rhythmSvg(rh, litIdx = -1, hitStatus = []) {
    const total = rh.durs.reduce((a, b) => a + b, 0);
    const W = 540, H = 72, pad = 16, inner = W - pad * 2;
    let s = `<svg class="rh-grid" viewBox="0 0 ${W} ${H}" role="img" aria-label="Rhythm skeleton">`;
    // Beat grid lines & bar line
    for (let b = 0; b <= total; b++) {
      const x = pad + (b / total) * inner;
      const isBar = b > 0 && b < total && b % rh.barLen === 0;
      s += `<line x1="${x.toFixed(1)}" y1="10" x2="${x.toFixed(1)}" y2="56" stroke="${isBar ? 'var(--ink)' : 'var(--line)'}" stroke-width="${isBar ? 2.6 : 1.3}" opacity="${isBar ? 0.55 : 0.9}"/>`;
    }
    let t = 0;
    rh.durs.forEach((d, i) => {
      const x = pad + (t / total) * inner + 2;
      const w = Math.max(10, (d / total) * inner - 5);
      const st = hitStatus[i];
      const fill = i === litIdx ? 'var(--coral)' : st === 'ok' ? 'var(--good)' : st === 'miss' ? 'var(--bad)' : 'var(--ink)';
      const op = i === litIdx || st ? 1 : 0.78;
      s += `<rect x="${x.toFixed(1)}" y="19" width="${w.toFixed(1)}" height="28" rx="9" fill="${fill}" opacity="${op}"/>`;
      t += d;
    });
    s += `</svg>`;
    return s;
  }

  // ---------- App State & Stage Rendering ----------
  const S = { piece: null, step: 0, done: [false, false, false, false], drillIdx: 0, drillMode: 'explore', earIdx: 0, earAns: false, tapTimes: [], rhActive: false, rhStart: 0 };

  function renderDir() {
    $('v-dir').hidden = false; $('v-run').hidden = true;
    stopAudio(); stopMic(); activePitchHandler = null; activeTapHandler = null;
    const zh = lang === 'zh';
    $('t-sub').textContent = zh ? '曲目上琴前热身' : 'Piece Pre-Flight';
    $('t-aural').textContent = zh ? '四级听力课' : 'Grade 4 Aural';
    $('t-home').textContent = zh ? '← 返回 Dottino 首页' : '← Dottino home';
    $('t-eyebrow').textContent = zh ? '曲目上琴前热身 · 4 分钟认知起飞' : 'Piece Pre-Flight · Prepare before you play';
    $('t-h1').textContent = zh ? '手还没上琴，先把耳朵和指尖热好。' : 'Warm up your ear & hands before bar 1.';
    $('t-lede').textContent = zh
      ? '开新曲子总卡壳，是因为调号、节奏和听觉预期同时撞在一起。把 iPad/手机放上钢琴谱架，4 分钟完成上琴前认知热身——支持真钢琴麦克风、电钢 MIDI 与屏幕琴键。'
      : 'Most mistakes on a new piece happen because key signatures, rhythms and listening collide all at once. Put your iPad on the piano music stand for a 4-minute pre-flight check — works with a real acoustic piano, MIDI piano or screen keys.';
    $('pgrid').innerHTML = CATALOG.map(p => `
      <button class="pcard${p.abrsm.startsWith('ABRSM') ? ' abrsm' : ''}" data-pid="${p.id}" type="button">
        <div class="pbadges">
          <span class="pbadge${p.abrsm.includes('2027') ? ' new' : ''}">${zh ? p.abrsmZh : p.abrsm}</span>
          <span class="pbadge">${p.time}</span>
        </div>
        <h3>${zh ? p.titleZh : p.title}</h3>
        <div class="comp">${p.composer}</div>
        <div class="focus">${zh ? p.focusZh : p.focusEn}</div>
        <div class="go">${zh ? '开始 4 分钟热身 →' : 'Start 4-min pre-flight →'}</div>
      </button>
    `).join('');
    $('pgrid').querySelectorAll('[data-pid]').forEach(b => b.onclick = () => openPiece(b.dataset.pid));
  }

  function openPiece(id) {
    const p = CATALOG.find(x => x.id === id) || CATALOG[0];
    S.piece = p; S.step = 0; S.done = [false, false, false, false]; S.drillIdx = 0; S.drillMode = 'explore'; S.earIdx = 0; S.earAns = false;
    $('v-dir').hidden = true; $('v-run').hidden = false;
    track('open-' + p.id);
    try { history.replaceState(null, '', '?p=' + p.id + (REF ? '&ref=' + REF : '')); } catch (e) {}
    const midis = p.theme.map(x => x[2]).concat(p.drills.map(x => x.m));
    preloadMidis(midis);
    renderSession();
  }

  function renderSession() {
    const p = S.piece, zh = lang === 'zh';
    $('btn-back').textContent = zh ? '← 全部曲目' : '← All pieces';
    $('btn-play-theme').textContent = zh ? '♪ 听开篇主题' : '♪ Hear theme';
    $('t-inlbl').textContent = zh ? '输入方式（可放上琴谱架）：' : 'Input mode (for your music stand):';
    $('in-screen').textContent = zh ? '📱 屏幕琴键' : '📱 Screen';
    $('in-mic').textContent = zh ? '🎤 真钢琴监听' : '🎤 Real Piano (Mic)';
    $('in-midi').textContent = zh ? '🎹 电钢 MIDI' : '🎹 MIDI Piano';
    $('r-badges').innerHTML = `<span class="pbadge${p.abrsm.includes('2027') ? ' new' : ''}">${zh ? p.abrsmZh : p.abrsm}</span><span class="pbadge">${p.time}</span>`;
    $('r-title').textContent = zh ? p.titleZh : p.title;
    $('r-meta').textContent = `${p.composer} · ${zh ? p.keyZh : p.keyEn}`;
    const stepLabels = zh
      ? [['1', '调性地形'], ['2', '节奏骨架'], ['3', '听觉预期'], ['4', '起飞清单']]
      : [['1', 'Key terrain'], ['2', 'Rhythm lock'], ['3', 'Ear preview'], ['4', 'Pre-flight card']];
    $('r-steps').innerHTML = stepLabels.map(([n, lb], i) => `
      <button class="step-tab${S.step === i ? ' cur' : ''}${S.done[i] ? ' done' : ''}" data-st="${i}" type="button">
        <b>${S.done[i] ? '✓' : n}</b><span>${lb}</span>
      </button>`).join('');
    $('r-steps').querySelectorAll('[data-st]').forEach(b => b.onclick = () => { stopAudio(); S.step = +b.dataset.st; S.earAns = false; renderStage(); });
    updateInputStatus(null);
    renderStage();
  }

  function renderStage() {
    stopAudio(); activePitchHandler = null; activeTapHandler = null; S.rhActive = false;
    $('r-steps').querySelectorAll('.step-tab').forEach((el, i) => { el.classList.toggle('cur', i === S.step); el.classList.toggle('done', S.done[i]); });
    if (S.step === 0) renderStep1();
    else if (S.step === 1) renderStep2();
    else if (S.step === 2) renderStep3();
    else renderStep4();
  }

  // ---- STAGE 1: KEY & ACCIDENTAL TERRAIN ----
  function renderStep1() {
    const p = S.piece, zh = lang === 'zh', st = $('stage');
    if (S.drillMode === 'explore') {
      st.innerHTML = `
        <div>
          <h3>${zh ? '第 1 步 · 先把调性看成“预设地形”' : 'Step 1 · Map the key terrain before reading'}</h3>
          <p style="color:var(--muted);font-size:15px;margin-top:4px">${zh
            ? '下面高亮了本曲的主音（绿）、调号常驻键（橙）和临时变音陷阱（黄虚线）。点击或直接在真钢琴上弹几下感受指尖位置，准备好就进入 5 题快反应雷达！'
            : 'Green = home note, orange = permanent key-signature keys, dashed gold = accidental traps. Tap or play them on your real piano to feel the terrain, then run the 5-note radar!'}</p>
        </div>
        <div class="kb-wrap">${interactiveKbSvg(p, true)}</div>
        <div class="legend">
          <span><i style="background:var(--good)"></i>${zh ? '主音 Home' : 'Home note'}</span>
          ${p.sigPcs.length ? `<span><i style="background:var(--coral)"></i>${zh ? '调号常驻黑键' : 'Key signature'}</span>` : ''}
          ${p.trapPcs.length ? `<span><i style="background:#D98A1A"></i>${zh ? '高频临时升降号陷阱' : 'Accidental trap'}</span>` : ''}
        </div>
        <div class="acts">
          <button class="btn coral" id="s1-go" type="button">${zh ? '开始 5 题调性雷达 →' : 'Start 5-note key radar →'}</button>
        </div>`;
      bindKbClicks(m => playNote(m, 0, 0.78, 0.65));
      $('s1-go').onclick = () => { S.drillMode = 'quiz'; S.drillIdx = 0; renderStep1(); };
      return;
    }

    const d = p.drills[S.drillIdx];
    st.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
        <h3>${zh ? `调性雷达 · 第 ${S.drillIdx + 1} / ${p.drills.length} 题` : `Key Radar · Note ${S.drillIdx + 1} of ${p.drills.length}`}</h3>
        <button class="btn sm ghost" id="s1-map" type="button">${zh ? '看回地形图' : 'View terrain map'}</button>
      </div>
      <div class="staff-wrap">
        ${staffSvg(p, d)}
        <p style="font-size:14px;color:var(--muted)">${inputMode === 'mic'
          ? (zh ? '🎤 请在你的真钢琴上弹出谱上这个音！' : '🎤 Play this note on your real piano!')
          : inputMode === 'midi'
          ? (zh ? '🎹 请在电钢琴上弹出这个音！' : '🎹 Play this note on your MIDI piano!')
          : (zh ? '📱 在下方钢琴键上点出谱上这个音：' : '📱 Tap this note on the keyboard below:')}</p>
      </div>
      <div class="kb-wrap">${interactiveKbSvg(p, false)}</div>
      <div class="fb" id="s1-fb" hidden></div>`;

    $('s1-map').onclick = () => { S.drillMode = 'explore'; renderStep1(); };
    let locked = false;
    const handleKey = (m, pitchClassOnly) => {
      if (locked) return;
      if (!pitchClassOnly) playNote(m, 0, 0.78, 0.6);
      const targetPc = ((d.m % 12) + 12) % 12;
      const gotPc = ((m % 12) + 12) % 12;
      const ok = gotPc === targetPc;
      const kb = $('pf-kb');
      if (kb) {
        const el = kb.querySelector(`[data-m="${m}"]`) || kb.querySelector(`[data-m="${d.m}"]`);
        if (el) { el.classList.add(ok ? 'k-ok' : 'k-no'); setTimeout(() => el.classList.remove('k-ok', 'k-no'), 550); }
      }
      const fb = $('s1-fb'); fb.hidden = false;
      if (ok) {
        locked = true;
        fb.className = 'fb good';
        fb.innerHTML = `✓ ${noteName(d.m, p.flats)}<p>${zh ? d.zh : d.en}</p>`;
        setTimeout(() => {
          if (S.drillIdx + 1 < p.drills.length) { S.drillIdx++; renderStep1(); }
          else { S.done[0] = true; S.drillMode = 'explore'; S.step = 1; renderSession(); }
        }, 950);
      } else {
        fb.className = 'fb bad';
        const hint = ((d.m - m) % 12 === 1 || (d.m - m) === 1) ? (zh ? '差一点！留意升降号黑键。' : 'Close! Check the sharp/flat key right next door.') : (zh ? `你弹的是 ${pcName(m, p.flats)}，再看看谱号和调号。` : `You played ${pcName(m, p.flats)} — check the clef and key signature.`);
        fb.innerHTML = `${zh ? '再试一次' : 'Try again'}<p>${hint}</p>`;
      }
    };
    bindKbClicks(m => handleKey(m, false));
    activePitchHandler = (m, isMic) => handleKey(m, isMic);
  }

  function bindKbClicks(onKey) {
    const kb = $('pf-kb'); if (!kb) return;
    kb.querySelectorAll('[data-m]').forEach(el => {
      el.addEventListener('pointerdown', e => {
        e.preventDefault(); unlock();
        el.classList.add('k-press'); setTimeout(() => el.classList.remove('k-press'), 180);
        onKey(+el.dataset.m);
      });
    });
  }

  // ---- STAGE 2: CORE RHYTHM SKELETON ----
  function renderStep2() {
    const p = S.piece, rh = p.rhythm, zh = lang === 'zh', st = $('stage');
    st.innerHTML = `
      <div>
        <h3>${zh ? '第 2 步 · 剥离音高，先锁住核心节奏骨架' : 'Step 2 · Lock in the core rhythm (no pitch overload)'}</h3>
        <p style="color:var(--muted);font-size:15px;margin-top:4px">${zh ? rh.zh : rh.en}</p>
      </div>
      <div class="staff-wrap">
        <div id="rh-box" style="width:100%">${rhythmSvg(rh, -1, [])}</div>
        <p id="rh-cue" style="font-size:14px;font-weight:700;color:var(--muted)">${zh ? '先点“听示范”，再点“开始跟拍”敲出节奏（支持空格键 / 拍手 / 真琴弹任意单音）。' : 'Hear the pattern first, then press Tap Along (works with button, Spacebar, clapping or any piano key).'}</p>
      </div>
      <div class="acts">
        <button class="btn ghost" id="rh-demo" type="button">${zh ? '▶ 听示范' : '▶ Hear pattern'}</button>
        <button class="btn coral" id="rh-go" type="button">${zh ? '🥁 开始跟拍' : '🥁 Tap along'}</button>
      </div>
      <button class="tap-pad" id="rh-pad" type="button" disabled>${zh ? '点击这里 / 按空格 / 弹琴敲拍' : 'TAP HERE · SPACE · OR PLAY A KEY'}</button>
      <div class="fb" id="rh-fb" hidden></div>`;

    const expectedBeats = []; let acc = 0;
    rh.durs.forEach(d => { expectedBeats.push(acc); acc += d; });
    const totalBeats = acc;

    $('rh-demo').onclick = () => {
      stopAudio(); unlock();
      const bSec = rh.beatSec;
      for (let b = 0; b < totalBeats; b++) wood(0.12 + b * bSec, b % rh.barLen === 0);
      expectedBeats.forEach((eb, i) => {
        playNote(p.homeMidi, 0.12 + eb * bSec, 0.78, Math.max(0.14, rh.durs[i] * bSec * 0.85));
        later(() => { const box = $('rh-box'); if (box) box.innerHTML = rhythmSvg(rh, i, []); }, (0.12 + eb * bSec) * 1000);
      });
      later(() => { const box = $('rh-box'); if (box) box.innerHTML = rhythmSvg(rh, -1, []); }, (0.12 + totalBeats * bSec + 0.25) * 1000);
    };

    const registerTap = () => {
      if (!S.rhActive) return;
      const nowSec = (performance.now() - S.rhStart) / 1000;
      S.tapTimes.push(nowSec);
      const pad = $('rh-pad');
      if (pad) { pad.classList.add('down'); setTimeout(() => pad.classList.remove('down'), 90); }
      playNote(p.homeMidi, 0, 0.55, 0.18);
    };
    $('rh-pad').onpointerdown = e => { e.preventDefault(); registerTap(); };
    activeTapHandler = () => registerTap();

    $('rh-go').onclick = () => {
      stopAudio(); unlock();
      const bSec = rh.beatSec, countIn = rh.barLen;
      S.tapTimes = []; S.rhActive = false;
      $('rh-fb').hidden = true; $('rh-pad').disabled = false;
      for (let c = 0; c < countIn; c++) {
        wood(0.15 + c * bSec, c === 0);
        later(() => { if ($('rh-cue')) $('rh-cue').textContent = (zh ? '预备拍：' : 'Count-in: ') + (c + 1); }, (0.15 + c * bSec) * 1000);
      }
      const goAtMs = (0.15 + countIn * bSec) * 1000;
      later(() => {
        S.rhActive = true; S.rhStart = performance.now();
        if ($('rh-cue')) $('rh-cue').textContent = zh ? '就是现在！敲出这 2 小节节奏！' : 'NOW! Tap, clap, or play the rhythm!';
        for (let b = 0; b < totalBeats; b++) wood(b * bSec, b % rh.barLen === 0);
      }, goAtMs);
      later(() => {
        S.rhActive = false; $('rh-pad').disabled = true;
        // Evaluate hits against expected onsets (±180ms window)
        const expectedSecs = expectedBeats.map(b => b * bSec);
        const used = new Set(), status = [];
        let hits = 0;
        expectedSecs.forEach(exp => {
          let best = -1, bestD = 0.19;
          S.tapTimes.forEach((t, j) => { if (used.has(j)) return; const d = Math.abs(t - exp); if (d < bestD) { bestD = d; best = j; } });
          if (best >= 0) { used.add(best); hits++; status.push('ok'); } else status.push('miss');
        });
        if ($('rh-box')) $('rh-box').innerHTML = rhythmSvg(rh, -1, status);
        const ratio = hits / expectedSecs.length;
        const fb = $('rh-fb'); fb.hidden = false;
        const pass = ratio >= 0.65;
        fb.className = 'fb ' + (pass ? 'good' : 'bad');
        fb.innerHTML = pass
          ? `${zh ? `很稳！命中 ${hits}/${expectedSecs.length} 个拍点` : `Locked in! ${hits}/${expectedSecs.length} notes on the beat`}<p>${zh ? '节奏骨架已经进身体了，进入下一步建立听觉预期。' : 'Your rhythm skeleton is locked in — ready for the ear preview.'}</p><div class="acts" style="margin-top:10px"><button class="btn coral sm" id="rh-next" type="button">${zh ? '下一步：听觉预期 →' : 'Next: Ear Preview →'}</button></div>`
          : `${zh ? `命中 ${hits}/${expectedSecs.length} 个拍点` : `Hit ${hits}/${expectedSecs.length} notes`}<p>${zh ? '可以先听一遍示范再试一次，或直接跳过进入下一步。' : 'Hear the demo once more and try again, or continue when ready.'}</p><div class="acts" style="margin-top:10px"><button class="btn ghost sm" id="rh-next" type="button">${zh ? '继续下一步 →' : 'Continue →'}</button></div>`;
        if (pass) S.done[1] = true;
        $('rh-next').onclick = () => { S.done[1] = true; S.step = 2; renderSession(); };
      }, goAtMs + (totalBeats * bSec + 0.55) * 1000);
    };
  }

  // ---- STAGE 3: EAR PREVIEW & COGNITIVE TRAP ----
  function renderStep3() {
    const p = S.piece, q = p.earQs[S.earIdx], zh = lang === 'zh', st = $('stage');
    const playClip = () => {
      stopAudio(); unlock();
      if (q.play === 'theme') playEvents(p.theme, p.themeBeat, 0.08);
      else {
        const d1 = playEvents(q.a, 0.5, 0.08);
        playEvents(q.b, 0.5, 0.08 + d1 / 1000 + 0.65);
      }
    };
    st.innerHTML = `
      <div>
        <h3>${zh ? `第 3 步 · 听觉预期（${S.earIdx + 1} / ${p.earQs.length}）` : `Step 3 · Ear Preview (${S.earIdx + 1} of ${p.earQs.length})`}</h3>
        <p style="font-size:16px;font-weight:700;margin-top:6px">${zh ? q.qZh : q.qEn}</p>
      </div>
      <div class="acts"><button class="btn coral" id="e-play" type="button">${zh ? '▶ 播放乐句' : '▶ Play excerpt'}</button></div>
      <div class="opts" id="e-opts">${(zh ? q.optsZh : q.optsEn).map((lb, i) => `<button class="opt" data-i="${i}" type="button">${lb}</button>`).join('')}</div>
      <div class="fb" id="e-fb" hidden></div>`;
    $('e-play').onclick = playClip;
    playClip();
    $('e-opts').querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (S.earAns) return;
      S.earAns = true;
      const pickI = +b.dataset.i, ok = pickI === q.ans;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) $('e-opts').querySelector(`[data-i="${q.ans}"]`).classList.add('right');
      const fb = $('e-fb'); fb.hidden = false; fb.className = 'fb ' + (ok ? 'good' : 'bad');
      const nextLabel = S.earIdx + 1 < p.earQs.length ? (zh ? '下一题 →' : 'Next question →') : (zh ? '生成上琴前起飞清单 →' : 'Open Pre-Flight Card →');
      fb.innerHTML = `${ok ? (zh ? '✓ 听得很准！' : '✓ Spot on!') : (zh ? '注意听这个细节：' : 'Here is what to listen for:')}<p>${zh ? q.expZh : q.expEn}</p><div class="acts" style="margin-top:10px"><button class="btn coral sm" id="e-next" type="button">${nextLabel}</button></div>`;
      $('e-next').onclick = () => {
        S.earAns = false;
        if (S.earIdx + 1 < p.earQs.length) { S.earIdx++; renderStep3(); }
        else { S.done[2] = true; S.done[3] = true; S.step = 3; track('complete-' + p.id); renderSession(); }
      };
    });
  }

  // ---- STAGE 4: PRE-FLIGHT COCKPIT CARD ----
  function renderStep4() {
    const p = S.piece, zh = lang === 'zh', st = $('stage');
    const checks = zh ? p.checksZh : p.checksEn;
    const g = /Grade 3/.test(p.abrsm) ? 3 : 4;
    const gZh = g === 3 ? '三级' : '四级';
    const owned = !!(window.DottinoPay && window.DottinoPay.hasAccess(g));
    const destW1 = g === 4 ? '/aural?w=1&ref=pieces-' + p.id : `/aural?g=${g}&w=1&ref=pieces-${p.id}`;
    const destW2 = g === 4 ? '/aural?w=2' : `/aural?g=${g}&w=2`;
    st.innerHTML = `
      <div>
        <div class="eyebrow">${zh ? '准备就绪 · 可以上琴了！' : 'Cleared for takeoff · Ready to play!'}</div>
        <h3 style="font-size:24px;margin-top:4px">${zh ? '上琴前 3 条专属避坑清单' : 'Your 3-point pre-flight checklist'}</h3>
      </div>
      <ul class="checklist">${checks.map((c, i) => `<li><b class="num">${i + 1}</b><span>${c}</span></li>`).join('')}</ul>
      <div class="acts">
        <button class="btn coral" id="pf-hear" type="button">${zh ? '♪ 听完整开篇范奏' : '♪ Hear full opening'}</button>
        <button class="btn ghost" id="pf-share" type="button">${zh ? '复制链接发给学生/家长' : 'Copy link for student'}</button>
        <span id="pf-copied" style="font-size:13.5px;font-weight:700;color:var(--good)"></span>
      </div>
      <div class="upsell">
        <h3>${zh ? `也在准备英皇${gZh}听力考试吗？` : `Preparing for ABRSM Grade ${g} Aural too?`}</h3>
        <p>${zh ? `用同样的可视化方法系统练透${gZh}全部听力题型 + 第 8 周完整模拟考（3/4/5 级均已上线）。第 1 周完全免费，或一次性 £15 解锁全部 8 周。` : `Train every Grade ${g} aural test with the exact same visual tools and Week 8 full mocks (Grades 3, 4 & 5 all live). Try Week 1 free, or unlock all 8 weeks for £15.`}</p>
        <div class="acts">
          <a class="btn ghost sm" href="${destW1}">${zh ? `免费试学${gZh}第 1 周` : `Try Grade ${g} Week 1 Free`}</a>
          <a class="btn ghost sm" href="/ear-check/?ref=pieces-${p.id}">${zh ? '3 分钟免费听力自测' : 'Free 3-Min Ear Check'}</a>
          <button class="btn coral sm" id="pf-buyg" type="button">${owned ? (zh ? `已解锁${gZh} ✓ · 进入第 2 周 →` : `Grade ${g} unlocked ✓ · Open Week 2 →`) : (zh ? `解锁${gZh} 8 周听力包 · £15` : `Unlock Grade ${g} Aural Pack · £15`)}</button>
        </div>
      </div>`;
    $('pf-hear').onclick = () => { stopAudio(); unlock(); playRealPieceIfAvailable(p); };
    $('pf-share').onclick = async () => {
      const u = `${location.origin}/pieces/?p=${p.id}`;
      try { await navigator.clipboard.writeText(u); $('pf-copied').textContent = zh ? '已复制 ✓' : 'Copied ✓'; }
      catch (e) { $('pf-copied').textContent = u; }
    };
    $('pf-buyg').onclick = () => {
      track(`buy-g${g}-from-${p.id}`);
      if (window.DottinoPay && window.DottinoPay.active() && !window.DottinoPay.hasAccess(g)) {
        window.DottinoPay.buy(g, { lang, ref: 'pieces-' + p.id, onDone: () => { location.href = destW2; } }).catch(() => { location.href = destW2; });
      } else location.href = destW2;
    };
  }

  // Global wiring
  $('btn-back').onclick = () => { try { history.replaceState(null, '', '/pieces/'); } catch (e) {} renderDir(); };
  $('btn-play-theme').onclick = () => { if (!S.piece) return; stopAudio(); unlock(); playRealPieceIfAvailable(S.piece); };
  document.querySelectorAll('.inbtn').forEach(b => b.onclick = () => setInputMode(b.dataset.in));
  $('lang-en').onclick = () => { lang = 'en'; localStorage.setItem('dottino:lang', 'en'); $('lang-en').setAttribute('aria-pressed', 'true'); $('lang-zh').setAttribute('aria-pressed', 'false'); S.piece ? renderSession() : renderDir(); };
  $('lang-zh').onclick = () => { lang = 'zh'; localStorage.setItem('dottino:lang', 'zh'); $('lang-zh').setAttribute('aria-pressed', 'true'); $('lang-en').setAttribute('aria-pressed', 'false'); S.piece ? renderSession() : renderDir(); };
  addEventListener('keydown', e => { if (e.code === 'Space' && S.step === 1 && S.rhActive) { e.preventDefault(); if (activeTapHandler) activeTapHandler('key'); } });

  $('lang-en').setAttribute('aria-pressed', String(lang === 'en'));
  $('lang-zh').setAttribute('aria-pressed', String(lang === 'zh'));
  const startId = Q.get('p');
  if (startId && CATALOG.some(x => x.id === startId)) openPiece(startId);
  else renderDir();
})();
