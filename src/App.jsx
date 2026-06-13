import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   DATA: QUESTIONS
   ═══════════════════════════════════════════ */
const QUESTIONS = [
  // ── 反骨指数 (rebellion) ──
  {
    id: 1, dim: "rebellion",
    text: "公司突然通知周六加班，你的第一反应？",
    opts: [
      { text: "好的收到 👌", score: 1 },
      { text: "群里回OK，心里骂了三遍", score: 2 },
      { text: "私下问同事「就咱们加还是全公司？」", score: 3 },
      { text: "直接@领导：有加班费吗", score: 4 },
    ],
  },
  {
    id: 2, dim: "rebellion",
    text: "家庭聚会亲戚开始催婚，你会？",
    opts: [
      { text: "笑笑说「在看在看」", score: 1 },
      { text: "疯狂转移话题：来来来吃菜！", score: 2 },
      { text: "反问「您家孩子不也没生二胎吗」", score: 3 },
      { text: "我的事不劳您操心，谢谢", score: 4 },
    ],
  },
  {
    id: 3, dim: "rebellion",
    text: "排队时有人插到你前面，你会？",
    opts: [
      { text: "算了，就一个人", score: 1 },
      { text: "用眼神表示不满，但不说话", score: 2 },
      { text: "大声说「不好意思，后面排队」", score: 3 },
      { text: "拍肩膀：「哥们儿，队尾在那边」", score: 4 },
    ],
  },
  // ── 行动力 (action) ──
  {
    id: 4, dim: "action",
    text: "看到一家新开的店很想去，你会？",
    opts: [
      { text: "收藏了，改天吧（这天永远不来）", score: 1 },
      { text: "发群里问有没有人一起，没人回", score: 2 },
      { text: "这周末就去", score: 3 },
      { text: "今天下班直奔过去", score: 4 },
    ],
  },
  {
    id: 5, dim: "action",
    text: "「想换工作」这个念头冒出来了，然后？",
    opts: [
      { text: "想了三个月了，还在想", score: 1 },
      { text: "偶尔打开Boss直聘刷两下，从不投", score: 2 },
      { text: "认真改简历，开始投了", score: 3 },
      { text: "你问的时候我已经在面了", score: 4 },
    ],
  },
  {
    id: 6, dim: "action",
    text: "想学一个新技能（比如做饭/画画），你一般？",
    opts: [
      { text: "想了半年了，收藏了200个教程", score: 1 },
      { text: "先买齐全套装备，然后吃灰", score: 2 },
      { text: "看两个视频就开始动手了", score: 3 },
      { text: "直接开干，不会的边做边查", score: 4 },
    ],
  },
  // ── 社交姿态 (social) ──
  {
    id: 7, dim: "social",
    text: "朋友聚会来了一桌不认识的人，你会？",
    opts: [
      { text: "找最角落的位置坐下，研究菜单", score: 1 },
      { text: "全程贴着认识的朋友不撒手", score: 2 },
      { text: "跟旁边的人搭两句话", score: 3 },
      { text: "不知怎么的就成了全桌话题中心", score: 4 },
    ],
  },
  {
    id: 8, dim: "social",
    text: "拍合影的时候，你通常站哪？",
    opts: [
      { text: "最边上，方便后期裁掉自己", score: 1 },
      { text: "第二排，被前面的人挡住最好", score: 2 },
      { text: "哪有空位站哪", score: 3 },
      { text: "你猜", score: 4 },
    ],
  },
  {
    id: 9, dim: "social",
    text: "KTV 唱歌，你通常？",
    opts: [
      { text: "全程玩手机 + 吃果盘", score: 1 },
      { text: "只跟熟人合唱", score: 2 },
      { text: "等气氛到了会来一首", score: 3 },
      { text: "麦霸，从开场唱到散场", score: 4 },
    ],
  },
  // ── 道德洁癖 (moral) ──
  {
    id: 10, dim: "moral",
    text: "收银员多找了你50块钱，你会？",
    opts: [
      { text: "到家才发现，那就是天意", score: 1 },
      { text: "发现了……犹豫了……走了", score: 2 },
      { text: "还回去了，但心里有点可惜", score: 3 },
      { text: "秒还，一秒都没犹豫", score: 4 },
    ],
  },
  {
    id: 11, dim: "moral",
    text: "朋友让你帮他跟女朋友撒个小谎，你会？",
    opts: [
      { text: "兄弟义气，帮了", score: 1 },
      { text: "帮了但说「下次别找我」", score: 2 },
      { text: "很不情愿但还是帮了", score: 3 },
      { text: "你自己的事别拖我下水", score: 4 },
    ],
  },
  {
    id: 12, dim: "moral",
    text: "答应了朋友的事，但临时有更好的安排，你会？",
    opts: [
      { text: "找个理由推了朋友的", score: 1 },
      { text: "纠结半天，还是去了更好的", score: 2 },
      { text: "纠结半天，还是守了承诺", score: 3 },
      { text: "答应了就是答应了，不用纠结", score: 4 },
    ],
  },
  // ── 欲望坦诚度 (honesty) ──
  {
    id: 13, dim: "honesty",
    text: "减肥期间朋友约你吃火锅，你会？",
    opts: [
      { text: "嘴上说「在控制饮食」——回家偷点了麻辣烫", score: 1 },
      { text: "去了，假装只吃菜，筷子夹了五片肥牛", score: 2 },
      { text: "去了，大方宣布「今天破例」", score: 3 },
      { text: "减什么减？走！", score: 4 },
    ],
  },
  {
    id: 14, dim: "honesty",
    text: "对一个人有好感，你通常？",
    opts: [
      { text: "打死不说，等下辈子", score: 1 },
      { text: "疯狂暗示，对方接不到也认了", score: 2 },
      { text: "找机会单独约出来试探一下", score: 3 },
      { text: "直说：我觉得你不错，出来吃个饭？", score: 4 },
    ],
  },
  {
    id: 15, dim: "honesty",
    text: "看到同事买了你很想要的东西，你会？",
    opts: [
      { text: "哦那个啊，还行吧（内心疯狂种草）", score: 1 },
      { text: "偷偷搜了价格但不吱声", score: 2 },
      { text: "挺好的，在哪买的多少钱？", score: 3 },
      { text: "卧槽你在哪买的我也要！", score: 4 },
    ],
  },
];

