import HeartPulse from '@lucide/svelte/icons/heart-pulse';
import type { ModuleManifest } from '$lib/modules/types';

export const manifest: ModuleManifest = {
	id: 'health',
	name: 'Медкарта',
	icon: HeartPulse,
	category: 'health',
	description: 'Визиты к врачам, анализы, стоматология, файлы',
	routes: [
		{ path: '/', label: 'Обзор', component: () => import('./pages/Overview.svelte') },
		{ path: '/visits', label: 'Визиты', component: () => import('./pages/Visits.svelte') },
		{ path: '/labs', label: 'Анализы', component: () => import('./pages/Labs.svelte') },
		{ path: '/dentistry', label: 'Стоматология', component: () => import('./pages/Dentistry.svelte') },
		{ path: '/files', label: 'Файлы', component: () => import('./pages/Files.svelte') }
	],
	widgets: [
		{
			id: 'health.last-visit',
			label: 'Последний визит',
			component: () => import('./widgets/LastVisit.svelte')
		},
		{
			id: 'health.labs-count',
			label: 'Анализов за год',
			component: () => import('./widgets/LabsCount.svelte')
		},
		{
			id: 'health.days-without-doctor',
			label: 'Дней без врача',
			component: () => import('./widgets/DaysWithoutDoctor.svelte')
		}
	]
};
