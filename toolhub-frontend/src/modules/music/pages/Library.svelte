<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import X from '@lucide/svelte/icons/x';
	import Plus from '@lucide/svelte/icons/plus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import { musicStore } from '../store.svelte';
	import { GENRE_COLOR, formatDuration, groupGenre, GENRE_GROUPS, type GenreGroup } from '../types';

	let query = $state('');
	let genreFilter = $state<GenreGroup | null>(null);
	let addOpen = $state(false);

	// add track form state
	let trackName = $state('');
	let trackArtist = $state('');
	let trackAlbum = $state('');
	let trackGenre = $state('');
	let trackDuration = $state('');

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

	function parseDuration(s: string): number | undefined {
		const trimmed = s.trim();
		if (!trimmed) return undefined;
		// формат m:ss или просто секунды
		const parts = trimmed.split(':');
		if (parts.length === 2) {
			const m = parseInt(parts[0], 10);
			const sec = parseInt(parts[1], 10);
			if (!isNaN(m) && !isNaN(sec)) return m * 60 + sec;
		}
		const n = parseInt(trimmed, 10);
		return isNaN(n) ? undefined : n;
	}

	function resetForm() {
		trackName = '';
		trackArtist = '';
		trackAlbum = '';
		trackGenre = '';
		trackDuration = '';
	}

	function submitAdd(e: SubmitEvent) {
		e.preventDefault();
		musicStore.add({
			name: trackName.trim(),
			artist: trackArtist.trim(),
			album: trackAlbum.trim(),
			genre: trackGenre.trim() || undefined,
			durationSec: parseDuration(trackDuration)
		});
		resetForm();
		addOpen = false;
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-3">
		<div class="flex items-center gap-3">
			<Input placeholder="Поиск по названию, исполнителю, альбому…" bind:value={query} class="flex-1" />
			<Button onclick={() => (addOpen = true)}>
				<Plus class="size-4" />
				Добавить трек
			</Button>
		</div>
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

	<div class="bg-card overflow-x-auto rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Название</Table.Head>
					<Table.Head>Исполнитель</Table.Head>
					<Table.Head>Альбом</Table.Head>
					<Table.Head>Жанр</Table.Head>
					<Table.Head class="text-right">Длительность</Table.Head>
					<Table.Head class="w-12"></Table.Head>
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
						<Table.Cell>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
									<MoreHorizontal class="size-4" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item onSelect={() => musicStore.remove(track.id)}>
										Удалить
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
				{#if filtered.length === 0}
					<Table.Row>
						<Table.Cell colspan={6} class="text-muted-foreground py-10 text-center text-sm">
							Ничего не найдено
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<Dialog.Root bind:open={addOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Добавить трек</Dialog.Title>
		</Dialog.Header>
		<form onsubmit={submitAdd} class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<Label for="track-name">Название</Label>
				<Input id="track-name" bind:value={trackName} required />
			</div>
			<div class="flex flex-col gap-2">
				<Label for="track-artist">Исполнитель</Label>
				<Input id="track-artist" bind:value={trackArtist} required />
			</div>
			<div class="flex flex-col gap-2">
				<Label for="track-album">Альбом</Label>
				<Input id="track-album" bind:value={trackAlbum} required />
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-2">
					<Label for="track-genre">Жанр</Label>
					<Input id="track-genre" bind:value={trackGenre} list="genre-list" placeholder="Pop, Rock…" />
					<datalist id="genre-list">
						{#each GENRE_GROUPS as g (g)}
							<option value={g}></option>
						{/each}
					</datalist>
				</div>
				<div class="flex flex-col gap-2">
					<Label for="track-duration">Длительность</Label>
					<Input id="track-duration" bind:value={trackDuration} placeholder="3:45" />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (addOpen = false)}>Отмена</Button>
				<Button type="submit">Добавить</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
