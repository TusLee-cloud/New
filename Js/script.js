const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index){
  slides.forEach(s => s.classList.remove("active"));
  slides[index].classList.add("active");
}

setInterval(()=>{
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 6000); // 6 giây đổi ảnh


