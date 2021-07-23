const americanOnly = require('./american-only.js')
const americanToBritishSpelling = require('./american-to-british-spelling.js')
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishToAmericanTitles = require("./british-to-american-titles.js")
const britishOnly = require('./british-only.js')

// Reverse object key/value pairs
const reverseDict = (obj) =>
    Object.assign({}, ...Object.entries(obj).map(([k, v]) => ({ [v]: k })));

// American/British dictionary
const americanBritishDict = {
    ...americanOnly,
    ...americanToBritishSpelling,
};

// British/American dictionary
const reverseAmericanToBritishSpelling = reverseDict(americanToBritishSpelling);

const britishAmericanDict = {
    ...britishOnly,
    ...reverseAmericanToBritishSpelling,
};

// Translator logic
const translate = (str, locale) => {
    const originalStr = str;
    const lowerCasedOriginalStr = originalStr.toLowerCase();
    const translationType = locale;

    const dict =
        translationType === "american-to-british"
            ? americanBritishDict
            : britishAmericanDict;

    const titlesHonorificsDict =
        translationType === "american-to-british"
            ? americanToBritishTitles
            : britishToAmericanTitles;

    const timeRegex =
        translationType === "american-to-british"
            ? /([1-9]|1[012]):[0-5][0-9]/g
            : /([1-9]|1[012]).[0-5][0-9]/g;

    const matchesMap = {};

    // Search for titles/honorifics and add'em to the matchesMap object
    Object.entries(titlesHonorificsDict).map(([k, v]) => {
        if (lowerCasedOriginalStr.includes(k)) {
            let spl = v.split('')
            spl[0] = spl[0].toUpperCase()
            matchesMap[k] = spl.join('');
        }
    });

    // Filter words with spaces from current dictionary
    const wordsWithSpace = Object.fromEntries(
        Object.entries(dict).filter(([k, v]) => k.includes(" "))
    );

    // Search for spaced word matches and add'em to the matchesMap object
    Object.entries(wordsWithSpace).map(([k, v]) => {
        if (lowerCasedOriginalStr.includes(k)) {
            matchesMap[k] = v;
        }
    });

    // Search for individual word matches and add'em to the matchesMap object
    lowerCasedOriginalStr
        .match(/(\w+([-'])(\w+)?['-]?(\w+))|\w+/g)
        .map((word) => {
            if (dict[word]) return (matchesMap[word] = dict[word]);
        });

    // Search for time matches and add'em to the matchesMap object
    const matchedTimes = lowerCasedOriginalStr.match(timeRegex);

    if (matchedTimes) {
        matchedTimes.map((e) => {
            if (translationType === "american-to-british") {
                return (matchesMap[e] = e.replace(":", "."));
            }
            return (matchesMap[e] = e.replace(".", ":"));
        });
    }

    // No matches
    if (Object.keys(matchesMap).length === 0) return null;

    // Return logic
    const translation = replaceAll(originalStr, matchesMap);

    const translationWithHighlight = replaceAllWithHighlight(
        originalStr,
        matchesMap
    );

    return [translation, translationWithHighlight];
};

const replaceAll = (str, mapObj) => {
    const re = new RegExp(Object.keys(mapObj).join("|"), "gi");

    return str.replace(re, (matched) => mapObj[matched.toLowerCase()]);
};

const replaceAllWithHighlight = (str, mapObj) => {
    const re = new RegExp(Object.keys(mapObj).join("|"), "gi");

    return str.replace(re, (matched) => {
        return `<span class="highlight">${mapObj[matched.toLowerCase()]}</span>`;
    });
};

module.exports = translate;