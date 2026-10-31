# Basso 动画 · 视频模板版（透明 WebM）

给 Basso Challenge 的 Remotion 视频模板用（放进模板的 public/basso/）。剪映用的 ProRes 透明版在 TIM 手里；网站和小程序用的小尺寸版在 ../../video/。

- 每段 720×960、30 fps、VP9 带透明。
- assets.json：每段的说明，以及模板 Short 组件 A 表需要的尺寸参数（d = 第一帧身体直径，cx/cy = 身体圆心，单位是素材像素）。
- key.py：抠图脚本。原片是 1080×1920，画面在中间 1080×1440 的区域；按每帧自己的底色抠，眼睛（成对的洞）补实，卷尾的圈和手与身体之间的缝保持透明。
  用法：python3 key.py 原片.mp4 输出文件夹 → 得到 RGBA PNG 序列，再用 ffmpeg 转 WebM / ProRes / 网站版。
