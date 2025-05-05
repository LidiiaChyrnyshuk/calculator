// Мови і їхні переклади
const translations = {
	ru: {
		title: "Введи сумму и узнай",
		description: "свой бонус",
		deposit: "Введи сумму",
		minDeposit: "Минимальный депозит для получения бонуса – 20 USDT.",
		yourBonus: "Ваш бонус",
		bonusButton: "Забрать бонус",
		checkbox:
			"Ставя галочку в этом поле для регистрации на сайте, пользователь подтверждает, что ему больше 18 лет, и что он прочитал, понял и принял",
		terms: "Условия и положения",
		modalBtn: "Cоздать акаунт",
	},
	en: {
		title: "Enter the amount and find out",
		description: "your bonus",
		deposit: "Enter Amount",
		minDeposit: "Minimum deposit to receive the bonus – 20 USDT.",
		yourBonus: " Your bonus",
		bonusButton: "Claim Bonus",
		checkbox:
			"By ticking this box to register for this website, the user declares to be over 18 years old and to have read, understood and accepted",
		terms: "the Terms and Conditions",
		modalBtn: "Create an account",
	},
	hu: {
		title: "Add meg az összeget, és tudd meg",
		description: "a bónuszod",
		deposit: "Add meg az összeget",
		minDeposit:
			"A bónusz megszerzéséhez szükséges minimális befizetés  – 20 USDT.",
		yourBonus: "A bónuszod",
		bonusButton: "Bónusz igénylése",
		checkbox:
			"A jelölőnégyzet kipipálásával a felhasználó kijelenti, hogy elmúlt 18 éves, és elolvasta, megértette és elfogadta",
		terms: "a Felhasználási feltételeket",
		modalBtn: "Fiók létrehozása",
	},
	cs: {
		title: "Zadej částku a zjisti",
		description: "svůj bonus",
		deposit: "Zadejte částku ",
		minDeposit: "Minimální vklad pro získání bonusu  – 20 USDT.",
		yourBonus: "Zadejte částku",
		bonusButton: "Získat bonus ",
		checkbox:
			"Zaškrtnutím tohoto políčka pro registraci na webu uživatel potvrzuje, že je mu více než 18 let, a že si přečetl, pochopil a přijal",
		terms: "Podmínky použití",
		modalBtn: "Vytvořit účet",
	},
	pt: {
		title: "Insira o valor e descubra",
		description: " o seu bónus",
		deposit: "Introduz o valor",
		minDeposit: "Depósito mínimo para receber o bónus  – 20 USDT.",
		yourBonus: "O teu bónus",
		bonusButton: "Solicita bónus",
		checkbox:
			"Ao marcar esta caixa para se registar neste site, o utilizador declara ser maior de 18 anos e ter lido, compreendido e aceite",
		terms: "os Termos e Condições",
		modalBtn: "Criar uma conta",
	},
	tr: {
		title: "Tutarı gir ve",
		description: "bonusunu öğren",
		deposit: "Tutarı Girin",
		minDeposit: "Bonusu almak için minimum yatırım – 20 USDT.",
		yourBonus: "Bonusunuz",
		bonusButton: "Bonusu Al",
		checkbox:
			"Sitede kayıt için bu alana bir kene koyarak, kullanıcı 18 yaşından büyük olduğunu ve okuduğunu, anladığını ve kabul ettiğini doğrular.",
		terms: "Şartlar ve koşullar",
		modalBtn: "Bir hesap oluşturun",
	},
};

// Список підтримуваних мов
const supportedLanguages = ["ru", "en", "hu", "cs", "pt", "tr"];

export function getBrowserLanguage() {
	// Отримуємо мову браузера
	const userLang = navigator.language || navigator.userLanguage;
	const language = userLang.split("-")[0].toLowerCase(); 

	// Перевіряємо, чи підтримується мова
	if (supportedLanguages.includes(language)) {
		return language;
	}

	// Якщо мова не підтримується, використовуємо за замовчуванням "ru"
	return "ru";
}
export function changeLanguage(language) {
	const elements = document.querySelectorAll("[data-translate]");
	elements.forEach((element) => {
		const key = element.getAttribute("data-translate");
		const translatedText = translations[language]?.[key];
		if (translatedText) {
			element.textContent = translatedText;

			// Автоматичне масштабування шрифту, якщо текст не вміщується
			let fontSize = parseFloat(window.getComputedStyle(element).fontSize);
			const parentWidth =
				element.parentElement?.offsetWidth || element.offsetWidth;

			while (element.scrollWidth > parentWidth && fontSize > 10) {
				fontSize -= 1;
				element.style.fontSize = fontSize + "px";
			}
		}
	});
}

document.addEventListener("DOMContentLoaded", () => {
	const language = getBrowserLanguage();
	const boardTextElement = document.querySelector(".board-text");

	if (language === "tr" && boardTextElement) {
		boardTextElement.classList.add("tr-language-mobile");
	}
});

export function translateText(key) {
	return translations[browserLanguage][key] || key;
}


// Зміна мови на основі мови браузера
const browserLanguage = getBrowserLanguage();
changeLanguage(browserLanguage);
