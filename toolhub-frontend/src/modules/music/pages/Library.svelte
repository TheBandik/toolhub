<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import X from '@lucide/svelte/icons/x';
	import { musicStore } from '../store.svelte';
	import { GENRE_COLOR, formatDuration, groupGenre, type GenreGroup } from '../types';

	let query = $state('');
	let genreFilter = $state<GenreGroup | null>(null);

	const groupCounts = $derived.by(() => {
		const map = new Map<GenreGroup, number>();
		for (const t of musicStore.tracks) {
			const g = groupGenre(t.genre);
			map.set(g, (map.get(g) ?? 0) + 1);
		}
		return [...map.entries()].sort((a, b) => b[1] - a[1]);
	});

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return musicStore.tracks.filter((t) => {
			if (genreFilter && groupGenre(t.genre) !== genreFilter) return false;
			if (!q) return true;
			return (
				t.name.toLowerCase().includes(q) ||
				t.artist.toLowerCase().includes(q) ||
				t.album.toLowerCase().includes(q)
			);
		});
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-3">
		<Input placeholder="Поиск по названию, исполнителю, альбому…" bind:value={query} />
		<div class="flex flex-wrap items-center gap-2">
			{#each groupCounts as [g, count] (g)}
				<Button
					type="button"
					variant={genreFilter === g ? 'default' : 'outline'}
					size="sm"
					onclick={() => (genreFilter = genreFilter === g ? null : g)}
				>
					<span class="size-2 rounded-full" style="background-color: {GENRE_COLOR[g]}"></span>
					{g}
					<span class="text-muted-foreground ml-1 text-xs">{count}</span>
				</Button>
			{/each}
			{#if genreFilter}
				<Button type="button" variant="ghost" size="sm" onclick={() => (genreFilter = null)}>
					<X class="size-3.5" />
					Сбросить
				</Button>
			{/if}
		</div>
		<div class="text-muted-foreground text-xs">
			Найдено: {filtered.length} из {musicStore.tracks.length}
		</div>
	</div>

	<div class="bg-card rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Название</Table.Head>
					<Table.Head>Исполнитель</Table.Head>
					<Table.Head>Альбом</Table.Head>
					<Table.Head>Жанр</Table.Head>
					<Table.Head class="text-right">Длительность</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each filtered as track (track.id)}
					{@const g = groupGenre(track.genre)}
					<Table.Row>
						<Table.Cell class="font-medium">{track.name}</Table.Cell>
						<Table.Cell>{track.artist}</Table.Cell>
						<Table.Cell class="text-muted-foreground max-w-[18rem] truncate">{track.album}</Table.Cell>
						<Table.Cell>
							<Badge variant="outline">
								<span
									class="size-2 rounded-full"
									style="background-color: {GENRE_COLOR[g]}"
								></span>
								{track.genre ?? g}
							</Badge>
						</Table.Cell>
						<Table.Cell class="text-right whitespace-nowrap">{formatDuration(track.durationSec)}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
