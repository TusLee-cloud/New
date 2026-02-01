/* =====================================================
   CONFIG
===================================================== */
const NAME_KEY = "visitorName";
const TIME_KEY = "visitorNameTime";
const LIXI_KEY = "lixi_result";

/* thời gian tồn tại tên (phút) */
const EXPIRE_MINUTES = 10;
const EXPIRE_TIME = EXPIRE_MINUTES * 60 * 1000;

/* =====================================================
   HÀM DÙNG CHUNG
===================================================== */
function getUserName(){
  return localStorage.getItem(NAME_KEY) || "bạn";
}

function getSavedName(){
  const name = localStorage.getItem(NAME_KEY);
  const time = localStorage.getItem(TIME_KEY);

  if(!name || !time) return null;

  if(Date.now() - Number(time) > EXPIRE_TIME){
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(TIME_KEY);
    localStorage.removeItem(LIXI_KEY);
    return null;
  }
  return name;
}

/* =====================================================
   OVERLAY NHẬP TÊN
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  const overlay   = document.getElementById("overlay");
  const logArea   = document.getElementById("logArea");
  const inputLine = document.getElementById("inputLine");
  const nameInput = document.getElementById("nameInput");
  const hint      = document.getElementById("hint");

  if (!overlay || !logArea || !inputLine || !nameInput) return;

  /* ================= LOG SYSTEM ================= */
  const logs = [
    "[SYSTEM] KHỞI ĐỘNG GIAO DIỆN TẾT 2026...",
    "[SECURITY] KIỂM TRA LÌ XÌ...",
    "[DATA] NẠP MAY MẮN & TÀI LỘC...",
    "[ACCESS] TRUY CẬP THÀNH CÔNG ✔",
    "[INPUT] XIN PHÉP CHO BIẾT QUÝ DANH..."
  ];

  let logIndex   = 0;
  let charIndex  = 0;
  let inputShown = false; // 🔒 khóa không cho hiện sớm

  function showInputOnce(){
    if (inputShown) return;
    inputShown = true;

    inputLine.classList.remove("hidden");
    hint?.classList.remove("hidden");

    // mobile: focus sau 1 nhịp nhỏ
    setTimeout(() => {
      nameInput.focus();
    }, 300);
  }

  function typeLog(){
    // ✅ chỉ khi CHẠY HẾT TOÀN BỘ logs
    if (logIndex === logs.length) {
      showInputOnce();
      return;
    }

    if (!logArea.children[logIndex]) {
      const div = document.createElement("div");
      div.className = "line";
      logArea.appendChild(div);
    }

    const line   = logs[logIndex];
    const lineEl = logArea.children[logIndex];

    lineEl.textContent += line.charAt(charIndex);
    charIndex++;

    if (charIndex < line.length) {
      setTimeout(typeLog, 40);
    } else {
      // xong 1 dòng
      charIndex = 0;
      logIndex++;
      setTimeout(typeLog, 500);
    }
  }

  /* ================= ĐÃ CÓ TÊN TRƯỚC ĐÓ ================= */
  const savedName = typeof getSavedName === "function" ? getSavedName() : null;

  if (savedName) {
    overlay.classList.add("exit");
    setTimeout(() => overlay.remove(), 300);
    window.dispatchEvent(new Event("username-ready"));
    return;
  }

  // 🔥 bắt đầu chạy log
  typeLog();

  /* ================= INPUT THẬT ================= */
  nameInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const name = nameInput.value.trim();
    if (!name) return;

    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(TIME_KEY, Date.now());

    window.dispatchEvent(new Event("username-ready"));

    overlay.classList.add("exit");
    setTimeout(() => overlay.remove(), 800);
  });

});


/* =====================================================
   GÕ LỜI CHÚC + HIỆN LÌ XÌ
===================================================== */
document.addEventListener("DOMContentLoaded", ()=>{

  let typingDone = false;
  let nameReady  = false;

  const wishBox  = document.querySelector(".wish-box");
  const wishText = document.getElementById("wishText");
  const lixiBox  = document.getElementById("lixiBox");

  if(!wishBox || !wishText || !lixiBox) return;

  lixiBox.classList.remove("lixi-show");

  function getWishLines(){
    return [
      `Xin chào ${getUserName()}`,
      "Tiền vô như nước – Lộc tràn",
      "như xuân 2026"
    ];
  }

  function typeLines(lines){
    wishText.innerHTML = "";

    let lineIndex = 0;
    let charIndex = 0;

    let lineEl = document.createElement("div");
    lineEl.className = "wish-line";
    wishText.appendChild(lineEl);

    const timer = setInterval(()=>{
      const line = lines[lineIndex];
      const char = line.charAt(charIndex);

      lineEl.textContent += char;
      charIndex++;

      if(charIndex === line.length){
        lineIndex++;
        charIndex = 0;

        if(lineIndex === lines.length){
          clearInterval(timer);
          lixiBox.classList.add("lixi-show");
          return;
        }

        lineEl = document.createElement("div");
        lineEl.className = "wish-line";
        wishText.appendChild(lineEl);
      }
    }, 80);
  }

  function tryStart(){
    if(typingDone || !nameReady) return;
    typingDone = true;
    typeLines(getWishLines());
  }

  if(localStorage.getItem(NAME_KEY)){
    nameReady = true;
  }

  window.addEventListener("username-ready", ()=>{
    nameReady = true;
    tryStart();
  });

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        tryStart();
      }
    });
  },{ threshold: 0.4 });

  observer.observe(wishBox);
});

