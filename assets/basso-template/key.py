"""Key a Basso clip (cream background, 1080x1920 with the picture in the middle band) into RGBA frames.
Alpha = distance from the frame's own background colour (median of the border), so a background that shifts
during the clip still keys cleanly. Holes fully enclosed by Basso (eyes, arm outlines) are filled back in, so the
eyes stay solid when the clip is laid over another background.
usage: key.py in.mp4 outdir"""
import sys, os, subprocess, numpy as np
from scipy.ndimage import median_filter, binary_fill_holes, binary_dilation, label, find_objects
from PIL import Image
src, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
W, H = 1080, 1440
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-vf', 'crop=1080:1440:0:240,fps=30', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
i = 0
while True:
    buf = p.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    a = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    border = np.concatenate([a[:16].reshape(-1, 3), a[-16:].reshape(-1, 3), a[:, :16].reshape(-1, 3), a[:, -16:].reshape(-1, 3)])
    bg = np.median(border, 0)
    d = np.sqrt(((a - bg) ** 2).sum(2))
    # pale lavender sound waves are close to cream in brightness but bluer: count blueness extra so they stay opaque
    blue = (a[..., 2] - a[..., 0]) - (bg[2] - bg[0])
    d = np.maximum(d, 2.2 * np.clip(blue - 8, 0, None))
    al = np.clip((d - 16) / 24, 0, 1)
    al = median_filter(al, size=5)   # smooth the paper-texture speckle on pale strokes
    # drop specks: keep only connected shapes bigger than a few dozen pixels
    lab0, n0 = label(al > 0.08)
    if n0:
        sizes = np.bincount(lab0.ravel()); small = sizes < 150; small[0] = False
        al[small[lab0]] = 0
    solid = al > 0.5
    filled = binary_fill_holes(solid)
    lab, n = label(filled & ~solid)
    # only the eyes get filled: they come as a PAIR of similar holes side by side
    # (the curl's loop and the gap between a hand and the body are single holes and stay see-through)
    info = []
    for k, sl in enumerate(find_objects(lab), 1):
        ar = int((lab[sl] == k).sum())
        if ar < 600: continue
        info.append((k, ar, (sl[0].start + sl[0].stop) / 2, (sl[1].start + sl[1].stop) / 2))
    keep = set()
    for k1, a1, y1, x1 in info:
        for k2, a2, y2, x2 in info:
            if k1 < k2 and abs(a1 - a2) < 0.35 * max(a1, a2) and abs(y1 - y2) < 90 and 80 < abs(x1 - x2) < 360:
                keep.update([k1, k2])
    holes = np.isin(lab, list(keep)) if keep else np.zeros_like(solid)
    holes = binary_dilation(holes, iterations=2) & filled   # include the soft edge of each hole
    al[holes] = 1
    # pull the cream fringe out of semi-transparent edge pixels (un-premultiply against the background)
    edge = (al > 0.02) & (al < 0.98)
    rgb = a.copy()
    rgb[edge] = np.clip((a[edge] - bg * (1 - al[edge, None])) / al[edge, None], 0, 255)
    img = np.dstack([rgb, al * 255]).astype(np.uint8)
    Image.fromarray(img, 'RGBA').save(f'{out}/{i:04d}.png', compress_level=1)
    i += 1
print(src, i, 'frames')
