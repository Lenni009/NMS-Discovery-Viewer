import 'bulma';
import './scss/styles.scss';
import { DiscoveryItem, SystemDiscoveryEntry } from './interfaces';

let jsonState: string;
const transformedJSON = {};

(document.getElementById('JSONinput') as HTMLInputElement)?.addEventListener('change', function () {
	const reader = new FileReader();
	reader.readAsText(this.files![0]);
	if (this.files!.length > 0) {
		const fileName = (this.parentElement as HTMLLabelElement).querySelector('.file-name') as HTMLSpanElement;
		fileName.textContent = this.files![0].name;
	}
	reader.onload = (e) => {
		jsonState = e.target?.result as string;
		loadJSON();
	}
});

function loadJSON() {
	const jsonObj = JSON.parse(jsonState);
	const records: Array<DiscoveryItem> = jsonObj.DiscoveryManagerData['DiscoveryData-v1'].Store.Record;

	const outputElement = document.getElementById('discoveries')
	if (outputElement) outputElement.innerHTML = '';

	for (const element of records) {
		transformJSON(element);
	}

	console.log(transformedJSON)

}




function transformJSON(obj: DiscoveryItem) {
	const { DD: { UA, DT: type }, DM: { CN: name = '' }, OWS: { USN: discoverer, PTK: platform, TS } } = obj;


	let stringUA: string;
	if (typeof UA == 'number') {
		stringUA = UA.toString(16).toUpperCase().padStart(16, '0');				// NoSonar this is dec to hex...
	} else {
		stringUA = parseInt(UA).toString(16).toUpperCase();		// NoSonar this is dec to hex...
	}

	const systemUA = '0' + stringUA.substring(1);

	const timestamp = new Date(TS * 1000).toLocaleString();		// NoSonar we need to convert to milliseconds
	const dataObj = {
		name,
		discoverer,
		platform,
		timestamp
	}

	const system: SystemDiscoveryEntry = transformedJSON[systemUA] ??= { planets: {} };
	switch (type) {
		case 'SolarSystem':
			for (const [key, value] of Object.entries(dataObj)) {
				system[key] = value;
			}
			break;

		case 'Planet':
			system.planets![stringUA] ??= {};
			for (const [key, value] of Object.entries(dataObj)) {
				system.planets![stringUA][key] = value;
				console.log("tst")
			}
			break;

		default:
			system.planets![stringUA] ??= {};
			system.planets![stringUA][type] ??= {};
			for (const [key, value] of Object.entries(dataObj)) {
				system.planets![stringUA][type]![key] = value;
			}
			break;
	}
	buildItem(system, stringUA);
}

function buildItem(systemObj: SystemDiscoveryEntry, ua: string) {
	const wrapper = document.createElement('div');
	wrapper.classList.add('table');
	wrapper.dataset.ua = ua;

	for (const [key, value] of Object.entries(systemObj)) {
		if (typeof value == 'string' || typeof value == 'number') wrapper.appendChild(buildRow(key, value));
	}
	wrapper.appendChild(buildRow('UA', ua));


	const outputElement = document.getElementById('discoveries')
	if (outputElement) outputElement.insertAdjacentElement('afterbegin', wrapper);


	function buildRow(key: string, value: string | number) {
		const tr = document.createElement('tr');
		const header = document.createElement('th');
		const text = document.createElement('td');
		tr.appendChild(header);
		tr.appendChild(text);

		header.innerText = capitalizeFirstLetter(key);
		text.innerText = value.toString();

		return tr;
	}
}

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}