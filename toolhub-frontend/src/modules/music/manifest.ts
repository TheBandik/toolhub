import Music from '@lucide/svelte/icons/music';
import type { ModuleManifest } from '$lib/modules/types';

export const manifest: ModuleManifest = {
	id: 'music',
	name: 'Музыка',
	icon: Music,
	category: 'media',
	description: 'Статистика музыкальной библиотеки',
	routes: [
		{ path: '/', label: 'Обзор', component: () => import('./pages/Overview.svelte') },
		{ path: '/library', label: 'Библиотека', component: () => import('./pages/Library.svelte') },
		{
			path: '/settings',
			label: 'Настройки',
			component: () => import('./pages/MusicSettings.svelte')
		}
	],
	widgets: [
		{
			id: 'music.track-count',
			label: 'Треков в библиотеке',
			component: () => import('./widgets/TrackCount.svelte')
		},
		{
			id: 'music.total-duration',
			label: 'Длительность библиотеки',
			component: () => import('./widgets/TotalDuration.svelte')
		}
	]
};
