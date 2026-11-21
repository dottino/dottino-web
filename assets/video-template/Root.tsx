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
import {Short5} from './Short5';
import ep5 from './ep5.json';
import {Short6} from './Short6';
import ep6 from './ep6.json';
import {Short7} from './Short7';
import ep7 from './ep7.json';
import {Short8} from './Short8';
import ep8 from './ep8.json';
import {Short9} from './Short9';
import ep9 from './ep9.json';
import {Short10} from './Short10';
import ep10 from './ep10.json';
import {Short11} from './Short11';
import ep11 from './ep11.json';
import {Short12} from './Short12';
import ep12 from './ep12.json';
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
    <Composition id="Ep5" component={Short5} durationInFrames={ep5.durationInFrames} fps={ep5.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app'}} />
    <Composition id="Ep5TT" component={Short5} durationInFrames={ep5.durationInFrames} fps={ep5.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app/tt'}} />
    <Composition id="Ep5Cover" component={Short5} durationInFrames={ep5.durationInFrames} fps={ep5.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app', coverPose: 'ponder'}} />
    <Composition id="Ep6" component={Short6} durationInFrames={ep6.durationInFrames} fps={ep6.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app'}} />
    <Composition id="Ep6TT" component={Short6} durationInFrames={ep6.durationInFrames} fps={ep6.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app/tt'}} />
    <Composition id="Ep6Cover" component={Short6} durationInFrames={ep6.durationInFrames} fps={ep6.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app', coverPose: 'wonder'}} />
    <Composition id="Ep7" component={Short7} durationInFrames={ep7.durationInFrames} fps={ep7.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app'}} />
    <Composition id="Ep7TT" component={Short7} durationInFrames={ep7.durationInFrames} fps={ep7.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app/tt'}} />
    <Composition id="Ep7Cover" component={Short7} durationInFrames={ep7.durationInFrames} fps={ep7.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app', coverPose: 'hidePeek'}} />
    <Composition id="Ep8" component={Short8} durationInFrames={ep8.durationInFrames} fps={ep8.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app'}} />
    <Composition id="Ep8TT" component={Short8} durationInFrames={ep8.durationInFrames} fps={ep8.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app/tt'}} />
    <Composition id="Ep8Cover" component={Short8} durationInFrames={ep8.durationInFrames} fps={ep8.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app', coverPose: 'aha'}} />
    <Composition id="Ep9" component={Short9} durationInFrames={ep9.durationInFrames} fps={ep9.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app'}} />
    <Composition id="Ep9Cover" component={Short9} durationInFrames={ep9.durationInFrames} fps={ep9.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app', coverPose: 'aha'}} />
    <Composition id="Ep10" component={Short10} durationInFrames={ep10.durationInFrames} fps={ep10.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app'}} />
    <Composition id="Ep10Cover" component={Short10} durationInFrames={ep10.durationInFrames} fps={ep10.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app', coverPose: 'aha'}} />
    <Composition id="Ep11" component={Short11} durationInFrames={ep11.durationInFrames} fps={ep11.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app'}} />
    <Composition id="Ep11Cover" component={Short11} durationInFrames={ep11.durationInFrames} fps={ep11.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app', coverPose: 'compose'}} />
    <Composition id="Ep12" component={Short12} durationInFrames={ep12.durationInFrames} fps={ep12.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app'}} />
    <Composition id="Ep12Cover" component={Short12} durationInFrames={ep12.durationInFrames} fps={ep12.fps} width={1080} height={1920} defaultProps={{url: 'dottino.app', coverPose: 'shy'}} />
  </>
);
