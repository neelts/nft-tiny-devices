const fetch = require('node-fetch');
const fs = require('fs');

const file = 'hen-link-data.json';

const all = JSON.parse(fs.readFileSync(file));
const map = new Map();
all.forEach(([address, name]) => map.set(name, address));

console.log('<<< ' + all.length);

const get = async () => {

	const data = await fetch('https://hen.link/');
	const html = await data.text();

	for (const m of html.matchAll(/href="https:\/\/hen.link\/(.+)" target/g)) {

		const [, name] = m;
		if (!map.has(name)) {
			const r = await fetch('https://hen.link/' + m[1]);
			all.push([r.url.substr(r.url.lastIndexOf('/') + 1), name]);
			console.log(all[all.length - 1]);
		}
	}

	fs.writeFileSync(file, JSON.stringify(all));
}

get().then(() => {
	console.log('>>> ' + all.length);
});