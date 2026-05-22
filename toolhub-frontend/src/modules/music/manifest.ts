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
	]
};
