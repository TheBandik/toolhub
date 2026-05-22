<script lang="ts">
	import { Input } from '$lib/components/ui/input';

	let {
		value = $bindable<number>(),
		id,
		class: className
	}: { value: number; id?: string; class?: string } = $props();

	function format(s: number): string {
		const safe = Math.max(0, Math.floor(s || 0));
		const m = Math.floor(safe / 60);
		const ss = safe % 60;
		return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
	}

	function parseDigits(digits: string): number {
		const d = digits.padStart(4, '0').slice(-4);
		const m = parseInt(d.slice(0, 2), 10) || 0;
		const ss = Math.min(59, parseInt(d.slice(2, 4), 10) || 0);
		return m * 60 + ss;
	}

	let text = $state(format(value));
	let focused = $state(false);

	$effect(() => {
		if (!focused) text = format(value);
	});

	function onInput(e: Event) {
		const el = e.currentTarget as HTMLInputElement;
		const digits = el.value.replace(/\D/g, '').slice(0, 4);
		text = digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
		value = parseDigits(digits);
	}

	function onFocus() {
		focused = true;
	}

	function onBlur() {
		focused = false;
		text = format(value);
	}
</script>

<Input
	{id}
	class={className}
	inputmode="numeric"
	placeholder="мм:сс"
	value={text}
	oninput={onInput}
	onfocus={onFocus}
	onblur={onBlur}
/>
