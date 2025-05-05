const input = document.querySelector(".calculator-input");

input.addEventListener("input", () => {
	input.value = input.value.replace(/\D/g, ""); 
});