/* ═══════════════════════════════════════════
   DATA: CHARACTERS
   ═══════════════════════════════════════════ */
const CHARACTERS = [
  {
    name: "孙悟空",
    emoji: "🐵",
    title: "团队刺头 · 实力担当",
    rarity: "N",
    quote: "「我来！」",
    desc: "团队里能力最强的人，也是最不听话的。领导又爱又恨，同事又敬又怕。所有脏活累活你干了，所有锅你也背了。但说实话——少了你，这个团队连第一关都过不了。",
    profile: [5, 5, 5, 2, 4],
    tags: ["反骨", "行动派", "扛把子"],
    color: "#F59E0B",
  },
  {
    name: "猪八戒",
    emoji: "🐷",
    title: "躺平达人 · 真实之王",
    rarity: "N",
    quote: "「我就是馋，怎么了？」",
    desc: "嘴上说躺平，身体很诚实。所有欲望写在脸上，但你从不觉得这有什么不对。全组最真实的人——想吃就吃，想睡就睡，想说就说。在这个人均伪装的世界里，你是一股清流。",
    profile: [2, 1, 3, 1, 5],
    tags: ["真实", "躺平", "吃货"],
    color: "#EC4899",
  },
  {
    name: "沙僧",
    emoji: "⛓️",
    title: "沉默扛王 · 隐形劳模",
    rarity: "N",
    quote: "「大师兄，师傅又被抓走了」",
    desc: "年终总结最难写的人——活干了，功劳没你的。合影永远站最边上，聚餐永远最后一个被想起来。但少了你，这个团队第二天就散。你不争不抢，不是因为不在意，是因为你的价值不需要别人认可。",
    profile: [1, 3, 1, 4, 2],
    tags: ["打工人", "靠谱", "隐形"],
    color: "#6B7280",
  },
  {
    name: "唐僧",
    emoji: "📿",
    title: "精神领袖 · 嘴强王者",
    rarity: "N",
    quote: "「你们不要再打了！」",
    desc: "什么都不会但什么都敢说。开会最积极，执行最拉跨。但不知道为什么，大家还是愿意跟着你——可能是因为KPI挂在你名下，也可能是你真的有某种让人信服的东西。就是别念经了，求你了。",
    profile: [1, 1, 5, 5, 1],
    tags: ["话多", "理想主义", "团宠"],
    color: "#8B5CF6",
  },
  {
    name: "白龙马",
    emoji: "🐴",
    title: "终极工具人 · 沉默是金",
    rarity: "SR",
    quote: "「……」",
    desc: "比沙僧还惨——至少沙僧还有台词。你是那个默默承担最多、存在感最低的人。驮着整个团队走了十万八千里，有人记得你说过什么吗？但你不在意。你知道自己在做什么，这就够了。",
    profile: [1, 5, 1, 4, 1],
    tags: ["沉默", "负重前行", "极简"],
    color: "#E5E7EB",
  },
  {
    name: "观音菩萨",
    emoji: "🪷",
    title: "远程管理 · 幕后操盘",
    rarity: "SR",
    quote: "「一切尽在掌控之中」",
    desc: "从不亲自下场但什么都安排得明明白白。所有人都觉得自己是自由意志，其实都在你的棋盘上。出了事你兜底，没事的时候你隐身。管理的最高境界：让别人觉得一切都是自己的选择。",
    profile: [3, 4, 5, 4, 2],
    tags: ["操盘手", "洞察", "大局观"],
    color: "#14B8A6",
  },
  {
    name: "玉皇大帝",
    emoji: "👑",
    title: "名义老板 · 盖章机器",
    rarity: "R",
    quote: "「快去请如来佛祖！」",
    desc: "大老板。出事了才出现，平时只盖章。能力存疑但位置稳如泰山。你的核心竞争力不是能力，是坐在那个位置上。天庭上下都知道找你没用，但流程还是得走你这一关。",
    profile: [1, 1, 4, 3, 1],
    tags: ["甩手掌柜", "吉祥物", "流程"],
    color: "#FBBF24",
  },
  {
    name: "太上老君",
    emoji: "⚗️",
    title: "技术宅天花板 · 闷声发财",
    rarity: "SR",
    quote: "「我的丹呢？」",
    desc: "不社交、不站队、不争功。但你炼的丹全世界都在用。安静到大家忘了你的存在，直到系统崩了才想起来找你。你不在意名利，只在意手里的活做得够不够精。这个世界亏欠你一个热搜。",
    profile: [1, 5, 1, 2, 4],
    tags: ["技术宅", "匠人", "低调"],
    color: "#A78BFA",
  },
  {
    name: "牛魔王",
    emoji: "🐂",
    title: "体制外大佬 · 实力说话",
    rarity: "R",
    quote: "「我靠本事吃饭」",
    desc: "不靠编制靠实力，不靠人脉靠拳头。你的人生信条：有本事的人不需要名片。朋友圈广、路子野、出手阔，在哪儿都吃得开。唯一的弱点——家里那位比你还猛。",
    profile: [4, 4, 4, 2, 5],
    tags: ["野路子", "豪爽", "社牛"],
    color: "#DC2626",
  },
  {
    name: "铁扇公主",
    emoji: "🔥",
    title: "护犊之王 · 温柔暴击",
    rarity: "SR",
    quote: "「谁动我孩子我灭谁」",
    desc: "平时温柔大方，触碰底线瞬间变脸。你的芭蕉扇不常拿出来，但每次拿出来都是核弹级。在你的世界里，原则不是用来讨论的，是用来执行的。所有人都知道：惹谁都行，别惹你。",
    profile: [4, 5, 4, 5, 4],
    tags: ["护犊子", "狠角色", "有底线"],
    color: "#EF4444",
  },
  {
    name: "红孩儿",
    emoji: "👶",
    title: "二代战斗机 · 天才少年",
    rarity: "R",
    quote: "「你算老几？」",
    desc: "二代里最猛的——比你爹还狠，比你妈还拼。年纪最小脾气最大本事也最大。整个取经路上最不讲道理的存在。你的天赋让你有资格嚣张，但迟早有人教你做人。",
    profile: [5, 5, 3, 1, 5],
    tags: ["天才", "嚣张", "二代"],
    color: "#F97316",
  },
  {
    name: "白骨精",
    emoji: "💀",
    title: "全场演技王 · 规则黑客",
    rarity: "SSR",
    quote: "「你确定你认识真正的我吗？」",
    desc: "三次变装换脸不眨眼。你不是坏，你只是比所有人都清楚规则是什么以及怎么绕过它。在别人还在纠结对错的时候，你已经换了第三套方案。全场最聪明，也最孤独。",
    profile: [4, 5, 5, 1, 1],
    tags: ["演技派", "高智商", "变色龙"],
    color: "#6366F1",
  },
  {
    name: "哪吒",
    emoji: "🔱",
    title: "热血判官 · 正义极端",
    rarity: "SR",
    quote: "「是非对错，一刀切」",
    desc: "正义感爆棚但方法极端。你的世界观很简单：对的就是对的，错的就是错的。灰色地带？不存在的。你的勇气让人佩服，你的固执让人头疼。但这个世界需要像你这样的人——至少有人还在坚持什么。",
    profile: [5, 5, 4, 5, 5],
    tags: ["正义", "极端", "热血"],
    color: "#EF4444",
  },
  {
    name: "二郎神",
    emoji: "🐕",
    title: "闷声干大事 · 体制内卷王",
    rarity: "R",
    quote: "「……（已完成）」",
    desc: "能力不输悟空但选择了体制内。闷声干大事，从不邀功。所有人都知道你厉害，但没人说得出你具体干了啥——因为你从不需要别人知道。你的安全感来自实力，不来自掌声。",
    profile: [3, 5, 3, 4, 2],
    tags: ["闷骚", "实力派", "低调"],
    color: "#2563EB",
  },
  {
    name: "土地公",
    emoji: "🧓",
    title: "基层情报王 · 八卦终端机",
    rarity: "SSR",
    quote: "「这件事嘛……说来话长」",
    desc: "什么八卦都知道，什么立场都不站。你的生存智慧：知道一切，参与零。消息灵通但绝不惹事的老油条。所有人找你打听消息，没有人请你做决定。你活得最久，因为你最懂分寸。",
    profile: [1, 2, 2, 2, 4],
    tags: ["八卦", "老油条", "情报"],
    color: "#92400E",
  },
];

