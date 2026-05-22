<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash from '@lucide/svelte/icons/trash-2';
	import type { StrengthExercise } from '../types';

	let { value = $bindable<StrengthExercise[]>() }: { value: StrengthExercise[] } = $props();

	function addExercise() {
		value.push({ name: '', sets: 3, reps: 10 });
	}

	function removeExercise(i: number) {
		value.splice(i, 1);
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium">Упражнения</span>
		<Button type="button" variant="outline" size="sm" onclick={addExercise}>
			<Plus class="size-3.5" />
			Добавить
		</Button>
	</div>

	{#if value.length === 0}
		<div class="text-muted-foreground rounded-md border border-dashed py-4 text-center text-xs">
			Нет упражнений
		</div>
	{:else}
		<div class="flex flex-col gap-2">
			{#each value as ex, i (i)}
				<div class="grid grid-cols-[1fr_4rem_4rem_5rem_auto] items-center gap-2">
					<Input placeholder="Название" bind:value={ex.name} />
					<Input type="number" min="1" placeholder="Подх." bind:value={ex.sets} />
					<Input type="number" min="1" placeholder="Повт." bind:value={ex.reps} />
					<Input type="number" min="0" step="0.5" placeholder="Вес, кг" bind:value={ex.weightKg} />
					<button
						type="button"
						class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
						onclick={() => removeExercise(i)}
						aria-label="Удалить"
					>
						<Trash class="size-3.5" />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
