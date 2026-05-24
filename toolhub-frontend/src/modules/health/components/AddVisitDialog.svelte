<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { healthStore } from '../store.svelte';
	import {
		SPECIALTY_LABELS,
		SPECIALTY_ICONS,
		type MedSpecialty,
		type MedVisit
	} from '../types';

	let { open = $bindable(), visit = undefined }: { open: boolean; visit?: MedVisit } = $props();

	const isEdit = $derived(!!visit);
	const today = () => new Date().toISOString().slice(0, 10);

	let date = $state(today());
	let specialty = $state<MedSpecialty>('therapist');
	let doctor = $state('');
	let clinic = $state('');
	let complaint = $state('');
	let diagnosis = $state('');
	let prescription = $state('');
	let cost = $state<number | null>(null);
	let notes = $state('');

	function reset() {
		date = today();
		specialty = 'therapist';
		doctor = '';
		clinic = '';
		complaint = '';
		diagnosis = '';
		prescription = '';
		cost = null;
		notes = '';
	}

	$effect(() => {
		if (open) {
			if (visit) {
				date = visit.date;
				specialty = visit.specialty;
				doctor = visit.doctor ?? '';
				clinic = visit.clinic ?? '';
				complaint = visit.complaint ?? '';
				diagnosis = visit.diagnosis ?? '';
				prescription = visit.prescription ?? '';
				cost = visit.cost ?? null;
				notes = visit.notes ?? '';
			} else {
				reset();
			}
		}
	});

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const data = {
			date,
			specialty,
			doctor: doctor.trim() || undefined,
			clinic: clinic.trim() || undefined,
			complaint: complaint.trim() || undefined,
			diagnosis: diagnosis.trim() || undefined,
			prescription: prescription.trim() || undefined,
			cost: cost != null && cost > 0 ? Number(cost) : undefined,
			notes: notes.trim() || undefined
		};
		if (isEdit && visit) {
			healthStore.updateVisit(visit.id, data);
		} else {
			healthStore.addVisit(data);
		}
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>{isEdit ? 'Редактировать визит' : 'Новый визит'}</Dialog.Title>
		</Dialog.Header>
		<form onsubmit={submit} class="flex flex-col gap-5">
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-2">
					<Label for="v-date">Дата</Label>
					<Input id="v-date" type="date" bind:value={date} required />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="v-cost">Стоимость, ₽</Label>
					<Input id="v-cost" type="number" min="0" bind:value={cost} placeholder="0" />
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Label>Специальность</Label>
				<div class="flex flex-wrap gap-1.5">
					{#each Object.entries(SPECIALTY_LABELS) as [val, label] (val)}
						<Button
							type="button"
							variant={specialty === val ? 'default' : 'outline'}
							size="sm"
							onclick={() => (specialty = val as MedSpecialty)}
						>
							{SPECIALTY_ICONS[val as MedSpecialty]}
							{label}
						</Button>
					{/each}
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-2">
					<Label for="v-doctor">Врач</Label>
					<Input id="v-doctor" bind:value={doctor} placeholder="Фамилия И.О." />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="v-clinic">Клиника</Label>
					<Input id="v-clinic" bind:value={clinic} />
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="v-complaint">Жалоба / причина визита</Label>
				<Input id="v-complaint" bind:value={complaint} />
			</div>

			<div class="flex flex-col gap-2">
				<Label for="v-diagnosis">Диагноз</Label>
				<Input id="v-diagnosis" bind:value={diagnosis} />
			</div>

			<div class="flex flex-col gap-2">
				<Label for="v-prescription">Назначение</Label>
				<Input id="v-prescription" bind:value={prescription} />
			</div>

			<div class="flex flex-col gap-2">
				<Label for="v-notes">Заметки</Label>
				<Input id="v-notes" bind:value={notes} placeholder="Опционально" />
			</div>

			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Отмена</Button>
				<Button type="submit">{isEdit ? 'Сохранить' : 'Добавить'}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
