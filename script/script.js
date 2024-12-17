const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguageDropdown = document.querySelector("#input-language"),
  outputLanguageDropdown = document.querySelector("#output-language");

function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = option.name;
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);
  });
}

populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");
  });

  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      //remove active class from current dropdowns
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    });
  });
});
document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

const swapBtn = document.querySelector(".swap-position"),
  inputLanguage = inputLanguageDropdown.querySelector(".selected"),
  outputLanguage = outputLanguageDropdown.querySelector(".selected"),
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", (e) => {
  const temp = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;

  const tempValue = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;

  //swap text
  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;

  translate();
});

// Словарь для прямой транслитерации (кириллица -> латиница)
const cyrillicToLatin = {
	А: 'A',
	Б: 'B',
	В: 'V',
	Г: 'G',
	Д: 'D',
	Е: 'E',
	Ё: 'JO',
	Ж: 'ZH',
	З: 'Z',
	И: 'I',
	Й: 'Y',
	К: 'K',
	Л: 'L',
	М: 'M',
	Н: 'N',
	О: 'O',
	П: 'P',
	Р: 'R',
	С: 'S',
	Т: 'T',
	У: 'U',
	Ф: 'F',
	Х: 'KH',
	Ц: 'C',
	Ч: 'CH',
	Ш: 'SH',
	Щ: 'SHH',
	Ъ: 'HH',
	Ы: 'IH',
	Ь: 'JH',
	Э: 'EH',
	Ю: 'JU',
	Я: 'JA',
}

// Словарь для обратной транслитерации (латиница -> кириллица)
const latinToCyrillic = Object.fromEntries(
	Object.entries(cyrillicToLatin).map(([k, v]) => [v, k])
)

function toCorPref(char, pref) {
	return pref
		? char.toLowerCase()
		: char.charAt(0).toUpperCase() + char.slice(1).toLowerCase()
}

function cyrillicToLatinTranslit(text) {
	let result = []

	for (let char of text) {
		let pref = char === char.toLowerCase() // Определяем, является ли символ строчным
		char = char.toUpperCase() // Приводим символ к верхнему регистру

		// Проверка символа на кириллический алфавит
		let translitChar = cyrillicToLatin[char] || char // Оставляем символ без изменений, если его нет в словаре

		result.push(toCorPref(translitChar, pref)) // Учитываем регистр символа
	}
	return result.join('')
}

function latinToCyrillicTranslit(text) {
	let result = []
	let i = 0

	while (i < text.length) {
		let char3 = text.slice(i, i + 3).toUpperCase()
		let char2 = text.slice(i, i + 2).toUpperCase()
		let char1 = text[i].toUpperCase()

		let pref3 = text.slice(i, i + 3).toLowerCase() === text.slice(i, i + 3)
		let pref2 = text.slice(i, i + 2).toLowerCase() === text.slice(i, i + 2)
		let pref1 = text[i].toLowerCase() === text[i]

		if (i < text.length - 2 && latinToCyrillic[char3]) {
			result.push(toCorPref(latinToCyrillic[char3], pref3))
			i += 3
		} else if (i < text.length - 1 && latinToCyrillic[char2]) {
			result.push(toCorPref(latinToCyrillic[char2], pref2))
			i += 2
		} else if (latinToCyrillic[char1]) {
			result.push(toCorPref(latinToCyrillic[char1], pref1))
			i += 1
		} else {
			result.push(char1) // Оставляем символ без изменений
			i += 1
		}
	}
	return result.join('')
}

function translate() {
	const inputText = inputTextElem.value
	const inputAlphabet =
		inputLanguageDropdown.querySelector('.selected').innerHTML
	const outputAlphabet =
		outputLanguageDropdown.querySelector('.selected').innerHTML
	//outputTextElem.value, inputText
  if (inputAlphabet === 'Latin to Cyrilic') {
		outputTextElem.value = latinToCyrillicTranslit(inputText)
	} else {
		outputTextElem.value = cyrillicToLatinTranslit(inputText)
	}
}
inputTextElem.addEventListener("input", (e) => {
  //limit input to 5000 characters
  if (inputTextElem.value.length > 5000) {
    inputTextElem.value = inputTextElem.value.slice(0, 5000);
  }
  translate();
});

const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    uploadTitle.innerHTML = file.name;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      inputTextElem.value = e.target.result;
      translate();
    };
  } else {
    alert("Please upload a valid file");
  }
});

const downloadBtn = document.querySelector("#download-btn");

downloadBtn.addEventListener("click", (e) => {
  const outputText = outputTextElem.value;
  const outputLanguage =
    outputLanguageDropdown.querySelector(".selected").dataset.value;
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `translated-to-${outputLanguage}.txt`;
    a.href = url;
    a.click();
  }
});

const darkModeCheckbox = document.getElementById("dark-mode-btn");

darkModeCheckbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", (e) => {
  inputChars.innerHTML = inputTextElem.value.length;
});
