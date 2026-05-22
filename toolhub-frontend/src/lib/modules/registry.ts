import type { ModuleManifest, ModuleRoute } from './types';

const modules = import.meta.glob<{ manifest: ModuleManifest }>(
	'/src/modules/*/manifest.ts',
	{ eager: true }
);

export const moduleRegistry: ModuleManifest[] = Object.values(modules)
	.map((m) => m.manifest)
	.sort((a, b) => a.name.localeCompare(b.name));

export function getModule(id: string): ModuleManifest | undefined {
	return moduleRegistry.find((m) => m.id === id);
}

export function getModuleRoute(
	manifest: ModuleManifest,
	subpath: string
): ModuleRoute | undefined {
	const trimmed = subpath.replace(/^\/+|\/+$/g, '');
	const target = trimmed === '' ? '/' : `/${trimmed}`;
	return manifest.routes.find((r) => r.path === target);
}
