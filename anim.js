let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

setInterval(() => {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 3000); // 3 segundos
