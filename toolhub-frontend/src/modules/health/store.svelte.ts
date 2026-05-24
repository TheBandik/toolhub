import type {
	MedVisit,
	LabResult,
	TeethMap,
	ToothRecord,
	MedFile
} from './types';

function daysAgo(n: number): string {
	const d = new Date();
	d.setDate(d.getDate() - n);
	return d.toISOString().slice(0, 10);
}

class HealthStore {
	// ── Visits ────────────────────────────────────────────────────────────────
	visits = $state<MedVisit[]>([
		{
			id: '1',
			date: daysAgo(5),
			specialty: 'dentist',
			doctor: 'Иванова А.В.',
			clinic: 'OralProfi',
			complaint: 'Боль в зубе 47',
			diagnosis: 'Лечение каналов зуба 47',
			prescription: 'Полоскание хлоргексидином 3 дня',
			cost: 26400,
			notes: '2 визита, следующий через 2 недели'
		},
		{
			id: '2',
			date: daysAgo(21),
			specialty: 'therapist',
			doctor: 'Петров С.И.',
			clinic: 'Городская поликлиника №3',
			complaint: 'Кашель, температура 37.5',
			diagnosis: 'ОРВИ',
			prescription: 'Арбидол 5 дней, промывание носа',
			cost: 0
		},
		{
			id: '3',
			date: daysAgo(45),
			specialty: 'dentist',
			doctor: 'Иванова А.В.',
			clinic: 'OralProfi',
			complaint: 'Плановый осмотр',
			diagnosis: 'Кариес 35, 36',
			prescription: 'Лечение кариеса',
			cost: 25000
		},
		{
			id: '4',
			date: daysAgo(90),
			specialty: 'cardiologist',
			doctor: 'Соколов М.Д.',
			clinic: 'Медси',
			complaint: 'Плановый осмотр, ЭКГ',
			diagnosis: 'Норма, ВСД',
			prescription: 'Магний Б6 1 мес',
			cost: 3500
		},
		{
			id: '5',
			date: daysAgo(120),
			specialty: 'ophthalmologist',
			doctor: 'Белова Т.Р.',
			clinic: 'Офтальмологический центр',
			complaint: 'Проверка зрения',
			diagnosis: 'OD: -1.5, OS: -1.75',
			prescription: 'Коррекция линз',
			cost: 1800
		},
		{
			id: '6',
			date: daysAgo(200),
			specialty: 'dermatologist',
			doctor: 'Козлова Е.А.',
			clinic: 'Клиника кожи',
			complaint: 'Высыпания на спине',
			diagnosis: 'Акне I ст.',
			prescription: 'Скинорен гель, Зинерит 6 нед.',
			cost: 2200
		}
	]);

	addVisit(v: Omit<MedVisit, 'id'>) {
		this.visits.unshift({ ...v, id: crypto.randomUUID() });
	}

	updateVisit(id: string, v: Omit<MedVisit, 'id'>) {
		const i = this.visits.findIndex((x) => x.id === id);
		if (i >= 0) this.visits[i] = { ...v, id };
	}

	removeVisit(id: string) {
		const i = this.visits.findIndex((x) => x.id === id);
		if (i >= 0) this.visits.splice(i, 1);
	}

