/* Basso Challenges: one entry per social video. Newest last.
   To add one: put the music clip in audio/challenge/, add an entry here, run `node tools/make_challenges.js`, push.
   kind 'meter23': "2 or 3 beats in a bar?" (answer '2' or '3'); kind 'mode': "Major or minor?" (answer 'Major' or 'Minor').  basso = what Basso blurts out while the music plays.
   rematch: the follow-up questions use real pieces (pieces.js) of the same kind. */
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
    teaser: 'Can you hear it before Basso does?'
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
    teaser: 'Can you hear it before Basso does?'
  }
];
