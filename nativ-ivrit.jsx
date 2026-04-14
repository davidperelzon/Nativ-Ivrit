import { useState, useEffect, useRef, useCallback } from "react";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  blue:"#1565C0", blueMid:"#1E88E5", blueLt:"#E3F2FD",
  orange:"#FF6D00", orangeMid:"#FF9100", orangeLt:"#FFF3E0",
  navy:"#0D2B6B", white:"#FFFFFF", bg:"#F0F4FF",
  border:"#DCE4F5", gray:"#8896B3", grayLt:"#EEF2FA",
  red:"#F44336", redLt:"#FFEBEE", gold:"#FFB300",
};

// ── DATA ─────────────────────────────────────────────────────────────────────
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
  { heb:"מִשְׁפָּחָה",  tr:"Mishpahá", pt:"Família",     emoji:"👨‍👩‍👧" },
];

const FOOTBALL = [
  { heb:"שַׁעַר",       tr:"Sha'ar",    pt:"Gol",      emoji:"⚽" },
  { heb:"כַּדּוּר",     tr:"Kadúr",     pt:"Bola",     emoji:"🟡" },
  { heb:"שָׂחְקָן",     tr:"Sakhkán",   pt:"Jogador",  emoji:"🧑" },
  { heb:"אִצְטַדְיוֹן", tr:"Ítztadyon", pt:"Estádio",  emoji:"🏟️" },
  { heb:"מְאַמֵּן",     tr:"Me'amén",   pt:"Treinador",emoji:"📋" },
  { heb:"נִצָּחוֹן",    tr:"Nitsakhón", pt:"Vitória",  emoji:"🏆" },
];

const PENALTY_QUESTIONS = [
  { heb:"שָׁלוֹם",      tr:"Shalom",    opts:["Olá / Paz","Obrigado","Por favor","Boa noite"],     answer:"Olá / Paz"  },
  { heb:"תּוֹדָה",       tr:"Todá",      opts:["Com licença","Obrigado/a","Sim","Não"],             answer:"Obrigado/a" },
  { heb:"כֵּן",           tr:"Ken",       opts:["Não","Talvez","Sim","Por favor"],                   answer:"Sim"        },
  { heb:"לֹא",            tr:"Lo",        opts:["Sim","Não","Água","Casa"],                          answer:"Não"        },
  { heb:"מַיִם",         tr:"Máim",     opts:["Pão","Família","Água","Casa"],                      answer:"Água"       },
  { heb:"לֶחֶם",         tr:"Léhem",    opts:["Água","Pão","Leite","Sal"],                         answer:"Pão"        },
  { heb:"בַּיִת",        tr:"Báyit",     opts:["Escola","Casa","Rua","Cidade"],                     answer:"Casa"       },
  { heb:"שַׁעַר",        tr:"Sha'ar",    opts:["Bola","Jogador","Gol","Estádio"],                   answer:"Gol"        },
  { heb:"כַּדּוּר",      tr:"Kadúr",     opts:["Gol","Bola","Time","Árbitro"],                      answer:"Bola"       },
  { heb:"נִצָּחוֹן",     tr:"Nitsakhón", opts:["Derrota","Empate","Vitória","Gol"],                 answer:"Vitória"    },
  { heb:"בֹּקֶר טוֹב",  tr:"Boker Tov", opts:["Boa noite","Bom dia","Boa tarde","Olá"],            answer:"Bom dia"    },
  { heb:"לַיְלָה טוֹב", tr:"Laila Tov", opts:["Bom dia","Boa tarde","Boa noite","Tchau"],          answer:"Boa noite"  },
];

const LEVELS = [
  { id:1, title:"Alef", sub:"Primeiros Passos", icon:"👋", locked:false,
    lessons:[{ id:"1-1",title:"Cumprimentos",icon:"👋",xp:10 },{ id:"1-2",title:"Sim e Não",icon:"✅",xp:10 },{ id:"1-3",title:"Educação",icon:"🙏",xp:15 }]},
  { id:2, title:"Bet",   sub:"Cotidiano",       icon:"🏠", locked:true,
    lessons:[{ id:"2-1",title:"Família",icon:"👨‍👩‍👧",xp:15 },{ id:"2-2",title:"Comida",icon:"🍞",xp:15 },{ id:"2-3",title:"Cores",icon:"🎨",xp:20 }]},
  { id:3, title:"Gimel", sub:"Conversação",     icon:"💬", locked:true,
    lessons:[{ id:"3-1",title:"Perguntas",icon:"❓",xp:20 },{ id:"3-2",title:"Números",icon:"🔢",xp:20 },{ id:"3-3",title:"Dias",icon:"📅",xp:25 }]},
  { id:4, title:"Dalet", sub:"Avançado",        icon:"⭐", locked:true,
    lessons:[{ id:"4-1",title:"Verbos",icon:"🔤",xp:30 },{ id:"4-2",title:"Futebol",icon:"⚽",xp:30 },{ id:"4-3",title:"Cultura",icon:"🇮🇱",xp:35 }]},
];

const CHAT_SEED = [
  { id:1, user:"Yael 🇮🇱",  avatar:"🧕", msg:"Shalom a todos! Alguém quer praticar conversa?", time:"09:12", mine:false },
  { id:2, user:"Carlos 🇧🇷", avatar:"🧑", msg:"Shalom! Estou no nível Bet, posso tentar 😊",   time:"09:14", mine:false },
  { id:3, user:"Ana 🇧🇷",    avatar:"👩", msg:"תּוֹדָה (Todá) pela dica de ontem!",             time:"09:20", mine:false },
  { id:4, user:"Yael 🇮🇱",   avatar:"🧕", msg:"בְּבַקָּשָׁה (Bevakashá)! Vamos praticar 💪",   time:"09:22", mine:false },
];

const GW = 400; const GH = 220; // SVG goal dimensions
const TOTAL_KICKS = 5;
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
function buildFQOpts(idx) {
  const c = FOOTBALL[idx];
  return shuffle([c, ...shuffle(FOOTBALL.filter((_,i)=>i!==idx)).slice(0,3)]);
}

