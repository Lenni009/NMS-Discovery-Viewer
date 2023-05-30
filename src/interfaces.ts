export interface DiscoveryItem {
	DD: {
		UA: string | number;
		DT: string;
		VP: Array<string | number>;
	},
	DM: {
		CN: string
	},
	OWS: {
		LID: string;
		UID: string;
		USN: string;
		PTK: string;
		TS: number
	},
	FL: {
		C: string;
		U?: string;
	},
	RID: string;
}

export interface DiscoveryEntry {
	name?: string;
	discoverer?: string;
	platform?: string;
	timestamp?: string;
}

export interface PlanetDiscoveryEntry {
	name?: string;
	discoverer?: string;
	platform?: string;
	timestamp?: string;
	[key: string]: string | DiscoveryEntry | undefined;
}

export interface SystemDiscoveryEntry {
	name?: string;
	discoverer?: string;
	platform?: string;
	timestamp?: string;
	planets?: {
		[key: string]: PlanetDiscoveryEntry;
	}
	[key: string]: string | undefined | {
		[key: string]: PlanetDiscoveryEntry;
	};
}

export interface DiscoveryEntries {
	[key: string]: SystemDiscoveryEntry;
}