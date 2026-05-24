// ─── Specialties ──────────────────────────────────────────────────────────────

export type MedSpecialty =
	| 'therapist'
	| 'cardiologist'
	| 'dentist'
	| 'dermatologist'
	| 'ophthalmologist'
	| 'orthopedist'
	| 'neurologist'
	| 'endocrinologist'
	| 'other';

export const SPECIALTY_LABELS: Record<MedSpecialty, string> = {
	therapist: 'Терапевт',
	cardiologist: 'Кардиолог',
	dentist: 'Стоматолог',
	dermatologist: 'Дерматолог',
	ophthalmologist: 'Офтальмолог',
	orthopedist: 'Ортопед',
	neurologist: 'Невролог',
	endocrinologist: 'Эндокринолог',
	other: 'Другое'
};

export const SPECIALTY_ICONS: Record<MedSpecialty, string> = {
	therapist: '🩺',
	cardiologist: '❤️',
	dentist: '🦷',
	dermatologist: '🧴',
	ophthalmologist: '👁️',
	orthopedist: '🦴',
	neurologist: '🧠',
	endocrinologist: '⚗️',
	other: '🏥'
};

// ─── Visits ───────────────────────────────────────────────────────────────────

export type MedVisit = {
	id: string;
	date: string;
	specialty: MedSpecialty;
	doctor?: string;
	clinic?: string;
	complaint?: string;
	diagnosis?: string;
	prescription?: string;
	cost?: number;
	notes?: string;
};

// ─── Lab Results ──────────────────────────────────────────────────────────────

export type LabType = 'blood' | 'urine' | 'biochemistry' | 'hormone' | 'other';

export const LAB_TYPE_LABELS: Record<LabType, string> = {
	blood: 'ОАК',
	urine: 'Моча',
	biochemistry: 'Биохимия',
	hormone: 'Гормоны',
	other: 'Другое'
};

export type LabItem = {
	name: string;
	value: string;
	unit: string;
	refMin?: number;
	refMax?: number;
};

export type LabResult = {
	id: string;
	date: string;
	name: string;
	type: LabType;
	clinic?: string;
	notes?: string;
	items: LabItem[];
};

export type LabItemStatus = 'normal' | 'high' | 'low' | 'unknown';

export function getLabItemStatus(item: LabItem): LabItemStatus {
	const val = parseFloat(item.value.replace(',', '.'));
	if (isNaN(val)) return 'unknown';
	if (item.refMax != null && val > item.refMax) return 'high';
	if (item.refMin != null && val < item.refMin) return 'low';
	if (item.refMin != null || item.refMax != null) return 'normal';
	return 'unknown';
}

// ─── Lab Presets ─────────────────────────────────────────────────────────────
// Пресет = шаблон анализа с уже заполненными названиями показателей и
// референсными значениями. При добавлении анализа пользователь выбирает
// шаблон — поля заполняются автоматически, остаётся только вписать значения.

export type LabPreset = {
	name: string;
	type: LabType;
	items: Omit<LabItem, 'value'>[];
};

