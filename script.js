/* ================================================================
   TECLADO FÔNICO — som das letras (fonemas) em pt-BR
   ================================================================ */
const ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PALETTE=[
  {c:'#ff5d5d',d:'#c93a3a',i:'#fff'},
  {c:'#ff9f43',d:'#d07417',i:'#fff'},
  {c:'#ffd93d',d:'#cfa707',i:'#5b4300'},
  {c:'#5ecc71',d:'#3fa44e',i:'#fff'},
  {c:'#4dd0c5',d:'#229e94',i:'#fff'},
  {c:'#4d96ff',d:'#2e6ed9',i:'#fff'},
  {c:'#b983ff',d:'#8b54d9',i:'#fff'},
  {c:'#ff7bac',d:'#d94f86',i:'#fff'},
];
const palOf=L=>PALETTE[ALPHA.indexOf(L)%PALETTE.length];

/* Cache de áudios carregados */
const audioCache={};

/* Carrega arquivo MP3 do banco de áudios */
function loadAudioFile(path){
  return new Promise((resolve,reject)=>{
    if(audioCache[path]){resolve(audioCache[path]);return;}
    const audio=new Audio(path);
    audio.addEventListener('canplaythrough',()=>{
      audioCache[path]=audio;
      resolve(audio);
    });
    audio.addEventListener('error',()=>reject(new Error(`Failed to load: ${path}`)));
    audio.load();
  });
}

/* Tenta tocar fonema ou nome via MP3, fallback para TTS */
async function playLetterAudio(L,type){
  const folder=type==='fonema'?'fonema':'letras';
  const filename=`${L.toLowerCase()}.mp3`;
  const path=`audio/${folder}/${filename}`;
  
  try{
    const audio=await loadAudioFile(path);
    audio.currentTime=0;
    await audio.play();
    return true;
  }catch(e){
    // Fallback para síntese de voz se MP3 não existir
    return false;
  }
}

/* ph = fonema falado {t:texto, r:velocidade, p:tom}
   Plosivas: fala acelerada => "bê/pê/quê" bem curtinho (convenção fônica). */
const LETTERS={
 A:{ph:{t:'á!',r:.85,p:1.15}, nm:'á',       ipa:'a',  vow:1, word:'abelha',    emoji:'🐝', tip:'Boca bem aberta, como um grito feliz!'},
 B:{ph:{t:'bê',r:1.7},        nm:'bê',      ipa:'b',  word:'bola',      emoji:'⚽', tip:'Feche e solte os lábios: b!'},
 C:{ph:{t:'quê',r:1.7},       nm:'cê',      ipa:'k',  word:'casa',      emoji:'🏠', tip:'Som seco no fundo da garganta.'},
 D:{ph:{t:'dê',r:1.7},        nm:'dê',      ipa:'d',  word:'dado',      emoji:'🎲', tip:'Língua bate no céu da boca: d!'},
 E:{ph:{t:'é!',r:.85,p:1.15}, nm:'é',       ipa:'ɛ',  vow:1, word:'elefante',  emoji:'🐘', tip:'Boca entreaberta: é!'},
 F:{ph:{t:'fffff',r:.7},      nm:'éfe',     ipa:'f',  word:'foca',      emoji:'🦭', tip:'Dente de cima no lábio de baixo: ffff!'},
 G:{ph:{t:'guê',r:1.7},       nm:'gê',      ipa:'g',  word:'gato',      emoji:'🐱', tip:'Som macio lá na garganta: g!'},
 H:{ph:null,                  nm:'agá',     ipa:'–',  silent:1, word:'hipopótamo', emoji:'🦛', tip:'O H é silencioso… shhhh! 🤫'},
 I:{ph:{t:'i!',r:.85,p:1.15}, nm:'i',       ipa:'i',  vow:1, word:'ilha',      emoji:'🏝️', tip:'Sorriso bem esticado: iii!'},
 J:{ph:{t:'jê',r:1.6},        nm:'jota',    ipa:'ʒ',  word:'janela',    emoji:'🪟', tip:'Zumbido forte com a língua: j!'},
 K:{ph:{t:'quê',r:1.7},       nm:'cá',      ipa:'k',  word:'kiwi',      emoji:'🥝', tip:'Igual ao C: som seco na garganta.'},
 L:{ph:{t:'lllll',r:.75},     nm:'ele',     ipa:'l',  word:'leão',      emoji:'🦁', tip:'A língua encosta no céu da boca: lll!'},
 M:{ph:{t:'mmmmm',r:.7},      nm:'eme',     ipa:'m',  word:'macaco',    emoji:'🐵', tip:'Lábios fechados, som pelo nariz: mmm!'},
 N:{ph:{t:'nnnnn',r:.7},      nm:'ene',     ipa:'n',  word:'navio',     emoji:'🚢', tip:'Língua no céu da boca, som pelo nariz: nnn!'},
 O:{ph:{t:'ó!',r:.85,p:1.15}, nm:'ó',       ipa:'ɔ',  vow:1, word:'ovo',       emoji:'🥚', tip:'Boca redondinha: ó!'},
 P:{ph:{t:'pê',r:1.7},        nm:'pê',      ipa:'p',  word:'pato',      emoji:'🦆', tip:'Os lábios explodem sem voz: p!'},
 Q:{ph:{t:'quê',r:1.7},       nm:'quê',     ipa:'k',  word:'queijo',    emoji:'🧀', tip:'Sempre vem com U e faz som de K!'},
 R:{ph:{t:'rrrrr',r:.7},      nm:'erre',    ipa:'ʁ',  word:'rato',      emoji:'🐭', tip:'Raspadinho forte na garganta: rrr!'},
 S:{ph:{t:'sssss',r:.7},      nm:'esse',    ipa:'s',  word:'sapo',      emoji:'🐸', tip:'Soprinho de cobra: ssss!'},
 T:{ph:{t:'tê',r:1.7},        nm:'tê',      ipa:'t',  word:'tartaruga', emoji:'🐢', tip:'Língua atrás dos dentes: t!'},
 U:{ph:{t:'u!',r:.85,p:1.15}, nm:'u',       ipa:'u',  vow:1, word:'uva',       emoji:'🍇', tip:'Biquinho redondo: uuu!'},
 V:{ph:{t:'vvvvv',r:.7},      nm:'vê',      ipa:'v',  word:'vaca',      emoji:'🐮', tip:'Dente no lábio, vibrando: vvv!'},
 W:{ph:{t:'uuu',r:.85},       nm:'dáblio',  ipa:'w',  word:'wafer',     emoji:'🍫', tip:'Biquinho de U!'},
 X:{ph:{t:'shhhh',r:.7},      nm:'xis',     ipa:'ʃ',  word:'xícara',    emoji:'☕', tip:'Shh! Pedindo silêncio!'},
 Y:{ph:{t:'i!',r:.85,p:1.1},  nm:'ípsilon', ipa:'i',  vow:1, word:'yoga',      emoji:'🧘', tip:'Som de I, sorriso esticado!'},
 Z:{ph:{t:'zzzzz',r:.7},      nm:'zê',      ipa:'z',  word:'zebra',     emoji:'🦓', tip:'Abelhinha vibrando: zzz!'},
};
const H_SAY='Shhhh! O H não tem som! Ele é silencioso!';
const ROUNDS=5;
const state={mode:'som',challenge:false,stars:0,target:null,lastTarget:null,lastLetter:null,locked:false};

