<script lang="ts">
	import Dumbbell from '@lucide/svelte/icons/dumbbell';
	import { Button } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<Dumbbell class="text-muted-foreground size-6" />
			<h2 class="text-2xl font-semibold tracking-tight">Workout</h2>
		</div>
		<Button>
			<Plus class="size-4" />
			Новая тренировка
		</Button>
	</div>

	<p class="text-muted-foreground text-sm">
		Трекер тренировок: теннис, бег, силовые. Бэка пока нет — это заглушка.
	</p>

	<div
		class="bg-card text-card-foreground flex h-64 items-center justify-center rounded-lg border border-dashed"
	>
		<span class="text-muted-foreground text-sm">Список тренировок появится здесь</span>
	</div>
</div>
