import Dumbbell from '@lucide/svelte/icons/dumbbell';
import type { ModuleManifest } from '$lib/modules/types';

export const manifest: ModuleManifest = {
	id: 'workout',
	name: 'Workout',
	icon: Dumbbell,
	category: 'health',
	description: 'Трекер тренировок: теннис, бег, силовые',
	routes: [
		{ path: '/', label: 'Обзор', component: () => import('./pages/Overview.svelte') },
		{ path: '/sessions', label: 'Сессии', component: () => import('./pages/Sessions.svelte') },
		{
			path: '/settings',
			label: 'Настройки',
			component: () => import('./pages/WorkoutSettings.svelte')
		}
	]
};
