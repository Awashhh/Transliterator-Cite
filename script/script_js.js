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
	Ъ: 'JHH',
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

// Функция для транслитерации кириллицы в латиницу
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

// Функция для обратной транслитерации латиницы в кириллицу
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

// Пример использования
const textCyrillic = 'Я Бв я'
const textLatin = cyrillicToLatinTranslit(textCyrillic)
console.log('Транслитерация в латиницу:', textLatin)

const textCyrillicBack = latinToCyrillicTranslit(textLatin)
console.log('Обратная транслитерация в кириллицу:', textCyrillicBack)
