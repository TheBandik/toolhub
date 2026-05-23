<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	interface Props {
		label: string;
		value: string | number;
		sub?: string;
	}
	let { label, value, sub }: Props = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Description>{label}</Card.Description>
		<Card.Title class="text-3xl tabular-nums">{value}</Card.Title>
		{#if sub}
			<p class="text-muted-foreground text-xs">{sub}</p>
		{/if}
	</Card.Header>
</Card.Root>