/* ========== MODO FONEMAS COMPLETOS (31 fonemas) ========== */
// Lista completa dos 31 fonemas do Português Brasileiro
const PHONEMES = [
    // Vogais Orais (7)
    { symbol: 'a', name: 'a', example: 'mar', type: 'vogal-oral', ipa: 'a', graphemes: ['a'], examples: [{word: 'm**a**r', highlight: 'a'}, {word: 'c**a**sa', highlight: 'a'}, {word: 'b**a**la', highlight: 'a'}] },
    { symbol: 'e', name: 'e fechado', example: 'medo', type: 'vogal-oral', ipa: 'e', graphemes: ['e'], examples: [{word: 'm**e**do', highlight: 'e'}, {word: 'p**e**lo', highlight: 'e'}, {word: 'd**e**nte', highlight: 'e'}] },
    { symbol: 'ɛ', name: 'e aberto', example: 'pé', type: 'vogal-oral', ipa: 'ɛ', graphemes: ['e', 'é', 'ê'], examples: [{word: 'p**é**', highlight: 'é'}, {word: 'caf**é**', highlight: 'é'}, {word: 'l**e**ite', highlight: 'e'}] },
    { symbol: 'i', name: 'i', example: 'vida', type: 'vogal-oral', ipa: 'i', graphemes: ['i'], examples: [{word: 'v**i**da', highlight: 'i'}, {word: 'l**i**vro', highlight: 'i'}, {word: 'n**i**to', highlight: 'i'}] },
    { symbol: 'o', name: 'o fechado', example: 'doce', type: 'vogal-oral', ipa: 'o', graphemes: ['o'], examples: [{word: 'd**o**ce', highlight: 'o'}, {word: 'b**o**la', highlight: 'o'}, {word: 'p**o**vo', highlight: 'o'}] },
    { symbol: 'ɔ', name: 'o aberto', example: 'pó', type: 'vogal-oral', ipa: 'ɔ', graphemes: ['o', 'ó', 'ô'], examples: [{word: 'p**ó**', highlight: 'ó'}, {word: 'av**ó**', highlight: 'ó'}, {word: 'p**o**rta', highlight: 'o'}] },
    { symbol: 'u', name: 'u', example: 'tudo', type: 'vogal-oral', ipa: 'u', graphemes: ['u'], examples: [{word: 't**u**do', highlight: 'u'}, {word: 'l**u**a', highlight: 'u'}, {word: 'm**u**ro', highlight: 'u'}] },
    
    // Vogais Nasais (5)
    { symbol: 'ã', name: 'ã', example: 'fã', type: 'vogal-nasal', ipa: 'ã', graphemes: ['ã', 'am', 'an'], examples: [{word: 'f**ã**', highlight: 'ã'}, {word: 'c**am**po', highlight: 'am'}, {word: 's**an**to', highlight: 'an'}] },
    { symbol: 'ẽ', name: 'ẽ', example: 'sento', type: 'vogal-nasal', ipa: 'ẽ', graphemes: ['em', 'en'], examples: [{word: 's**en**to', highlight: 'en'}, {word: 'b**em**', highlight: 'em'}, {word: 'm**en**ino', highlight: 'en'}] },
    { symbol: 'ĩ', name: 'ĩ', example: 'lindo', type: 'vogal-nasal', ipa: 'ĩ', graphemes: ['im', 'in'], examples: [{word: 'l**in**do', highlight: 'in'}, {word: 's**im**', highlight: 'im'}, {word: 't**in**ta', highlight: 'in'}] },
    { symbol: 'õ', name: 'õ', example: 'ponte', type: 'vogal-nasal', ipa: 'õ', graphemes: ['õ', 'om', 'on'], examples: [{word: 'p**on**te', highlight: 'on'}, {word: 'b**om**', highlight: 'om'}, {word: 'c**or**ação', highlight: 'õ'}] },
    { symbol: 'ũ', name: 'ũ', example: 'mundo', type: 'vogal-nasal', ipa: 'ũ', graphemes: ['um', 'un'], examples: [{word: 'm**un**do', highlight: 'un'}, {word: 'alg**um**', highlight: 'um'}, {word: '**um**', highlight: 'um'}] },
    
    // Consoantes Oclusivas (6)
    { symbol: 'p', name: 'pê', example: 'pato', type: 'consoante-oclusiva', ipa: 'p', graphemes: ['p'], examples: [{word: '**p**ato', highlight: 'p'}, {word: '**p**ele', highlight: 'p'}, {word: 'ca**mp**o', highlight: 'p'}] },
    { symbol: 'b', name: 'bê', example: 'bola', type: 'consoante-oclusiva', ipa: 'b', graphemes: ['b'], examples: [{word: '**b**ola', highlight: 'b'}, {word: '**b**oca', highlight: 'b'}, {word: 'tam**b**ém', highlight: 'b'}] },
    { symbol: 't', name: 'tê', example: 'tempo', type: 'consoante-oclusiva', ipa: 't', graphemes: ['t'], examples: [{word: '**t**empo', highlight: 't'}, {word: '**t**oalha', highlight: 't'}, {word: 'ga**t**o', highlight: 't'}] },
    { symbol: 'd', name: 'dê', example: 'dado', type: 'consoante-oclusiva', ipa: 'd', graphemes: ['d'], examples: [{word: '**d**ado', highlight: 'd'}, {word: '**d**edo', highlight: 'd'}, {word: 'sau**d**ade', highlight: 'd'}] },
    { symbol: 'k', name: 'cá/quê', example: 'casa', type: 'consoante-oclusiva', ipa: 'k', graphemes: ['c', 'qu', 'k'], examples: [{word: '**c**asa', highlight: 'c'}, {word: '**qu**ejo', highlight: 'qu'}, {word: '**k**iwi', highlight: 'k'}] },
    { symbol: 'g', name: 'gá/guê', example: 'gato', type: 'consoante-oclusiva', ipa: 'g', graphemes: ['g', 'gu'], examples: [{word: '**g**ato', highlight: 'g'}, {word: '**gu**erra', highlight: 'gu'}, {word: 'fo**g**o', highlight: 'g'}] },
    
    // Consoantes Fricativas (6)
    { symbol: 'f', name: 'efe', example: 'faca', type: 'consoante-fricativa', ipa: 'f', graphemes: ['f'], examples: [{word: '**f**aca', highlight: 'f'}, {word: '**f**ogo', highlight: 'f'}, {word: 'sof**á**', highlight: 'f'}] },
    { symbol: 'v', name: 'vê', example: 'vela', type: 'consoante-fricativa', ipa: 'v', graphemes: ['v'], examples: [{word: '**v**ela', highlight: 'v'}, {word: '**v**ida', highlight: 'v'}, {word: 'no**v**o', highlight: 'v'}] },
    { symbol: 's', name: 'esse', example: 'sapo', type: 'consoante-fricativa', ipa: 's', graphemes: ['s', 'ss', 'ç', 'c', 'sc', 'xc'], examples: [{word: '**s**apo', highlight: 's'}, {word: 'ca**ss**a', highlight: 'ss'}, {word: 'ça**p**ato', highlight: 'ç'}, {word: '**c**edo', highlight: 'c'}] },
    { symbol: 'z', name: 'zê', example: 'zebra', type: 'consoante-fricativa', ipa: 'z', graphemes: ['z', 's'], examples: [{word: '**z**ebra', highlight: 'z'}, {word: 'ca**s**a', highlight: 's'}, {word: 'me**s**a', highlight: 's'}] },
    { symbol: 'ʃ', name: 'xe', example: 'chave', type: 'consoante-fricativa', ipa: 'ʃ', graphemes: ['ch', 'x'], examples: [{word: '**ch**ave', highlight: 'ch'}, {word: '**x**adrez', highlight: 'x'}, {word: 'pei**x**e', highlight: 'x'}] },
    { symbol: 'ʒ', name: 'je', example: 'jacaré', type: 'consoante-fricativa', ipa: 'ʒ', graphemes: ['j', 'g'], examples: [{word: '**j**acaré', highlight: 'j'}, {word: '**g**elo', highlight: 'g'}, {word: 'via**g**em', highlight: 'g'}] },
    
    // Consoantes Nasais (3)
    { symbol: 'm', name: 'eme', example: 'mala', type: 'consoante-nasal', ipa: 'm', graphemes: ['m'], examples: [{word: '**m**ala', highlight: 'm'}, {word: '**m**esa', highlight: 'm'}, {word: 'so**m**', highlight: 'm'}] },
    { symbol: 'n', name: 'ene', example: 'navio', type: 'consoante-nasal', ipa: 'n', graphemes: ['n'], examples: [{word: '**n**avio', highlight: 'n'}, {word: '**n**inho', highlight: 'n'}, {word: 'bo**m**', highlight: 'n'}] },
    { symbol: 'ɲ', name: 'enhe', example: 'banho', type: 'consoante-nasal', ipa: 'ɲ', graphemes: ['nh'], examples: [{word: 'ba**nh**o', highlight: 'nh'}, {word: 'ni**nh**o', highlight: 'nh'}, {word: 'so**nh**o', highlight: 'nh'}] },
    
    // Consoantes Líquidas (4)
    { symbol: 'l', name: 'ele', example: 'laranja', type: 'consoante-liquida', ipa: 'l', graphemes: ['l'], examples: [{word: '**l**aranja', highlight: 'l'}, {word: '**l**ivro', highlight: 'l'}, {word: 'so**l**', highlight: 'l'}] },
    { symbol: 'ʎ', name: 'elhe', example: 'folha', type: 'consoante-liquida', ipa: 'ʎ', graphemes: ['lh'], examples: [{word: 'fo**lh**a', highlight: 'lh'}, {word: 'fi**lh**o', highlight: 'lh'}, {word: 'traba**lh**o', highlight: 'lh'}] },
    { symbol: 'r', name: 'erre brando', example: 'caro', type: 'consoante-liquida', ipa: 'ɾ', graphemes: ['r'], examples: [{word: 'ca**r**o', highlight: 'r'}, {word: 'a**r**ara', highlight: 'r'}, {word: 'ba**r**ata', highlight: 'r'}] },
    { symbol: 'R', name: 'erre forte', example: 'rato', type: 'consoante-liquida', ipa: 'ʁ', graphemes: ['r', 'rr'], examples: [{word: '**r**ato', highlight: 'r'}, {word: 'ca**rr**o', highlight: 'rr'}, {word: 'po**r**ta', highlight: 'r'}] }
];

