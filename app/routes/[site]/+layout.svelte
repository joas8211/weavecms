<script lang="ts">
	import { page } from '$app/state'
	import Primo from '$lib/builder/Primo.svelte'
	import type { Site } from '$lib/common/models/Site'
	import { show } from '$lib/components/Modal.svelte'
	import { Sites } from '$lib/pocketbase/collections'
	import { onMount } from 'svelte'

	let { children } = $props()
	let primo_symbols = []

	let site: Site | undefined | null = $state()
	onMount(async () => {
		try {
			site = await Sites.getOne(page.params.site)
		} catch (error) {
			console.error(error)
			site = null
		}
	})
</script>

{#if site === null}
	Not found
{:else if site}
	<Primo
		data={{}}
		on:publish={() => show({ id: 'DEPLOY', options: { max_width: '700px' } })}
		role={'DEV'}
		{primo_symbols}
		primary_buttons={[
			{
				icon: 'solar:pallete-2-bold',
				label: 'Design',
				onclick: () => show({ id: 'DESIGN', options: { height: '100%' } })
			}
		]}
		secondary_buttons={[
			{
				icon: 'clarity:users-solid',
				label: 'Editors',
				onclick: () => {
					show({
						id: 'COLLABORATION',
						options: { max_width: '500px' }
					})
				}
			}
		]}
	>
		{@render children?.()}
	</Primo>
{/if}
