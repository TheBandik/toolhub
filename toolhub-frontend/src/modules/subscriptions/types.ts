export const CURRENCIES = ['RUB', 'USD', 'EUR', 'GBP'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
	RUB: '₽',
	USD: '$',
	EUR: '€',
	GBP: '£'
};

export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
	weekly: 'неделя',
	monthly: 'месяц',
	quarterly: 'квартал',
	yearly: 'год'
};

export type TimeUnit = 'day' | 'week' | 'month';

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
	day: 'день',
	week: 'неделя',
	month: 'месяц'
};

export type ServiceCategory =
	| 'streaming'
	| 'software'
	| 'infrastructure'
	| 'telecom'
	| 'finance'
	| 'insurance'
	| 'sport'
	| 'education'
	| 'other';

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
	streaming: 'Стриминг',
	software: 'ПО',
	infrastructure: 'Инфраструктура',
	telecom: 'Связь',
	finance: 'Финансы',
	insurance: 'Страховка',
	sport: 'Спорт',
	education: 'Образование',
	other: 'Другое'
};

export const CATEGORY_ICONS: Record<ServiceCategory, string> = {
	streaming: '🎬',
	software: '💻',
	infrastructure: '🖥️',
	telecom: '📡',
	finance: '💳',
	insurance: '🛡️',
	sport: '🏋️',
	education: '📚',
	other: '📦'
};

type EntryBase = {
	id: string;
	name: string;
	icon: string;
	category: ServiceCategory;
	currency: Currency;
	startDate: string;
	endDate?: string;
	note?: string;
};

export type Subscription = EntryBase & {
	kind: 'subscription';
	price: number;
	cycle: BillingCycle;
	autoRenew: boolean;
};

export type Service = EntryBase & {
	kind: 'service';
	rate: number;
	perUnit: TimeUnit;
};

export type ServiceEntry = Subscription | Service;

export type ServiceSettings = {
	baseCurrency: Currency;
	ratesToRUB: Record<Currency, number>;
};

const DAYS_IN_MONTH = 30.4375;
const WEEKS_IN_MONTH = 4.348;

export function monthlyCostInOwnCurrency(e: ServiceEntry): number {
	if (e.kind === 'subscription') {
		switch (e.cycle) {
			case 'weekly':
				return e.price * WEEKS_IN_MONTH;
			case 'monthly':
				return e.price;
			case 'quarterly':
				return e.price / 3;
			case 'yearly':
				return e.price / 12;
		}
	}
	switch (e.perUnit) {
		case 'day':
			return e.rate * DAYS_IN_MONTH;
		case 'week':
			return e.rate * WEEKS_IN_MONTH;
		case 'month':
			return e.rate;
	}
}

export function convertAmount(
	amount: number,
	from: Currency,
	to: Currency,
	ratesToRUB: Record<Currency, number>
): number {
	return (amount * ratesToRUB[from]) / ratesToRUB[to];
}

export function monthlyInBase(e: ServiceEntry, settings: ServiceSettings): number {
	const ownMonthly = monthlyCostInOwnCurrency(e);
	return convertAmount(ownMonthly, e.currency, settings.baseCurrency, settings.ratesToRUB);
}

export function yearlyInBase(e: ServiceEntry, settings: ServiceSettings): number {
	return monthlyInBase(e, settings) * 12;
}

export function formatMoney(amount: number, currency: Currency): string {
	const symbol = CURRENCY_SYMBOLS[currency];
	const value =
		Math.abs(amount) >= 100
			? Math.round(amount).toLocaleString('ru-RU')
			: amount.toFixed(2).replace('.', ',');
	return `${value} ${symbol}`;
}

export function priceLabel(e: ServiceEntry): string {
	if (e.kind === 'subscription') {
		return `${formatMoney(e.price, e.currency)} / ${BILLING_CYCLE_LABELS[e.cycle]}`;
	}
	return `${formatMoney(e.rate, e.currency)} / ${TIME_UNIT_LABELS[e.perUnit]}`;
}

function advanceCycle(d: Date, cycle: BillingCycle): void {
	switch (cycle) {
		case 'weekly':
			d.setDate(d.getDate() + 7);
			break;
		case 'monthly':
			d.setMonth(d.getMonth() + 1);
			break;
		case 'quarterly':
			d.setMonth(d.getMonth() + 3);
			break;
		case 'yearly':
			d.setFullYear(d.getFullYear() + 1);
			break;
	}
}

export function nextBillingDate(s: Subscription, from = new Date()): Date {
	const next = new Date(s.startDate);
	let guard = 0;
	while (next <= from && guard < 10000) {
		advanceCycle(next, s.cycle);
		guard++;
	}
	return next;
}

export function isActive(e: ServiceEntry, on = new Date()): boolean {
	if (e.endDate && new Date(e.endDate) < on) return false;
	if (new Date(e.startDate) > on) return false;
	return true;
}
