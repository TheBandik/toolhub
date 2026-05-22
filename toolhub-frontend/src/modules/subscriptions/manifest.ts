import CreditCard from '@lucide/svelte/icons/credit-card';
import type { ModuleManifest } from '$lib/modules/types';

export const manifest: ModuleManifest = {
	id: 'subscriptions',
	name: 'Subscriptions',
	icon: CreditCard,
	category: 'finance',
	description: 'Подписки и регулярные сервисы',
	routes: [
		{ path: '/', label: 'Обзор', component: () => import('./pages/Overview.svelte') },
		{ path: '/list', label: 'Список', component: () => import('./pages/List.svelte') },
		{
			path: '/settings',
			label: 'Настройки',
			component: () => import('./pages/SubscriptionsSettings.svelte')
		}
	]
};