// Função para carregar áudio de fonema
async function playPhonemeAudio(symbol){
    const path = `audio/fonema/${symbol}.mp3`;
    try{
        const audio = await loadAudioFile(path);
        audio.currentTime = 0;
        await audio.play();
        return true;
    }catch(e){
        return false;
    }
}

// Falar fonema usando TTS como fallback
function speakPhonemeBySymbol(symbol, name){
    if(!HAS_TTS) return;
    clearTimeout(speakTimer);
    try{speechSynthesis.cancel();}catch(e){}
    speakTimer=setTimeout(()=>{
        const u = new SpeechSynthesisUtterance(name);
        u.lang = 'pt-BR';
        if(voice) u.voice = voice;
        u.rate = 0.8;
        u.pitch = 1.0;
        u.volume = 1;
        try{speechSynthesis.speak(u);}catch(e){}
    }, 60);
}

// Criar grade de fonemas se existir o elemento
function createPhonemeGrid(){
    const grid = document.getElementById('phoneme-grid');
    if(!grid) return;
    
    grid.innerHTML = '';
    PHONEMES.forEach(ph => {
        const card = document.createElement('div');
        card.className = `phoneme-card ${ph.type}`;
        card.innerHTML = `
            <div class="phoneme-symbol">${ph.symbol}</div>
            <div class="phoneme-name">${ph.name}</div>
            <div class="phoneme-example">${ph.example}</div>
        `;
        card.addEventListener('click', async () => {
            const played = await playPhonemeAudio(ph.symbol);
            if(!played) speakPhonemeBySymbol(ph.symbol, ph.name);
        });
        grid.appendChild(card);
    });
}

