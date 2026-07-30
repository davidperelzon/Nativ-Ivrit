import { useState, useEffect, useRef, useCallback } from "react";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  blue:"#1E3A8A", blueMid:"#1D4ED8", blueLt:"#EEF2FF",
  orange:"#B45309", orangeMid:"#D97706", orangeLt:"#FEF3C7",
  navy:"#111827", white:"#FFFFFF", bg:"#F8FAFC",
  border:"#E2E8F0", gray:"#64748B", grayLt:"#F1F5F9",
  red:"#DC2626", redLt:"#FEF2F2", gold:"#D97706",
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
  { heb:"בַּיִת",        tr:"Báit",     opts:["Escola","Casa","Rua","Cidade"],                     answer:"Casa"       },
  { heb:"שַׁעַר",        tr:"Sha'ar",    opts:["Bola","Jogador","Gol","Estádio"],                   answer:"Gol"        },
  { heb:"כַּדּוּר",      tr:"Kadúr",     opts:["Gol","Bola","Time","Árbitro"],                      answer:"Bola"       },
  { heb:"נִצָּחוֹן",     tr:"Nitsakhón", opts:["Derrota","Empate","Vitória","Gol"],                 answer:"Vitória"    },
  { heb:"בֹּקֶר טוֹב",  tr:"Boker Tov", opts:["Boa noite","Bom dia","Boa tarde","Olá"],            answer:"Bom dia"    },
  { heb:"לַיְלָה טוֹב", tr:"Laila Tov", opts:["Bom dia","Boa tarde","Boa noite","Tchau"],          answer:"Boa noite"  },
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
  { id:1, user:"Yael",  avatar:"👩", msg:"Shalom! Alguém quer praticar?", time:"09:12", mine:false },
  { id:2, user:"Carlos", avatar:"👨", msg:"Shalom! Nível Bet. Posso tentar.",   time:"09:14", mine:false },
  { id:3, user:"Ana",    avatar:"👩", msg:"תּוֹדָה pela explicação de ontem.",  time:"09:20", mine:false },
  { id:4, user:"Yael",   avatar:"👩", msg:"בְּבַקָּשָׁה. Vamos continuar.",    time:"09:22", mine:false },
];

