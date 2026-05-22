<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import { workoutStore } from '../store.svelte';
	import { WORKOUT_TYPE_LABELS, type WorkoutSession } from '../types';
	import AddSessionDialog from '../components/AddSessionDialog.svelte';

	let dialogOpen = $state(false);

	function detailsSummary(s: WorkoutSession): string {
		const d = s.details;
		if (!d) return s.note ?? '';
		if (d.type === 'tennis') {
			const parts: string[] = [d.kind === 'match' ? 'матч' : 'тренировка'];
			if (d.score) parts.push(d.score);
			if (d.partner) parts.push(`с ${d.partner}`);
			return parts.join(' · ');
		}
		if (d.type === 'running') {
			const parts: string[] = [];
			if (d.location) parts.push(d.location);
			if (d.avgPaceSecPerKm) {
				const m = Math.floor(d.avgPaceSecPerKm / 60);
				const sec = String(d.avgPaceSecPerKm % 60).padStart(2, '0');
				parts.push(`${m}:${sec}/км`);
			}
			if (d.elevationGainM) parts.push(`+${d.elevationGainM} м`);
			return parts.join(' · ') || (s.note ?? '');
		}
		if (d.type === 'strength') {
			if (!d.exercises.length) return s.note ?? '';
			return `${d.exercises.length} упр.`;
		}
		return s.note ?? '';
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-end">
		<Button onclick={() => (dialogOpen = true)}>
			<Plus class="size-4" />
			Новая тренировка
		</Button>
	</div>

	<div class="bg-card rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Дата</Table.Head>
					<Table.Head>Тип</Table.Head>
					<Table.Head class="text-right">Длит.</Table.Head>
					<Table.Head class="text-right">Дист.</Table.Head>
					<Table.Head class="text-right">Ср. пульс</Table.Head>
					<Table.Head class="text-right">Ккал</Table.Head>
					<Table.Head class="text-right">RPE</Table.Head>
					<Table.Head>Детали</Table.Head>
					<Table.Head class="w-12"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each workoutStore.sessions as session (session.id)}
					<Table.Row>
						<Table.Cell class="whitespace-nowrap">{session.date}</Table.Cell>
						<Table.Cell>
							<Badge variant="secondary">{WORKOUT_TYPE_LABELS[session.type]}</Badge>
						</Table.Cell>
						<Table.Cell class="text-right">{session.durationMin} мин</Table.Cell>
						<Table.Cell class="text-right text-muted-foreground">
							{session.distanceKm ? `${session.distanceKm} км` : '—'}
						</Table.Cell>
						<Table.Cell class="text-right text-muted-foreground">
							{session.avgHR ?? '—'}
						</Table.Cell>
						<Table.Cell class="text-right text-muted-foreground">
							{session.activeCalories ?? '—'}
						</Table.Cell>
						<Table.Cell class="text-right text-muted-foreground">
							{session.rpe ?? '—'}
						</Table.Cell>
						<Table.Cell class="text-muted-foreground max-w-[16rem] truncate">
							{detailsSummary(session) || '—'}
						</Table.Cell>
						<Table.Cell>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger
									class={buttonVariants({ variant: 'ghost', size: 'icon' })}
								>
									<MoreHorizontal class="size-4" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item onSelect={() => workoutStore.remove(session.id)}>
										Удалить
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<AddSessionDialog bind:open={dialogOpen} />