// ═══════════════════════════════════════════════════════════════════════════
export default function NativIvrit() {
  const [tab, setTab]       = useState("home");
  const [screen, setScreen] = useState(null);
  const [xp, setXp]         = useState(120);
  const [streak]            = useState(5);

  // Flashcard
  const [fcIdx, setFcIdx]     = useState(0);
  const [fcFlip, setFcFlip]   = useState(false);
  const [fcKnown, setFcKnown] = useState(new Set());
  const fcNext = (knew) => {
    if (knew) { setFcKnown(s=>new Set(s).add(fcIdx)); setXp(x=>x+3); }
    setFcIdx(i=>(i+1)%WORDS.length); setFcFlip(false);
  };

  // Match
  const [matchWords]  = useState(()=>shuffle(WORDS).slice(0,5));
  const [leftItems]   = useState(()=>shuffle(matchWords.map(w=>({id:w.heb,label:w.heb,sub:w.tr,type:"heb"}))));
  const [rightItems]  = useState(()=>shuffle(matchWords.map(w=>({id:w.heb,label:w.pt,emoji:w.emoji,type:"pt"}))));
  const [mSel,setMSel]   = useState(null);
  const [mDone,setMDone] = useState({});
  const [mWrong,setMWrong] = useState(null);
  const [mScore,setMScore] = useState(0);
  const handleMatch = (item) => {
    if (mDone[item.id]) return;
    if (!mSel) { setMSel(item); return; }
    if (mSel.id===item.id && mSel.type!==item.type) {
      setMDone(d=>({...d,[item.id]:true})); setMScore(s=>s+1); setXp(x=>x+4); setMSel(null);
    } else if (mSel.type===item.type) { setMSel(item); }
    else { setMWrong(item.id); setTimeout(()=>setMWrong(null),500); setMSel(null); }
  };

  // Football quiz
  const [fqIdx,setFqIdx]   = useState(0);
  const [fqOpts,setFqOpts] = useState(()=>buildFQOpts(0));
  const [fqSel,setFqSel]   = useState(null);
  const [fqScore,setFqScore]= useState(0);
  const [fqDone,setFqDone] = useState(false);
  const [fqCombo,setFqCombo]= useState(0);
  const handleFQ = (opt) => {
    if (fqSel) return; setFqSel(opt.pt);
    if (opt.pt===FOOTBALL[fqIdx].pt) { setFqScore(s=>s+1); setFqCombo(c=>c+1); setXp(x=>x+5); } else setFqCombo(0);
  };
  const nextFQ = () => {
    if (fqIdx<FOOTBALL.length-1) { const ni=fqIdx+1; setFqIdx(ni); setFqOpts(buildFQOpts(ni)); setFqSel(null); }
    else setFqDone(true);
  };

  // Riddle
  const RIDDLES = [
    { pre:"Como você diz", word:"Olá / Paz",  opts:["שָׁלוֹם (Shalom)","תּוֹדָה (Todá)","כֵּן (Ken)","לֹא (Lo)"],                   answer:"שָׁלוֹם (Shalom)", emoji:"👋" },
    { pre:"Como você diz", word:"Obrigado/a", opts:["בְּבַקָּשָׁה (Bevakashá)","מַיִם (Máyim)","תּוֹדָה (Todá)","שָׁלוֹם (Shalom)"],answer:"תּוֹדָה (Todá)",    emoji:"🙏" },
    { pre:"Como você diz", word:"Água",       opts:["לֶחֶם (Lékhem)","מַיִם (Máyim)","בַּיִת (Báyit)","כֵּן (Ken)"],                 answer:"מַיִם (Máyim)",     emoji:"💧" },
    { pre:"Como você diz", word:"Gol!",       opts:["כַּדּוּר (Kadúr)","שָׂחְקָן (Sakhkán)","שַׁעַר (Sha'ar)","נִצָּחוֹן (Nitsakhón)"],answer:"שַׁעַר (Sha'ar)", emoji:"⚽" },
    { pre:"Como você diz", word:"Vitória",    opts:["שַׁעַר (Sha'ar)","נִצָּחוֹן (Nitsakhón)","מְאַמֵּן (Me'amén)","כַּדּוּר (Kadúr)"],answer:"נִצָּחוֹן (Nitsakhón)",emoji:"🏆" },
  ];
  const [rdIdx,setRdIdx]   = useState(0);
  const [rdSel,setRdSel]   = useState(null);
  const [rdScore,setRdScore]= useState(0);
  const [rdDone,setRdDone] = useState(false);
  const [rdCombo,setRdCombo]= useState(0);
  const handleRiddle = (opt) => {
    if (rdSel) return; setRdSel(opt);
    if (opt===RIDDLES[rdIdx].answer) { setRdScore(s=>s+1); setRdCombo(c=>c+1); setXp(x=>x+5); } else setRdCombo(0);
  };
  const nextRiddle = () => {
    if (rdIdx<RIDDLES.length-1) { setRdIdx(i=>i+1); setRdSel(null); } else setRdDone(true);
  };

  // Chat
  const [messages,setMessages] = useState(CHAT_SEED);
  const [chatInput,setChatInput] = useState("");
  const chatRef = useRef(null);
  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[messages]);
  const sendMsg = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    setMessages(m=>[...m,{ id:Date.now(), user:"Você 🇧🇷", avatar:"😊", msg:chatInput.trim(), time:now, mine:true }]);
    setChatInput("");
    setTimeout(()=>{
      const replies = ["תּוֹדָה (Todá)! 😊","Shalom! Que legal!","בְּבַקָּשָׁה! Vamos praticar?","Ótimo progresso! 💪","Boker Tov! ☀️"];
      const now2 = new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
      setMessages(m=>[...m,{ id:Date.now()+1, user:"Yael 🇮🇱", avatar:"🧕", msg:replies[Math.floor(Math.random()*replies.length)], time:now2, mine:false }]);
    },900);
  };

  const goGame = (g) => setScreen(g);
  const closeGame = () => setScreen(null);

  const TABS = [
    { id:"home",  icon:"🏠", label:"Início"   },
    { id:"learn", icon:"📚", label:"Aprender" },
    { id:"games", icon:"🎮", label:"Jogos"    },
    { id:"chat",  icon:"💬", label:"Chat"     },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Nunito','Segoe UI',sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        button{cursor:pointer;border:none;font-family:'Nunito',sans-serif;transition:all .15s}
        button:active{transform:scale(.96)}
        input{font-family:'Nunito',sans-serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%{transform:scale(.82);opacity:0}65%{transform:scale(1.07)}100%{transform:scale(1);opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
        @keyframes wiggle{0%,100%{transform:rotate(0)}30%{transform:rotate(-13deg)}70%{transform:rotate(13deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes confetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(240px) rotate(540deg);opacity:0}}
        @keyframes pulseGreen{0%,100%{box-shadow:0 0 0 0 #4CAF5066}50%{box-shadow:0 0 0 8px #4CAF5000}}
        .fadeUp{animation:fadeUp .35s ease forwards}
        .pop{animation:pop .35s ease forwards}
        .shake{animation:shake .35s ease}
        .wiggle{animation:wiggle .5s ease}
        .slideIn{animation:slideIn .28s ease forwards}
        .flip-wrap{perspective:900px}
        .flip-inner{width:100%;height:100%;transition:transform .5s cubic-bezier(.4,2,.55,1);transform-style:preserve-3d;position:relative}
        .flip-inner.on{transform:rotateY(180deg)}
        .flip-face{position:absolute;width:100%;height:100%;backface-visibility:hidden;border-radius:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px}
        .flip-back{transform:rotateY(180deg)}
        ::-webkit-scrollbar{width:0}
        input:focus{outline:none}
      `}</style>

      {/* TOP BAR */}
      <div style={{ background:C.white, borderBottom:`2px solid ${C.border}`, padding:"10px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:200 }}>
        {screen ? (
          <button onClick={closeGame} style={{ background:C.grayLt, color:C.gray, padding:"7px 14px", borderRadius:10, fontWeight:800, fontSize:13 }}>← Voltar</button>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:36, height:36, background:`linear-gradient(135deg,${C.blue},${C.blueMid})`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📖</div>
            <div style={{ lineHeight:1 }}>
              <span style={{ fontWeight:900, color:C.blue, fontSize:15 }}>Nativ </span>
              <span style={{ fontWeight:900, color:C.orange, fontSize:15 }}>Ivrit</span>
            </div>
          </div>
        )}
        <div style={{ display:"flex", gap:8 }}>
          <Pill icon="🔥" val={streak} color={C.orange} bg={C.orangeLt}/>
          <Pill icon="⚡" val={`${xp} XP`} color={C.blue} bg={C.blueLt}/>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom: screen ? 0 : 72 }}>
        {screen==="fc"       && <FlashcardGame deck={WORDS} idx={fcIdx} flip={fcFlip} known={fcKnown} setFlip={setFcFlip} next={fcNext}/>}
        {screen==="match"    && <MatchGame left={leftItems} right={rightItems} sel={mSel} done={mDone} wrong={mWrong} score={mScore} allDone={Object.keys(mDone).length===matchWords.length} onSelect={handleMatch}/>}
        {screen==="football" && <FootballQuiz words={FOOTBALL} idx={fqIdx} opts={fqOpts} sel={fqSel} score={fqScore} done={fqDone} combo={fqCombo} onAnswer={handleFQ} onNext={nextFQ}/>}
        {screen==="riddle"   && <RiddleGame riddles={RIDDLES} idx={rdIdx} sel={rdSel} score={rdScore} done={rdDone} combo={rdCombo} onAnswer={handleRiddle} onNext={nextRiddle}/>}
        {screen==="penalty"  && <PenaltyGame onXp={(n)=>setXp(x=>x+n)}/>}

        {!screen && tab==="home"  && <HomeTab xp={xp} setTab={setTab} goGame={goGame}/>}
        {!screen && tab==="learn" && <LearnTab levels={LEVELS} xp={xp} goGame={goGame}/>}
        {!screen && tab==="games" && <GamesTab goGame={goGame}/>}
        {!screen && tab==="chat"  && <ChatTab messages={messages} input={chatInput} setInput={setChatInput} onSend={sendMsg} chatRef={chatRef}/>}
      </div>

      {/* BOTTOM NAV */}
      {!screen && (
        <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:C.white, borderTop:`2px solid ${C.border}`, display:"flex", zIndex:200 }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, background:"none", padding:"8px 0 10px", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
              <div style={{ fontSize:22, transform:tab===t.id?"scale(1.18)":"scale(1)", transition:"transform .2s" }}>{t.icon}</div>
              <div style={{ fontSize:10, fontWeight:800, color:tab===t.id?C.blue:C.gray }}>{t.label}</div>
              {tab===t.id && <div style={{ width:18, height:3, background:`linear-gradient(90deg,${C.blue},${C.orange})`, borderRadius:2 }}/>}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

// ── PILL ─────────────────────────────────────────────────────────────────────
function Pill({icon,val,color,bg}){
  return <div style={{ display:"flex", alignItems:"center", gap:4, background:bg, borderRadius:20, padding:"5px 11px" }}><span style={{fontSize:14}}>{icon}</span><span style={{fontWeight:800,color,fontSize:13}}>{val}</span></div>;
}

// ── HOME ─────────────────────────────────────────────────────────────────────
function HomeTab({xp,setTab,goGame}){
  return (
    <div className="fadeUp" style={{padding:"20px 18px"}}>
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.blue} 55%,${C.blueMid} 100%)`, borderRadius:24, padding:"26px 22px 22px", marginBottom:20, position:"relative", overflow:"hidden", boxShadow:`0 8px 0 #0a1e52` }}>
        <div style={{ position:"absolute",top:-40,right:-40,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,.06)" }}/>
        <div style={{ position:"absolute",bottom:-16,right:14,fontSize:60,opacity:.1 }}>🇮🇱</div>
        <div style={{ fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:6 }}>נָתִיב עִבְרִית</div>
        <h1 style={{ fontSize:23,fontWeight:900,color:"#fff",lineHeight:1.3,marginBottom:12 }}>Bem-vindo de volta!<br/><span style={{color:C.orangeMid}}>Continue aprendendo 🚀</span></h1>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
          <span style={{fontSize:12,color:"rgba(255,255,255,.6)",fontWeight:700}}>Nível Alef → Bet</span>
          <span style={{fontSize:12,color:C.orangeMid,fontWeight:900}}>{xp}/200 XP</span>
        </div>
        <div style={{ background:"rgba(255,255,255,.18)",borderRadius:8,height:10,overflow:"hidden" }}>
          <div style={{ width:`${Math.min((xp/200)*100,100)}%`,height:"100%",background:`linear-gradient(90deg,${C.orange},${C.orangeMid})`,borderRadius:8,transition:"width .6s" }}/>
        </div>
      </div>
      <div style={{ background:C.white,borderRadius:20,padding:"18px",marginBottom:18,border:`2px solid ${C.border}`,textAlign:"center" }}>
        <div style={{ fontSize:11,fontWeight:800,color:C.gray,letterSpacing:2,textTransform:"uppercase",marginBottom:10 }}>✨ Frase do Dia</div>
        <div style={{ fontSize:32,direction:"rtl",fontWeight:900,color:C.blue,marginBottom:2 }}>מַה שְׁלוֹמְךָ?</div>
        <div style={{ color:C.orange,fontWeight:800,fontSize:16 }}>Ma Shlomkhá?</div>
        <div style={{ color:C.gray,fontSize:13 }}>Como vai você?</div>
      </div>
      <div style={{ fontSize:12,fontWeight:800,color:C.gray,letterSpacing:1,textTransform:"uppercase",marginBottom:12 }}>Jogue Agora</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        {[
          { id:"fc",      icon:"🃏", label:"Flashcards",   color:C.blue,    shadow:"#0d47a1" },
          { id:"match",   icon:"🔗", label:"Liga Palavras", color:C.orange,  shadow:"#cc5500" },
          { id:"riddle",  icon:"🧩", label:"Quiz",          color:C.navy,    shadow:"#060e2e" },
          { id:"penalty", icon:"⚽", label:"Pênalti!",      color:"#1B5E20", shadow:"#0a2d0e" },
        ].map(g=>(
          <button key={g.id} onClick={()=>goGame(g.id)} style={{ background:g.color,borderRadius:20,padding:"20px 14px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,boxShadow:`0 6px 0 ${g.shadow}` }}>
            <div style={{fontSize:34}}>{g.icon}</div>
            <div style={{fontSize:13,fontWeight:900,color:"#fff"}}>{g.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── LEARN ─────────────────────────────────────────────────────────────────────
function LearnTab({levels,xp,goGame}){
  return (
    <div className="fadeUp" style={{padding:"20px 18px"}}>
      <h2 style={{fontSize:21,fontWeight:900,color:C.blue,marginBottom:4}}>Trilha de Aprendizado</h2>
      <p style={{fontSize:13,color:C.gray,marginBottom:18}}>Complete lições para desbloquear novos níveis</p>
      <div style={{background:C.white,borderRadius:16,padding:"14px 16px",marginBottom:22,border:`2px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontWeight:800,fontSize:13,color:"#444"}}>Progresso: Alef</span>
          <span style={{fontWeight:900,fontSize:13,color:C.orange}}>{xp} / 200 XP</span>
        </div>
        <div style={{background:C.grayLt,borderRadius:8,height:10,overflow:"hidden"}}>
          <div style={{width:`${Math.min((xp/200)*100,100)}%`,height:"100%",background:`linear-gradient(90deg,${C.orange},${C.orangeMid})`,borderRadius:8,transition:"width .5s"}}/>
        </div>
      </div>
      {levels.map(lvl=>(
        <div key={lvl.id} style={{marginBottom:18}}>
          <div style={{background:lvl.locked?C.grayLt:`linear-gradient(135deg,${C.blue},${C.blueMid})`,borderRadius:18,padding:"14px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:14,boxShadow:lvl.locked?"none":`0 5px 0 #0d47a1`}}>
            <div style={{fontSize:28,opacity:lvl.locked?.4:1}}>{lvl.locked?"🔒":lvl.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:16,color:lvl.locked?C.gray:"#fff"}}>Unidade {lvl.id}: {lvl.title}</div>
              <div style={{fontSize:12,fontWeight:700,color:lvl.locked?C.gray:"rgba(255,255,255,.7)"}}>{lvl.sub}</div>
            </div>
            {!lvl.locked && <div style={{background:"rgba(255,255,255,.2)",borderRadius:10,padding:"4px 10px",color:"#fff",fontWeight:800,fontSize:12}}>Ativo ✓</div>}
          </div>
          {!lvl.locked && lvl.lessons.map(les=>(
            <button key={les.id} onClick={()=>goGame("fc")} style={{width:"100%",background:C.white,border:`2px solid ${C.border}`,borderRadius:14,padding:"13px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:14,boxShadow:`0 3px 0 ${C.border}`}}>
              <div style={{width:42,height:42,borderRadius:13,background:C.blueLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{les.icon}</div>
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontWeight:800,fontSize:14,color:"#222"}}>{les.title}</div>
                <div style={{fontSize:11,color:C.gray}}>+{les.xp} XP</div>
              </div>
              <div style={{background:`linear-gradient(135deg,${C.orange},${C.orangeMid})`,borderRadius:10,padding:"5px 12px",color:"#fff",fontWeight:900,fontSize:12,boxShadow:`0 3px 0 #cc5500`}}>Jogar ▶</div>
            </button>
          ))}
          {lvl.locked && <div style={{background:C.grayLt,border:`2px dashed ${C.border}`,borderRadius:14,padding:"14px",textAlign:"center",marginBottom:8}}><span style={{color:C.gray,fontSize:13,fontWeight:700}}>🔒 Complete o nível anterior para desbloquear</span></div>}
        </div>
      ))}
    </div>
  );
}

// ── GAMES MENU ────────────────────────────────────────────────────────────────
function GamesTab({goGame}){
  const games=[
    { id:"fc",      icon:"🃏", title:"Flashcards",      desc:"Memorize com cartas animadas",    color:C.blue,    shadow:"#0d47a1", xp:"+3 XP/carta"  },
    { id:"match",   icon:"🔗", title:"Liga as Palavras", desc:"Conecte hebraico e português",    color:C.orange,  shadow:"#cc5500", xp:"+4 XP/par"    },
    { id:"riddle",  icon:"🧩", title:"Quiz Rápido",      desc:"Múltipla escolha com combo 🔥",   color:C.navy,    shadow:"#060e2e", xp:"+5 XP/acerto" },
    { id:"penalty", icon:"⚽", title:"Pênalti Hebraico", desc:"Responda e faça gol no goleiro!", color:"#1B5E20", shadow:"#0a2d0e", xp:"+5 XP/gol"    },
    { id:"football",icon:"🏟️", title:"Quiz de Futebol",  desc:"Vocabulário do esporte favorito", color:"#0D47A1", shadow:"#082a6e", xp:"+5 XP/acerto" },
  ];
  return (
    <div className="fadeUp" style={{padding:"20px 18px"}}>
      <h2 style={{fontSize:21,fontWeight:900,color:C.blue,marginBottom:4}}>Jogos</h2>
      <p style={{fontSize:13,color:C.gray,marginBottom:18}}>Ganhe XP e suba de nível jogando</p>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {games.map((g,i)=>(
          <button key={g.id} onClick={()=>goGame(g.id)} className="pop" style={{animationDelay:`${i*.07}s`,opacity:0,animationFillMode:"forwards",background:g.color,borderRadius:22,padding:"18px 20px",display:"flex",alignItems:"center",gap:18,boxShadow:`0 6px 0 ${g.shadow}`,textAlign:"left"}}>
            <div style={{width:62,height:62,borderRadius:18,background:"rgba(255,255,255,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0}}>{g.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:17,color:"#fff",marginBottom:3}}>{g.title}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.7)"}}>{g.desc}</div>
            </div>
            <div style={{background:"rgba(255,255,255,.18)",borderRadius:12,padding:"5px 11px",color:"#fff",fontWeight:900,fontSize:12,flexShrink:0}}>{g.xp}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── CHAT ──────────────────────────────────────────────────────────────────────
function ChatTab({messages,input,setInput,onSend,chatRef}){
  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
      <div style={{padding:"14px 18px 10px",borderBottom:`2px solid ${C.border}`,background:C.white}}>
        <h2 style={{fontSize:18,fontWeight:900,color:C.blue}}>💬 Comunidade</h2>
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#4CAF50",animation:"pulseGreen 2s infinite"}}/>
          <span style={{fontSize:12,color:C.gray,fontWeight:700}}>67 alunos online agora</span>
        </div>
      </div>
      <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:11,background:C.bg}}>
        {messages.map((m,i)=>(
          <div key={m.id} className="slideIn" style={{animationDelay:`${i*.04}s`,display:"flex",flexDirection:m.mine?"row-reverse":"row",alignItems:"flex-end",gap:8}}>
            {!m.mine && <div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,${C.blue},${C.blueMid})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{m.avatar}</div>}
            <div style={{maxWidth:"75%"}}>
              {!m.mine && <div style={{fontSize:11,fontWeight:800,color:C.gray,marginBottom:3}}>{m.user}</div>}
              <div style={{background:m.mine?`linear-gradient(135deg,${C.orange},${C.orangeMid})`:C.white,borderRadius:m.mine?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"11px 14px",boxShadow:m.mine?`0 3px 0 #cc5500`:`0 3px 0 ${C.border}`,border:m.mine?"none":`2px solid ${C.border}`}}>
                <div style={{fontSize:14,fontWeight:700,color:m.mine?"#fff":"#222",lineHeight:1.5}}>{m.msg}</div>
              </div>
              <div style={{fontSize:10,color:C.gray,marginTop:3,textAlign:m.mine?"right":"left",fontWeight:600}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"10px 14px 14px",background:C.white,borderTop:`2px solid ${C.border}`,display:"flex",gap:10}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSend()} placeholder="Escreva uma mensagem..." style={{flex:1,background:C.grayLt,border:`2px solid ${C.border}`,borderRadius:14,padding:"11px 14px",fontSize:14,color:"#222",fontWeight:600}}/>
        <button onClick={onSend} disabled={!input.trim()} style={{background:input.trim()?`linear-gradient(135deg,${C.orange},${C.orangeMid})`:C.grayLt,borderRadius:14,width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:input.trim()?`0 4px 0 #cc5500`:"none",flexShrink:0,color:input.trim()?"#fff":C.gray}}>➤</button>
      </div>
    </div>
  );
}

// ── FLASHCARD GAME ────────────────────────────────────────────────────────────
function FlashcardGame({deck,idx,flip,known,setFlip,next}){
  const card=deck[idx];
  return (
    <div className="fadeUp" style={{padding:"20px 18px"}}>
      <div style={{background:C.grayLt,borderRadius:8,height:10,marginBottom:18,overflow:"hidden"}}>
        <div style={{width:`${((idx+1)/deck.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.blue},${C.orange})`,transition:"width .4s"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,alignItems:"center"}}>
        <span style={{fontSize:13,color:C.gray,fontWeight:700}}>Carta {idx+1}/{deck.length}</span>
        <Pill icon="✅" val={`${known.size} conhecidas`} color={C.orange} bg={C.orangeLt}/>
      </div>
      <div className="flip-wrap" style={{height:270,marginBottom:22,cursor:"pointer"}} onClick={()=>setFlip(f=>!f)}>
        <div className={`flip-inner ${flip?"on":""}`} style={{height:270}}>
          <div className="flip-face" style={{background:`linear-gradient(150deg,${C.navy},${C.blue})`,boxShadow:`0 10px 0 #0a1e52`}}>
            <div style={{fontSize:13,color:"rgba(255,255,255,.4)",fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>{card.emoji} hebraico</div>
            <div style={{fontSize:52,direction:"rtl",fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.1}}>{card.heb}</div>
            <div style={{marginTop:10,color:C.orangeMid,fontWeight:800,fontSize:20}}>{card.tr}</div>
            <div style={{marginTop:28,fontSize:12,color:"rgba(255,255,255,.3)"}}>toque para traduzir ↻</div>
          </div>
          <div className="flip-face flip-back" style={{background:`linear-gradient(150deg,${C.orange},${C.orangeMid})`,boxShadow:`0 10px 0 #cc5500`}}>
            <div style={{fontSize:13,color:"rgba(255,255,255,.5)",fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>tradução</div>
            <div style={{fontSize:32,fontWeight:900,color:"#fff",textAlign:"center",marginBottom:8}}>{card.pt}</div>
            <div style={{fontSize:28,direction:"rtl",color:"rgba(255,255,255,.85)",fontWeight:800}}>{card.heb}</div>
            <div style={{color:"rgba(255,255,255,.7)",fontWeight:700,fontSize:18,marginTop:4}}>{card.tr}</div>
          </div>
        </div>
      </div>
      {flip ? (
        <div className="fadeUp" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <button onClick={()=>next(false)} style={{background:C.white,border:`2.5px solid ${C.red}`,color:C.red,padding:"15px",borderRadius:16,fontWeight:900,fontSize:15,boxShadow:`0 4px 0 #b71c1c`}}>😅 Rever</button>
          <button onClick={()=>next(true)}  style={{background:`linear-gradient(135deg,${C.orange},${C.orangeMid})`,color:"#fff",padding:"15px",borderRadius:16,fontWeight:900,fontSize:15,boxShadow:`0 4px 0 #cc5500`}}>✅ Sei!</button>
        </div>
      ) : (
        <div style={{textAlign:"center",color:C.gray,fontSize:14,fontWeight:700,background:C.white,borderRadius:14,padding:"14px",border:`2px solid ${C.border}`}}>🤔 Pense na tradução antes de virar a carta</div>
      )}
    </div>
  );
}

// ── MATCH GAME ────────────────────────────────────────────────────────────────
function MatchGame({left,right,sel,done,wrong,score,allDone,onSelect}){
  return (
    <div className="fadeUp" style={{padding:"20px 18px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <h2 style={{fontSize:20,fontWeight:900,color:C.orange}}>🔗 Liga as Palavras</h2>
        <Pill icon="⭐" val={`${score}/${left.length}`} color={C.orange} bg={C.orangeLt}/>
      </div>
      <p style={{fontSize:13,color:C.gray,marginBottom:18}}>Selecione um par de cada lado</p>
      {allDone ? (
        <div style={{textAlign:"center",paddingTop:50}}>
          <div className="wiggle" style={{fontSize:80,display:"inline-block",marginBottom:14}}>🎉</div>
          <h3 style={{fontSize:26,fontWeight:900,color:C.orange,marginBottom:8}}>Perfeito!</h3>
          <p style={{color:C.gray}}>Todos os pares conectados!</p>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:C.gray,textTransform:"uppercase",letterSpacing:1,marginBottom:8,textAlign:"center"}}>עברית</div>
            {left.map(item=>{
              const matched=done[item.id],isSel=sel?.id===item.id&&sel?.type==="heb",isWrong=wrong===item.id;
              return <button key={item.id} className={isWrong?"shake":matched?"pop":""} onClick={()=>!matched&&onSelect({...item,type:"heb"})} style={{width:"100%",marginBottom:8,padding:"13px 10px",borderRadius:14,border:`2.5px solid ${matched?C.orange:isSel?C.blue:C.border}`,background:matched?C.orangeLt:isSel?C.blueLt:C.white,color:matched?C.orange:isSel?C.blue:"#222",fontSize:19,direction:"rtl",fontWeight:900,boxShadow:`0 3px 0 ${matched?"#cc5500":isSel?"#0d47a1":C.border}`,cursor:matched?"default":"pointer"}}>
                {item.label}<div style={{fontSize:10,color:matched?C.orange:isSel?C.blue:C.gray,direction:"ltr",fontWeight:700,marginTop:2}}>{item.sub}</div>
              </button>;
            })}
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:C.gray,textTransform:"uppercase",letterSpacing:1,marginBottom:8,textAlign:"center"}}>Português</div>
            {right.map(item=>{
              const matched=done[item.id],isSel=sel?.id===item.id&&sel?.type==="pt",isWrong=wrong===item.id;
              return <button key={item.id} className={isWrong?"shake":matched?"pop":""} onClick={()=>!matched&&onSelect({...item,type:"pt"})} style={{width:"100%",marginBottom:8,padding:"13px 10px",borderRadius:14,border:`2.5px solid ${matched?C.orange:isSel?C.orange:C.border}`,background:matched?C.orangeLt:isSel?C.orangeLt:C.white,color:matched?C.orange:isSel?C.orange:"#222",fontSize:14,fontWeight:800,boxShadow:`0 3px 0 ${matched?"#cc5500":isSel?"#cc5500":C.border}`,cursor:matched?"default":"pointer"}}>
                <span style={{fontSize:20}}>{item.emoji} </span>{item.label}
              </button>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── FOOTBALL QUIZ ─────────────────────────────────────────────────────────────
function FootballQuiz({words,idx,opts,sel,score,done,combo,onAnswer,onNext}){
  const cur=words[idx];
  return (
    <div className="fadeUp" style={{padding:"20px 18px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <Pill icon="⚽" val={`${score}/${words.length}`} color="#1B5E20" bg="#E8F5E9"/>
        {combo>=2 && <Pill icon="🔥" val={`${combo}x combo!`} color={C.orange} bg={C.orangeLt}/>}
      </div>
      <div style={{background:C.grayLt,borderRadius:8,height:8,marginBottom:18,overflow:"hidden"}}>
        <div style={{width:`${(idx/words.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#2E7D32,#66BB6A)",transition:"width .4s"}}/>
      </div>
      {done ? (
        <div style={{textAlign:"center",paddingTop:40}}>
          <div className="wiggle" style={{fontSize:80,display:"inline-block",marginBottom:16}}>🏟️</div>
          <div style={{background:"linear-gradient(135deg,#1B5E20,#2E7D32)",borderRadius:24,padding:"28px",marginBottom:24,boxShadow:"0 8px 0 #0a2d0e"}}>
            <div style={{fontSize:54,fontWeight:900,color:"#fff"}}>{score}<span style={{color:"rgba(255,255,255,.35)",fontSize:30}}>/{words.length}</span></div>
          </div>
        </div>
      ) : (
        <>
          <div style={{background:"linear-gradient(135deg,#1B5E20,#2E7D32)",borderRadius:24,padding:"26px 20px",marginBottom:18,textAlign:"center",boxShadow:"0 8px 0 #0a2d0e"}}>
            <div style={{fontSize:50,direction:"rtl",fontWeight:900,color:"#fff",lineHeight:1.1}}>{cur.heb}</div>
            <div style={{color:"#A5D6A7",fontWeight:800,fontSize:20,marginTop:6}}>{cur.tr}</div>
            <div style={{marginTop:6,fontSize:30}}>{cur.emoji}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {opts.map(opt=>{
              const isCorrect=opt.pt===cur.pt,isSel=opt.pt===sel;
              let bg=C.white,border=C.border,color="#222",shadow=C.border;
              if(sel){ if(isCorrect){bg="#E8F5E9";border="#2E7D32";color="#1B5E20";shadow="#0a2d0e55";}else if(isSel){bg=C.redLt;border=C.red;color=C.red;shadow="#b71c1c55";} }
              return <button key={opt.pt} className={sel&&isSel&&!isCorrect?"shake":""} onClick={()=>onAnswer(opt)} style={{padding:"16px 12px",borderRadius:16,fontWeight:800,fontSize:15,border:`2.5px solid ${border}`,background:bg,color,boxShadow:`0 4px 0 ${shadow}`,display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:sel?"default":"pointer"}}><span style={{fontSize:28}}>{opt.emoji}</span>{opt.pt}</button>;
            })}
          </div>
          {sel && <button className="pop" onClick={onNext} style={{width:"100%",background:`linear-gradient(135deg,${C.orange},${C.orangeMid})`,color:"#fff",padding:"16px",borderRadius:16,fontWeight:900,fontSize:16,boxShadow:`0 5px 0 #cc5500`}}>{idx<words.length-1?"Próxima ⚽":"Ver Placar 🏟️"}</button>}
        </>
      )}
    </div>
  );
}

// ── RIDDLE QUIZ ────────────────────────────────────────────────────────────────
function RiddleGame({riddles,idx,sel,score,done,combo,onAnswer,onNext}){
  const r=riddles[idx];
  return (
    <div className="fadeUp" style={{padding:"20px 18px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <Pill icon="🧩" val={`${score}/${riddles.length}`} color={C.navy} bg={C.blueLt}/>
        {combo>=2 && <Pill icon="🔥" val={`${combo}x combo!`} color={C.orange} bg={C.orangeLt}/>}
      </div>
      <div style={{background:C.grayLt,borderRadius:8,height:8,marginBottom:18,overflow:"hidden"}}>
        <div style={{width:`${(idx/riddles.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.blue},${C.orange})`,transition:"width .4s"}}/>
      </div>
      {done ? (
        <div style={{textAlign:"center",paddingTop:40}}>
          <div className="wiggle" style={{fontSize:80,display:"inline-block",marginBottom:14}}>{score>=4?"🏆":score>=2?"😊":"📚"}</div>
          <h3 style={{fontSize:28,fontWeight:900,color:C.blue,marginBottom:6}}>{score}/{riddles.length} pontos</h3>
        </div>
      ) : (
        <>
          <div style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`,borderRadius:22,padding:"22px 20px",marginBottom:18,textAlign:"center",boxShadow:`0 8px 0 #0a1e52`}}>
            <div style={{fontSize:42,marginBottom:10}}>{r.emoji}</div>
            <div style={{fontSize:17,fontWeight:800,color:"#fff",lineHeight:1.5}}>{r.pre} <span style={{color:C.orangeMid}}>"{r.word}"</span> em hebraico?</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {r.opts.map(opt=>{
              const isCorrect=opt===r.answer,isSel=opt===sel,isHeb=/[א-ת]/.test(opt);
              let bg=C.white,border=C.border,color="#222",shadow=C.border;
              if(sel){ if(isCorrect){bg=C.orangeLt;border=C.orange;color=C.orange;shadow="#cc550055";}else if(isSel){bg=C.redLt;border=C.red;color=C.red;shadow="#b71c1c55";} }
              return <button key={opt} className={sel&&isSel&&!isCorrect?"shake":""} onClick={()=>onAnswer(opt)} style={{padding:"14px 10px",borderRadius:16,fontWeight:800,fontSize:isHeb?17:13,direction:isHeb?"rtl":"ltr",border:`2.5px solid ${border}`,background:bg,color,boxShadow:`0 4px 0 ${shadow}`,lineHeight:1.4,cursor:sel?"default":"pointer"}}>{opt}</button>;
            })}
          </div>
          {sel && <button className="pop" onClick={onNext} style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueMid})`,color:"#fff",padding:"16px",borderRadius:16,fontWeight:900,fontSize:16,boxShadow:`0 5px 0 #0d47a1`}}>{idx<riddles.length-1?"Próxima →":"Ver Resultado 🎯"}</button>}
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ── PENALTY GAME ─────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════
function PenaltyGame({ onXp }) {
  const [phase, setPhase]             = useState("intro");
  const [questions]                   = useState(() => shuffle(PENALTY_QUESTIONS).slice(0, TOTAL_KICKS));
  const [qIdx, setQIdx]               = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answeredCorrect, setAnsweredCorrect] = useState(false);

  const [aimPct, setAimPct]           = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging]   = useState(false);
  const goalRef                       = useRef(null);

  const [ballStage, setBallStage]     = useState("idle");
  const [ballSvg, setBallSvg]         = useState({ x: GW/2, y: GH + 150 });
  const [keeperX, setKeeperX]         = useState(GW / 2);
  const [keeperAnim, setKeeperAnim]   = useState("idle");
  const [shotResult, setShotResult]   = useState(null);

  const [goals, setGoals]   = useState(0);
  const [saves, setSaves]   = useState(0);
  const [history, setHistory] = useState([]);

  const currentQ = questions[qIdx] || questions[0];

  const handleAnswer = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    const correct = opt === currentQ.answer;
    setAnsweredCorrect(correct);
    setTimeout(() => setPhase("aim"), 900);
  };

  const getAimFromEvent = useCallback((e, el) => {
    const rect = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pad = 0.06;
    let rx = Math.max(pad, Math.min(1-pad, (clientX - rect.left) / rect.width));
    let ry = Math.max(pad, Math.min(0.92,  (clientY - rect.top)  / (rect.height * (GH/(GH+150)))));
    setAimPct({ x: rx, y: Math.min(ry, 0.95) });
  }, []);

  const onPointerDown = (e) => { if (phase!=="aim") return; setIsDragging(true); getAimFromEvent(e, goalRef.current); };
  const onPointerMove = (e) => { if (!isDragging||phase!=="aim") return; getAimFromEvent(e, goalRef.current); };
  const onPointerUp   = () => setIsDragging(false);
  useEffect(()=>{ window.addEventListener("pointerup",onPointerUp); return()=>window.removeEventListener("pointerup",onPointerUp); },[]);

  const shoot = () => {
    if (phase!=="aim"||ballStage!=="idle") return;
    setPhase("shooting"); setBallStage("flying");
    const targetX = aimPct.x * GW;
    const targetY = aimPct.y * GH;
    const keeperTargetX = answeredCorrect
      ? (Math.random()<0.28 ? targetX : Math.random()*GW)
      : (Math.random()<0.68 ? targetX : Math.random()*GW);
    setBallSvg({ x: GW/2, y: GH+150 });
    setTimeout(() => { setBallSvg({ x:targetX, y:targetY }); setKeeperX(keeperTargetX); setKeeperAnim("diving"); }, 60);
    setTimeout(() => {
      const isGoal = Math.abs(keeperTargetX - targetX) > 55;
      setShotResult(isGoal?"goal":"saved");
      setKeeperAnim(isGoal?"scored":"saved");
      setBallStage("done");
      if (isGoal) { setGoals(g=>g+1); if(onXp) onXp(5); }
      else setSaves(s=>s+1);
      setHistory(h=>[...h,{goal:isGoal}]);
      setTimeout(() => {
        if (qIdx+1>=TOTAL_KICKS) { setPhase("end"); }
        else {
          setQIdx(i=>i+1); setSelectedOpt(null); setAnsweredCorrect(false);
          setAimPct({x:.5,y:.5}); setBallSvg({x:GW/2,y:GH+150});
          setKeeperX(GW/2); setKeeperAnim("idle"); setBallStage("idle");
          setShotResult(null); setPhase("question");
        }
      }, 2400);
    }, 750);
  };

  const restart = () => {
    setPhase("intro"); setQIdx(0); setSelectedOpt(null); setAnsweredCorrect(false);
    setAimPct({x:.5,y:.5}); setBallSvg({x:GW/2,y:GH+150});
    setKeeperX(GW/2); setKeeperAnim("idle"); setBallStage("idle");
    setShotResult(null); setGoals(0); setSaves(0); setHistory([]);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(170deg,#0a1a4a 0%,#1565C0 100%)", fontFamily:"'Nunito',sans-serif", display:"flex", flexDirection:"column", alignItems:"center" }}>

      {/* Header */}
      <div style={{width:"100%",padding:"16px 20px 8px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:28}}>⚽</span>
          <div>
            <div style={{fontWeight:900,color:"#fff",fontSize:17,lineHeight:1}}>Pênalti Hebraico</div>
            <div style={{fontWeight:700,color:"rgba(255,255,255,.45)",fontSize:11}}>נָתִיב עִבְרִית</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {Array.from({length:TOTAL_KICKS}).map((_,i)=>{
            const h=history[i];
            return <div key={i} style={{width:26,height:26,borderRadius:"50%",border:`2px solid ${h?(h.goal?"#FF6D00":"rgba(255,255,255,.25)"):"rgba(255,255,255,.2)"}`,background:h?(h.goal?"rgba(255,109,0,.35)":"rgba(255,255,255,.07)"):"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,transition:"all .3s"}}>{h?(h.goal?"⚽":"✕"):""}</div>;
          })}
        </div>
      </div>

      {phase!=="intro"&&phase!=="end" && (
        <div style={{display:"flex",gap:20,marginBottom:6,alignItems:"center"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:30,fontWeight:900,color:"#FF6D00",lineHeight:1}}>{goals}</div><div style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:700}}>GOLS</div></div>
          <div style={{width:1,height:32,background:"rgba(255,255,255,.12)"}}/>
          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.5)"}}>Chute {Math.min(qIdx+1,TOTAL_KICKS)}/{TOTAL_KICKS}</div>
          <div style={{width:1,height:32,background:"rgba(255,255,255,.12)"}}/>
          <div style={{textAlign:"center"}}><div style={{fontSize:30,fontWeight:900,color:"rgba(255,255,255,.3)",lineHeight:1}}>{saves}</div><div style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:700}}>DEFESAS</div></div>
        </div>
      )}

      {/* INTRO */}
      {phase==="intro" && (
        <div className="fadeUp" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 24px 40px",textAlign:"center",width:"100%"}}>
          <div style={{fontSize:88,marginBottom:12,filter:"drop-shadow(0 12px 28px rgba(0,0,0,.5))"}}>⚽</div>
          <h1 style={{fontSize:34,fontWeight:900,color:"#fff",lineHeight:1.2,marginBottom:10}}>Disputa de<br/><span style={{color:"#FF6D00"}}>Pênaltis!</span></h1>
          <p style={{color:"rgba(255,255,255,.6)",fontSize:15,lineHeight:1.7,marginBottom:8}}>Responda em hebraico para ter mais chance de marcar!</p>
          <div style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:"18px 20px",marginBottom:32,width:"100%",textAlign:"left"}}>
            {[["✅","Resposta correta","Goleiro fica mais lento — mais fácil marcar!"],["❌","Resposta errada","Goleiro fica alerta — mais difícil marcar!"],["🎯","Arraste no gol","Mire onde quer chutar, depois confirme!"]].map(([icon,title,desc])=>(
              <div key={title} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
                <span style={{fontSize:20}}>{icon}</span>
                <div><div style={{fontWeight:800,color:"#fff",fontSize:13}}>{title}</div><div style={{color:"rgba(255,255,255,.45)",fontSize:12}}>{desc}</div></div>
              </div>
            ))}
          </div>
          <button onClick={()=>setPhase("question")} style={{background:"linear-gradient(135deg,#FF6D00,#FF9100)",color:"#fff",padding:"17px",borderRadius:18,fontWeight:900,fontSize:18,boxShadow:"0 6px 0 #b34a00",width:"100%"}}>⚽ Começar!</button>
        </div>
      )}

      {/* QUESTION */}
      {phase==="question" && (
        <div className="fadeUp" style={{width:"100%",padding:"8px 20px 0",flex:1}}>
          <div style={{background:"rgba(255,255,255,.07)",border:"1.5px solid rgba(255,255,255,.12)",borderRadius:22,padding:"20px",marginBottom:16,textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>O que significa?</div>
            <div style={{fontSize:54,direction:"rtl",fontWeight:900,color:"#fff",lineHeight:1.1}}>{currentQ.heb}</div>
            <div style={{color:"#FF9100",fontWeight:800,fontSize:19,marginTop:6}}>{currentQ.tr}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {currentQ.opts.map(opt=>{
              const isSel=selectedOpt===opt,isCorrect=opt===currentQ.answer;
              let bg="rgba(255,255,255,.08)",border="rgba(255,255,255,.14)",color="#fff",shadow="none";
              if(selectedOpt){ if(isCorrect){bg="rgba(255,109,0,.25)";border="#FF6D00";color="#FF9100";shadow="0 0 18px rgba(255,109,0,.4)";}else if(isSel){bg="rgba(244,67,54,.2)";border="#F44336";color="#f87171";}else{bg="rgba(255,255,255,.03)";border="rgba(255,255,255,.06)";color="rgba(255,255,255,.3)";} }
              return <button key={opt} className={selectedOpt&&isSel&&!isCorrect?"shake":""} onClick={()=>handleAnswer(opt)} style={{padding:"16px 12px",borderRadius:16,fontWeight:800,fontSize:15,border:`2px solid ${border}`,background:bg,color,boxShadow:shadow,transition:"all .2s"}}>{opt}</button>;
            })}
          </div>
          {selectedOpt && (
            <div style={{marginTop:14,textAlign:"center",padding:"12px 16px",borderRadius:14,background:answeredCorrect?"rgba(255,109,0,.18)":"rgba(244,67,54,.15)",border:`1.5px solid ${answeredCorrect?"#FF6D00":"#F44336"}`}}>
              <span style={{fontWeight:900,fontSize:15,color:answeredCorrect?"#FF9100":"#f87171"}}>{answeredCorrect?"✅ Correto! Hora de chutar!":`❌ Era "${currentQ.answer}" — mas tente o gol!`}</span>
            </div>
          )}
        </div>
      )}

      {/* AIM + SHOOT */}
      {(phase==="aim"||phase==="shooting") && (
        <div className="fadeUp" style={{width:"100%",padding:"6px 14px 0",flex:1,display:"flex",flexDirection:"column"}}>
          {phase==="aim" && (
            <div style={{textAlign:"center",marginBottom:8}}>
              <div style={{fontWeight:900,color:"#fff",fontSize:15}}>{answeredCorrect?"✅ Correto! ":"❌ Errou! "}<span style={{color:"rgba(255,255,255,.55)",fontWeight:700,fontSize:13}}>{answeredCorrect?"Goleiro mais lento 💪":"Goleiro esperto 👀"}</span></div>
              <div style={{color:"rgba(255,255,255,.45)",fontSize:12,marginTop:2}}>{isDragging?"Solte para confirmar":"Arraste no gol para mirar!"}</div>
            </div>
          )}

          {/* SVG GOAL */}
          <div ref={goalRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove}
            style={{width:"100%",touchAction:"none",cursor:phase==="aim"?"crosshair":"default",userSelect:"none"}}>
            <svg viewBox={`0 0 ${GW} ${GH+160}`} width="100%" style={{display:"block",filter:"drop-shadow(0 16px 40px rgba(0,0,0,.5))"}}>
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1B5E20"/><stop offset="100%" stopColor="#2E7D32"/></linearGradient>
                <linearGradient id="pgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#388E3C"/><stop offset="100%" stopColor="#43A047"/></linearGradient>
                <filter id="glow2"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="shad2"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.4"/></filter>
              </defs>
              {/* Grass */}
              <rect x="0" y={GH} width={GW} height="160" fill="url(#pg)"/>
              {[0,1,2,3,4].map(i=><rect key={i} x={i*80} y={GH} width="40" height="160" fill="url(#pgs)" opacity=".4"/>)}
              <circle cx={GW/2} cy={GH+130} r="5" fill="rgba(255,255,255,.6)"/>
              <path d={`M ${GW/2-60} ${GH} A 70 70 0 0 1 ${GW/2+60} ${GH}`} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
              <rect x={GW*.18} y={GH} width={GW*.64} height="28" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
              <rect x={GW*.30} y={GH} width={GW*.40} height="14" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1"/>
              {/* Net */}
              <rect x="14" y="8" width={GW-28} height={GH-10} fill="rgba(0,0,0,.18)" rx="2"/>
              {[0,1,2,3,4,5,6,7,8,9].map(i=><line key={`v${i}`} x1={14+i*(GW-28)/9} y1="8" x2={14+i*(GW-28)/9} y2={GH} stroke="rgba(255,255,255,.12)" strokeWidth="1"/>)}
              {[0,1,2,3,4,5,6].map(i=><line key={`h${i}`} x1="14" y1={8+i*(GH-8)/6} x2={GW-14} y2={8+i*(GH-8)/6} stroke="rgba(255,255,255,.12)" strokeWidth="1"/>)}
              {/* Posts */}
              <rect x="10" y="4" width={GW-20} height="8" fill="#fff" rx="4" filter="url(#shad2)"/>
              <rect x="10" y="4" width="8" height={GH+2} fill="#fff" rx="4" filter="url(#shad2)"/>
              <rect x={GW-18} y="4" width="8" height={GH+2} fill="#fff" rx="4" filter="url(#shad2)"/>
              {/* Goal flash */}
              {shotResult==="goal" && <rect x="14" y="8" width={GW-28} height={GH-10} fill="rgba(255,109,0,.22)" rx="2"><animate attributeName="opacity" values="0;1;0.8;1;0.6;1" dur="0.6s" fill="freeze"/></rect>}

              {/* KEEPER — bigger */}
              <KeeperSVG x={keeperX} gH={GH} anim={keeperAnim} shooting={phase==="shooting"}/>

              {/* Aim crosshair */}
              {phase==="aim" && (
                <g>
                  <circle cx={aimPct.x*GW} cy={aimPct.y*GH} r="22" fill="rgba(0,0,0,.25)"/>
                  <circle cx={aimPct.x*GW} cy={aimPct.y*GH} r="20" fill="none" stroke="#FF6D00" strokeWidth="2.5" strokeDasharray="6 4" opacity=".9"/>
                  <circle cx={aimPct.x*GW} cy={aimPct.y*GH} r="6" fill="#FF6D00" filter="url(#glow2)"/>
                  <line x1={aimPct.x*GW-30} y1={aimPct.y*GH} x2={aimPct.x*GW+30} y2={aimPct.y*GH} stroke="#FF6D00" strokeWidth="1.5" opacity=".6"/>
                  <line x1={aimPct.x*GW} y1={aimPct.y*GH-30} x2={aimPct.x*GW} y2={aimPct.y*GH+30} stroke="#FF6D00" strokeWidth="1.5" opacity=".6"/>
                </g>
              )}

              {/* Ball */}
              <PenaltyBall x={ballSvg.x} y={ballSvg.y} stage={ballStage} shotResult={shotResult}/>

              {/* Result banner */}
              {shotResult && (
                <g>
                  <rect x="60" y={GH/2-38} width={GW-120} height="76" rx="16" fill={shotResult==="goal"?"rgba(255,109,0,.92)":"rgba(13,43,107,.9)"} filter="url(#shad2)"/>
                  <text x={GW/2} y={GH/2+6} textAnchor="middle" fill="#fff" fontSize="26" fontWeight="900" fontFamily="Nunito,sans-serif">{shotResult==="goal"?"⚽ GOL!":"🧤 Defendido!"}</text>
                  {shotResult==="goal" && <text x={GW/2} y={GH/2+30} textAnchor="middle" fill="rgba(255,255,255,.75)" fontSize="14" fontFamily="Nunito,sans-serif" fontWeight="700">שַׁעַר! (Sha'ar!)</text>}
                </g>
              )}
            </svg>
          </div>

          {phase==="aim" && (
            <div style={{padding:"10px 0 20px"}}>
              <button onClick={shoot} style={{width:"100%",background:"linear-gradient(135deg,#FF6D00,#FF9100)",color:"#fff",padding:"17px",borderRadius:18,fontWeight:900,fontSize:18,boxShadow:"0 6px 0 #b34a00,0 12px 30px rgba(255,109,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                <span style={{fontSize:22}}>⚽</span> CHUTAR!
              </button>
            </div>
          )}
        </div>
      )}

      {/* END */}
      {phase==="end" && (
        <div className="fadeUp" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",textAlign:"center",width:"100%"}}>
          {goals>=3 && <PenaltyConfetti/>}
          <div style={{fontSize:86,marginBottom:10}}>{goals>=4?"🏆":goals>=3?"⭐":goals>=2?"😤":"😓"}</div>
          <h2 style={{fontSize:30,fontWeight:900,color:"#fff",marginBottom:4}}>{goals>=4?"Craque!":goals>=3?"Muito bem!":goals>=2?"Pode melhorar!":"Continue estudando!"}</h2>
          <div style={{background:"rgba(255,255,255,.07)",border:"1.5px solid rgba(255,255,255,.12)",borderRadius:22,padding:"20px 24px",marginBottom:24,width:"100%"}}>
            <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:2,marginBottom:14}}>Placar Final</div>
            <div style={{display:"flex",justifyContent:"center",gap:32,marginBottom:18}}>
              <div><div style={{fontSize:52,fontWeight:900,color:"#FF6D00",lineHeight:1}}>{goals}</div><div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:700}}>GOLS</div></div>
              <div style={{fontSize:36,color:"rgba(255,255,255,.15)",paddingTop:8}}>—</div>
              <div><div style={{fontSize:52,fontWeight:900,color:"rgba(255,255,255,.3)",lineHeight:1}}>{saves}</div><div style={{fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:700}}>DEFESAS</div></div>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:8}}>
              {history.map((h,i)=><div key={i} style={{width:38,height:38,borderRadius:10,background:h.goal?"rgba(255,109,0,.3)":"rgba(255,255,255,.07)",border:`2px solid ${h.goal?"#FF6D00":"rgba(255,255,255,.15)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>{h.goal?"⚽":"✕"}</div>)}
            </div>
          </div>
          <button onClick={restart} style={{width:"100%",background:"linear-gradient(135deg,#FF6D00,#FF9100)",color:"#fff",padding:"17px",borderRadius:18,fontWeight:900,fontSize:17,boxShadow:"0 6px 0 #b34a00"}}>⚽ Jogar de Novo</button>
        </div>
      )}
    </div>
  );
}

// ── KEEPER SVG (grande) ───────────────────────────────────────────────────────
function KeeperSVG({ x, gH, anim, shooting }) {
  const tiltDeg = (anim==="diving"||anim==="saved") ? (x<200 ? -28 : 28) : 0;
  // Scale up: was translate(-20,-56), now we scale 1.7x around feet pivot
  const S = 1.75;
  return (
    <g transform={`translate(${x}, ${gH - 10})`}
      style={{ transition: shooting ? "transform .55s cubic-bezier(.25,.46,.45,.94)" : "none" }}>
      <g transform={`rotate(${tiltDeg})`}
        style={{ transition: shooting ? "transform .5s cubic-bezier(.34,1.56,.64,1)" : "none" }}>
        <g transform={`scale(${S}) translate(-20, -72)`}>
          {/* Shadow */}
          <ellipse cx="20" cy="72" rx="18" ry="5" fill="rgba(0,0,0,.3)"/>
          {/* Legs */}
          <rect x="11" y="52" width="8" height="20" fill="#FF6D00" rx="3"/>
          <rect x="21" y="52" width="8" height="20" fill="#FF6D00" rx="3"/>
          {/* Boots */}
          <rect x="9"  y="68" width="12" height="7" fill="#111" rx="2.5"/>
          <rect x="19" y="68" width="12" height="7" fill="#111" rx="2.5"/>
          {/* Body */}
          <rect x="8" y="24" width="24" height="30" fill="#1565C0" rx="7"/>
          {/* Jersey stripes */}
          <rect x="8" y="30" width="24" height="4" fill="rgba(255,255,255,.18)" rx="2"/>
          <rect x="8" y="40" width="24" height="4" fill="rgba(255,255,255,.18)" rx="2"/>
          {/* Jersey number */}
          <text x="20" y="42" textAnchor="middle" fill="rgba(255,255,255,.8)" fontSize="11" fontWeight="900" fontFamily="Nunito">1</text>
          {/* Arms */}
          <rect x="-2" y="26" width="11" height="6" fill="#1565C0" rx="3"/>
          <rect x="31" y="26" width="11" height="6" fill="#1565C0" rx="3"/>
          {/* Gloves */}
          <circle cx="0"  cy="29" r="7" fill="#FFB300"/>
          <circle cx="40" cy="29" r="7" fill="#FFB300"/>
          <circle cx="0"  cy="29" r="3" fill="#cc8800" opacity=".5"/>
          <circle cx="40" cy="29" r="3" fill="#cc8800" opacity=".5"/>
          {/* Neck */}
          <rect x="17" y="16" width="6" height="10" fill="#FFCC80" rx="2"/>
          {/* Head */}
          <circle cx="20" cy="12" r="14" fill="#FFCC80"/>
          {/* Ears */}
          <ellipse cx="6"  cy="12" rx="3.5" ry="4.5" fill="#FFCC80"/>
          <ellipse cx="34" cy="12" rx="3.5" ry="4.5" fill="#FFCC80"/>
          {/* Eyes */}
          <ellipse cx="14" cy="11" rx="3" ry="3.5" fill="#fff"/>
          <ellipse cx="26" cy="11" rx="3" ry="3.5" fill="#fff"/>
          <circle cx="14" cy="12" r="2" fill="#333"/>
          <circle cx="26" cy="12" r="2" fill="#333"/>
          {/* Eyebrows */}
          <path d="M 10 7 Q 14 5 18 7" stroke="#555" strokeWidth="1.5" fill="none"/>
          <path d="M 22 7 Q 26 5 30 7" stroke="#555" strokeWidth="1.5" fill="none"/>
          {/* Mouth */}
          {anim==="saved"
            ? <path d="M 13 19 Q 20 16 27 19" stroke="#555" strokeWidth="1.5" fill="none"/>
            : <path d="M 13 18 Q 20 22 27 18" stroke="#555" strokeWidth="1.5" fill="none"/>
          }
          {/* Cap brim */}
          <path d="M 7 8 Q 20 0 33 8 L 34 6 Q 20 -2 6 6 Z" fill="#FF6D00"/>
          {/* Cap top */}
          <path d="M 8 8 Q 20 2 32 8 Q 20 4 8 8 Z" fill="#cc5500" opacity=".5"/>
        </g>
      </g>
    </g>
  );
}

// ── BALL SVG ──────────────────────────────────────────────────────────────────
function PenaltyBall({ x, y, stage, shotResult }) {
  const sc = stage==="flying" ? 0.75 : 1;
  return (
    <g transform={`translate(${x},${y})`} style={{ transition:stage==="flying"?"transform .7s cubic-bezier(.25,.46,.45,.94)":"none" }}>
      <g transform={`scale(${sc})`} style={{ transition:"transform .3s ease", transformOrigin:"center" }}>
        <ellipse cx="0" cy="18" rx={11*sc} ry="4" fill="rgba(0,0,0,.3)"/>
        <circle cx="0" cy="0" r="14" fill="#fff" stroke="#ddd" strokeWidth="1"/>
        <circle cx="0"  cy="0"  r="5"   fill="#222"/>
        <circle cx="-8" cy="-6" r="4.5" fill="#222"/>
        <circle cx="8"  cy="-6" r="4.5" fill="#222"/>
        <circle cx="-9" cy="5"  r="4.5" fill="#222"/>
        <circle cx="9"  cy="5"  r="4.5" fill="#222"/>
        {shotResult==="goal" && (
          <circle cx="0" cy="0" r="16" fill="none" stroke="#FF6D00" strokeWidth="3" opacity="0.7">
            <animate attributeName="r" values="14;22;14" dur="0.5s" repeatCount="2"/>
            <animate attributeName="opacity" values="0.8;0;0.8" dur="0.5s" repeatCount="2"/>
          </circle>
        )}
      </g>
    </g>
  );
}

// ── CONFETTI ──────────────────────────────────────────────────────────────────
function PenaltyConfetti() {
  const pieces = Array.from({length:22},(_,i)=>({ id:i, x:Math.random()*100, delay:Math.random(), color:["#FF6D00","#FF9100","#fff","#FFB300","#1CB0F6","#FF4B4B"][Math.floor(Math.random()*6)], size:7+Math.random()*9, dur:1.4+Math.random()*.8 }));
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,height:"100vh",pointerEvents:"none",zIndex:999,overflow:"hidden"}}>
      {pieces.map(p=><div key={p.id} style={{position:"absolute",left:`${p.x}%`,top:-14,width:p.size,height:p.size,borderRadius:Math.random()>.5?"50%":"2px",background:p.color,animation:`confetti ${p.dur}s ${p.delay}s ease forwards`}}/>)}
    </div>
  );
}
