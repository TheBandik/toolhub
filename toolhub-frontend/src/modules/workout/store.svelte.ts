import type { WorkoutSession, WorkoutSettings } from './types';

function daysAgo(days: number): string {
	const d = new Date();
	d.setDate(d.getDate() - days);
	return d.toISOString().slice(0, 10);
}

class WorkoutStore {
	settings = $state<WorkoutSettings>({ zoneMethod: 'max', maxHR: 190, restHR: 60 });

	sessions = $state<WorkoutSession[]>([
		{
			id: '1',
			date: daysAgo(0),
			type: 'tennis',
			durationMin: 60,
			avgHR: 138,
			maxHR: 172,
			activeCalories: 480,
			rpe: 6,
			zoneMinutes: [5, 20, 25, 8, 2],
			note: 'Тренировка подачи',
			details: {
				type: 'tennis',
				kind: 'practice',
				court: 'indoor',
				surface: 'hard',
				partner: 'Антон'
			}
		},
		{
			id: '2',
			date: daysAgo(2),
			type: 'running',
			durationMin: 35,
			avgHR: 152,
			maxHR: 178,
			activeCalories: 380,
			distanceKm: 5.2,
			rpe: 7,
			zoneMinutes: [2, 5, 18, 8, 2],
			note: 'Пробежка по парку',
			details: {
				type: 'running',
				avgPaceSecPerKm: 405,
				elevationGainM: 35,
				location: 'Парк Горького'
			}
		},
		{
			id: '3',
			date: daysAgo(4),
			type: 'strength',
			durationMin: 50,
			avgHR: 118,
			maxHR: 155,
			activeCalories: 290,
			rpe: 8,
			zoneMinutes: [15, 25, 8, 2, 0],
			note: 'Спина + бицепс',
			details: {
				type: 'strength',
				exercises: [
					{ name: 'Подтягивания', sets: 4, reps: 8, muscleGroup: 'Спина' },
					{ name: 'Тяга штанги в наклоне', sets: 4, reps: 10, weightKg: 60, muscleGroup: 'Спина' },
					{ name: 'Подъём на бицепс', sets: 3, reps: 12, weightKg: 16, muscleGroup: 'Бицепс' }
				]
			}
		},
		{
			id: '4',
			date: daysAgo(7),
			type: 'tennis',
			durationMin: 75,
			avgHR: 142,
			maxHR: 178,
			activeCalories: 560,
			rpe: 7,
			zoneMinutes: [3, 18, 35, 15, 4],
			details: {
				type: 'tennis',
				kind: 'match',
				score: '6:4 6:3',
				court: 'outdoor',
				surface: 'clay',
				partner: 'Кирилл'
			}
		},
		{
			id: '5',
			date: daysAgo(10),
			type: 'running',
			durationMin: 40,
			avgHR: 158,
			maxHR: 184,
			activeCalories: 450,
			distanceKm: 6.4,
			rpe: 8,
			zoneMinutes: [1, 3, 12, 18, 6],
			note: '6 км интервалы',
			details: {
				type: 'running',
				avgPaceSecPerKm: 375,
				elevationGainM: 20,
				location: 'Стадион'
			}
		}
	]);

	add(s: Omit<WorkoutSession, 'id'>) {
		this.sessions.unshift({ ...s, id: crypto.randomUUID() });
	}

	remove(id: string) {
		const idx = this.sessions.findIndex((x) => x.id === id);
		if (idx >= 0) this.sessions.splice(idx, 1);
	}

	updateSettings(patch: Partial<WorkoutSettings>) {
		Object.assign(this.settings, patch);
	}
}

export const workoutStore = new WorkoutStore();
