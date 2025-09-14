import removeAccents from 'remove-accents';
import Stemmer from 'snowball-stemmers';
const fstemmer = Stemmer.newStemmer('french');

const stopwords = new Set([
    'point', 'points', 'pt', 'pts'
]);

export function sanitize(text) {
    text = text.toLowerCase();
    text = removeAccents(text);
    text = text.replace(/[()0-9+]/g, ' ');

    let tokens = text.split(/\s+/).filter(t => t.length > 0);
    tokens = tokens.map(t => t.replace(/[^a-z]/g, '')).filter(t => t.length > 0);
    tokens = tokens.filter(t => !stopwords.has(t));
    tokens = tokens.map(t => fstemmer.stem(t));
    tokens = tokens.map(t => t.trim().replace(/-+/g, '_')).filter(t => t.length > 0);
    return tokens.join(' ');
}

console.log(sanitize("Calamars à la romaine ( 5 Points)"));
console.log(sanitize("Calamars a la romaine"));
console.log(sanitize("Calamars à la romaine 5 pts"));
console.log(sanitize("Poisson frais du jour ( 7 Points+)"));
console.log(sanitize("Box: Pâtes sauce crème cheddar                   6 Points"));
console.log(sanitize("Barquette: Poisson blanc à la bordelaise/ Riz 5 Points"));
console.log(sanitize(""));