// Alternar entre teclado padrão e modo completo de fonemas
let completeMode = false;
function togglePhonemesSection(){
    completeMode = !completeMode;
    const btn = document.getElementById('btnTogglePhonemes');
    if(!btn) return;
    
    btn.textContent = completeMode ? '⌨️ Voltar ao teclado normal' : '🎯 Ver todos os 31 fonemas';
    
    // Recriar o teclado com o modo apropriado (as funções já limpam o kb.innerHTML)
    if(completeMode){
        renderCompletePhonemeKeyboard();
    }else{
        renderStandardKeyboard();
    }
}

// Renderizar teclado padrão (alfabeto)
function renderStandardKeyboard(){
    // Limpa o teclado antes de renderizar para evitar duplicação
    kb.innerHTML = '';
    gi=0;
    ROWS.forEach(row=>{
        const r=document.createElement('div');r.className='kb-row';
        [...row].forEach(ch=>{
            const d=LETTERS[ch],pal=palOf(ch);
            const b=document.createElement('button');
            b.type='button';b.className='key';b.dataset.l=ch;
            b.style.cssText=`--c:${pal.c};--cd:${pal.d};--ki:${pal.i};--i:${gi}`;
            b.setAttribute('aria-label',`Letra ${ch}. Palavra: ${d.word}.`);
            b.innerHTML=`<span class="kl">${ch}</span><span class="ke">${d.emoji}</span>`;
            b.addEventListener('click',()=>pressKey(b));
            r.appendChild(b);gi++;
        });
        kb.appendChild(r);
    });
}

