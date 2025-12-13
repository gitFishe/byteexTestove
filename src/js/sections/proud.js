const titleEl = document.getElementById("slideTitle");
const galleryEl = document.querySelector(".swiper-gallery");

const swiper = new Swiper(galleryEl, {
	spaceBetween: 20,

	pagination: {
		el: galleryEl.querySelector(".swiper-pagination"),
		clickable: true,

		renderBullet(index, className) {
			const slides = galleryEl.querySelectorAll(".swiper-slide");
			const img = slides[index].querySelector("img");

			return `
        <span class="${className}">
          <img src="${img.getAttribute("src")}" alt="">
        </span>
      `;
		},
	},

	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},

	on: {
		init(sw) { updateTitle(sw); },
		slideChange(sw) { updateTitle(sw); },
	},
});

function updateTitle(sw) {
	const slide = sw.slides[sw.activeIndex];
	if (titleEl) titleEl.textContent = slide?.dataset?.title || "";
}


const swiperBrands = new Swiper('.swiper-brands', {

	spaceBetween:20,
	slidesPerView:3,
	loop:true,

	pagination: {
		el: ".swiper-brands__pagination",
		clickable: true,
	},

});