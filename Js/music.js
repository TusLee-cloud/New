/* ===== AUDIO WAVEFORM FULL ===== */
const audio = document.getElementById("audio");
const waveWrap = document.getElementById("wave");
const cur = document.getElementById("cur");
const dur = document.getElementById("dur");
const pp = document.getElementById("pp");
const iconPath = document.getElementById("iconPath");

const COUNT = 70;
const waves = [];
let started = false;

/* ===== SVG ICON PATH ===== */
const ICON_PLAY  = "M8 5v14l11-7z";
const ICON_PAUSE = "M6 4h4v16H6zm8 0h4v16h-4z";

/* mặc định */
iconPath.setAttribute("d", ICON_PLAY);

/* ===== TẠO WAVE ===== */
for(let i = 0; i < COUNT; i++){
  const w = document.createElement("div");
  w.className = "wave";
  w.style.height = Math.random() * 60 + 20 + "%";
  waveWrap.appendChild(w);
  waves.push(w);
}

/* ===== FORMAT TIME ===== */
const f = t => {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

/* ===== LOAD META ===== */
audio.addEventListener("loadedmetadata", () => {
  dur.innerText = "-" + f(audio.duration);
});

/* ===== SYNC WAVE + TIME ===== */
audio.addEventListener("timeupdate", () => {
  if(!audio.duration) return;

  const p = audio.currentTime / audio.duration;
  const active = Math.floor(p * COUNT);

  waves.forEach((w, i) => {
    w.classList.toggle("active", i < active);
    if(i < active){
      w.style.height = Math.random() * 70 + 30 + "%";
    }
  });

  cur.innerText = f(audio.currentTime);
  dur.innerText = "-" + f(audio.duration - audio.currentTime);
});

/* ===== CLICK ANYWHERE → AUTO PLAY (1 LẦN) ===== */
document.addEventListener("click", async () => {
  if(started) return;
  started = true;

  try{
    await audio.play();
  }catch(e){
    console.warn("Autoplay blocked");
  }
},{ once:true });

/* ===== PLAY / PAUSE BUTTON ===== */
pp.addEventListener("click", async e => {
  e.stopPropagation();
  started = true;

  if(audio.paused){
    await audio.play();
  }else{
    audio.pause();
  }
});

/* ===== SYNC ICON SVG ===== */
audio.addEventListener("play", () => {
  iconPath.setAttribute("d", ICON_PAUSE);
  pp.classList.add("playing");
});

audio.addEventListener("pause", () => {
  iconPath.setAttribute("d", ICON_PLAY);
  pp.classList.remove("playing");
});

/* ===== CLICK WAVE → SEEK (+ PLAY NẾU PAUSE) ===== */
waveWrap.addEventListener("click", e => {
  e.stopPropagation();

  const r = waveWrap.getBoundingClientRect();
  audio.currentTime = (e.clientX - r.left) / r.width * audio.duration;

  if(audio.paused){
    audio.play();
  }
});

