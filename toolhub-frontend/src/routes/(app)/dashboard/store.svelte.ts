const STORAGE_KEY = 'toolhub:dashboard:widgets';

const DEFAULTS: string[] = [
	'workout.week-sessions',
	'workout.week-minutes',
	'workout.week-calories',
	'subscriptions.monthly',
	'subscriptions.upcoming',
	'music.track-count'
];

function load(): string[] {
	if (typeof window === 'undefined') return DEFAULTS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as string[]) : DEFAULTS;
	} catch {
		return DEFAULTS;
	}
}

function save(ids: string[]) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

class DashboardStore {
	selected = $state<string[]>(load());

	isSelected(id: string): boolean {
		return this.selected.includes(id);
	}

	toggle(id: string) {
		const idx = this.selected.indexOf(id);
		if (idx >= 0) {
			this.selected.splice(idx, 1);
		} else {
			this.selected.push(id);
		}
		save(this.selected);
	}
}

export const dashboardStore = new DashboardStore();
