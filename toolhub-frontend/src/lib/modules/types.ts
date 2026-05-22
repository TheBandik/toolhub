import type { Component } from 'svelte';

export type ModuleCategory = 'health' | 'finance' | 'media' | 'productivity';

export type ModuleRoute = {
	path: string;
	label?: string;
	component: () => Promise<{ default: Component }>;
};

export type ModuleManifest = {
	id: string;
	name: string;
	icon: Component;
	category: ModuleCategory;
	description?: string;
	routes: ModuleRoute[];
};