	// ── Labs ──────────────────────────────────────────────────────────────────
	labs = $state<LabResult[]>([
		{
			id: '1',
			date: daysAgo(21),
			name: 'Общий анализ крови (ОАК)',
			type: 'blood',
			clinic: 'Инвитро',
			items: [
				{ name: 'Гемоглобин', value: '14.8', unit: 'г/дл', refMin: 12.0, refMax: 17.0 },
				{ name: 'Эритроциты', value: '4.9', unit: '×10¹²/л', refMin: 3.8, refMax: 5.5 },
				{ name: 'Лейкоциты', value: '10.2', unit: '×10⁹/л', refMin: 4.0, refMax: 9.0 },
				{ name: 'Тромбоциты', value: '228', unit: '×10⁹/л', refMin: 150, refMax: 400 },
				{ name: 'Гематокрит', value: '44', unit: '%', refMin: 36, refMax: 52 },
				{ name: 'СОЭ', value: '8', unit: 'мм/ч', refMin: 0, refMax: 20 }
			]
		},
		{
			id: '2',
			date: daysAgo(21),
			name: 'Биохимия крови',
			type: 'biochemistry',
			clinic: 'Инвитро',
			items: [
				{ name: 'Глюкоза', value: '5.1', unit: 'ммоль/л', refMin: 3.9, refMax: 5.5 },
				{ name: 'Холестерин общий', value: '4.8', unit: 'ммоль/л', refMin: 0, refMax: 5.2 },
				{ name: 'АЛТ', value: '28', unit: 'Ед/л', refMin: 0, refMax: 40 },
				{ name: 'АСТ', value: '24', unit: 'Ед/л', refMin: 0, refMax: 40 },
				{ name: 'Билирубин общий', value: '14.2', unit: 'мкмоль/л', refMin: 3.4, refMax: 20.5 },
				{ name: 'Креатинин', value: '88', unit: 'мкмоль/л', refMin: 44, refMax: 115 }
			]
		},
		{
			id: '3',
			date: daysAgo(95),
			name: 'Гормоны щитовидной железы',
			type: 'hormone',
			clinic: 'Гемотест',
			notes: 'Плановая проверка',
			items: [
				{ name: 'ТТГ', value: '3.2', unit: 'мМЕ/л', refMin: 0.4, refMax: 4.0 },
				{ name: 'Т4 свободный', value: '16.4', unit: 'пмоль/л', refMin: 9.0, refMax: 22.0 },
				{ name: 'Т3 свободный', value: '4.1', unit: 'пмоль/л', refMin: 2.6, refMax: 5.7 }
			]
		}
	]);

	addLab(l: Omit<LabResult, 'id'>) {
		this.labs.unshift({ ...l, id: crypto.randomUUID() });
	}

	updateLab(id: string, l: Omit<LabResult, 'id'>) {
		const i = this.labs.findIndex((x) => x.id === id);
		if (i >= 0) this.labs[i] = { ...l, id };
	}

	removeLab(id: string) {
		const i = this.labs.findIndex((x) => x.id === id);
		if (i >= 0) this.labs.splice(i, 1);
	}

	// ── Teeth ─────────────────────────────────────────────────────────────────
	teeth = $state<TeethMap>({
		18: { status: 'removed' },
		17: { status: 'filled' },
		16: { status: 'filled' },
		15: { status: 'caries', note: 'Незначительный' },
		11: { status: 'healthy' },
		21: { status: 'healthy' },
		24: { status: 'caries', note: 'Незначительный' },
		25: { status: 'caries', note: 'Незначительный' },
		26: { status: 'filled' },
		27: { status: 'filled' },
		28: { status: 'caries' },
		48: { status: 'caries' },
		47: { status: 'filled' },
		46: { status: 'filled', note: 'Штифт + пломба' },
		45: { status: 'filled' },
		35: { status: 'filled' },
		36: { status: 'filled' },
		37: { status: 'filled' },
		38: { status: 'caries' }
	});

	setTooth(id: number, record: ToothRecord) {
		this.teeth[id] = record;
	}

	removeTooth(id: number) {
		delete this.teeth[id];
	}

	// ── Files (mock) ──────────────────────────────────────────────────────────
	files = $state<MedFile[]>([
		{
			id: '1',
			name: 'ОАК_Инвитро_результат.pdf',
			date: daysAgo(21),
			fileType: 'pdf',
			sizeKb: 312,
			labId: '1',
			notes: 'Общий анализ крови'
		},
		{
			id: '2',
			name: 'Биохимия_Инвитро.pdf',
			date: daysAgo(21),
			fileType: 'pdf',
			sizeKb: 208,
			labId: '2'
		},
		{
			id: '3',
			name: 'Рентген_зуб47.jpg',
			date: daysAgo(5),
			fileType: 'jpg',
			sizeKb: 1840,
			visitId: '1',
			notes: 'Рентгеновский снимок зуба 47'
		},
		{
			id: '4',
			name: 'ЭКГ_Медси.pdf',
			date: daysAgo(90),
			fileType: 'pdf',
			sizeKb: 450,
			visitId: '4'
		},
		{
			id: '5',
			name: 'Гормоны_щитовидной.pdf',
			date: daysAgo(95),
			fileType: 'pdf',
			sizeKb: 185,
			labId: '3'
		}
	]);

	addFile(f: Omit<MedFile, 'id'>) {
		this.files.unshift({ ...f, id: crypto.randomUUID() });
	}

	removeFile(id: string) {
		const i = this.files.findIndex((x) => x.id === id);
		if (i >= 0) this.files.splice(i, 1);
	}
}

export const healthStore = new HealthStore();
