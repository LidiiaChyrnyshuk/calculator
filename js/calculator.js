const bonuses = [
	{
		min: 20,
		max: 499,
		bonus: 1.0,
		upto: 1000,
		fs: 80,
		depositNum: 1,
		type: "Welcome Bonus",
	},
	{
		min: 500,
		max: 999,
		bonus: 1.1,
		upto: 3000,
		fs: 80,
		depositNum: 1,
		type: "Boost Bonus",
	},
	{
		min: 1000,
		max: 3000,
		bonus: 1.25,
		upto: 3000,
		fs: 100,
		depositNum: 1,
		type: "High Roller Bonus",
	},
	{
		min: 30,
		max: 999,
		bonus: 1.0,
		upto: 1000,
		fs: 40,
		depositNum: 2,
		type: "Welcome Bonus",
	},
	{
		min: 500,
		max: 1999,
		bonus: 1.1,
		upto: 2000,
		fs: 40,
		depositNum: 2,
		type: "Boost Bonus",
	},
	{
		min: 1000,
		max: 3000,
		bonus: 1.25,
		upto: 2000,
		fs: 60,
		depositNum: 2,
		type: "High Roller Bonus",
	},
	{
		min: 50,
		max: 999,
		bonus: 0.75,
		upto: 1000,
		fs: 80,
		depositNum: 3,
		type: "Welcome Bonus",
	},
	{
		min: 500,
		max: 1999,
		bonus: 0.9,
		upto: 2000,
		fs: 80,
		depositNum: 3,
		type: "Boost Bonus",
	},
	{
		min: 1000,
		max: 3000,
		bonus: 1.0,
		upto: 2000,
		fs: 100,
		depositNum: 3,
		type: "High Roller Bonus",
	},
];
import { changeLanguage, getBrowserLanguage, translateText } from "./translate";

const refsBonus = {
	depositInput: document.querySelector('[data-ref="deposit"]'),
	bonusOutput: document.querySelector(".calculator-bonus"),
	bonusMessage: document.querySelector('[data-ref="bonusMessage"]'),
	bonusText: document.querySelector(".calculator-text"),
	modalText: document.querySelector(".modal-slot-text"),
	bonusButton: document.querySelector("[data-modal-open]"),
};

// Ініціалізація
document.addEventListener("DOMContentLoaded", () => {
		const lang = getBrowserLanguage();
	changeLanguage(lang);
	disableBonusButton();
	refsBonus.depositInput.addEventListener("input", calculateBonus);
	refsBonus.bonusButton.addEventListener("click", () => {
		setTimeout(() => {
			clearBonusInfo();
		}, 1000); // даємо трохи часу модалці відкритися
	});
});


function calculateBonus() {
	let deposit = refsBonus.depositInput.value.trim();

	if (deposit === "") {
		clearBonusDisplay();
		refsBonus.bonusMessage.textContent = " ";
		refsBonus.bonusText.textContent = " ";
		disableBonusButton();
		return;
	}

	deposit = parseFloat(deposit);

	if (isNaN(deposit)) {
		clearBonusDisplay();
		refsBonus.bonusMessage.textContent = " ";

		disableBonusButton();
		return;
	}

	if (deposit < 20) {
		refsBonus.bonusText.setAttribute("data-translate", "minDeposit");
		refsBonus.bonusText.textContent = translateText("minDeposit");
		refsBonus.bonusMessage.textContent = "";
		clearBonusDisplay();
		disableBonusButton();
		return;
	}

	const applicableBonus = bonuses.find(
		(b) => deposit >= b.min && deposit <= b.max && b.depositNum === 1
	);

	if (applicableBonus) {
		const bonusAmount = Math.round(
			deposit * applicableBonus.bonus,
			applicableBonus.upto
		);
		const rounded = Math.round(bonusAmount);
	
		const freeSpins = applicableBonus.fs;

		const digits = `${rounded}`.split("");
		const totalSlots = 4;
		const paddedDigits = Array.from(
			{ length: totalSlots },
			(_, i) => digits[i] || ""
		);

		refsBonus.bonusOutput.innerHTML = paddedDigits
			.map((digit) => `<span class="calculator-digit">${digit}</span>`)
			.join("");

		const modalDigits = `${rounded}`.split("");
		const paddedModalDigits = Array.from(
			{ length: 4 },
			(_, i) => modalDigits[i] || ""
		);

		refsBonus.modalText.innerHTML = paddedModalDigits
			.map((d) => `<span class="modal-digit">${d}</span>`)
			.join("");
		refsBonus.bonusText.setAttribute("data-translate", "yourBonus");
		refsBonus.bonusText.textContent = translateText("yourBonus");
		refsBonus.bonusMessage.textContent = `${rounded} USDT + ${freeSpins} FS`;

		enableBonusButton();
	} else {
		clearBonusDisplay();
		refsBonus.bonusMessage.textContent = "";
		disableBonusButton();
	}
}

function clearBonusDisplay() {
	refsBonus.bonusOutput.textContent = "";
}

function clearBonusInfo() {
	refsBonus.depositInput.value = "";
	clearBonusDisplay();
	refsBonus.bonusMessage.textContent = " ";
	refsBonus.bonusText.textContent = " ";
	disableBonusButton();
}

function disableBonusButton() {
	refsBonus.bonusButton.disabled = true;
	refsBonus.bonusButton.style.cursor = "not-allowed";
	refsBonus.bonusButton.style.background = "rgba(99, 82, 255, 1)";
	refsBonus.bonusButton.style.color = "rgba(198, 195, 205, 1)";
}

function enableBonusButton() {
	refsBonus.bonusButton.disabled = false;
	refsBonus.bonusButton.style.cursor = "pointer";
	refsBonus.bonusButton.style.background = "rgba(79, 65, 202, 1)";
	refsBonus.bonusButton.style.color = "rgba(255, 255, 255, 1)";
}