// Renderizar teclado completo com 31 fonemas
function renderCompletePhonemeKeyboard(){
    // Limpa o teclado antes de renderizar para evitar duplicação
    kb.innerHTML = '';
    const phonemeRows = [
        // Vogais Orais (7)
        ['a', 'e', 'ɛ', 'i', 'o', 'ɔ', 'u'],
        // Vogais Nasais (5)
        ['ã', 'ẽ', 'ĩ', 'õ', 'ũ'],
        // Consoantes Oclusivas (6)
        ['p', 'b', 't', 'd', 'k', 'g'],
        // Consoantes Fricativas (6)
        ['f', 'v', 's', 'z', 'ʃ', 'ʒ'],
        // Consoantes Nasais (3)
        ['m', 'n', 'ɲ'],
        // Consoantes Líquidas (4)
        ['l', 'ʎ', 'r', 'R']
    ];
    
    gi = 0;
    const typeColors = {
        'vogal-oral': {c:'#ff9f43',d:'#d07417',i:'#fff'},
        'vogal-nasal': {c:'#ffd93d',d:'#cfa707',i:'#5b4300'},
        'consoante-oclusiva': {c:'#ff5d5d',d:'#c93a3a',i:'#fff'},
        'consoante-fricativa': {c:'#4dc06b',d:'#3fa44e',i:'#fff'},
        'consoante-nasal': {c:'#4d96ff',d:'#2e6ed9',i:'#fff'},
        'consoante-liquida': {c:'#b983ff',d:'#8b54d9',i:'#fff'}
    };
    
    phonemeRows.forEach((row, rowIndex)=>{
        const r=document.createElement('div');r.className='kb-row';
        row.forEach(symbol=>{
            const ph = PHONEMES.find(p => p.symbol === symbol);
            if(!ph) return;
            const colors = typeColors[ph.type] || typeColors['vogal-oral'];
            const b=document.createElement('button');
            b.type='button';b.className='key phoneme-key';b.dataset.phoneme=symbol;
            b.style.cssText=`--c:${colors.c};--cd:${colors.d};--ki:${colors.i};--i:${gi}`;
            b.setAttribute('aria-label',`Fonema ${symbol}. Exemplo: ${ph.example}.`);
            b.innerHTML=`<span class="kl">/${symbol}/</span><span class="ke" style="font-size:0.8em">${ph.example}</span>`;
            b.addEventListener('click', async ()=>{
                const played = await playPhonemeAudio(symbol);
                if(!played) speakPhonemeBySymbol(symbol, ph.name);
                showPhonemeDetails(ph);
            });
            r.appendChild(b);gi++;
        });
        kb.appendChild(r);
    });
}

// Inicializar teclado padrão e botão ao carregar
document.addEventListener('DOMContentLoaded', ()=>{
    renderStandardKeyboard();
    const btn = document.getElementById('btnTogglePhonemes');
    if(btn){
        btn.addEventListener('click', togglePhonemesSection);
    }
    
    // Renderizar palco inicial
    renderStageDefault();
});

/* ---------- áudio musical (Web Audio) ---------- */
let actx=null;
function ensureAudio(){
  const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return null;
  if(!actx)actx=new AC();
  if(actx.state==='suspended')actx.resume();
  return actx;
}
function tone(f,{dur=.3,type='triangle',gain=.4,delay=0}={}){
  const a=ensureAudio(); if(!a)return;
  const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();
  o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(.0001,t);
  g.gain.exponentialRampToValueAtTime(gain,t+.02);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(a.destination);o.start(t);o.stop(t+dur+.05);
}
function keyNote(i){ // escala pentatônica = sempre agradável
  const penta=[0,2,4,7,9];
  const deg=penta[i%5]+12*Math.floor((i%15)/5);
  const f=262*Math.pow(2,deg/12);
  tone(f,{dur:.35}); tone(f*2,{dur:.2,gain:.1,type:'sine'});
}
const arp=()=>[0,4,7,12].forEach((d,i)=>tone(392*Math.pow(2,d/12),{dur:.5,gain:.35,delay:i*.12}));
const fanfare=()=>{arp();setTimeout(arp,550);setTimeout(()=>[0,4,7,12,16].forEach((d,i)=>tone(523*Math.pow(2,d/12),{dur:.6,gain:.3,delay:i*.11})),1150);};
const nope=()=>tone(150,{dur:.28,type:'sine',gain:.28});

