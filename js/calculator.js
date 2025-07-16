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

import {
	changeLanguage,
	getBrowserLanguage,
	translateText,
} from "./translate.js";
// ==== REFERENCES ====
const refs = {
	depositInput: document.querySelector('[data-ref="deposit"]'),
	bonusMessage: document.querySelector('[data-ref="bonusMessage"]'),
	bonusText: document.querySelector(".calculator-text"),
	bonusButton: document.querySelector("[data-modal-open]"),
	modalText: document.querySelector(".modal-slot-text"),
	slots: [
		document.getElementById("slot1").querySelector(".icons"),
		document.getElementById("slot2").querySelector(".icons"),
		document.getElementById("slot3").querySelector(".icons"),
		document.getElementById("slot4").querySelector(".icons"),
	],
};

let intervalIds = [null, null, null, null];
let positions = [0, 0, 0, 0];
const typingDelay = 1000;
let typingTimer;

// ==== INIT ====
document.addEventListener("DOMContentLoaded", () => {
	const lang = getBrowserLanguage();
	changeLanguage(lang);
	disableBonusButton();

	refs.depositInput.addEventListener("input", handleInput);
	refs.bonusButton.addEventListener("click", () => {
		setTimeout(() => {
			clearBonusInfo();
		}, 1000);
	});
});

// ==== MAIN HANDLER ====
function handleInput() {
	clearTimeout(typingTimer);

	const rawValue = refs.depositInput.value.trim();

	// Якщо поле порожнє — нічого не робимо
	if (rawValue === "") {
		clearSlots();
		refs.bonusText.textContent = "";
		refs.bonusMessage.textContent = "";
		disableBonusButton();
		return;
	}

	const deposit = parseFloat(rawValue);

	refs.bonusText.textContent = "";
	refs.bonusMessage.textContent = "";
	startFastSpin();

	typingTimer = setTimeout(() => {
		if (isNaN(deposit) || deposit < 20) {
			clearSlots();
			refs.bonusText.setAttribute("data-translate", "minDeposit");
			refs.bonusText.textContent = translateText("minDeposit");
			refs.bonusMessage.textContent = "";
			disableBonusButton();
			return;
		}

		if (deposit > 3000) {
			clearSlots();
			refs.bonusText.textContent =
				translateText("maxDeposit 3000 USDT") || "Максимальна сума 3000 USDT";
			refs.bonusMessage.textContent = "";
			disableBonusButton();
			return;
		}

		const bonus = getApplicableBonus(deposit);
		if (!bonus) {
			clearSlots();
			refs.bonusText.textContent =
				translateText("noBonus") || "Немає бонусу для цієї ставки";
			refs.bonusMessage.textContent = "";
			disableBonusButton();
			return;
		}

		const raw = deposit * bonus.bonus;
		const amount = Math.min(Math.round(raw), bonus.upto);
		const fs = bonus.fs;

		stopSpinAndShowDigits(amount);
		updateBonusText(amount, fs);
		enableBonusButton();
	}, typingDelay);
}

// ==== ANIMATION ====
function startFastSpin() {
	refs.slots.forEach((slot, index) => {
		clearInterval(intervalIds[index]);
		fillSlotWithDigits(slot);

		const visibleHeight = 98;
		const iconCount = 20;
		const totalHeight = visibleHeight * iconCount;

		// 🎯 Випадкова початкова позиція
		positions[index] = -Math.floor(Math.random() * totalHeight);

		slot.style.top = positions[index] + "px";

		intervalIds[index] = setInterval(() => {
			positions[index] += 5;

			if (positions[index] >= totalHeight) positions[index] = 0;
			slot.style.top = positions[index] + "px";
		}, 16);
	});
}

function fillSlotWithDigits(slot) {
	slot.innerHTML = "";

	const iconCount = 10;
	const cloneCount = 3; // кількість копій для плавного зациклення

	// Основні цифри
	for (let i = 0; i < iconCount; i++) {
		const icon = document.createElement("div");
		icon.className = "icon";
		icon.textContent = i;
		slot.appendChild(icon);
	}

	// 🔁 Додаємо копії перших N цифр (для зациклення)
	for (let i = 0; i < cloneCount; i++) {
		const icon = document.createElement("div");
		icon.className = "icon";
		icon.textContent = i;
		slot.appendChild(icon);
	}
}
function stopSpinAndShowDigits(amount) {
	const digits = String(amount).padStart(4, " ").split("");

	// Головна — зупинка спіну
	refs.slots.forEach((slot, i) => {
		clearInterval(intervalIds[i]);
		slot.innerHTML = "";

		const digit = digits[i].trim();
		const icon = document.createElement("div");
		icon.className = "icon";
		icon.textContent = digit;
		slot.appendChild(icon);

		slot.style.top = "0px";
		positions[i] = 0;
	});

	// Модальне вікно — тільки цифри бонусу
	updateModalBonusDisplay(amount);
}

function clearSlots() {
	refs.slots.forEach((slot) => {
		slot.innerHTML = "";
		slot.style.top = "0px";
	});
	positions = [0, 0, 0, 0];
	intervalIds.forEach((id, i) => clearInterval(intervalIds[i]));
}

// ==== BONUS ====
function getApplicableBonus(deposit) {
	return bonuses.find((b) => deposit >= b.min && deposit <= b.max && b.depositNum === 1);
}

function updateBonusText(amount, fs) {
	refs.bonusText.setAttribute("data-translate", "yourBonus");
	refs.bonusText.textContent = translateText("yourBonus") || "Ваш бонус:";
	refs.bonusMessage.textContent = `${amount} USDT + ${fs} FS`;
}

function updateModalBonusDisplay(amount) {
	const digits = String(amount).padStart(4, " ").split("");
	refs.modalText.innerHTML = digits
		.map((d) => `<span class="modal-digit">${d.trim()}</span>`)
		.join("");
}

function clearBonusInfo() {
	refs.depositInput.value = "";
	clearSlots();
	refs.bonusMessage.textContent = "";
	refs.bonusText.textContent = "";
	disableBonusButton();
}

// ==== BUTTONS ====
export function disableBonusButton() {
	refs.bonusButton.disabled = true;
	refs.bonusButton.style.cursor = "not-allowed";
	refs.bonusButton.style.background = "rgba(99, 82, 255, 1)";
	refs.bonusButton.style.color = "rgba(198, 195, 205, 1)";
	refs.bonusButton.style.animation = "none";
}

export function enableBonusButton() {
	refs.bonusButton.disabled = false;
	refs.bonusButton.style.cursor = "pointer";
	refs.bonusButton.style.background = "rgba(79, 65, 202, 1)";
	refs.bonusButton.style.color = "rgba(255, 255, 255, 1)";
	refs.bonusButton.style.animation = "pulse 1.5s infinite";
}