# Dottino 网站部署说明（dottino.app）

这个文件夹就是完整的网站，不需要服务器和数据库。

## 1. 上线（Netlify，免费）
1. 登录 netlify.com（之前 clefswitch 用的账号就可以）。
2. 「Add new site → Deploy manually」，把整个 dottino-web 文件夹拖进去。
3. 几十秒后会得到一个 xxx.netlify.app 的地址，先用它测试。

## 2. 绑定 dottino.app
1. 在域名商那里买下 dottino.app（建议以公司名义）。
2. Netlify 站点设置 → Domain management → Add domain → 输入 dottino.app，按提示改域名的 DNS。
3. .app 域名必须用 HTTPS，Netlify 会自动配好证书。

## 3. 预约表单（收集邮箱）
- 网站里已经放好了 Netlify Forms 的表单，部署后自动生效，不用写代码。
- 在 Netlify 站点的 Forms → waitlist 里能看到每一条预约：邮箱、给谁用（child / self / students）、语言、推荐码、当天成绩。
- 可以在 Forms → Notifications 设置「有新预约就发邮件给我」。

## 4. 推荐码
- 给老师的专属链接：https://dottino.app/?ref=老师代号（例如 ?ref=lily）。
- 网站会记住这个代号，家长之后预约时会一起记下来。

## 5. 访问统计（不写 cookie）
1. 在 Cloudflare 注册（免费）→ Web Analytics → Add a site → 输入 dottino.app。
2. 复制它给的一段 <script>，粘贴到 index.html 最后的注释位置，再重新部署。

## 6. 上线前要改的一处
- privacy.html 最后的 CONTACT_EMAIL 换成你的联系邮箱。

## 7. 创始会员登记（2026-10-27 新增）
- 首页新增「创始会员 · 考级通行证 £15 / 级别」区块（#founding），四级第 1 周页面底部也有同样的登记。现在不收钱，只登记邮箱和级别。
- Netlify 里会多出一个表单 **founding**：Forms → founding 能看到每条登记（邮箱、级别、语言、推荐码、来源）。
- terms.html 是条款与退款页（申请 Paddle 时要用），页脚和登记区都有链接。

## 8. 要看的两个数（GoatCounter → Events）
- `continue-after-wrong`：答错看完讲解后，点「下一题」继续的次数（对比 lesson-start-4 的次数）。
- `founding-g3/g4/g5`、`founding-g4-aural`：创始会员登记次数。
- 另外 `retry-right` / `retry-wrong`：答错后的“同类新题”答对 / 答错次数。

## 9. 谱兽动画（2026-10-27 从小程序搬过来）
- video/ 里新增 8 段：basso-peek（打招呼，播一次）、listen（听题）、happy / cheer（答对）、think（答错看讲解）、party（连对 5 个，播一次）、hugstar（完成一站）、party2（三颗星，播一次），每段配一张同名 jpg 首帧。
- 动画放在听力页圆形头像里播放，圆的底色和视频底色都是 #F4EFE6，浅色 / 深色模式都不会出现方块边。用到才加载；加载失败或用户设置了“减少动态效果”时，自动换回静态谱兽图。
- 注意：basso-happy.mp4 已经换成小程序那段新的“开心”动画（旧的 basso-happy.webm 不再使用）。

## 10. 四级第 2 周（2026-10-27）
- 地址：dottino.app/aural?w=2（第 1 周页面顶部有“第 2 周 →”链接，第 2 周页面有“← 第 1 周”）。两周的进度分开保存。
- 内容：找强拍（2 拍 / 3 拍，再加入 4 拍）、记住四个音的形状 + 弹回四个音、考试题型的 2/3/4 拍、第 2 周小测。答错拍子时显示每一拍的圆点图（强拍大圆点），可以“带着数拍再听一遍”。
- 目前第 2 周还是公开的；接上 Paddle 后再改成购买考级通行证才能进入。

## 11. 四级第 3 周（2026-10-27）
- 地址：dottino.app/aural?w=3（第 2 周页面顶部有“第 3 周 →”）。
- 内容：从主音找音（先听 C E G 和 C，再找一个音：先 C–G，再到高音 C）、哪种节奏（两小节节奏选图，2 拍再到 3 拍）、五个音的旋律弹回、第 3 周小测。
- 和第 2 周一样，目前公开；接上付款后再改成购买后进入。

## 12. 四级第 4 周 · A 题（2026-10-27）
- 地址：dottino.app/aural?w=4。各周页面顶部都有上一周 / 下一周的链接。
- 内容：大调还是小调（先听主和弦，再听短旋律）、按考试顺序弹回五个音（主和弦 → 第一个音 → 旋律弹两遍）、弹回六个音、第 4 周小测。
- 目前用 C 大调和 a 小调（自然小调，只用白键，因为网页键盘只能按白键）。以后加入黑键后，再加 G 大调、F 大调和和声小调。

## 13. 四级第 5 周 · D 题（2026-10-27）
- 地址：dottino.app/aural?w=5。
- 内容：跟着拍子拍（音乐响起时在大按钮上稳稳地拍，再说出 2/3/4 拍）、把节奏拍回来（听两小节，每个音拍一下）、附点节奏（先选图再拍回来）、第 5 周小测。
- 判断只看两次拍之间的间隔（拍得匀不匀、快慢和节奏比例），不看和音乐对得准不准，所以蓝牙耳机的延迟不会算错。拍成慢一倍（每两拍拍一下）也算稳定的拍子。

## 14. Paddle 付款（沙盒测试中，公众看不到）

- `pay.js`：前端付款。`CFG.SELLING = false` 时公众页面一切照旧（不锁、没有购买按钮）。
- 测试：任意页面地址后加 `?paytest=1`（同一标签页内一直有效）→ 第 2 周起显示锁定 + 购买框。沙盒测试卡 4242 4242 4242 4242，任意未来日期，CVC 100。
- 付款成功 → 调 `/.netlify/functions/paddle-verify` 在服务器端向 Paddle 核实交易 → 本机解锁 6 个月。沙盒下如果函数还没上线，会先在本机解锁以便测试。
- 「已经买过？恢复」→ `paddle-restore` 按邮箱查购买记录（简单版，以后可换成邮件验证链接）。
- 函数需要 Git 部署（拖拽上传不支持 Functions），所以要连 GitHub。
- Netlify 环境变量（Site configuration → Environment variables）：
  - `PADDLE_API_KEY` = 沙盒 API key（`pdl_sdbx_…`，只填在 Netlify，不要发到聊天里）
  - `PADDLE_ENV` = `sandbox`
  - `UNLOCK_SECRET` = 一串随机字符（30 位以上即可）
- 正式开卖时：Paddle 正式账号的 client token 和 price ID 换进 `pay.js`，`env:'live'`，`SELLING:true`；Netlify 里 `PADDLE_ENV=live`，API key 换正式的。

## 15. 第 6 周（C 题：描述音乐）
- 地址：`aural.html?w=6`（付费测试模式下属于训练包）。
- 每题是程序现场生成的 4 小节短曲（右手旋律 + 左手伴奏），可控制：大调/小调、2/3/4 拍、速度（慢/中/快、渐慢、渐快）、力度（渐强、渐弱、突强突弱）、连奏/断奏。
- 第 1 站：力度 + 奏法；第 2 站：速度变化 + 调性；第 3 站：音乐性格（情绪 + 理由，第二级加入"情绪对、理由错"的干扰项），每题后给出考试可用的英文回答句；第 4 站：考试式小测（含拍回节奏、几拍子）。
- 答错时可以"先听你选的版本，再听原来的"，同一段旋律只改那一个特点。