const GW = 400; const GH = 220;
const TOTAL_KICKS = 5;
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
function buildFQOpts(idx) {
  const c = FOOTBALL[idx];
  return shuffle([c, ...shuffle(FOOTBALL.filter((_,i)=>i!==idx)).slice(0,3)]);
}

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
    { pre:"Como se diz", word:"Olá / Paz",  opts:["שָׁלוֹם (Shalom)","תּוֹדָה (Todá)","כֵּן (Ken)","לֹא (Lo)"],                   answer:"שָׁלוֹם (Shalom)", emoji:"👋" },
    { pre:"Como se diz", word:"Obrigado/a", opts:["בְּבַקָּשָׁה (Bevakashá)","מַיִם (Máyim)","תּוֹדָה (Todá)","שָׁלוֹם (Shalom)"],answer:"תּוֹדָה (Todá)",    emoji:"🙏" },
    { pre:"Como se diz", word:"Água",       opts:["לֶחֶם (Léhem)","מַיִם (Máim)","בַּיִת (Báit)","כֵּן (Ken)"],                 answer:"מַיִם (Máim)",     emoji:"💧" },
    { pre:"Como se diz", word:"Gol!",       opts:["כַּדּוּר (Kadúr)","שָׂחְקָן (Sakhkán)","שַׁעַר (Sha'ar)","נִצָּחוֹן (Nitsakhón)"],answer:"שַׁעַר (Sha'ar)", emoji:"⚽" },
    { pre:"Como se diz", word:"Vitória",    opts:["שַׁעַר (Sha'ar)","נִצָּחוֹן (Nitsakhón)","מְאַמֵּן (Me'amén)","כַּדּוּר (Kadúr)"],answer:"נִצָּחוֹן (Nitsakhón)",emoji:"🏆" },
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
    setMessages(m=>[...m,{ id:Date.now(), user:"Você", avatar:"👤", msg:chatInput.trim(), time:now, mine:true }]);
    setChatInput("");
    setTimeout(()=>{
      const replies = ["תּוֹדָה!","Shalom!","בְּבַקָּשָׁה.","Bom progresso.","Boker Tov!"];
      const now2 = new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
      setMessages(m=>[...m,{ id:Date.now()+1, user:"Yael", avatar:"👩", msg:replies[Math.floor(Math.random()*replies.length)], time:now2, mine:false }]);
    },900);
  };

  const goGame = (g) => setScreen(g);
  const closeGame = () => setScreen(null);

  const TABS = [
    { id:"home",  icon:"🏠", label:"Início"   },
    { id:"learn", icon:"📚", label:"Estudos"  },
    { id:"games", icon:"🎯", label:"Exercícios" },
    { id:"chat",  icon:"💬", label:"Fórum"    },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Inter','Segoe UI',system-ui,-apple-system,sans-serif", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        button{cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:all .2s ease}
        button:active{transform:translateY(1px)}
        input{font-family:'Inter',sans-serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
        .fadeUp{animation:fadeUp .4s ease-out forwards}
        .slideIn{animation:slideIn .3s ease-out forwards}
        .shake{animation:shake .4s ease-out}
        .flip-wrap{perspective:1000px}
        .flip-inner{width:100%;height:100%;transition:transform .6s;transition-timing-function:cubic-bezier(.25,.46,.45,.94);transform-style:preserve-3d;position:relative}
        .flip-inner.flipped{transform:rotateY(180deg)}
        .flip-face{position:absolute;width:100%;height:100%;backface-visibility:hidden;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px}
        .flip-back{transform:rotateY(180deg)}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:C.grayLt}
        ::-webkit-scrollbar-thumb{background:${C.gray}; border-radius:2px}
        input:focus{outline:2px solid ${C.blue}; outline-offset:2px}
      `}</style>

      {/* TOP BAR */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        {screen ? (
          <button onClick={closeGame} style={{ background:"transparent", color:C.gray, padding:"6px 12px", borderRadius:8, fontWeight:600, fontSize:14, display:"flex", alignItems:"center", gap:4 }}>← Voltar</button>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, background:C.blue, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:C.white, fontWeight:600 }}>א</div>
            <div>
              <div style={{ fontWeight:700, color:C.navy, fontSize:16 }}>Nativ</div>
              <div style={{ fontWeight:500, color:C.gray, fontSize:12 }}>עִבְרִית</div>
            </div>
          </div>
        )}
        <div style={{ display:"flex", gap:8 }}>
          <Pill icon="🔥" val={streak} color={C.orange} bg={C.orangeLt}/>
          <Pill icon="⭐" val={xp} color={C.blue} bg={C.blueLt}/>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom: screen ? 0 : 80 }}>
        {screen==="fc"       && <FlashcardGame deck={WORDS} idx={fcIdx} flip={fcFlip} known={fcKnown} setFlip={setFcFlip} next={fcNext}/>}
        {screen==="match"    && <MatchGame left={leftItems} right={rightItems} sel={mSel} done={mDone} wrong={mWrong} score={mScore} allDone={Object.keys(mDone).length===matchWords.length} onSelect={handleMatch}/>}
        {screen==="football" && <FootballQuiz words={FOOTBALL} idx={fqIdx} opts={fqOpts} sel={fqSel} score={fqScore} done={fqDone} combo={fqCombo} onAnswer={handleFQ} onNext={nextFQ}/>}
        {screen==="riddle"   && <RiddleGame riddles={RIDDLES} idx={rdIdx} sel={rdSel} score={rdScore} done={rdDone} combo={rdCombo} onAnswer={handleRiddle} onNext={nextRiddle}/>}
        {screen==="penalty"  && <PenaltyGame onXp={(n)=>setXp(x=>x+n)}/>}

        {!screen && tab==="home"  && <HomeTab xp={xp} goGame={goGame}/>}
        {!screen && tab==="learn" && <LearnTab levels={LEVELS} xp={xp} goGame={goGame}/>}
        {!screen && tab==="games" && <GamesTab goGame={goGame}/>}
        {!screen && tab==="chat"  && <ChatTab messages={messages} input={chatInput} setInput={setChatInput} onSend={sendMsg} chatRef={chatRef}/>}
      </div>

      {/* BOTTOM NAV */}
      {!screen && (
        <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:100 }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, background:"transparent", padding:"12px 4px", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ fontSize:20, color:tab===t.id?C.blue:C.gray, fontWeight:tab===t.id?600:400 }}>{t.icon}</div>
              <div style={{ fontSize:11, fontWeight:500, color:tab===t.id?C.navy:C.gray }}>{t.label}</div>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

function Pill({icon,val,color,bg}){
  return (
    <div style={{ 
      display:"flex", alignItems:"center", gap:6, 
      background:bg, borderRadius:999, padding:"6px 12px", 
      border:`1px solid ${color}20`, fontSize:13, fontWeight:600 
    }}>
      <span style={{fontSize:14}}>{icon}</span>
      <span style={{color}}>{val}</span>
    </div>
  );
}

function HomeTab({xp,goGame}){
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <div style={{ 
        background:"linear-gradient(135deg,#1E3A8A 0%,#1D4ED8 100%)", 
        borderRadius:20, padding:"28px 24px", marginBottom:24, 
        position:"relative", overflow:"hidden", 
        boxShadow:"0 10px 25px rgba(30,58,138,.15)"
      }}>
        <div style={{ 
          position:"absolute", top:0, right:0, width:120, height:120, 
          background:"rgba(255,255,255,.08)", borderRadius:"50%" 
        }}/>
        <h1 style={{ 
          fontSize:24, fontWeight:700, color:"#fff", lineHeight:1.3, 
          marginBottom:16 
        }}>
          Bem-vindo(a)
        </h1>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:13, color:"rgba(255,255,255,.8)", fontWeight:500 }}>Nível Alef</span>
          <span style={{ fontSize:13, color:"#FCD34D", fontWeight:600 }}>{xp} XP</span>
        </div>
        <div style={{ background:"rgba(255,255,255,.15)", borderRadius:6, height:6, overflow:"hidden" }}>
          <div style={{ 
            width:`${Math.min((xp/200)*100,100)}%`, height:"100%", 
            background:"#FCD34D", borderRadius:6, transition:"width .5s ease"
          }}/>
        </div>
      </div>

      <div style={{ 
        background:C.white, borderRadius:16, padding:"20px", marginBottom:20, 
        border:`1px solid ${C.border}`, boxShadow:"0 2px 10px rgba(0,0,0,.05)"
      }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.gray, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.05em" }}>
          Vocabulário do dia
        </div>
        <div style={{ fontSize:36, direction:"rtl", fontWeight:700, color:C.navy, marginBottom:4 }}>מַה שְׁלוֹמְךָ?</div>
        <div style={{ color:C.orange, fontWeight:600, fontSize:16 }}>Ma Shlomhá?</div>
        <div style={{ color:C.gray, fontSize:14 }}>Como você está?</div>
      </div>

      <div style={{ fontSize:13, fontWeight:600, color:C.gray, marginBottom:16, textTransform:"uppercase", letterSpacing:"0.05em" }}>
        Exercícios recomendados
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:12 }}>
        {[
          { id:"fc",      icon:"📖", label:"Flashcards",   desc:"Memorização ativa",    color:C.blue },
          { id:"match",   icon:"🔗", label:"Associações",  desc:"Hebraico ↔ Português", color:C.orange },
          { id:"riddle",  icon:"❓", label:"Quiz rápido",   desc:"Comprehension test",   color:C.navy },
          { id:"penalty", icon:"⚽", label:"Pênaltis",      desc:"Vocabulário + pressão",color:"#B45309" },
        ].map(g=>(
          <button key={g.id} onClick={()=>goGame(g.id)} style={{ 
            background:C.white, border:`1px solid ${C.border}`, borderRadius:12, 
            padding:"20px", display:"flex", alignItems:"center", gap:16,
            boxShadow:"0 2px 8px rgba(0,0,0,.08)", transition:"all .2s"
          }}>
            <div style={{ width:56, height:56, borderRadius:12, background:`${g.color}20`, 
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 
            }}>{g.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:16, color:C.navy, marginBottom:2 }}>{g.label}</div>
              <div style={{ fontSize:13, color:C.gray }}>{g.desc}</div>
            </div>
            <div style={{ color:g.color, fontWeight:600, fontSize:13 }}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LearnTab({levels,xp,goGame}){
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <h2 style={{fontSize:22,fontWeight:700,color:C.navy,marginBottom:6}}>Trilha de Estudos</h2>
      <p style={{fontSize:14,color:C.gray,marginBottom:24}}>Progrida sistematicamente através dos níveis</p>
      
      <div style={{background:C.white,borderRadius:12,padding:"20px",marginBottom:24,border:`1px solid ${C.border}`,boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontWeight:600,fontSize:14,color:C.navy}}>Progresso atual</span>
          <span style={{fontWeight:700,fontSize:14,color:C.orange}}>{xp}/200 XP</span>
        </div>
        <div style={{background:C.grayLt,borderRadius:6,height:8,overflow:"hidden"}}>
          <div style={{width:`${Math.min((xp/200)*100,100)}%`,height:"100%",background:C.blue,borderRadius:6,transition:"width .5s ease"}}/>
        </div>
      </div>

      {levels.map(lvl=>(
        <div key={lvl.id} style={{marginBottom:20}}>
          <div style={{ 
            background:lvl.locked?C.grayLt:C.blue, borderRadius:12, padding:"16px 20px", 
            marginBottom:12, display:"flex", alignItems:"center", gap:12,
            boxShadow:lvl.locked?"none":"0 4px 12px rgba(30,58,138,.15)"
          }}>
            <div style={{fontSize:24,opacity:lvl.locked?.5:1}}>{lvl.locked?"🔒":lvl.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:16,color:lvl.locked?C.gray:C.white}}>Nível {lvl.id}: {lvl.title}</div>
              <div style={{fontSize:13,fontWeight:500,color:lvl.locked?C.gray:"rgba(255,255,255,.8)"}}>{lvl.sub}</div>
            </div>
          </div>
          {!lvl.locked && lvl.lessons.map(les=>(
            <button key={les.id} onClick={()=>goGame("fc")} style={{
              width:"100%", background:C.white, border:`1px solid ${C.border}`, borderRadius:12, 
              padding:"16px 20px", marginBottom:10, display:"flex", alignItems:"center", gap:12,
              boxShadow:"0 2px 8px rgba(0,0,0,.08)"
            }}>
              <div style={{width:48,height:48,borderRadius:10,background:C.blueLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{les.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:15,color:C.navy}}>{les.title}</div>
                <div style={{fontSize:13,color:C.gray}}>{les.xp} XP</div>
              </div>
              <div style={{background:C.blue,color:"white",borderRadius:8,padding:"6px 12px",fontWeight:600,fontSize:12}}>Iniciar</div>
            </button>
          ))}
          {lvl.locked && (
            <div style={{background:C.grayLt,border:`1px dashed ${C.border}`,borderRadius:12,padding:"16px",textAlign:"center"}}>
              <span style={{color:C.gray,fontSize:14,fontWeight:500}}>Complete o nível anterior</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GamesTab({goGame}){
  const games=[
    { id:"fc",      icon:"📖", title:"Flashcards",      desc:"Memorização sistemática", color:C.blue, xp:3 },
    { id:"match",   icon:"🔗", title:"Associações",     desc:"Relacionar palavras",     color:C.orange, xp:4 },
    { id:"riddle",  icon:"❓", title:"Compreensão",     desc:"Teste de múltipla escolha",color:C.navy, xp:5 },
    { id:"penalty", icon:"⚽", title:"Pênaltis",        desc:"Desafio sob pressão",     color:"#B45309", xp:5 },
    { id:"football",icon:"🏟️", title:"Vocabulário Esportivo", desc:"Termos de futebol", color:"#1E40AF", xp:5 },
  ];
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <h2 style={{fontSize:22,fontWeight:700,color:C.navy,marginBottom:6}}>Exercícios</h2>
      <p style={{fontSize:14,color:C.gray,marginBottom:24}}>Pratique e ganhe experiência</p>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {games.map((g)=>(
          <button key={g.id} onClick={()=>goGame(g.id)} style={{ 
            background:C.white, border:`1px solid ${C.border}`, borderRadius:12, 
            padding:"20px", display:"flex", alignItems:"center", gap:16,
            boxShadow:"0 2px 10px rgba(0,0,0,.08)", transition:"all .2s"
          }}>
            <div style={{ width:60, height:60, borderRadius:12, background:`${g.color}10`, 
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 
            }}>{g.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:16, color:C.navy, marginBottom:2 }}>{g.title}</div>
              <div style={{ fontSize:13, color:C.gray }}>{g.desc}</div>
            </div>
            <div style={{ color:g.color, fontWeight:600, fontSize:13, marginRight:8 }}>+{g.xp} XP</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatTab({messages,input,setInput,onSend,chatRef}){
  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,background:C.white}}>
        <h2 style={{fontSize:18,fontWeight:700,color:C.navy}}>Fórum da Comunidade</h2>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:C.blue}}/>
          <span style={{fontSize:13,color:C.gray,fontWeight:500}}>42 membros ativos</span>
        </div>
      </div>
      <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:12,background:C.bg}}>
        {messages.map((m)=>(
          <div key={m.id} className="slideIn" style={{display:"flex",flexDirection:m.mine?"row-reverse":"row",alignItems:"flex-start",gap:12}}>
            {!m.mine && (
              <div style={{ width:40, height:40, borderRadius:20, background:C.blueLt, 
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 
              }}>{m.avatar}</div>
            )}
            <div style={{ maxWidth:"70%" }}>
              {!m.mine && (
                <div style={{ fontSize:12, fontWeight:600, color:C.gray, marginBottom:4 }}>{m.user}</div>
              )}
              <div style={{ 
                background:m.mine?C.orangeLt:C.white, 
                borderRadius:16, padding:"12px 16px", 
                border:`1px solid ${m.mine?C.orange:C.border}`,
                boxShadow:"0 1px 3px rgba(0,0,0,.1)"
              }}>
                <div style={{ fontSize:14, fontWeight:500, color:m.mine?C.orange:C.navy, lineHeight:1.5 }}>
                  {m.msg}
                </div>
              </div>
              <div style={{ fontSize:11, color:C.gray, marginTop:4, fontWeight:500 }}>
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"16px 20px", background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", gap:12 }}>
        <input 
          value={input} 
          onChange={e=>setInput(e.target.value)} 
          onKeyDown={e=>e.key==="Enter"&&onSend()}
          placeholder="Digite sua mensagem..." 
          style={{ 
            flex:1, background:C.grayLt, border:`1px solid ${C.border}`, borderRadius:12, 
            padding:"12px 16px", fontSize:14, color:C.navy, fontWeight:500 
          }} 
        />
        <button 
          onClick={onSend} 
          disabled={!input.trim()} 
          style={{ 
            background:input.trim()?C.blue:C.grayLt, borderRadius:12, width:48, height:48, 
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
            color:input.trim()?"white":C.gray, fontWeight:600 
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}

function FlashcardGame({deck,idx,flip,known,setFlip,next}){
  const card=deck[idx];
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <div style={{background:C.grayLt,borderRadius:6,height:6,marginBottom:20,overflow:"hidden"}}>
        <div style={{width:`${((idx+1)/deck.length)*100}%`,height:"100%",background:C.blue,transition:"width .4s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:24,alignItems:"center"}}>
        <span style={{fontSize:14,color:C.gray,fontWeight:500}}>Flashcard {idx+1}/{deck.length}</span>
        <Pill icon="✓" val={known.size} color={C.blue} bg={C.blueLt}/>
      </div>
      <div className="flip-wrap" style={{height:260,marginBottom:24}} onClick={()=>setFlip(f=>!f)}>
        <div className={`flip-inner ${flip?"flipped":""}`} style={{height:260}}>
          <div className="flip-face" style={{ 
            background:"linear-gradient(135deg,#1E3A8A,#1D4ED8)", 
            boxShadow:"0 8px 20px rgba(30,58,138,.2)"
          }}>
            <div style={{fontSize:12,color:"rgba(255,255,255,.6)",fontWeight:500,marginBottom:16}}>Hebraico</div>
            <div style={{fontSize:48,direction:"rtl",fontWeight:700,color:"white",textAlign:"center",lineHeight:1.1}}>{card.heb}</div>
            <div style={{marginTop:12,color:"#FCD34D",fontWeight:600,fontSize:18}}>{card.tr}</div>
          </div>
          <div className="flip-back flip-face" style={{ 
            background:"linear-gradient(135deg,#B45309,#D97706)", 
            boxShadow:"0 8px 20px rgba(180,83,9,.2)"
          }}>
            <div style={{fontSize:12,color:"rgba(255,255,255,.6)",fontWeight:500,marginBottom:12}}>Português</div>
            <div style={{fontSize:28,fontWeight:700,color:"white",textAlign:"center",marginBottom:8}}>{card.pt}</div>
            <div style={{fontSize:24,direction:"rtl",color:"rgba(255,255,255,.9)",fontWeight:600}}>{card.heb}</div>
          </div>
        </div>
      </div>
      {flip ? (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <button onClick={()=>next(false)} style={{
            background:C.white, border:`1px solid ${C.red}`, color:C.red, padding:"16px",
            borderRadius:12, fontWeight:600, fontSize:15, boxShadow:"0 2px 8px rgba(0,0,0,.1)"
          }}>Não sei</button>
          <button onClick={()=>next(true)} style={{
            background:C.blue, color:"white", padding:"16px", borderRadius:12,
            fontWeight:600, fontSize:15, boxShadow:"0 4px 12px rgba(30,58,138,.3)"
          }}>Conheço</button>
        </div>
      ) : (
        <div style={{
          textAlign:"center", color:C.gray, fontSize:14, fontWeight:500,
          background:C.white, borderRadius:12, padding:"16px", border:`1px solid ${C.border}`
        }}>
          Toque para ver a tradução
        </div>
      )}
    </div>
  );
}

function MatchGame({left,right,sel,done,wrong,score,allDone,onSelect}){
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <h2 style={{fontSize:20,fontWeight:700,color:C.navy}}>Associações</h2>
        <Pill icon="⭐" val={`${score}/${left.length}`} color={C.orange} bg={C.orangeLt}/>
      </div>
      <p style={{fontSize:14,color:C.gray,marginBottom:24}}>Conecte palavras equivalentes</p>
      
      {allDone ? (
        <div style={{textAlign:"center",paddingTop:60}}>
          <div style={{fontSize:64,marginBottom:16}}>✓</div>
          <h3 style={{fontSize:24,fontWeight:700,color:C.blue,marginBottom:8}}>Concluído</h3>
          <p style={{color:C.gray,fontSize:14}}>Todos os pares foram associados</p>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:C.gray,marginBottom:12,textAlign:"center",textTransform:"uppercase",letterSpacing:"0.05em"}}>Hebraico</div>
            {left.map(item=>{
              const matched=done[item.id],isSel=sel?.id===item.id&&sel?.type==="heb",isWrong=wrong===item.id;
              return (
                <button key={item.id} className={isWrong?"shake":""} 
                  onClick={()=>!matched&&onSelect({...item,type:"heb"})} 
                  disabled={matched}
                  style={{
                    width:"100%", marginBottom:12, padding:"16px", borderRadius:12,
                    border:`1px solid ${matched?C.orange:isSel?C.blue:C.border}`,
                    background:matched?C.orangeLt:isSel?C.blueLt:C.white,
                    color:matched?C.orange:isSel?C.blue:C.navy,
                    fontSize:20, direction:"rtl", fontWeight:600,
                    boxShadow:"0 2px 8px rgba(0,0,0,.1)",
                    cursor:matched?"default":"pointer"
                  }}
                >
                  {item.label}
                  {matched && <div style={{fontSize:11,color:C.orange,direction:"ltr",fontWeight:500,marginTop:4}}>{item.sub}</div>}
                </button>
              );
            })}
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:C.gray,marginBottom:12,textAlign:"center",textTransform:"uppercase",letterSpacing:"0.05em"}}>Português</div>
            {right.map(item=>{
              const matched=done[item.id],isSel=sel?.id===item.id&&sel?.type==="pt",isWrong=wrong===item.id;
              return (
                <button key={item.id} className={isWrong?"shake":""} 
                  onClick={()=>!matched&&onSelect({...item,type:"pt"})} 
                  disabled={matched}
                  style={{
                    width:"100%", marginBottom:12, padding:"16px", borderRadius:12,
                    border:`1px solid ${matched?C.orange:isSel?C.orange:C.border}`,
                    background:matched?C.orangeLt:isSel?C.orangeLt:C.white,
                    color:matched?C.orange:isSel?C.orange:C.navy,
                    fontSize:15, fontWeight:600,
                    boxShadow:"0 2px 8px rgba(0,0,0,.1)",
                    cursor:matched?"default":"pointer",
                    display:"flex", alignItems:"center", gap:8
                  }}
                >
                  <span style={{fontSize:24}}>{item.emoji}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function FootballQuiz({words,idx,opts,sel,score,done,combo,onAnswer,onNext}){
  const cur=words[idx];
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
        <Pill icon="⚽" val={`${score}/${words.length}`} color="#059669" bg="#F0FDF4"/>
        {combo>=2 && <Pill icon="🔥" val={`${combo}x`} color={C.orange} bg={C.orangeLt}/>}
      </div>
      <div style={{background:C.grayLt,borderRadius:6,height:6,marginBottom:20,overflow:"hidden"}}>
        <div style={{width:`${(idx/words.length)*100}%`,height:"100%",background:"#059669",transition:"width .4s ease"}}/>
      </div>
      
      {done ? (
        <div style={{textAlign:"center",paddingTop:40}}>
          <div style={{fontSize:72,marginBottom:16}}>🏆</div>
          <div style={{fontSize:48,fontWeight:700,color:"#059669"}}>{score}/{words.length}</div>
        </div>
      ) : (
        <>
          <div style={{ 
            background:"linear-gradient(135deg,#059669,#10B981)", borderRadius:16, 
            padding:"24px 20px", marginBottom:20, textAlign:"center",
            boxShadow:"0 8px 20px rgba(5,150,105,.2)"
          }}>
            <div style={{fontSize:44,direction:"rtl",fontWeight:700,color:"white",lineHeight:1.1}}>{cur.heb}</div>
            <div style={{color:"rgba(255,255,255,.9)",fontWeight:600,fontSize:16,marginTop:6}}>{cur.tr}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {opts.map(opt=>{
              const isCorrect=opt.pt===cur.pt,isSel=opt.pt===sel;
              let bg=C.white,border=C.border,color=C.navy;
              if(sel){ 
                if(isCorrect){bg="#F0FDF4";border="#059669";color="#059669";} 
                else if(isSel){bg=C.redLt;border=C.red;color=C.red;} 
              }
              return (
                <button key={opt.pt} className={sel&&isSel&&!isCorrect?"shake":""} 
                  onClick={()=>onAnswer(opt)} disabled={!!sel}
                  style={{
                    padding:"16px 12px", borderRadius:12, fontWeight:600, fontSize:15,
                    border:`1px solid ${border}`, background:bg, color,
                    boxShadow:"0 2px 8px rgba(0,0,0,.1)",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                    cursor:sel?"default":"pointer"
                  }}
                >
                  <span style={{fontSize:28}}>{opt.emoji}</span>
                  {opt.pt}
                </button>
              );
            })}
          </div>
          {sel && (
            <button onClick={onNext} style={{
              width:"100%", background:C.blue, color:"white", padding:"16px",
              borderRadius:12, fontWeight:600, fontSize:15,
              boxShadow:"0 4px 12px rgba(30,58,138,.3)"
            }}>
              {idx<words.length-1?"Continuar":"Finalizar"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function RiddleGame({riddles,idx,sel,score,done,combo,onAnswer,onNext}){
  const r=riddles[idx];
  return (
    <div className="fadeUp" style={{padding:"24px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
        <Pill icon="❓" val={`${score}/${riddles.length}`} color={C.navy} bg={C.blueLt}/>
        {combo>=2 && <Pill icon="🔥" val={`${combo}x`} color={C.orange} bg={C.orangeLt}/>}
      </div>
      <div style={{background:C.grayLt,borderRadius:6,height:6,marginBottom:20,overflow:"hidden"}}>
        <div style={{width:`${(idx/riddles.length)*100}%`,height:"100%",background:C.blue,transition:"width .4s ease"}}/>
      </div>
      
      {done ? (
        <div style={{textAlign:"center",paddingTop:40}}>
          <div style={{fontSize:64,marginBottom:16}}>{score>=4?"⭐":score>=3?"✅":"📖"}</div>
          <h3 style={{fontSize:24,fontWeight:700,color:C.navy,marginBottom:6}}>{score}/{riddles.length}</h3>
        </div>
      ) : (
        <>
          <div style={{ 
            background:"linear-gradient(135deg,#1E3A8A,#1D4ED8)", borderRadius:16, 
            padding:"24px 20px", marginBottom:20, textAlign:"center",
            boxShadow:"0 8px 20px rgba(30,58,138,.2)"
          }}>
            <div style={{fontSize:40,marginBottom:12}}>{r.emoji}</div>
            <div style={{fontSize:16,fontWeight:600,color:"white",lineHeight:1.4}}>
              {r.pre} <span style={{color:"#FCD34D"}}>"{r.word}"</span>?
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {r.opts.map(opt=>{
              const isCorrect=opt===r.answer,isSel=opt===sel,isHeb=/[א-ת]/.test(opt);
              let bg=C.white,border=C.border,color=C.navy;
              if(sel){ 
                if(isCorrect){bg=C.orangeLt;border=C.orange;color=C.orange;} 
                else if(isSel){bg=C.redLt;border=C.red;color=C.red;} 
              }
              return (
                <button key={opt} className={sel&&isSel&&!isCorrect?"shake":""} 
                  onClick={()=>onAnswer(opt)} disabled={!!sel}
                  style={{
                    padding:"16px", borderRadius:12, fontWeight:600, 
                    fontSize:isHeb?18:14, direction:isHeb?"rtl":"ltr",
                    border:`1px solid ${border}`, background:bg, color,
                    boxShadow:"0 2px 8px rgba(0,0,0,.1)",
                    cursor:sel?"default":"pointer"
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {sel && (
            <button onClick={onNext} style={{
              width:"100%", background:C.navy, color:"white", padding:"16px",
              borderRadius:12, fontWeight:600, fontSize:15,
              boxShadow:"0 4px 12px rgba(17,24,39,.3)"
            }}>
              {idx<riddles.length-1?"Próxima":"Concluído"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

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
  
  useEffect(()=>{ 
    window.addEventListener("pointerup",onPointerUp); 
    return()=>window.removeEventListener("pointerup",onPointerUp); 
  },[]);

  const shoot = () => {
    if (phase!=="aim"||ballStage!=="idle") return;
    setPhase("shooting"); setBallStage("flying");
    const targetX = aimPct.x * GW;
    const targetY = aimPct.y * GH;
    const keeperTargetX = answeredCorrect
      ? (Math.random()<0.28 ? targetX : Math.random()*GW)
      : (Math.random()<0.68 ? targetX : Math.random()*GW);
    setBallSvg({ x: GW/2, y: GH+150 });
    setTimeout(() => { 
      setBallSvg({ x:targetX, y:targetY }); 
      setKeeperX(keeperTargetX); 
      setKeeperAnim("diving"); 
    }, 60);
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
    <div style={{ 
      minHeight:"100vh", 
      background:"linear-gradient(170deg,#0f172a 0%,#1e3a8a 100%)", 
      fontFamily:"'Inter',sans-serif", 
      display:"flex", flexDirection:"column", alignItems:"center" 
    }}>

      {/* Header */}
      <div style={{width:"100%",padding:"20px 24px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:28}}>⚽</span>
          <div>
            <div style={{fontWeight:700,color:"white",fontSize:18}}>Pênaltis Hebraicos</div>
            <div style={{fontWeight:500,color:"rgba(255,255,255,.6)",fontSize:12}}>נָתִיב עִבְרִית</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {Array.from({length:TOTAL_KICKS}).map((_,i)=>{
            const h=history[i];
            return (
              <div key={i} style={{
                width:28,height:28,borderRadius:"50%",
                border:`2px solid ${h?(h.goal?"#F59E0B":"rgba(255,255,255,.3)"):"rgba(255,255,255,.2)"}`,
                background:h?(h.goal?"rgba(245,158,11,.2)":"rgba(255,255,255,.1)"):"transparent",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,
                transition:"all .3s ease"
              }}>
                {h?(h.goal?"⚽":"✕"):""}
              </div>
            );
          })}
        </div>
      </div>

      {phase!=="intro"&&phase!=="end" && (
        <div style={{display:"flex",gap:24,marginBottom:12,alignItems:"center"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:700,color:"#F59E0B"}}>{goals}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:500}}>GOLS</div>
          </div>
          <div style={{width:1,height:36,background:"rgba(255,255,255,.15)"}}/>
          <div style={{fontSize:14,fontWeight:500,color:"rgba(255,255,255,.7)"}}>Chute {Math.min(qIdx+1,TOTAL_KICKS)}/{TOTAL_KICKS}</div>
          <div style={{width:1,height:36,background:"rgba(255,255,255,.15)"}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:700,color:"rgba(255,255,255,.4)"}}>{saves}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:500}}>DEF.</div>
          </div>
        </div>
      )}

      {/* INTRO */}
      {phase==="intro" && (
        <div className="fadeUp" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px",textAlign:"center",width:"100%"}}>
          <div style={{fontSize:80,marginBottom:16}}>⚽</div>
          <h1 style={{fontSize:28,fontWeight:700,color:"white",lineHeight:1.3,marginBottom:12}}>Pênaltis Hebraicos</h1>
          <p style={{color:"rgba(255,255,255,.8)",fontSize:15,lineHeight:1.6,marginBottom:24}}>Responda corretamente em hebraico para aumentar suas chances de gol</p>
          <div style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,padding:"24px",marginBottom:32,width:"100%"}}>
            <div style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
              <span style={{fontSize:20,marginTop:2}}>✅</span>
              <div><div style={{fontWeight:600,color:"white",fontSize:14}}>Resposta correta</div><div style={{color:"rgba(255,255,255,.6)",fontSize:13}}>Goleiro mais lento</div></div>
            </div>
            <div style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
              <span style={{fontSize:20,marginTop:2}}>❌</span>
              <div><div style={{fontWeight:600,color:"white",fontSize:14}}>Resposta errada</div><div style={{color:"rgba(255,255,255,.6)",fontSize:13}}>Goleiro mais rápido</div></div>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{fontSize:20,marginTop:2}}>🎯</span>
              <div><div style={{fontWeight:600,color:"white",fontSize:14}}>Arraste no gol</div><div style={{color:"rgba(255,255,255,.6)",fontSize:13}}>Mire sua posição</div></div>
            </div>
          </div>
          <button onClick={()=>setPhase("question")} style={{
            background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"white",
            padding:"18px 32px",borderRadius:12,fontWeight:700,fontSize:16,
            boxShadow:"0 6px 20px rgba(245,158,11,.3)",width:"100%"
          }}>
            Iniciar
          </button>
        </div>
      )}

      {/* QUESTION */}
      {phase==="question" && (
        <div className="fadeUp" style={{width:"100%",padding:"12px 24px 0",flex:1}}>
          <div style={{
            background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",
            borderRadius:16,padding:"24px",marginBottom:20,textAlign:"center"
          }}>
            <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.5)",marginBottom:12}}>Qual é a tradução?</div>
            <div style={{fontSize:48,direction:"rtl",fontWeight:700,color:"white",lineHeight:1.1}}>{currentQ.heb}</div>
            <div style={{color:"#FCD34D",fontWeight:600,fontSize:18,marginTop:8}}>{currentQ.tr}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {currentQ.opts.map(opt=>{
              const isSel=selectedOpt===opt,isCorrect=opt===currentQ.answer;
              let bg="rgba(255,255,255,.08)",border="rgba(255,255,255,.2)",color="white";
              if(selectedOpt){ 
                if(isCorrect){bg="rgba(245,158,11,.25)";border="#F59E0B";color="#FCD34D";} 
                else if(isSel){bg="rgba(239,68,68,.2)";border="#EF4444";color:"#FCA5A5";} 
              }
              return (
                <button key={opt} className={selectedOpt&&isSel&&!isCorrect?"shake":""} 
                  onClick={()=>handleAnswer(opt)} disabled={!!selectedOpt}
                  style={{
                    padding:"18px 16px",borderRadius:12,fontWeight:600,fontSize:15,
                    border:`1px solid ${border}`,background:bg,color,
                    transition:"all .2s ease", cursor: selectedOpt ? "default" : "pointer"
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {selectedOpt && (
            <div style={{
              marginTop:16,textAlign:"center",padding:"14px 20px",borderRadius:12,
              background:answeredCorrect?"rgba(245,158,11,.2)":"rgba(239,68,68,.15)",
              border:`1px solid ${answeredCorrect?"#F59E0B":"#EF4444"}`
            }}>
              <span style={{
                fontWeight:600,fontSize:15,
                color:answeredCorrect?"#FCD34D":"#FCA5A5"
              }}>
                {answeredCorrect?"✅ Correto!":"❌ Era '"+currentQ.answer+"'"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* AIM + SHOOT */}
      {(phase==="aim"||phase==="shooting") && (
        <div className="fadeUp" style={{width:"100%",padding:"12px 20px 0",flex:1,display:"flex",flexDirection:"column"}}>
          {phase==="aim" && (
            <div style={{textAlign:"center",marginBottom:12}}>
              <div style={{fontWeight:600,color:"white",fontSize:15}}>
                {answeredCorrect?"✅ Goleiro lento":"❌ Goleiro alerta"}
              </div>
              <div style={{color:"rgba(255,255,255,.6)",fontSize:13}}>
                {isDragging?"Solte para chutar":"Arraste para mirar"}
              </div>
            </div>
          )}

          <div ref={goalRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove}
            style={{width:"100%",touchAction:"none",cursor:phase==="aim"?"crosshair":"default",userSelect:"none"}}>
            <svg viewBox={`0 0 ${GW} ${GH+160}`} width="100%" style={{display:"block"}}>
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#047857"/>
                  <stop offset="100%" stopColor="#065F46"/>
                </linearGradient>
                <linearGradient id="pgs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669"/>
                  <stop offset="100%" stopColor="#10B981"/>
                </linearGradient>
                <filter id="glow2">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="shad2">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              <rect x="0" y={GH} width={GW} height="160" fill="url(#pg)"/>
              {[0,1,2,3,4].map(i=><rect key={i} x={i*80} y={GH} width="40" height="160" fill="url(#pgs)" opacity=".3"/>)}
              <circle cx={GW/2} cy={GH+130} r="4" fill="rgba(255,255,255,.5)"/>
              
              <rect x={GW*.18} y={GH} width={GW*.64} height="24" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/>
              <rect x={GW*.30} y={GH} width={GW*.40} height="12" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
              
              <rect x="12" y="6" width={GW-24} height={GH-8} fill="rgba(0,0,0,.15)" rx="2"/>
              {[0,1,2,3,4,5,6,7,8,9].map(i=>(
                <line key={`v${i}`} x1={12+i*(GW-24)/9} y1="6" x2={12+i*(GW-24)/9} y2={GH} stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
              ))}
              {[0,1,2,3,4,5,6].map(i=>(
                <line key={`h${i}`} x1="12" y1={6+i*(GH-6)/6} x2={GW-12} y2={6+i*(GH-6)/6} stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
              ))}
              
              <rect x="8" y="2" width={GW-16} height="6" fill="white" rx="3" filter="url(#shad2)"/>
              <rect x="8" y="2" width="6" height={GH} fill="white" rx="3" filter="url(#shad2)"/>
              <rect x={GW-14} y="2" width="6" height={GH} fill="white" rx="3" filter="url(#shad2)"/>
              
              {shotResult==="goal" && (
                <rect x="12" y="6" width={GW-24} height={GH-8} fill="rgba(245,158,11,.2)" rx="2">
                  <animate attributeName="opacity" values="0;1;0.7;1;0" dur="0.8s" fill="freeze"/>
                </rect>
              )}

              <KeeperSVG x={keeperX} gH={GH} anim={keeperAnim} shooting={phase==="shooting"}/>
              
              {phase==="aim" && (
                <g>
                  <circle cx={aimPct.x*GW} cy={aimPct.y*GH} r="18" fill="rgba(0,0,0,.2)"/>
                  <circle cx={aimPct.x*GW} cy={aimPct.y*GH} r="16" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 5" opacity=".9"/>
                  <circle cx={aimPct.x*GW} cy={aimPct.y*GH} r="5" fill="#F59E0B" filter="url(#glow2)"/>
                </g>
              )}

              <PenaltyBall x={ballSvg.x} y={ballSvg.y} stage={ballStage} shotResult={shotResult}/>
              
              {shotResult && (
                <g>
                  <rect x="50" y={GH/2-35} width={GW-100} height="70" rx="12" 
                    fill={shotResult==="goal"?"rgba(245,158,11,.95)":"rgba(30,58,138,.95)"} 
                    filter="url(#shad2)"/>
                  <text x={GW/2} y={GH/2+4} textAnchor="middle" fill="white" fontSize="24" fontWeight="700" fontFamily="Inter,sans-serif">
                    {shotResult==="goal"?"⚽ GOL!":"🧤 DEFESA!"}
                  </text>
                  {shotResult==="goal" && (
                    <text x={GW/2} y={GH/2+26} textAnchor="middle" fill="rgba(255,255,255,.8)" fontSize="13" fontFamily="Inter,sans-serif" fontWeight="600">
                      שַׁעַר!
                    </text>
                  )}
                </g>
              )}
            </svg>
          </div>

          {phase==="aim" && (
            <div style={{padding:"16px 0 24px"}}>
              <button onClick={shoot} style={{
                width:"100%",background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"white",
                padding:"18px",borderRadius:12,fontWeight:700,fontSize:16,
                boxShadow:"0 6px 20px rgba(245,158,11,.3)",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8
              }}>
                <span style={{fontSize:24}}>⚽</span>
                Chutar
              </button>
            </div>
          )}
        </div>
      )}

      {/* END */}
      {phase==="end" && (
        <div className="fadeUp" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px",textAlign:"center",width:"100%"}}>
          {goals>=3 && <PenaltyConfetti/>}
          <div style={{fontSize:72,marginBottom:16}}>{goals>=4?"🏆":goals>=3?"⭐":goals>=2?"⚽":"📖"}</div>
          <h2 style={{fontSize:26,fontWeight:700,color:"white",marginBottom:8}}>
            {goals>=4?"Excelente!":goals>=3?"Muito bom!":goals>=2?"Bom trabalho":"Continue praticando"}
          </h2>
          <div style={{
            background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",
            borderRadius:16,padding:"24px 28px",marginBottom:28,width:"100%"
          }}>
            <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.5)",marginBottom:16,textTransform:"uppercase",letterSpacing:"0.05em"}}>
              Resultado Final
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:32,marginBottom:20}}>
              <div><div style={{fontSize:48,fontWeight:700,color:"#F59E0B"}}>{goals}</div><div style={{fontSize:12,color:"rgba(255,255,255,.6)"}}>GOLS</div></div>
              <div style={{fontSize:36,color:"rgba(255,255,255,.2)",paddingTop:8}}>-</div>
              <div><div style={{fontSize:48,fontWeight:700,color:"rgba(255,255,255,.4)"}}>{saves}</div><div style={{fontSize:12,color:"rgba(255,255,255,.6)"}}>DEFESAS</div></div>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:10}}>
              {history.map((h,i)=>(
                <div key={i} style={{
                  width:40,height:40,borderRadius:10,
                  background:h.goal?"rgba(245,158,11,.25)":"rgba(255,255,255,.1)",
                  border:`1px solid ${h.goal?"#F59E0B":"rgba(255,255,255,.2)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20
                }}>
                  {h.goal?"⚽":"✕"}
                </div>
              ))}
            </div>
          </div>
          <button onClick={restart} style={{
            width:"100%",background:"linear-gradient(135deg,#F59E0B,#D97706)",color:"white",
            padding:"18px",borderRadius:12,fontWeight:700,fontSize:16,
            boxShadow:"0 6px 20px rgba(245,158,11,.3)"
          }}>
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
}