/* ---------- fala (Web Speech, pt-BR) ---------- */
const HAS_TTS='speechSynthesis' in window;
let voice=null,speakTimer=null;
function loadVoices(){
  if(!HAS_TTS)return;
  const vs=speechSynthesis.getVoices(); if(!vs.length)return;
  const sc=v=>{let s=0;const l=(v.lang||'').toLowerCase().replace('_','-');
    if(l==='pt-br')s+=10;else if(l.startsWith('pt'))s+=7;
    const n=(v.name||'').toLowerCase();
    if(/google/.test(n))s+=2;
    if(/francisca|luciana|maria|nicole|humia|antonia|daniel/.test(n))s+=2;
    if(/natural|online/.test(n))s+=1;return s;};
  voice=vs.slice().sort((a,b)=>sc(b)-sc(a))[0];
}
if(HAS_TTS){loadVoices();speechSynthesis.addEventListener&&speechSynthesis.addEventListener('voiceschanged',loadVoices);}
function speak(text,{rate=1,pitch=1.05}={}){
  if(!HAS_TTS||!text)return;
  clearTimeout(speakTimer);
  try{speechSynthesis.cancel();}catch(e){}
  speakTimer=setTimeout(()=>{
    const u=new SpeechSynthesisUtterance(text);
    u.lang='pt-BR'; if(voice)u.voice=voice;
    u.rate=rate;u.pitch=pitch;u.volume=1;
    try{speechSynthesis.speak(u);}catch(e){}
  },60);
}
async function speakPhoneme(L){const d=LETTERS[L];
  if(d.silent){speak(H_SAY,{rate:.95,pitch:1.12});return;}
  const played=await playLetterAudio(L,'fonema');
  if(!played)speak(d.ph.t,{rate:d.ph.r,pitch:d.ph.p||1.02});
}
async function speakName(L){
  const played=await playLetterAudio(L,'letras');
  if(!played)speak(LETTERS[L].nm,{rate:.95,pitch:1.05});
}
async function speakByMode(L){if(state.mode==='som')await speakPhoneme(L);else await speakName(L);}

/* ---------- construção do teclado ---------- */
const kb=document.getElementById('kb');
const ROWS=['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'];
let gi=0;
// A renderização inicial é feita pelo DOMContentLoaded para evitar duplicação
const keyBtn=L=>document.querySelector(`.key[data-l="${L}"]`);

/* ---------- palco ---------- */
const stage=document.getElementById('stage'),stageBox=document.getElementById('stageBox');
function renderStageDefault(){
  stageBox.innerHTML=`<div class="idle">
    <div class="idle-emoji">🎹</div>
    <div class="idle-t">Aperte uma tecla!</div>
    <div class="idle-s">Você vai ouvir o <b>som</b> que a letra faz. Depois, repita bem alto! 📣</div>
  </div>`;
}
function badge(d){
  if(d.silent)return '<span class="badge h">🤫 SILENCIOSA</span>';
  return d.vow?'<span class="badge v">VOGAL</span>':'<span class="badge c">CONSOANTE</span>';
}
function letterHTML(L,success){
  const d=LETTERS[L],pal=palOf(L);
  return `<div class="show">
    <div class="show-left">
      <div class="show-letter" style="color:${pal.d}">${L}</div>${badge(d)}
    </div>
    <div class="show-main">
      ${success?'<div class="idle-t" style="color:#2e9e44">ACERTOU! 🎉</div>':''}
      <div class="show-wordline"><span class="show-emoji">${d.emoji}</span><span class="show-word">${d.word}</span></div>
      <div class="show-tip">👄 ${d.tip}</div>
      <div class="show-ipa">fonema&nbsp;/&nbsp;${d.ipa}&nbsp;/</div>
      ${success?'':`<div class="show-actions">
        <button type="button" class="mini-btn" id="btnReplay">🔁 Ouvir de novo</button>
        <button type="button" class="mini-btn" id="btnWord">🗣️ Ouvir a palavra</button>
      </div>`}
    </div>
  </div>`;
}
function showLetter(L){
  state.lastLetter=L;
  stageBox.innerHTML=letterHTML(L,false);
  const rp=document.getElementById('btnReplay'),w=document.getElementById('btnWord');
  rp&&rp.addEventListener('click',()=>speakByMode(L));
  w&&w.addEventListener('click',()=>speak(LETTERS[L].word,{rate:.95,pitch:1.08}));
  speakByMode(L);
}

/* ---------- detalhes do fonema (modo completo) ---------- */
function formatWordHighlight(wordWithMarkers){
  // Transforma "**p**ato" em "<span class='highlight'>p</span>ato"
  return wordWithMarkers.replace(/\*\*(.+?)\*\*/g, '<span class="highlight">$1</span>');
}

