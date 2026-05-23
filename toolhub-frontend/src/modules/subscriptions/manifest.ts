import CreditCard from '@lucide/svelte/icons/credit-card';
import type { ModuleManifest } from '$lib/modules/types';

export const manifest: ModuleManifest = {
	id: 'subscriptions',
	name: 'Подписки',
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
	],
	widgets: [
		{
			id: 'subscriptions.active-count',
			label: 'Активных подписок',
			component: () => import('./widgets/ActiveCount.svelte')
		},
		{
			id: 'subscriptions.monthly',
			label: 'Расходы в месяц',
			component: () => import('./widgets/MonthlySpend.svelte')
		},
		{
			id: 'subscriptions.yearly',
			label: 'Расходы в год',
			component: () => import('./widgets/YearlySpend.svelte')
		},
		{
			id: 'subscriptions.upcoming',
			label: 'Ближайший платёж',
			component: () => import('./widgets/UpcomingPayment.svelte')
		}
	]
};