const RARITY_CONFIG = {
  SSR: { label: "SSR · 超稀有", bg: "linear-gradient(135deg, #F59E0B, #EF4444)", glow: "#F59E0B" },
  SR:  { label: "SR · 稀有",   bg: "linear-gradient(135deg, #8B5CF6, #6366F1)", glow: "#8B5CF6" },
  R:   { label: "R · 较少",    bg: "linear-gradient(135deg, #3B82F6, #2563EB)", glow: "#3B82F6" },
  N:   { label: "N · 常见",    bg: "linear-gradient(135deg, #6B7280, #4B5563)", glow: "#6B7280" },
};

const DIM_LABELS = {
  rebellion: "反骨指数",
  action: "行动力",
  social: "社交姿态",
  moral: "道德洁癖",
  honesty: "欲望坦诚度",
};

/* ═══════════════════════════════════════════
   UTILS
   ═══════════════════════════════════════════ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function matchCharacter(scores) {
  const dims = ["rebellion", "action", "social", "moral", "honesty"];
  const norm = dims.map((d) => ((scores[d] - 3) / 9) * 4 + 1);
  let best = null;
  let bestDist = Infinity;
  for (const ch of CHARACTERS) {
    let dist = 0;
    for (let i = 0; i < 5; i++) dist += (norm[i] - ch.profile[i]) ** 2;
    dist = Math.sqrt(dist);
    if (dist < bestDist) { bestDist = dist; best = ch; }
  }
  return best;
}

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function IntroScreen({ onStart }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "#4899a3",
      padding: "2rem 1.5rem", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 30, left: 20, fontSize: 60, opacity: 0.06 }}>☁️</div>
      <div style={{ position: "absolute", top: 80, right: 30, fontSize: 40, opacity: 0.05 }}>☁️</div>
      <div style={{ position: "absolute", bottom: 100, left: 40, fontSize: 50, opacity: 0.04 }}>☁️</div>

      <div style={{ fontSize: 64, marginBottom: 16, filter: "drop-shadow(0 0 20px rgba(245,158,11,0.3))" }}>
        🐵🐷⛓️📿🐴
      </div>

      <h1 style={{
        fontSize: "clamp(2rem, 8vw, 3.2rem)", fontWeight: 900,
        color: "#fff",
        lineHeight: 1.2, marginBottom: 8, letterSpacing: "0.05em",
      }}>
        西游人格测试
      </h1>

      <p style={{ color: "#e3f2f3", fontSize: "1.1rem", marginBottom: 8, letterSpacing: "0.15em" }}>
        X I Y O U · B T I
      </p>

      <p style={{
        color: "#e3f2f3", fontSize: "1rem", marginBottom: 48,
        maxWidth: 320, lineHeight: 1.6,
      }}>
        15道题，测测你是取经路上的谁<br />
        是大闹天宫的刺头，还是默默扛行李的打工人？
      </p>

      <button
        onClick={onStart}
        style={{
          background: "#9474a4",
          color: "#fff", border: "none", borderRadius: 50,
          padding: "16px 48px", fontSize: "1.1rem", fontWeight: 700,
          cursor: "pointer", letterSpacing: "0.1em",
          boxShadow: "0 10px 24px rgba(89,58,104,0.28)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => { e.target.style.transform = "scale(1.05)"; }}
        onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
      >
        开始测试
      </button>

      <p style={{ color: "rgba(0,0,0,0.5)", fontSize: "0.75rem", marginTop: 48 }}>
        共 15 题 · 约 2 分钟
      </p>
    </div>
  );
}

function QuestionScreen({ questions, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState({ rebellion: 0, action: 0, social: 0, moral: 0, honesty: 0 });
  const [fade, setFade] = useState(true);
  const [selected, setSelected] = useState(null);

  const q = questions[idx];
  const progress = ((idx) / questions.length) * 100;

  const handlePick = (opt, oi) => {
    if (selected !== null) return;
    setSelected(oi);
    const next = { ...scores, [q.dim]: scores[q.dim] + opt.score };

    setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setScores(next);
        setSelected(null);
        if (idx + 1 < questions.length) {
          setIdx(idx + 1);
          setFade(true);
        } else {
          onFinish(next);
        }
      }, 250);
    }, 350);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f8f9 0%, #ffffff 100%)",
      display: "flex", flexDirection: "column", padding: "0",
    }}>
      <div style={{ height: 3, background: "#e0e0e0", width: "100%" }}>
        <div style={{
          height: "100%", background: "linear-gradient(90deg, #F59E0B, #EF4444)",
          width: `${progress}%`, transition: "width 0.4s ease",
          boxShadow: "0 0 10px rgba(245,158,11,0.5)",
        }} />
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem 1.5rem", maxWidth: 480, margin: "0 auto", width: "100%",
      }}>
        <div style={{ color: "#6c7780", fontSize: "0.85rem", marginBottom: 24, letterSpacing: "0.1em" }}>
          <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: "1.1rem" }}>{idx + 1}</span>
          <span> / {questions.length}</span>
        </div>

        <div style={{
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.25s, transform 0.25s",
          width: "100%",
        }}>
          <p style={{
            color: "#2f3a45", fontSize: "clamp(1.05rem, 4.5vw, 1.25rem)", fontWeight: 600,
            textAlign: "center", lineHeight: 1.6, marginBottom: 32, minHeight: "3.2em",
          }}>
            {q.text}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            {q.opts.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => handlePick(opt, oi)}
                style={{
                  background: selected === oi
                    ? "linear-gradient(135deg, #DC2626, #B91C1C)"
                    : "rgba(0,0,0,0.03)",
                  border: selected === oi ? "1px solid #EF4444" : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 12, padding: "14px 18px",
                  color: selected === oi ? "#fff" : "#555555",
                  fontSize: "0.95rem", textAlign: "left", cursor: "pointer",
                  transition: "all 0.2s",
                  transform: selected === oi ? "scale(1.02)" : "scale(1)",
                  boxShadow: selected === oi ? "0 0 20px rgba(220,38,38,0.3)" : "none",
                  lineHeight: 1.5,
                }}
              >
                <span style={{
                  display: "inline-block", width: 22, height: 22, lineHeight: "22px",
                  textAlign: "center", borderRadius: "50%", marginRight: 10,
                  background: selected === oi ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.06)",
                  fontSize: "0.75rem", color: selected === oi ? "#fff" : "#6c7780",
                  fontWeight: 700, verticalAlign: "middle",
                }}>
                  {"ABCD"[oi]}
                </span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ character, scores, onRestart }) {
  const [revealed, setRevealed] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  const dims = ["rebellion", "action", "social", "moral", "honesty"];
  const rc = RARITY_CONFIG[character.rarity];

  const generateCard = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const W = 750, H = 1000;
    c.width = W; c.height = H;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#f7f8f9");
    bg.addColorStop(0.5, "#ffffff");
    bg.addColorStop(1, "#f7f8f9");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(72,153,163,0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    ctx.strokeStyle = "rgba(245,158,11,0.3)";
    ctx.lineWidth = 2;
    const cl = 40;
    [[40,40,1,1],[W-40,40,-1,1],[40,H-40,1,-1],[W-40,H-40,-1,-1]].forEach(([x,y,dx,dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + dy*cl); ctx.lineTo(x, y); ctx.lineTo(x + dx*cl, y);
      ctx.stroke();
    });

    ctx.fillStyle = "#999999";
    ctx.font = "500 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("你的西游人格是", W / 2, 100);

    ctx.font = "120px system-ui, sans-serif";
    ctx.fillText(character.emoji, W / 2, 260);

    const badgeW = 160, badgeH = 32, badgeX = W/2 - badgeW/2, badgeY = 290;
    const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY);
    if (character.rarity === "SSR") { badgeGrad.addColorStop(0, "#F59E0B"); badgeGrad.addColorStop(1, "#EF4444"); }
    else if (character.rarity === "SR") { badgeGrad.addColorStop(0, "#8B5CF6"); badgeGrad.addColorStop(1, "#6366F1"); }
    else if (character.rarity === "R") { badgeGrad.addColorStop(0, "#3B82F6"); badgeGrad.addColorStop(1, "#2563EB"); }
    else { badgeGrad.addColorStop(0, "#6B7280"); badgeGrad.addColorStop(1, "#4B5563"); }
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.fillText(rc.label, W / 2, badgeY + 22);

    ctx.fillStyle = "#2f3a45";
    ctx.font = "bold 48px system-ui, sans-serif";
    ctx.fillText(character.name, W / 2, 380);

    ctx.fillStyle = "#6c7780";
    ctx.font = "500 20px system-ui, sans-serif";
    ctx.fillText(character.title, W / 2, 415);

    ctx.fillStyle = "#F59E0B";
    ctx.font = "italic 22px system-ui, sans-serif";
    ctx.fillText(character.quote, W / 2, 475);

    ctx.strokeStyle = "rgba(72,153,163,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 510); ctx.lineTo(W - 100, 510);
    ctx.stroke();

    ctx.fillStyle = "#c0a080";
    ctx.font = "400 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    const words = character.desc;
    const lineW = 580;
    let line = "";
    let ly = 555;
    for (const ch of words) {
      const test = line + ch;
      if (ctx.measureText(test).width > lineW) {
        ctx.fillText(line, W / 2, ly);
        line = ch;
        ly += 30;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, W / 2, ly);

    const barY0 = 720, barH = 16, barMaxW = 300, barGap = 42;
    const dimKeys = ["rebellion","action","social","moral","honesty"];
    const dimNames = ["反骨指数","行动力","社交姿态","道德洁癖","欲望坦诚"];
    dimKeys.forEach((d, i) => {
      const y = barY0 + i * barGap;
      ctx.fillStyle = "#999999";
      ctx.font = "500 15px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(dimNames[i], 200, y + 12);
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.beginPath();
      ctx.roundRect(220, y, barMaxW, barH, 8);
      ctx.fill();
      const pct = Math.max(0.05, (scores[d] - 3) / 9);
      const grad = ctx.createLinearGradient(220, y, 220 + barMaxW, y);
      grad.addColorStop(0, "#F59E0B");
      grad.addColorStop(1, "#EF4444");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(220, y, barMaxW * pct, barH, 8);
      ctx.fill();
    });

    ctx.textAlign = "center";
    const tagY = barY0 + 5 * barGap + 10;
    ctx.font = "400 15px system-ui, sans-serif";
    ctx.fillStyle = "#999999";
    ctx.fillText(character.tags.map(t => "#" + t).join("  "), W/2, tagY);

    ctx.fillStyle = "#bbbbbb";
    ctx.font = "400 16px system-ui, sans-serif";
    ctx.fillText("西游人格测试 · XIYOU BTI", W / 2, H - 50);

    setShowCard(true);
  }, [character, scores, rc]);

  const downloadCard = () => {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement("a");
    link.download = "xiyou-bti-" + character.name + ".png";
    link.href = c.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f8f9 0%, #ffffff 50%, #f7f8f9 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "2rem 1.5rem", overflow: "auto",
    }}>
      <div style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "scale(1)" : "scale(0.9)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        maxWidth: 420, width: "100%", textAlign: "center",
      }}>
        <p style={{ color: "#999999", fontSize: "0.85rem", letterSpacing: "0.15em", marginBottom: 16 }}>
          你的西游人格是
        </p>

        <div style={{
          fontSize: 80, marginBottom: 12,
          filter: "drop-shadow(0 0 30px " + rc.glow + "40)",
        }}>
          {character.emoji}
        </div>

        <div style={{
          display: "inline-block", padding: "5px 20px", borderRadius: 50,
          background: rc.bg, color: "#fff", fontSize: "0.75rem",
          fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12,
          boxShadow: "0 0 20px " + rc.glow + "30",
        }}>
          {rc.label}
        </div>

        <h2 style={{
          color: "#2f3a45", fontSize: "2rem", fontWeight: 800,
          marginBottom: 4, letterSpacing: "0.05em",
        }}>
          {character.name}
        </h2>
        <p style={{ color: "#6c7780", fontSize: "0.9rem", marginBottom: 16 }}>
          {character.title}
        </p>

        <p style={{
          color: "#F59E0B", fontSize: "1.05rem", fontStyle: "italic", marginBottom: 24,
        }}>
          {character.quote}
        </p>

        <div style={{
          background: "rgba(0,0,0,0.03)",
          border: "1px solid rgba(72,153,163,0.1)",
          borderRadius: 16, padding: "20px 20px", marginBottom: 24, textAlign: "left",
        }}>
          <p style={{ color: "#c0a080", fontSize: "0.95rem", lineHeight: 1.8 }}>
            {character.desc}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
          {character.tags.map((t) => (
            <span key={t} style={{
              padding: "4px 14px", borderRadius: 20,
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(72,153,163,0.15)",
              color: "#555555", fontSize: "0.8rem",
            }}>
              #{t}
            </span>
          ))}
        </div>

        <div style={{
          background: "rgba(0,0,0,0.02)",
          border: "1px solid rgba(0,0,0,0.05)",
          borderRadius: 16, padding: "20px 20px", marginBottom: 28,
        }}>
          <p style={{ color: "#999999", fontSize: "0.75rem", marginBottom: 16, letterSpacing: "0.1em" }}>
            维度分析
          </p>
          {dims.map((d) => {
            const pct = Math.round(((scores[d] - 3) / 9) * 100);
            return (
              <div key={d} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#6c7780", fontSize: "0.8rem" }}>{DIM_LABELS[d]}</span>
                  <span style={{ color: "#555555", fontSize: "0.8rem", fontWeight: 600 }}>{Math.max(0, pct)}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(0,0,0,0.05)" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    background: "linear-gradient(90deg, #F59E0B, #EF4444)",
                    width: Math.max(5, pct) + "%", transition: "width 0.8s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <button
            onClick={generateCard}
            style={{
              background: "linear-gradient(135deg, #DC2626, #B91C1C)",
              color: "#fff", border: "none", borderRadius: 50,
              padding: "12px 28px", fontSize: "0.9rem", fontWeight: 600,
              cursor: "pointer", boxShadow: "0 0 20px rgba(220,38,38,0.3)",
            }}
          >
            🎴 生成分享卡
          </button>
          <button
            onClick={onRestart}
            style={{
              background: "transparent",
              color: "#6c7780", border: "1px solid rgba(72,153,163,0.15)",
              borderRadius: 50, padding: "12px 28px", fontSize: "0.9rem", cursor: "pointer",
            }}
          >
            🔄 重新测试
          </button>
        </div>

        <canvas ref={canvasRef} style={{
          display: showCard ? "block" : "none",
          width: "100%", maxWidth: 375, margin: "0 auto 12px", borderRadius: 12,
        }} />
        {showCard && (
          <button
            onClick={downloadCard}
            style={{
              background: "rgba(72,153,163,0.1)",
              color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 50, padding: "10px 24px", fontSize: "0.85rem",
              cursor: "pointer", marginBottom: 12,
            }}
          >
            📥 保存图片
          </button>
        )}

        <p style={{ color: "#bbbbbb", fontSize: "0.7rem", marginTop: 16 }}>
          西游人格测试 · XIYOU BTI
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [phase, setPhase] = useState("intro");
  const [shuffled, setShuffled] = useState([]);
  const [result, setResult] = useState(null);
  const [finalScores, setFinalScores] = useState(null);

  const startQuiz = () => {
    setShuffled(shuffle(QUESTIONS));
    setPhase("quiz");
  };

  const handleFinish = (scores) => {
    const ch = matchCharacter(scores);
    setResult(ch);
    setFinalScores(scores);
    setPhase("result");
  };

  const restart = () => {
    setResult(null);
    setFinalScores(null);
    setPhase("intro");
  };

  if (phase === "intro") return <IntroScreen onStart={startQuiz} />;
  if (phase === "quiz") return <QuestionScreen questions={shuffled} onFinish={handleFinish} />;
  if (phase === "result") return <ResultScreen character={result} scores={finalScores} onRestart={restart} />;
}