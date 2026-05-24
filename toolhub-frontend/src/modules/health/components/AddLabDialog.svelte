<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { healthStore } from '../store.svelte';
	import {
		LAB_PRESETS,
		LAB_TYPE_LABELS,
		type LabType,
		type LabItem,
		type LabResult
	} from '../types';

	let { open = $bindable(), lab = undefined }: { open: boolean; lab?: LabResult } = $props();

	const isEdit = $derived(!!lab);
	const today = () => new Date().toISOString().slice(0, 10);

	let date = $state(today());
	let name = $state('');
	let type = $state<LabType>('blood');
	let clinic = $state('');
	let notes = $state('');
	let items = $state<LabItem[]>([{ name: '', value: '', unit: '', refMin: undefined, refMax: undefined }]);

	function reset() {
		date = today();
		name = '';
		type = 'blood';
		clinic = '';
		notes = '';
		items = [{ name: '', value: '', unit: '' }];
	}

	function applyPreset(key: string) {
		const p = LAB_PRESETS[key];
		name = p.name;
		type = p.type;
		items = p.items.map((i) => ({ ...i, value: '' }));
	}

	function addItem() {
		items.push({ name: '', value: '', unit: '' });
	}

	function removeItem(i: number) {
		items.splice(i, 1);
	}

	$effect(() => {
		if (open) {
			if (lab) {
				date = lab.date;
				name = lab.name;
				type = lab.type;
				clinic = lab.clinic ?? '';
				notes = lab.notes ?? '';
				items = lab.items.map((i) => ({ ...i }));
			} else {
				reset();
			}
		}
	});

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const validItems = items.filter((i) => i.name.trim() && i.value.trim());
		const data = {
			date,
			name: name.trim(),
			type,
			clinic: clinic.trim() || undefined,
			notes: notes.trim() || undefined,
			items: validItems
		};
		if (isEdit && lab) {
			healthStore.updateLab(lab.id, data);
		} else {
			healthStore.addLab(data);
		}
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>{isEdit ? 'Редактировать анализ' : 'Добавить анализ'}</Dialog.Title>
		</Dialog.Header>
		<form onsubmit={submit} class="flex flex-col gap-5">
			<!-- Presets — шаблоны с заранее заполненными показателями -->
			{#if !isEdit}
				<div class="flex flex-col gap-2">
					<Label>Шаблон</Label>
					<div class="flex flex-wrap gap-1.5">
						{#each Object.entries(LAB_PRESETS) as [key, preset] (key)}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onclick={() => applyPreset(key)}
							>
								{preset.name}
							</Button>
						{/each}
					</div>
					<p class="text-muted-foreground text-xs">
						Выбери шаблон — показатели заполнятся автоматически, останется только вписать значения.
					</p>
				</div>
			{/if}

			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-2">
					<Label for="l-date">Дата</Label>
					<Input id="l-date" type="date" bind:value={date} required />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="l-clinic">Лаборатория / клиника</Label>
					<Input id="l-clinic" bind:value={clinic} placeholder="Инвитро, Гемотест…" />
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="l-name">Название анализа</Label>
				<Input id="l-name" bind:value={name} required placeholder="ОАК, Биохимия крови…" />
			</div>

			<div class="flex flex-col gap-2">
				<Label>Тип</Label>
				<div class="flex flex-wrap gap-1.5">
					{#each Object.entries(LAB_TYPE_LABELS) as [val, label] (val)}
						<Button
							type="button"
							variant={type === val ? 'default' : 'outline'}
							size="sm"
							onclick={() => (type = val as LabType)}
						>
							{label}
						</Button>
					{/each}
				</div>
			</div>

			<!-- Items -->
			<div class="flex flex-col gap-2">
				<Label>Показатели</Label>
				<div class="flex flex-col gap-2">
					<!-- Header -->
					<div class="grid grid-cols-[1fr_6rem_5rem_5rem_5rem_2rem] gap-1.5 px-1 text-xs text-muted-foreground">
						<span>Название</span>
						<span>Значение</span>
						<span>Ед.</span>
						<span>Норма от</span>
						<span>Норма до</span>
						<span></span>
					</div>
					{#each items as item, i (i)}
						<div class="grid grid-cols-[1fr_6rem_5rem_5rem_5rem_2rem] items-center gap-1.5">
							<Input bind:value={item.name} placeholder="Гемоглобин" />
							<Input bind:value={item.value} placeholder="14.5" />
							<Input bind:value={item.unit} placeholder="г/дл" />
							<Input type="number" bind:value={item.refMin} placeholder="12" />
							<Input type="number" bind:value={item.refMax} placeholder="17" />
							<button
								type="button"
								onclick={() => removeItem(i)}
								class="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
							>
								<Trash2 class="size-3.5" />
							</button>
						</div>
					{/each}
					<Button type="button" variant="outline" size="sm" onclick={addItem} class="self-start">
						<Plus class="size-3.5" />
						Добавить показатель
					</Button>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="l-notes">Заметки</Label>
				<Input id="l-notes" bind:value={notes} placeholder="Опционально" />
			</div>

			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Отмена</Button>
				<Button type="submit">{isEdit ? 'Сохранить' : 'Добавить'}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
