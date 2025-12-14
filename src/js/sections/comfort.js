const swiperComfort = new Swiper('.comfort-swiper', {
	spaceBetween:40,
	slidesPerView:3,

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	breakpoints: {
		0: {
			slidesPerView: 1,
		},
		768: {
			slidesPerView: 3,
		},
	},
});