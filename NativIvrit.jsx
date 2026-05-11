import { useState, useEffect, useRef, useCallback, memo } from "react";

// ── PALETTE ───────────────────────────────────────────────────────────────────
const C = {
  blue:"#1E3A8A", blueMid:"#1D4ED8", blueLt:"#EEF2FF",
  orange:"#B45309", orangeMid:"#D97706", orangeLt:"#FEF3C7",
  navy:"#111827", white:"#FFFFFF", bg:"#F8FAFC",
  border:"#E2E8F0", gray:"#64748B", grayLt:"#F1F5F9",
  red:"#DC2626", redLt:"#FEF2F2", gold:"#D97706",
  purple:"#7C3AED", purpleLt:"rgba(139,92,246,.15)",
  green:"#059669", greenLt:"#F0FDF4",
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const WORDS = [
  { heb:"שָׁלוֹם",      tr:"Shalom",    pt:"Olá / Paz",   emoji:"👋" },
  { heb:"תּוֹדָה",       tr:"Todá",      pt:"Obrigado/a",  emoji:"🙏" },
  { heb:"בֹּקֶר טוֹב",  tr:"Boker Tov", pt:"Bom dia",     emoji:"☀️" },
  { heb:"לַיְלָה טוֹב", tr:"Laila Tov", pt:"Boa noite",   emoji:"🌙" },
  { heb:"בְּבַקָּשָׁה", tr:"Bevakashá", pt:"Por favor",   emoji:"🤲" },
  { heb:"סְלִיחָה",      tr:"Slikhá",    pt:"Com licença", emoji:"😅" },
  { heb:"כֵּן",           tr:"Ken",       pt:"Sim",         emoji:"✅" },
  { heb:"לֹא",            tr:"Lo",        pt:"Não",         emoji:"❌" },
  { heb:"מַיִם",         tr:"Máyim",     pt:"Água",        emoji:"💧" },
  { heb:"לֶחֶם",         tr:"Léchem",    pt:"Pão",         emoji:"🍞" },
  { heb:"בַּיִת",        tr:"Báyit",     pt:"Casa",        emoji:"🏠" },
  { heb:"מִשְׁפָּחָה",  tr:"Mishpahá",  pt:"Família",     emoji:"👨‍👩‍👧" },
  { heb:"אֲנִי אוֹהֵב", tr:"Ani ohev",  pt:"Eu amo",      emoji:"❤️" },
  { heb:"מַה שְׁלוֹמְךָ",tr:"Ma Shlomkhá",pt:"Como vai?", emoji:"🤝" },
  { heb:"שַׁבָּת שָׁלוֹם",tr:"Shabbat Shalom",pt:"Bom Shabat",emoji:"✡️" },
  { heb:"לְהִתְרָאוֹת", tr:"Lehitraot",  pt:"Até logo",    emoji:"👋" },
];

const FOOTBALL = [
  { heb:"שַׁעַר",       tr:"Sha'ar",    pt:"Gol",      emoji:"⚽" },
  { heb:"כַּדּוּר",     tr:"Kadúr",     pt:"Bola",     emoji:"🟡" },
  { heb:"שָׂחְקָן",     tr:"Sakhkán",   pt:"Jogador",  emoji:"🧑" },
  { heb:"אִצְטַדְיוֹן", tr:"Ítztadyon", pt:"Estádio",  emoji:"🏟️" },
  { heb:"מְאַמֵּן",     tr:"Me'amén",   pt:"Treinador",emoji:"📋" },
  { heb:"נִצָּחוֹן",    tr:"Nitsakhón", pt:"Vitória",  emoji:"🏆" },
];

const LISTEN_CHALLENGES = [
  { heb:"שָׁלוֹם",           tr:"Shalom",        pt:"Olá / Paz",   emoji:"👋", hint:"Uma saudação universal" },
  { heb:"תּוֹדָה",            tr:"Todá",           pt:"Obrigado/a",  emoji:"🙏", hint:"Expressa gratidão" },
  { heb:"בֹּקֶר טוֹב",       tr:"Boker Tov",      pt:"Bom dia",     emoji:"☀️", hint:"Saudação matinal" },
  { heb:"לַיְלָה טוֹב",      tr:"Laila Tov",      pt:"Boa noite",   emoji:"🌙", hint:"Saudação noturna" },
  { heb:"בְּבַקָּשָׁה",      tr:"Bevakashá",      pt:"Por favor",   emoji:"🤲", hint:"Pedido educado" },
  { heb:"כֵּן",                tr:"Ken",            pt:"Sim",         emoji:"✅", hint:"Afirmação" },
  { heb:"לֹא",                 tr:"Lo",             pt:"Não",         emoji:"❌", hint:"Negação" },
  { heb:"מַיִם",              tr:"Máyim",          pt:"Água",        emoji:"💧", hint:"Bebida essencial" },
  { heb:"לֶחֶם",              tr:"Léchem",         pt:"Pão",         emoji:"🍞", hint:"Alimento básico" },
  { heb:"בַּיִת",             tr:"Báyit",          pt:"Casa",        emoji:"🏠", hint:"Onde moramos" },
  { heb:"שַׁבָּת שָׁלוֹם",   tr:"Shabbat Shalom", pt:"Bom Shabat",  emoji:"✡️", hint:"Saudação judaica do fim de semana" },
  { heb:"לְהִתְרָאוֹת",      tr:"Lehitraot",      pt:"Até logo",    emoji:"👋", hint:"Despedida" },
];

const PENALTY_QUESTIONS = [
  { heb:"שָׁלוֹם",      tr:"Shalom",    opts:["Olá / Paz","Obrigado","Por favor","Boa noite"],    answer:"Olá / Paz"  },
  { heb:"תּוֹדָה",       tr:"Todá",      opts:["Com licença","Obrigado/a","Sim","Não"],            answer:"Obrigado/a" },
  { heb:"כֵּן",           tr:"Ken",       opts:["Não","Talvez","Sim","Por favor"],                  answer:"Sim"        },
  { heb:"לֹא",            tr:"Lo",        opts:["Sim","Não","Água","Casa"],                         answer:"Não"        },
  { heb:"מַיִם",         tr:"Máim",      opts:["Pão","Família","Água","Casa"],                     answer:"Água"       },
  { heb:"לֶחֶם",         tr:"Léhem",     opts:["Água","Pão","Leite","Sal"],                        answer:"Pão"        },
  { heb:"בַּיִת",        tr:"Báit",      opts:["Escola","Casa","Rua","Cidade"],                    answer:"Casa"       },
  { heb:"שַׁעַר",        tr:"Sha'ar",    opts:["Bola","Jogador","Gol","Estádio"],                  answer:"Gol"        },
  { heb:"כַּדּוּר",      tr:"Kadúr",     opts:["Gol","Bola","Time","Árbitro"],                     answer:"Bola"       },
  { heb:"נִצָּחוֹן",     tr:"Nitsakhón", opts:["Derrota","Empate","Vitória","Gol"],                answer:"Vitória"    },
  { heb:"בֹּקֶר טוֹב",  tr:"Boker Tov", opts:["Boa noite","Bom dia","Boa tarde","Olá"],           answer:"Bom dia"    },
  { heb:"לַיְלָה טוֹב", tr:"Laila Tov", opts:["Bom dia","Boa tarde","Boa noite","Tchau"],         answer:"Boa noite"  },
];

const LEVELS = [
  { id:1, title:"Alef", sub:"Fundamentos", icon:"📖", locked:false,
    lessons:[{ id:"1-1",title:"Cumprimentos",icon:"👋",xp:10 },{ id:"1-2",title:"Afirmações",icon:"✅",xp:10 },{ id:"1-3",title:"Expressões",icon:"🙏",xp:15 }]},
  { id:2, title:"Bet",   sub:"Vocabulário", icon:"🏠", locked:true,
    lessons:[{ id:"2-1",title:"Família",icon:"👨‍👩‍👧",xp:15 },{ id:"2-2",title:"Alimentos",icon:"🍞",xp:15 },{ id:"2-3",title:"Cores",icon:"🎨",xp:20 }]},
  { id:3, title:"Gimel", sub:"Diálogos",     icon:"💬", locked:true,
    lessons:[{ id:"3-1",title:"Perguntas",icon:"❓",xp:20 },{ id:"3-2",title:"Números",icon:"🔢",xp:20 },{ id:"3-3",title:"Dias",icon:"📅",xp:25 }]},
  { id:4, title:"Dalet", sub:"Intermediário",icon:"📚", locked:true,
    lessons:[{ id:"4-1",title:"Verbos",icon:"🔤",xp:30 },{ id:"4-2",title:"Esportes",icon:"⚽",xp:30 },{ id:"4-3",title:"Cultura",icon:"🇮🇱",xp:35 }]},
];

const CHAT_SEED = [
  { id:1, user:"Yael",   avatar:"👩", msg:"Shalom! Alguém quer praticar?",           time:"09:12", mine:false },
  { id:2, user:"Carlos", avatar:"👨", msg:"Shalom! Nível Bet. Posso tentar.",        time:"09:14", mine:false },
  { id:3, user:"Ana",    avatar:"👩", msg:"תּוֹדָה pela explicação de ontem.",        time:"09:20", mine:false },
  { id:4, user:"Yael",   avatar:"👩", msg:"בְּבַקָּשָׁה. Vamos continuar.",          time:"09:22", mine:false },
];

const GW2 = 400; const GH2 = 220; const TOTAL_KICKS = 5;
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
function buildFQOpts(idx) {
  const c = FOOTBALL[idx];
  return shuffle([c, ...shuffle(FOOTBALL.filter((_,i)=>i!==idx)).slice(0,3)]);
}

// ── TTS ENGINE ────────────────────────────────────────────────────────────────
function speakHebrew(text, onEnd) {
  if (!window.speechSynthesis) { if (onEnd) onEnd(); return; }
  window.speechSynthesis.cancel();
  function doSpeak() {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang  = "he-IL";
    utter.rate  = 0.75;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const hebVoice = voices.find(v => v.lang === "he-IL" || v.lang === "he" || v.lang === "iw");
    if (hebVoice) utter.voice = hebVoice;
    utter.onend   = () => { if (onEnd) onEnd(); };
    utter.onerror = (e) => { console.warn("TTS error:", e.error); if (onEnd) onEnd(); };
    window.speechSynthesis.speak(utter);
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) { doSpeak(); }
  else {
    const handler = () => { window.speechSynthesis.removeEventListener("voiceschanged", handler); doSpeak(); };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    setTimeout(doSpeak, 800);
  }
}

function preloadVoices() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
}