function phonemeDetailsHTML(ph){
  const graphemesList = ph.graphemes.join(', ');
  const examplesHTML = ph.examples.map(ex => 
    `<div class="example-item">${formatWordHighlight(ex.word)}</div>`
  ).join('');
  
  const typeLabel = {
    'vogal-oral': 'Vogal Oral',
    'vogal-nasal': 'Vogal Nasal',
    'consoante-oclusiva': 'Consoante Oclusiva',
    'consoante-fricativa': 'Consoante Fricativa',
    'consoante-nasal': 'Consoante Nasal',
    'consoante-liquida': 'Consoante Líquida'
  }[ph.type] || ph.type;
  
  return `<div class="phoneme-detail">
    <div class="phoneme-header">
      <div class="phoneme-symbol-large">/${ph.symbol}/</div>
      <div class="phoneme-type-badge">${typeLabel}</div>
    </div>
    <div class="phoneme-info">
      <div class="info-section">
        <div class="info-label">🔊 Som do fonema</div>
        <button type="button" class="btn-audio-phoneme" id="btnPhonemeAudio">🔊 Ouvir som</button>
      </div>
      <div class="info-section">
        <div class="info-label">✍️ Formas de escrita (grafemas)</div>
        <div class="graphemes-list">${graphemesList}</div>
      </div>
      <div class="info-section">
        <div class="info-label">📚 Exemplos de palavras</div>
        <div class="examples-list">${examplesHTML}</div>
      </div>
    </div>
  </div>`;
}

function showPhonemeDetails(ph){
  stageBox.innerHTML = phonemeDetailsHTML(ph);
  
  // Tocar áudio do fonema ao clicar no botão
  const btnAudio = document.getElementById('btnPhonemeAudio');
  if(btnAudio){
    btnAudio.addEventListener('click', async ()=>{
      const played = await playPhonemeAudio(ph.symbol);
      if(!played) speakPhonemeBySymbol(ph.symbol, ph.name);
    });
  }
  
  // Tocar áudio automaticamente
  playPhonemeAudio(ph.symbol).catch(()=>speakPhonemeBySymbol(ph.symbol, ph.name));
}

/* ---------- efeitos ---------- */
function spawnNote(x,y){
  const n=document.createElement('span');
  n.className='fnote';
  n.textContent=['♪','♫','♬','✨'][Math.floor(Math.random()*4)];
  n.style.left=x+'px';n.style.top=y+'px';
  n.style.color=PALETTE[Math.floor(Math.random()*PALETTE.length)].d;
  document.body.appendChild(n);setTimeout(()=>n.remove(),1100);
}
function burst(x,y,n=26){
  for(let k=0;k<n;k++){
    const p=document.createElement('i');p.className='confetti';
    const pal=PALETTE[Math.floor(Math.random()*PALETTE.length)];
    const sz=7+Math.random()*8;
    p.style.cssText=`width:${sz}px;height:${sz}px;background:${pal.c};border-radius:${Math.random()<.5?'50%':'3px'}`;
    const ang=Math.random()*Math.PI*2,dist=70+Math.random()*150;
    p.style.setProperty('--x0',x+'px');p.style.setProperty('--y0',y+'px');
    p.style.setProperty('--x1',(x+Math.cos(ang)*dist)+'px');
    p.style.setProperty('--y1',(y+Math.abs(Math.sin(ang))*dist+90)+'px');
    p.style.setProperty('--rot',(Math.random()*720-360)+'deg');
    p.style.setProperty('--t',(0.8+Math.random()*.6)+'s');
    document.body.appendChild(p);setTimeout(()=>p.remove(),1500);
  }
}
function rain(n=70){
  const w=innerWidth,h=innerHeight;
  for(let k=0;k<n;k++){
    setTimeout(()=>{
      const p=document.createElement('i');p.className='confetti';
      const pal=PALETTE[Math.floor(Math.random()*PALETTE.length)];
      const sz=8+Math.random()*9;
      p.style.cssText=`width:${sz}px;height:${sz}px;background:${pal.c};border-radius:${Math.random()<.5?'50%':'3px'}`;
      const x=Math.random()*w;
      p.style.setProperty('--x0',x+'px');p.style.setProperty('--y0','-24px');
      p.style.setProperty('--x1',(x+Math.random()*120-60)+'px');
      p.style.setProperty('--y1',(h+40)+'px');
      p.style.setProperty('--rot',(Math.random()*900-450)+'deg');
      p.style.setProperty('--t',(1.4+Math.random()*1.2)+'s');
      document.body.appendChild(p);setTimeout(()=>p.remove(),2900);
    },k*22);
  }
}

/* ---------- interação ---------- */
async function pressKey(btn){
  if(state.locked)return;
  const L=btn.dataset.l;
  btn.classList.add('pressed');setTimeout(()=>btn.classList.remove('pressed'),170);
  keyNote(ALPHA.indexOf(L));
  const r=btn.getBoundingClientRect();
  spawnNote(r.left+r.width/2,r.top+r.height*.3);
  if(state.challenge){handleAnswer(L,btn);return;}
  showLetter(L);
  await speakByMode(L);
}

/* modo som/nome */
const modeSom=document.getElementById('modeSom'),modeNome=document.getElementById('modeNome');
function setMode(m){
  state.mode=m;
  modeSom.classList.toggle('on',m==='som');modeNome.classList.toggle('on',m==='nome');
  modeSom.setAttribute('aria-pressed',m==='som');modeNome.setAttribute('aria-pressed',m==='nome');
  if(state.challenge){renderPrompt();setTimeout(()=>speakTarget(),500);}
}
modeSom.addEventListener('click',()=>setMode('som'));
modeNome.addEventListener('click',()=>setMode('nome'));

