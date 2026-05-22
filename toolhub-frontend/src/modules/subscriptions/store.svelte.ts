import type { ServiceEntry, ServiceSettings } from './types';

function daysAgo(days: number): string {
	const d = new Date();
	d.setDate(d.getDate() - days);
	return d.toISOString().slice(0, 10);
}

class SubscriptionsStore {
	settings = $state<ServiceSettings>({
		baseCurrency: 'RUB',
		ratesToRUB: { RUB: 1, USD: 92, EUR: 100, GBP: 115 }
	});

	entries = $state<ServiceEntry[]>([
		{
			id: '1',
			kind: 'subscription',
			name: 'Netflix',
			icon: '🎬',
			category: 'streaming',
			currency: 'RUB',
			price: 799,
			cycle: 'monthly',
			autoRenew: true,
			startDate: daysAgo(240),
			note: 'Стандарт + 1 экран'
		},
		{
			id: '2',
			kind: 'subscription',
			name: 'Spotify',
			icon: '🎵',
			category: 'streaming',
			currency: 'RUB',
			price: 199,
			cycle: 'monthly',
			autoRenew: true,
			startDate: daysAgo(700)
		},
		{
			id: '3',
			kind: 'subscription',
			name: 'ChatGPT Plus',
			icon: '🤖',
			category: 'software',
			currency: 'USD',
			price: 20,
			cycle: 'monthly',
			autoRenew: true,
			startDate: daysAgo(120)
		},
		{
			id: '4',
			kind: 'subscription',
			name: 'iCloud+ 200 GB',
			icon: '☁️',
			category: 'software',
			currency: 'RUB',
			price: 199,
			cycle: 'monthly',
			autoRenew: true,
			startDate: daysAgo(900)
		},
		{
			id: '5',
			kind: 'subscription',
			name: 'Домен .ru',
			icon: '🌐',
			category: 'infrastructure',
			currency: 'RUB',
			price: 199,
			cycle: 'yearly',
			autoRenew: true,
			startDate: daysAgo(500)
		},
		{
			id: '6',
			kind: 'subscription',
			name: 'ОСАГО',
			icon: '🚗',
			category: 'insurance',
			currency: 'RUB',
			price: 8000,
			cycle: 'yearly',
			autoRenew: false,
			startDate: daysAgo(60),
			note: 'Renew в страховой Ингосстрах'
		},
		{
			id: '7',
			kind: 'subscription',
			name: 'X-Fit',
			icon: '🏋️',
			category: 'sport',
			currency: 'RUB',
			price: 4500,
			cycle: 'monthly',
			autoRenew: true,
			startDate: daysAgo(180)
		},
		{
			id: '8',
			kind: 'service',
			name: 'VPS Selectel',
			icon: '🖥️',
			category: 'infrastructure',
			currency: 'RUB',
			rate: 10,
			perUnit: 'day',
			startDate: daysAgo(300),
			note: '2 vCPU, 4 GB RAM'
		},
		{
			id: '9',
			kind: 'service',
			name: 'AWS S3',
			icon: '☁️',
			category: 'infrastructure',
			currency: 'USD',
			rate: 0.5,
			perUnit: 'day',
			startDate: daysAgo(90)
		},
		{
			id: '10',
			kind: 'subscription',
			name: 'YouTube Premium',
			icon: '📺',
			category: 'streaming',
			currency: 'RUB',
			price: 299,
			cycle: 'monthly',
			autoRenew: true,
			startDate: daysAgo(45)
		}
	]);

	add(e: Omit<ServiceEntry, 'id'>) {
		this.entries.unshift({ ...e, id: crypto.randomUUID() } as ServiceEntry);
	}

	remove(id: string) {
		const idx = this.entries.findIndex((x) => x.id === id);
		if (idx >= 0) this.entries.splice(idx, 1);
	}

	updateSettings(patch: Partial<ServiceSettings>) {
		Object.assign(this.settings, patch);
	}

	updateRate(currency: keyof ServiceSettings['ratesToRUB'], rate: number) {
		this.settings.ratesToRUB[currency] = rate;
	}
}

export const subscriptionsStore = new SubscriptionsStore();
