export type WorkoutType = 'tennis' | 'running' | 'strength';

export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
	tennis: 'Теннис',
	running: 'Бег',
	strength: 'Силовая'
};

export type TennisKind = 'match' | 'practice';
export type TennisCourt = 'indoor' | 'outdoor';
export type TennisSurface = 'hard' | 'clay' | 'grass';

export const TENNIS_KIND_LABELS: Record<TennisKind, string> = {
	match: 'Матч',
	practice: 'Тренировка'
};

export const TENNIS_COURT_LABELS: Record<TennisCourt, string> = {
	indoor: 'Зал',
	outdoor: 'Улица'
};

export const TENNIS_SURFACE_LABELS: Record<TennisSurface, string> = {
	hard: 'Хард',
	clay: 'Грунт',
	grass: 'Трава'
};

export type TennisDetails = {
	type: 'tennis';
	kind: TennisKind;
	score?: string;
	court?: TennisCourt;
	surface?: TennisSurface;
	partner?: string;
};

export type RunningDetails = {
	type: 'running';
	avgPaceSecPerKm?: number;
	elevationGainM?: number;
	location?: string;
};

export type StrengthExercise = {
	name: string;
	sets: number;
	reps: number;
	weightKg?: number;
	muscleGroup?: string;
};

export type StrengthDetails = {
	type: 'strength';
	exercises: StrengthExercise[];
};

export type WorkoutDetails = TennisDetails | RunningDetails | StrengthDetails;

export type ZoneMinutes = [number, number, number, number, number];

export type WorkoutSession = {
	id: string;
	date: string;
	type: WorkoutType;
	durationMin: number;
	avgHR?: number;
	maxHR?: number;
	activeCalories?: number;
	distanceKm?: number;
	rpe?: number;
	zoneMinutes?: ZoneMinutes;
	note?: string;
	details?: WorkoutDetails;
};

export type WorkoutSettings = {
	maxHR: number;
};

export type ZoneRange = {
	zone: 1 | 2 | 3 | 4 | 5;
	min: number;
	max: number;
};

const ZONE_PERCENTS: ReadonlyArray<readonly [number, number]> = [
	[0.5, 0.6],
	[0.6, 0.7],
	[0.7, 0.8],
	[0.8, 0.9],
	[0.9, 1.0]
];

export function computeZones(maxHR: number): ZoneRange[] {
	return ZONE_PERCENTS.map(([lo, hi], i) => ({
		zone: (i + 1) as ZoneRange['zone'],
		min: Math.round(maxHR * lo),
		max: Math.round(maxHR * hi)
	}));
}

export function emptyDetails(type: WorkoutType): WorkoutDetails {
	switch (type) {
		case 'tennis':
			return { type: 'tennis', kind: 'practice' };
		case 'running':
			return { type: 'running' };
		case 'strength':
			return { type: 'strength', exercises: [] };
	}
}
