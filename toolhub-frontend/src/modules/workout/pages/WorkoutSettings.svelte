<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { workoutStore } from '../store.svelte';
	import { computeZones, ZONE_METHOD_LABELS, type ZoneMethod } from '../types';

	const zones = $derived(computeZones(workoutStore.settings));

	function setMethod(m: ZoneMethod) {
		workoutStore.updateSettings({ zoneMethod: m });
	}

	function onNumber(field: 'maxHR' | 'restHR') {
		return (e: Event) => {
			const value = Number((e.target as HTMLInputElement).value);
			if (Number.isFinite(value) && value > 0) {
				workoutStore.updateSettings({ [field]: value });
			}
		};
	}
</script>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Метод расчёта зон</Card.Title>
			<Card.Description>
				По максимуму — проценты от max HR. По резерву (Karvonen) — проценты от резерва (max − rest) поверх пульса покоя.
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<div class="flex flex-wrap gap-2">
				{#each Object.entries(ZONE_METHOD_LABELS) as [value, label] (value)}
					<Button
						type="button"
						variant={workoutStore.settings.zoneMethod === value ? 'default' : 'outline'}
						size="sm"
						onclick={() => setMethod(value as ZoneMethod)}
					>
						{label}
					</Button>
				{/each}
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-2">
					<Label for="max-hr">Max HR (bpm)</Label>
					<Input
						id="max-hr"
						type="number"
						min="100"
						max="230"
						value={workoutStore.settings.maxHR}
						onchange={onNumber('maxHR')}
					/>
				</div>
				{#if workoutStore.settings.zoneMethod === 'reserve'}
					<div class="flex flex-col gap-2">
						<Label for="rest-hr">Rest HR (bpm)</Label>
						<Input
							id="rest-hr"
							type="number"
							min="30"
							max="120"
							value={workoutStore.settings.restHR}
							onchange={onNumber('restHR')}
						/>
					</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Пульсовые зоны</Card.Title>
			<Card.Description>
				{workoutStore.settings.zoneMethod === 'reserve'
					? 'От резерва пульса: rest + (max − rest) × %'
					: 'От максимального пульса: max × %'}
			</Card.Description>
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