// ── AUDIO BUTTON — movido para fora do componente pai (fix de performance) ───
// ANTES: era definido dentro de NativIvrit() → recriado a cada render,
//        quebrando a identidade do componente e causando remontagem desnecessária.
// AGORA: componente puro de nível superior.
const AudioBtn = memo(function AudioBtn({ text, size = 14, label = "Ouvir" }) {
  const [playing, setPlaying] = useState(false);
  const handlePlay = useCallback((e) => {
    e.stopPropagation();
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return; }
    setPlaying(true);
    speakHebrew(text, () => setPlaying(false));
  }, [playing, text]);

  return (
    <button
      onClick={handlePlay}
      aria-label={playing ? "Parar áudio" : `Ouvir pronúncia: ${label}`}
      style={{
        display:"flex", alignItems:"center", gap:6,
        background: playing ? "rgba(59,130,246,.25)" : "rgba(255,255,255,.08)",
        border: `1px solid ${playing ? "#3B82F6" : "rgba(255,255,255,.2)"}`,
        borderRadius:10, padding:"8px 14px", color:"white",
        fontSize:size, fontWeight:500, cursor:"pointer", transition:"all .2s"
      }}
    >
      <span style={{fontSize:size+4}}>{playing ? "⏹" : "🔊"}</span>
      {label && <span>{playing ? "Parando..." : label}</span>}
    </button>
  );
});

