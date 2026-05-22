<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { musicStore } from '../store.svelte';
	import {
		GENRE_COLOR,
		formatDuration,
		formatHours,
		groupGenre,
		type GenreGroup
	} from '../types';

	const tracks = $derived(musicStore.tracks);

	const trackCount = $derived(tracks.length);
	const artistCount = $derived(new Set(tracks.map((t) => t.artist)).size);
	const albumCount = $derived(new Set(tracks.map((t) => t.album)).size);
	const totalSec = $derived(tracks.reduce((s, t) => s + (t.durationSec ?? 0), 0));

	const byGenre = $derived.by(() => {
		const map = new Map<GenreGroup, number>();
		for (const t of tracks) {
			const g = groupGenre(t.genre);
			map.set(g, (map.get(g) ?? 0) + 1);
		}
		return [...map.entries()].sort((a, b) => b[1] - a[1]);
	});

	const TOP_GENRES = 7;
	const genrePie = $derived.by(() => {
		const top = byGenre.slice(0, TOP_GENRES);
		const otherCount = byGenre.slice(TOP_GENRES).reduce((s, [, c]) => s + c, 0);
		const entries = top.map(([g, c]) => ({ label: g, count: c, color: GENRE_COLOR[g] }));
		if (otherCount > 0) entries.push({ label: 'Other', count: otherCount, color: GENRE_COLOR.Other });
		const total = entries.reduce((s, e) => s + e.count, 0) || 1;
		let from = 0;
		const segments = entries.map((e) => {
			const angle = (e.count / total) * 360;
			const seg = { ...e, from, to: from + angle, share: e.count / total };
			from += angle;
			return seg;
		});
		const gradient =
			`conic-gradient(from -90deg, ` +
			segments.map((s) => `${s.color} ${s.from}deg ${s.to}deg`).join(', ') +
			`)`;
		return { segments, gradient };
	});

	const topArtists = $derived.by(() => {
		const map = new Map<string, number>();
		for (const t of tracks) map.set(t.artist, (map.get(t.artist) ?? 0) + 1);
		return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
	});
	const maxArtist = $derived(topArtists[0]?.[1] ?? 1);

	const topAlbums = $derived.by(() => {
		const map = new Map<string, { artist: string; count: number }>();
		for (const t of tracks) {
			const cur = map.get(t.album);
			if (cur) cur.count++;
			else map.set(t.album, { artist: t.artist, count: 1 });
		}
		return [...map.entries()]
			.map(([album, v]) => ({ album, artist: v.artist, count: v.count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);
	});
	const maxAlbum = $derived(topAlbums[0]?.count ?? 1);

	const BUCKETS = [
		{ label: '<1', max: 60 },
		{ label: '1–2', max: 120 },
		{ label: '2–3', max: 180 },
		{ label: '3–4', max: 240 },
		{ label: '4–5', max: 300 },
		{ label: '5–6', max: 360 },
		{ label: '6+', max: Infinity }
	];
	const histogram = $derived.by(() => {
		const counts = BUCKETS.map(() => 0);
		for (const t of tracks) {
			if (t.durationSec == null) continue;
			let idx = BUCKETS.findIndex((b) => t.durationSec! < b.max);
			if (idx === -1) idx = BUCKETS.length - 1;
			counts[idx]++;
		}
		const max = Math.max(...counts, 1);
		return BUCKETS.map((b, i) => ({ label: b.label, count: counts[i], share: counts[i] / max }));
	});

	const longest = $derived(
		[...tracks]
			.filter((t) => t.durationSec != null)
			.sort((a, b) => (b.durationSec ?? 0) - (a.durationSec ?? 0))
			.slice(0, 10)
	);

	const artistCounts = $derived.by(() => {
		const map = new Map<string, number>();
		for (const t of tracks) map.set(t.artist, (map.get(t.artist) ?? 0) + 1);
		return map;
	});
	const oneTrackArtists = $derived([...artistCounts.values()].filter((c) => c === 1).length);
	const recurringArtists = $derived(artistCount - oneTrackArtists);

	const durationsAvailable = $derived(tracks.filter((t) => t.durationSec != null));
	const avgSec = $derived(
		durationsAvailable.length
			? durationsAvailable.reduce((s, t) => s + (t.durationSec ?? 0), 0) / durationsAvailable.length
			: 0
	);
	const medianSec = $derived.by(() => {
		const arr = durationsAvailable.map((t) => t.durationSec!).sort((a, b) => a - b);
		if (!arr.length) return 0;
		const mid = arr.length >> 1;
		return arr.length % 2 ? arr[mid] : Math.round((arr[mid - 1] + arr[mid]) / 2);
	});
</script>

<div class="flex flex-col gap-6">
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		<Card.Root>
			<Card.Header>
				<Card.Description>Треков</Card.Description>
				<Card.Title class="text-3xl">{trackCount}</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Description>Исполнителей</Card.Description>
				<Card.Title class="text-3xl">{artistCount}</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Description>Альбомов</Card.Description>
				<Card.Title class="text-3xl">{albumCount}</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Description>Длительность</Card.Description>
				<Card.Title class="text-3xl">{formatHours(totalSec)}</Card.Title>
			</Card.Header>
		</Card.Root>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Жанры</Card.Title>
				<Card.Description>Топ-{TOP_GENRES} + остальные</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
					<div class="relative size-44 shrink-0">
						<div class="size-full rounded-full" style="background: {genrePie.gradient}"></div>
						<div
							class="bg-card absolute inset-[22%] flex flex-col items-center justify-center rounded-full"
						>
							<div class="text-2xl font-semibold">{trackCount}</div>
							<div class="text-muted-foreground text-xs">треков</div>
						</div>
					</div>
					<div class="flex flex-1 flex-col gap-1.5">
						{#each genrePie.segments as s (s.label)}
							<div class="flex items-center gap-2 text-sm">
								<span class="size-3 shrink-0 rounded-sm" style="background-color: {s.color}"></span>
								<span class="flex-1 truncate">{s.label}</span>
								<span class="text-muted-foreground tabular-nums">{s.count}</span>
								<span class="text-muted-foreground w-12 text-right text-xs tabular-nums">
									{(s.share * 100).toFixed(1)}%
								</span>
							</div>
						{/each}
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Топ исполнителей</Card.Title>
				<Card.Description>По количеству треков</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-2">
				{#each topArtists as [artist, count] (artist)}
					<div class="flex flex-col gap-1">
						<div class="flex items-center justify-between text-sm">
							<span class="truncate">{artist}</span>
							<span class="text-muted-foreground tabular-nums">{count}</span>
						</div>
						<div class="bg-muted h-2 overflow-hidden rounded-full">
							<div class="bg-primary h-full" style="width: {(count / maxArtist) * 100}%"></div>
						</div>
					</div>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Топ альбомов</Card.Title>
				<Card.Description>По количеству треков в библиотеке</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-2">
				{#each topAlbums as row (row.album)}
					<div class="flex flex-col gap-1">
						<div class="flex items-center justify-between gap-3 text-sm">
							<div class="flex min-w-0 flex-1 flex-col">
								<span class="truncate">{row.album}</span>
								<span class="text-muted-foreground truncate text-xs">{row.artist}</span>
							</div>
							<span class="text-muted-foreground tabular-nums">{row.count}</span>
						</div>
						<div class="bg-muted h-2 overflow-hidden rounded-full">
							<div class="bg-primary h-full" style="width: {(row.count / maxAlbum) * 100}%"></div>
						</div>
					</div>
				{/each}
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Длительности</Card.Title>
				<Card.Description>Распределение треков по диапазонам, мин</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex h-44 items-end gap-2">
					{#each histogram as b (b.label)}
						<div class="flex flex-1 flex-col items-center gap-1">
							<div class="text-xs font-medium tabular-nums">{b.count}</div>
							<div
								class="bg-primary w-full rounded-t"
								style="height: {Math.max(b.share * 100, 2)}%"
							></div>
							<div class="text-muted-foreground text-xs">{b.label}</div>
						</div>
					{/each}
				</div>
				<div class="text-muted-foreground mt-3 flex items-center justify-between text-xs">
					<span>Среднее: {formatDuration(Math.round(avgSec))}</span>
					<span>Медиана: {formatDuration(medianSec)}</span>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Длиннейшие треки</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-col">
					{#each longest as t (t.id)}
						<div class="flex items-center gap-3 border-b py-2 last:border-b-0 text-sm">
							<div class="flex min-w-0 flex-1 flex-col">
								<span class="truncate font-medium">{t.name}</span>
								<span class="text-muted-foreground truncate text-xs">{t.artist}</span>
							</div>
							<span class="tabular-nums">{formatDuration(t.durationSec)}</span>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Структура коллекции</Card.Title>
				<Card.Description>Исполнители с одним треком vs регулярные</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-4">
				<div class="bg-muted flex h-4 overflow-hidden rounded-full">
					<div
						class="bg-primary h-full"
						style="width: {artistCount ? (recurringArtists / artistCount) * 100 : 0}%"
					></div>
					<div
						class="h-full bg-muted-foreground/40"
						style="width: {artistCount ? (oneTrackArtists / artistCount) * 100 : 0}%"
					></div>
				</div>
				<div class="grid grid-cols-2 gap-3 text-sm">
					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-2">
							<span class="bg-primary size-3 rounded-sm"></span>
							<span>Регулярные</span>
						</div>
						<div class="text-2xl font-semibold tabular-nums">{recurringArtists}</div>
						<div class="text-muted-foreground text-xs">≥ 2 треков</div>
					</div>
					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-2">
							<span class="bg-muted-foreground/40 size-3 rounded-sm"></span>
							<span>Одиночки</span>
						</div>
						<div class="text-2xl font-semibold tabular-nums">{oneTrackArtists}</div>
						<div class="text-muted-foreground text-xs">ровно 1 трек</div>
					</div>
				</div>
				<div class="text-muted-foreground border-t pt-3 text-xs">
					Средняя длительность трека — {formatDuration(Math.round(avgSec))}, медиана — {formatDuration(
						medianSec
					)}.
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
