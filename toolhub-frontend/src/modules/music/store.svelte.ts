import type { Track } from './types';

const SEED: Omit<Track, 'id'>[] = [
	{ name: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', genre: 'Pop', durationSec: 200 },
	{ name: 'Lavender Haze', artist: 'Taylor Swift', album: 'Midnights', genre: 'Pop', durationSec: 202 },
	{ name: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', genre: 'Pop', durationSec: 178 },
	{ name: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', durationSec: 203 },
	{ name: "Don't Start Now", artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', durationSec: 184 },
	{ name: 'good 4 u', artist: 'Olivia Rodrigo', album: 'SOUR', genre: 'Pop', durationSec: 178 },
	{ name: 'drivers license', artist: 'Olivia Rodrigo', album: 'SOUR', genre: 'Pop', durationSec: 242 },
	{ name: 'bad guy', artist: 'Billie Eilish', album: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?', genre: 'Pop', durationSec: 194 },
	{ name: 'Espresso', artist: 'Sabrina Carpenter', album: 'Espresso - Single', genre: 'Pop', durationSec: 175 },
	{ name: 'Please Please Please', artist: 'Sabrina Carpenter', album: "Short n' Sweet", genre: 'Pop', durationSec: 186 },
	{ name: "Texas Hold 'Em", artist: 'Beyoncé', album: 'COWBOY CARTER', genre: 'Pop', durationSec: 233 },
	{ name: 'Padam Padam', artist: 'Kylie Minogue', album: 'Tension', genre: 'Pop', durationSec: 195 },
	{ name: 'Pink Pony Club', artist: 'Chappell Roan', album: 'The Rise and Fall of a Midwest Princess', genre: 'Pop', durationSec: 257 },
	{ name: 'Paint The Town Red', artist: 'Doja Cat', album: 'Scarlet', genre: 'Pop', durationSec: 230 },

	{ name: 'I Wanna Be Yours', artist: 'Arctic Monkeys', album: 'AM', genre: 'Indie Rock', durationSec: 183 },
	{ name: 'Do I Wanna Know?', artist: 'Arctic Monkeys', album: 'AM', genre: 'Indie Rock', durationSec: 272 },
	{ name: '505', artist: 'Arctic Monkeys', album: 'Favourite Worst Nightmare', genre: 'Indie Rock', durationSec: 253 },
	{ name: 'The Less I Know the Better', artist: 'Tame Impala', album: 'Currents', genre: 'Indie Pop', durationSec: 216 },
	{ name: 'Borderline', artist: 'Tame Impala', album: 'The Slow Rush', genre: 'Indie Pop', durationSec: 237 },
	{ name: 'Time to Pretend', artist: 'MGMT', album: 'Oracular Spectacular', genre: 'Indie Pop', durationSec: 261 },

	{ name: 'About You', artist: 'The 1975', album: 'Being Funny in a Foreign Language', genre: 'Alternative', durationSec: 327 },
	{ name: 'Somebody Else', artist: 'The 1975', album: 'I like it when you sleep…', genre: 'Alternative', durationSec: 348 },

	{ name: 'Everlong', artist: 'Foo Fighters', album: 'The Colour and the Shape', genre: 'Rock', durationSec: 250 },
	{ name: 'Learn to Fly', artist: 'Foo Fighters', album: 'There Is Nothing Left to Lose', genre: 'Rock', durationSec: 238 },
	{ name: 'Under the Bridge', artist: 'Red Hot Chili Peppers', album: 'Blood Sugar Sex Magik', genre: 'Rock', durationSec: 264 },

	{ name: 'Enter Sandman', artist: 'Metallica', album: 'Metallica', genre: 'Metal', durationSec: 333 },

	{ name: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop/Rap', durationSec: 177 },
	{ name: 'DNA.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop/Rap', durationSec: 185 },
	{ name: 'Money Trees', artist: 'Kendrick Lamar', album: 'good kid, m.A.A.d city', genre: 'Hip-Hop/Rap', durationSec: 386 },
	{ name: "God's Plan", artist: 'Drake', album: 'Scorpion', genre: 'Hip-Hop/Rap', durationSec: 198 },
	{ name: 'EARFQUAKE', artist: 'Tyler, The Creator', album: 'IGOR', genre: 'Hip-Hop/Rap', durationSec: 190 },

	{ name: 'One More Time', artist: 'Daft Punk', album: 'Discovery', genre: 'Dance', durationSec: 320 },
	{ name: 'Get Lucky', artist: 'Daft Punk', album: 'Random Access Memories', genre: 'Dance', durationSec: 369 },
	{ name: 'Latch', artist: 'Disclosure', album: 'Settle', genre: 'Electronic', durationSec: 254 },
	{ name: 'A Moment Apart', artist: 'ODESZA', album: 'A Moment Apart', genre: 'Electronic', durationSec: 195 },
	{ name: 'Strobe', artist: 'deadmau5', album: 'For Lack of a Better Name', genre: 'House', durationSec: 626 },
	{ name: 'Espresso Macchiato', artist: 'Tommy Cash', album: 'Eurovision', genre: 'Dance', durationSec: 175 },

	{ name: 'Time', artist: 'Hans Zimmer', album: 'Inception (Original Soundtrack)', genre: 'Soundtrack', durationSec: 251 },
	{ name: 'Cornfield Chase', artist: 'Hans Zimmer', album: 'Interstellar (Original Soundtrack)', genre: 'Soundtrack', durationSec: 124 },
	{ name: 'No Time for Caution', artist: 'Hans Zimmer', album: 'Interstellar (Original Soundtrack)', genre: 'Soundtrack', durationSec: 200 },
	{ name: 'S.T.A.Y.', artist: 'Hans Zimmer', album: 'Interstellar (Original Soundtrack)', genre: 'Soundtrack', durationSec: 387 },
	{ name: 'The Imperial March', artist: 'John Williams', album: 'Star Wars: The Empire Strikes Back', genre: 'Soundtrack', durationSec: 184 },
	{ name: "One Summer's Day", artist: 'Joe Hisaishi', album: 'Spirited Away (Original Soundtrack)', genre: 'Soundtrack', durationSec: 184 },
	{ name: 'Snake Eater', artist: 'Cynthia Harrell', album: 'Metal Gear Solid 3', genre: 'Video Game', durationSec: 234 },
	{ name: 'Megalovania', artist: 'Toby Fox', album: 'Undertale Soundtrack', genre: 'Video Game', durationSec: 156 },

	{ name: 'Butter', artist: 'BTS', album: 'Butter', genre: 'K-Pop', durationSec: 164 },
	{ name: 'Dynamite', artist: 'BTS', album: 'BE', genre: 'K-Pop', durationSec: 199 },
	{ name: 'Eight', artist: 'IU', album: 'Eight - Single', genre: 'K-Pop', durationSec: 167 },

	{ name: 'Cello Suite No. 1: Prélude', artist: 'Yo-Yo Ma', album: 'Six Evolutions - Bach: Cello Suites', genre: 'Classical', durationSec: 162 },

	{ name: 'Halloween Theme', artist: 'John Carpenter', album: 'Halloween (Original Soundtrack)', genre: 'Halloween', durationSec: 188 },
	{ name: 'Last Christmas', artist: 'Wham!', album: 'Last Christmas', genre: 'Holiday', durationSec: 263 }
];

class MusicStore {
	tracks = $state<Track[]>(SEED.map((t, i) => ({ ...t, id: String(i + 1) })));
}

export const musicStore = new MusicStore();
