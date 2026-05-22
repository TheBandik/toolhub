import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import Settings from '@lucide/svelte/icons/settings';
import type { Component } from 'svelte';
import { moduleRegistry } from '$lib/modules/registry';

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
		items: moduleRegistry.map((m) => ({
			label: m.name,
			href: `/modules/${m.id}`,
			icon: m.icon
		}))
	},
	{
		items: [{ label: 'Настройки', href: '/settings', icon: Settings }]
	}
];