function KeeperSVG({ x, gH, anim, shooting }) {
  const tiltDeg = (anim==="diving"||anim==="saved") ? (x<200 ? -25 : 25) : 0;
  const S = 1.6;
  return (
    <g transform={`translate(${x}, ${gH - 8})`}>
      <g transform={`rotate(${tiltDeg})`}>
        <g transform={`scale(${S}) translate(-18, -68)`}>
          <ellipse cx="20" cy="68" rx="16" ry="4" fill="rgba(0,0,0,.25)"/>
          
          <rect x="10" y="48" width="8" height="20" fill="#F59E0B" rx="3"/>
          <rect x="22" y="48" width="8" height="20" fill="#F59E0B" rx="3"/>
          
          <rect x="7" y="64" width="12" height="6" fill="#111" rx="2"/>
          <rect x="21" y="64" width="12" height="6" fill="#111" rx="2"/>
          
          <rect x="6" y="20" width="28" height="32" fill="#1E40AF" rx="6"/>
          <rect x="6" y="28" width="28" height="4" fill="rgba(255,255,255,.2)" rx="2"/>
          
          <text x="20" y="40" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="Inter">1</text>
          
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
            : <path d="M 12 16 Q 20 20 28 16" stroke="#444" strokeWidth="1.2" fill="none"/>
          }
          
          <path d="M 6 6 Q 20 0 34 6 L 35 4 Q 20 -1 5 4 Z" fill="#F59E0B"/>
          <path d="M 7 6 Q 20 1 33 6 Q 20 3 7 6 Z" fill="#D97706" opacity=".6"/>
        </g>
      </g>
    </g>
  );
}

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
