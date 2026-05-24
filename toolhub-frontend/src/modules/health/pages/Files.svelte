<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Plus from '@lucide/svelte/icons/plus';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import { healthStore } from '../store.svelte';
	import { FILE_TYPE_ICONS, formatFileSize, type MedFileType } from '../types';

	let addOpen = $state(false);
	let fileName = $state('');
	let fileDate = $state(new Date().toISOString().slice(0, 10));
	let fileType = $state<MedFileType>('pdf');
	let fileNotes = $state('');

	const sorted = $derived(
		[...healthStore.files].sort((a, b) => b.date.localeCompare(a.date))
	);

	function formatDate(d: string) {
		return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	function detectType(name: string): MedFileType {
		const ext = name.split('.').pop()?.toLowerCase();
		if (ext === 'pdf') return 'pdf';
		if (ext === 'jpg' || ext === 'jpeg') return 'jpg';
		if (ext === 'png') return 'png';
		if (ext === 'docx' || ext === 'doc') return 'docx';
		return 'other';
	}

	function onNameInput() {
		fileType = detectType(fileName);
	}

	function submitAdd(e: SubmitEvent) {
		e.preventDefault();
		healthStore.addFile({
			name: fileName.trim(),
			date: fileDate,
			fileType,
			sizeKb: Math.floor(Math.random() * 2000) + 100, // mock size
			notes: fileNotes.trim() || undefined
		});
		fileName = '';
		fileNotes = '';
		addOpen = false;
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<p class="text-muted-foreground text-sm">
			Документы, снимки, выписки. Реальная загрузка появится в бэкенде — пока сохраняем метаданные.
		</p>
		<Button onclick={() => (addOpen = true)}>
			<Plus class="size-4" />
			Добавить файл
		</Button>
	</div>

	<div class="bg-card rounded-lg border">
		{#if sorted.length === 0}
			<div class="text-muted-foreground py-16 text-center text-sm">
				Файлов пока нет
			</div>
		{:else}
			<div class="flex flex-col divide-y">
				{#each sorted as file (file.id)}
					<div class="flex items-center gap-3 px-4 py-3">
						<span class="text-2xl">{FILE_TYPE_ICONS[file.fileType]}</span>
						<div class="flex flex-1 flex-col gap-0.5 min-w-0">
							<span class="font-medium text-sm truncate">{file.name}</span>
							<div class="flex items-center gap-2 flex-wrap">
								<span class="text-muted-foreground text-xs">{formatDate(file.date)}</span>
								<span class="text-muted-foreground text-xs">·</span>
								<span class="text-muted-foreground text-xs">{formatFileSize(file.sizeKb)}</span>
								{#if file.notes}
									<span class="text-muted-foreground text-xs">· {file.notes}</span>
								{/if}
							</div>
						</div>
						<Badge variant="outline" class="shrink-0 uppercase text-xs">{file.fileType}</Badge>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
								<MoreHorizontal class="size-4" />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								<DropdownMenu.Item onSelect={() => healthStore.removeFile(file.id)}>
									Удалить
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<Dialog.Root bind:open={addOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Добавить файл</Dialog.Title>
			<Dialog.Description>Сохраняем только метаданные — загрузка в бэкенде</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={submitAdd} class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<Label for="f-name">Имя файла</Label>
				<Input
					id="f-name"
					bind:value={fileName}
					oninput={onNameInput}
					placeholder="результат_анализа.pdf"
					required
				/>
			</div>
			<div class="flex flex-col gap-2">
				<Label for="f-date">Дата</Label>
				<Input id="f-date" type="date" bind:value={fileDate} required />
			</div>
			<div class="flex flex-col gap-2">
				<Label>Тип</Label>
				<div class="flex flex-wrap gap-1.5">
					{#each (['pdf', 'jpg', 'png', 'docx', 'other'] as MedFileType[]) as t (t)}
						<Button
							type="button"
							variant={fileType === t ? 'default' : 'outline'}
							size="sm"
							onclick={() => (fileType = t)}
						>
							{FILE_TYPE_ICONS[t]} {t.toUpperCase()}
						</Button>
					{/each}
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<Label for="f-notes">Комментарий</Label>
				<Input id="f-notes" bind:value={fileNotes} placeholder="Опционально" />
			</div>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (addOpen = false)}>Отмена</Button>
				<Button type="submit">Добавить</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
