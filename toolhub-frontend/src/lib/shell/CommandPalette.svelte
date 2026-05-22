<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Search from '@lucide/svelte/icons/search';

	let open = $state(false);
	let input: HTMLInputElement | null = $state(null);

	function handleKey(e: KeyboardEvent) {
		const mod = e.metaKey || e.ctrlKey;
		if (mod && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			openPalette();
		}
		if (e.key === 'Escape') open = false;
	}

	async function openPalette() {
		open = true;
		await tick();
		input?.focus();
	}

	onMount(() => {
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

<button
	type="button"
	onclick={openPalette}
	class="text-muted-foreground hover:bg-accent hover:text-accent-foreground border-input bg-background inline-flex h-9 items-center gap-2 rounded-md border px-2 text-sm transition-colors sm:px-3"
	aria-label="Поиск"
>
	<Search class="size-4" />
	<span class="hidden sm:inline">Поиск...</span>
	<kbd
		class="bg-muted text-muted-foreground ml-2 hidden rounded px-1.5 py-0.5 font-mono text-[10px] sm:inline-block"
	>
		⌘K
	</kbd>
</button>

{#if open}
	<div class="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
		<button
			type="button"
			aria-label="Close command palette"
			class="absolute inset-0 bg-black/50"
			onclick={() => (open = false)}
		></button>
		<div
			role="dialog"
			aria-modal="true"
			class="bg-popover text-popover-foreground relative w-full max-w-lg rounded-lg border shadow-lg"
		>
			<div class="border-b p-3">
				<input
					bind:this={input}
					placeholder="Команда или модуль..."
					class="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
				/>
			</div>
			<div class="text-muted-foreground p-6 text-center text-sm">
				Command palette — заглушка. Скоро здесь будут команды и навигация.
			</div>
		</div>
	</div>
{/if}
