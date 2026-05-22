<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { workoutStore } from '../store.svelte';
	import { computeZones, type ZoneMinutes } from '../types';

	let { value = $bindable<ZoneMinutes>() }: { value: ZoneMinutes } = $props();

	const zones = $derived(computeZones(workoutStore.settings.maxHR));
	const totalMin = $derived(value.reduce((s, m) => s + (m || 0), 0));
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium">Время в зонах (мин)</span>
		<span class="text-muted-foreground text-xs">Всего: {totalMin} мин</span>
	</div>
	<div class="grid grid-cols-5 gap-2">
		{#each zones as z, i (z.zone)}
			<div class="flex flex-col gap-1">
				<div class="text-center">
					<div class="text-xs font-medium">Z{z.zone}</div>
					<div class="text-muted-foreground text-[10px]">{z.min}–{z.max}</div>
				</div>
				<Input
					type="number"
					min="0"
					class="text-center"
					bind:value={value[i]}
				/>
			</div>
		{/each}
	</div>
</div>
