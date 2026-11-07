/* Basso Challenges: one entry per social video. Newest last.
   To add one: put the music clip in audio/challenge/, add an entry here, run `node tools/make_challenges.js`, push.
   kind 'meter23': "2 or 3 beats in a bar?" (answer '2' or '3'); kind 'mode': "Major or minor?" (answer 'Major' or 'Minor').  basso = what Basso blurts out while the music plays.
   desc: the page description for search results and link previews (optional).
   rematch: the follow-up questions use real pieces (pieces.js) of the same kind.
   link: for a question type with no rematch page yet, /play points to this lesson instead (no /c/<n> page is made). */
window.CHALLENGES = [
  {
    n: 1,
    date: '2026-10-28',
    kind: 'meter23',
    q: '2 or 3 beats in a bar?',
    opts: ['2', '3'],
    ans: '3',
    audio: '/audio/challenge/c01.mp3',
    basso: '2',
    beat: { first: 0.05, len: 0.556, k: 3, n: 12 }, // where the beats fall in the clip, for the count-along
    count: 'Strong, light, light: ONE two three.',
    teaser: 'Can you hear it before Basso does?',
    desc: '2 or 3 beats in a bar? A 30-second listening game with Basso: find the strong beat, then count to the next one. Free ear training from Dottino.' // page description (search results, link previews)
  },
  {
    n: 2,
    date: '2026-10-30',
    kind: 'mode',
    q: 'Major or minor?',
    opts: ['Major', 'Minor'],
    ans: 'Minor',
    audio: '/audio/challenge/c02.mp3',
    basso: 'Major',
    explain: 'It opens on a bright chord, but it’s in <b>A minor</b>. Listen to where it ends.',
    teaser: 'Can you hear it before Basso does?',
    desc: 'Major or minor? A 30-second listening game with Basso that trains you to hear the difference, built around the ABRSM aural tests. Free from Dottino.'
  },
  {
    n: 3,
    date: '2026-11-02',
    kind: 'rhythm',
    q: 'Which rhythm: A, B or C?',
    ans: 'C',
    basso: 'A',
    explain: 'A ends long. B’s quick notes come late. Only C fits all the way.',
    teaser: 'Can you hear it before Basso does?',
    link: '/aural.html?w=3' // no rhythm rematch page yet: Week 3 has the "which rhythm" lesson (free, no sign-up)
  },
  {
    n: 4,
    date: '2026-11-04',
    kind: 'same',
    q: 'Same or different?',
    ans: 'Different',
    basso: 'Same',
    explain: 'Same start, but the last note went up. Keep the first tune in your head.',
    teaser: 'Can you hear it before Basso does?',
    link: '/aural.html?w=1' // no same/different rematch page yet: Week 1 (always free) has "spot the change" in stops 3 and 4
  },
  {
    n: 5,
    date: '2026-11-06',
    kind: 'dynamics',
    q: 'Loud, soft, or getting softer?',
    ans: 'Getting softer',
    basso: 'It stays loud',
    explain: 'It starts loud, then fades away. Follow the volume all the way through.',
    teaser: 'Can you hear it before Basso does?',
    link: '/aural.html?w=6' // no dynamics rematch page yet: Week 6 stop 1 is dynamics (free until selling starts)
  },
  {
    n: 6,
    date: '2026-11-09',
    kind: 'pickup',
    q: 'Where’s beat ONE?',
    ans: 'B',
    basso: 'A, the first note',
    explain: 'The first note was a pickup. Beat ONE comes in with the bass.',
    teaser: 'Can you hear it before Basso does?',
    link: '/ear-check/' // the ear check starts with a beats question and shows the same count tool
  }
];
