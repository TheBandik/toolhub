export type Track = {
	id: string;
	name: string;
	artist: string;
	album: string;
	genre?: string;
	durationSec?: number;
};

export const GENRE_GROUPS = [
	'Pop',
	'Hip-Hop/Rap',
	'Electronic',
	'Soundtrack/OST',
	'Alternative',
	'Rock',
	'Indie',
	'Asian Pop',
	'World',
	'Holiday',
	'R&B/Soul',
	'Singer/Songwriter',
	"Children's Music",
	'Country/Americana',
	'Metal',
	'Classical',
	'Other'
] as const;

export type GenreGroup = (typeof GENRE_GROUPS)[number];

const GENRE_MAP: Record<string, GenreGroup> = {
	Pop: 'Pop',
	'Pop Rock': 'Pop',
	'Pop/Rock': 'Pop',
	'Teen Pop': 'Pop',
	'Pop in Russian': 'Pop',
	'French Pop': 'Pop',

	'Hip-Hop/Rap': 'Hip-Hop/Rap',
	'Hip-Hop': 'Hip-Hop/Rap',
	Rap: 'Hip-Hop/Rap',
	'Alternative Rap': 'Hip-Hop/Rap',

	Alternative: 'Alternative',
	'Alternative Folk': 'Alternative',
	'Adult Alternative': 'Alternative',

	Rock: 'Rock',
	'Hard Rock': 'Rock',

	'Indie Pop': 'Indie',
	'Indie Rock': 'Indie',

	OST: 'Soundtrack/OST',
	Soundtrack: 'Soundtrack/OST',
	'Video Game': 'Soundtrack/OST',
	Game: 'Soundtrack/OST',
	Anime: 'Soundtrack/OST',

	Electronic: 'Electronic',
	Electronica: 'Electronic',
	Dance: 'Electronic',
	House: 'Electronic',
	Dubstep: 'Electronic',
	Downtempo: 'Electronic',
	Hardcore: 'Electronic',
	Techno: 'Electronic',
	Breakbeat: 'Electronic',

	Holiday: 'Holiday',
	'Christmas: Classic': 'Holiday',
	'Christmas: Pop': 'Holiday',
	Halloween: 'Holiday',

	Worldwide: 'World',
	Brazilian: 'World',
	'Urbano latino': 'World',

	'J-Pop': 'Asian Pop',
	'K-Pop': 'Asian Pop',

	'R&B/Soul': 'R&B/Soul',
	'Singer/Songwriter': 'Singer/Songwriter',
	"Children's Music": "Children's Music",
	Country: 'Country/Americana',
	Americana: 'Country/Americana',
	Metal: 'Metal',
	Classical: 'Classical',
	Instrumental: 'Classical',
	Folk: 'Singer/Songwriter'
};

export function groupGenre(genre?: string): GenreGroup {
	if (!genre) return 'Other';
	return GENRE_MAP[genre] ?? 'Other';
}

export const GENRE_COLOR: Record<GenreGroup, string> = {
	Pop: '#ec4899',
	'Hip-Hop/Rap': '#f97316',
	Electronic: '#8b5cf6',
	'Soundtrack/OST': '#f59e0b',
	Alternative: '#3b82f6',
	Rock: '#ef4444',
	Indie: '#10b981',
	'Asian Pop': '#d946ef',
	World: '#14b8a6',
	Holiday: '#f43f5e',
	'R&B/Soul': '#a855f7',
	'Singer/Songwriter': '#84cc16',
	"Children's Music": '#facc15',
	'Country/Americana': '#b45309',
	Metal: '#52525b',
	Classical: '#78716c',
	Other: '#9ca3af'
};

export function formatDuration(sec?: number): string {
	if (sec == null) return '—';
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatHours(sec: number): string {
	const h = Math.floor(sec / 3600);
	const m = Math.floor((sec % 3600) / 60);
	if (h === 0) return `${m} мин`;
	return `${h} ч ${m} мин`;
}
