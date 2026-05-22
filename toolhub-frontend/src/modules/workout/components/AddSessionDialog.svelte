<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { workoutStore } from '../store.svelte';
	import { WORKOUT_TYPE_LABELS, type WorkoutType } from '../types';

	let { open = $bindable() }: { open: boolean } = $props();

	const today = () => new Date().toISOString().slice(0, 10);

	let date = $state(today());
	let type = $state<WorkoutType>('tennis');
	let durationMin = $state(60);
	let note = $state('');

	function reset() {
		date = today();
		type = 'tennis';
		durationMin = 60;
		note = '';
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		workoutStore.add({ date, type, durationMin, note: note.trim() || undefined });
		reset();
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Новая тренировка</Dialog.Title>
		</Dialog.Header>
		<form onsubmit={submit} class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<Label for="session-date">Дата</Label>
				<Input id="session-date" type="date" bind:value={date} required />
			</div>
			<div class="flex flex-col gap-2">
				<Label>Тип</Label>
				<div class="flex flex-wrap gap-2">
					{#each Object.entries(WORKOUT_TYPE_LABELS) as [value, label] (value)}
						<Button
							type="button"
							variant={type === value ? 'default' : 'outline'}
							size="sm"
							onclick={() => (type = value as WorkoutType)}
						>
							{label}
						</Button>
					{/each}
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<Label for="session-duration">Длительность (мин)</Label>
				<Input id="session-duration" type="number" min="1" bind:value={durationMin} required />
			</div>
			<div class="flex flex-col gap-2">
				<Label for="session-note">Заметка</Label>
				<Input id="session-note" bind:value={note} placeholder="Опционально" />
			</div>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Отмена</Button>
				<Button type="submit">Добавить</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
