<script>
	import { onMount } from 'svelte'
	import UI from '../../ui/index.js'

	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	let { field } = $props()

	let selected_page_type = $state(field.options.page_type)

	let field_synced_with_other_page_type = false

	onMount(() => {
		// set initial value
		// TODO: Implement
	})
</script>

<div class="PagesField">
	{#if field_synced_with_other_page_type}
		<div>
			<p>
				Synced with {'{page_type}'}. Is hidden. Will fall back to other field.
			</p>
		</div>
	{:else}
		<div class="container">
			<!-- Entity type -->
			<UI.Select
				on:input={({ detail }) => {
					selected_page_type = detail
					dispatch('input', { ...field.options, page_type: detail })
				}}
				label="Page Type"
				value={selected_page_type}
				fullwidth={true}
			/>
		</div>
	{/if}
</div>

<style>
	.container {
		display: grid;
		gap: 0.5rem;
	}
</style>
