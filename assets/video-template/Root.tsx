import React from 'react';
import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {Episode} from './Episode';
import {Cover} from './Cover';
import {Short2} from './Short2';
import ep2 from './ep2.json';
import ep3 from './ep3.json';
import {Short3} from './Short3';
import {Short4} from './Short4';
import ep4 from './ep4.json';
import ep from './ep1.json';

const handle = delayRender('fonts');
Promise.all([700, 800, 900].map((w) => {
  const f = new FontFace('Nunito', `url(${staticFile(`fonts/nunito-latin-${w}-normal.woff2`)}) format('woff2')`, {weight: String(w)});
  document.fonts.add(f);
  return f.load();
})).then(() => continueRender(handle));

export const Root: React.FC = () => (
  <>
    <Composition id="Ep1" component={Episode} durationInFrames={ep.durationInFrames} fps={ep.fps} width={1080} height={1920} />
    <Composition id="Cover1" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{grid: false}} />
    <Composition id="Ep2" component={Short2} durationInFrames={ep2.durationInFrames} fps={ep2.fps} width={1080} height={1920} />
    <Composition id="Ep3" component={Short3} durationInFrames={ep3.durationInFrames} fps={ep3.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app'}} />
    <Composition id="Ep3TT" component={Short3} durationInFrames={ep3.durationInFrames} fps={ep3.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app/tt'}} />
    <Composition id="Ep4" component={Short4} durationInFrames={ep4.durationInFrames} fps={ep4.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app'}} />
    <Composition id="Ep4TT" component={Short4} durationInFrames={ep4.durationInFrames} fps={ep4.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app/tt'}} />
  </>
);
