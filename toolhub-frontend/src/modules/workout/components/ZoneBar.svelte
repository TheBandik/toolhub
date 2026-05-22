<script lang="ts">
	import { workoutStore } from '../store.svelte';
	import { computeZones, ZONE_COLOR_BG, type ZoneSeconds } from '../types';

	let { value }: { value: ZoneSeconds } = $props();

	const zones = $derived(computeZones(workoutStore.settings));
	const total = $derived(value.reduce((a, b) => a + (b || 0), 0));

	function formatTime(sec: number): string {
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m}:${String(s).padStart(2, '0')}`;
	}
</script>

<div class="flex flex-col gap-2">
	{#if total > 0}
		<div class="bg-muted flex h-3 overflow-hidden rounded-full">
			{#each value as sec, i (i)}
				{#if sec > 0}
					<div
						class={ZONE_COLOR_BG[(i + 1) as 1 | 2 | 3 | 4 | 5]}
						style="width: {(sec / total) * 100}%"
						title="Z{i + 1}: {formatTime(sec)}"
					></div>
				{/if}
			{/each}
		</div>
	{/if}
	<div class="grid grid-cols-5 gap-1 text-center text-xs">
		{#each value as sec, i (i)}
			<div class="rounded-md border px-2 py-1.5">
				<div class="flex items-center justify-center gap-1 font-medium">
					<span class="size-2 rounded-full {ZONE_COLOR_BG[(i + 1) as 1 | 2 | 3 | 4 | 5]}"></span>
					Z{i + 1}
				</div>
				<div class="text-muted-foreground text-[10px]">
					{zones[i].min}–{zones[i].max}
				</div>
				<div class="mt-0.5 font-semibold">{formatTime(sec)}</div>
			</div>
		{/each}
	</div>
</div>
