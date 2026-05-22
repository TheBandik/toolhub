<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { workoutStore } from '../store.svelte';
	import { computeZones } from '../types';

	const zones = $derived(computeZones(workoutStore.settings.maxHR));

	function onMaxHR(e: Event) {
		const value = Number((e.target as HTMLInputElement).value);
		if (Number.isFinite(value) && value > 0) {
			workoutStore.updateSettings({ maxHR: value });
		}
	}
</script>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Максимальный пульс</Card.Title>
			<Card.Description>
				Используется для расчёта пульсовых зон. Apple Watch по умолчанию вычисляет как 220 − возраст.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex max-w-xs flex-col gap-2">
				<Label for="max-hr">Max HR (bpm)</Label>
				<Input
					id="max-hr"
					type="number"
					min="100"
					max="230"
					value={workoutStore.settings.maxHR}
					onchange={onMaxHR}
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Пульсовые зоны</Card.Title>
			<Card.Description>Рассчитываются автоматически от max HR (как в Apple Watch).</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex flex-col gap-2">
				{#each zones as z (z.zone)}
					<div class="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
						<span class="font-medium">Зона {z.zone}</span>
						<span class="text-muted-foreground">{z.min}–{z.max} bpm</span>
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</div>
