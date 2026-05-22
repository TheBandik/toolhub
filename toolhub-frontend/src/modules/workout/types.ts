export type WorkoutType = 'tennis' | 'running' | 'strength';

export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
	tennis: 'Теннис',
	running: 'Бег',
	strength: 'Силовая'
};

export type WorkoutSession = {
	id: string;
	date: string;
	type: WorkoutType;
	durationMin: number;
	note?: string;
};
