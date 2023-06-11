<script lang="ts">
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import alertManager from '$lib/alertManager';
	let slug: String = '';
	let custom: boolean = false;
  let oldUrl: string = '';

	const shortenUrl = async (e: Event) => {
		const formData = new FormData(e.target as HTMLFormElement);
		const data : any = { ...Object.fromEntries(formData.entries()), custom };
    if (data.url === oldUrl && !custom) {
      alertManager.error('URL already shortened');
      return;
    }
		try {
			const res = await fetch('/api/url', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			const json = await res.json();
			if (res.ok) {
				slug = json.slug;
				alertManager.success('URL shortened');
        oldUrl = json.url;
			} else {
				alertManager.error(json.message);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const copyUrl = () => {
		navigator.clipboard.writeText(`${$page.url.host}/${slug}`);
		alertManager.success('URL copied');
	};
</script>

<div class="w-full min-h-screen flex flex-col justify-center items-center gap-4">
	<button on:click={copyUrl} class="active:scale-95 transition text-2xl w-3/4 md:w-1/2 truncate"
		>{$page.url.host}/{slug}</button
	>
	<form class="w-3/4 md:w-1/2 flex flex-col space-y-2" on:submit|preventDefault={shortenUrl}>
		<input
			class="p-2 w-full rounded shadow border"
			name="url"
			placeholder="url"
			required
			type="url"
		/>
		{#if custom}
			<input
				transition:slide
				class="p-2 w-full rounded shadow border"
				name="slug"
				placeholder="custom"
				required
				type="text"
			/>
		{/if}
		<div class="flex flex-col md:flex-row justify-between space-y-2">
			<label class="flex items-center">
				<input bind:checked={custom} class="mr-2 w-6 h-6" type="checkbox" />
				Custom URL
			</label>
			<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
				<button
					type="submit"
					class="rounded shadow border px-2 py-1 transition text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-500 active:scale-95"
					>Short URL</button
				>
				{#if slug !== ''}
					<button
						on:click={copyUrl}
						transition:slide
						type="button"
						class="rounded shadow border px-2 py-1 transition text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-500 active:scale-95"
						>Copy</button
					>
				{/if}
			</div>
		</div>
	</form>
</div>