export const LAB_PRESETS: Record<string, LabPreset> = {
	oak: {
		name: 'Общий анализ крови (ОАК)',
		type: 'blood',
		items: [
			{ name: 'Гемоглобин', unit: 'г/дл', refMin: 12.0, refMax: 17.0 },
			{ name: 'Эритроциты', unit: '×10¹²/л', refMin: 3.8, refMax: 5.5 },
			{ name: 'Лейкоциты', unit: '×10⁹/л', refMin: 4.0, refMax: 9.0 },
			{ name: 'Тромбоциты', unit: '×10⁹/л', refMin: 150, refMax: 400 },
			{ name: 'Гематокрит', unit: '%', refMin: 36, refMax: 52 },
			{ name: 'СОЭ', unit: 'мм/ч', refMin: 0, refMax: 20 },
			{ name: 'Нейтрофилы', unit: '%', refMin: 45, refMax: 75 },
			{ name: 'Лимфоциты', unit: '%', refMin: 18, refMax: 40 }
		]
	},
	biochem: {
		name: 'Биохимия крови',
		type: 'biochemistry',
		items: [
			{ name: 'Глюкоза', unit: 'ммоль/л', refMin: 3.9, refMax: 5.5 },
			{ name: 'Холестерин общий', unit: 'ммоль/л', refMin: 0, refMax: 5.2 },
			{ name: 'АЛТ', unit: 'Ед/л', refMin: 0, refMax: 40 },
			{ name: 'АСТ', unit: 'Ед/л', refMin: 0, refMax: 40 },
			{ name: 'Билирубин общий', unit: 'мкмоль/л', refMin: 3.4, refMax: 20.5 },
			{ name: 'Креатинин', unit: 'мкмоль/л', refMin: 44, refMax: 115 },
			{ name: 'Мочевина', unit: 'ммоль/л', refMin: 2.5, refMax: 8.3 },
			{ name: 'Общий белок', unit: 'г/л', refMin: 64, refMax: 83 }
		]
	},
	thyroid: {
		name: 'Гормоны щитовидной железы',
		type: 'hormone',
		items: [
			{ name: 'ТТГ', unit: 'мМЕ/л', refMin: 0.4, refMax: 4.0 },
			{ name: 'Т4 свободный', unit: 'пмоль/л', refMin: 9.0, refMax: 22.0 },
			{ name: 'Т3 свободный', unit: 'пмоль/л', refMin: 2.6, refMax: 5.7 }
		]
	},
	oam: {
		name: 'Общий анализ мочи (ОАМ)',
		type: 'urine',
		items: [
			{ name: 'pH', unit: '', refMin: 5.0, refMax: 7.0 },
			{ name: 'Белок', unit: 'г/л', refMin: 0, refMax: 0.14 },
			{ name: 'Глюкоза', unit: 'ммоль/л', refMin: 0, refMax: 0.8 },
			{ name: 'Лейкоциты', unit: 'в п/зр', refMin: 0, refMax: 5 },
			{ name: 'Эритроциты', unit: 'в п/зр', refMin: 0, refMax: 3 }
		]
	},
	lipids: {
		name: 'Липидный профиль',
		type: 'biochemistry',
		items: [
			{ name: 'Холестерин общий', unit: 'ммоль/л', refMin: 0, refMax: 5.2 },
			{ name: 'ЛПНП', unit: 'ммоль/л', refMin: 0, refMax: 3.4 },
			{ name: 'ЛПВП', unit: 'ммоль/л', refMin: 1.0, refMax: 99 },
			{ name: 'Триглицериды', unit: 'ммоль/л', refMin: 0, refMax: 1.7 },
			{ name: 'Индекс атерогенности', unit: '', refMin: 0, refMax: 3.0 }
		]
	}
};

// ─── Dentistry ────────────────────────────────────────────────────────────────

export type ToothStatus = 'healthy' | 'filled' | 'caries' | 'crown' | 'implant' | 'removed';

export const TOOTH_STATUS_LABELS: Record<ToothStatus, string> = {
	healthy: 'Здоров',
	filled: 'Пломба',
	caries: 'Кариес',
	crown: 'Коронка',
	implant: 'Имплант',
	removed: 'Удалён'
};

export const TOOTH_STATUS_COLORS: Record<ToothStatus, string> = {
	healthy: 'transparent',
	filled: '#86efac', // green-300
	caries: '#fca5a5', // red-300
	crown: '#fcd34d', // yellow-300
	implant: '#67e8f9', // cyan-300
	removed: '#d1d5db' // gray-300
};

export const TOOTH_STATUS_ORDER: ToothStatus[] = [
	'healthy',
	'caries',
	'filled',
	'crown',
	'implant',
	'removed'
];

export type ToothRecord = { status: ToothStatus; note?: string };
export type TeethMap = Record<number, ToothRecord>;

// FDI layout (patient's perspective, mirrored):
// Upper: right→center  |  center→left
export const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
export const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
// Lower: right→center  |  center→left
export const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
export const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

export const ALL_TEETH = [...UPPER_RIGHT, ...UPPER_LEFT, ...LOWER_RIGHT, ...LOWER_LEFT];

// ─── Files (mock) ─────────────────────────────────────────────────────────────

export type MedFileType = 'pdf' | 'jpg' | 'png' | 'docx' | 'other';

export const FILE_TYPE_ICONS: Record<MedFileType, string> = {
	pdf: '📄',
	jpg: '🖼️',
	png: '🖼️',
	docx: '📝',
	other: '📎'
};

export type MedFile = {
	id: string;
	name: string;
	date: string;
	fileType: MedFileType;
	sizeKb: number;
	visitId?: string;
	labId?: string;
	notes?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatFileSize(kb: number): string {
	if (kb < 1024) return `${kb} КБ`;
	return `${(kb / 1024).toFixed(1)} МБ`;
}
