import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import Dumbbell from '@lucide/svelte/icons/dumbbell';
import Settings from '@lucide/svelte/icons/settings';
import type { Component } from 'svelte';

export type NavItem = {
	label: string;
	href: string;
	icon: Component;
};

export type NavSection = {
	heading?: string;
	items: NavItem[];
};

export const navSections: NavSection[] = [
	{
		items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }]
	},
	{
		heading: 'Модули',
		items: [{ label: 'Workout', href: '/modules/workout', icon: Dumbbell }]
	},
	{
		items: [{ label: 'Настройки', href: '/settings', icon: Settings }]
	}
];
