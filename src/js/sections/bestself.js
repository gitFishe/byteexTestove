const textElem = document.querySelector(".bestself-text__dynamic");

const data = {
	name: "Test Name",
	founded: "2030",
};


textElem.innerText =
	`Hi! My name’s ${data.name}, and I founded in ${data.founded}.`;
textElem.classList.remove("loading");