<script lang="ts">
	import {
		UPPER_RIGHT,
		UPPER_LEFT,
		LOWER_RIGHT,
		LOWER_LEFT,
		TOOTH_STATUS_COLORS,
		TOOTH_STATUS_LABELS,
		TOOTH_STATUS_ORDER,
		type ToothStatus,
		type TeethMap,
		type ToothRecord
	} from '../types';

	let { teeth, onchange }: { teeth: TeethMap; onchange: (id: number, rec: ToothRecord) => void } =
		$props();

	let activeToothId = $state<number | null>(null);
	let noteInput = $state('');

	function getStatus(id: number): ToothStatus {
		return teeth[id]?.status ?? 'healthy';
	}

	function getNote(id: number): string {
		return teeth[id]?.note ?? '';
	}

	function openTooth(id: number) {
		activeToothId = id;
		noteInput = getNote(id);
	}

	function closeTooth() {
		activeToothId = null;
	}

	function setStatus(status: ToothStatus) {
		if (activeToothId == null) return;
		onchange(activeToothId, { status, note: noteInput.trim() || undefined });
		if (status === 'healthy') closeTooth();
	}

	function saveNote() {
		if (activeToothId == null) return;
		const current = getStatus(activeToothId);
		onchange(activeToothId, { status: current, note: noteInput.trim() || undefined });
		closeTooth();
	}

	const STATUS_BG_CLASS: Record<ToothStatus, string> = {
		healthy: 'bg-background',
		filled: 'bg-emerald-200 dark:bg-emerald-800',
		caries: 'bg-red-200 dark:bg-red-900',
		crown: 'bg-yellow-200 dark:bg-yellow-800',
		implant: 'bg-cyan-200 dark:bg-cyan-800',
		removed: 'bg-gray-300 dark:bg-gray-600'
	};
</script>