/* =====================================================
   LÌ XÌ SLOT – GHÉP SỐ TIỀN
===================================================== */
function formatVND(num){
  return Number(num).toLocaleString("vi-VN") + " VND";
}

function randomMoney(){
  return Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
}

/* ================== DIALOG (GLOBAL) ================== */
let dialog, closeBt, upload, preview, sendBtn;

function openWishDialog(){
  if(!dialog) return;
  dialog.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeWishDialog(){
  debugger
  dialog.classList.remove("show");
  document.body.style.overflow = "";
}

/* ================== MAIN ================== */
document.addEventListener("DOMContentLoaded", ()=>{

/* ---------- LÌ XÌ ---------- */
  const envelope = document.getElementById("lixiEnvelope");
  const lixiText = document.getElementById("lixiText");
  const slots    = document.querySelectorAll(".slot");
  const openBtn  = document.getElementById("openDialogBtn");

  if(envelope && slots.length === 6){

    let rolling = false;

    const saved = localStorage.getItem(LIXI_KEY);
    if(saved){
      const digits = String(saved).padStart(6,"0").split("");
      slots.forEach((s,i)=> s.textContent = digits[i]);
      lixiText.innerHTML = `🎉 Bạn nhận được <b>${formatVND(saved)}</b>`;
      openBtn?.classList.remove("hidden");
    }

    envelope.addEventListener("click", ()=>{
      if(rolling || localStorage.getItem(LIXI_KEY)) return;
      debugger

      rolling = true;
      lixiText.textContent = "🎰 Đang quay số lì xì...";
      openBtn?.classList.add("hidden");

      const money  = randomMoney();
      const digits = String(money).padStart(6,"0").split("");

      function rollSlot(index){
        const slot = slots[index];
        slot.classList.add("active");

        const timer = setInterval(()=>{
          slot.textContent = Math.floor(Math.random() * 10);
        }, 70);

        setTimeout(()=>{
          clearInterval(timer);
          slot.classList.remove("active");
          slot.textContent = digits[index];

          if(index === slots.length - 1){
            localStorage.setItem(LIXI_KEY, money);
            lixiText.innerHTML = `Bạn nhận được <b>${formatVND(money)}</b>`;
            openBtn?.classList.remove("hidden");
            rolling = false;
          }else{
            rollSlot(index + 1);
          }
        }, 600 + index * 120);
      }

      rollSlot(0);
    });

    openBtn?.addEventListener("click", openWishDialog);
  }

/* ---------- DIALOG TOÀN MÀN ---------- */
  const dialog  = document.getElementById("finalDialog");
  const closeBt = document.getElementById("closeFinal");
  const upload  = document.getElementById("uploadImg");
  const preview = document.getElementById("previewImg");
  const pickBox = document.getElementById("imagePick");
  const sendBtn = document.getElementById("sendBtn");

  if(!dialog || !upload || !preview) return;

  /* ===== MỞ / ĐÓNG DIALOG ===== */
  function openWishDialog(){
    dialog.classList.add("show");
  }

  function closeWishDialog(){
    dialog.classList.remove("show");
  }

  closeBt.onclick = closeWishDialog;

  /* ===== CLICK KHUNG → CHỌN ẢNH ===== */
  pickBox.onclick = ()=>{
    upload.click();
  };

  /* ===== PREVIEW ẢNH ===== */
  upload.onchange = ()=>{
    const file = upload.files[0];
    if(!file) return;

    if(!file.type.startsWith("image/")){
      alert("Chỉ được chọn ảnh");
      upload.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = ()=>{
      preview.src = reader.result;
      preview.style.display = "block";
      pickBox.classList.add("has-img");
    };
    reader.readAsDataURL(file);
  };

  /* ===== GỬI ===== */
  sendBtn.onclick = ()=>{
    if(!upload.files.length){
      alert("Bạn chưa chọn ảnh");
      return;
    }
    submitPopupImage()
  };
});

function getFinalMoney(){
  return localStorage.getItem(LIXI_KEY) || "0";
}

function submitPopupImage() {

  const fileInput = document.getElementById("uploadImg");
  const file = fileInput.files[0];

  /* chưa chọn ảnh */
  if (!file) {
    notify("❌ Vui lòng chọn ảnh trước khi gửi!", "error");
    return;
  }

  const finalMoney = getFinalMoney();
  if (!finalMoney) {
    notify("❌ Không tìm thấy số lì xì!", "error");
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      const formData = new FormData();
      formData.append("name", getUserName());
      formData.append("email", finalMoney); // số lì xì
      formData.append("image", reader.result.split(",")[1]);
      formData.append("imageName", file.name);
      formData.append("imageType", file.type);

      const res = await fetch(
        "https://upload-api.tulevan600.workers.dev/",
        {
          method: "POST",
          body: formData
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      /* ✅ THÔNG BÁO THÀNH CÔNG */
      notify("🎉 Gửi ảnh thành công! Lì xì đã được ghi nhận 🧧");

      /* đóng dialog + clear sau 1 chút cho mượt */
      setTimeout(()=>{
        document.getElementById("finalDialog").classList.remove("show");
      }, 1300);

    } catch (err) {
      console.error(err);
      notify("❌ Gửi ảnh thất bại! Vui lòng thử lại", "error");
    }
  };

  reader.readAsDataURL(file);
}

function notify(msg, type = "success", time = 2000){
  debugger
  const n = document.getElementById("notify");
  if(!n) return;

  n.textContent = msg;
  n.className = "";
  n.classList.add("show");

  if(type === "error"){
    n.classList.add("error");
  }

  clearTimeout(n._timer);
  n._timer = setTimeout(()=>{
    n.classList.remove("show");
  }, time);
}
