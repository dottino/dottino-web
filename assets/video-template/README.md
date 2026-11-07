# Basso Challenge 视频模板 · 最新几期的源文件

完整的 Remotion 工程在 TIM 电脑上的 basso_video_template（README、package.json、素材、音效、第 1–2 期都在里面）。
这里只备份第 3 期起新增或改过的文件，方便在任何对话里接着做下一期：
- Short3.tsx + ep3.json + make_audio3.py：节奏 A/B/C（三张节奏卡、播放线、惊讶鼓起来）
- Short4.tsx + ep4.json + make_audio4.py：找不同（两行音符圆点、改变的音标橙色 ↑；Basso 用专心听 / 躲门后 / 发现了）
- Short5.tsx + ep5.json + ep5_env.json + make_audio5.py：力度（三个选项胶囊 f / p / 渐弱；揭晓后把音量画成形状，正好是渐弱记号）。Ep5Cover 用来出封面（换成本期时间线里没有的姿势）。
- Short6.tsx + ep6.json + make_audio6.py：弱起「Where's beat ONE?」（3/4 原创旋律，一拍弱起；题目阶段圆点一样大、跟着音亮；揭晓后变成数拍工具：弱起灰色小点、强拍橙色大点、小节线；重放带数拍点击声和「(3) | ONE two three | ONE」）。#6 起的模板改动：揭晓前 3 秒倒计时圆环 + Pause & comment；结尾 "Did you beat Basso? ✅ or ❌"。Ep6Cover 用 wonder 姿势，封面不显示底部字幕。
- Short7.tsx + ep7.json + make_audio7.py：旋律形状「Which shape is the tune?」（C D E G E C，4/4，120 bpm；三张横排形状卡 A 一直往上 / B 上去再回家（答案）/ C 只回到一半；题目阶段三张卡同一位置的点跟着音一起亮；重放时 B 卡的形状线一笔一笔画出来，底部 start up up up! down home 跟着亮）。Basso：揭晓害羞、重放哼歌、答对写音符。封面用 hidePeek 第 75 帧（配 "A! It just goes UP!"）。
- 注意：压缩包 basso_video_template.zip 里只有第 1–2 期；做新一期时把这里的 Short3–6、ep3–6、make_audio3–6、Root.tsx 复制进 src/ 和工程根目录，basso-template 的 WebM 复制进 public/basso/，再依次运行 make_audio3–6（会生成 sfx_correct.wav）。
- Root.tsx：注册 Ep3–Ep7（含 TT 版和封面）（TT = TikTok 版，结尾写 dottino.app/tt）
- 动画 WebM 在 ../basso-template/
