<script>
	import { compilers_registered } from '$lib/stores'
	import PrimoPage from '$lib/builder/views/editor/Page.svelte'

	const page = {}
	const sections = []
</script>

{#if $compilers_registered}
	<PrimoPage
		page={{
			...page,
			sections: sections
		}}
	/>
{/if}
