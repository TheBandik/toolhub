import Apple from '@lucide/svelte/icons/apple';
import type { ModuleManifest } from '$lib/modules/types';

export const manifest: ModuleManifest = {
	id: 'nutrition',
	name: 'Питание',
	icon: Apple,
	category: 'health',
	description: 'Трекер КБЖУ, клетчатка, вода',
	routes: [
		{ path: '/', label: 'Обзор', component: () => import('./pages/Overview.svelte') }
	]
};
