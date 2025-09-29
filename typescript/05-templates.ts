/**
 * Return a random entry from the list
 * 
 * @param list
 * @returns
 */
function pickRandom<T>(list: T[]): T {
	return list[Math.floor(Math.random() * list.length)];
}

// str has type string
const str = pickRandom(['str', 'hello', 'world']);
// num has type number
const num = pickRandom([1, 2, 3, 4]);
// multi has type number|string
const multi = pickRandom([1, 'hello']);