/* ---------- Caça-Sons ---------- */
const btnHunt=document.getElementById('btnHunt'),starsEl=document.getElementById('stars');
for(let i=0;i<ROUNDS;i++){const s=document.createElement('span');s.className='st';s.textContent='★';starsEl.appendChild(s);}
function updateStars(){[...starsEl.children].forEach((s,i)=>s.classList.toggle('on',i<state.stars));}
const POOL=ALPHA.split('').filter(l=>l!=='H');
function pickTarget(){
  let t;do{t=POOL[Math.floor(Math.random()*POOL.length)];}while(t===state.lastTarget);
  state.lastTarget=t;return t;
}
function renderPrompt(){
  const som=state.mode==='som';
  stageBox.innerHTML=`<div class="prompt">
    <div class="pq">${som?'Qual letra faz esse som? 🤔':'Cadê a letra com esse nome? 🧐'}</div>
    <div class="pemoji">👂</div>
    <button type="button" class="btn btn-replay" id="btnReplay">🔊 Ouvir de novo</button>
    <div class="pmsg" id="pmsg"></div>
  </div>`;
  document.getElementById('btnReplay').addEventListener('click',()=>speakTarget());
}
async function speakTarget(){
  if(!state.target)return;
  if(state.mode==='som')await speakPhoneme(state.target);else await speakName(state.target);
}
function nextRound(){
  state.target=pickTarget();
  renderPrompt();
  setTimeout(()=>speakTarget(),700);
}
function handleAnswer(L,btn){
  if(!state.target)return;
  if(L===state.target){
    state.locked=true;
    btn.classList.add('good');setTimeout(()=>btn.classList.remove('good'),520);
    arp();
    const r=btn.getBoundingClientRect();
    burst(r.left+r.width/2,r.top+r.height/2);
    state.stars++;updateStars();
    stage.classList.remove('yay');void stage.offsetWidth;stage.classList.add('yay');
    stageBox.innerHTML=letterHTML(L,true);
    setTimeout(()=>speak(LETTERS[L].word,{rate:.95,pitch:1.1}),450);
    setTimeout(()=>{
      state.locked=false;
      if(state.stars>=ROUNDS)celebrate();else nextRound();
    },2100);
  }else{
    btn.classList.remove('shake');void btn.offsetWidth;btn.classList.add('shake');
    nope();
    const m=document.getElementById('pmsg');
    if(m){m.textContent='Ops! Ouça outra vez… 👂';m.classList.remove('on');void m.offsetWidth;m.classList.add('on');}
    setTimeout(()=>speakTarget(),650);
  }
}
function startChallenge(){
  state.challenge=true;state.stars=0;state.locked=false;
  updateStars();starsEl.hidden=false;
  btnHunt.textContent='⌨️ Teclado livre';
  nextRound();
}
function exitChallenge(){
  state.challenge=false;state.target=null;state.locked=false;
  starsEl.hidden=true;
  btnHunt.textContent='🎯 Caça-Sons';
  if(HAS_TTS)try{speechSynthesis.cancel();}catch(e){}
  renderStageDefault();
}
btnHunt.addEventListener('click',()=>state.challenge?exitChallenge():startChallenge());

/* vitória */
const overlay=document.getElementById('overlay');
function celebrate(){
  overlay.hidden=false;
  rain(80);fanfare();
  speak('Uau! Você ganhou cinco estrelas! Mandou muito bem!',{pitch:1.15,rate:.95});
}
document.getElementById('btnAgain').addEventListener('click',()=>{
  overlay.hidden=true;state.stars=0;updateStars();nextRound();
});
document.getElementById('btnFree').addEventListener('click',()=>{overlay.hidden=true;exitChallenge();});

/* ---------- teclado físico + extras ---------- */
addEventListener('keydown',e=>{
  if(e.repeat||!overlay.hidden)return;
  const k=(e.key||'').toUpperCase();
  if(/^[A-Z]$/.test(k)){const b=keyBtn(k);if(b)pressKey(b);}
  else if(e.code==='Space'){
    e.preventDefault();
    if(state.challenge)speakTarget();
    else if(state.lastLetter)speakByMode(state.lastLetter);
  }
});
/* desbloqueio de áudio/fala no primeiro toque (iOS/Android) */
document.addEventListener('pointerdown',function unlock(){
  ensureAudio();loadVoices();
  if(HAS_TTS){try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;u.lang='pt-BR';speechSynthesis.speak(u);}catch(e){}}
  document.removeEventListener('pointerdown',unlock);
});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden&&HAS_TTS)try{speechSynthesis.cancel();}catch(e){}
});
/* tecla "piscando" para chamar atenção */
setInterval(()=>{
  if(document.hidden||state.challenge)return;
  const keys=document.querySelectorAll('.key');
  const k=keys[Math.floor(Math.random()*keys.length)];
  k.classList.add('wiggle');setTimeout(()=>k.classList.remove('wiggle'),950);
},8000);

/* ---------- início ---------- */
renderStageDefault();