// ── PILL ──────────────────────────────────────────────────────────────────────
const Pill = memo(function Pill({ icon, val, color, bg }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, background:bg, borderRadius:999, padding:"6px 12px", border:`1px solid ${color}20`, fontSize:13, fontWeight:600 }}>
      <span style={{fontSize:14}}>{icon}</span>
      <span style={{color}}>{val}</span>
    </div>
  );
});

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function NativIvrit() {
  const [tab, setTab]       = useState("home");
  const [screen, setScreen] = useState(null);
  const [xp, setXp]         = useState(120);
  const [streak]            = useState(5);

  useEffect(() => { preloadVoices(); }, []);

  // Flashcard
  const [fcIdx, setFcIdx]     = useState(0);
  const [fcFlip, setFcFlip]   = useState(false);
  const [fcKnown, setFcKnown] = useState(new Set());
  const fcNext = useCallback((knew) => {
    if (knew) { setFcKnown(s => new Set(s).add(fcIdx)); setXp(x => x+3); }
    setFcIdx(i => (i+1) % WORDS.length);
    setFcFlip(false);
  }, [fcIdx]);

  // Match
  const [matchWords]  = useState(() => shuffle(WORDS).slice(0,5));
  const [leftItems]   = useState(() => shuffle(matchWords.map(w => ({ id:w.heb, label:w.heb, sub:w.tr, type:"heb" }))));
  const [rightItems]  = useState(() => shuffle(matchWords.map(w => ({ id:w.heb, label:w.pt, emoji:w.emoji, type:"pt" }))));
  const [mSel, setMSel]     = useState(null);
  const [mDone, setMDone]   = useState({});
  const [mWrong, setMWrong] = useState(null);
  const [mScore, setMScore] = useState(0);
  const handleMatch = useCallback((item) => {
    if (mDone[item.id]) return;
    if (!mSel) { setMSel(item); return; }
    if (mSel.id === item.id && mSel.type !== item.type) {
      setMDone(d => ({...d, [item.id]:true}));
      setMScore(s => s+1);
      setXp(x => x+4);
      setMSel(null);
    } else if (mSel.type === item.type) {
      setMSel(item);
    } else {
      setMWrong(item.id);
      setTimeout(() => setMWrong(null), 500);
      setMSel(null);
    }
  }, [mSel, mDone]);

  // Football quiz
  const [fqIdx,  setFqIdx]   = useState(0);
  const [fqOpts, setFqOpts]  = useState(() => buildFQOpts(0));
  const [fqSel,  setFqSel]   = useState(null);
  const [fqScore,setFqScore] = useState(0);
  const [fqDone, setFqDone]  = useState(false);
  const [fqCombo,setFqCombo] = useState(0);
  const handleFQ = useCallback((opt) => {
    if (fqSel) return;
    setFqSel(opt.pt);
    if (opt.pt === FOOTBALL[fqIdx].pt) {
      setFqScore(s => s+1); setFqCombo(c => c+1); setXp(x => x+5);
      speakHebrew(FOOTBALL[fqIdx].heb);
    } else { setFqCombo(0); }
  }, [fqSel, fqIdx]);
  const nextFQ = useCallback(() => {
    if (fqIdx < FOOTBALL.length-1) {
      const ni = fqIdx+1;
      setFqIdx(ni); setFqOpts(buildFQOpts(ni)); setFqSel(null);
    } else { setFqDone(true); }
  }, [fqIdx]);

  // Riddle
  const RIDDLES = [
    { pre:"Como se diz", word:"Olá / Paz",  opts:["שָׁלוֹם (Shalom)","תּוֹדָה (Todá)","כֵּן (Ken)","לֹא (Lo)"],                    answer:"שָׁלוֹם (Shalom)", heb:"שָׁלוֹם", emoji:"👋" },
    { pre:"Como se diz", word:"Obrigado/a", opts:["בְּבַקָּשָׁה (Bevakashá)","מַיִם (Máyim)","תּוֹדָה (Todá)","שָׁלוֹם (Shalom)"],answer:"תּוֹדָה (Todá)",    heb:"תּוֹדָה", emoji:"🙏" },
    { pre:"Como se diz", word:"Água",        opts:["לֶחֶם (Léhem)","מַיִם (Máim)","בַּיִת (Báit)","כֵּן (Ken)"],                  answer:"מַיִם (Máim)",     heb:"מַיִם", emoji:"💧" },
    { pre:"Como se diz", word:"Gol!",        opts:["כַּדּוּר (Kadúr)","שָׂחְקָן (Sakhkán)","שַׁעַר (Sha'ar)","נִצָּחוֹן (Nitsakhón)"],answer:"שַׁעַר (Sha'ar)",heb:"שַׁעַר", emoji:"⚽" },
    { pre:"Como se diz", word:"Vitória",     opts:["שַׁעַר (Sha'ar)","נִצָּחוֹן (Nitsakhón)","מְאַמֵּן (Me'amén)","כַּדּוּר (Kadúr)"],answer:"נִצָּחוֹן (Nitsakhón)",heb:"נִצָּחוֹן",emoji:"🏆" },
  ];
  const [rdIdx,  setRdIdx]   = useState(0);
  const [rdSel,  setRdSel]   = useState(null);
  const [rdScore,setRdScore] = useState(0);
  const [rdDone, setRdDone]  = useState(false);
  const [rdCombo,setRdCombo] = useState(0);
  const handleRiddle = useCallback((opt) => {
    if (rdSel) return;
    setRdSel(opt);
    if (opt === RIDDLES[rdIdx].answer) {
      setRdScore(s => s+1); setRdCombo(c => c+1); setXp(x => x+5);
      speakHebrew(RIDDLES[rdIdx].heb);
    } else { setRdCombo(0); }
  }, [rdSel, rdIdx, RIDDLES]);
  const nextRiddle = useCallback(() => {
    if (rdIdx < RIDDLES.length-1) { setRdIdx(i => i+1); setRdSel(null); }
    else setRdDone(true);
  }, [rdIdx, RIDDLES.length]);

  // Chat
  const [messages, setMessages] = useState(CHAT_SEED);
  const [chatInput, setChatInput] = useState("");
  const chatRef = useRef(null);
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);
  const sendMsg = useCallback(() => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    setMessages(m => [...m, { id:Date.now(), user:"Você", avatar:"👤", msg:chatInput.trim(), time:now, mine:true }]);
    setChatInput("");
    setTimeout(() => {
      const replies = ["תּוֹדָה!","Shalom!","בְּבַקָּשָׁה.","Bom progresso.","Boker Tov!"];
      const now2 = new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
      setMessages(m => [...m, { id:Date.now()+1, user:"Yael", avatar:"👩", msg:replies[Math.floor(Math.random()*replies.length)], time:now2, mine:false }]);
    }, 900);
  }, [chatInput]);

  const goGame    = useCallback((g) => setScreen(g), []);
  const closeGame = useCallback(() => setScreen(null), []);

  const TABS = [
    { id:"home",   icon:"🏠", label:"Início"    },
    { id:"learn",  icon:"📚", label:"Estudos"   },
    { id:"games",  icon:"🎯", label:"Exercícios"},
    { id:"listen", icon:"🎧", label:"Escuta"    },
    { id:"chat",   icon:"💬", label:"Fórum"     },
  ];

  // XP para próximo nível (200 por nível)
  const xpInLevel = xp % 200;
  const xpPct     = Math.min((xpInLevel / 200) * 100, 100);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Sora','Inter',system-ui,-apple-system,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        button{cursor:pointer;border:none;font-family:'Sora',sans-serif;transition:all .18s ease}
        button:active:not(:disabled){transform:scale(0.97)}
        input{font-family:'Sora',sans-serif}

        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
        @keyframes listenPulse{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,.55)}60%{box-shadow:0 0 0 20px rgba(124,58,237,0)}}
        @keyframes xpPop{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
        @keyframes correctFlash{0%{background:rgba(16,185,129,.0)}30%{background:rgba(16,185,129,.15)}100%{background:rgba(16,185,129,.0)}}

        .fadeUp{animation:fadeUp .35s cubic-bezier(.22,1,.36,1) forwards}
        .slideIn{animation:slideIn .28s ease-out forwards}
        .shake{animation:shake .38s ease-out}
        .listen-pulse{animation:listenPulse 1.5s ease-out infinite}

        /* Flip card */
        .flip-wrap{perspective:1200px}
        .flip-inner{width:100%;height:100%;transition:transform .55s cubic-bezier(.25,.46,.45,.94);transform-style:preserve-3d;position:relative}
        .flip-inner.flipped{transform:rotateY(180deg)}
        .flip-face{position:absolute;width:100%;height:100%;backface-visibility:hidden;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px}
        .flip-back{transform:rotateY(180deg)}

        /* Scrollbar */
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        input:focus{outline:2px solid ${C.blueMid};outline-offset:2px;border-color:transparent!important}

        /* Hover states para botões de opção */
        .opt-btn:hover:not(:disabled){filter:brightness(0.95);transform:scale(1.015)}

        /* Tab ativa */
        .tab-btn-active{color:${C.blueMid}!important}
        .tab-btn-active .tab-dot{opacity:1!important}
      `}</style>

      {/* TOP BAR */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(8px)" }}>
        {screen ? (
          <button
            onClick={closeGame}
            aria-label="Voltar"
            style={{ background:"transparent", color:C.gray, padding:"6px 12px", borderRadius:8, fontWeight:600, fontSize:14, display:"flex", alignItems:"center", gap:6 }}
          >
            ← Voltar
          </button>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, background:`linear-gradient(135deg,${C.blue},${C.blueMid})`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:C.white, fontWeight:700, boxShadow:`0 4px 12px ${C.blue}40` }}>א</div>
            <div>
              <div style={{ fontWeight:800, color:C.navy, fontSize:17, letterSpacing:"-.02em" }}>Nativ</div>
              <div style={{ fontWeight:500, color:C.gray, fontSize:12 }}>עִבְרִית</div>
            </div>
          </div>
        )}
        <div style={{ display:"flex", gap:8 }}>
          <Pill icon="🔥" val={streak} color={C.orange} bg={C.orangeLt}/>
          <Pill icon="⭐" val={xp}     color={C.blue}   bg={C.blueLt}/>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom: screen ? 0 : 80 }}>
        {screen === "fc"       && <FlashcardGame deck={WORDS} idx={fcIdx} flip={fcFlip} known={fcKnown} setFlip={setFcFlip} next={fcNext}/>}
        {screen === "match"    && <MatchGame left={leftItems} right={rightItems} sel={mSel} done={mDone} wrong={mWrong} score={mScore} allDone={Object.keys(mDone).length===matchWords.length} onSelect={handleMatch}/>}
        {screen === "football" && <FootballQuiz words={FOOTBALL} idx={fqIdx} opts={fqOpts} sel={fqSel} score={fqScore} done={fqDone} combo={fqCombo} onAnswer={handleFQ} onNext={nextFQ}/>}
        {screen === "riddle"   && <RiddleGame riddles={RIDDLES} idx={rdIdx} sel={rdSel} score={rdScore} done={rdDone} combo={rdCombo} onAnswer={handleRiddle} onNext={nextRiddle}/>}
        {screen === "penalty"  && <PenaltyGame onXp={n => setXp(x => x+n)}/>}

        {!screen && tab === "home"   && <HomeTab xp={xp} xpPct={xpPct} goGame={goGame} setTab={setTab}/>}
        {!screen && tab === "learn"  && <LearnTab levels={LEVELS} xp={xp} xpPct={xpPct} goGame={goGame} words={WORDS}/>}
        {!screen && tab === "games"  && <GamesTab goGame={goGame} setTab={setTab}/>}
        {!screen && tab === "listen" && <ListenTab challenges={LISTEN_CHALLENGES} setXp={setXp}/>}
        {!screen && tab === "chat"   && <ChatTab messages={messages} input={chatInput} setInput={setChatInput} onSend={sendMsg} chatRef={chatRef}/>}
      </div>

      {/* BOTTOM NAV */}
      {!screen && (
        <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:100, paddingBottom:"env(safe-area-inset-bottom, 0px)" }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-label={t.label}
                style={{ flex:1, background:"transparent", padding:"10px 4px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}
              >
                <div style={{ fontSize:20, color: active ? C.blueMid : C.gray, transition:"transform .2s", transform: active ? "scale(1.12)" : "scale(1)" }}>{t.icon}</div>
                <div style={{ fontSize:10, fontWeight: active ? 700 : 500, color: active ? C.blueMid : C.gray }}>{t.label}</div>
                {/* Indicador de aba ativa */}
                <div style={{ width: active ? 20 : 0, height:3, borderRadius:2, background:C.blueMid, transition:"width .25s ease", overflow:"hidden" }}/>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

// ── HOME TAB ──────────────────────────────────────────────────────────────────
function HomeTab({ xp, xpPct, goGame, setTab }) {
  // Palavra do dia rotativa
  const wordOfDay = WORDS[new Date().getDate() % WORDS.length];

  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      {/* Banner de boas-vindas */}
      <div style={{ background:"linear-gradient(135deg,#1E3A8A 0%,#2563EB 60%,#1D4ED8 100%)", borderRadius:22, padding:"26px 24px", marginBottom:20, position:"relative", overflow:"hidden", boxShadow:"0 12px 30px rgba(30,58,138,.2)" }}>
        {/* Decoração de fundo */}
        <div style={{ position:"absolute", top:-30, right:-30, width:130, height:130, background:"rgba(255,255,255,.06)", borderRadius:"50%" }}/>
        <div style={{ position:"absolute", bottom:-20, right:60, width:80, height:80, background:"rgba(255,255,255,.04)", borderRadius:"50%" }}/>
        <div style={{ fontSize:13, color:"rgba(255,255,255,.65)", fontWeight:600, marginBottom:6, letterSpacing:".03em" }}>Bem-vindo(a) de volta 👋</div>
        <h1 style={{ fontSize:22, fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:18, letterSpacing:"-.02em" }}>Continue sua jornada</h1>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontSize:13, color:"rgba(255,255,255,.75)", fontWeight:600 }}>Nível Alef · {xp} XP</span>
          <span style={{ fontSize:13, color:"#FCD34D", fontWeight:700 }}>{Math.round(xpPct)}%</span>
        </div>
        <div style={{ background:"rgba(255,255,255,.18)", borderRadius:999, height:7, overflow:"hidden" }}>
          <div style={{ width:`${xpPct}%`, height:"100%", background:"linear-gradient(90deg,#FCD34D,#F59E0B)", borderRadius:999, transition:"width .6s cubic-bezier(.22,1,.36,1)" }}/>
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", marginTop:6 }}>{200 - (xp % 200)} XP para o próximo nível</div>
      </div>

      {/* Palavra do dia */}
      <div style={{ background:C.white, borderRadius:18, padding:"20px", marginBottom:20, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.gray, textTransform:"uppercase", letterSpacing:"0.07em" }}>✨ Palavra do dia</div>
          <div style={{ fontSize:22 }}>{wordOfDay.emoji}</div>
        </div>
        <div style={{ fontSize:38, direction:"rtl", fontWeight:800, color:C.navy, marginBottom:4, letterSpacing:"-.01em" }}>{wordOfDay.heb}</div>
        <div style={{ color:C.orangeMid, fontWeight:700, fontSize:17, marginBottom:2 }}>{wordOfDay.tr}</div>
        <div style={{ color:C.gray, fontSize:14, marginBottom:16 }}>{wordOfDay.pt}</div>
        <AudioBtn text={wordOfDay.heb} label="Ouvir pronúncia"/>
      </div>

      {/* Exercícios recomendados */}
      <div style={{ fontSize:13, fontWeight:700, color:C.gray, marginBottom:14, textTransform:"uppercase", letterSpacing:"0.07em" }}>Exercícios recomendados</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {[
          { id:"fc",      icon:"📖", label:"Flashcards",         desc:"Memorização com áudio",        color:C.blue,    badge:"Popular" },
          { id:"match",   icon:"🔗", label:"Associações",        desc:"Hebraico ↔ Português",        color:C.orange,  badge:null },
          { id:"listen",  icon:"🎧", label:"Escute e Transcreva",desc:"Ouça e escreva em hebraico",  color:"#7C3AED", badge:"Novo" },
          { id:"penalty", icon:"⚽", label:"Pênaltis",           desc:"Vocabulário + pressão",        color:"#B45309", badge:null },
        ].map(g => (
          <button
            key={g.id}
            className="opt-btn"
            onClick={() => g.id === "listen" ? setTab("listen") : goGame(g.id)}
            style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"16px 18px", display:"flex", alignItems:"center", gap:14, boxShadow:"0 2px 8px rgba(0,0,0,.06)", textAlign:"left" }}
          >
            <div style={{ width:50, height:50, borderRadius:12, background:`${g.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{g.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:2 }}>
                <span style={{ fontWeight:700, fontSize:14, color:C.navy }}>{g.label}</span>
                {g.badge && <span style={{ fontSize:10, fontWeight:700, color:g.color, background:`${g.color}18`, borderRadius:999, padding:"2px 7px" }}>{g.badge}</span>}
              </div>
              <div style={{ fontSize:12, color:C.gray }}>{g.desc}</div>
            </div>
            <div style={{ color:g.color, fontSize:18 }}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── LEARN TAB ─────────────────────────────────────────────────────────────────
function LearnTab({ levels, xp, xpPct, goGame, words }) {
  const [playingIdx, setPlayingIdx] = useState(null);

  const handlePlay = useCallback((word, idx) => {
    if (playingIdx === idx) { window.speechSynthesis.cancel(); setPlayingIdx(null); return; }
    setPlayingIdx(idx);
    speakHebrew(word.heb, () => setPlayingIdx(null));
  }, [playingIdx]);

  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <h2 style={{fontSize:22,fontWeight:800,color:C.navy,marginBottom:4,letterSpacing:"-.02em"}}>Vocabulário</h2>
      <p style={{fontSize:13,color:C.gray,marginBottom:18}}>Toque 🔊 para ouvir a pronúncia</p>

      <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:28}}>
        {words.map((w, i) => (
          <div key={i} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"13px 15px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
            <div style={{fontSize:24,flexShrink:0}}>{w.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:22,direction:"rtl",fontWeight:700,color:C.navy,marginBottom:1}}>{w.heb}</div>
              <div style={{fontSize:12,color:C.orangeMid,fontWeight:600}}>{w.tr}</div>
              <div style={{fontSize:12,color:C.gray}}>{w.pt}</div>
            </div>
            <button
              onClick={() => handlePlay(w, i)}
              aria-label={`Ouvir pronúncia de ${w.pt}`}
              style={{
                width:42, height:42, borderRadius:10, flexShrink:0,
                background: playingIdx===i ? `${C.blue}15` : C.grayLt,
                border: `1.5px solid ${playingIdx===i ? C.blue : C.border}`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:17,
                transition:"all .2s"
              }}
            >
              {playingIdx===i ? "⏹" : "🔊"}
            </button>
          </div>
        ))}
      </div>

      <h2 style={{fontSize:22,fontWeight:800,color:C.navy,marginBottom:4,letterSpacing:"-.02em"}}>Trilha de Estudos</h2>
      <p style={{fontSize:13,color:C.gray,marginBottom:16}}>Progrida sistematicamente</p>

      {/* Barra de progresso geral */}
      <div style={{background:C.white,borderRadius:14,padding:"16px 18px",marginBottom:22,border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontWeight:700,fontSize:13,color:C.navy}}>Progresso atual</span>
          <span style={{fontWeight:700,fontSize:13,color:C.orangeMid}}>{xp}/200 XP</span>
        </div>
        <div style={{background:C.grayLt,borderRadius:999,height:8,overflow:"hidden"}}>
          <div style={{width:`${xpPct}%`,height:"100%",background:`linear-gradient(90deg,${C.blue},${C.blueMid})`,borderRadius:999,transition:"width .5s ease"}}/>
        </div>
      </div>

      {levels.map(lvl => (
        <div key={lvl.id} style={{marginBottom:18}}>
          <div style={{ background:lvl.locked?C.grayLt:`linear-gradient(135deg,${C.blue},${C.blueMid})`, borderRadius:14, padding:"14px 18px", marginBottom:10, display:"flex", alignItems:"center", gap:10, boxShadow:lvl.locked?"none":"0 4px 14px rgba(30,58,138,.18)" }}>
            <div style={{fontSize:22,opacity:lvl.locked?.5:1}}>{lvl.locked?"🔒":lvl.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15,color:lvl.locked?C.gray:C.white}}>Nível {lvl.id}: {lvl.title}</div>
              <div style={{fontSize:12,color:lvl.locked?C.gray:"rgba(255,255,255,.75)"}}>{lvl.sub}</div>
            </div>
            {!lvl.locked && <div style={{fontSize:10,fontWeight:700,color:"#FCD34D",background:"rgba(255,255,255,.12)",borderRadius:999,padding:"3px 9px"}}>Ativo</div>}
          </div>
          {!lvl.locked && lvl.lessons.map(les => (
            <button key={les.id} className="opt-btn" onClick={() => goGame("fc")} style={{ width:"100%", background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"13px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:12, boxShadow:"0 2px 6px rgba(0,0,0,.06)", textAlign:"left" }}>
              <div style={{width:42,height:42,borderRadius:10,background:C.blueLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{les.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,color:C.navy}}>{les.title}</div>
                <div style={{fontSize:11,color:C.gray}}>{les.xp} XP</div>
              </div>
              <div style={{background:`linear-gradient(135deg,${C.blue},${C.blueMid})`,color:"white",borderRadius:8,padding:"5px 12px",fontWeight:700,fontSize:11}}>Iniciar</div>
            </button>
          ))}
          {lvl.locked && (
            <div style={{background:C.grayLt,border:`1px dashed ${C.border}`,borderRadius:12,padding:"14px",textAlign:"center"}}>
              <span style={{color:C.gray,fontSize:13,fontWeight:500}}>Complete o nível anterior para desbloquear</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── GAMES TAB ─────────────────────────────────────────────────────────────────
const GAME_DIFFICULTY = { fc:"Fácil", match:"Médio", riddle:"Médio", penalty:"Difícil", football:"Fácil", listen:"Difícil" };
const DIFF_COLOR = { "Fácil":C.green, "Médio":C.orangeMid, "Difícil":C.red };

function GamesTab({ goGame, setTab }) {
  const games = [
    { id:"fc",       icon:"📖", title:"Flashcards",           desc:"Memorização com áudio",        color:C.blue,    xp:3  },
    { id:"match",    icon:"🔗", title:"Associações",          desc:"Relacionar palavras",           color:C.orange,  xp:4  },
    { id:"riddle",   icon:"❓", title:"Compreensão",          desc:"Múltipla escolha",             color:C.navy,    xp:5  },
    { id:"penalty",  icon:"⚽", title:"Pênaltis",             desc:"Desafio sob pressão",          color:"#B45309", xp:5  },
    { id:"football", icon:"🏟️", title:"Vocabulário Esportivo",desc:"Termos de futebol",            color:"#1E40AF", xp:5  },
    { id:"listen",   icon:"🎧", title:"Escute e Transcreva",  desc:"Ouça e escreva em hebraico",   color:"#7C3AED", xp:8  },
  ];
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <h2 style={{fontSize:22,fontWeight:800,color:C.navy,marginBottom:4,letterSpacing:"-.02em"}}>Exercícios</h2>
      <p style={{fontSize:13,color:C.gray,marginBottom:18}}>Pratique e ganhe experiência</p>
      <div style={{display:"flex",flexDirection:"column",gap:11}}>
        {games.map(g => {
          const diff = GAME_DIFFICULTY[g.id];
          const dc   = DIFF_COLOR[diff];
          return (
            <button key={g.id} className="opt-btn" onClick={() => g.id === "listen" ? setTab("listen") : goGame(g.id)} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"16px 18px", display:"flex", alignItems:"center", gap:14, boxShadow:"0 2px 8px rgba(0,0,0,.07)", textAlign:"left" }}>
              <div style={{ width:54, height:54, borderRadius:13, background:`${g.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{g.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                  <span style={{fontWeight:700,fontSize:14,color:C.navy}}>{g.title}</span>
                  {/* Badge de dificuldade — melhoria nova */}
                  <span style={{fontSize:10,fontWeight:700,color:dc,background:`${dc}15`,borderRadius:999,padding:"2px 7px"}}>{diff}</span>
                </div>
                <div style={{fontSize:12,color:C.gray}}>{g.desc}</div>
              </div>
              <div style={{color:g.color,fontWeight:700,fontSize:12,background:`${g.color}12`,borderRadius:8,padding:"4px 9px"}}>+{g.xp} XP</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── LISTEN TAB ────────────────────────────────────────────────────────────────
// MELHORIA: reprodução automática ao avançar + animação de entrada no card
function ListenTab({ challenges, setXp }) {
  const [idx,       setIdx]       = useState(0);
  const [input,     setInput]     = useState("");
  const [result,    setResult]    = useState(null);
  const [score,     setScore]     = useState(0);
  const [done,      setDone]      = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [history,   setHistory]   = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [autoPlayed, setAutoPlayed] = useState(false); // NOVO: controla autoplay
  const inputRef = useRef(null);
  const challenge = challenges[idx];

  // MELHORIA: reproduz automaticamente ao carregar cada novo desafio
  useEffect(() => {
    if (autoPlayed) return; // evita loop
    const timer = setTimeout(() => {
      setAutoPlayed(true);
      setIsPlaying(true);
      setPlayCount(1);
      speakHebrew(challenge.heb, () => setIsPlaying(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const playChallenge = () => {
    if (isPlaying) { window.speechSynthesis.cancel(); setIsPlaying(false); return; }
    setIsPlaying(true);
    setPlayCount(c => c+1);
    speakHebrew(challenge.heb, () => setIsPlaying(false));
  };

  const showHint = () => { setHintShown(true); setXp(x => Math.max(0, x-2)); };

  const normalize = (s) => s.replace(/[\u05B0-\u05C7]/g, "").trim();

  const submit = () => {
    if (!input.trim()) return;
    const correct = normalize(challenge.heb);
    const userAns = normalize(input);
    if (userAns === correct) {
      const pts = hintShown ? 4 : 8;
      setScore(s => s+1); setXp(x => x+pts); setResult("correct");
      setHistory(h => [...h, { correct:true, word:challenge.heb, pt:challenge.pt }]);
      setTimeout(() => speakHebrew(challenge.heb), 150);
    } else {
      setResult("wrong");
      setHistory(h => [...h, { correct:false, word:challenge.heb, pt:challenge.pt, attempted:input }]);
    }
  };

  const next = () => {
    if (idx >= challenges.length-1) { setDone(true); return; }
    setIdx(i => i+1);
    setInput(""); setResult(null); setHintShown(false); setPlayCount(0);
    setIsPlaying(false); setAutoPlayed(false); // NOVO: reseta autoplay
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const skip = () => {
    setHistory(h => [...h, { skipped:true, word:challenge.heb, pt:challenge.pt }]);
    next();
  };

  const restart = () => {
    setIdx(0); setInput(""); setResult(null); setScore(0);
    setDone(false); setHintShown(false); setHistory([]); setPlayCount(0);
    setIsPlaying(false); setAutoPlayed(false);
  };

  const HEB_LETTERS = ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל","מ","נ","ס","ע","פ","צ","ק","ר","ש","ת","ם","ן","ף","ך","ץ"];
  const insertLetter = (l) => setInput(v => v + l);
  const deleteLast   = () => setInput(v => v.slice(0,-1));

  if (done) {
    const pct = Math.round((score / challenges.length) * 100);
    return (
      <div className="fadeUp" style={{padding:"28px 20px", background:"linear-gradient(170deg,#0f172a,#1e1b4b)", minHeight:"100vh"}}>
        <div style={{textAlign:"center",paddingTop:20}}>
          <div style={{fontSize:72,marginBottom:16}}>{pct>=90?"🏆":pct>=60?"⭐":"📖"}</div>
          <h2 style={{fontSize:26,fontWeight:800,color:"white",marginBottom:6,letterSpacing:"-.02em"}}>{pct>=90?"Excelente!":pct>=60?"Muito bem!":"Continue praticando!"}</h2>
          <p style={{fontSize:14,color:"rgba(255,255,255,.5)",marginBottom:24}}>{score} de {challenges.length} palavras corretas</p>
          <div style={{background:"rgba(139,92,246,.15)",border:"1px solid rgba(139,92,246,.3)",borderRadius:20,padding:"22px",marginBottom:22}}>
            <div style={{fontSize:52,fontWeight:800,color:"white",marginBottom:4}}>{pct}%</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>taxa de acerto</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:22,textAlign:"left"}}>
            {history.map((h,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"12px 14px"}}>
                <span style={{fontSize:18}}>{h.skipped?"⏭":h.correct?"✅":"❌"}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:18,direction:"rtl",fontWeight:700,color:"white"}}>{h.word}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{h.pt}</div>
                </div>
                {!h.correct && !h.skipped && <div style={{fontSize:12,color:"rgba(239,68,68,.7)"}}>sua: {h.attempted}</div>}
                <button aria-label={`Ouvir ${h.word}`} onClick={() => speakHebrew(h.word)} style={{width:34,height:34,borderRadius:8,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",fontSize:16}}>🔊</button>
              </div>
            ))}
          </div>
          <button onClick={restart} style={{width:"100%",background:"linear-gradient(135deg,#7C3AED,#8B5CF6)",border:"none",borderRadius:14,padding:"17px",color:"white",fontWeight:700,fontSize:15,boxShadow:"0 6px 20px rgba(124,58,237,.35)",marginBottom:10}}>
            🔄 Praticar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fadeUp" style={{padding:"20px", background:"linear-gradient(170deg,#0f172a,#1e1b4b)", minHeight:"100vh"}}>
      {/* Cabeçalho */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🎧</span>
          <div>
            <div style={{fontWeight:700,color:"white",fontSize:16}}>Escute e Transcreva</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{idx+1} de {challenges.length}</div>
          </div>
        </div>
        <span style={{background:"rgba(139,92,246,.2)",border:"1px solid rgba(139,92,246,.4)",borderRadius:999,padding:"5px 12px",fontSize:13,fontWeight:700,color:"#C4B5FD"}}>✓ {score}</span>
      </div>

      {/* Barra de progresso */}
      <div style={{background:"rgba(255,255,255,.1)",borderRadius:999,height:5,marginBottom:20,overflow:"hidden"}}>
        <div style={{width:`${(idx/challenges.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#8B5CF6,#A78BFA)",borderRadius:999,transition:"width .4s ease"}}/>
      </div>

      {/* Card principal */}
      <div style={{background:"rgba(139,92,246,.12)",border:"1px solid rgba(139,92,246,.25)",borderRadius:20,padding:"28px 20px",marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:700,marginBottom:14,textTransform:"uppercase",letterSpacing:".06em"}}>Ouça e escreva em hebraico</div>
        <button
          onClick={playChallenge}
          className={isPlaying ? "listen-pulse" : ""}
          aria-label={isPlaying ? "Parar áudio" : "Ouvir palavra"}
          style={{
            width:90, height:90, borderRadius:"50%",
            background: isPlaying
              ? "linear-gradient(135deg,#5B21B6,#7C3AED)"
              : "linear-gradient(135deg,#7C3AED,#8B5CF6)",
            border:"none", fontSize:36, marginBottom:14, cursor:"pointer",
            boxShadow: isPlaying ? "0 0 0 0 rgba(124,58,237,.5)" : "0 8px 28px rgba(124,58,237,.45)",
            transition:"all .2s"
          }}
        >
          {isPlaying ? "⏹" : "🔊"}
        </button>
        <div style={{fontSize:14,color:"rgba(255,255,255,.55)",fontWeight:500}}>
          {isPlaying ? "Reproduzindo..." : playCount === 0 ? "Toque para ouvir a palavra" : "Toque para ouvir novamente"}
        </div>
        {/* MELHORIA: indicador de autoplay */}
        {autoPlayed && playCount === 1 && !isPlaying && (
          <div style={{fontSize:11,color:"rgba(139,92,246,.7)",marginTop:4,fontWeight:600}}>▶ Reproduzida automaticamente</div>
        )}
        {playCount > 1 && <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:4}}>Reproduzida {playCount}×</div>}
      </div>

      {/* Dica */}
      {hintShown ? (
        <div style={{background:"rgba(59,130,246,.1)",border:"1px solid rgba(59,130,246,.2)",borderRadius:12,padding:"12px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>{challenge.emoji}</span>
          <div>
            <div style={{fontSize:11,color:"rgba(59,130,246,.7)",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>Dica</div>
            <div style={{fontSize:14,color:"rgba(255,255,255,.8)"}}>{challenge.hint}</div>
            <div style={{fontSize:13,color:"#93C5FD",fontWeight:600,marginTop:2}}>Pronúncia: {challenge.tr}</div>
          </div>
        </div>
      ) : (
        <button onClick={showHint} style={{width:"100%",background:"rgba(255,255,255,.04)",border:"1px dashed rgba(255,255,255,.12)",borderRadius:12,padding:"12px",color:"rgba(255,255,255,.35)",fontSize:13,fontWeight:500,marginBottom:12}}>
          💡 Ver dica (−2 XP)
        </button>
      )}

      {/* Campo de entrada */}
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:".06em"}}>Digite em hebraico:</div>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && !result && submit()}
          placeholder="הקלד כאן..."
          dir="rtl"
          disabled={!!result}
          aria-label="Digite a palavra em hebraico"
          style={{
            width:"100%", background:"rgba(255,255,255,.08)",
            border:`1.5px solid ${result ? "transparent" : "rgba(255,255,255,.15)"}`,
            borderRadius:14, padding:"14px 16px",
            fontSize:26, direction:"rtl", color:"white", fontWeight:700, letterSpacing:1
          }}
        />

        {/* Teclado hebraico virtual */}
        {!result && (
          <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:5}}>
            {HEB_LETTERS.map(l => (
              <button key={l} onClick={() => insertLetter(l)} aria-label={`Letra ${l}`} style={{width:33,height:33,borderRadius:7,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",color:"white",fontSize:14,fontWeight:600}}>
                {l}
              </button>
            ))}
            <button onClick={deleteLast} aria-label="Apagar" style={{width:46,height:33,borderRadius:7,background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",color:"#FCA5A5",fontSize:13,fontWeight:700}}>⌫</button>
          </div>
        )}
      </div>

      {/* Feedback */}
      {result === "correct" && (
        <div style={{background:"rgba(16,185,129,.15)",border:"1px solid rgba(16,185,129,.4)",borderRadius:14,padding:"16px",marginBottom:12,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:4}}>🎉</div>
          <div style={{fontSize:17,fontWeight:700,color:"#6EE7B7"}}>Correto! +{hintShown?4:8} XP</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,.5)",marginTop:4}}>{challenge.heb} = {challenge.pt}</div>
        </div>
      )}
      {result === "wrong" && (
        <div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:14,padding:"16px",marginBottom:12}}>
          <div style={{fontSize:14,fontWeight:700,color:"#FCA5A5",marginBottom:6}}>❌ Resposta incorreta</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginBottom:4}}>A resposta correta é:</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:26,direction:"rtl",fontWeight:700,color:"white"}}>{challenge.heb}</div>
              <div style={{fontSize:13,color:"#FCD34D",fontWeight:600}}>{challenge.tr} — {challenge.pt}</div>
            </div>
            <button aria-label="Ouvir pronúncia correta" onClick={() => speakHebrew(challenge.heb)} style={{width:44,height:44,borderRadius:10,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",fontSize:20}}>🔊</button>
          </div>
        </div>
      )}

      {/* Botões de ação */}
      {!result ? (
        <>
          <button
            onClick={submit}
            disabled={!input.trim()}
            style={{width:"100%",background:input.trim()?"linear-gradient(135deg,#7C3AED,#8B5CF6)":"rgba(255,255,255,.08)",border:"none",borderRadius:14,padding:"17px",color:input.trim()?"white":"rgba(255,255,255,.3)",fontWeight:700,fontSize:15,boxShadow:input.trim()?"0 6px 20px rgba(124,58,237,.35)":"none",marginBottom:8,transition:"all .3s"}}
          >
            Verificar ✓
          </button>
          <button onClick={skip} style={{width:"100%",background:"transparent",border:"none",padding:"10px",color:"rgba(255,255,255,.25)",fontSize:13}}>Pular esta palavra</button>
        </>
      ) : (
        <button onClick={next} style={{width:"100%",background:"linear-gradient(135deg,#7C3AED,#8B5CF6)",border:"none",borderRadius:14,padding:"17px",color:"white",fontWeight:700,fontSize:15,boxShadow:"0 6px 20px rgba(124,58,237,.35)"}}>
          {idx < challenges.length-1 ? "Próxima →" : "Ver resultado 🏆"}
        </button>
      )}
    </div>
  );
}

// ── CHAT TAB ──────────────────────────────────────────────────────────────────
// MELHORIA: contador de caracteres + aviso de limite + indicador de digitação
const MAX_MSG = 200;

function ChatTab({ messages, input, setInput, onSend, chatRef }) {
  const remaining = MAX_MSG - input.length;
  const overLimit = input.length > MAX_MSG;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
      {/* Cabeçalho */}
      <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,background:C.white}}>
        <h2 style={{fontSize:18,fontWeight:800,color:C.navy,letterSpacing:"-.02em"}}>Fórum da Comunidade</h2>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#22C55E",boxShadow:"0 0 6px #22C55E60"}}/>
          <span style={{fontSize:12,color:C.gray,fontWeight:500}}>42 membros ativos agora</span>
        </div>
      </div>

      {/* Mensagens */}
      <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10,background:C.bg}}>
        {messages.map((m, i) => (
          <div key={m.id} className="slideIn" style={{display:"flex",flexDirection:m.mine?"row-reverse":"row",alignItems:"flex-end",gap:8, animationDelay:`${i*0.03}s`}}>
            {!m.mine && (
              <div style={{width:36,height:36,borderRadius:18,background:C.blueLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{m.avatar}</div>
            )}
            <div style={{maxWidth:"72%"}}>
              {!m.mine && <div style={{fontSize:11,fontWeight:700,color:C.gray,marginBottom:4}}>{m.user}</div>}
              <div style={{background:m.mine?`linear-gradient(135deg,${C.blue},${C.blueMid})`:C.white,borderRadius:m.mine?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"10px 14px",border:m.mine?"none":`1px solid ${C.border}`,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
                <div style={{fontSize:14,fontWeight:500,color:m.mine?"white":C.navy,lineHeight:1.5}}>{m.msg}</div>
              </div>
              <div style={{fontSize:10,color:C.gray,marginTop:4,fontWeight:500,textAlign:m.mine?"right":"left"}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{padding:"12px 16px",background:C.white,borderTop:`1px solid ${C.border}`}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
          <div style={{flex:1}}>
            <input
              value={input}
              onChange={e => setInput(e.target.value.slice(0, MAX_MSG + 10))}
              onKeyDown={e => e.key==="Enter" && !overLimit && onSend()}
              placeholder="Digite em português ou hebraico..."
              aria-label="Mensagem"
              style={{width:"100%",background:C.grayLt,border:`1.5px solid ${overLimit?C.red:C.border}`,borderRadius:12,padding:"11px 14px",fontSize:14,color:C.navy,fontWeight:500}}
            />
            {/* MELHORIA: contador de caracteres */}
            {input.length > 150 && (
              <div style={{fontSize:11,color:overLimit?C.red:C.gray,marginTop:4,textAlign:"right",fontWeight:overLimit?700:400}}>
                {overLimit ? `⚠ Limite excedido (${-remaining})` : `${remaining} restantes`}
              </div>
            )}
          </div>
          <button
            onClick={onSend}
            disabled={!input.trim() || overLimit}
            aria-label="Enviar mensagem"
            style={{background:(input.trim()&&!overLimit)?`linear-gradient(135deg,${C.blue},${C.blueMid})`:C.grayLt,borderRadius:12,width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:(input.trim()&&!overLimit)?"white":C.gray,fontWeight:700,flexShrink:0,boxShadow:(input.trim()&&!overLimit)?`0 4px 12px ${C.blue}40`:"none"}}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FLASHCARD GAME ────────────────────────────────────────────────────────────
function FlashcardGame({ deck, idx, flip, known, setFlip, next }) {
  const card = deck[idx];
  const [playing, setPlaying] = useState(false);

  const handlePlay = useCallback((e) => {
    e.stopPropagation();
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return; }
    setPlaying(true);
    speakHebrew(card.heb, () => setPlaying(false));
  }, [playing, card.heb]);

  useEffect(() => { setPlaying(false); }, [idx]);

  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      {/* Progresso */}
      <div style={{background:C.grayLt,borderRadius:999,height:6,marginBottom:16,overflow:"hidden"}}>
        <div style={{width:`${((idx+1)/deck.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.blue},${C.blueMid})`,transition:"width .4s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,alignItems:"center"}}>
        <span style={{fontSize:13,color:C.gray,fontWeight:600}}>{idx+1} / {deck.length}</span>
        <Pill icon="✓" val={known.size} color={C.blue} bg={C.blueLt}/>
      </div>

      {/* Card com flip */}
      <div className="flip-wrap" style={{height:260,marginBottom:20}} onClick={() => setFlip(f => !f)}>
        <div className={`flip-inner ${flip?"flipped":""}`} style={{height:260}}>
          {/* Frente */}
          <div className="flip-face" style={{background:"linear-gradient(135deg,#1E3A8A,#2563EB)",boxShadow:"0 10px 30px rgba(30,58,138,.25)"}}>
            <div style={{fontSize:12,color:"rgba(255,255,255,.55)",fontWeight:700,marginBottom:14,textTransform:"uppercase",letterSpacing:".07em"}}>Hebraico</div>
            <div style={{fontSize:46,direction:"rtl",fontWeight:800,color:"white",textAlign:"center",lineHeight:1.1,marginBottom:10}}>{card.heb}</div>
            <div style={{color:"#FCD34D",fontWeight:700,fontSize:17,marginBottom:14}}>{card.tr}</div>
            <button
              onClick={handlePlay}
              aria-label={playing?"Parar":"Ouvir pronúncia"}
              style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.12)",border:"1.5px solid rgba(255,255,255,.25)",borderRadius:10,padding:"8px 16px",color:"white",fontSize:13,fontWeight:600}}
            >
              <span>{playing?"⏹":"🔊"}</span>{playing?"Parando...":"Ouvir"}
            </button>
          </div>
          {/* Verso */}
          <div className="flip-back flip-face" style={{background:"linear-gradient(135deg,#B45309,#D97706)",boxShadow:"0 10px 30px rgba(180,83,9,.25)"}}>
            <div style={{fontSize:12,color:"rgba(255,255,255,.55)",fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:".07em"}}>Português</div>
            <div style={{fontSize:30,fontWeight:800,color:"white",textAlign:"center",marginBottom:8}}>{card.pt}</div>
            <div style={{fontSize:22,direction:"rtl",color:"rgba(255,255,255,.85)",fontWeight:600}}>{card.heb}</div>
            <div style={{fontSize:14,color:"rgba(255,255,255,.55)",marginTop:10}}>Toque em "Conheço" se sabia!</div>
          </div>
        </div>
      </div>

      {flip ? (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <button onClick={() => next(false)} style={{background:C.white,border:`1.5px solid ${C.red}`,color:C.red,padding:"15px",borderRadius:12,fontWeight:700,fontSize:15}}>❌ Não sei</button>
          <button onClick={() => next(true)}  style={{background:`linear-gradient(135deg,${C.blue},${C.blueMid})`,color:"white",padding:"15px",borderRadius:12,fontWeight:700,fontSize:15,boxShadow:`0 4px 14px ${C.blue}40`}}>✓ Conheço</button>
        </div>
      ) : (
        <div style={{textAlign:"center",color:C.gray,fontSize:14,fontWeight:500,background:C.white,borderRadius:12,padding:"15px 20px",border:`1px solid ${C.border}`}}>
          👆 Toque no cartão para ver a tradução
        </div>
      )}
    </div>
  );
}

// ── MATCH GAME ────────────────────────────────────────────────────────────────
function MatchGame({ left, right, sel, done, wrong, score, allDone, onSelect }) {
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <h2 style={{fontSize:20,fontWeight:800,color:C.navy,letterSpacing:"-.02em"}}>Associações</h2>
        <Pill icon="⭐" val={`${score}/${left.length}`} color={C.orange} bg={C.orangeLt}/>
      </div>
      <p style={{fontSize:13,color:C.gray,marginBottom:20}}>Conecte a palavra hebraica com sua tradução</p>

      {allDone ? (
        <div style={{textAlign:"center",paddingTop:60}}>
          <div style={{fontSize:72,marginBottom:16}}>🎉</div>
          <h3 style={{fontSize:24,fontWeight:800,color:C.blue,marginBottom:8}}>Concluído!</h3>
          <p style={{color:C.gray,fontSize:14}}>Todos os pares foram associados corretamente</p>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.gray,marginBottom:10,textAlign:"center",textTransform:"uppercase",letterSpacing:".07em"}}>Hebraico</div>
            {left.map(item => {
              const matched=done[item.id], isSel=sel?.id===item.id&&sel?.type==="heb", isWrong=wrong===item.id;
              return (
                <button key={item.id} className={isWrong?"shake opt-btn":"opt-btn"} onClick={() => !matched&&onSelect({...item,type:"heb"})} disabled={matched} style={{width:"100%",marginBottom:10,padding:"14px",borderRadius:12,border:`1.5px solid ${matched?"rgba(245,158,11,.5)":isSel?C.blue:C.border}`,background:matched?C.orangeLt:isSel?C.blueLt:C.white,color:matched?C.orange:isSel?C.blue:C.navy,fontSize:18,direction:"rtl",fontWeight:700,cursor:matched?"default":"pointer",transition:"all .2s"}}>
                  {item.label}
                  {matched && <span style={{fontSize:12,marginRight:4}}>✓</span>}
                </button>
              );
            })}
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.gray,marginBottom:10,textAlign:"center",textTransform:"uppercase",letterSpacing:".07em"}}>Português</div>
            {right.map(item => {
              const matched=done[item.id], isSel=sel?.id===item.id&&sel?.type==="pt", isWrong=wrong===item.id;
              return (
                <button key={item.id} className={isWrong?"shake opt-btn":"opt-btn"} onClick={() => !matched&&onSelect({...item,type:"pt"})} disabled={matched} style={{width:"100%",marginBottom:10,padding:"12px",borderRadius:12,border:`1.5px solid ${matched?"rgba(245,158,11,.5)":isSel?C.orange:C.border}`,background:matched?C.orangeLt:isSel?C.orangeLt:C.white,color:matched?C.orange:isSel?C.orange:C.navy,fontSize:13,fontWeight:700,cursor:matched?"default":"pointer",display:"flex",alignItems:"center",gap:7,transition:"all .2s"}}>
                  <span style={{fontSize:20}}>{item.emoji}</span>{item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── FOOTBALL QUIZ ─────────────────────────────────────────────────────────────
function FootballQuiz({ words, idx, opts, sel, score, done, combo, onAnswer, onNext }) {
  const cur = words[idx];
  const [playing, setPlaying] = useState(false);
  useEffect(() => { setPlaying(false); }, [idx]);
  const handlePlay = () => {
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return; }
    setPlaying(true);
    speakHebrew(cur.heb, () => setPlaying(false));
  };
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <Pill icon="⚽" val={`${score}/${words.length}`} color={C.green} bg={C.greenLt}/>
        {combo>=2 && <Pill icon="🔥" val={`${combo}×`} color={C.orange} bg={C.orangeLt}/>}
      </div>
      <div style={{background:C.grayLt,borderRadius:999,height:6,marginBottom:18,overflow:"hidden"}}>
        <div style={{width:`${(idx/words.length)*100}%`,height:"100%",background:C.green,transition:"width .4s ease"}}/>
      </div>
      {done ? (
        <div style={{textAlign:"center",paddingTop:40}}>
          <div style={{fontSize:72,marginBottom:14}}>🏆</div>
          <div style={{fontSize:52,fontWeight:800,color:C.green}}>{score}/{words.length}</div>
        </div>
      ) : (
        <>
          <div style={{background:"linear-gradient(135deg,#059669,#10B981)",borderRadius:18,padding:"22px 18px",marginBottom:18,textAlign:"center",boxShadow:"0 8px 24px rgba(5,150,105,.25)"}}>
            <div style={{fontSize:42,direction:"rtl",fontWeight:800,color:"white",lineHeight:1.1,marginBottom:6}}>{cur.heb}</div>
            <div style={{color:"rgba(255,255,255,.85)",fontWeight:600,fontSize:16,marginBottom:12}}>{cur.tr}</div>
            <button aria-label={playing?"Parar":"Ouvir pronúncia"} onClick={handlePlay} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.15)",border:"1.5px solid rgba(255,255,255,.3)",borderRadius:10,padding:"8px 16px",color:"white",fontSize:13,fontWeight:600,margin:"0 auto"}}>
              <span>{playing?"⏹":"🔊"}</span> {playing?"Parando...":"Ouvir"}
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            {opts.map(opt => {
              const isCorrect=opt.pt===cur.pt, isSel=opt.pt===sel;
              let bg=C.white, border=C.border, color=C.navy;
              if(sel){ if(isCorrect){bg=C.greenLt;border=C.green;color=C.green;} else if(isSel){bg=C.redLt;border=C.red;color=C.red;} }
              return (
                <button key={opt.pt} className={sel&&isSel&&!isCorrect?"shake opt-btn":"opt-btn"} onClick={() => onAnswer(opt)} disabled={!!sel} style={{padding:"14px 10px",borderRadius:12,fontWeight:700,fontSize:14,border:`1.5px solid ${border}`,background:bg,color,cursor:sel?"default":"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .2s"}}>
                  <span style={{fontSize:28}}>{opt.emoji}</span>{opt.pt}
                </button>
              );
            })}
          </div>
          {sel && (
            <button onClick={onNext} style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueMid})`,color:"white",padding:"15px",borderRadius:12,fontWeight:700,fontSize:14,boxShadow:`0 4px 14px ${C.blue}40`}}>
              {idx < words.length-1 ? "Continuar →" : "Finalizar 🏆"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ── RIDDLE GAME ───────────────────────────────────────────────────────────────
function RiddleGame({ riddles, idx, sel, score, done, combo, onAnswer, onNext }) {
  const r = riddles[idx];
  const [playing, setPlaying] = useState(false);
  useEffect(() => { setPlaying(false); }, [idx]);
  const handlePlay = () => {
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return; }
    setPlaying(true);
    speakHebrew(r.heb, () => setPlaying(false));
  };
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <Pill icon="❓" val={`${score}/${riddles.length}`} color={C.navy} bg={C.blueLt}/>
        {combo>=2 && <Pill icon="🔥" val={`${combo}×`} color={C.orange} bg={C.orangeLt}/>}
      </div>
      <div style={{background:C.grayLt,borderRadius:999,height:6,marginBottom:18,overflow:"hidden"}}>
        <div style={{width:`${(idx/riddles.length)*100}%`,height:"100%",background:C.blue,transition:"width .4s ease"}}/>
      </div>
      {done ? (
        <div style={{textAlign:"center",paddingTop:40}}>
          <div style={{fontSize:64,marginBottom:14}}>{score>=4?"⭐":score>=3?"✅":"📖"}</div>
          <h3 style={{fontSize:26,fontWeight:800,color:C.navy,marginBottom:6}}>{score}/{riddles.length}</h3>
        </div>
      ) : (
        <>
          <div style={{background:`linear-gradient(135deg,${C.blue},${C.blueMid})`,borderRadius:18,padding:"22px 18px",marginBottom:18,textAlign:"center",boxShadow:`0 8px 24px ${C.blue}30`}}>
            <div style={{fontSize:40,marginBottom:10}}>{r.emoji}</div>
            <div style={{fontSize:15,fontWeight:600,color:"white",lineHeight:1.4,marginBottom:12}}>
              {r.pre} <span style={{color:"#FCD34D",fontWeight:800}}>"{r.word}"</span>?
            </div>
            <button aria-label={playing?"Parar":"Ouvir palavra"} onClick={handlePlay} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.12)",border:"1.5px solid rgba(255,255,255,.25)",borderRadius:10,padding:"8px 16px",color:"white",fontSize:13,fontWeight:600,margin:"0 auto"}}>
              <span>{playing?"⏹":"🔊"}</span> {playing?"Parando...":"Ouvir palavra"}
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            {r.opts.map(opt => {
              const isCorrect=opt===r.answer, isSel=opt===sel, isHeb=/[א-ת]/.test(opt);
              let bg=C.white, border=C.border, color=C.navy;
              if(sel){ if(isCorrect){bg:C.orangeLt;border=C.orange;color=C.orange;} else if(isSel){bg=C.redLt;border=C.red;color=C.red;} }
              if(sel&&isCorrect){bg=C.orangeLt;border=C.orange;color=C.orange;}
              return (
                <button key={opt} className={sel&&isSel&&!isCorrect?"shake opt-btn":"opt-btn"} onClick={() => onAnswer(opt)} disabled={!!sel} style={{padding:"14px",borderRadius:12,fontWeight:700,fontSize:isHeb?17:13,direction:isHeb?"rtl":"ltr",border:`1.5px solid ${border}`,background:bg,color,cursor:sel?"default":"pointer",transition:"all .2s"}}>
                  {opt}
                </button>
              );
            })}
          </div>
          {sel && (
            <button onClick={onNext} style={{width:"100%",background:`linear-gradient(135deg,${C.navy},#1F2937)`,color:"white",padding:"15px",borderRadius:12,fontWeight:700,fontSize:14,boxShadow:"0 4px 14px rgba(17,24,39,.3)"}}>
              {idx < riddles.length-1 ? "Próxima →" : "Concluído 🎉"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ── PENALTY GAME ──────────────────────────────────────────────────────────────
function PenaltyGame({ onXp }) {
  const [phase, setPhase]             = useState("intro");
  const [questions]                   = useState(() => shuffle(PENALTY_QUESTIONS).slice(0, TOTAL_KICKS));
  const [qIdx, setQIdx]               = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answeredCorrect, setAnsweredCorrect] = useState(false);
  const [aimPct, setAimPct]           = useState({ x:0.5, y:0.5 });
  const [isDragging, setIsDragging]   = useState(false);
  const goalRef                       = useRef(null);
  const [ballStage, setBallStage]     = useState("idle");
  const [ballSvg, setBallSvg]         = useState({ x:GW2/2, y:GH2+150 });
  const [keeperX, setKeeperX]         = useState(GW2/2);
  const [keeperAnim, setKeeperAnim]   = useState("idle");
  const [shotResult, setShotResult]   = useState(null);
  const [goals, setGoals]     = useState(0);
  const [saves, setSaves]     = useState(0);
  const [history, setHistory] = useState([]);

  const currentQ = questions[qIdx] || questions[0];

  const handleAnswer = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    const correct = opt === currentQ.answer;
    setAnsweredCorrect(correct);
    speakHebrew(currentQ.heb);
    setTimeout(() => setPhase("aim"), 900);
  };

  const getAimFromEvent = useCallback((e, el) => {
    const rect = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pad = 0.06;
    let rx = Math.max(pad, Math.min(1-pad, (clientX-rect.left)/rect.width));
    let ry = Math.max(pad, Math.min(0.92,  (clientY-rect.top)/(rect.height*(GH2/(GH2+150)))));
    setAimPct({ x:rx, y:Math.min(ry,0.95) });
  }, []);

  const onPointerDown = (e) => { if(phase!=="aim") return; setIsDragging(true); getAimFromEvent(e, goalRef.current); };
  const onPointerMove = (e) => { if(!isDragging||phase!=="aim") return; getAimFromEvent(e, goalRef.current); };
  const onPointerUp   = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("pointerup", onPointerUp);
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, []);

  const shoot = () => {
    if(phase!=="aim"||ballStage!=="idle") return;
    setPhase("shooting"); setBallStage("flying");
    const targetX = aimPct.x * GW2;
    const targetY = aimPct.y * GH2;
    const keeperTargetX = answeredCorrect
      ? (Math.random()<0.28 ? targetX : Math.random()*GW2)
      : (Math.random()<0.68 ? targetX : Math.random()*GW2);
    setBallSvg({ x:GW2/2, y:GH2+150 });
    setTimeout(() => { setBallSvg({ x:targetX, y:targetY }); setKeeperX(keeperTargetX); setKeeperAnim("diving"); }, 60);
    setTimeout(() => {
      const isGoal = Math.abs(keeperTargetX - targetX) > 55;
      setShotResult(isGoal?"goal":"saved");
      setKeeperAnim(isGoal?"scored":"saved");
      setBallStage("done");
      if(isGoal){ setGoals(g=>g+1); if(onXp) onXp(5); }
      else setSaves(s=>s+1);
      setHistory(h=>[...h,{goal:isGoal}]);
      setTimeout(()=>{
        if(qIdx+1>=TOTAL_KICKS){ setPhase("end"); }
        else {
          setQIdx(i=>i+1); setSelectedOpt(null); setAnsweredCorrect(false);
          setAimPct({x:.5,y:.5}); setBallSvg({x:GW2/2,y:GH2+150});
          setKeeperX(GW2/2); setKeeperAnim("idle"); setBallStage("idle");
          setShotResult(null); setPhase("question");
        }
      }, 2400);
    }, 750);
  };

  const restart = () => {
    setPhase("intro"); setQIdx(0); setSelectedOpt(null); setAnsweredCorrect(false);
    setAimPct({x:.5,y:.5}); setBallSvg({x:GW2/2,y:GH2+150});
    setKeeperX(GW2/2); setKeeperAnim("idle"); setBallStage("idle");
    setShotResult(null); setGoals(0); setSaves(0); setHistory([]);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(170deg,#0f172a 0%,#1e3a8a 100%)",fontFamily:"'Sora',sans-serif",display:"flex",flexDirection:"column",alignItems:"center"}}>
      {/* Header */}
      <div style={{width:"100%",padding:"20px 22px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:26}}>⚽</span>
          <div>
            <div style={{fontWeight:800,color:"white",fontSize:17}}>Pênaltis Hebraicos</div>
            <div style={{fontWeight:500,color:"rgba(255,255,255,.45)",fontSize:11}}>נָתִיב עִבְרִית</div>
          </div>
        </div>
        {/* Indicadores de chute */}
        <div style={{display:"flex",gap:7}}>
          {Array.from({length:TOTAL_KICKS}).map((_,i) => {
            const h = history[i];
            return (
              <div key={i} style={{width:26,height:26,borderRadius:"50%",border:`2px solid ${h?(h.goal?"#F59E0B":"rgba(255,255,255,.25)"):"rgba(255,255,255,.15)"}`,background:h?(h.goal?"rgba(245,158,11,.2)":"rgba(255,255,255,.08)"):"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,transition:"all .3s ease"}}>
                {h?(h.goal?"⚽":"✕"):""}
              </div>
            );
          })}
        </div>
      </div>

      {phase!=="intro"&&phase!=="end" && (
        <div style={{display:"flex",gap:22,marginBottom:10,alignItems:"center"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:30,fontWeight:800,color:"#F59E0B"}}>{goals}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:600}}>GOLS</div>
          </div>
          <div style={{width:1,height:32,background:"rgba(255,255,255,.12)"}}/>
          <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.6)"}}>Chute {Math.min(qIdx+1,TOTAL_KICKS)}/{TOTAL_KICKS}</div>
          <div style={{width:1,height:32,background:"rgba(255,255,255,.12)"}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:30,fontWeight:800,color:"rgba(255,255,255,.3)"}}>{saves}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:600}}>DEF.</div>
          </div>
        </div>
      )}

      {phase==="intro" && (
        <div className="fadeUp" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px",textAlign:"center",width:"100%"}}>
          <div style={{fontSize:78,marginBottom:14}}>⚽</div>
          <h1 style={{fontSize:27,fontWeight:800,color:"white",lineHeight:1.3,marginBottom:10,letterSpacing:"-.02em"}}>Pênaltis Hebraicos</h1>
          <p style={{color:"rgba(255,255,255,.65)",fontSize:14,lineHeight:1.7,marginBottom:22}}>Responda corretamente para aumentar suas chances de gol</p>
          <div style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",borderRadius:18,padding:"22px",marginBottom:28,width:"100%"}}>
            {[["✅","Resposta correta","Goleiro mais lento"],["❌","Resposta errada","Goleiro mais rápido"],["🎯","Arraste no gol","Mire sua posição"]].map(([ic,t,d]) => (
              <div key={t} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start",textAlign:"left"}}>
                <span style={{fontSize:18,marginTop:2}}>{ic}</span>
                <div>
                  <div style={{fontWeight:700,color:"white",fontSize:13}}>{t}</div>
                  <div style={{color:"rgba(255,255,255,.45)",fontSize:12,marginTop:1}}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setPhase("question")} style={{background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"white",padding:"17px 30px",borderRadius:12,fontWeight:800,fontSize:15,boxShadow:"0 6px 22px rgba(245,158,11,.35)",width:"100%"}}>
            Iniciar ⚽
          </button>
        </div>
      )}

      {phase==="question" && (
        <div className="fadeUp" style={{width:"100%",padding:"10px 22px 0",flex:1}}>
          <div style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",borderRadius:18,padding:"22px",marginBottom:18,textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.4)",marginBottom:10,textTransform:"uppercase",letterSpacing:".07em"}}>Qual é a tradução?</div>
            <div style={{fontSize:46,direction:"rtl",fontWeight:800,color:"white",lineHeight:1.1}}>{currentQ.heb}</div>
            <div style={{color:"#FCD34D",fontWeight:700,fontSize:17,marginTop:7}}>{currentQ.tr}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            {currentQ.opts.map(opt => {
              const isSel=selectedOpt===opt, isCorrect=opt===currentQ.answer;
              let bg="rgba(255,255,255,.07)",border="rgba(255,255,255,.18)",color="white";
              if(selectedOpt){ if(isCorrect){bg="rgba(245,158,11,.22)";border="#F59E0B";color="#FCD34D";} else if(isSel){bg="rgba(239,68,68,.18)";border="#EF4444";color="#FCA5A5";} }
              return (
                <button key={opt} className={selectedOpt&&isSel&&!isCorrect?"shake opt-btn":"opt-btn"} onClick={() => handleAnswer(opt)} disabled={!!selectedOpt} style={{padding:"17px 14px",borderRadius:12,fontWeight:700,fontSize:14,border:`1.5px solid ${border}`,background:bg,color,transition:"all .2s",cursor:selectedOpt?"default":"pointer"}}>
                  {opt}
                </button>
              );
            })}
          </div>
          {selectedOpt && (
            <div style={{marginTop:14,textAlign:"center",padding:"13px 18px",borderRadius:12,background:answeredCorrect?"rgba(245,158,11,.18)":"rgba(239,68,68,.12)",border:`1px solid ${answeredCorrect?"#F59E0B":"#EF4444"}`}}>
              <span style={{fontWeight:700,fontSize:14,color:answeredCorrect?"#FCD34D":"#FCA5A5"}}>
                {answeredCorrect ? "✅ Correto!" : `❌ Era '${currentQ.answer}'`}
              </span>
            </div>
          )}
        </div>
      )}

      {(phase==="aim"||phase==="shooting") && (
        <div className="fadeUp" style={{width:"100%",padding:"10px 18px 0",flex:1,display:"flex",flexDirection:"column"}}>
          {phase==="aim" && (
            <div style={{textAlign:"center",marginBottom:10}}>
              <div style={{fontWeight:700,color:"white",fontSize:14}}>{answeredCorrect?"✅ Goleiro mais lento":"❌ Goleiro alerta!"}</div>
              <div style={{color:"rgba(255,255,255,.5)",fontSize:12}}>{isDragging?"Solte para confirmar mira":"Arraste para mirar e solte"}</div>
            </div>
          )}
          <div ref={goalRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} style={{width:"100%",touchAction:"none",cursor:phase==="aim"?"crosshair":"default",userSelect:"none"}}>
            <svg viewBox={`0 0 ${GW2} ${GH2+160}`} width="100%" style={{display:"block"}}>
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#047857"/><stop offset="100%" stopColor="#065F46"/></linearGradient>
                <linearGradient id="pgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#059669"/><stop offset="100%" stopColor="#10B981"/></linearGradient>
                <filter id="glow2"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="shad2"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.3"/></filter>
              </defs>
              <rect x="0" y={GH2} width={GW2} height="160" fill="url(#pg)"/>
              {[0,1,2,3,4].map(i => <rect key={i} x={i*80} y={GH2} width="40" height="160" fill="url(#pgs)" opacity=".3"/>)}
              <circle cx={GW2/2} cy={GH2+130} r="4" fill="rgba(255,255,255,.5)"/>
              <rect x={GW2*.18} y={GH2} width={GW2*.64} height="24" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/>
              <rect x="12" y="6" width={GW2-24} height={GH2-8} fill="rgba(0,0,0,.15)" rx="2"/>
              {[0,1,2,3,4,5,6,7,8,9].map(i => <line key={`v${i}`} x1={12+i*(GW2-24)/9} y1="6" x2={12+i*(GW2-24)/9} y2={GH2} stroke="rgba(255,255,255,.1)" strokeWidth="1"/>)}
              {[0,1,2,3,4,5,6].map(i => <line key={`h${i}`} x1="12" y1={6+i*(GH2-6)/6} x2={GW2-12} y2={6+i*(GH2-6)/6} stroke="rgba(255,255,255,.1)" strokeWidth="1"/>)}
              <rect x="8" y="2" width={GW2-16} height="6" fill="white" rx="3" filter="url(#shad2)"/>
              <rect x="8" y="2" width="6" height={GH2} fill="white" rx="3" filter="url(#shad2)"/>
              <rect x={GW2-14} y="2" width="6" height={GH2} fill="white" rx="3" filter="url(#shad2)"/>
              {shotResult==="goal" && <rect x="12" y="6" width={GW2-24} height={GH2-8} fill="rgba(245,158,11,.2)" rx="2"><animate attributeName="opacity" values="0;1;0.7;1;0" dur="0.8s" fill="freeze"/></rect>}
              <KeeperSVG x={keeperX} gH={GH2} anim={keeperAnim}/>
              {phase==="aim" && (
                <g>
                  <circle cx={aimPct.x*GW2} cy={aimPct.y*GH2} r="18" fill="rgba(0,0,0,.2)"/>
                  <circle cx={aimPct.x*GW2} cy={aimPct.y*GH2} r="16" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="5 5" opacity=".9"/>
                  <circle cx={aimPct.x*GW2} cy={aimPct.y*GH2} r="5" fill="#F59E0B" filter="url(#glow2)"/>
                </g>
              )}
              <PenaltyBall x={ballSvg.x} y={ballSvg.y} stage={ballStage} shotResult={shotResult}/>
              {shotResult && (
                <g>
                  <rect x="50" y={GH2/2-35} width={GW2-100} height="70" rx="12" fill={shotResult==="goal"?"rgba(245,158,11,.95)":"rgba(30,58,138,.95)"} filter="url(#shad2)"/>
                  <text x={GW2/2} y={GH2/2+4} textAnchor="middle" fill="white" fontSize="24" fontWeight="700" fontFamily="Sora,Inter,sans-serif">{shotResult==="goal"?"⚽ GOL!":"🧤 DEFESA!"}</text>
                  {shotResult==="goal" && <text x={GW2/2} y={GH2/2+26} textAnchor="middle" fill="rgba(255,255,255,.8)" fontSize="13" fontFamily="Sora,Inter,sans-serif" fontWeight="600">שַׁעַר!</text>}
                </g>
              )}
            </svg>
          </div>
          {phase==="aim" && (
            <div style={{padding:"14px 0 22px"}}>
              <button onClick={shoot} style={{width:"100%",background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"white",padding:"17px",borderRadius:12,fontWeight:800,fontSize:15,boxShadow:"0 6px 22px rgba(245,158,11,.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span style={{fontSize:22}}>⚽</span> Chutar!
              </button>
            </div>
          )}
        </div>
      )}

      {phase==="end" && (
        <div className="fadeUp" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px",textAlign:"center",width:"100%"}}>
          <div style={{fontSize:70,marginBottom:14}}>{goals>=4?"🏆":goals>=3?"⭐":goals>=2?"⚽":"📖"}</div>
          <h2 style={{fontSize:25,fontWeight:800,color:"white",marginBottom:7,letterSpacing:"-.02em"}}>{goals>=4?"Excelente!":goals>=3?"Muito bom!":goals>=2?"Bom trabalho":"Continue praticando"}</h2>
          <div style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",borderRadius:18,padding:"22px 26px",marginBottom:26,width:"100%"}}>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.4)",marginBottom:14,textTransform:"uppercase",letterSpacing:".07em"}}>Resultado Final</div>
            <div style={{display:"flex",justifyContent:"center",gap:30,marginBottom:18}}>
              <div><div style={{fontSize:46,fontWeight:800,color:"#F59E0B"}}>{goals}</div><div style={{fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:600}}>GOLS</div></div>
              <div style={{fontSize:34,color:"rgba(255,255,255,.2)",paddingTop:7}}>—</div>
              <div><div style={{fontSize:46,fontWeight:800,color:"rgba(255,255,255,.3)"}}>{saves}</div><div style={{fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:600}}>DEFESAS</div></div>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:8}}>
              {history.map((h,i) => (
                <div key={i} style={{width:38,height:38,borderRadius:9,background:h.goal?"rgba(245,158,11,.22)":"rgba(255,255,255,.08)",border:`1.5px solid ${h.goal?"#F59E0B":"rgba(255,255,255,.18)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                  {h.goal?"⚽":"✕"}
                </div>
              ))}
            </div>
          </div>
          <button onClick={restart} style={{width:"100%",background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"white",padding:"17px",borderRadius:12,fontWeight:800,fontSize:15,boxShadow:"0 6px 22px rgba(245,158,11,.35)"}}>
            Jogar Novamente ⚽
          </button>
        </div>
      )}
    </div>
  );
}

// ── KEEPER SVG ────────────────────────────────────────────────────────────────
function KeeperSVG({ x, gH, anim }) {
  const tiltDeg = (anim==="diving"||anim==="saved") ? (x<200?-25:25) : 0;
  const S = 1.6;
  return (
    <g transform={`translate(${x}, ${gH-8})`}>
      <g transform={`rotate(${tiltDeg})`}>
        <g transform={`scale(${S}) translate(-18, -68)`}>
          <ellipse cx="20" cy="68" rx="16" ry="4" fill="rgba(0,0,0,.25)"/>
          <rect x="10" y="48" width="8" height="20" fill="#F59E0B" rx="3"/>
          <rect x="22" y="48" width="8" height="20" fill="#F59E0B" rx="3"/>
          <rect x="7" y="64" width="12" height="6" fill="#111" rx="2"/>
          <rect x="21" y="64" width="12" height="6" fill="#111" rx="2"/>
          <rect x="6" y="20" width="28" height="32" fill="#1E40AF" rx="6"/>
          <rect x="6" y="28" width="28" height="4" fill="rgba(255,255,255,.2)" rx="2"/>
          <text x="20" y="40" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Sora,Inter">1</text>
          <rect x="-4" y="24" width="12" height="6" fill="#1E40AF" rx="3"/>
          <rect x="32" y="24" width="12" height="6" fill="#1E40AF" rx="3"/>
          <circle cx="1" cy="27" r="6" fill="#FCD34D"/>
          <circle cx="39" cy="27" r="6" fill="#FCD34D"/>
          <rect x="16" y="14" width="8" height="10" fill="#FCD34D" rx="2"/>
          <circle cx="20" cy="10" r="13" fill="#FCD34D"/>
          <ellipse cx="5" cy="10" rx="3" ry="4" fill="#FCD34D"/>
          <ellipse cx="35" cy="10" rx="3" ry="4" fill="#FCD34D"/>
          <ellipse cx="13" cy="9" rx="2.5" ry="3" fill="#fff"/>
          <ellipse cx="27" cy="9" rx="2.5" ry="3" fill="#fff"/>
          <circle cx="13" cy="10" r="1.5" fill="#333"/>
          <circle cx="27" cy="10" r="1.5" fill="#333"/>
          <path d="M 9 6 Q 13 4 17 6" stroke="#444" strokeWidth="1.2" fill="none"/>
          <path d="M 23 6 Q 27 4 31 6" stroke="#444" strokeWidth="1.2" fill="none"/>
          {anim==="saved"
            ? <path d="M 12 17 Q 20 14 28 17" stroke="#444" strokeWidth="1.2" fill="none"/>
            : <path d="M 12 16 Q 20 20 28 16" stroke="#444" strokeWidth="1.2" fill="none"/>}
          <path d="M 6 6 Q 20 0 34 6 L 35 4 Q 20 -1 5 4 Z" fill="#F59E0B"/>
          <path d="M 7 6 Q 20 1 33 6 Q 20 3 7 6 Z" fill="#D97706" opacity=".6"/>
        </g>
      </g>
    </g>
  );
}

// ── PENALTY BALL ──────────────────────────────────────────────────────────────
function PenaltyBall({ x, y, stage, shotResult }) {
  const sc = stage==="flying" ? 0.8 : 1;
  return (
    <g transform={`translate(${x},${y})`}>
      <g transform={`scale(${sc})`}>
        <ellipse cx="0" cy="16" rx="10" ry="3" fill="rgba(0,0,0,.25)"/>
        <circle cx="0" cy="0" r="13" fill="#fff" stroke="#eee" strokeWidth="1"/>
        <circle cx="0" cy="0" r="4.5" fill="#333"/>
        <circle cx="-7" cy="-5" r="4" fill="#333"/>
        <circle cx="7" cy="-5" r="4" fill="#333"/>
        <circle cx="-8" cy="4" r="4" fill="#333"/>
        <circle cx="8" cy="4" r="4" fill="#333"/>
        {shotResult==="goal" && (
          <circle cx="0" cy="0" r="15" fill="none" stroke="#F59E0B" strokeWidth="2.5" opacity=".8">
            <animate attributeName="r" values="13;20;13" dur="0.4s" repeatCount="3"/>
          </circle>
        )}
      </g>
    </g>
  );
}
