<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import { workoutStore } from '../store.svelte';
	import { WORKOUT_TYPE_LABELS } from '../types';
	import AddSessionDialog from '../components/AddSessionDialog.svelte';

	let dialogOpen = $state(false);
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
					<Table.Head>Длительность</Table.Head>
					<Table.Head>Заметка</Table.Head>
					<Table.Head class="w-12"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each workoutStore.sessions as session (session.id)}
					<Table.Row>
						<Table.Cell>{session.date}</Table.Cell>
						<Table.Cell>
							<Badge variant="secondary">{WORKOUT_TYPE_LABELS[session.type]}</Badge>
						</Table.Cell>
						<Table.Cell>{session.durationMin} мин</Table.Cell>
						<Table.Cell class="text-muted-foreground">{session.note ?? '—'}</Table.Cell>
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
