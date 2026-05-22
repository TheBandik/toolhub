<script lang="ts">
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center gap-3">
		<LayoutDashboard class="text-muted-foreground size-6" />
		<h2 class="text-2xl font-semibold tracking-tight">Dashboard</h2>
	</div>
	<p class="text-muted-foreground text-sm">
		Здесь будут виджеты из модулей. Пока — заглушка.
	</p>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each Array(3) as _, i (i)}
			<div
				class="bg-card text-card-foreground flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground"
			>
				Виджет #{i + 1}
			</div>
		{/each}
	</div>
</div>