<div class="select-none">
	<!-- Legend -->
	<div class="mb-4 flex flex-wrap gap-3">
		{#each TOOTH_STATUS_ORDER as s (s)}
			<div class="flex items-center gap-1.5 text-xs">
				<span class="size-3 rounded-sm border {STATUS_BG_CLASS[s]}"></span>
				{TOOTH_STATUS_LABELS[s]}
			</div>
		{/each}
	</div>

	<!-- Chart -->
	<div class="bg-card rounded-xl border p-4">
		<!-- Upper jaw label -->
		<div class="mb-2 text-center text-xs font-medium text-muted-foreground tracking-widest uppercase">
			Верхняя челюсть
		</div>

		<!-- Upper jaw -->
		<div class="flex justify-center gap-1">
			<!-- Upper right (18→11, rendered left→right) -->
			{#each UPPER_RIGHT as id (id)}
				{@const status = getStatus(id)}
				{@const isActive = activeToothId === id}
				<button
					type="button"
					onclick={() => openTooth(id)}
					title="{id} — {TOOTH_STATUS_LABELS[status]}{getNote(id) ? ': ' + getNote(id) : ''}"
					class="group relative flex w-9 flex-col items-center gap-0.5"
				>
					<span class="text-[10px] text-muted-foreground tabular-nums">{id}</span>
					<span
						class="flex h-8 w-full items-center justify-center rounded-t-md border text-[9px] font-bold transition-all
							{STATUS_BG_CLASS[status]}
							{isActive ? 'ring-2 ring-primary ring-offset-1' : 'hover:ring-1 hover:ring-primary/50'}
							{status === 'removed' ? 'text-muted-foreground' : ''}"
					>
						{#if status === 'removed'}✕{/if}
					</span>
				</button>
			{/each}

			<!-- Center gap -->
			<div class="w-3 shrink-0"></div>

			<!-- Upper left (21→28) -->
			{#each UPPER_LEFT as id (id)}
				{@const status = getStatus(id)}
				{@const isActive = activeToothId === id}
				<button
					type="button"
					onclick={() => openTooth(id)}
					title="{id} — {TOOTH_STATUS_LABELS[status]}{getNote(id) ? ': ' + getNote(id) : ''}"
					class="group relative flex w-9 flex-col items-center gap-0.5"
				>
					<span class="text-[10px] text-muted-foreground tabular-nums">{id}</span>
					<span
						class="flex h-8 w-full items-center justify-center rounded-t-md border text-[9px] font-bold transition-all
							{STATUS_BG_CLASS[status]}
							{isActive ? 'ring-2 ring-primary ring-offset-1' : 'hover:ring-1 hover:ring-primary/50'}
							{status === 'removed' ? 'text-muted-foreground' : ''}"
					>
						{#if status === 'removed'}✕{/if}
					</span>
				</button>
			{/each}
		</div>

		<!-- Jaw separator -->
		<div class="relative my-3 flex items-center justify-center gap-2">
			<div class="h-px flex-1 bg-border"></div>
			<span class="text-[10px] text-muted-foreground px-2">десна</span>
			<div class="h-px flex-1 bg-border"></div>
		</div>

		<!-- Lower jaw -->
		<div class="flex justify-center gap-1">
			<!-- Lower right (48→41) -->
			{#each LOWER_RIGHT as id (id)}
				{@const status = getStatus(id)}
				{@const isActive = activeToothId === id}
				<button
					type="button"
					onclick={() => openTooth(id)}
					title="{id} — {TOOTH_STATUS_LABELS[status]}{getNote(id) ? ': ' + getNote(id) : ''}"
					class="group relative flex w-9 flex-col items-center gap-0.5"
				>
					<span
						class="flex h-8 w-full items-center justify-center rounded-b-md border text-[9px] font-bold transition-all
							{STATUS_BG_CLASS[status]}
							{isActive ? 'ring-2 ring-primary ring-offset-1' : 'hover:ring-1 hover:ring-primary/50'}
							{status === 'removed' ? 'text-muted-foreground' : ''}"
					>
						{#if status === 'removed'}✕{/if}
					</span>
					<span class="text-[10px] text-muted-foreground tabular-nums">{id}</span>
				</button>
			{/each}

			<!-- Center gap -->
			<div class="w-3 shrink-0"></div>

			<!-- Lower left (31→38) -->
			{#each LOWER_LEFT as id (id)}
				{@const status = getStatus(id)}
				{@const isActive = activeToothId === id}
				<button
					type="button"
					onclick={() => openTooth(id)}
					title="{id} — {TOOTH_STATUS_LABELS[status]}{getNote(id) ? ': ' + getNote(id) : ''}"
					class="group relative flex w-9 flex-col items-center gap-0.5"
				>
					<span
						class="flex h-8 w-full items-center justify-center rounded-b-md border text-[9px] font-bold transition-all
							{STATUS_BG_CLASS[status]}
							{isActive ? 'ring-2 ring-primary ring-offset-1' : 'hover:ring-1 hover:ring-primary/50'}
							{status === 'removed' ? 'text-muted-foreground' : ''}"
					>
						{#if status === 'removed'}✕{/if}
					</span>
					<span class="text-[10px] text-muted-foreground tabular-nums">{id}</span>
				</button>
			{/each}
		</div>

		<div class="mt-2 text-center text-xs font-medium text-muted-foreground tracking-widest uppercase">
			Нижняя челюсть
		</div>
	</div>

	<!-- Inline editor — appears when a tooth is selected -->
	{#if activeToothId != null}
		{@const currentStatus = getStatus(activeToothId)}
		<div class="mt-3 rounded-lg border bg-muted/40 p-3 flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium">Зуб {activeToothId}</span>
				<button type="button" onclick={closeTooth} class="text-muted-foreground text-xs hover:text-foreground">✕ закрыть</button>
			</div>
			<div class="flex flex-wrap gap-1.5">
				{#each TOOTH_STATUS_ORDER as s (s)}
					<button
						type="button"
						onclick={() => setStatus(s)}
						class="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors
							{currentStatus === s ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'}
							{STATUS_BG_CLASS[s] !== 'bg-background' && currentStatus !== s ? STATUS_BG_CLASS[s] + ' border-transparent' : ''}"
					>
						{TOOTH_STATUS_LABELS[s]}
					</button>
				{/each}
			</div>
			<div class="flex gap-2">
				<input
					type="text"
					bind:value={noteInput}
					placeholder="Заметка (напр. «Штифт», «Незначительный»)…"
					class="h-8 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-primary"
				/>
				<button
					type="button"
					onclick={saveNote}
					class="h-8 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
				>
					Сохранить
				</button>
			</div>
		</div>
	{/if}
</div>
