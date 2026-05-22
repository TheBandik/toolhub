import type { WorkoutSession } from './types';

function daysAgo(days: number): string {
	const d = new Date();
	d.setDate(d.getDate() - days);
	return d.toISOString().slice(0, 10);
}

class WorkoutStore {
	sessions = $state<WorkoutSession[]>([
		{ id: '1', date: daysAgo(0), type: 'tennis', durationMin: 60, note: 'Тренировка подачи' },
		{ id: '2', date: daysAgo(2), type: 'running', durationMin: 35, note: '5 км' },
		{ id: '3', date: daysAgo(4), type: 'strength', durationMin: 50, note: 'Спина + бицепс' },
		{ id: '4', date: daysAgo(7), type: 'tennis', durationMin: 75 },
		{ id: '5', date: daysAgo(10), type: 'running', durationMin: 40, note: '6 км интервалы' }
	]);

	add(s: Omit<WorkoutSession, 'id'>) {
		this.sessions.unshift({ ...s, id: crypto.randomUUID() });
	}

	remove(id: string) {
		const idx = this.sessions.findIndex((x) => x.id === id);
		if (idx >= 0) this.sessions.splice(idx, 1);
	}
}

export const workoutStore = new WorkoutStore();
