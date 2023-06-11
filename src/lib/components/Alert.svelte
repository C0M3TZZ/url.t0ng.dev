<script lang="ts">
	import alertManager from '$lib/alertManager';
  import { slide } from 'svelte/transition';
	let alerts: any[] = [];
	alertManager.subscribe((value) => {
		alerts = value;
	});
</script>

<div class="fixed bg-white top-0 left-1/2 -translate-x-1/2 flex flex-col justify-center pt-2 z-50 space-y-2">
	{#each alerts as alert}
		<div 
    transition:slide
    class:border-b-green-500={alert.type === 'success'}
    class:border-b-red-500={alert.type === 'error'}
    class:border-b-yellow-500={alert.type === 'warning'}
    class:border-b-blue-500={alert.type === 'info'}
    class="p-4 shadow rounded border space-y-2"
    >{alert.message}</div>
	{/each}
</div>
