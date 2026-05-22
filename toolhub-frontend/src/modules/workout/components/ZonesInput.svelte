<script lang="ts">
	import { workoutStore } from '../store.svelte';
	import { computeZones, ZONE_COLOR_BG, type ZoneSeconds } from '../types';
	import TimeInput from './TimeInput.svelte';

	let { value = $bindable<ZoneSeconds>() }: { value: ZoneSeconds } = $props();

	const zones = $derived(computeZones(workoutStore.settings));
	const totalSec = $derived(value.reduce((s, m) => s + (m || 0), 0));

	function formatTotal(sec: number): string {
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m} мин ${String(s).padStart(2, '0')} сек`;
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium">Время в зонах</span>
		<span class="text-muted-foreground text-xs">Всего: {formatTotal(totalSec)}</span>
	</div>
	<div class="grid grid-cols-5 gap-2">
		{#each zones as z, i (z.zone)}
			<div class="flex flex-col gap-1">
				<div class="text-center">
					<div class="flex items-center justify-center gap-1 text-xs font-medium">
						<span class="size-2 rounded-full {ZONE_COLOR_BG[z.zone]}"></span>
						Z{z.zone}
					</div>
					<div class="text-muted-foreground text-[10px]">{z.min}–{z.max}</div>
				</div>
				<TimeInput class="text-center" bind:value={value[i]} />
			</div>
		{/each}
	</div>
</div>
