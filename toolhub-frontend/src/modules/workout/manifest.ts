import Dumbbell from '@lucide/svelte/icons/dumbbell';
import type { ModuleManifest } from '$lib/modules/types';

export const manifest: ModuleManifest = {
	id: 'workout',
	name: 'Тренировки',
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
	],
	widgets: [
		{
			id: 'workout.week-sessions',
			label: 'Тренировок за неделю',
			component: () => import('./widgets/WeekSessions.svelte')
		},
		{
			id: 'workout.week-minutes',
			label: 'Минут за неделю',
			component: () => import('./widgets/WeekMinutes.svelte')
		},
		{
			id: 'workout.week-calories',
			label: 'Ккал за неделю',
			component: () => import('./widgets/WeekCalories.svelte')
		},
		{
			id: 'workout.week-distance',
			label: 'Км за неделю',
			component: () => import('./widgets/WeekDistance.svelte')
		},
		{
			id: 'workout.last',
			label: 'Последняя тренировка',
			component: () => import('./widgets/LastWorkout.svelte')
		}
	]
};
